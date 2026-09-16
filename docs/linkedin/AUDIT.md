# Auditoría Integral — Perfil de LinkedIn (federico-lapido)

**Fecha:** 2026-08-25
**Mandato:** OWNER_EXECUTION_MANDATE — optimización integral de LinkedIn
**Alcance:** auditoría basada en evidencia + contenido objetivo listo para aplicar
**Estado de acceso:** el perfil en vivo NO pudo consultarse desde OpenCode (HTTP 999, bloqueo anti-bot de LinkedIn).
Toda la auditoría se construye sobre las fuentes verificadas listadas abajo; la verificación visual del estado actual
queda como paso 0 del checklist con navegador autenticado (`CHECKLIST.md`).

## 1. Fuentes y método

| Fuente | Estado | Uso |
|---|---|---|
| `docs/inbox/Federico_Lapido_CV.pdf` | Leído íntegro (extracción de texto 2026-08-25) | Fuente primaria de hechos profesionales |
| `src/data/cv.ts` | Leído; ya conciliado contra el CV durante intake V2 | Taxonomía de expertise y datos estructurados |
| https://github.com/flapido | Consultado públicamente | Presencia de código y demos públicas |
| https://federico-home.pages.dev/ | Consultado (200 OK) | Destino de tráfico del perfil |
| linkedin.com/in/federico-lapido | **Bloqueado (HTTP 999)** | Requiere navegador autenticado del owner |

Método: cada recomendación se apoya en un hecho verificado o queda marcada como decisión abierta del owner.
No se inventan métricas, logros, títulos ni credenciales.

## 2. Posicionamiento actual (evidencia disponible)

- El CV público posiciona: `Software Engineer | C#/.NET | E-Invoicing Integrations | AI-Assisted Development`,
  WiseTech Global 2004 · June 2026, integraciones fiscales LatAm (CR, MX, CL, RD), calidad/TDD/RCA e IA aplicada.
- GitHub público existe pero sin bio configurada ni repos fijados visibles como curados (popular repos = orden por defecto).
- Portfolio activo en federico-home.pages.dev (build anterior al rediseño V2; redeploy pendiente fuera de este mandato).
- La experiencia WiseTech finalizó en junio 2026 según CV → el posicionamiento natural post-junio-2026 es
  **Senior Software Engineer disponible para nuevos desafíos**, sin afirmar empleador actual.

## 3. Análisis de huecos por sección

