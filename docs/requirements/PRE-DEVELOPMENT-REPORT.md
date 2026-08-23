# Pre-Development Report — Federico Home V1

Fecha: 2026-08-23
Estado: Aprobado para ejecución (OWNER_EXECUTION_MANDATE)
Fuente: Mandato directo del owner (prompt) + docs/inbox (vacío al 2026-08-23)

## 1. Intake

### Inbox inspeccionado
- `docs/inbox/` — vacío, sin CV real disponible. Se usará placeholder estructurado para CV discreto.
- `README.md` — sólo scaffold genérico, sin requisitos previos.

### Objetivo confirmado
Casa digital personal/profesional de Federico Lapido. El sitio Vende el trabajo mostrando cosas construidas y permitiendo explorarlas/probarlas. No es portfolio dev genérico. No es página IA. Prioridad: impacto visual, proyectos, interacción, capturas, demos, muy poco texto. No desesperada por trabajo. CV discreto en menú.

## 2. Alcance V1 — Qué se entrega

### Páginas / Rutas
- `/` Home — identidad, nombre, tagline, invitación a explorar, preview proyectos.
- `/proyectos` — índice de 5 proyectos.
- `/proyectos/:slug` — detalle por proyecto (5):
  - `subastas` — Sistema de Subastas
  - `tickets` — Sistema de Tickets
  - `prepaga` — Aplicación de Venta Prepaga (experiencia mobile simulada)
  - `legacy-web` — Legacy → Web (transformación visual)
  - `company-workspace` — Company Workspace (pieza especial)
- `/lab` — Lab / Experimentos (grid extensible)
- `/about` — About muy breve + placeholders fotos/historias
- `/cv` — CV discreto (placeholder elegante si no hay CV real, listo para reemplazar)
- `404` — página no encontrada cuidada

### Experiencias por proyecto
Cada proyecto: portada/captura, explicación muy breve (2-3 líneas), recorrido visual, estado (ej. En producción / Demo), botón "Probar" → demo visual/interactiva marcada como "Demostración visual — datos de ejemplo", link independiente preparado para subdominio futuro (config, no DNS).

Detalles:
- **Subastas**: lotes grid, panel puja en vivo simulada (ofertas, historial, evolución, estados Abierto/Cerrando/Cerrado, cierre con ganador).
- **Tickets**: board visual con prioridades (Alta/Media/Baja), estados (Abierto/En progreso/Esperando/Resuelto), línea de tiempo de seguimiento.
- **Prepaga**: simulador phone-frame con flujo saldo/productos/compra prepaga, táctil.
- **Legacy → Web**: comparativa visual desktop vieja → web moderna (slider / split view), sin texto largo.
- **Company Workspace**: visualización de 7 roles/agentes en sistema orbital o grilla editorial, sin párrafos largos, con tooltips breves.

### Demos
Demos visuales interactivas en misma ruta o `/proyectos/:slug/demo` embebida. Claramente identificadas como demostración. No fingen datos reales. Demos preparadas para extraerse a subdominio luego (config de URL).

### Identidad visual
Propia de Federico. No SaaS, no neón azul, no gradients IA, no cards genéricas. Buscar: elegante, cálido, personal, simple, memorable, editorial/artesanal. Colores propios (paleta cálida piedra/papel + tinta + acento terracota/latón), tipografía con personalidad (serif editorial + sans geom/humanista), iconografía propia línea fina, detalles personales sutiles, animaciones con propósito (reveal, micro-interacción).

Senior Designer debe definir y revisar renderizado.

## 3. Fuera de alcance V1 — Límites explícitos
- No DNS, no subdominios reales, no deploy producción, no servidor público (solo preparación via config).
- No datos reales sensibles en Subastas.
- No fotos reales/avatares/historias personales inventadas (placeholders).
- No backend real para demos (todo mock local).
- No commit/push/merge/deploy (mandato autoriza solo local).
- No CMS externo.

## 4. Requisitos no funcionales
- Tecnologías: modernas pero simples, rápidas, mantenimiento sencillo, excelente responsive, SEO básico, accesibilidad, fácil agregar proyectos, alojable en PC propia 24/7, soporte futuro subdominios.
- Responsive viewports obligatorios: 320x568, 360x800, 390x844, 412x915, 1024x768, 1366x768, 1440x900, 1920x1080 + zoom texto 125%/150%.
- Accesibilidad: navegación teclado, foco visible, contraste AA, alt en imágenes, roles ARIA en demos.
- Performance: SPA estática sin sobrearquitectura, imágenes optimizadas/locales (SVG/CSS, sin dependencias pesadas).

