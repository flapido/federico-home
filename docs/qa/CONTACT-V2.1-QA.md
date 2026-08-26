# Contacto comercial V2.1 — QA

Fecha: 2026-08-26

## Implementación verificada

- `/contacto` contiene un formulario breve, con etiquetas reales, foco al primer error, `aria-describedby`, `aria-live`, límites de longitud y prevención de doble envío.
- Las categorías disponibles son: Tengo una idea, Software a medida, Modernizar un sistema, Automatización / IA, Avatar con IA, Archivo digital, Consulta o duda y Otro.
- WhatsApp usa el destino profesional autorizado y genera un texto contextual desde `origen`; Email usa el correo público canónico y LinkedIn reutiliza el perfil existente.
- `POST /api/contacto` es una Cloudflare Pages Function server-side: valida método, content type, payload, honeypot, tamaños, origen y página; usa límite temporal por IP en el isolate y no registra contenido de la consulta.
- El endpoint solo toma `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` desde secretos server-side; no hay variables `VITE_*`, secretos ni Telegram visibles en la UI.

## Evidencia ejecutada

- `npm test`: 20/20 PASS. Incluye validaciones amables, preservación del mensaje ante error y rechazo server-side de payload malformado.
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `wrangler pages functions build functions`: PASS.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilidades altas.
- `node run-qa.mjs`: PASS, 10 viewports × 12 rutas, sin overflow ni errores propios de consola.
- Revisión visual directa: `/contacto` en 320×568 y 1440×900 PASS; jerarquía, formulario, tarjetas directas, contraste y flujo móvil correctos.

## Integración de Telegram

`TOKEN_EXPOSURE_RISK`: la configuración histórica localizada en el proyecto de referencia contiene un token literal versionado. No se reutilizó ni se copió. La Function está preparada para un token rotado configurado exclusivamente como secreto de Cloudflare.

La prueba real de entrega a Telegram y el PASS final de producción requieren ese token nuevo. No se documentan ni exponen secretos ni identificadores sensibles en este repositorio.
