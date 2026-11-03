import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const serverMigration = await readFile(new URL("../supabase/migrations/20261102000100_add_server_cash_register_rpcs.sql", import.meta.url), "utf8");
const lockdownMigration = await readFile(new URL("../supabase/migrations/20261102000200_restrict_cash_register_direct_writes.sql", import.meta.url), "utf8");

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
});

test("cash sessions are audited and direct API writes are removed after rollout", () => {
  assert.match(serverMigration, /CREATE TRIGGER audit_business_changes/);
  assert.match(lockdownMigration, /REVOKE INSERT, UPDATE, DELETE ON public\.cash_register_sessions FROM authenticated/);
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
