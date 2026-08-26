# Analytics V1 — QA y privacidad

Fecha: 2026-08-26

## Evidencia de producción

- D1 `federico-home-analytics` creado y migración `0001_analytics.sql` aplicada.
- Binding Pages `ANALYTICS_DB` confirmado en production y preview.
- Evento `visit` real aceptado (202); contador público consultado (200) con total positivo desde la activación.
- Navegación, page views, dos replays manuales del avatar, contacto exitoso y clicks de WhatsApp/Email/LinkedIn confirmados en agregados D1.
- La prueba de contacto publicada respondió 200, mostró éxito y llegó mediante la integración Telegram existente; `contact_submit_success` quedó agregado con origen normalizado.
- `/admin` y `/api/admin/analytics/summary` devuelven 403 a una solicitud no autenticada.

## Privacy review — PASS

La tabla contiene solo `day`, `event_type`, `path`, `source` y `count`. No tiene columnas ni valores para IP, user agent, email, teléfono, nombre, mensaje, query string, token ni chat id. La ventana de visita usa únicamente `localStorage` local durante 30 minutos, sin cookie ni fingerprinting.

## Seguridad de admin

La sesión de Cloudflare disponible carece de permisos de escritura Access y el API de Access devuelve 403. Por ello no se publicó un dashboard con datos: las rutas admin están bloqueadas server-side. Habilitar un panel visible requiere configurar Cloudflare Access para el email autorizado y validar su JWT server-side; no se implementó un bypass inseguro.