| # | Sección LinkedIn | Objetivo (estado deseado) | Hueco detectado / riesgo | Documento con contenido | Aplicación |
|---|---|---|---|---|---|
| G-01 | Headline (220 chars) | Headline con keywords buscables por recruiters: Senior Software Engineer, Backend, Integraciones, Arquitectura, IA, C#/.NET | Sin evidencia del texto vigente; el del CV no menciona seniority ni arquitectura | `PROFILE.md` §1 | Navegador autenticado |
| G-02 | Foto y banner | Foto profesional real (existe en repo) + banner alineado a identidad editorial | No verificable sin sesión; banner probablemente inexistente | `PROFILE.md` §2 | Navegador autenticado |
| G-03 | Acerca de (About) | Relato en primera persona: 20+ años, backend/integraciones/arquitectura, IA con control humano, CTA a portfolio/CV | Sin evidencia del texto vigente | `PROFILE.md` §3 | Navegador autenticado |
| G-04 | URL personalizada | `linkedin.com/in/federico-lapido` | Ya correcta (aparece así en el CV) — solo confirmar | `PROFILE.md` §4 | Verificación rápida |
| G-05 | Contacto (info de contacto) | Email profesional visible; teléfono según decisión del owner; website = portfolio | Sin evidencia; teléfono ya expuesto en CV impreso (no ampliar) | `PROFILE.md` §5 | Navegador autenticado |
| G-06 | Experiencia — WiseTech | Puesto único “Software Engineer”, 2004 – jun. 2026, descripción con los 8 frentes del CV reescritos en clave de valor | Sin evidencia del texto vigente; riesgo de descripción vacía o desactualizada (sin fecha de fin) | `EXPERIENCE.md` §1 | Navegador autenticado |
| G-07 | Proyectos (sección) | 3 proyectos del CV adaptados como entradas de proyectos vinculables | Probablemente inexistente | `EXPERIENCE.md` §2 | Navegador autenticado |
| G-08 | Educación y certificaciones | Educación tal cual CV + certificación exacta Google Gemini (LinkedIn Learning, 2025) | Sin evidencia; riesgo de etiqueta incorrecta de la certificación | `EXPERIENCE.md` §3–4 | Navegador autenticado |
| G-09 | Idiomas | Español nativo + Inglés profesional técnico | Sin evidencia | `EXPERIENCE.md` §5 | Navegador autenticado |
| G-10 | Skills (hasta 100; top 5 fijadas) | Lista priorizada ~50 skills alineada a búsqueda de recruiters y coherente con experiencia | Sin evidencia; riesgo de lista corta o no alineada a búsquedas | `SKILLS.md` | Navegador autenticado |
| G-11 | Destacados (Featured) | Portfolio, GitHub, CV PDF y primer post fijados en orden de conversión | Sin evidencia; riesgo de sección vacía u obsoleta | `FEATURED.md` | Navegador autenticado |
| G-12 | Modo creador / actividad | Decisión informada: activar solo al publicar con regularidad | Sin evidencia | `PROFILE.md` §7 | Opcional |
| G-13 | Open to Work | Recomendación documentada (visible solo para recruiters vs. público) | Sin evidencia; requiere decisión explícita del owner | `PROFILE.md` §8 | Opcional |
| G-14 | Contenido (posts) | Pipeline de borradores listos para revisión del owner | Inexistente hasta ahora | `posts/drafts/` | Publicación prohibida en este mandato |
| G-15 | GitHub complementario | Bio + repos fijados para coherencia con LinkedIn (quien llega desde LinkedIn aterriza bien) | Bio ausente; popular repos sin curar | `FEATURED.md` §4 | Fuera de LinkedIn, bajo control del owner |

## 4. Principios de contenido aplicados

1. Solo hechos del CV + taxonomía owner-supply ya aceptada en V2. Cero métricas inventadas.
2. Sin clichés de seniority (guru/ninja/rockstar/etc.) ni barras/porcentajes de skills.
3. CargoWise se nombra únicamente porque el propio CV público del owner ya lo publica; nada de internals,
   clientes ni datos privados.
4. IA presentada como método con control humano (arquitectura, tests y revisión siguen siendo responsabilidad humana).
5. Español profesional con términos técnicos en inglés (coherente con sitio y CV).
6. Cada pieza respeta los límites reales de caracteres de LinkedIn.

## 5. Plan priorizado de aplicación

| Prioridad | Acción | Evidencia de valor |
|---|---|---|
| P0 | Paso 0 del CHECKLIST: export/captura del estado actual antes de tocar nada | Trazabilidad y rollback |
| P1 | Headline + About + Experiencia (G-01, G-03, G-06) | Es lo que ve un recruiter en los primeros 5–10 segundos y lo que indexa la búsqueda |
| P2 | Skills priorizadas + top 5 fijadas (G-10) | Motor de matching de recruiters y LinkedIn Recruiter |
| P3 | Destacados: portfolio, GitHub, CV (G-11) | Conversión: del perfil a la evidencia |
| P4 | Proyectos, educación, certificación, idiomas (G-07–G-09) | Completitud y credibilidad |
| P5 | Foto/banner, contacto, Open-to-Work, modo creador (G-02, G-05, G-12, G-13) | Presentación y señales de disponibilidad |
| P6 | Posts (G-14): revisión del owner → publicación manual cuando decida | Visibilidad sostenida |

## 6. Resultado de la auditoría

- **Bloqueo externo real:** lectura del perfil vivo (HTTP 999). Mitigado con paso 0 del checklist.
- **Huecos cubiertos localmente:** 15 de 15 tienen contenido o decisión documentada en esta carpeta.
- **Pendiente de acción humana:** aplicación en LinkedIn según `CHECKLIST.md`; publicación de posts a discreción del owner;
  redeploy del portfolio V2 (mandato separado).
