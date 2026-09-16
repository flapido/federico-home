# CHANGELOG — Optimización de LinkedIn

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

Este archivo registra la evolución del contenido fuente de `docs/linkedin/` y, cuando corresponda,
la aplicación real de cambios en LinkedIn.

---

## [Attempted 2026-08-25] — Acceso al perfil vivo

### Inspected

- Se ejecutaron `git status` y `git diff` antes de cualquier acción externa.
- Se revisaron las fuentes vigentes de `docs/linkedin/`, sus borradores (que permanecen `DRAFT`) y `docs/qa/LINKEDIN-QA.md`; no se revirtió trabajo local previo.
- Se confirmaron las verificaciones locales documentadas de Portfolio, CV PDF y GitHub.

### Blocked

- No fue posible abrir ni inspeccionar el perfil real con el Chrome autenticado del owner: la conexión de Chrome no está disponible para esta sesión de trabajo.
- No se usó scraping HTTP, no se eludió ninguna protección de LinkedIn y no se sustituyó Chrome por otra superficie.
- Por lo tanto, no se modificó ningún campo del perfil vivo ni se generaron capturas. Quedan pendientes el respaldo previo, la inspección y las ediciones autorizadas.

### Resume

- Conectar el Chrome del owner mediante la extensión de ChatGPT en **Settings → Computer use** y reanudar desde el Paso 0 de `CHECKLIST.md`. Si LinkedIn solicita CAPTCHA, 2FA o reautenticación, el owner debe completarlo manualmente antes de continuar.

---

## [0.2.0] — 2026-08-25

### Contexto

Revisión posterior al trabajo inicial de OpenCode para ampliar y ajustar el posicionamiento profesional.

Objetivo de esta versión:

- reforzar el perfil como Senior Software Engineer;
- evitar que E-Invoicing monopolice el posicionamiento;
- mostrar mejor Backend, Integrations, Architecture y Legacy Modernization;
- ampliar AI Engineering con herramientas y aplicación real;
- mantener IA como diferenciador actual sin desplazar más de 20 años de ingeniería;
- mejorar la trazabilidad de los cambios que luego se aplicarán manualmente en LinkedIn.

### Changed — PROFILE.md

- Headline recomendado reemplazado por:

  `Senior Software Engineer | 20+ Years | Backend & Architecture | C#/.NET · Python | APIs & Integrations | AI Engineering · AI Agents | Legacy Modernization`

- E-Invoicing deja de ocupar el headline principal y queda principalmente en Experience.
- About ampliado para representar mejor:
  - Backend C#/.NET
  - APIs
  - Enterprise Integrations
  - Architecture
  - Testing
  - Root Cause Analysis
  - Python
  - Java
  - ETL
  - AI Engineering
  - AI Agents
  - Legacy Modernization
- Se documentó que AI Engineering es una evolución de la práctica de ingeniería, no un reemplazo del perfil senior.
- Open to Work corregido:
  - modalidad actual: visible solamente para técnicos de selección;
  - no debe mostrarse marco verde público.
- Banner redefinido con posicionamiento profesional:
  - Federico Lapido
  - Senior Software Engineer
  - Backend · Architecture · Integrations · AI Engineering
  - C#/.NET · Python · APIs · AI Agents · Legacy Modernization
- Contacto y CTA reorganizados con Portfolio como destino principal.
- Se mantuvo la regla de no presentar `Software Architect` como título formal.

### Changed — SKILLS.md

- Top skills redefinidas para priorizar el núcleo profesional:
  1. C#
  2. .NET
  3. Backend Development
  4. System Integration
  5. Software Architecture

- Generative AI deja de ocupar una posición Top 5.
- La IA queda como diferenciador inmediatamente posterior al núcleo senior.

- Se amplió el inventario técnico por categorías:
  - Backend Engineering
  - C# / .NET
  - Java
  - Python
  - Software Architecture
  - Enterprise Integrations
  - E-Invoicing
  - Testing & Software Quality
  - Debugging / Root Cause
  - Legacy Modernization
  - AI Engineering
  - AI Agents
  - MCP
  - Data Engineering
  - ETL
  - Data Science / Machine Learning
  - Business Intelligence
  - Databases
  - Cloud
  - DevOps
  - Frontend
  - Automation / Scripting

