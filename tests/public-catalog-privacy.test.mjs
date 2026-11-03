import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/20261102000300_redact_public_catalog_internal_fields.sql", import.meta.url), "utf8");

test("public catalog JSON does not disclose internal inventory quantities, SKU or tax code", () => {
  assert.doesNotMatch(migration, /'stock_on_hand'\\s*,\\s*(?:page|v)\\.stock_on_hand/);
  assert.doesNotMatch(migration, /'sku'\\s*,\\s*v\\.sku/);
  assert.doesNotMatch(migration, /'tax_code'\\s*,\\s*coalesce\\(page\\.metadata/);
  assert.match(migration, /'is_out_of_stock',\\(v_stock_behavior='show_unavailable' and page\\.track_inventory and page\\.stock_on_hand<=0\\)/);
});

test("storefront UI uses availability only as a display boolean and leaves stock validation to checkout", () => {
  const start = app.indexOf("function PublicCatalog({ businessId })");
  const end = app.indexOf("function PublicCatalogSlugRoute", start);
  assert.ok(start >= 0 && end > start);
  const storefront = app.slice(start, end);
  assert.doesNotMatch(storefront, /product\\.stock_on_hand|variant\\.stock_on_hand|variant\\.sku|product\\.track_inventory/);
  assert.match(storefront, /product\\.is_out_of_stock/);
  assert.match(storefront, /public-checkout/);
});
