# QA Report — Federico Home V2

Fecha: 2026-08-25  
Alcance: verificación independiente de la V2 local  
Base URL: `http://127.0.0.1:5173`

## Resultado

**PRODUCT_QUALITY_GATE: PASS para el alcance local de Federico Home V2.**

El navegador integrado de la sesión no está conectado (`agent.browsers.list() = []`). La evidencia renderizada se obtuvo con el runner local de Playwright autorizado por el mandato (`node run-qa.mjs`) y se inspeccionaron sus capturas en `screenshots/v2/`. No se usó HTTP scraping contra LinkedIn.

## Pruebas automáticas

| Comando | Resultado |
|---|---|
| `npm test` | PASS — 3 archivos, 14 tests |
| `npm run lint` | PASS |
| `npm run build` | PASS — 42 módulos; JS 316.82 kB / 94.02 kB gzip; CSS 38.53 kB / 7.81 kB gzip |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilidades |
| `node run-qa.mjs` | PASS — 10 viewports × 8 rutas, sin overflow ni errores de consola detectados |

## QA funcional independiente

Runner local Playwright headless, viewport 390×844, con consola y requests fallidos observados:

- Home: identidad, seniority, especialidades, 20+ años y CTA principal — PASS.
- Menú móvil: apertura, navegación visible y cierre — PASS.
- Anchor de Technical Expertise hacia `/cv#skills` — PASS.
- Índice de proyectos y case study de Subastas con `LOCAL_DEMO` — PASS.
- Slider Legacy → Web — PASS.
- CV: WiseTech visible, enlace de descarga `/cv/Federico_Lapido_CV.pdf` y respuesta 200 — PASS.
- Ruta 404 — PASS.
- Rutas clave sin overflow horizontal — PASS.
- Consola: 0 errores. Requests propios fallidos: 0. El bloqueo ORB de Google Fonts observado en un primer intento del entorno fue excluido del criterio propio; el runner visual completó la matriz con los fallbacks disponibles.

## QA visual y responsive

`run-qa.mjs` generó capturas para 320×568, 360×800, 375×812, 390×844, 412×915, 430×932, 1024×768, 1366×768, 1440×900 y 1920×1080 en `screenshots/v2/`. Se inspeccionaron especialmente Home a 320, 390, 1366, 1440 y 1920; proyectos, Subastas, Company Workspace, Lab, About, CV y 404 también fueron renderizados.

Senior Design Review V2: **PASS**, incluyendo recheck de los dos hallazgos iniciales (workflow 4+3/4+4 y contraste AA).

## Regresión

La memoria existente de V1 se conserva como historial. La cobertura V2 ejecutada se registra en `docs/qa/SCENARIOS.md` bajo `V2-RECHECK-2026-08-25`; no se declaran como reejecutados escenarios de previews que no fueron interactuados en esta pasada.

## Seguridad y privacidad

La revisión estática V2 está en `docs/SECURITY-REVIEW-V2.md`. El sitio es una SPA estática sin backend, autenticación, uploads ni datos de clientes. Los únicos contactos públicos provienen del CV confirmado; no se exponen teléfonos, secretos, dominios placeholder, URLs internas ni código propietario en el bundle.

## Avatar animado de Sobre mí

QA funcional específico PASS (Playwright local): 7/7 escenarios. Se verificaron autoplay muted/playsInline, reproducción única con permanencia del frame final, nueva reproducción al volver a `/about`, fallback ante error de carga, `prefers-reduced-motion`, aislamiento de Home (sin render ni request del MP4), consola limpia y cero requests fallidos propios. La matriz responsive de 320×568, 390×844, 430×932, 1024×768, 1366×768 y 1920×1080 quedó sin overflow ni cambio de geometría relevante; capturas en `test-results/about-avatar-*.png`.

Recheck 2026-08-26: poster/fallback actualizado a `public/fotos/federico-about.jpg` (1672×941, 16:9), video con `poster` y contenedor `aspect-video`; smoke visual Playwright en 8 viewports PASS.

## Demo Mode

**NOT APPLICABLE / NOT AFFECTED.** Federico Home no tiene `docs/demo/manifest.json` y, por contrato, solo presenta previews y metadata de proyectos hermanos.

## Limitaciones

- La sesión LinkedIn viva no fue consultada: LinkedIn bloquea HTTP con 999 y no hay Browser/Chrome autenticado conectado.
- No se hicieron cambios, publicaciones ni mensajes en LinkedIn.
- `DIAGNOSTICO.md` es un archivo no rastreado preexistente y queda fuera del bundle y del alcance modificado.
