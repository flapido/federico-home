# Pre-Development Report — Federico Home V2

**Project:** Federico Home — Senior Engineering Portfolio
**Date:** 2026-08-25
**Lifecycle:** `DEVELOPMENT_AUTHORIZED` — OWNER_EXECUTION_MANDATE
**Status:** Intake and requirements review complete; proceed locally without a further approval.

## 1. Executive decision

Transform the existing editorial “Casa Digital” hub into a professional portfolio and visual CV for **Federico Lapido, Senior Software Engineer**. The product must make seniority, enterprise backend/integration depth, architecture experience, legacy modernization, testing/quality, and applied AI engineering clear within the first screen, while preserving the warm editorial identity already established.

The V2 remains a static React/Vite hub. It does **not** absorb the implementation of sibling products or their demos, connect to real databases, expose employer-confidential material, or claim unverified outcomes. The mandate explicitly authorizes the ordinary local work needed to implement and verify this scope; it does not authorize commit, push, merge, deploy, publication, DNS, production access, credentials, destructive operations, or external messages.

## 2. Intake evidence

### Sources read

| Source | Type | What it establishes |
|---|---|---|
| Owner mandate, Federico Home V2 | Explicit requirement | Product positioning, priority areas, content boundaries, mandatory quality gates and delivery boundary. |
| `docs/inbox/Federico_Lapido_CV.pdf` | Immutable source; 1 page | Confirmed public professional summary, WiseTech role, locations, countries, technical practices, GitHub/LinkedIn, real email and phone as printed in the CV. |
| `public/cv/Federico_Lapido_CV.pdf` | Existing public copy | SHA-256 matches the inbox PDF exactly; it is the same CV currently downloadable. |
| `src/data/cv.ts` | Existing professional site data | Current structured content, exact certification label currently used, languages, existing experience and project themes. |
| `README.md`, `src/data/projects.ts`, `src/config/domains.ts`, routes/pages/previews | Current product implementation | Existing hub boundary, routes, visual language, project metadata and public placeholder/status issues. |
| `docs/qa/SCENARIOS.md`, V1 design/security/gate reports | Existing QA/documentation | V1 decisions worth preserving; old V1 PASS evidence is not V2 evidence. |
| `C:\Dev\Company-Workspace\projects.index.json` and canonical operating docs | Workspace state | `federico-home` is registered with project id `54a63aac-05bc-4ad2-a64c-8b90f97034bd`, path `C:\Dev\Projects\federico-home`, status `Planning`; it lacks `managed: true` and other managed metadata. |
| Sibling project README/manifests | Project evidence | Subastas and Legacy have independent demo projects and manifests; Company Workspace is the governing local process; limited evidence exists for other prospective Lab items. |

### Inbox inventory

- `docs/inbox/Federico_Lapido_CV.pdf` — inspected, **not modified**. One-page PDF with selectable text, no embedded images. It supersedes the V1 report’s former statement that the inbox was empty and the CV unavailable.

### Current technical baseline

- Vite + React 19 + TypeScript + React Router 7 + Tailwind CSS 4.
- Static SPA; no backend, auth, form submission, database, analytics, or runtime integration is present in Federico Home.
- Existing routes: `/`, `/proyectos`, `/proyectos/:slug`, `/lab`, `/about`, `/cv`, and a controlled 404.
- Existing image: `public/fotos/federico-profile.jpg` is a real profile photo and may be retained with a reviewed crop.
- `public/favicon.svg` is still the purple Vite mark and must be replaced by an identity-aligned favicon. Existing starter assets/icons should not influence the V2 visual language.
- Current identity tokens are explicit in `src/index.css`: paper `#FDFBF7`, ink `#1C1E1B`, terracotta/clay `#C07A5A`, brass `#C9A86A`, moss `#4A5A52`, hairline `#E8E2D9`; Fraunces, Instrument Sans and Fragment Mono are the currently loaded fonts. Preserve this direction unless the Senior Designer finds a rendered-product defect.

## 3. Confirmed professional facts and evidence boundary

### Verified directly by the inbox CV

