-- Keep the original unique open-session index and remove the duplicate introduced by cash hardening.
-- Both indexes had identical keys and the same partial predicate.
DROP INDEX IF EXISTS public.cash_register_sessions_one_open_per_user_idx;
