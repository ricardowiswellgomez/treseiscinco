-- Apply only after the new App/Worker release is live and cash open/close
-- have been verified in a test business. Do not put this in the automatic
-- migration chain: it removes the direct-write path used by the old frontend.
REVOKE INSERT, UPDATE, DELETE ON public.cash_register_sessions FROM authenticated;
DROP POLICY IF EXISTS cash_register_sessions_insert_by_permission ON public.cash_register_sessions;
DROP POLICY IF EXISTS cash_register_sessions_update_by_permission ON public.cash_register_sessions;