- Federico Lapido; Buenos Aires, Argentina.
- Current printed headline: Software Engineer, C#/.NET, E-Invoicing Integrations, AI-Assisted Development.
- WiseTech Global — Software Engineer, Buenos Aires; `2004 · June 2026`.
- Backend work for CargoWise Accounting and E-Invoicing; fiscal integrations for Costa Rica, México, Chile and República Dominicana.
- Handlers, messaging pipelines, XML document mappings, C#/.NET integration logic, REST APIs, NUnit, Moq, TDD, refactoring, production-incident investigation/root-cause analysis, technical documentation and Developer Functional Reviews.
- GitHub `https://github.com/flapido`, LinkedIn `https://www.linkedin.com/in/federico-lapido`, and email `lapidofederico@gmail.com` appear in the immutable CV. The PDF also contains a phone number; its display on the V2 web UI is not required and should remain omitted unless the implementation team documents a deliberate privacy decision.
- Spanish native; English professional/technical level.

### Owner-supplied V2 professional scope

The mandate is an authorized source for the requested technical-expertise inventory: C#/.NET, Java ecosystem, Python/data/ETL, integrations/messaging, architecture, cloud/DevOps, complementary frontend, testing/quality, legacy modernization, and AI engineering. These should be represented as **experience or technical knowledge by category**, not as numeric proficiency, current primary stack, certifications, job titles, customer work, or employer-specific tool usage unless separately evidenced.

### Current-site data usable with care

- `src/data/cv.ts` contains the exact currently published certification string: **Google Gemini — Artificial Intelligence**, issuer **LinkedIn Learning**, year **2025**. Keep this exact label only; do not embellish it with unverified credential IDs, provider claims, or skills.
- It also contains a synthetic placeholder email (`federico.lapido@email.com`), which must not appear in V2. Replace it with the CV-confirmed email only if the final privacy review retains an email contact; otherwise omit email from the UI and retain LinkedIn/GitHub.
- Existing project copy and Lab entries are not sufficient evidence by themselves for claims of production status, customers, commercial use, users, metrics, or completed scope.

### Explicit content constraints

- Never publish CargoWise proprietary code, private customer names, data, internal URLs, credentials, client metrics, revenue, user counts, team/country claims beyond the four confirmed fiscal-integration countries, or invented career promotions.
- Do not claim a formal Software Architect title. Communicate architecture experience through work, decisions, and expertise.
- Do not use seniority clichés (`guru`, `ninja`, `rockstar`, `wizard`, `10x`, `world class`, `genius`) or false skill percentages/bars.
- The AI section must present a human-controlled engineering method: architecture, technical judgment, testing and review remain human responsibilities.

## 4. Project registration and Demo Mode assessment

### Company Workspace registration

`federico-home` is present in the Workspace registry, but its record has only name, path, project ID, timestamps and `Planning` status. It is **registered but not fully marked as managed** because `managed: true` is absent. This does not block the owner mandate or local V2 work. Updating registry metadata is a separate Workspace-maintenance decision and is not required to implement the portfolio.

### Hub boundary (preserve)

Federico Home is a showroom/hub. It must not import sibling product code, maintain their business logic, connect to their databases, or take ownership of their demos. Previews may remain lightweight marketing representations with fictitious data and a clear label. A project demo remains independently owned by its `*-demo` project and its own `docs/qa/SCENARIOS.md`.

### Evidence-backed demo status resolution

| Project | Current hub data | Sibling evidence | V2 treatment |
|---|---|---|---|
| Sistema de Subastas | `LIVE_DEMO` and an external Pages URL in `projects.ts` | `stock-subastas/docs/demo/manifest.json`: `sync=SYNCED`, `qa=PASS`, `federicoHome.demoStatus=LOCAL_READY`, `demoUrl=null` | Treat as `LOCAL_DEMO` / local-ready, not a public live demo, until a non-null verified public URL is supplied. |
| Legacy → Web | `LIVE_DEMO` and an external Pages URL in `projects.ts` | `legacy-app-explorer-demo/docs/demo/manifest.json`: `sync=SYNCED`, `qa=PASS`, `federicoHome.demoStatus=LOCAL_READY`, `demoUrl=null`; demo is explicitly fictitious/isolated | Treat as `LOCAL_DEMO` / local-ready, not live. Case study may describe the modernization approach without representing the demo as a client system. |
| Tickets, Venta Prepaga, Company Workspace | `PREVIEW` | No current manifest evidence was found in this intake | Keep `PREVIEW`; do not add a demo or public URL. |

