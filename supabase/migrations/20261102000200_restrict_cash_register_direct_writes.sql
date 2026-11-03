-- Once the application uses the server-side cash register RPCs,
-- prevent direct mutations of cash sessions through the Data API.
REVOKE INSERT, UPDATE, DELETE ON public.cash_register_sessions FROM authenticated;

DROP POLICY IF EXISTS cash_register_sessions_insert_by_permission ON public.cash_register_sessions;
DROP POLICY IF EXISTS cash_register_sessions_update_by_permission ON public.cash_register_sessions;
