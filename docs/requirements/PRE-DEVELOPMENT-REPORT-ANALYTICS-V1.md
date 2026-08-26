# Pre-development report — Analytics V1

Fecha: 2026-08-26

## Decisión

Se implementa analytics propio y agregado sobre Cloudflare D1. La tabla almacena solamente día UTC, tipo de evento allowlisted, path normalizado, origen normalizado y contador acumulado. No guarda IP, cookies identificatorias, user agent, query strings ni contenido de formularios.

Una `visit` es una sesión aproximada: el navegador conserva un timestamp en `localStorage` durante 30 minutos. La primera carga fuera de esa ventana emite una visita; las navegaciones internas generan solo `page_view`.

## Seguridad y límites

- El endpoint público acepta únicamente eventos individuales allowlisted y descarta cuerpos grandes o claves arbitrarias.
- El éxito de contacto se registra exclusivamente desde `api/contacto` después de la confirmación del Bot API.
- D1 usa incrementos `UPSERT` atómicos.
- No hay permisos de escritura de Cloudflare Access en la sesión disponible. Hasta poder configurar Access, `/admin` y `/api/admin/*` deben devolver 403 y no exponer datos; el panel no se publica.
- El contador público puede comenzar solamente desde la activación de esta base, sin estimar tráfico histórico.
