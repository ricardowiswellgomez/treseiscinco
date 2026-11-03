import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  getSaleCostMinor,
  getSaleNetItemRevenueRows,
  getSaleNetRevenueMinor,
  isSaleIncludedInProfitability
} from "../src/lib/financial-calculations.js";

const appSource = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");

test("profitability loads tax and discount columns from both sales and sale items", () => {
  assert.ok(appSource.includes('from("sales").select("id,business_id,status,currency_code,subtotal_minor,discount_minor,tax_minor,total_minor,amount_paid_minor,sold_at,created_at")'));
  assert.ok(appSource.includes('.select("id,sale_id,product_id,item_name,quantity,unit_cost_minor,discount_minor,tax_minor,line_total_minor")'));
});

test("profitability excludes drafts, cancellations and refunds", () => {
  for (const status of ["draft", "canceled", "cancelled", "refunded", "CANCELED"]) {
    assert.equal(isSaleIncludedInProfitability({ status }), false, status);
  }
  for (const status of ["paid", "partially_paid", "pending"]) {
    assert.equal(isSaleIncludedInProfitability({ status }), true, status);
  }
});

test("net revenue excludes VAT and item discounts from tax-inclusive line totals", () => {
  const sale = { status: "paid", discount_minor: 0 };
  const items = [{ line_total_minor: 11900, tax_minor: 1900, discount_minor: 500 }];
  assert.equal(getSaleNetRevenueMinor(sale, items), 9500);
});

test("sale-level discounts are also excluded from net revenue", () => {
  const sale = { status: "paid", discount_minor: 1000 };
  const items = [{ line_total_minor: 11900, tax_minor: 1900, discount_minor: 500 }];
  assert.equal(getSaleNetRevenueMinor(sale, items), 8500);
});

test("sale-level discounts are allocated proportionally to item rows with exact minor-unit totals", () => {
  const sale = { status: "paid", discount_minor: 1000 };
  const items = [
    { id: "a", item_name: "A", line_total_minor: 11900, tax_minor: 1900, discount_minor: 0 },
    { id: "b", item_name: "B", line_total_minor: 5950, tax_minor: 950, discount_minor: 0 }
  ];
  const rows = getSaleNetItemRevenueRows(sale, items);
  assert.deepEqual(rows.map((row) => row.revenue_minor), [9333, 4667]);
  assert.equal(rows.reduce((sum, row) => sum + row.revenue_minor, 0), getSaleNetRevenueMinor(sale, items));
});

test("large discount allocations across many small lines never exceed the line base", () => {
  const items = Array.from({ length: 100 }, (_, index) => ({
    id: String(index), line_total_minor: 1, tax_minor: 0, discount_minor: 0
  }));
  const rows = getSaleNetItemRevenueRows({ discount_minor: 99 }, items);
  assert.equal(rows.reduce((sum, row) => sum + row.revenue_minor, 0), 1);
  assert.ok(rows.every((row) => row.revenue_minor >= 0 && row.revenue_minor <= 1));
});

test("the Rentabilidad cards and product breakdown use net item revenue", () => {
  assert.ok(appSource.includes("getSaleNetItemRevenueRows(sale, profitabilityItemsBySale.get(sale.id) || [])"));
  assert.ok(appSource.includes("const profitLineRevenue = profitNetItemRows.reduce"));
  assert.ok(appSource.includes("groups[name].revenue += Number(item.net_revenue_minor || 0)"));
  assert.doesNotMatch(appSource, /const profitLineRevenue = periodSaleItems\.reduce/);
  assert.doesNotMatch(appSource, /groups\[name\]\.revenue \+= Number\(item\.line_total_minor/);
  assert.ok(appSource.includes("Object.values(profitNetItemRows.reduce((groups, item) => {")));
});

test("header fallback uses subtotal before tax rather than gross total", () => {
  assert.equal(getSaleNetRevenueMinor({
    status: "paid",
    subtotal_minor: 10000,
    tax_minor: 1900,
    total_minor: 11900,
    discount_minor: 0
  }), 10000);
});

test("legacy fallback removes tax when subtotal is unavailable", () => {
  assert.equal(getSaleNetRevenueMinor({
    status: "paid",
    total_minor: 11900,
    tax_minor: 1900
  }), 10000);
});

test("cost of goods sold uses the historical unit cost and quantity", () => {
  assert.equal(getSaleCostMinor([
    { unit_cost_minor: 2500, quantity: 2 },
    { unit_cost_minor: 1199, quantity: 3 }
  ]), 8597);
});

test("invalid cost values cannot contaminate profitability totals", () => {
  assert.equal(getSaleCostMinor([
    { unit_cost_minor: 2500, quantity: 2 },
    { unit_cost_minor: "invalid", quantity: 3 }
  ]), 5000);
});