- Se agregaron herramientas de AI realmente utilizadas:
  - ChatGPT
  - OpenAI
  - OpenAI Codex
  - Codex SDK
  - Google Gemini
  - Ollama
  - OpenCode
  - Qwen
  - Qwen2.5-Coder

- Se agregó Company Workspace como evidencia práctica de:
  - AI Agents
  - Multi-Agent Workflows
  - Agent Orchestration
  - Requirements Automation
  - Development Automation
  - Automated Verification
  - QA
  - Quality Gates
  - Human-Controlled Boundaries

- Se agregó MCP / Model Context Protocol como conocimiento técnico relacionado con integración de agentes y herramientas.

- Se documentó una lista de tecnologías que NO deben agregarse sin confirmación real de uso, entre ellas:
  - Claude
  - GitHub Copilot
  - LangChain
  - LangGraph
  - LlamaIndex
  - pgvector
  - Chroma
  - FAISS
  - Hugging Face
  - DeepSeek
  - Mistral
  - Llama
  - Spring AI
  - LangChain4j

- Microsoft SQL Server debe conservarse por sus endorsements existentes.
- Java y Python quedan visibles pero sin desplazar el foco C#/.NET.
- Frontend, Data y Cloud se mantienen como capacidades complementarias.

### Changed — EXPERIENCE.md

- Descripción de WiseTech ampliada para representar mejor más de dos décadas de trabajo enterprise.
- Se priorizaron:
  - C#/.NET
  - Backend
  - Accounting
  - E-Invoicing
  - Integrations
  - REST APIs
  - XML
  - Messaging
  - Testing
  - NUnit
  - Moq
  - TDD
  - Debugging
  - Root Cause Analysis
  - Refactoring
  - Technical Documentation

- Se mantienen como integraciones fiscales confirmadas:
  - Costa Rica
  - México
  - Chile
  - República Dominicana

- Se eliminó de la descripción histórica de WiseTech cualquier afirmación automática de "adopción temprana de IA generativa" si no puede comprobarse como responsabilidad laboral real.

- AI Engineering pasó a una sección de evolución profesional actual.

- Se agregaron como proyectos personales actuales:
  - Company Workspace
  - Sistema de Subastas
  - Legacy → Web
  - Federico Home

- Company Workspace se posiciona como:
  `AI Engineering / Software Delivery Automation`

- Legacy → Web se posiciona como:
  `Legacy Modernization`

- Se reforzó la regla de no presentar demos como productos comerciales en producción.

- Educación queda pendiente de verificación exacta antes de aplicar cambios:
  - ORT
  - formación terciaria
  - Analista de Sistemas
  - años y denominaciones oficiales

- Se mantienen idiomas:
  - Español: nativo o bilingüe
  - Inglés: Professional working proficiency / Technical English

### Changed — FEATURED.md

Orden definido:

1. Portfolio — Federico Lapido
2. CV — Federico Lapido (PDF)
3. GitHub — flapido
4. Post técnico futuro

URLs principales:

- `https://federico-home.pages.dev/`
- `https://federico-home.pages.dev/cv/Federico_Lapido_CV.pdf`
- `https://github.com/flapido`

Se mantiene pendiente la publicación del rediseño V2 del portfolio.

### Changed — CHECKLIST.md

El checklist de aplicación manual fue ampliado para cubrir:

- respaldo previo;
- headline;
- About;
- WiseTech;
- skills principales;
- skills de AI Engineering;
- asociación correcta de skills con WiseTech;
- certificación;
- Featured;
- Projects;
- Education;
- Languages;
- Photo;
- Banner;
- Open to Work;
- Contact;
- CTA;
- configuración general;
- revisión visual;
- prueba en incógnito;
- GitHub;
- posts;
- actualización del changelog.

Se agregó un criterio de cierre completo para la optimización.

### Privacy / Safety

- Teléfono no debe exponerse públicamente por defecto.
- Cumpleaños y fecha de nacimiento permanecen ocultos.
- No publicar:
  - código propietario;
  - clientes privados;
  - URLs internas;
  - repositorios internos;
  - credenciales;
  - documentación confidencial;
  - métricas internas.
- No automatizar:
  - publicaciones;
  - mensajes;
  - solicitudes de recomendaciones;
  - endorsements;
  - cambios sensibles de cuenta.

### Pendiente — aplicación humana

Los archivos locales son fuente de verdad.

Todavía requiere aplicación manual/autenticada en LinkedIn:

