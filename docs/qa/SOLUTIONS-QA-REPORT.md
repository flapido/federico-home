# QA Report — Soluciones V2.1

Fecha: 2026-08-26

## Resultado

**PASS**

- `npm test`: 15/15 PASS.
- `npm run lint`: PASS.
- `npm run build`: PASS.
- `npm audit --audit-level=high`: 0 vulnerabilidades.
- `git diff --check`: PASS.
- `node run-qa.mjs`: PASS — 10 viewports × 9 rutas, sin overflow, respuestas fallidas ni errores propios de consola.

## Revisión funcional y visual

Se verificó la ruta directa `/soluciones`, los CTAs hacia casos/contacto, la navegación desktop/móvil y el retorno a Home. Se inspeccionaron renderizados de `/soluciones` en 320×568, 390×844 y 1440×900; la matriz automática cubrió además 360, 375, 412, 430, 1024, 1366 y 1920 de ancho. Las cards apilan sin clipping en móvil y conservan lectura problema → solución → adaptación en escritorio.

## Seguridad y privacidad

Los tres assets copiados se inspeccionaron visualmente antes de incorporarse. Son capturas de producto/datos de demo o QA local; no exponen credenciales, tokens, teléfonos, emails, cuentas autenticadas ni rutas locales. El contenido, nombres de assets y bundle se buscaron contra `quiniela`/`quiniela-analytics`: sin coincidencias en el alcance V2.1.

## Producción

Cloudflare Pages confirmó HTTP 200 para `/`, `/soluciones`, `/proyectos`, `/lab`, `/about` y `/cv`. En producción, Chromium verificó `/soluciones` a 390×844 y 1440×900: título/hero y caso de Subastas presentes, tres imágenes cargadas, cero overflow, cero errores de consola y cero presencia de Quiniela. La solicitud a Google Fonts falló bajo el aislamiento de red del runner, comportamiento externo ya conocido; los fallbacks locales mantuvieron la página correctamente renderizada.
