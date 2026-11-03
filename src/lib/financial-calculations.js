export function isSaleIncludedInProfitability(sale) {
  const status = String(sale?.status || "").trim().toLowerCase();
  return !["draft", "canceled", "cancelled", "refunded"].includes(status);
}

function minor(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

/**
 * Net operating revenue for a sale, excluding VAT/consumption tax and discounts.
 * Sale item line totals are tax-inclusive when a tax was applied by the sale RPC.
 */
export function getSaleNetRevenueMinor(sale, items = []) {
  const rows = Array.isArray(items) ? items : [];
  let revenue;
  if (rows.length) {
    revenue = rows.reduce((sum, item) => {
      return sum + minor(item?.line_total_minor) - minor(item?.tax_minor) - minor(item?.discount_minor);
    }, 0);
  } else if (sale?.subtotal_minor != null) {
    revenue = minor(sale.subtotal_minor);
  } else {
    revenue = minor(sale?.total_minor) - minor(sale?.tax_minor);
  }
  revenue -= minor(sale?.discount_minor);
  return Math.max(0, revenue);
}

/** Cost of goods sold from the historical unit-cost snapshot on each sold item. */
export function getSaleCostMinor(items = []) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const quantity = Number(item?.quantity ?? 0);
    const unitCost = Number(item?.unit_cost_minor ?? 0);
    if (!Number.isFinite(quantity) || !Number.isFinite(unitCost)) return sum;
    return sum + Math.round(unitCost * quantity);
  }, 0);
}