The sibling manifests are the more specific current source for demo availability, so they win over stale hub URLs and V1 README statements. `demo-mode` for Federico Home itself is **not applicable**: this project is the hub and owns no product demo.

### Other candidate projects

- **Company Workspace:** verified locally as the process/tooling repository that defines OWNER_EXECUTION_MANDATE, roles, requirements, design review, development, verifier/QA, security baseline, regression memory and quality gates. It qualifies as a featured engineering case study, with the explicit constraint that it is human-controlled and not an “autonomous company”.
- **Quiniela Analytics:** a real Django/PostgreSQL analytical project exists. It has active scope limits and deferred blocks; include only after the implementation team extracts a public-safe, evidence-backed description and state. It is not part of the required V2 project set.
- **FastAPI + Ollama lab:** a small local FastAPI endpoint forwarding a question to local Ollama (`qwen2.5-coder:7b`) exists, but it has no README, tests, public-safe description, or stated readiness. Do not promote it as a completed portfolio project. It may be listed only as a clearly labelled Lab experiment if verified during implementation.
- **Home Assistant:** a documented planning/prototype repository exists with sensitive integration scope. It should not be added to this public portfolio without a separate public-safe review.

## 5. Product scope

### Primary audiences and jobs

| Audience | Job to be done | Required outcome |
|---|---|---|
| Recruiter | Rapidly understand seniority, role fit, experience and contact path. | Within five seconds, see Federico, Senior Software Engineer, 20+ years, backend/architecture/integrations/AI, and a primary action. |
| Prospective company/technical leader | Assess engineering depth, modernization judgment, quality habits and evidence. | Reach experience, expertise, case studies and CV without a wall of badges or unsupported claims. |
| Technical peer | Inspect methods, selected projects and AI-engineering process. | Find concise, evidence-led project detail and Company Workspace process. |
| Federico | Maintain accurate professional content without editing scattered JSX. | Structured data for skills, experience, highlights and case-study content where it reduces duplication. |

### Included V2 work

1. **Home as a conversion summary**
   - New hero with Federico Lapido, Senior Software Engineer, “Backend · Architecture · Integrations · AI Engineering”, 20+ years enterprise-engineering statement, concise stack, professional primary CTA and restrained secondary actions.
   - A credibility/impact strip with non-numeric themes: enterprise systems, backend, architecture, AI and modernization.
   - Professional profile; core expertise; selected experience; Software Engineering + AI; selected projects; legacy modernization; Company Workspace highlight; “How I Work”; contact CTA.
   - Progressive disclosure: Home summarizes and links; it must not duplicate the CV wholesale.

2. **Experience and expertise depth**
   - A strong WiseTech timeline/chapter presentation using confirmed role/date/location and technical areas without inventing promotions.
   - Career highlights and technical expertise categorized in this visual priority: Senior Software Engineering, Backend, Integrations, Architecture, AI Engineering, Legacy Modernization, Testing/Quality, Data/ETL, Cloud/DevOps, complementary Frontend.
   - The supplied category inventory must remain scannable (semantic groups, secondary chips, responsive disclosure); no hundreds of homogeneous badges, scores or fake progress bars.

3. **Applied AI and legacy modernization**
   - A central “Software Engineering + AI” section, a brief human-plus-AI statement and responsive workflow visual: Understand → Analyze → Design → Build → Test → Review → Automate.
   - A separate legacy-modernization explanation/flow: understand existing system → business rules → decouple → APIs → modern backend → modern web → automated tests → controlled migration.
   - Present both as engineering methodology; do not attach unverified AI tools or legacy projects to an employer.

