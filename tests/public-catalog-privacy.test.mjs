import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/20261102000300_redact_public_catalog_internal_fields.sql", import.meta.url), "utf8");

test("public catalog JSON does not disclose internal inventory quantities, SKU or tax code", () => {
  for (const field of [
    "'stock_on_hand',page.stock_on_hand",
    "'stock_on_hand',v.stock_on_hand",
    "'sku',v.sku",
    "'tax_code',coalesce(page.metadata"
  ]) assert.ok(!migration.includes(field), "public payload leaks " + field);
  assert.ok(migration.includes("'is_out_of_stock',(v_stock_behavior='show_unavailable' and page.track_inventory and page.stock_on_hand<=0)"));
  assert.ok(!migration.includes("p.sku"), "the public catalog must not search by internal SKU");
  assert.ok(!migration.includes("p.metadata"), "the public catalog must not select private product metadata");
  assert.ok(migration.trimEnd().endsWith("$function$;"), "the SQL function definition must be terminated");
});

test("storefront UI uses availability only as a display boolean and leaves stock validation to checkout", () => {
  const start = app.indexOf("function PublicCatalog({ businessId })");
  const end = app.indexOf("function PublicCatalogSlugRoute", start);
  assert.ok(start >= 0 && end > start);
  const storefront = app.slice(start, end);
  for (const field of ["product.stock_on_hand","variant.stock_on_hand","variant.sku","product.track_inventory"]) {
    assert.ok(!storefront.includes(field), "storefront unexpectedly depends on " + field);
  }
  assert.ok(storefront.includes("product.is_out_of_stock"));
  assert.ok(storefront.includes("public-checkout"));
});
