-- Harden every exposed SECURITY DEFINER RPC, not only anonymous storefront calls.
-- Keep trusted application schemas on the path and put pg_temp explicitly last.
-- Functions already using search_path = '' remain unchanged.
DO $migration$
DECLARE
  v_function regprocedure;
BEGIN
  FOR v_function IN
    SELECT p.oid::regprocedure
    FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.prosecdef
      AND (
        pg_catalog.has_function_privilege('anon', p.oid, 'EXECUTE')
        OR pg_catalog.has_function_privilege('authenticated', p.oid, 'EXECUTE')
      )
      AND NOT coalesce(p.proconfig, ARRAY[]::text[]) @> ARRAY['search_path=""']
  LOOP
    EXECUTE pg_catalog.format(
      'ALTER FUNCTION %s SET search_path TO pg_catalog, public, private, auth, extensions, pg_temp',
      v_function
    );
  END LOOP;
END;
$migration$;

-- All anonymous SECURITY DEFINER storefront RPCs use fully-qualified table references.
-- An empty search_path prevents object shadowing if writable schemas are added later.
ALTER FUNCTION public.get_public_catalog_image(uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.get_public_catalog_variant_image(uuid, uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.get_public_coupon_quote(uuid, text, bigint) SET search_path = '';
ALTER FUNCTION public.get_public_store_order_status(text, uuid) SET search_path = '';
ALTER FUNCTION public.resolve_public_catalog_slug(text) SET search_path = '';