4. **Projects, Lab and case studies**
   - Preserve the hub architecture and the five current project identities.
   - Evolve each `ProjectDetail` into an evidence-led mini case study. Include only populated sections among Overview, Problem, Solution, Architecture, Stack, My Role, Engineering Decisions, Quality, AI Usage, Current Status, Preview/Demo and Evidence.
   - Make Company Workspace a featured case study with role orchestration, intake, requirements, design, development, verification, QA, applicable security, regression and quality gates. Avoid “fully autonomous company” claims.
   - Refine Lab into Engineering Lab / Experiments & Prototypes, using IDEA / EXPERIMENT / BUILDING / READY and excluding unverified or fictitious finished projects.

5. **About, CV and navigation**
   - Replace About’s generic Interests/Lugares/Objetos and public implementation notes with professional, human sections: quién soy, trayectoria, cómo pienso software, evolución, qué construyo, problem types, contribution.
   - Enrich CV web: professional summary, experience, highlights, expertise, skills, AI, selected projects, education only when confirmed, exact certification, languages, contact. Keep its print/download experience intact where valid.
   - Keep navigation manageable. The required destinations are Home, Experience/Expertise, Projects, Lab, About, CV and Contact; use pages and anchors intentionally rather than placing 12 header items.

6. **Product-quality improvements**
   - Remove public fake/placeholder professional data and internal developer notes. Retain honest status labels such as `PREVIEW` or `LOCAL_DEMO` where they accurately convey availability.
   - Implement SEO metadata, semantic document structure, skip navigation, keyboard/focus behavior, AA-oriented contrast, reduced-motion support, mobile-first layouts, sensible asset handling and lightweight bundle discipline.
   - Update README, requirements/architecture documentation as needed, and durable regression scenarios only through real execution.

### Explicitly out of scope

- Commit, push, merge, deployment/publication/release, DNS, production configuration/data, credentials, real messages or destructive operations.
- Backend, database, authentication, analytics or CMS for Federico Home.
- Importing/copying sibling application code or creating/updating their demo projects from this hub change.
- Fabricated skills, titles, career promotions, education, certifications, clients, users, outcomes, metrics, portfolio projects, personal biography, photos, contact details, or company-specific implementation claims.
- Complex i18n. Keep content/data amenable to a future English version; record a future recommendation rather than duplicating all text now.

## 6. Functional information architecture and flows

### Required routes/anchors

Existing routes remain supported (`/`, `/proyectos`, `/proyectos/:slug`, `/lab`, `/about`, `/cv`, 404). The implementation may add accessible Home anchors or one concise experience/expertise route only if it improves scanability. Direct URLs, browser history, navigation menu, mobile menu, footer and 404 must continue to work.

### Key flows

1. **Recruiter scan:** open Home → identify role/seniority/specialties → choose primary “Ver experiencia” or “Ver proyectos” CTA → reach detail → open CV or verified contact link.
2. **Technical evaluation:** open Expertise/Experience → scan categories and WiseTech chapters → open Company Workspace or a selected case study → distinguish Preview, Local Demo and Live Demo accurately.
3. **Project evidence:** open `/proyectos/:slug` → understand public-safe overview/problem/solution → inspect local preview → follow an external demo only when the project status is `LIVE_DEMO` and a verified URL exists.
4. **Mobile navigation:** open menu → reach all core destinations → close menu after navigation → use buttons, links and accordions by touch/keyboard without clipping or hidden focus.
5. **Contact/download:** reach contact CTA → use LinkedIn, GitHub, CV download and, if retained after privacy review, confirmed email. No fake address, unverified WhatsApp/phone, or non-functional action may be presented as contact.

## 7. Detailed requirements and acceptance criteria

### Content and credibility

