# LINKEDIN-QA.md — Evidencia de verificación independiente

**Fecha:** 2026-08-25 · **Verificador:** rol Verifier/QA (independiente del autor del contenido)
**Alcance:** documentos `docs/linkedin/**` + reporte de intake del mandato LinkedIn.

## Resultado: `PRODUCT_QUALITY_GATE: PASS` (alcance documental local)

Con el bloqueo externo documentado (lectura de perfil vivo, HTTP 999), la calidad se evalúa
sobre lo verificable localmente. Todos los chequeos aplicables resultaron PASS.

## 1. Límites de caracteres (script real, salida registrada)

| Pieza | Límite | Medido | Resultado |
|---|---|---|---|
| Headline A (recomendado) | 220 | 152 | PASS |
| Headline B (alternativa) | 220 | 156 | PASS |
| Headline C (alternativa) | 220 | 153 | PASS |
| About (`PROFILE.md` §3) | ~2600 | 1227 | PASS |
| Descripción WiseTech (`EXPERIENCE.md` §1) | ~2000 | 1031 | PASS |
| Post 01 reposicionamiento | 3000 / objetivo <1300 | 1110 | PASS |
| Post 02 legacy | 3000 / objetivo <1300 | 1067 | PASS |
| Post 03 IA método | 3000 / objetivo <1300 | 1148 | PASS |
| Post 04 integraciones fiscales | 3000 | 1316 | PASS |

Método: extracción por regex de bloques cercados ``` en cada `.md` + conteo exacto
(`Temp\opencode\linkedin_qa.py`). Recuentos declarados en los documentos corregidos para
coincidir con los medidos.

## 2. Validez de links públicos (HTTP real)

| URL | Estado |
|---|---|
| https://federico-home.pages.dev/ | 200 OK |
| https://federico-home.pages.dev/proyectos | 200 OK |
| https://federico-home.pages.dev/cv/Federico_Lapido_CV.pdf | 200 OK — mismo CV que el inbox immutable |
| https://github.com/flapido | 200 OK |
| https://github.com/flapido/legacy-app-explorer-demo | 200 OK |
| https://www.linkedin.com/in/federico-lapido/ | **999 (bloqueo anti-bot)** — bloqueo externo conocido; aplicación vía navegador autenticado |

## 3. Consistencia entre documentos

- Referencias cruzadas entre AUDIT/PROFILE/SKILLS/EXPERIENCE/FEATURED/CHECKLIST/CHANGELOG: resueltas.
- Índice `posts/README.md` ↔ archivos en `posts/drafts/`: coinciden (4 borradores).
- Fechas y etiquetas clave coherentes: WiseTech 2004 – jun. 2026 en AUDIT/EXPERIENCE/PROFILE;
  certificación “Google Gemini — Artificial Intelligence · LinkedIn Learning · 2025” idéntica en SKILLS y EXPERIENCE.
- Fuente de verdad profesional: hechos tomados del CV immutable (texto extraído 2026-08-25)
  y taxonomía ya conciliada en `src/data/cv.ts`. Sin métricas ni logros inventados.

## 4. Línea base de privacidad/seguridad

- Teléfono: **0 apariciones** en todo `docs/linkedin/**` (verificación por patrón).
- CargoWise: nombrado solo como producto, igual que en el CV público del owner; sin internals,
  clientes, URLs internas ni datos privados.
- Cuenta secundaria `WTGLapido`: mencionada solo como decisión abierta D-05, no promovida.
- Sin clichés prohibidos en contenido propuesto (la mención en `AUDIT.md` es la regla que los lista).
- Posts: cero datos de clientes o empleadores más allá de lo ya público en el CV.
- Fuentes immutables (`docs/inbox/`) intactas.

## 5. Bloqueos externos registrados

| Bloqueo | Evidencia | Mitigación |
|---|---|---|
| Lectura del perfil vivo de LinkedIn | HTTP 999 desde OpenCode | Paso 0 de `CHECKLIST.md` (respaldo/captura del estado actual antes de aplicar cambios) |
| Aplicación/publicación en LinkedIn | Requiere sesión autenticada del owner | `CHECKLIST.md` pasos 1–7, ejecución humana |