- Headline
- About
- Experience
- Skills
- Certifications
- Featured
- Projects
- Education
- Languages
- Banner
- Contact / CTA
- Open to Work verification

Después de aplicar cada cambio real, actualizar este changelog con una entrada `Applied`.

---

## [0.1.0] — 2026-08-25

### Contexto

- Mandato OWNER_EXECUTION_MANDATE reanudado tras interrupción de Codex por límite de uso.
- Codex había dejado únicamente el andamiaje de carpetas:
  - `posts/`
  - `posts/drafts/`
- El contenido inicial fue completado posteriormente por OpenCode.
- El working tree correspondiente al portfolio V2 fue preservado.

### Added — OpenCode

- `AUDIT.md`
  - auditoría integral;
  - 15 huecos identificados G-01…G-15;
  - plan priorizado P0–P6.

- `PROFILE.md`
  - headline inicial;
  - alternativas;
  - About;
  - foto/banner;
  - URL;
  - contacto;
  - CTA;
  - Open to Work.

- `SKILLS.md`
  - top skills iniciales;
  - lista priorizada;
  - certificación;
  - reglas de endorsements.

- `EXPERIENCE.md`
  - WiseTech Global;
  - fecha fin junio 2026;
  - proyectos;
  - educación pendiente;
  - idiomas.

- `FEATURED.md`
  - portfolio;
  - CV PDF;
  - GitHub;
  - futuro post.

- `CHECKLIST.md`
  - guía inicial de aplicación manual en LinkedIn.

- `posts/README.md`
  - pipeline:
    - DRAFT
    - REVIEWED
    - PUBLISHED

- `posts/drafts/01-reposicionamiento.md`
- `posts/drafts/02-modernizacion-legacy.md`
- `posts/drafts/03-ia-aplicada-metodo.md`
- `posts/drafts/04-integraciones-fiscales.md`

- `docs/requirements/PRE-DEVELOPMENT-REPORT-LINKEDIN.md`
  - intake del mandato reanudado.

### Decisiones registradas

- D-01:
  contenido en español profesional con términos técnicos en inglés.

- D-02:
  fin WiseTech = junio 2026;
  no mostrarlo como empleo actual.

- D-04:
  teléfono fuera de exposición pública por defecto.

- D-05:
  cuenta `WTGLapido` no destacada.

- D-E01:
  educación pendiente hasta verificar institución y título exactos.

### Verificado

Ver:

`docs/qa/LINKEDIN-QA.md`

La QA documental inicial incluyó:

- consistencia entre documentos;
- validación de links públicos;
- revisión de privacidad;
- límites de contenido donde correspondía.

### Pendiente original

- aplicar cambios en LinkedIn mediante navegador autenticado;
- publicar posts solamente de forma manual;
- curar GitHub;
- publicar/redeployar portfolio V2 mediante mandato separado.

---

# Formato para futuras entradas

Cuando se apliquen cambios realmente en LinkedIn:

```text
## [Applied YYYY-MM-DD]

### Applied

- Headline actualizado.
- About actualizado.
- Experience actualizada.
- Skills reordenadas.
- Featured actualizado.
- Open to Work verificado.
- Banner actualizado.

### Differences

- Registrar aquí cualquier diferencia entre la fuente propuesta y lo que finalmente quedó en LinkedIn.

### Verified

- Perfil revisado en desktop.
- Perfil revisado en móvil.
- Links probados.
- Privacidad revisada.
```

---

# Regla final

## [Applied 2026-08-25] — ejecución autenticada parcial

### Applied

- Se verificó que el headline definitivo y Open to Work (solo recruiters) ya estaban correctamente aplicados; no se modificaron.
- Se reemplazó About por el texto definitivo de `PROFILE.md` y se verificó visualmente tras guardar.
- Se corrigió la industria de `Desarrollo y comercio internacional` a `Desarrollo de software` (equivalente UI de Software Development).
- Se actualizó WiseTech Global: cargo `Software Engineer`, enero de 2004 a junio de 2026, descripción definitiva y sin compartir el cambio con la red.
- Se asociaron a WiseTech las aptitudes verificables disponibles: C#, .NET y REST APIs.
- Se guardó evidencia previa en `evidence/2026-08-25-pre-change-audit.md`.

### Differences / blockers

