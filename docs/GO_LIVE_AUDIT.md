# Auditoría de salida a producción — Treseiscinco

**Última revisión:** 3 de noviembre de 2026  
**Proyecto:** `treseiscinco.com` · Cloudflare Worker `treseiscinco` · Supabase `maogebecfottfvlrjbho`  
**PR de endurecimiento:** [#80 — Hardening financiero: caja segura y rentabilidad neta](https://github.com/ricardowiswellgomez/treseiscinco/pull/80)

## Decisión ejecutiva

**Mantener el PR #80 abierto y en borrador; no fusionar ni desplegar todavía.** El endurecimiento de catálogo, caja, dependencias y CSP está implementado en la rama y validado por CI, pero la nueva interfaz no está publicada. Siguen pendientes controles de cuenta (CAPTCHA, MFA, protección de `main` y secreto de despliegue), reconciliación del historial de migraciones y conciliación del pago histórico. La organización Supabase está en plan Free: las ramas de ensayo y la protección nativa de contraseñas filtradas requieren Pro.

Se aplicaron seis migraciones de endurecimiento en producción (privacidad del catálogo, `search_path`, índices FK, RPC de caja, limpieza de índice duplicado y trigger transitorio para escrituras directas antiguas). **No se aplicó** el SQL posdespliegue que revoca escrituras directas de caja; debe esperar al despliegue de la interfaz nueva. `main` sigue intacta y el Worker no se desplegó desde el PR.

## Estado confirmado

### Código y CI

- PR #80 permanece abierto y en borrador.
- GitHub Actions **#526 falló** porque `tests/database-indexes.test.mjs` todavía leía el nombre anterior de la migración de índices. Se actualizó la prueba al nombre real de producción.
- GitHub Actions **#532 terminó en `success`** en una revisión previa; aún precedía la sincronización final de la migración de compatibilidad.
- GitHub Actions **#535 terminó en `success`** sobre el HEAD actual `fd9f3ed60a486cfc22dc4f63e2ec39bb014a0467`: `npm ci`, auditoría de dependencias de alta severidad, sintaxis del Worker, **97 pruebas (97 aprobadas, 0 fallidas)**, build web, verificación de ruta Android, generación del APK, icono oficial y carga de activos estáticos.
- En #535, el job `Deploy production Worker` quedó `skipped`, correctamente por tratarse de un pull request. No se publicó el Worker: [ejecución #535](https://github.com/ricardowiswellgomez/treseiscinco/actions/runs/41689479974).
- GitHub Actions **#536 terminó en `success`** sobre el HEAD documental `89d21535333e9e9031b16ec2ce3b056985d794c7`: volvió a pasar `npm ci`, auditoría al umbral alto, sintaxis del Worker, 97 pruebas (97/97), build web, APK, icono y activos. El job de despliegue volvió a quedar `skipped`: [ejecución #536](https://github.com/ricardowiswellgomez/treseiscinco/actions/runs/41690044472). Este commit solo cambió `docs/GO_LIVE_AUDIT.md`; no cambió el código.
- Artefacto `treseiscinco-dist`: 4.693.594 bytes; SHA-256 `8329920725ab810e9de2d3b013fbbff93a1b49b05bfc84bcb126c51167fc5865`. Es temporal, expira el 4 de noviembre de 2026 y no se publicó en producción.
- `main` permanece en `a4c67b1d3f48b1eff59bdea729112f843bc7e459`.

### Supabase — base de datos

- El proyecto está en estado `ACTIVE_HEALTHY`, PostgreSQL 17. La organización `Ricardo Wiswell Gomez` está en plan `Free`.
- Historial remoto: **100 migraciones**; el repositorio contiene **54 archivos SQL** en `supabase/migrations`. Las seis últimas versiones remotas son las correcciones de privacidad, `search_path`, índices, caja, limpieza del índice duplicado y compatibilidad de la interfaz antigua; la última es `20261103175507 guard_cash_register_session_direct_writes`.
- El repositorio no contiene una copia íntegra y ordenada de todo el historial remoto. Se alinearon los cinco archivos de endurecimiento con las versiones reales que Supabase registró, pero todavía quedan migraciones históricas ausentes o con nombres/versiones distintos. Esto impide declarar reproducible una reconstrucción completa desde cero.
- **No ejecutar `supabase db push`, ni insertar/eliminar filas de `supabase_migrations.schema_migrations` manualmente.** No se debe marcar como aplicada una migración sin demostrar que su contenido ya está reflejado en el esquema.
- La rama contiene seis migraciones que ya constan en el historial remoto:
  - `20261103173103_redact_public_catalog_internal_fields.sql`
  - `20261103173342_harden_public_rpc_search_paths.sql`
  - `20261103173358_add_missing_foreign_key_indexes.sql`
  - `20261103173636_add_server_cash_register_rpcs.sql`
  - `20261103173747_deduplicate_cash_register_open_index.sql`
  - `20261103175507_guard_cash_register_session_direct_writes.sql`
- También existe el SQL posdespliegue `supabase/post-deploy/20261102000400_restrict_cash_register_direct_writes.sql`. No debe ejecutarse hasta que el nuevo frontend/Worker esté activo y la apertura/cierre de caja haya sido comprobada.
- El asesor de rendimiento ya no informa claves foráneas sin índice ni avisos `auth_rls_initplan`: las 17 claves están cubiertas y las dos políticas de caja evalúan `auth.uid()` una vez por sentencia. También se eliminó el índice único duplicado de sesiones. Quedan avisos INFO de índices no usados; no se eliminan sin métricas reales de carga.
- Cuatro tablas de métricas de plataforma tienen RLS habilitado sin políticas. La consulta de privilegios confirmó que `anon` y `authenticated` no tienen permisos directos sobre ellas. El aviso es informativo y no se deben crear políticas de lectura abiertas para silenciarlo.
- Se comprobó que `anon` y `authenticated` no tienen permiso `CREATE` sobre los esquemas `public`, `private` ni `auth`; esto reduce el riesgo de sustitución de objetos en los `search_path` existentes. `anon` tampoco tiene `USAGE` sobre `private`.
- El asesor reporta 6 RPC `SECURITY DEFINER` ejecutables por `anon` y 43 por `authenticated`. No revocar en bloque: incluye catálogo público, imágenes, cupones, estado de pedidos, apertura/cierre de caja y operaciones autenticadas del negocio. Cada RPC debe seguir revisándose individualmente por control de negocio, pertenencia, propiedad y alcance de datos.
- La protección de contraseñas filtradas de Supabase Auth está **desactivada**. Supabase la ofrece solo en Pro o superior; la organización actual es Free. Activarla requiere aprobar una actualización de plan. [Documentación oficial](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
- La protección CAPTCHA nativa de Auth todavía no está habilitada. La rama incluye el widget Turnstile y el Worker reenvía el token; falta que el propietario active CAPTCHA en Authentication > Bot and Abuse Protection, seleccione Cloudflare Turnstile y pegue allí el Secret Key privado. El Site Key ya está en el Worker. [Documentación oficial](https://supabase.com/docs/guides/auth/auth-captcha).

### Cloudflare — zona y Worker

- La zona `treseiscinco.com` está activa; los dominios raíz y `www` están vinculados al Worker `treseiscinco`.
- El último despliegue de producción que devuelve Cloudflare es del **30 de octubre de 2026 a las 08:09:06 UTC**, con la versión `e94a2d48-a740-420e-b5cf-b944cd3bbc61` al 100 %. La API lista 187 despliegues históricos; no debe confundirse ese contador con el número de versión activa. Los builds #535/#536 no desplegaron el Worker; la nueva interfaz todavía no está publicada.
- HTTPS forzado está activo; versión mínima TLS 1.2 y TLS 1.3 está habilitado.
- HSTS está activo en la zona. La política de zona tiene `max_age=15552000`, `include_subdomains=false`; el Worker devuelve además `Strict-Transport-Security: max-age=31536000`.
- El ajuste antiguo `waf` devuelve el error 1027 de Cloudflare: está obsoleto y debe usarse Rulesets. No volver a intentar activarlo.
- **Corrección aplicada el 3 de noviembre de 2026:** se creó, después de validarlo con `dry_run`, el ruleset de entrada `9460d0ecfea848f79ae4ad83b76b3464` en la fase `http_request_firewall_managed`. Ejecuta la versión `latest` de `Cloudflare Managed Free Ruleset` (`77454fe2d30c4220b5701f6fdfb893ba`) con una regla `execute` habilitada para todo el tráfico. Una lectura posterior de la API confirmó que quedó guardado.
- MFA de la cuenta Cloudflare: **desactivado**. El alta requiere que el titular configure un autenticador o llave de seguridad en la sesión de Cloudflare; no se puede completar mediante una simple modificación del Worker.

### GitHub — controles de repositorio

- La rama `main` aparece como `protected: false`; no hay reglasets de repositorio. La conexión GitHub instalada no tiene permiso de administración de ramas (403), así que una persona administradora debe activar las reglas desde GitHub. El workflow conserva permisos de solo lectura para builds de PR y separa el despliegue.
- La conexión de GitHub disponible permite leer y modificar contenido/PR, pero no tiene capacidad administrativa para activar protección de rama. Por tanto, esta medida requiere una persona con rol administrador del repositorio.
- MFA de GitHub no pudo verificarse con la conexión disponible.

## Bloqueadores y procedimiento para cerrarlos

### P0 — Reconciliar migraciones y probar la base

1. Obtener un respaldo verificable del esquema y datos antes de cualquier DDL.
2. Crear una rama/entorno de desarrollo de Supabase y confirmar su costo antes de crearla. La conexión actual no tiene una rama existente.
3. Comparar cada SQL histórico con el esquema real y recuperar los archivos históricos faltantes. No usar coincidencia de nombres como prueba de equivalencia.
4. Las cinco migraciones nuevas ya se aplicaron y el asesor se volvió a consultar. La función de catálogo y el endurecimiento de rutas se verificaron con rol anónimo; las migraciones de índices y caja se probaron dentro de una transacción que terminó en `ROLLBACK` y luego se aplicaron.
5. La prueba transaccional de caja, con rol `authenticated`, abrió/cerró sesiones, aceptó un abono en una sesión, rechazó un pago sin caja y otro posterior al cierre, rechazó un gasto sin sesión y confirmó la atribución del gasto al usuario. El ensayo terminó en `ROLLBACK` y se comprobó que no dejó registros de prueba.
6. Sigue pendiente una rama de ensayo multiempresa con dos negocios/usuarios y pruebas completas de ventas, compras, impuestos/descuentos y stock; no se creó porque no hay medio de pago disponible para cubrir posibles cargos.
7. Ejecutar el SQL posdespliegue de revocación de escrituras directas solo después de desplegar la interfaz nueva y validar apertura/cierre desde el navegador.

### P0 — Completar Supabase Auth

Una persona con acceso al panel debe:
- Ir a Authentication > Bot and Abuse Protection.
- Habilitar CAPTCHA, elegir Cloudflare Turnstile y guardar el **Secret Key** del widget en Supabase. El Site Key ya está definido en el Worker; no publicar el Secret Key en Git.
- Habilitar Leaked Password Protection en la configuración de seguridad de contraseñas.
- Probar registro, inicio de sesión, recuperación y cambio de contraseña con una cuenta de prueba.

Documentación oficial:
- [Supabase CAPTCHA protection](https://supabase.com/docs/guides/auth/auth-captcha)
- [Leaked password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

### P1 — MFA, rama protegida y secreto de despliegue

Una persona titular/administradora debe:
- Activar MFA en la cuenta Cloudflare y guardar códigos de recuperación fuera del equipo principal.
- Verificar/activar MFA en GitHub y Supabase.
- En GitHub, configurar protección para `main`: exigir pull requests, bloquear force-push y borrado, y exigir el check `build`. Exigir una aprobación solo si hay otra persona disponible para revisar; no imponer una regla que impida al único mantenedor fusionar sus propios cambios.
- En GitHub Actions, crear el secreto de repositorio `CLOUDFLARE_API_TOKEN` con un token de Cloudflare de alcance mínimo para desplegar el Worker `treseiscinco`. El workflow ahora falla explícitamente si ese secreto falta; no puede dar éxito sin publicar el Worker.

Documentación:
- [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

### P1 — Cadena de suministro y CSP

- **Dependencias:** Capacitor actualizado a 8.6.0; overrides fijados en `glob@14.0.3` y `minimatch@11.0.4`; `xcode` resuelto a 4.0.0. CI #544 ejecutó `npm audit --audit-level=low` y encontró **0 vulnerabilidades**. El workflow regenera el lockfile antes de `npm ci` y publica `npm-lockfile-recovery`; el `package-lock.json` actualizado aún debe incorporarse al repositorio.
- CSP aplicada en el código del PR: se externalizaron los scripts de arranque/Turnstile, se retiraron los scripts inline de impresión y se añadió `media-src 'self' blob: data:` para el audio de Celeste. `script-src` bloquea scripts inline; se conserva `style-src 'unsafe-inline'` para estilos dinámicos React. CI #543 validó el cambio; aún no está desplegado en producción.

### P2 — Alcance funcional posterior

Estas capacidades no están terminadas y no deben presentarse como contabilidad conciliada:
- Conciliación bancaria mediante importación de extractos, reglas de emparejamiento, diferencias y cierre de conciliación.
- Devoluciones/anulaciones enlazadas a la venta original y registradas como movimientos monetarios; no como gastos genéricos.
- Contabilidad formal: plan de cuentas, asientos, libro diario, balance y reportes tributarios. Definir primero el alcance legal/contable colombiano y los perfiles de contador antes de implementar.

## Correcciones de base de datos aplicadas en producción — 3 de noviembre de 2026

### Privacidad del catálogo — resuelto

La función `public.get_public_catalog(uuid,integer,integer,text,uuid,text)` era ejecutable por `anon` y exponía SKU, existencias exactas, control interno de inventario y metadatos fiscales. Se aplicó la migración `20261103173103_redact_public_catalog_internal_fields.sql`.

La prueba posterior ejecutada como rol `anon` sobre el catálogo WíswellArt devolvió los cuatro productos públicos y confirmó que la respuesta no contiene las claves `sku`, `stock_on_hand`, `track_inventory`, `tax_code` ni `is_active`. La función conserva el mismo nombre, firma y tipo de retorno JSONB; la interfaz pública no consume esos campos. El buscador público ahora se etiqueta como búsqueda por nombre o descripción, no por código SKU.

### Funciones privilegiadas y rendimiento — resuelto para los hallazgos revisados

Se aplicó `20261103173342_harden_public_rpc_search_paths.sql`. La consulta posterior encontró cero funciones expuestas `SECURITY DEFINER` sin `search_path` configurado y cero con `pg_temp` antes del último elemento.

Se aplicó `20261103173358_add_missing_foreign_key_indexes.sql` y la migración de caja cubrió los dos índices restantes. El asesor dejó de reportar claves foráneas sin índice y políticas RLS con reevaluación de `auth.uid()`. Se eliminó el índice único duplicado mediante `20261103173747_deduplicate_cash_register_open_index.sql`. No se quitarán los índices INFO no usados sin métricas de carga suficientes.

### P2 — Integridad de métricas de instalación

La función autenticada `record_platform_activity` registra actividad del propio usuario, pero el cliente puede enviar `p_event='pwa_installed'` o `p_is_standalone=true`. No hay una prueba independiente del sistema operativo que confirme la instalación. El panel ahora etiqueta esos valores como **PWA reportadas** y **Reporte de instalación**, no como instalaciones verificadas. No usar esta cifra como prueba de adopción real, facturación ni criterio de pago.

### P1 — Conciliación de caja por sesión

La migración 001 del PR ahora establece una regla uniforme: **todo nuevo pago en efectivo (venta, abono o compra) y todo gasto en efectivo debe pertenecer a una sesión abierta por el mismo usuario y negocio**. La comprobación se hace en PostgreSQL, dentro de los triggers, no solo en la interfaz.

El guardado y el cierre comparten el mismo bloqueo transaccional. Si un pago queda esperando mientras se cierra la caja, al obtener el bloqueo vuelve a comprobar la sesión; al encontrarla cerrada, rechaza el pago. Así evita que un movimiento entre justo después del cierre y quede fuera de la suma. La identidad del usuario autenticado prevalece sobre cualquier `created_by` enviado por el cliente.

Una venta o compra sin abono inicial puede seguir registrándose sin caja; el usuario deberá abrirla antes de registrar un abono en efectivo. Los pagos bancarios/electrónicos no quedan sujetos a esta regla. La migración `20261103173636_add_server_cash_register_rpcs.sql` ya está aplicada en producción. La prueba transaccional con rol `authenticated` verificó apertura/cierre, cálculo del efectivo esperado, rechazo de abonos sin caja y tras el cierre, atribución del creador de gastos y conciliación del gasto. El ensayo terminó con `ROLLBACK` y se comprobó que no alteró ventas, pagos, gastos ni sesiones existentes.

### Compatibilidad segura mientras se actualiza la interfaz — corregido en producción

La interfaz publicada todavía usa las escrituras directas antiguas para abrir/cerrar cajas. No se revocaron sus permisos porque habría roto ese frontend antes de publicar la versión nueva. Para evitar que el cliente pueda falsificar aperturas o cierres, se aplicó `20261103175507_guard_cash_register_session_direct_writes.sql`: PostgreSQL fija el usuario, la moneda y la hora de apertura; solo permite la transición `open → closed`; recalcula el efectivo desde pagos de ventas, pagos a proveedores y gastos usando `created_at`; ignora el total esperado/fecha/usuario de cierre enviados por el navegador; y bloquea cambios posteriores sobre cajas cerradas.

La prueba transaccional posterior a la aplicación simuló el INSERT y UPDATE del frontend antiguo con valores falsos; el servidor los normalizó y calculó el efectivo correcto. También probó la ruta nueva de RPC con la misma protección. Ambas rutas terminaron en `ROLLBACK`; se verificó que no quedaron cajas, pagos o gastos de prueba.

Los movimientos históricos en efectivo que se registraron sin sesión no se asignan automáticamente a una caja. La consulta de producción del 3 de noviembre de 2026 encontró un único caso: venta `VTA-20261023-1A5B0373`, por **$44.000 COP**, con pago en efectivo creado el 23 de octubre de 2026 a las 06:07 UTC (01:07, hora de Colombia). No existe una sesión que cubra ese momento; la única sesión registrada se abrió el 28 de octubre de 2026 y está cerrada. No se modificó el pago ni se atribuyó retroactivamente a esa caja. Debe revisarse y conciliarse manualmente antes de considerar cerrada la diferencia histórica.

## Estado de salida

- [x] CI #543 aprobó CSP/scripts externos/impresión/audio y build web/Android.
- [x] CI #544 aprobó `npm audit --audit-level=low` (0 vulnerabilidades), 99/99 pruebas, build web, APK, icono y activos; despliegue omitido por ser un PR.
- [x] APK de prueba generada y validada.
- [x] Reglas administradas gratuitas de Cloudflare desplegadas y verificadas por API.
- [x] TLS/HTTPS/HSTS comprobados.
- [x] Privilegios directos sobre las cuatro tablas de métricas comprobados.
- [ ] Historial histórico local/remoto completamente reconciliado; no ejecutar `db push` a ciegas.
- [x] Privacidad del catálogo corregida y verificada con rol anónimo en producción.
- [x] `search_path` de funciones expuestas endurecido y verificado.
- [x] 17 índices de claves foráneas creados y verificados; avisos de FK/RLS initplan eliminados.
- [x] Caja segura y compatible con ambas interfaces: RPC nueva y escrituras directas antiguas protegidas por trigger; ensayo reversible posterior a la aplicación aprobado.
- [ ] Rama de ensayo y pruebas multiempresa; requieren actualizar la organización a Supabase Pro y aceptar el consumo facturable de branching.
- [ ] Conciliar manualmente el pago histórico de $44.000 sin sesión.
- [ ] Publicar la nueva interfaz/Worker; después ejecutar el SQL posdespliegue que revoca escrituras directas de caja.
- [ ] Pruebas transaccionales y de aislamiento multiempresa aprobadas.
- [ ] CAPTCHA nativo y protección de contraseñas filtradas activados en Supabase Auth.
- [ ] MFA de Cloudflare, GitHub y Supabase verificado.
- [ ] Protección de rama `main` y check `build` obligatorios.
- [ ] Secreto `CLOUDFLARE_API_TOKEN` creado en GitHub Actions para publicar el Worker al fusionar.
- [ ] SQL posdespliegue de caja ejecutado tras pruebas.
- [x] CI #544 ejecutó `npm audit --audit-level=low` y encontró 0 vulnerabilidades; 99/99 pruebas aprobadas. El lockfile nuevo se publica como artefacto temporal y aún debe incorporarse al repositorio.
- [x] Dependencias actualizadas; CI #544 encontró 0 vulnerabilidades con umbral `low`.
- [x] CSP aplicada en el código del PR y validada por CI #543; aún no está en producción.
- [ ] Incorporar el `package-lock.json` generado en CI #544 al repositorio.
- [ ] Conciliación bancaria, devoluciones y contabilidad formal diseñadas/implementadas.

**No declarar Treseiscinco listo para pagos reales hasta cerrar todos los P0 y probar los flujos financieros en un entorno aislado.**
