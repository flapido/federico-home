# Pre-Development Report — Optimización Integral de LinkedIn

**Project:** Federico Home workspace — LinkedIn end-to-end profile optimization
**Date:** 2026-08-25
**Lifecycle:** `DEVELOPMENT_AUTHORIZED` — OWNER_EXECUTION_MANDATE (reanudado tras interrupción de Codex por límite de uso)
**Status:** Intake completo; trabajo local autorizado sin nueva aprobación.

## 1. Decisión ejecutiva

Auditar, completar y optimizar de punta a punta el perfil de LinkedIn de **Federico Lapido**
(https://www.linkedin.com/in/federico-lapido/) usando como fuentes de verdad:

- CV immutable: `docs/inbox/Federico_Lapido_CV.pdf`
- Datos profesionales estructurados ya verificados contra el CV: `src/data/cv.ts`
- Portfolio público: https://federico-home.pages.dev/
- GitHub público: https://github.com/flapido

El mandato es **local-first**: producir toda la auditoría y el contenido listo para aplicar.
La aplicación real en LinkedIn requiere navegador autenticado del owner; ese paso queda
identificado paso a paso en `docs/linkedin/CHECKLIST.md` pero NO se ejecuta desde aquí.

## 2. Estado heredado (dónde quedó interrumpido)

| Elemento | Estado encontrado |
|---|---|
| `docs/linkedin/` | Existía solo como estructura de carpetas vacías (`posts/`, `posts/drafts/`) |
| `PROFILE.md`, `SKILLS.md`, `EXPERIENCE.md`, `FEATURED.md`, `CHANGELOG.md` | **No existían** |
| Borradores de posts | **Ninguno** |
| Working tree | Contiene trabajo previo NO relacionado (rediseño V2 del portfolio, completado localmente, sin commit autorizado) |

Conclusión: Codex completó únicamente el **andamiaje de carpetas**. Todo el contenido se produce en esta reanudación,
conservando la estructura creada.

## 3. Evidencia verificada

### Del CV immutable (texto extraído 2026-08-25)

- Federico Lapido — Buenos Aires, Argentina.
- Headline del CV: `Software Engineer | C#/.NET | E-Invoicing Integrations | AI-Assisted Development`.
- Contacto en CV: lapidofederico@gmail.com · teléfono (ya publicado por el owner en su propio CV; no se ampliará exposición).
- LinkedIn: www.linkedin.com/in/federico-lapido · GitHub: github.com/flapido y cuenta secundaria `WTGLapido`.
- Perfil profesional: backend y soluciones empresariales en ecosistema CargoWise; integraciones de facturación
  electrónica para Latinoamérica; pipelines de mensajería; mapping de documentos fiscales; lógica C#/.NET;
  calidad de código, testing automatizado y arquitectura mantenible; uso activo de IA generativa y prompt engineering.
- Experiencia: **WiseTech Global — Software Engineer, Buenos Aires, 2004 · June 2026**, con los 8 puntos detallados
  (Accounting/E-Invoicing, 4 países fiscales, handlers/pipelines/XML mappers, NUnit/Moq/TDD, refactoring,
  investigación de incidentes/RCA, documentación técnica y DFRs, adopción de IA).
- Proyectos relevantes según CV: Integraciones de Facturación Electrónica · Automatización de Testing · Adopción de IA en Desarrollo.
- Skills del CV: C#, SQL, .NET, REST APIs, CargoWise, Clean Code, SOLID, Dependency Injection, NUnit, Moq,
  Git, GitHub, Azure DevOps, VS Code, Prompt Engineering, desarrollo asistido con IA.
- Idiomas: Español nativo · Inglés profesional técnico.

### De `src/data/cv.ts` (ya conciliado con el CV durante intake V2)

- Taxonomía completa de expertise en 11 categorías (backend, integraciones, arquitectura, AI, calidad,
  Java, datos/ETL, bases de datos, cloud, frontend complementario, BI).
- Certificación exacta: **Google Gemini — Artificial Intelligence**, LinkedIn Learning, 2025 (usar solo esta etiqueta).
- Educación tal cual: “Estudios en Tecnología de la Información”, Argentina (no inventar instituciones).

### De fuentes públicas (consultadas 2026-08-25)

- **GitHub flapido:** 6 repositorios públicos (apphistory-project, mimascota, asesora-laura,
  stock-subastas-demo, legacy-app-explorer-demo, federico-home). Sin bio ni perfil personalizado visible.
- **Portfolio:** https://federico-home.pages.dev/ responde 200; sirve todavía un build anterior al rediseño V2
  (título “Federico Lapido — Ideas convertidas en cosas que funcionan”). Rutas estables existentes:
  `/`, `/proyectos`, `/lab`, `/about`, `/cv`.

### Acceso a LinkedIn autenticado

- `GET https://www.linkedin.com/in/federico-lapido/` devuelve **HTTP 999** (bloqueo anti-bot).
- OpenCode no dispone de navegador autenticado del owner.
- Consecuencia (prevista por el mandato): se completa toda la auditoría/documentación local y queda
  identificado en `CHECKLIST.md` lo que exige navegador autenticado. Esto NO bloquea el resto del trabajo.

## 4. Alcance

### Incluido

1. Auditoría basada en evidencia del perfil objetivo vs. estado conocido, con huecos priorizados.
2. Contenido fuente de verdad listo para pegar: perfil (headline/about/configuración), habilidades,
   experiencia, educación/certificaciones/idiomas, destacados.
3. Borradores de posts (estado DRAFT; publicación prohibida en este mandato).
4. Checklist de aplicación con navegador autenticado, ordenada y verificable.
5. CHANGELOG del trabajo.
6. QA independiente: consistencia entre archivos, validez de links públicos, línea base de privacidad/seguridad.

### Excluido (límites duros del owner)

- Publicar posts, enviar mensajes, invitaciones, postulaciones o contacto con recruiters.
- Borrar publicaciones existentes.
- Commit, push, merge, deploy, publicación, cambios en producción.
- Modificar `docs/inbox/` u otras fuentes immutable.
- Inventar títulos, promociones, métricas, clientes, credenciales, educación o empleadores.

## 5. Decisiones y supuestos

| ID | Supuesto/decisión | Justificación |
|---|---|---|
| D-01 | Idioma del contenido LinkedIn: español profesional, términos técnicos en inglés. | Coincide con CV, sitio y audiencia principal; criterio ya establecido en V2 (D-03 del reporte V2). |
| D-02 | Posicionamiento temporal: experiencia WiseTech finaliza June 2026 (dato del CV); no se afirma nuevo empleador. | Único dato respaldado por evidencia; evita afirmar empleo actual inexistente. |
| D-03 | Headline orientado a búsqueda de recruiters con keywords (C#, .NET, Integrations, AI). | Objetivo declarado de optimización integral. |
| D-04 | Teléfono fuera del alcance: no se agrega ni promueve exposición adicional. | Privacidad por defecto; el número ya está en el CV impreso a discreción del owner. |
| D-05 | Cuenta `WTGLapido`: no destacar en LinkedIn personal; decisión del owner registrada como abierta. | Aparece solo en CV; sin evidencia de rol público deseado. |
| D-06 | Links de Destacados apuntan a rutas estables del portfolio válidas en build actual y V2. | El deploy V2 está pendiente y no está autorizado en este mandato. |
| D-07 | Se conserva el andamiaje de carpetas creado por Codex y se llena con contenido nuevo. | Mandato: conservar trabajo válido, no empezar de cero. |
| D-08 | “Open to work” se documenta como opción (recomendación incluida), no se presupone activado. | Requiere acción explícita del owner en su sesión. |

## 6. Riesgos y manejo

| ID | Riesgo | Manejo |
|---|---|---|
| R-01 | No poder auditar el estado real del perfil vivo. | CHECKLIST incluye paso 0: captura/export del estado actual antes de cambiar nada. |
| R-02 | Sobredeclarar seniority o inventar logros. | Solo hechos del CV + taxonomía owner-supply ya aceptada; prohibición explícita de métricas inventadas. |
| R-03 | Exponer información propietaria (CargoWise internals, clientes). | Mencionar solo lo que el propio CV público ya publica; revisión de privacidad obligatoria en QA. |
| R-04 | Desalineación entre portfolio deployado (build viejo) y contenido nuevo. | FEATURED usa rutas estables; nota explícita de que el redeploy es decisión separada. |
| R-05 | Límites de caracteres de LinkedIn (headline 220, about ~2600, experiencias ~2000). | Cada pieza se entrega dentro de límites y con recuento verificado en QA. |

No hay bloqueos de requisitos. El único límite externo real (acceso autenticado a LinkedIn) tiene
el camino alternativo definido por el propio mandato.
