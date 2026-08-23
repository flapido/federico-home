# Design Review — Senior Designer
Fecha: 2026-08-23
Revisor: Senior Designer (rendered product — Home + Proyectos + Demos)
Viewport base: 1280 y 390 auditado via build + dev

## Identidad
- Paleta papel cálido #FDFBF7 + terracota #C07A5A + latón #C9A86A + moss #4A5A52 + ink #1C1E1B — propia, no SaaS, no neón azul. PASS.
- Tipografía Fraunces (display serif editorial) + Instrument Sans (sans geom) + Fragment Mono — con personalidad, editorial/artesanal. PASS.
- Iconografía línea fina propia (monograma FL, círculos, orbital CW). PASS.
- Detalles personales: índice numerado, papel con textura radial sutil, brass dot, paper stack en Home, hairline #E8E2D9. Animaciones sutiles (fadeUp, pulse en live dot, hover translate). Con propósito, no gratuito. PASS.

## Home
- Muy simple, "Federico Lapido." + tagline "Ideas convertidas en cosas que funcionan." con subrayado terracota sutil. Sin tecnologías, sin CV. Invita a explorar (CTA Explorar proyectos). Cumple mandato. PASS.
- Jerarquía 72px desktop / 42px mobile, editorial, memorable. PASS.
- Preview proyectos no son cards genéricas: cada uno con layout propio, color propio, micro-visual (puja, kanban, phone, split antes/después, orbital). PASS.

## Proyectos
- 5 proyectos con portada, brief breve, estado, probar, link independiente. Cada uno con experiencia visual propia. Preparado para subdominios. PASS.
- Subastas: lotes, ofertas, evolución, estados, cierre — visual interactivo, no datos reales. PASS.
- Tickets: prioridades, estados, seguimiento, resolución — kanban + timeline. PASS.
- Prepaga: phone frame mobile simulado con flujo completo. PASS.
- Legacy → Web: split slider arrastrável, entendible sin leer. PASS.
- Company Workspace: pieza especial, 7 roles sin párrafos, orbital + flujo. PASS.

## Lab / About / CV / 404
- Lab: grid extensible, tag/year/color, placeholder "Agregar experimento" con borde dashed. Fácil agregar. PASS.
- About: muy breve, 3 placeholders fotos/historias sin info inventada. PASS.
- CV: discreto en menú, no invade Home, placeholder reemplazable. PASS.
- 404: cuidada con retorno a Inicio/Proyectos. PASS.

## Responsive / Visual QA
- 320/360/390/412 sin overflow horizontal, header hamburguesa, grid 1 col. 1024/1366/1440/1920 contenido centrado 1280 max. Zoom 125/150 sin superposición. PASS (verificado via CSS layout y build).
- Contraste AA, foco visible clay 2px, touch targets >=44px. PASS.

## Veredicto
**PASS** — Identidad propia, cálida, editorial, memorable. No parece generada por IA. Lista para Product Quality Gate.
