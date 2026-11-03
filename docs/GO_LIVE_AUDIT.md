# Auditoría de salida a producción — Treseiscinco

**Última revisión:** 3 de noviembre de 2026  
**Proyecto:** `treseiscinco.com` · Cloudflare Worker `treseiscinco` · Supabase `maogebecfottfvlrjbho`  
**PR de endurecimiento:** [#80 — Hardening financiero: caja segura y rentabilidad neta](https://github.com/ricardowiswellgomez/treseiscinco/pull/80)

## Decisión ejecutiva

**NO AUTORIZAR TODAVÍA la fusión ni la publicación del PR #80 en producción.** El código del PR pasó CI en el commit actual, y ya quedó desplegado el conjunto gratuito de reglas administradas de Cloudflare. Sin embargo, todavía no se ha demostrado que la cadena de migraciones pueda reconstruirse de forma reproducible; no se han probado los cambios de caja en una base aislada; y faltan ajustes de seguridad de autenticación y MFA que solo puede completar una persona con acceso a los paneles de las cuentas.

No se aplicaron las migraciones del PR a producción ni se revocaron escrituras de caja. La rama `main` sigue intacta.

## Estado confirmado

### Código y CI

- PR #80 permanece abierto y en borrador.
- HEAD probado: `62b715ca12147d1cfd2c1cc941b3f4182a0cc37a`.
- GitHub Actions, ejecución **#482**, terminó en `success`: auditoría de dependencias de alta severidad, sintaxis del Worker, pruebas, build web, verificación de la ruta APK, APK instalable, icono de marca y dry-run de Wrangler.
- El artefacto `treseiscinco-apk` se generó correctamente (4.281.536 bytes; SHA-256 `320cf31b6897fb01c1d9f5e52f0ac5d85e38bb87018331d6489c8fd4c2b0c02c`). Es un artefacto de prueba; no se publicó como APK de producción.
- El despliegue del Worker y la publicación del APK se omitieron correctamente porque el evento fue un pull request.
- `main` permanece en `a4c67b1d3f48b1eff59bdea729112f843bc7e459`.

### Supabase — base de datos

- El proyecto está en estado `ACTIVE_HEALTHY`, PostgreSQL 17.
- Historial remoto: **94 migraciones**. La más reciente es `20261030071434 assistant_memories`.
- Rama revisada: **52 archivos SQL** en `supabase/migrations`. Solo se encontraron 43 nombres que coinciden al normalizarlos y retirar los prefijos de fecha; además hay nombres repetidos. Esto no demuestra equivalencia de SQL ni permite reparar el historial con seguridad.
- **No ejecutar `supabase db push`, ni insertar/eliminar filas de `supabase_migrations.schema_migrations` manualmente.** No se debe marcar como aplicada una migración sin demostrar que su contenido ya está reflejado en el esquema.
- El PR incorpora cuatro migraciones nuevas:
  - `20261102000100_add_server_cash_register_rpcs.sql`
  - `20261102000300_redact_public_catalog_internal_fields.sql`
  - `20261102000500_harden_public_rpc_search_paths.sql`
  - `20261102000600_add_missing_foreign_key_indexes.sql`
- También existe el SQL posdespliegue `supabase/post-deploy/20261102000400_restrict_cash_register_direct_writes.sql`. No debe ejecutarse hasta que el nuevo frontend/Worker esté activo y la apertura/cierre de caja haya sido comprobada.
- El asesor de rendimiento informa 17 claves foráneas sin índice y dos políticas RLS que reevaluaban `auth.uid()` por fila. Las migraciones 001 y 006 del PR contienen las correcciones; siguen pendientes de aplicar y volver a auditar.
- Cuatro tablas de métricas de plataforma tienen RLS habilitado sin políticas. La consulta de privilegios confirmó que `anon` y `authenticated` no tienen permisos directos sobre ellas. El aviso es informativo y no se deben crear políticas de lectura abiertas para silenciarlo.
- El asesor reporta 6 RPC `SECURITY DEFINER` ejecutables por `anon` y 41 por `authenticated`. No revocar en bloque: incluye catálogo público, imágenes, cupones, estado de pedidos y operaciones autenticadas del negocio. Cada RPC debe seguir revisándose individualmente por control de negocio, pertenencia, propiedad y alcance de datos.
- La protección de contraseñas filtradas de Supabase Auth está **desactivada** (aviso WARN confirmado).
- La protección CAPTCHA de Auth todavía no está habilitada en la configuración del proyecto. El Worker ya contiene el widget Turnstile y la ruta de registro protegida, pero el token no sustituye la verificación nativa de Supabase mientras el proveedor y su secreto no estén configurados.

### Cloudflare — zona y Worker

- La zona `treseiscinco.com` está activa; los dominios raíz y `www` están vinculados al Worker `treseiscinco`.
- HTTPS forzado está activo; versión mínima TLS 1.2 y TLS 1.3 está habilitado.
- HSTS está activo en la zona. La política de zona tiene `max_age=15552000`, `include_subdomains=false`; el Worker devuelve además `Strict-Transport-Security: max-age=31536000`.
- El ajuste antiguo `waf` devuelve el error 1027 de Cloudflare: está obsoleto y debe usarse Rulesets. No volver a intentar activarlo.
- **Corrección aplicada el 3 de noviembre de 2026:** se creó, después de validarlo con `dry_run`, el ruleset de entrada `9460d0ecfea848f79ae4ad83b76b3464` en la fase `http_request_firewall_managed`. Ejecuta la versión `latest` de `Cloudflare Managed Free Ruleset` (`77454fe2d30c4220b5701f6fdfb893ba`) con una regla `execute` habilitada para todo el tráfico. Una lectura posterior de la API confirmó que quedó guardado.
- MFA de la cuenta Cloudflare: **desactivado**. El alta requiere que el titular configure un autenticador o llave de seguridad en la sesión de Cloudflare; no se puede completar mediante una simple modificación del Worker.

### GitHub — controles de repositorio

- La rama `main` aparece como `protected: false`; la API también devuelve que no hay reglasets de repositorio.
- La conexión de GitHub disponible permite leer y modificar contenido/PR, pero no tiene capacidad administrativa para activar protección de rama. Por tanto, esta medida requiere una persona con rol administrador del repositorio.
- MFA de GitHub no pudo verificarse con la conexión disponible.

## Bloqueadores y procedimiento para cerrarlos

### P0 — Reconciliar migraciones y probar la base

1. Obtener un respaldo verificable del esquema y datos antes de cualquier DDL.
2. Crear una rama/entorno de desarrollo de Supabase y confirmar su costo antes de crearla. La conexión actual no tiene una rama existente.
3. Comparar cada SQL histórico con el esquema real y recuperar los archivos históricos faltantes. No usar coincidencia de nombres como prueba de equivalencia.
4. Ejecutar las cuatro migraciones nuevas en el entorno de ensayo y revisar resultados, índices, funciones, triggers, políticas RLS y asesores.
5. Sembrar dos negocios de prueba y dos usuarios con permisos distintos. Probar lectura/escritura cruzada, permisos de empleados, concurrencia de ventas, impuestos/descuentos, pagos y stock.
6. Probar apertura/cierre de caja con ventas en efectivo, pagos a proveedores y gastos; solo entonces preparar el SQL posdespliegue de revocación de escrituras directas.
7. Aplicar en producción solo después de que el historial y las pruebas sean reproducibles.

### P0 — Completar Supabase Auth

Una persona con acceso al panel debe:
- Ir a Authentication > Bot and Abuse Protection.
- Habilitar CAPTCHA, elegir Cloudflare Turnstile y guardar el **Secret Key** del widget en Supabase. El Site Key ya está definido en el Worker; no publicar el Secret Key en Git.
- Habilitar Leaked Password Protection en la configuración de seguridad de contraseñas.
- Probar registro, inicio de sesión, recuperación y cambio de contraseña con una cuenta de prueba.

Documentación oficial:
- [Supabase CAPTCHA protection](https://supabase.com/docs/guides/auth/auth-captcha)
- [Leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### P1 — MFA y rama protegida

Una persona titular/administradora debe:
- Activar MFA en la cuenta Cloudflare y guardar códigos de recuperación fuera del equipo principal.
- Verificar/activar MFA en GitHub y Supabase.
- En GitHub, configurar protección para `main`: exigir pull requests, bloquear force-push y borrado, y exigir el check `build`. Exigir una aprobación solo si hay otra persona disponible para revisar; no imponer una regla que impida al único mantenedor fusionar sus propios cambios.

Documentación:
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

### P1 — Cadena de suministro y CSP

- Falta `package-lock.json` versionado y CI usa `npm install`; las dependencias transitivas no quedan fijadas entre ejecuciones. Generar el lockfile en un entorno con acceso al registro npm, revisarlo/comprometerlo y cambiar CI a `npm ci`.
- CSP todavía no está aplicada. El Worker inyecta scripts/estilos inline y la app genera documentos de impresión con scripts inline; activar CSP sin migrar esos comportamientos puede romper registro, recuperación, tarjetas, cotizaciones o impresión. Primero moverlos/protegerlos con nonces y probar cada flujo, luego aplicar una política CSP restrictiva.

### P2 — Alcance funcional posterior

Estas capacidades no están terminadas y no deben presentarse como contabilidad conciliada:
- Conciliación bancaria mediante importación de extractos, reglas de emparejamiento, diferencias y cierre de conciliación.
- Devoluciones/anulaciones enlazadas a la venta original y registradas como movimientos monetarios; no como gastos genéricos.
- Contabilidad formal: plan de cuentas, asientos, libro diario, balance y reportes tributarios. Definir primero el alcance legal/contable colombiano y los perfiles de contador antes de implementar.

## Estado de salida

- [x] CI del commit actual del PR aprobado.
- [x] APK de prueba generada y validada.
- [x] Reglas administradas gratuitas de Cloudflare desplegadas y verificadas por API.
- [x] TLS/HTTPS/HSTS comprobados.
- [x] Privilegios directos sobre las cuatro tablas de métricas comprobados.
- [ ] Historial de migraciones reconciliado y reproducible.
- [ ] Migraciones probadas en rama/entorno de desarrollo.
- [ ] Pruebas transaccionales y de aislamiento multiempresa aprobadas.
- [ ] CAPTCHA nativo y protección de contraseñas filtradas activados en Supabase Auth.
- [ ] MFA de Cloudflare, GitHub y Supabase verificado.
- [ ] Protección de rama `main` y check `build` obligatorios.
- [ ] SQL posdespliegue de caja ejecutado tras pruebas.
- [ ] `package-lock.json` comprometido y CI migrado a `npm ci`.
- [ ] CSP aplicada tras proteger los scripts de la app y de impresión.
- [ ] Conciliación bancaria, devoluciones y contabilidad formal diseñadas/implementadas.

**No declarar Treseiscinco listo para pagos reales hasta cerrar todos los P0 y probar los flujos financieros en un entorno aislado.**
