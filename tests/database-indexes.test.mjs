import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const migration = await readFile(new URL("../supabase/migrations/20261102000600_add_missing_foreign_key_indexes.sql", import.meta.url), "utf8");

test("every uncovered foreign key from the current database audit receives an index", () => {
  const expected = [
    ["assistant_memories", "business_id"],
    ["bank_accounts", "created_by"],
    ["bank_movements", "bank_account_id, business_id"],
    ["bank_movements", "created_by"],
    ["expenses", "bank_account_id, business_id"],
    ["platform_admins", "created_by"],
    ["platform_subscription_events", "actor_user_id"],
    ["platform_subscription_events", "payment_id"],
    ["platform_subscription_events", "subscription_id"],
    ["platform_subscription_payments", "recorded_by"],
    ["platform_subscription_payments", "subscription_id"],
    ["purchase_payments", "bank_account_id, business_id"],
    ["sale_items", "variant_id"],
    ["sale_payments", "bank_account_id, business_id"],
    ["stock_movements", "variant_id"]
  ];
  for (const [table, columns] of expected) {
    const normalized = columns.split(", ").join(", ");
    const index = migration.split("\n").find(line => line.includes("ON public." + table + " (" + normalized + ")"));
    assert.ok(index, "missing covering index for " + table + "(" + columns + ")");
  }
});
