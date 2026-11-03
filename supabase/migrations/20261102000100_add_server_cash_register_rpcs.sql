-- Add trusted server-side cash register operations.
-- Supporting indexes for one-user cash sessions and cash-only close aggregation.
CREATE INDEX IF NOT EXISTS cash_register_sessions_opened_by_idx
  ON public.cash_register_sessions (opened_by);
CREATE INDEX IF NOT EXISTS cash_register_sessions_closed_by_idx
  ON public.cash_register_sessions (closed_by);
CREATE INDEX IF NOT EXISTS sale_payments_cash_session_idx
  ON public.sale_payments (business_id, created_by, paid_at)
  WHERE payment_method = 'Efectivo';
CREATE INDEX IF NOT EXISTS purchase_payments_cash_session_idx
  ON public.purchase_payments (business_id, created_by, paid_at)
  WHERE payment_method = 'Efectivo';
CREATE INDEX IF NOT EXISTS expenses_cash_session_idx
  ON public.expenses (business_id, created_by, created_at)
  WHERE payment_method = 'Efectivo';

-- Direct INSERT/UPDATE grants are revoked in a follow-up migration after the
-- application has moved to these RPCs.

CREATE OR REPLACE FUNCTION public.open_cash_register_session(
  p_business_id uuid,
  p_opening_cash_minor bigint DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO pg_catalog, public, private
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_currency_code character(3);
  v_session public.cash_register_sessions%ROWTYPE;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para abrir una caja.';
  END IF;

  IF p_opening_cash_minor IS NULL OR p_opening_cash_minor < 0 THEN
    RAISE EXCEPTION 'El efectivo inicial no puede ser negativo.';
  END IF;

  IF NOT private.can_access_business(p_business_id, 'sales_manage') THEN
    RAISE EXCEPTION 'No tienes permiso para abrir la caja de este negocio.';
  END IF;

  SELECT b.currency_code
  INTO v_currency_code
  FROM public.businesses b
  WHERE b.id = p_business_id;

  IF v_currency_code IS NULL THEN
    RAISE EXCEPTION 'No encontramos el negocio seleccionado.';
  END IF;

  -- Serialize concurrent attempts by the same user and business.
  PERFORM pg_advisory_xact_lock(
    hashtextextended(p_business_id::text || ':' || v_actor::text, 0)
  );

  IF EXISTS (
    SELECT 1
    FROM public.cash_register_sessions s
    WHERE s.business_id = p_business_id
      AND s.opened_by = v_actor
      AND s.status = 'open'
  ) THEN
    RAISE EXCEPTION 'Ya tienes una caja abierta para este negocio.';
  END IF;

  INSERT INTO public.cash_register_sessions (
    business_id,
    opened_by,
    currency_code,
    opening_cash_minor,
    status,
    opened_at,
    created_at,
    updated_at
  )
  VALUES (
    p_business_id,
    v_actor,
    v_currency_code,
    p_opening_cash_minor,
    'open',
    now(),
    now(),
    now()
  )
  RETURNING * INTO v_session;

  RETURN jsonb_build_object('session', to_jsonb(v_session));
END;
$function$;

CREATE OR REPLACE FUNCTION public.close_cash_register_session(
  p_business_id uuid,
  p_session_id uuid,
  p_closing_cash_minor bigint,
  p_close_notes text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO pg_catalog, public, private
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_session public.cash_register_sessions%ROWTYPE;
  v_received bigint := 0;
  v_purchases bigint := 0;
  v_expenses bigint := 0;
  v_expected bigint := 0;
  v_sale_count bigint := 0;
  v_purchase_count bigint := 0;
  v_expense_count bigint := 0;
BEGIN
  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión para cerrar una caja.';
  END IF;

  IF p_closing_cash_minor IS NULL OR p_closing_cash_minor < 0 THEN
    RAISE EXCEPTION 'El efectivo contado no puede ser negativo.';
  END IF;

  IF length(coalesce(p_close_notes, '')) > 1000 THEN
    RAISE EXCEPTION 'Las notas de cierre no pueden superar 1.000 caracteres.';
  END IF;

  IF NOT private.can_access_business(p_business_id, 'sales_manage') THEN
    RAISE EXCEPTION 'No tienes permiso para cerrar cajas de este negocio.';
  END IF;

  SELECT s.*
  INTO v_session
  FROM public.cash_register_sessions s
  WHERE s.id = p_session_id
    AND s.business_id = p_business_id
    AND s.status = 'open'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'La caja ya está cerrada o no pertenece a este negocio.';
  END IF;

  IF v_session.opened_by IS DISTINCT FROM v_actor
     AND NOT private.can_manage_members(p_business_id) THEN
    RAISE EXCEPTION 'Solo quien abrió la caja o un administrador puede cerrarla.';
  END IF;

  SELECT coalesce(sum(sp.amount_minor), 0), count(*)
  INTO v_received, v_sale_count
  FROM public.sale_payments sp
  WHERE sp.business_id = p_business_id
    AND sp.created_by = v_session.opened_by
    AND sp.payment_method = 'Efectivo'
    AND sp.paid_at >= v_session.opened_at
    AND sp.paid_at <= now();

  SELECT coalesce(sum(pp.amount_minor), 0), count(*)
  INTO v_purchases, v_purchase_count
  FROM public.purchase_payments pp
  WHERE pp.business_id = p_business_id
    AND pp.created_by = v_session.opened_by
    AND pp.payment_method = 'Efectivo'
    AND pp.paid_at >= v_session.opened_at
    AND pp.paid_at <= now();

  SELECT coalesce(sum(e.amount_minor), 0), count(*)
  INTO v_expenses, v_expense_count
  FROM public.expenses e
  WHERE e.business_id = p_business_id
    AND e.created_by = v_session.opened_by
    AND e.payment_method = 'Efectivo'
    AND e.created_at >= v_session.opened_at
    AND e.created_at <= now();

  v_expected := v_session.opening_cash_minor + v_received - v_purchases - v_expenses;

  UPDATE public.cash_register_sessions
  SET
    closed_by = v_actor,
    closed_at = now(),
    status = 'closed',
    closing_cash_minor = p_closing_cash_minor,
    expected_cash_minor = v_expected,
    difference_minor = p_closing_cash_minor - v_expected,
    close_notes = nullif(btrim(coalesce(p_close_notes, '')), ''),
    updated_at = now()
  WHERE id = v_session.id
    AND business_id = p_business_id
    AND status = 'open'
  RETURNING * INTO v_session;

  RETURN jsonb_build_object(
    'session', to_jsonb(v_session),
    'cash_received_minor', v_received,
    'cash_paid_purchases_minor', v_purchases,
    'cash_paid_expenses_minor', v_expenses,
    'expected_cash_minor', v_expected,
    'difference_minor', p_closing_cash_minor - v_expected,
    'cash_received_count', v_sale_count,
    'cash_purchase_count', v_purchase_count,
    'cash_expense_count', v_expense_count
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.open_cash_register_session(uuid, bigint) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.close_cash_register_session(uuid, uuid, bigint, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.open_cash_register_session(uuid, bigint) TO authenticated;
GRANT EXECUTE ON FUNCTION public.close_cash_register_session(uuid, uuid, bigint, text) TO authenticated;

DROP TRIGGER IF EXISTS audit_business_changes ON public.cash_register_sessions;
CREATE TRIGGER audit_business_changes
AFTER INSERT OR UPDATE OR DELETE ON public.cash_register_sessions
FOR EACH ROW EXECUTE FUNCTION private.log_business_audit_event();