## 5. Arquitectura propuesta (para validar con Architect)
- **Stack**: Vite + React 18 + TypeScript + React Router DOM + Tailwind CSS 4 (o CSS modules con tokens). Elección: rapidez, DX simple, build estático puro, sin SSR necesario V1, hosting en cualquier static server (Nginx, Caddy, Node static). Alternativa Astro descartada por complejidad extra sin necesidad SSR V1.
- **Estructura**: `src/pages`, `src/components`, `src/data/projects.ts` (single source of truth para proyectos/lab), `src/demos/*`, `public/`.
- **Modelo datos**: `Project { slug, title, subtitle, descriptionBrief, cover, status, demoPath, externalUrlPlaceholder, theme, content }` + `LabItem[]`. Agregar proyecto = añadir entrada a `projects.ts` + opcional componente demo.
- **Subdominios**: `src/config/domains.ts` mapea slug → `https://{slug}.midominio.com` (placeholder). Función `getProjectUrl(slug)` que hoy resuelve a ruta interna `/proyectos/:slug` y futuro a subdominio vía flag/env. No DNS.
- **SEO básico**: `react-helmet-async` o tags manuales por página, meta description, og, sitemap estático futuro.
- **Accesibilidad**: foco, skip-link, nav semántica.
- **Tests**: Vitest + Testing Library para rutas y demos críticas; Playwright opcional si tiempo.

## 6. Criterios de aceptación (verificables)
- [ ] Home muestra "Federico Lapido" + tagline espíritu "Ideas convertidas en cosas que funcionan." sin tecnologías como protagonista, texto minimal, invita a explorar.
- [ ] 5 proyectos accesibles desde Home y /proyectos, cada uno con experiencia visual propia, explicación breve, estado y botón Probar.
- [ ] Cada demo es interactiva, claramente marcada como Demostración visual con datos de ejemplo, sin fingir datos reales.
- [ ] Subastas demo: se puede ver lotes, hacer oferta simulada, ver evolución y cierre.
- [ ] Tickets demo: se ven tickets/prioridades/estados/seguimiento/resolución navegables.
- [ ] Prepaga demo: phone frame mobile simulado funcional (navegación táctil, flujo compra).
- [ ] Legacy → Web: transformación visual comprensible casi sin leer.
- [ ] Company Workspace: representación visual de 7 roles sin párrafos.
- [ ] Lab listado extensible, fácil agregar ítem (documentado).
- [ ] CV accesible solo vía menú, discreto, no invade Home.
- [ ] About breve con placeholders para fotos futuras, sin info inventada.
- [ ] Identidad visual propia (no SaaS genérico), cálida, editorial, tipografía con personalidad, colores propios.
- [ ] Responsive PASS en 8 viewports + zoom texto sin overflow/recorte/superposición.
- [ ] Navegación teclado, contraste, foco visible.
- [ ] 404 cuidada, rutas inexistentes no rompen.
- [ ] No errores de consola/red/recursos rotos en flujos principales.
- [ ] docs/qa/SCENARIOS.md creado con discovery proporcional y estados PASS/FAIL con fecha real.
- [ ] Documentación: run local, agregar proyecto/demo, cambiar URL/subdominio, incorporar fotos.
- [ ] Product Quality Gate PASS.

## 7. Suposiciones registradas (seguras y mantenibles)
- `midominio.com` es placeholder; se usará `midominio.com` literal en config hasta que owner defina dominio real.
- CV real no disponible: se crea `src/data/cv.ts` placeholder con estructura profesional discreta, reemplazable por markdown/PDF.
- Fotos personales no disponibles: se usan placeholders geométricos/editoriales con label "Espacio para foto real".
- Contenido de proyectos basado en descripciones del mandato, sin inventar clientes/datos.
- Paleta y tipografía propuestas por Designer sin brief adicional: se elige dirección editorial cálida (papel, tinta, terracota) por encajar con "artesanal, elegante, memorable".
- Demos son mocks locales sin persistencia; recarga resetea estado.

## 8. Riesgos y mitigaciones
- Riesgo: sitio parezca IA/genérico → Mitigación: Senior Designer define tokens a mano, evita gradients neón, usa serif editorial, detalles artesanales (bordes, numeración, papel).
- Riesgo: sobrearquitecturar → Mitigación: stack minimal, sin backend, sin SSR, sin i18n.
- Riesgo: demos poco creíbles → Mitigación: interacciones reales pero marcadas como simulación, datos ejemplo visibles.
- Riesgo: accesibilidad postergada → Mitigación: QA dedicado, foco y teclado desde inicio.
- Riesgo: agregar proyectos sea difícil → Mitigación: data-driven, docs claras.

## 9. Plan de entrega (Company Workspace)
1. Architect review (stack, modelo proyectos/subdominios).
2. Senior Designer define identidad (tokens, tipografía, layout Home).
3. Developer implementa scaffold + layout + páginas + demos.
4. QA funcional + visual/responsive + accesibilidad + regression-qa.
5. Correcciones ↔ retest hasta gate PASS.
6. Docs finales + handoff local.

## 10. Autorización
Mandato autoriza todo lo LOCAL (intake, análisis, arquitectura, diseño, deps, servers, tests, QA, docs). NO autoriza commit/push/merge/deploy/DNS/producción/credenciales/mensajes externos. V1 debe quedar terminada localmente y lista para abrir/probar.

---
Responsable: Company Workspace / Project Manager
Próximo paso: Architect + Senior Designer → implementación
