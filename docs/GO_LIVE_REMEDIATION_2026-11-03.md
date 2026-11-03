# Estado vigente de remediación — 3 de noviembre de 2026

Este archivo resume el estado actual del PR #80 y prevalece sobre referencias históricas a CI anteriores que permanezcan en el informe general.

## Corregido en la rama del PR

- **Dependencias:** Capacitor 8.6.0; `glob@14.0.3`; `minimatch@11.0.4`; `xcode@4.0.0`.
- **Auditoría npm:** CI #544 ejecutó `npm audit --audit-level=low` y encontró **0 vulnerabilidades**.
- **Pruebas:** CI #544 aprobó **99/99 pruebas**, compilación web, APK Android, icono oficial y activos estáticos.
- **CSP:** scripts de arranque y Turnstile externalizados; scripts inline de impresión retirados; scripts inline bloqueados por `script-src`. Se permite `blob:` únicamente en `media-src` para el audio generado de Celeste. Se conserva `style-src 'unsafe-inline'` por estilos dinámicos de React.
- **Caja:** RPC y triggers aplicados en producción; protegen también la interfaz antigua mediante normalización de apertura/cierre en PostgreSQL.
- **Catálogo:** respuesta pública sin SKU, existencias exactas ni metadatos internos.
- **Funciones:** search_path endurecidos; índices FK aplicados y duplicado de índice de caja eliminado.
- **PR:** descripción y comentario actualizados. PR #80 continúa abierto/en borrador.

CI:
- #543 — CSP y scripts externos: [resultado](https://github.com/ricardowiswellgomez/treseiscinco/actions/runs/41697544858).
- #544 — 0 vulnerabilidades, 99/99 pruebas y APK: [resultado](https://github.com/ricardowiswellgomez/treseiscinco/actions/runs/41697565205).
- #546 y #547 validaron actualizaciones documentales; #548 está pendiente al momento de crear esta nota. Ninguno de esos cambios documentales altera el código de aplicación.

## Artefacto de dependencias

CI #544 produjo un `package-lock.json` v3, 241 paquetes, SHA-256:

`05d7d29e7233e5e1b345ad9687b66e18fb95832597d5039c82b85d32d471191b`

Se adjuntó como artefacto temporal `npm-lockfile-recovery`. El archivo actualizado todavía no está versionado en la rama; el workflow lo regenera y valida antes de `npm ci`.

## Controles pendientes que requieren al propietario

1. **Supabase CAPTCHA:** falta activar el ajuste nativo en Authentication > Bot and Abuse Protection, seleccionar Cloudflare Turnstile y guardar el Secret Key privado en Supabase. El widget y el envío de token ya están en la rama; sin esta configuración Supabase Auth no valida el token. No compartir el secreto por chat ni subirlo a Git.
2. **Contraseñas filtradas:** Supabase documenta esta protección únicamente en Pro o superior. La organización actual está en Free. No se actualizó el plan.
3. **Pruebas de migración multiempresa:** Supabase Preview Branching requiere Pro y genera consumo de compute, disco y egreso. No se creó una rama ni se autorizó gasto.
4. **MFA:** Cloudflare debe activarse desde la sesión del titular; GitHub y Supabase MFA deben verificarse desde sus cuentas.
5. **Protección de `main`:** GitHub confirma `protected: false`. La conexión GitHub disponible no tiene permiso de administración para configurarla. En este repositorio público la protección de ramas está disponible en GitHub Free; no requiere cambiar plan.
6. **Secret de despliegue:** falta crear `CLOUDFLARE_API_TOKEN` en Settings > Secrets and variables > Actions, con permisos mínimos. No enviar el valor por chat.
7. **Pago histórico:** el movimiento de **$44.000 COP** de la venta `VTA-20261023-1A5B0373` aparece fuera de una sesión de caja. No se alteró; necesita conciliación física.
8. **Lockfile:** incorporar el `package-lock.json` generado al repositorio para que no dependa de la regeneración temporal del workflow.

## Migraciones y producción

- Supabase registra **100 versiones**; la carpeta local tiene **54 archivos SQL**.
- La comparación de nombres encontró 50 registros remotos con nombre coincidente (un nombre aparece duplicado), 50 sin coincidencia exacta y 5 archivos locales sin nombre remoto exacto. Esto no demuestra que falten 50 migraciones: hay renombrados y timestamps distintos. Falta comparar SQL y secuencia en un entorno aislado.
- No ejecutar `supabase db push` ni editar `supabase_migrations.schema_migrations` manualmente.
- El SQL posdespliegue `supabase/post-deploy/20261102000400_restrict_cash_register_direct_writes.sql` no se ha ejecutado. Aplicarlo solo cuando la interfaz nueva esté desplegada y la apertura/cierre se haya validado desde navegador.
- Cloudflare aún sirve la versión desplegada el **30 de octubre de 2026**. La nueva CSP/interfaz no está publicada. `main` no fue modificada.

**Decisión de salida:** no fusionar ni desplegar hasta completar configuración de cuenta, reconciliar migraciones, conciliar el pago histórico y probar caja/aislamiento multiempresa en un entorno aislado.
