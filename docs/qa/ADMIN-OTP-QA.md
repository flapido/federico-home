# Admin OTP — QA

## Seguridad y arquitectura

- OTP: seis dígitos generados con Web Crypto, hash HMAC en D1, vencimiento de cinco minutos y un único uso.
- Intentos: cinco como máximo por código; solicitudes: tres cada quince minutos.
- Sesión: token aleatorio hasheado en D1; cookie `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, con duración de ocho horas.
- Las APIs `/api/admin/*` verifican sesión en servidor. `/admin` solo contiene el login sin datos; rutas internas de dashboard requieren sesión.
- No hay secretos, códigos, chat IDs ni tokens en el bundle o en Git.

## Evidencia ejecutada

- `npm test`: PASS — 29 pruebas.
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm audit --audit-level=high`: PASS — sin vulnerabilidades high.
- `git diff --check`: PASS.
- `node run-qa.mjs`: PASS — 10 viewports × 12 rutas, sin overflow ni errores de consola.
- Producción anónima: `/admin` responde login sin dashboard en 390×844 y 1366×768; `/api/admin/analytics/summary` responde 401.
- Producción: solicitud de OTP aceptada por Telegram Bot API; código inválido de seis dígitos rechazado con 401.

## Cierre pendiente de la sesión real

El OTP sólo llega al Telegram privado de Federico y se almacena únicamente como hash. Este entorno no puede leer ese inbox ni recuperar el código sin debilitar el diseño. Falta ingresar el OTP recibido en producción para confirmar acceso, refresh y logout de la sesión real.
