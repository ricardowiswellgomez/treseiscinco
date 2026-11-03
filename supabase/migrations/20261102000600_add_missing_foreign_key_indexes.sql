-- Cover foreign keys that lacked a leading index in the connected schema.
-- These indexes improve joins and prevent slow scans when referenced rows are updated/deleted.
CREATE INDEX IF NOT EXISTS assistant_memories_business_id_idx
  ON public.assistant_memories (business_id);
CREATE INDEX IF NOT EXISTS bank_accounts_created_by_idx
  ON public.bank_accounts (created_by);
CREATE INDEX IF NOT EXISTS bank_movements_bank_account_business_fk_idx
  ON public.bank_movements (bank_account_id, business_id);
CREATE INDEX IF NOT EXISTS bank_movements_created_by_idx
  ON public.bank_movements (created_by);
CREATE INDEX IF NOT EXISTS expenses_bank_account_business_fk_idx
  ON public.expenses (bank_account_id, business_id);
CREATE INDEX IF NOT EXISTS platform_admins_created_by_idx
  ON public.platform_admins (created_by);
CREATE INDEX IF NOT EXISTS platform_subscription_events_actor_user_id_idx
  ON public.platform_subscription_events (actor_user_id);
CREATE INDEX IF NOT EXISTS platform_subscription_events_payment_id_idx
  ON public.platform_subscription_events (payment_id);
CREATE INDEX IF NOT EXISTS platform_subscription_events_subscription_id_idx
  ON public.platform_subscription_events (subscription_id);
CREATE INDEX IF NOT EXISTS platform_subscription_payments_recorded_by_idx
  ON public.platform_subscription_payments (recorded_by);
CREATE INDEX IF NOT EXISTS platform_subscription_payments_subscription_id_idx
  ON public.platform_subscription_payments (subscription_id);
CREATE INDEX IF NOT EXISTS purchase_payments_bank_account_business_fk_idx
  ON public.purchase_payments (bank_account_id, business_id);
CREATE INDEX IF NOT EXISTS sale_items_variant_id_idx
  ON public.sale_items (variant_id);
CREATE INDEX IF NOT EXISTS sale_payments_bank_account_business_fk_idx
  ON public.sale_payments (bank_account_id, business_id);
CREATE INDEX IF NOT EXISTS stock_movements_variant_id_idx
  ON public.stock_movements (variant_id);
