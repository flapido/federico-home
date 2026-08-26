# QA — Case Studies V2.1

Fecha: 2026-08-26

**PASS**

- Legacy → Web: comparación real Antes/Después, proceso de modernización y CTA hacia contacto verificados en mobile y desktop. El sistema anterior se describe como evidencia de interfaz, no como sistema de cliente.
- Sistema de Subastas: flujo catálogo → detalle → oferta/compra → usuario → seguimiento, adaptación comercial y CTA verificados; mantiene `DEMO LOCAL` sin URL pública inventada.
- Archivo Digital: nueva ruta `/proyectos/archivo-digital`, ficha, categorías, recursos, navegación y evolución posible con IA claramente separada de lo implementado. Evidencia limitada a captura de Acervo Tucumán con información histórica pública.
- Privacidad: no se incluyó ningún asset, texto, nombre ni dato privado; búsqueda de alcance sin coincidencias para los identificadores de material restringido y proyectos excluidos.
- `npm test`: 16/16 PASS; lint, build, audit high y `git diff --check`: PASS.
- `node run-qa.mjs`: PASS, 10 viewports × 11 rutas; incluye Legacy, Subastas y Archivo Digital.

Capturas de evidencia de la matriz: `screenshots/v2/*-proyectos-legacy-web.png`, `*-proyectos-subastas.png` y `*-proyectos-archivo-digital.png`.
