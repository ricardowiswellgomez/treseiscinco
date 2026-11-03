import test from "node:test";
import assert from "node:assert/strict";
import {
  getSaleCostMinor,
  getSaleNetRevenueMinor,
  isSaleIncludedInProfitability
} from "../src/lib/financial-calculations.js";

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
