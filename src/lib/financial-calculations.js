export function isSaleIncludedInProfitability(sale) {
  const status = String(sale?.status || "").trim().toLowerCase();
  return !["draft", "canceled", "cancelled", "refunded"].includes(status);
}

function minor(value) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
}

/**
 * Distribute a sale-level discount over its net item revenue proportionally.
 * Integer minor units are allocated by largest remainder so the item totals
 * add up exactly to the sale's net revenue without creating negative lines.
 */
export function getSaleNetItemRevenueRows(sale, items = []) {
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) return [];

  const baseRevenue = rows.map((item) => Math.max(
    0,
    minor(item?.line_total_minor) - minor(item?.tax_minor) - minor(item?.discount_minor)
  ));
  const totalBeforeSaleDiscount = baseRevenue.reduce((sum, value) => sum + value, 0);
  const saleDiscount = Math.min(totalBeforeSaleDiscount, Math.max(0, minor(sale?.discount_minor)));
  const allocations = baseRevenue.map((value) =>
    totalBeforeSaleDiscount > 0 ? Math.floor(saleDiscount * value / totalBeforeSaleDiscount) : 0
  );
  let remainder = saleDiscount - allocations.reduce((sum, value) => sum + value, 0);

  const remainders = baseRevenue.map((value, index) => ({
    index,
    fraction: totalBeforeSaleDiscount > 0
      ? (saleDiscount * value / totalBeforeSaleDiscount) - allocations[index]
      : 0
  })).sort((left, right) => right.fraction - left.fraction || left.index - right.index);

  for (const candidate of remainders) {
    if (remainder <= 0) break;
    if (allocations[candidate.index] < baseRevenue[candidate.index]) {
      allocations[candidate.index] += 1;
      remainder -= 1;
    }
  }

  return rows.map((item, index) => ({
    item,
    revenue_minor: Math.max(0, baseRevenue[index] - allocations[index])
  }));
}

/**
 * Net operating revenue for a sale, excluding VAT/consumption tax and discounts.
 * Sale item line totals are tax-inclusive when a tax was applied by the sale RPC.
 */
export function getSaleNetRevenueMinor(sale, items = []) {
  const rows = Array.isArray(items) ? items : [];
  let revenue;
  if (rows.length) {
    return getSaleNetItemRevenueRows(sale, rows)
      .reduce((sum, row) => sum + row.revenue_minor, 0);
  }
  if (sale?.subtotal_minor != null) {
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
