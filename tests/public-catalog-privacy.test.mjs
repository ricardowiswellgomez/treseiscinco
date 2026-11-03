import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const app = await readFile(new URL("../src/App.jsx", import.meta.url), "utf8");
const migration = await readFile(new URL("../supabase/migrations/20261102000300_redact_public_catalog_internal_fields.sql", import.meta.url), "utf8");
const pathMigration = await readFile(new URL("../supabase/migrations/20261102000500_harden_public_rpc_search_paths.sql", import.meta.url), "utf8");

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
  assert.ok(!migration.includes("documentNumber"), "the public catalog must not expose the owner's identity document");
  assert.ok(!migration.includes("ownerName"), "the public catalog must not expose the owner's personal name");
  assert.ok(migration.trimEnd().endsWith("$function$;"), "the SQL function definition must be terminated");
  assert.ok(migration.includes("SET search_path TO ''"), "SECURITY DEFINER catalog function must use an empty search path");
});

test("exposed SECURITY DEFINER RPCs preserve trusted paths and put pg_temp last or use an empty path", () => {
  assert.ok(pathMigration.includes("p.prosecdef"));
  assert.ok(pathMigration.includes("has_function_privilege('anon', p.oid, 'EXECUTE')"));
  assert.ok(pathMigration.includes("has_function_privilege('authenticated', p.oid, 'EXECUTE')"));
  assert.ok(pathMigration.includes("v_path text"));
  assert.ok(pathMigration.includes("cfg.setting LIKE 'search_path=%'"));
  assert.ok(pathMigration.includes("!~ '(^|,)[[:space:]]*pg_temp[[:space:]]*$'"));
  assert.ok(pathMigration.includes("ALTER FUNCTION %s SET search_path TO %s, pg_temp"));
  assert.ok(pathMigration.includes("search_path=" + String.fromCharCode(34, 34)));
  for (const signature of [
    "get_public_catalog_image(uuid, uuid, text)",
    "get_public_catalog_variant_image(uuid, uuid, uuid, text)",
    "get_public_coupon_quote(uuid, text, bigint)",
    "get_public_store_order_status(text, uuid)",
    "resolve_public_catalog_slug(text)"
  ]) assert.ok(pathMigration.includes("ALTER FUNCTION public." + signature + " SET search_path = ''"), "missing empty search_path: " + signature);
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
  assert.ok(!storefront.includes("código…"), "public search must not promise internal SKU lookup");
});
