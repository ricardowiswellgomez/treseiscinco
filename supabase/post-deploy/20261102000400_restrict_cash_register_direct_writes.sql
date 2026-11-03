-- Apply only after the new App/Worker release is live and cash open/close
-- have been verified in a test business. Do not put this in the automatic
-- migration chain: it removes the direct-write path used by the old frontend.
--
-- Table-level REVOKE does not remove existing column-level INSERT/UPDATE grants.
-- Revoke both forms so authenticated clients can read sessions but only the
-- SECURITY DEFINER open/close RPCs can create or modify them.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.cash_register_sessions FROM authenticated;
REVOKE INSERT (id, business_id, opened_by, closed_by, currency_code,
  opening_cash_minor, closing_cash_minor, expected_cash_minor,
  difference_minor, close_notes, status, opened_at, closed_at,
  created_at, updated_at),
       UPDATE (id, business_id, opened_by, closed_by, currency_code,
  opening_cash_minor, closing_cash_minor, expected_cash_minor,
  difference_minor, close_notes, status, opened_at, closed_at,
  created_at, updated_at)
ON TABLE public.cash_register_sessions
FROM authenticated;

DROP POLICY IF EXISTS cash_register_sessions_insert_by_permission ON public.cash_register_sessions;
DROP POLICY IF EXISTS cash_register_sessions_update_by_permission ON public.cash_register_sessions;