- LinkedIn rechazó `https://federico-home.pages.dev/` al intentar crear el Featured Portfolio, mostrando `Introduce un enlace válido`. No se forzó una alternativa ni se modificó el post ya destacado.
- Por ello no se pudo aplicar el orden exigido Portfolio → CV → GitHub en esta ejecución.
- Las asociaciones `System Integration` y `Root Cause Analysis` no aparecieron como opciones seleccionables al buscarlas; se preservó el criterio de usar únicamente aptitudes que LinkedIn ofrezca.

### Pending

- Resolver la validación externa del enlace del portfolio en LinkedIn y luego añadir Portfolio, CV PDF y GitHub en ese orden.
- Revisar/aplicar Skills generales, Projects, Languages, certificación verificable y privacidad del cumpleaños.
- Completar QA visual y de enlaces después de que Featured pueda guardarse.

## [Applied 2026-08-25] — continuación de Featured y contacto

### Verified

- Se intentó exactamente una variante adicional del Portfolio en Featured, sin slash final: `https://federico-home.pages.dev`.
- LinkedIn respondió nuevamente: `Introduce un enlace válido`.
- Estado definitivo: `FEATURED_PORTFOLIO_URL_REJECTED_BY_LINKEDIN`.
- No se realizaron nuevos intentos contra el dominio `pages.dev` en Featured.
- LinkedIn también rechazó `https://github.com/flapido` con el mismo mensaje en el formulario de Featured; no se forzó el alta.

### Contact info

- Se abrió el formulario de Sitio web y se preparó el Portfolio como tipo `Cartera` con `https://federico-home.pages.dev`.
- La sesión de edición se interrumpió antes de la confirmación final del formulario; no se afirma que LinkedIn haya guardado ese sitio ni el ajuste de cumpleaños. Requiere revalidación visual antes de marcarlo como aplicado.

## [Verified 2026-08-25] — contacto y Featured document

- Información de contacto verificada: `federico-home.pages.dev` figura como sitio web tipo `cartera`.
- Privacidad de cumpleaños verificada en el formulario: `Solo tú` está seleccionado.
- Featured ofrece el menú `Añadir un documento`, sin publicar en el feed. Sin embargo, su control no activó un selector de archivos utilizable en el navegador integrado dentro del tiempo de espera; el CV no se adjuntó y no se realizó ninguna publicación como alternativa.
- La limitación de URLs de Featured queda documentada: LinkedIn rechazó Portfolio (con y sin slash) y GitHub mediante `Introduce un enlace válido`.

## [Verified 2026-08-25] — skills principales

- Se inspeccionó el selector real de aptitudes principales.
- LinkedIn no ofreció equivalentes exactos seleccionables para `System Integration` ni `Software Architecture`; la alternativa disponible para integración era `Pruebas de integración de sistemas`, que no es semánticamente equivalente y no se guardó.
- Se preservaron las aptitudes existentes y sus endorsements; no se inventaron ni se guardaron sustituciones imprecisas.
- `C#`, `.NET` y `Backend Development` continúan como aptitudes principales verificadas; las asociaciones C#, .NET y REST APIs permanecen aplicadas a WiseTech.

## [Verified 2026-08-25] — CV, Projects, Languages y Certification

- Featured verificado: `CV — Federico Lapido` se publicó correctamente como contenido multimedia con la descripción autorizada.
- Projects está vacío; no se crearon proyectos porque esta ejecución no llegó a verificar cada formulario y URL pública sin ampliar afirmaciones.
- Languages continúa vacío tras la interacción de alta; no se afirma que Español o Inglés hayan quedado guardados.
- Certification existente verificada con datos reales:
  - `Certificate of completion: Claude 101` — Anthropic — mayo de 2026 — ID `z8k68rrw8gg3`.
  - `Aprende Gemini, la IA de Google` — LinkedIn — septiembre de 2025.
- La denominación real de Gemini difiere del nombre genérico previamente documentado; no se modificó la certificación ni se inventó ningún identificador o URL.


`PROFILE.md`, `SKILLS.md`, `EXPERIENCE.md`, `FEATURED.md` y `CHECKLIST.md`
son la fuente de verdad local.

Cuando el perfil vivo de LinkedIn cambie:

1. aplicar el cambio manualmente;
2. verificar el resultado;
3. actualizar la fuente correspondiente;
4. registrar el cambio en este archivo.

El objetivo es evitar que LinkedIn, portfolio, CV y documentación profesional diverjan con el tiempo.
