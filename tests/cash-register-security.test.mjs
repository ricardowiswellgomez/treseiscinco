import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const serverMigration = await readFile(new URL("../supabase/migrations/20261102000100_add_server_cash_register_rpcs.sql", import.meta.url), "utf8");
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
  assert.equal((serverMigration.match(/SET search_path TO ''/g) || []).length, 4);
});

test("cash sessions are audited and direct API writes are removed after rollout", () => {
  assert.match(serverMigration, /CREATE TRIGGER audit_business_changes/);
  assert.match(lockdownMigration, /REVOKE INSERT, UPDATE, DELETE ON TABLE public\.cash_register_sessions FROM authenticated/);
  assert.match(lockdownMigration, /REVOKE INSERT \([\s\S]*?\),\s*UPDATE \([\s\S]*?\) ON TABLE public\.cash_register_sessions FROM authenticated/);
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
