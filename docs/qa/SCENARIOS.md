# Regression QA — Federico Home V1
Fecha baseline: 2026-08-23 · Actualizado arquitectura hub: 2026-08-23 (v1.1) · Segunda pasada profunda: 2026-08-23 (v1.2)
Sistema: regression-qa V2 proporcional
Entorno: local Vite dev (5177) + build estático (dist) — Windows 11, Node 24

## Leyenda
- PASS — comportamiento verificado OK en fecha indicada
- FAIL — defecto reproducible
- NEEDS_RECHECK — requiere retest
- BLOCKED — no testeable

## Descubrimiento proporcional — v1.1
Producto: casa digital = showroom/hub. Cada producto real vive en su propio proyecto; cada demo pública completa vive en su propio proyecto demo. Federico Home solo presenta PREVIEWS marketing livianas (src/previews/*) y enlaza vía metadata demoStatus/demoUrl/publicUrl. No importa código externo, no mantiene lógica completa de demos.
Scenarios cubren: navegación, proyectos (nuevo modelo PREVIEW/LOCAL_DEMO/LIVE_DEMO), previews, imágenes, 404, responsive, teclado, a11y, recursos, estados vacíos, textos largos, URLs directas, doble click.

---

### NAV — Navegación principal
| ID | Escenario | Pasos | Esperado | Estado | Fecha | Notas |
|----|-----------|-------|----------|--------|-------|-------|
| NAV-01 | Home carga con identidad | Abrir `/` | Ve "Federico Lapido" + tagline + CTA Explorar | PASS | 2026-08-23 | Vitest + dev 200 |
| NAV-02 | Menú desktop visible | 1024+ px | Links Proyectos, Lab, About, CV visibles | PASS | 2026-08-23 | sticky |
| NAV-03 | Menú mobile toggle | 390px click hamburguesa | Abre/cierra menú | PASS | 2026-08-23 | aria-expanded |
| NAV-04 | Navegar a Proyectos | Click Proyectos | Lista 5 proyectos; Subastas y Legacy muestran `LOCAL_DEMO` y “Demo lista · publicación pendiente” | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |
| NAV-05 | Navegar a Lab | Click Lab | Grid 6 + placeholder | PASS | 2026-08-23 | /lab |
| NAV-06 | Navegar a About | Click About | Texto breve + 3 placeholders | PASS | 2026-08-23 | /about |
| NAV-07 | CV discreto en menú | Click CV | Página CV no invasiva | PASS | 2026-08-23 | /cv |
| NAV-08 | Footer links | Click CV footer | Navega a /cv | PASS | 2026-08-23 | — |
| NAV-09 | Ruta inexistente 404 | Abrir `/ruta-inexistente-404` | 404 cuidada Inicio/Proyectos | PASS | 2026-08-23 | SPA fallback |
| NAV-10 | URL directa proyecto | Abrir `/proyectos/subastas` directo | Renderiza detalle sin 500 + preview interno + estado LOCAL_DEMO | PASS | 2026-08-23 | impacted: Vitest + build |
| NAV-11 | Back/forward browser | Home→Proyectos→Lab back | Historial funciona | PASS | 2026-08-23 | React Router |
| NAV-12 | URL directa Legacy | Abrir `/proyectos/legacy-web` directo | Renderiza detalle con preview Legacy interno y estado LOCAL_DEMO, sin URL ni demo externa | PASS | 2026-08-23 | nuevo · Legacy LOCAL_DEMO · Vitest + build |

### PROY — Proyectos y modelo definitivo
| ID | Escenario | Esperado | Estado | Fecha | Notas |
|----|-----------|----------|--------|-------|-------|
| PROY-01 | 5 proyectos visibles Home preview | Subastas, Tickets, Prepaga, Legacy, Company | PASS | 2026-08-23 | — |
| PROY-02 | Portada/captura placeholder por proyecto | Bloque "espacio para screenshot" | PASS | 2026-08-23 | — |
| PROY-03 | Descripción breve 1-2 líneas | description/brief visible | PASS | 2026-08-23 | — |
| PROY-04 | Estado + demoStatus visibles | badge status + badge PREVIEW/LOCAL_DEMO/LIVE_DEMO; Subastas y Legacy = LOCAL_DEMO | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |
| PROY-05 | Botón según demoStatus — PREVIEW | PREVIEW muestra "Ver preview" / "Preview →" y scroll a #preview, no abre URL externa | PASS | 2026-08-23 | **impacted** arquitectura |
| PROY-05a | Botón según demoStatus — LOCAL_DEMO | Subastas y Legacy muestran “Ver preview”, “Demo lista · publicación pendiente” y no exponen URL ni link externo | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |
| PROY-05b | Botón según demoStatus — LIVE_DEMO | LIVE_DEMO muestra "Probar demo ↗" y abre solo demoUrl en nueva pestaña | PASS | 2026-08-23 | impacted: transición cubierta por fixture Vitest |
| PROY-06 | Link independiente placeholder no publicado | muestra publicUrl + "(no publicado)" + config domains.ts | PASS | 2026-08-23 | midominio.com placeholder |
| PROY-07 | Recorrido visual 3 pasos por proyecto | 3 cards Visual 1-3 | PASS | 2026-08-23 | — |
| PROY-08 | Textos largos no rompen layout | title largo simulado clampa | PASS | 2026-08-23 | — |
| PROY-09 | Modelo projects.ts tiene id/preview/demoStatus/demoUrl/publicUrl | Campos presentes; Subastas y Legacy = LOCAL_DEMO sin demoUrl, otros conservan PREVIEW | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest |
| PROY-10 | Hub no importa código externo | src/previews/* solo marketing, sin imports a otros proyectos | PASS | 2026-08-23 | **nuevo** arquitectura |

### PREV — Previews marketing (NO demos oficiales) — antes DEMO
| ID | Escenario | Pasos | Esperado | Estado | Fecha | Notas |
|----|-----------|-------|----------|--------|-------|-------|
| PREV-01 | Banner "Preview · Marketing · No es la demo oficial" visible | Abrir un proyecto LOCAL_DEMO | Header preview + footer aclara que la demo está lista localmente y su publicación está pendiente | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |
| PREV-02 | Subastas preview: lista lotes + selección | Click lote 185 | Detalle cambia | PASS | 2026-08-23 | antes DEMO-02 — preview liviana |
| PREV-03 | Subastas preview: mover oferta ficticia | Click +/- y Pujar | Nueva entrada historial + evolución | PASS | 2026-08-23 | antes DEMO-03 |
| PREV-04 | Subastas preview: simular cierre | Click Simular cierre | "Cerrado — Ganador" + toggle | PASS | 2026-08-23 | antes DEMO-04 animación cierre |
| PREV-05 | Subastas preview: doble click no rompe | Doble click Pujar | Dos entradas sin crash | PASS | 2026-08-23 | antes DEMO-05 |
| PREV-06 | Tickets preview: board 4 columnas | Ver Abierto/En progreso/Esperando/Resuelto | 4 cols contadores | PASS | 2026-08-23 | antes DEMO-06 |
| PREV-07 | Tickets preview: mover ticket visual | Seleccionar TK-241 Siguiente | Estado cambia visualmente | PASS | 2026-08-23 | antes DEMO-07 — preview solo marketing, no persiste |
| PREV-08 | Tickets preview: seleccionar cambia seguimiento | Click TK-242 | Panel cambia | PASS | 2026-08-23 | antes DEMO-08 |
| PREV-09 | Prepaga preview: phone frame | Abrir prepaga | Frame phone saldo $12.500 + recorrido visual | PASS | 2026-08-23 | antes DEMO-09 pequeño recorrido |
| PREV-10 | Prepaga preview: agregar y confirmar | Agregar Pack → Confirmar | Flujo browse→confirm→done, saldo descuenta (preview) | PASS | 2026-08-23 | antes DEMO-10 |
| PREV-11 | Prepaga preview: saldo insuficiente | Total>saldo | Mensaje saldo insuficiente, botón deshabilitado | PASS | 2026-08-23 | antes DEMO-11 |
| PREV-12 | Legacy preview: slider before/after | Abrir `/proyectos/legacy-web`; arrastrar divisor / range | Clip path cambia sin layout shift; sigue siendo preview interno, no demo oficial | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest |
| PREV-13 | Workspace preview: 7 roles orbital | Click cada rol | Panel activo cambia + barra progreso | PASS | 2026-08-23 | antes DEMO-14 |
| PREV-14 | Previews sin persistencia y sin backend | Recargar página | Estado resetea, no conecta a DB, sin imports externos | PASS | 2026-08-23 | antes DEMO-15 + **nuevo** verifica hub |
| PREV-15 | Previews marcadas como datos ficticios | Ver label "Datos ficticios" / "Interacción ligera" | Visible + Subastas y Legacy informan publicación pendiente sin mostrar URL | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |

### IMG — Imágenes y recursos
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| IMG-01 | Sin imágenes rotas flujos principales | No 404 favicon/fonts/css/js | PASS | 2026-08-23 | build 200 |
| IMG-02 | Placeholder captura no rompe | Grid sin img real | PASS | 2026-08-23 |
| IMG-03 | Fuentes cargan | Fraunces + Instrument Sans | PASS | 2026-08-23 | preconnect |
| IMG-04 | Favicon presente | /favicon.svg 200 | PASS | 2026-08-23 |

### RWD — Responsive y zoom texto
| ID | Viewport | Esperado | Estado | Fecha |
|----|----------|----------|--------|-------|
| RWD-01 | 320x568 | Sin overflow, hamburguesa, 1 col | PASS | 2026-08-23 | visual QA real con Playwright Chromium |
| RWD-02 | 360x800 | Cards apiladas | PASS | 2026-08-23 |
| RWD-03 | 390x844 | Hero legible, preview | PASS | 2026-08-23 | visual QA real con Playwright Chromium |
| RWD-04 | 412x915 | Phone preview centrado | PASS | 2026-08-23 |
| RWD-05 | 1024x768 | Header desktop, grid 12 | PASS | 2026-08-23 | visual QA real con Playwright Chromium |
| RWD-06 | 1366x768 | Max 1280 centrado | PASS | 2026-08-23 |
| RWD-07 | 1440x900 | Sin estiramiento | PASS | 2026-08-23 |
| RWD-08 | 1920x1080 | Márgenes, no overflow | PASS | 2026-08-23 |
| RWD-09 | Zoom 125% | Sin superposiciones | PASS | 2026-08-23 |
| RWD-10 | Zoom 150% | Legible | PASS | 2026-08-23 |
| RWD-11 | Overflow global | No scroll horizontal | PASS | 2026-08-23 |
| RWD-12 | Touch targets 44px | Botones >=44px mobile | PASS | 2026-08-23 |

### A11Y — Accesibilidad
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| A11Y-01 | Tab foco visible | Header, cards, botones preview | PASS | 2026-08-23 | :focus-visible 2px clay |
| A11Y-02 | Skip link | Tab muestra "Saltar al contenido" | PASS | 2026-08-23 |
| A11Y-03 | Contraste texto | Ink sobre paper AA 16:1 | PASS | 2026-08-23 |
| A11Y-04 | Contraste badges | Badges legibles | PASS | 2026-08-23 |
| A11Y-05 | Alt/aria en previews | Botones con label, range aria-label | PASS | 2026-08-23 |
| A11Y-06 | Focus no trap | Tab cicla en preview | PASS | 2026-08-23 |

### ERR — Errores y estados vacíos
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| ERR-01 | Slug inexistente | 404 proyecto no encontrado | PASS | 2026-08-23 |
| ERR-02 | Lab vacío simulado | Placeholder "Agregar experimento" permanece | PASS | 2026-08-23 |
| ERR-03 | Preview estado vacío (cart vacío) | Botón Comprar deshabilitado | PASS | 2026-08-23 |
| ERR-04 | Consola limpia flujos principales | Sin errores JS, sin 404 red | PASS | 2026-08-23 |
| ERR-05 | Recursos rotos | Build sin warnings | PASS | 2026-08-23 |

### LINK — Links
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| LINK-01 | Internos no rompen | /proyectos/:slug navegables | PASS | 2026-08-23 |
| LINK-02 | LOCAL_DEMO no navega fuera sin URL pública | Subastas y Legacy no muestran ni enlazan publicUrl; solo LIVE_DEMO con demoUrl navega en nueva pestaña | PASS | 2026-08-23 | impacted: Legacy LOCAL_DEMO · Vitest + build |
| LINK-03 | Header/Footer consistentes | Mismos destinos | PASS | 2026-08-23 |

### PERF — Performance básica
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| PERF-01 | Build <400KB js gzip | 87KB gzip (90.98 v1.2 con CV real) | PASS | 2026-08-23 |
| PERF-02 | CSS <50KB | 37.5KB / 7.7 gzip (con print) | PASS | 2026-08-23 |
| PERF-03 | Sin bloqueo render | Fonts preconnect | PASS | 2026-08-23 |

### CV — CV real profesional (nuevo v1.2)
| ID | Escenario | Esperado | Estado | Fecha | Notas |
|----|-----------|----------|--------|-------|-------|
| CV-01 | CV carga con header completo | Ver "Federico Lapido" + "Buenos Aires, Argentina" + "Software Engineer — Backend · Integraciones · AI-Assisted" | PASS | 2026-08-23 | /cv |
| CV-02 | Perfil 20+ años visible | Texto "Más de 20 años construyendo sistemas..." + lista C#/.NET etc sin párrafos IA | PASS | 2026-08-23 | — |
| CV-03 | Experiencia WiseTech Global 2004–June 2026 | Timeline con summary + 5 bullets (Costa Rica/México/Chile/RD, handlers, REST, NUnit/Moq/TDD, IA) | PASS | 2026-08-23 | — |
| CV-04 | Proyectos profesionales 3 cards | Integraciones Facturación Electrónica / Automatización Testing / IA aplicada | PASS | 2026-08-23 | — |
| CV-05 | Skills agrupadas Core/Calidad/Tooling/IA | Chips C# .NET SQL etc + Prompt Engineering, no sopa en hero | PASS | 2026-08-23 | — |
| CV-06 | Idiomas/Educación/Certificación | Español Nativo, Inglés Profesional, Estudios TI Argentina, Gemini 2025 | PASS | 2026-08-23 | — |
| CV-07 | Links externos correctos | GitHub https://github.com/flapido y LinkedIn https://www.linkedin.com/in/federico-lapido abren _blank noopener | PASS | 2026-08-23 | target seguro |
| CV-08 | Privacidad — sin teléfono | No hay teléfono expuesto en CV web | PASS | 2026-08-23 | — |
| CV-09 | Descargar CV si PDF existe | Botón "Descargar CV ↓" href /cv/Federico_Lapido_CV.pdf 200 | PASS | 2026-08-23 | docs/inbox PDF 194KB |
| CV-10 | Print CSS | Ctrl+P oculta header/footer/nav, fondo blanco, scaneable | PASS | 2026-08-23 | @media print |
| CV-11 | CV escaneable sin cards de 5 metros | Secciones compactas editorial, no cards innecesarias | PASS | 2026-08-23 | design-review |
| CV-12 | Skills no son titular hero | Home no muestra C#/.NET como protagonista; solo CV | PASS | 2026-08-23 | — |

### MENU2 — Navegación definitiva v1.2
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| MENU-01 | Menu principal desktop | Federico, Proyectos, Lab, Sobre mí (no "About") | PASS | 2026-08-23 |
| MENU-02 | Menu secundario desktop | CV + GitHub ↗ + LinkedIn ↗ correctos | PASS | 2026-08-23 |
| MENU-03 | Mobile menu secondary | Al abrir, muestra GitHub/LinkedIn + BA footer | PASS | 2026-08-23 |
| MENU-04 | Footer explorar + contacto | Links Proyectos/Lab/Sobre mí/CV + LinkedIn/GitHub/Descargar CV | PASS | 2026-08-23 |
| MENU-05 | CV discreto | CV no en hero, solo menú/footer + /cv | PASS | 2026-08-23 |

### FOTO — Fotos y placeholders v1.2
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| FOTO-01 | Home placeholder elegante si no hay /fotos/federico-profile.webp | Muestra monograma FL + texto "Reemplazar: /fotos/..." sin cuadrado gris feo | PASS | 2026-08-23 |
| FOTO-02 | About 3 placeholders reemplazables | Intereses/Lugares/Objetos con ruta /fotos/federico-about-0*.webp visible | PASS | 2026-08-23 |
| FOTO-03 | public/fotos/README.md existe | Documenta qué archivos reemplazar y tamaño | PASS | 2026-08-23 |
| FOTO-04 | Cuando foto existe, se muestra sin cambiar componentes | img onError fallback | PASS | 2026-08-23 |

### LAB2 — Lab mejorado v1.2
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| LAB-01 | Lab header humano | "Lab — cosas que estoy explorando" no lista vacía | PASS | 2026-08-23 |
| LAB-02 | Status idea/experiment/building/ready visible | Badge por item + leyenda | PASS | 2026-08-23 |
| LAB-03 | Company Workspace destacado | Card oscura con "Pieza especial" link | PASS | 2026-08-23 |
| LAB-04 | Placeholder deliberado | Card dashed "Agregar experimento — status: idea → ready" no incompleto | PASS | 2026-08-23 |

### HOME2 — Home como showroom v1.2
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| HOME-01 | Hero con BA + señal humana sutil | "Buenos Aires, Argentina" + "Software Engineer · Backend · Integraciones · 20 años · WiseTech Global" sutil, no CV | PASS | 2026-08-23 |
| HOME-02 | Foto placeholder elegante en hero | Card 88px monograma FL + "Persona real detrás" | PASS | 2026-08-23 |
| HOME-03 | Showroom prioriza Proyectos/Lab/Sobre mí/Contacto | Secciones visibles en <10s sin biografía | PASS | 2026-08-23 |
| HOME-04 | Proyectos con identidad credibilidad | Cada card muestra Qué es/Qué resuelve/Qué probar/Estado + subtítulo propio (no genérico) | PASS | 2026-08-23 |
| HOME-05 | Contacto simple sin formulario | Sección "Hablemos" con LinkedIn/GitHub/CV sin "HIRE ME NOW" | PASS | 2026-08-23 |

### LINKS2 — Links externos v1.2
| ID | Escenario | Esperado | Estado | Fecha |
|----|-----------|----------|--------|-------|
| LINK-04 | GitHub flapido correcto | https://github.com/flapido 200, target _blank | PASS | 2026-08-23 |
| LINK-05 | LinkedIn correcto | https://www.linkedin.com/in/federico-lapido 200, target _blank | PASS | 2026-08-23 |
| LINK-06 | Sin placeholder fingiendo funcionar | No hay links a midominio.com como <a> activo en PREVIEW | PASS | 2026-08-23 |

---

## Resumen — v1.2 (segunda pasada profunda)
- Total escenarios: 85 (incluye NAV-12 y PROY-05a LOCAL_DEMO)
- PASS: 85
- FAIL: 0
- NEEDS_RECHECK: 0 (RWD-01, RWD-03, RWD-05 visuales confirmados: overflow, clips, responsive en 390x844/1024x768/1440x900; slider usable; sin demoUrl pública; estado "Demo lista · publicación pendiente"; ausencia de links rotos)
- BLOCKED: 0
- Impacted retest LOCAL_DEMO: NAV-04, NAV-10, NAV-12, PROY-04, PROY-05/05a/05b, PROY-09, PREV-01/12/15, LINK-02 — PASS 2026-08-23 (Vitest + build); QA visual real: slider usable, overflow clips, responsive 390x844/1024x768/1440x900, sin demoUrl pública, estado "Demo lista · publicación pendiente" — PASS verified.
- Impacted retest v1.1: PROY-04, PROY-05/05b, PROY-09, PROY-10, PREV-01..15, LINK-02 — retesteados 2026-08-23
- Impacted retest v1.2: CV-01..12, MENU-01..05, FOTO-01..04, LAB-01..04, HOME-01..05, LINK-04..06, PERF-01/02 — todos PASS 2026-08-23 segunda pasada
- Discover 2026-08-23: nuevos escenarios CV/print/GitHub/LinkedIn/menu/About/fotos/projects/previews/links externos agregados; memoria QA previa mantenida.

## Próximos impacted
Vigente para Subastas y Legacy: cuando Cloudflare entregue una URL pública, cambiar únicamente el `demoStatus` correspondiente de `LOCAL_DEMO` a `LIVE_DEMO` y agregar `demoUrl`; retestar PROY-05b + LINK-02. No requiere rediseño ni cambio estructural.
El resto de proyectos conserva su flujo PREVIEW. Tras agregar fotos reales: retestar FOTO-01/02.

Operado por: Company Workspace QA — 2026-08-23

---

# V2-RECHECK-2026-08-25

# SOLUCIONES-V2.1-2026-08-26

SOL-01 · `/soluciones` comunica software adaptable, problema, solución y CTA · PASS · 2026-08-26
SOL-02 · Cards de soluciones muestran estado honesto, evidencia y adaptación sin enlaces de demo inventados · PASS · 2026-08-26
SOL-03 · Navegación desktop, mobile, footer y entrada de Home llegan a `/soluciones` · PASS · 2026-08-26
SOL-04 · Capturas públicas de soluciones cargan con alt útil, lazy loading no crítico y sin requests fallidos · PASS · 2026-08-26
SOL-05 · `/soluciones` no contiene Quiniela, enlaces ni assets asociados · PASS · 2026-08-26
SOL-06 · Matriz 320/360/375/390/412/430/1024/1366/1440/1920 sin overflow, clipping ni errores propios de consola · PASS · 2026-08-26
CASE-01 · Legacy → Web muestra antes/después real, migración progresiva y CTA comercial · PASS · 2026-08-26
CASE-02 · Subastas muestra flujo comercial, adaptaciones y estado DEMO LOCAL sin URL inventada · PASS · 2026-08-26
CASE-03 · Archivo Digital carga directo con evidencia pública de Tucumán, sin datos privados ni capacidades IA falsas · PASS · 2026-08-26

# ABOUT-AVATAR-2026-08-25

ABOUT-AV-01 · `/about` renderiza un único avatar MP4, muted, playsInline, metadata y sin controles/loop · PASS · 2026-08-25
ABOUT-AV-02 · Avatar inicia automáticamente, termina una sola vez y conserva el frame final · PASS · 2026-08-25
ABOUT-AV-03 · Salir y volver a `/about` permite nueva reproducción sin reinicios por rerender · PASS · 2026-08-25
ABOUT-AV-04 · Error de carga del MP4 muestra la foto estática sin romper layout · PASS · 2026-08-25
ABOUT-AV-05 · `prefers-reduced-motion: reduce` muestra foto estática y no renderiza video · PASS · 2026-08-25
ABOUT-AV-06 · Home no renderiza ni solicita `federico-avatar.mp4` · PASS · 2026-08-25
ABOUT-AV-07 · `/about` mantiene dimensiones, proporción y overflow correcto en seis viewports · PASS · 2026-08-25

# ABOUT-AVATAR-2026-08-26

ABOUT-AV-08 · Poster y fallback canónicos `/fotos/federico-about.jpg` son 16:9 y el video usa `poster` + `aspect-video` sin letterboxing · PASS · 2026-08-26
ABOUT-AV-09 · Matriz responsive ampliada (320, 360, 390, 430, 1024, 1366, 1440 y 1920) sin overflow ni recorte agresivo · PASS · 2026-08-26

V2-NAV-01 · Home muestra identidad, seniority, especialidades, 20+ años y CTA principal · PASS · 2026-08-25
V2-NAV-02 · Menú móvil abre, muestra destinos y cierra sin quedar visible · PASS · 2026-08-25
V2-NAV-03 · Technical Expertise navega a `/cv#skills` · PASS · 2026-08-25
V2-PROJ-01 · Índice y case study Subastas cargan con estado LOCAL_DEMO honesto · PASS · 2026-08-25
V2-PREV-01 · Slider Legacy → Web actualiza la comparación · PASS · 2026-08-25
V2-CV-01 · CV muestra WiseTech y descarga PDF con respuesta 200 · PASS · 2026-08-25
V2-ERR-01 · Ruta inexistente muestra 404 cuidada · PASS · 2026-08-25
V2-RWD-01 · Rutas clave no presentan overflow horizontal en viewport móvil · PASS · 2026-08-25
V2-RENDER-01 · Matriz Playwright 10 viewports × 8 rutas sin errores propios de consola · PASS · 2026-08-25
V2-PRIV-01 · Bundle no expone secretos, teléfonos ni dominios placeholder · PASS · 2026-08-25

Los escenarios V1 anteriores se conservan como historial de baseline; esta sección contiene únicamente comportamientos V2 realmente ejecutados en la reanudación.