- [ ] At desktop and mobile default zoom, the first viewport communicates name, Senior Software Engineer position, 20+ years, main specialties, short stack and a clear primary CTA without requiring a second screen.
- [ ] The professional narrative demonstrates backend, integrations, architecture, quality, modernization and AI through structure/evidence instead of inflated adjectives or metrics.
- [ ] WiseTech remains exactly Software Engineer, 2004–June 2026, Buenos Aires, Argentina; the four documented fiscal-integration countries are the only countries claimed.
- [ ] All owner-supplied expertise is grouped with technically correct names (e.g. PostgreSQL) and contextual language that avoids claiming every item as a current primary specialty.
- [ ] AI content describes practical use cases and explicitly preserves human architecture, testing, review and accountability.
- [ ] Legacy content explains controlled, incremental migration and business-rule preservation without representing all flows as customer projects.
- [ ] About contains no “placeholder”, TODO, implementation note, “no biografía inventada”, “solo placeholders reemplazables”, fake-photo or developer-facing copy in rendered UI.
- [ ] No public professional placeholder remains: `federico.lapido@email.com`, `*.midominio.com`, fake hostnames, TODO/fake/temporal/reemplazar text or fake project status must not be rendered as real information.

### Project and demo integrity

- [ ] Each current project has an evidence-led detail page; missing case-study fields are omitted rather than padded with generic copy.
- [ ] Preview UI always distinguishes itself from an official demo and uses fictitious data only.
- [ ] `PREVIEW`, `LOCAL_DEMO` and `LIVE_DEMO` appear accurately; only `LIVE_DEMO` exposes an external demo link with a verified URL.
- [ ] Current Subastas and Legacy metadata are reconciled to sibling manifests before V2 QA; stale external/live claims are removed unless independently re-verified.
- [ ] Company Workspace represents the documented controlled workflow and roles, including conditional security, human boundaries and evidence/quality gates.
- [ ] Lab distinguishes evidence-backed experiments from ready projects and contains no internally-oriented “add this item to source” instruction in rendered UI.

### Design, responsive and accessibility

- [ ] The retained paper/ink/terracotta/brass editorial language feels senior, human, premium and distinct—not cyberpunk, neon AI, dashboard or generic SaaS template.
- [ ] Real photo is proportionate and correctly cropped; it does not dominate the hero or cause a multi-screen mobile hero.
- [ ] No visually material overflow, clipping, overlap, unreadable text, disproportionate control or weak CTA remains at: 320×568, 360×800, 375×812 (or equivalent), 390×844, 412×915, 430px width, 1024×768, 1366×768, 1440×900 and 1920×1080 at 100% zoom.
- [ ] Typography remains comfortable at normal size and at browser text zoom 125%/150%; touch targets are practical and focus-visible behavior is obvious.
- [ ] Keyboard navigation, skip link, semantic heading order, link/button names, alternative text, contrast and `prefers-reduced-motion` behavior are verified on the rendered product.

### Technical quality, SEO and evidence

- [ ] Title, description, canonical policy where applicable, Open Graph, Twitter card, favicon, semantic headings and appropriate robots/sitemap treatment are reviewed; no keyword stuffing.
- [ ] Build, existing/updated automated tests, lint/typecheck scripts available in `package.json`, browser console/network and route checks are executed with recorded real results.
- [ ] Functional QA covers navigation, anchors, direct routes, project details, previews, demo-link conditions, CV/PDF, external links, 404, mobile menu and keyboard.
- [ ] Regression QA scenarios are updated for V2 only after actual execution; V1 scenario results are marked for recheck where the changed behavior invalidates them.
- [ ] Senior Designer reviews the running product before final visual QA; Verifier then completes independent rendered visual/responsive QA and records evidence.
- [ ] Security/privacy baseline checks secrets, private employer content, links, contact data and browser-visible local/internal data. No known applicable FAIL/BLOCKED remains at the Product Quality Gate.

## 8. Decisions and assumptions

| ID | Decision / assumption | Rationale |
|---|---|---|
| D-01 | V2 retains the React/Vite static SPA architecture. | It meets product needs and preserves the hub boundary; no evidence justifies a backend or framework migration. |
| D-02 | Use structured professional content where it removes duplicated JSX, but keep presentation components focused. | The required depth materially exceeds the V1 inline-copy model. |
| D-03 | Use Spanish professional copy; standard technology names and role names stay in English when conventional. | Explicit mandate; avoids needless Spanglish. |
| D-04 | Retain current editorial design tokens and photo; evolve rather than replace the identity. | Explicit mandate and established V1 identity evidence. |
| D-05 | Email is eligible for display because it appears in the immutable CV. Phone remains omitted in web UI by default. | Satisfies verified contact without broadening personal-data exposure. |
| D-06 | Use the exact existing certification label only. | The certification is in current professional data; no further designation is evidenced. |
| D-07 | Treat Subastas and Legacy as `LOCAL_DEMO` until manifests expose a verified public URL. | Current owner-manifest metadata is more specific than stale hub data. |
| D-08 | No separate English/i18n implementation in V2. | Future-ready content/data is sufficient and avoids unrequested duplication. |
| D-09 | No automatic demo impact work occurs for this hub change. | Federico Home owns no demo; it only consumes metadata. |

