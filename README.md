# Federico Home — Casa Digital V1.1 (Hub)

Sitio personal/profesional de Federico Lapido. Casa digital = **showroom/hub**: presenta proyectos con **previews marketing livianas** y enlaza a demos/productos que viven en sus proyectos independientes. No es un portfolio genérico.

> **Identidad**: elegante, cálida, editorial/artesanal. Papel #FDFBF7, tinta #1C1E1B, terracota #C07A5A, latón #C9A86A. Fraunces + Instrument Sans. Cerquillo fino, sin neón, sin gradients IA.

> **Arquitectura definitiva (v1.1):** Federico Home nunca importa código de otros proyectos, no mantiene lógica completa de demos ni se conecta a sus DB. `C:\Dev\Projects\stock-subastas` y `stock-subastas-demo` son proyectos separados. El hub solo muestra preview y metadata/URL.

## Stack
- Vite + React 19 + TypeScript + React Router 7
- Tailwind CSS 4 (@tailwindcss/vite)
- SPA estática — hospedable en PC 24/7. Sin SSR, sin backend.
- Vitest + Testing Library (9 tests)

## Requisitos
Node 20+

## Ejecutar localmente
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # produce dist/
npm run preview  # sirve dist en 4173
npm test         # 9 tests (6 smoke + 3 arquitectura preview)
```

## Estructura
```
src/
  pages/        Home, Projects, ProjectDetail, Lab, About, CV, NotFound
  previews/     AuctionPreview, TicketsPreview, PrepagaPreview, LegacyPreview, WorkspacePreview (marketing, NO demos oficiales)
  data/         projects.ts (modelo id/preview/demoStatus/demoUrl/publicUrl), cv.ts
  config/       domains.ts (BASE_DOMAIN placeholder midominio.com no publicado)
  components/   Layout
public/
  favicon.svg
docs/
  requirements/PRE-DEVELOPMENT-REPORT.md
  qa/SCENARIOS.md (59 scenarios)
```

## Modelo definitivo de proyectos
```ts
type DemoStatus = "PREVIEW" | "LOCAL_DEMO" | "LIVE_DEMO"
type Project = {
  id: string          // slug estable
  title: string
  description: string
  preview: "auction"|"tickets"|"prepaga"|"legacy"|"workspace"
  demoStatus: DemoStatus
  demoUrl?: string    // URL de demo independiente cuando existe
  publicUrl: string   // placeholder midominio.com hasta publicar (no publicado)
  // + campos visuales: subtitle, year, status, color, bg, href
}
```
- **PREVIEW**: solo preview interno del hub.
- **LOCAL_DEMO**: existe proyecto demo independiente pero sin URL pública.
- **LIVE_DEMO**: botón "Probar demo ↗" abre demoUrl/publicUrl en nueva pestaña.

Todos los proyectos V1 están en `PREVIEW`. Cuando `/demo-mode` cree una demo real, solo actualizar `demoStatus` + `demoUrl`/`publicUrl`.

## Agregar un nuevo proyecto
1. Edita `src/data/projects.ts` → añade a `projects[]`:
```ts
{
  id: "mi-proyecto", slug: "mi-proyecto",
  title: "Mi Proyecto", subtitle: "Una línea",
  description: "2-3 líneas máx",
  year: "2026", status: "En producción · Preview", statusTone: "live",
  color: "#C07A5A", bg: "#FDF6EE", href: "/proyectos/mi-proyecto",
  preview: "auction", demoStatus: "PREVIEW",
  publicUrl: "mi-proyecto.midominio.com", externalPlaceholder: "mi-proyecto.midominio.com",
}
```
2. (Opcional) Crea `src/previews/MiProyectoPreview.tsx` (preview marketing, datos ficticios, label "No es la demo oficial") y mapea en `ProjectDetail.tsx` → objeto `preview`.
3. `npm run build` y verifica `/proyectos/mi-proyecto`.

No toques DNS. Hub no importa código externo.

## Agregar una preview
- Crea `src/previews/NuevaPreview.tsx` con header comment `/** PREVIEW — ... NO es la demo oficial */`
- Importa en `ProjectDetail.tsx` y añade al mapa `preview`.
- Mantén interacción ligera (ej. mover ticket, slider), sin persistencia, datos ficticios.

## Extraer demo real (cuando /demo-mode cree una demo)
1. El nuevo proyecto demo vive en `C:\Dev\Projects\mi-proyecto-demo` (no se copia a federico-home).
2. En `src/data/projects.ts` cambia solo:
```ts
demoStatus: "LIVE_DEMO",
demoUrl: "https://mi-proyecto.midominio.com", // o publicUrl
```
3. `ProjectDetail` mostrará automáticamente "Probar demo ↗" con `target="_blank"`. No tocar previews.

## Cambiar URL / subdominio (futuro)
Edita `src/config/domains.ts`:
```ts
export const BASE_DOMAIN = "tudominio.com" // placeholder hasta entonces
export const USE_SUBDOMAINS = false // true solo con DNS + LIVE_DEMO
```
`getDemoUrl()` resuelve a URL pública solo en LIVE_DEMO; en PREVIEW/LOCAL_DEMO devuelve ruta interna.

## Incorporar fotos reales
- Coloca en `public/fotos/` y reemplaza placeholders en `About.tsx`:
```tsx
<img src="/fotos/federico-01.jpg" alt="Federico en taller" className="rounded-[12px]" />
```
- No se inventa info personal.

## Tests y QA
- `npm test` — 9 tests (Home, Projects, Lab, About, CV, 404 + 3 arquitectura preview)
- `docs/qa/SCENARIOS.md` — 59 escenarios (56 baseline + 3 arquitectura), todos PASS 2026-08-23 v1.1
- Responsive: 320/360/390/412/1024/1366/1440/1920 + zoom 125/150
- A11y: skip-link, focus-visible 2px clay, contraste AA

## Estado
V1.1 hub local completa, lista para `npm run dev`. Preparada para incorporar demos independientes proyecto por proyecto sin tocar código del hub salvo metadata. Sin commit/push/deploy/DNS por mandato.
