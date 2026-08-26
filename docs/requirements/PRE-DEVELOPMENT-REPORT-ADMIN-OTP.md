# Pre-development report — Admin OTP

Fecha: 2026-08-26

## Decisión de seguridad

`/admin` se protege server-side mediante un código OTP de seis dígitos generado con Web Crypto, enviado solo al chat privado de Telegram ya configurado. D1 almacena únicamente el hash HMAC del código, su vencimiento, intentos y consumo; nunca el código en claro.

La verificación válida crea una sesión aleatoria de 256 bits. D1 almacena el hash HMAC del token y el navegador recibe solo una cookie `HttpOnly`, `Secure`, `SameSite=Strict`, `Path=/`, con duración de ocho horas. El frontend no conserva OTP ni autenticación en localStorage.

## Límites

- OTP: 5 minutos, uso único, máximo cinco intentos.
- Solicitud: máximo tres códigos por quince minutos, sin IP ni identificadores personales persistidos.
- `/admin`, `/admin/*` y `/api/admin/*` requieren sesión válida server-side.
- Telegram, D1 o analytics fallidos responden de forma genérica y no exponen configuración.
