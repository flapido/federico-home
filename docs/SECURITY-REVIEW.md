# Security & Privacy Review — Federico Home V1
Fecha: 2026-08-23
Revisor: Security Reviewer (lightweight baseline — sitio estático sin auth)

## Alcance
SPA estática Vite+React, sin backend, sin auth, sin uploads, sin pagos, sin datos personales reales, sin integración externa, demos mock locales.

## Hallazgos
- No se colectan datos personales. No hay formularios, no hay cookies, no hay tracking.
- No hay secretos/keys en repo. `domains.ts` usa placeholders midominio.com.
- No hay uploads ni endpoints → sin XSS almacenado ni file traversal.
- Demos no persisten, no fingen datos reales, marcadas como simulación → no riesgo de filtración.
- Subastas: datos de ejemplo, sin datos sensibles reales (cumple mandato).
- Dependencias: 0 vulnerabilidades `npm audit` (49 packages). React 19, Vite 8 al día.
- Headers futuros (cuando se sirve en PC propia): recomendar `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` en Nginx/Caddy. No bloquea gate V1 local.
- No hay auth → no requiere revisión de sesión/JWT.
- Enlaces externos placeholders son texto, no navegación automática → no open redirect.

## Veredicto
**PASS (baseline)** — Sin riesgos materiales para V1 estática. Re-evaluar cuando se agreguen demos reales, auth o subdominios con backend.

## Recomendaciones futuras
- Al activar subdominios reales, añadir CSP básica y HTTPS obligatorio.
- Si Lab agrega herramientas con IA/API, aislar keys en env no commiteado.
