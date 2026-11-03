-- All anonymous SECURITY DEFINER storefront RPCs use fully-qualified table references.
-- An empty search_path prevents object shadowing if writable schemas are added later.
ALTER FUNCTION public.get_public_catalog_image(uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.get_public_catalog_variant_image(uuid, uuid, uuid, text) SET search_path = '';
ALTER FUNCTION public.get_public_coupon_quote(uuid, text, bigint) SET search_path = '';
ALTER FUNCTION public.get_public_store_order_status(text, uuid) SET search_path = '';
ALTER FUNCTION public.resolve_public_catalog_slug(text) SET search_path = '';
