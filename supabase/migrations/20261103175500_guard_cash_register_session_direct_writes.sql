-- Keep legacy direct cash-session writes safe until the client-side rollout is complete.
-- The frontend still creates/closes sessions directly; this trigger enforces the same
-- invariants as the server RPCs and serializes legacy closes against cash-payment inserts.

CREATE OR REPLACE FUNCTION private.guard_cash_register_session_write()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_actor uuid := auth.uid();
  v_currency_code character(3);
  v_close_at timestamptz;
  v_received bigint := 0;
  v_purchases bigint := 0;
  v_expenses bigint := 0;
  v_expected bigint := 0;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF v_actor IS NULL THEN
      RAISE EXCEPTION 'Debes iniciar sesión para abrir una caja.'
        USING ERRCODE = '42501';
    END IF;
    IF NEW.business_id IS NULL OR NEW.opening_cash_minor IS NULL OR NEW.opening_cash_minor < 0 THEN
      RAISE EXCEPTION 'Los datos de apertura de caja no son válidos.'
        USING ERRCODE = 'check_violation';
    END IF;

    SELECT b.currency_code
      INTO v_currency_code
    FROM public.businesses b
    WHERE b.id = NEW.business_id;

    IF v_currency_code IS NULL THEN
      RAISE EXCEPTION 'No encontramos el negocio seleccionado.'
        USING ERRCODE = 'foreign_key_violation';
    END IF;

    -- The signed-in user and database clock are authoritative, never browser values.
    NEW.opened_by := v_actor;
    NEW.currency_code := v_currency_code;
    NEW.status := 'open';
    NEW.closed_by := NULL;
    NEW.closing_cash_minor := NULL;
    NEW.expected_cash_minor := NULL;
    NEW.difference_minor := NULL;
    NEW.close_notes := NULL;
    NEW.closed_at := NULL;
    NEW.opened_at := pg_catalog.clock_timestamp();
    NEW.created_at := NEW.opened_at;
    NEW.updated_at := NEW.opened_at;
    RETURN NEW;
  END IF;

  -- A session is immutable after it closes and cannot be edited while open.
  -- The only permitted UPDATE is the one-way open -> closed transition.
  IF OLD.status <> 'open' OR NEW.status <> 'closed' THEN
    RAISE EXCEPTION 'Una caja abierta solo puede cerrarse una vez y una caja cerrada no puede modificarse.'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.id IS DISTINCT FROM OLD.id
     OR NEW.business_id IS DISTINCT FROM OLD.business_id
     OR NEW.opened_by IS DISTINCT FROM OLD.opened_by
     OR NEW.currency_code IS DISTINCT FROM OLD.currency_code
     OR NEW.opening_cash_minor IS DISTINCT FROM OLD.opening_cash_minor
     OR NEW.opened_at IS DISTINCT FROM OLD.opened_at
     OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'No puedes modificar los datos originales de apertura de una caja.'
      USING ERRCODE = 'check_violation';
  END IF;

  IF NEW.closing_cash_minor IS NULL OR NEW.closing_cash_minor < 0 THEN
    RAISE EXCEPTION 'El efectivo contado al cerrar no puede ser negativo.'
      USING ERRCODE = 'check_violation';
  END IF;
  IF pg_catalog.length(coalesce(NEW.close_notes, '')) > 1000 THEN
    RAISE EXCEPTION 'Las notas de cierre no pueden superar 1.000 caracteres.'
      USING ERRCODE = 'check_violation';
  END IF;

  -- Match the lock used by cash-payment/expense triggers.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(OLD.business_id::text || ':' || OLD.opened_by::text, 0)
  );
  v_close_at := pg_catalog.clock_timestamp();

  SELECT coalesce(sum(sp.amount_minor), 0)
    INTO v_received
  FROM public.sale_payments sp
  WHERE sp.business_id = OLD.business_id
    AND sp.created_by = OLD.opened_by
    AND sp.payment_method = 'Efectivo'
    AND sp.created_at >= OLD.opened_at
    AND sp.created_at <= v_close_at;

  SELECT coalesce(sum(pp.amount_minor), 0)
    INTO v_purchases
  FROM public.purchase_payments pp
  WHERE pp.business_id = OLD.business_id
    AND pp.created_by = OLD.opened_by
    AND pp.payment_method = 'Efectivo'
    AND pp.created_at >= OLD.opened_at
    AND pp.created_at <= v_close_at;

  SELECT coalesce(sum(e.amount_minor), 0)
    INTO v_expenses
  FROM public.expenses e
  WHERE e.business_id = OLD.business_id
    AND e.created_by = OLD.opened_by
    AND e.payment_method = 'Efectivo'
    AND e.created_at >= OLD.opened_at
    AND e.created_at <= v_close_at;

  v_expected := OLD.opening_cash_minor + v_received - v_purchases - v_expenses;

  NEW.closed_by := coalesce(v_actor, NEW.closed_by);
  NEW.closed_at := v_close_at;
  NEW.expected_cash_minor := v_expected;
  NEW.difference_minor := NEW.closing_cash_minor - v_expected;
  NEW.close_notes := NULLIF(pg_catalog.btrim(coalesce(NEW.close_notes, '')), '');
  NEW.updated_at := v_close_at;
  RETURN NEW;
END;
$function$;

REVOKE ALL ON FUNCTION private.guard_cash_register_session_write() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS guard_cash_register_session_write ON public.cash_register_sessions;
CREATE TRIGGER guard_cash_register_session_write
BEFORE INSERT OR UPDATE ON public.cash_register_sessions
FOR EACH ROW
EXECUTE FUNCTION private.guard_cash_register_session_write();
