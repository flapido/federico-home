# Requirements Review — Federico Home V2

**Date:** 2026-08-25  
**Reviewer:** Product Analyst  
**Decision:** `PASS — DEVELOPMENT_AUTHORIZED`

## Scope review

The owner mandate defines a substantial but coherent V2: an editorial senior-engineering portfolio, visual CV, expertise overview, evidence-led project showcase and AI/legacy-modernization narrative. It is a transformation of the existing Vite/React hub, not a product backend, demo monolith, recruitment platform, or publication task.

The intake sources support the central claim: Federico Lapido is a Software Engineer with WiseTech Global experience from 2004 to June 2026 in backend C#/.NET, enterprise e-invoicing integrations, quality practices and AI-assisted engineering. The owner mandate supplies the fuller skills taxonomy to be shown as categorized experience/knowledge with proper qualifiers.

## Acceptance mapping

| Requirement group | Verifiable V2 result |
|---|---|
| Professional positioning | First viewport clearly communicates Federico, Senior Software Engineer, 20+ years, primary domains and a primary CTA on desktop and mobile. |
| Evidence and accuracy | CV-confirmed WiseTech/country/practice facts are preserved; no invented title, client, metric, credential, production status or private material is rendered. |
| Expertise | Prioritized, technically named categories cover backend, integrations, architecture, AI, legacy, quality, data, cloud and complementary frontend without scores or badge-wall UX. |
| Experience / CV / About | Experience has substantial visual depth; CV has the specified sections; About is professional and contains no public implementation notes or generic placeholder cards. |
| AI and modernization | Both have dedicated, responsive, human-controlled engineering workflows rather than trend copy. |
| Projects and Lab | Case-study detail is evidence-led; statuses accurately distinguish `PREVIEW`, `LOCAL_DEMO`, `LIVE_DEMO`; the hub remains isolated from siblings. |
| Visual product quality | Editorial identity is retained, mobile-first review passes the required viewport matrix, and no material UI defect remains. |
| Technical quality | SEO, semantic/accessibility review, tests/build, functional QA, regression QA, console/network review, security/privacy baseline and documentation have real evidence. |

## Decisions carried into development

1. Preserve the hub and static-SPA boundary; use structured content data when it improves maintainability.
2. Preserve the established paper/ink/terracotta/brass editorial direction and real profile photo, subject to rendered Senior Designer review.
3. Use `lapidofederico@gmail.com` only if the final privacy baseline approves email display; never use the current fake `federico.lapido@email.com`.
4. Treat Subastas and Legacy as `LOCAL_DEMO` until their manifests contain verified public URLs. Do not expose the stale Pages URLs as live demos.
5. Do not add Quiniela Analytics, FastAPI + Ollama, Home Assistant or other candidates as completed portfolio projects without public-safe evidence; a clearly labelled Lab experiment remains optional.
6. V1 PASS reports do not satisfy V2 gates. Re-execute applicable verification against the rendered V2.

## Non-blocking discrepancies to correct

- Inbox CV availability contradicts the prior V1 “CV placeholder” assumption.
- Current project data conflicts with sibling demo manifests.
- Existing public copy exposes fake-domain placeholders, a fake email and developer/placeholder notes.
- Existing project status copy uses unsupported “En producción” language.

## Out of scope confirmation

No commit, push, merge, deploy, publication, DNS, production access/data, credentials, destructive action, external message, sibling demo ownership, backend/database/auth/i18n expansion is required or authorized by this stage.

## Recommendation

The mandate contains no material ambiguity requiring owner input. Continue with architecture/design/development and the prescribed independent QA gates. The authoritative detail is in [PRE-DEVELOPMENT-REPORT.md](PRE-DEVELOPMENT-REPORT.md).