## 9. Conflicts, risks and required handling

| ID | Finding | Handling / acceptance condition |
|---|---|---|
| C-01 | V1 report says inbox was empty and CV unavailable; immutable CV is now present. | Replace V1 assumptions with the current PDF facts; do not modify inbox. |
| C-02 | `cv.ts` has a fake email while the CV has a real email. | Remove fake address from all public V2 UI; either use `lapidofederico@gmail.com` or omit email after privacy review. |
| C-03 | Hub calls Subastas/Legacy `LIVE_DEMO` with Pages URLs; their current manifests say local-ready, no URL. | Reconcile to accurate `LOCAL_DEMO`, suppress external link, and regression-test status logic. |
| C-04 | Existing `status` text says “En producción” for projects without supporting portfolio evidence. | Use Preview/Local Demo/current-status language unless production evidence is explicitly verified. |
| C-05 | Current About/Lab/Project Detail render developer notes and placeholders. | Remove them from public UI; internal documentation can retain implementation instructions. |
| C-06 | Existing V1 QA and gate are PASS for an older product. | Preserve as historical evidence only; V2 requires its own execution, review and gate. |
| C-07 | Tickets preview contains a simulated `72%` resolution metric; the brief prohibits invented percentages. | Remove the numeric claim or replace it with a non-numeric, clearly fictitious preview state. |
| C-08 | Current favicon is a purple Vite asset, inconsistent with the retained brand and the no-generic-AI direction. | Replace with a small Federico Home mark and verify it renders in browser metadata. |
| R-01 | Dense skill inventory could become a badge wall. | Designer must use prioritized categories/progressive disclosure; reviewer must reject a wall-of-badges presentation. |
| R-02 | Large Home could become a duplicated CV. | Keep Home summarized; route/anchor to CV, project detail and expertise depth. |
| R-03 | Photo and typographic hierarchy can dominate mobile. | Mandatory rendered review at the full viewport matrix; first screen must remain concise. |
| R-04 | Company/e-invoicing content could reveal proprietary details. | Include only approved high-level work areas and practices; no code/client/internal identifiers. |
| R-05 | External demo/project availability can drift. | Metadata and link state must be verified at QA time, not inferred from old copy. |

There are no material requirement blockers. The only unresolved choices (exact public email treatment, optional additional Lab projects, and future registry metadata) have safe defaults above and do not require owner interruption.

## 10. Delivery stages and gates

1. **Architecture review:** confirm the least-complex data model, routing/anchor strategy, SEO approach, static deployment constraints and hub/demo boundaries.
2. **Senior design specification and implementation:** preserve identity while applying the information hierarchy and responsive criteria above.
3. **Developer delivery:** update structured data, pages/components/styles/tests and documented project state; do not introduce unsupported claims.
4. **QA and correction loop:** automated test/build/lint scripts; functional QA; regression QA impact/full as required by V2 scope; browser console/network; privacy baseline; rendered Senior Design Review; independent Visual QA; correct and retest.
5. **Documentation and Product Quality Gate:** update README and affected QA/architecture records with actual evidence. `PRODUCT_QUALITY_GATE: PASS` only after every applicable gate is independently PASS.

## 11. Recommendation

**Proceed with V2 implementation.** The scope is broad but internally coherent, source-grounded and implementable in the existing static SPA. The critical implementation guardrails are: use the inbox CV and owner mandate as content authority; retain the editorial identity; model depth without inflated claims; reconcile demo metadata before rendering any demo link; remove public placeholders/internal notes; and do not reuse stale V1 quality evidence as a V2 pass.
