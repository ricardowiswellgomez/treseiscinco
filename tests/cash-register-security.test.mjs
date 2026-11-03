import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const serverMigration = await readFile(new URL("../supabase/migrations/20261103173636_add_server_cash_register_rpcs.sql", import.meta.url), "utf8");
const lockdownMigration = await readFile(new URL("../supabase/post-deploy/20261102000400_restrict_cash_register_direct_writes.sql", import.meta.url), "utf8");

test("cash opening and closing use server-side RPCs, not direct table writes", () => {
  const start = app.indexOf("async function openCashRegister(event)");
  const end = app.indexOf("async function loadSalesModuleData()", start);
  assert.ok(start >= 0 && end > start);
  const cashModule = app.slice(start, end);
  assert.match(cashModule, /rpc\("open_cash_register_session"/);
  assert.match(cashModule, /rpc\("close_cash_register_session"/);
  assert.doesNotMatch(cashModule, /from\("cash_register_sessions"\)\s*\n\s*\.insert/);
  assert.doesNotMatch(cashModule, /from\("cash_register_sessions"\)\s*\n\s*\.update/);
});

test("server close calculation includes cash sales, supplier payments and expenses", () => {
  assert.match(serverMigration, /sale_payments/);
  assert.match(serverMigration, /purchase_payments/);
  assert.match(serverMigration, /public\.expenses/);
  assert.match(serverMigration, /v_session\.opening_cash_minor \+ v_received - v_purchases - v_expenses/);
  assert.match(serverMigration, /FOR UPDATE/);
  assert.match(serverMigration, /private\.can_access_business\(p_business_id, 'sales_manage'\)/);
  assert.ok(serverMigration.includes("sale_payments_cash_session_idx"));
  assert.ok(serverMigration.includes("purchase_payments_cash_session_idx"));
  assert.ok(serverMigration.includes("expenses_cash_session_idx"));
  assert.ok(serverMigration.includes("cash_register_sessions_opened_by_idx"));
  assert.ok(serverMigration.includes("cash_register_sessions_closed_by_idx"));
  assert.match(serverMigration, /CREATE UNIQUE INDEX IF NOT EXISTS cash_register_sessions_one_open_per_user_idx[\s\S]*?ON public\.cash_register_sessions \(business_id, opened_by\)[\s\S]*?WHERE status = 'open'/);
  assert.match(serverMigration, /sp\.created_at >= v_session\.opened_at/);
  assert.match(serverMigration, /pp\.created_at >= v_session\.opened_at/);
  assert.doesNotMatch(serverMigration, /sp\.paid_at >= v_session\.opened_at/);
  assert.doesNotMatch(serverMigration, /pp\.paid_at >= v_session\.opened_at/);
  assert.match(serverMigration, /ON public\.sale_payments \(business_id, created_by, created_at\)/);
  assert.match(serverMigration, /ON public\.purchase_payments \(business_id, created_by, created_at\)/);
  assert.match(serverMigration, /ALTER TABLE public\.expenses[\s\S]*ALTER COLUMN created_by SET DEFAULT auth\.uid\(\)/);
  assert.match(serverMigration, /CREATE OR REPLACE FUNCTION private\.set_expense_created_by\(\)/);
  assert.match(serverMigration, /BEFORE INSERT OR UPDATE OF created_by ON public\.expenses/);
  assert.match(serverMigration, /CREATE OR REPLACE FUNCTION private\.lock_cash_register_payment\(\)/);
  assert.match(serverMigration, /BEFORE INSERT ON public\.sale_payments[\s\S]*?private\.lock_cash_register_payment/);
  assert.match(serverMigration, /BEFORE INSERT ON public\.purchase_payments[\s\S]*?private\.lock_cash_register_payment/);
  assert.match(serverMigration, /pg_advisory_xact_lock\([\s\S]*?hashtextextended\(NEW\.business_id::text \|\| ':' \|\| NEW\.created_by::text/);
  assert.match(serverMigration, /v_close_at := pg_catalog\.clock_timestamp\(\)/);
  assert.match(serverMigration, /sp\.created_at <= v_close_at/);
  assert.match(serverMigration, /pp\.created_at <= v_close_at/);
  assert.match(serverMigration, /e\.created_at <= v_close_at/);
  assert.match(serverMigration, /NEW\.created_at := pg_catalog\.clock_timestamp\(\)/);
  assert.match(serverMigration, /v_opened_at := pg_catalog\.clock_timestamp\(\)/);
  assert.match(serverMigration, /hashtextextended\(p_business_id::text \|\| ':' \|\| v_actor::text, 0\)/);
  assert.match(serverMigration, /hashtextextended\(p_business_id::text \|\| ':' \|\| v_session_owner::text, 0\)/);
  assert.match(serverMigration, /created_by = \(select auth\.uid\(\)\)[\s\S]*private\.can_access_business\(business_id, 'expenses_manage'\)/);
  assert.match(serverMigration, /cash_register_sessions_insert_by_permission[\s\S]*opened_by = \(select auth\.uid\(\)\)/);
  assert.match(serverMigration, /cash_register_sessions_update_by_permission[\s\S]*opened_by = \(select auth\.uid\(\)\)/);
  assert.match(serverMigration, /GRANT INSERT \(bank_account_id\) ON TABLE public\.expenses TO authenticated/);
  assert.match(serverMigration, /bank_account_id IS NULL[\s\S]*payment_method <> 'Efectivo'[\s\S]*private\.can_manage_members\(business_id\)/);
  assert.equal((serverMigration.match(/SET search_path TO ''/g) || []).length, 4);
});

test("cash payments and expenses require the actor's open session under the same close lock", () => {
  const paymentStart = serverMigration.indexOf("CREATE OR REPLACE FUNCTION private.lock_cash_register_payment()");
  const paymentEnd = serverMigration.indexOf("$function$;", paymentStart);
  const paymentGuard = serverMigration.slice(paymentStart, paymentEnd);
  assert.ok(paymentStart >= 0 && paymentEnd > paymentStart);
  assert.match(paymentGuard, /pg_advisory_xact_lock/);
  assert.match(paymentGuard, /NEW\.created_by := auth\.uid\(\)/);
  assert.ok(paymentGuard.indexOf("NEW.created_by := auth.uid()") < paymentGuard.indexOf("pg_advisory_xact_lock"), "the authenticated actor must be fixed before deriving the lock key");
  assert.match(paymentGuard, /FROM public\.cash_register_sessions/);
  assert.match(paymentGuard, /s\.opened_by = v_actor/);
  assert.match(paymentGuard, /s\.status = 'open'/);
  assert.match(paymentGuard, /Abre una caja antes de registrar un pago en efectivo/);

  const expenseStart = serverMigration.indexOf("CREATE OR REPLACE FUNCTION private.set_expense_created_by()");
  const expenseEnd = serverMigration.indexOf("$function$;", expenseStart);
  const expenseGuard = serverMigration.slice(expenseStart, expenseEnd);
  assert.ok(expenseStart >= 0 && expenseEnd > expenseStart);
  assert.match(expenseGuard, /pg_advisory_xact_lock/);
  assert.match(expenseGuard, /FROM public\.cash_register_sessions/);
  assert.match(expenseGuard, /s\.opened_by = NEW\.created_by/);
  assert.match(expenseGuard, /s\.status = 'open'/);
  assert.match(expenseGuard, /Abre una caja antes de registrar un gasto en efectivo/);
});

test("cash sessions are audited and direct API writes are removed after rollout", () => {
  assert.match(serverMigration, /CREATE TRIGGER audit_business_changes/);
  assert.ok(lockdownMigration.includes("REVOKE INSERT (id, business_id, opened_by, closed_by, currency_code,"));
  assert.ok(lockdownMigration.includes("UPDATE (id, business_id, opened_by, closed_by, currency_code,"));
  assert.ok(lockdownMigration.includes("ON TABLE public.cash_register_sessions\nFROM authenticated;"));
  assert.match(lockdownMigration, /DROP POLICY IF EXISTS cash_register_sessions_insert_by_permission/);
  assert.match(lockdownMigration, /DROP POLICY IF EXISTS cash_register_sessions_update_by_permission/);
});

test("the browser displays server-calculated expected cash rather than deriving it locally", () => {
  const start = app.indexOf("async function closeCashRegister(event)");
  const end = app.indexOf("async function loadSalesModuleData()", start);
  const closeFunction = app.slice(start, end);
  assert.match(closeFunction, /data\.expected_cash_minor/);
  assert.match(closeFunction, /data\.cash_paid_purchases_minor/);
  assert.doesNotMatch(closeFunction, /Promise\.all\(/);
  assert.doesNotMatch(closeFunction, /reduce\(\(sum, row\) => sum \+ Number\(row\.amount_minor/);
});
