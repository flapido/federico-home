# Product Quality Gate — Analytics V1

Fecha: 2026-08-26

**PRODUCT_QUALITY_GATE: PASS**

- [x] D1 agregado con incrementos atómicos y migración aplicada.
- [x] Contador público usa visitas reales desde la activación; no muestra un valor inventado ni cero falso.
- [x] Ventana de visita de 30 minutos en `localStorage`; navegación interna registra page views sin recuento de visita inmediato.
- [x] Eventos allowlisted, tamaño limitado y rate limit efímero; sin cantidades controladas por cliente.
- [x] Contacto exitoso se agrega solo server-side después de confirmación Telegram.
- [x] Autoplay del avatar no se mide; replay interactivo y reduced motion verificados.
- [x] WhatsApp, Email y LinkedIn se mantienen no bloqueantes y registran la interacción.
- [x] `/admin` y `/api/admin/*` están bloqueados con 403 sin Cloudflare Access, sin datos públicos.
- [x] Tests, lint, build, auditoría, compilación Functions, visual QA responsive y smoke de producción PASS.
- [x] Privacy/secret review PASS: D1 solo almacena agregados sin PII ni secretos.

## Límite de publicación admin

El dashboard no se publica hasta contar con una aplicación Cloudflare Access y validación JWT server-side. La sesión disponible no tiene permisos Access (API 403); se eligió el estado seguro permitido por el mandato: datos admin bloqueados, no un panel público.
