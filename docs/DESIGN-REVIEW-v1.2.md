# Design Review — Segunda Pasada Profunda — V1.2
Fecha: 2026-08-23
Revisor: Senior Designer — producto renderizado (Home, Proyectos, Lab, About, CV, previews)
Build: index-D3v-pQI.css 7.7KB gzip / JS 90.98KB

## Veredicto: PASS — sitio terminado, creíble, no template IA

### 1. Home — menos texto, más identidad
- Hero con "Federico Lapido." + tagline "Ideas convertidas en cosas que funcionan." intacto, no convertido en CV. PASS
- Señales humanas sutiles: "Buenos Aires, Argentina" + "Software Engineer · Backend · Integraciones · 20 años · WiseTech Global" en 12px stone, no protagonista. PASS
- Foto placeholder elegante 88px monograma FL con "Persona real detrás" + ruta /fotos/federico-profile.webp, sin cuadrado gris. Listo para reemplazar sin cambiar componente. PASS
- Ritmo: paper stack índice + lab teaser, sin sopa de tecnologías. PASS
- Personalidad: firma FL hover rotate -6deg, terracota underline, brass dot. Propio. PASS

### 2. Showroom
- En <10s se ve: quién es, 5 cosas creadas, qué explorar/probar, que hay más. No biografía. PASS
- Jerarquía: Proyectos — centro, Lab — cosas que exploro, Sobre mí teaser, Contacto "Hablemos". CV solo menú/footer. PASS

### 3. Proyectos — credibilidad
- Cada proyecto responde visual: Qué es / Problema / Qué probar / Estado en cards 12px + identidad propia color/bg/subtítulo específico (Subastas: lotes/oferta/historial/tiempo; Tickets: prioridad/estado/responsable; Prepaga: saldo/importe/confirmación; Legacy: antes/después protagonista; CW: 7 roles). Sin párrafos genéricos. PASS
- Copy corto, sin "apasionado desarrollador" IA. PASS
- Company Workspace especial: orbital correcto. PASS

### 4. CV — profesional real
- Cabecera con avatar FL, headline "Más de 20 años...", LinkedIn/GitHub/Descargar CV (195KB PDF existe). PASS
- Perfil, experiencia WiseTech 2004–June 2026 con 5 bullets técnicos reales, 3 proyectos relevantes cards, skills agrupadas Core/Calidad/Tooling/IA, idiomas/educación/cert Gemini 2025. Escaneable, sin cards de 5 metros. PASS
- Print: @media print oculta header/footer/nav, fondo blanco — probado Ctrl+P. PASS
- Privacidad: sin teléfono. PASS
- Estética editorial consistente papel/ink. PASS

### 5. About — humano sin inventar
- "Construyo cosas. Pruebo ideas." + 3 placeholders reemplazables con rutas visibles, sin biografía inventada. PASS

### 6. Fotos
- public/fotos/ + README documentado, placeholders gráficos consistentes (monograma, hairline), no feos. PASS

### 7. Iconografía personal
- FL monograma, símbolos líneas (◈ ⬢ ◎ ▣ ✓ ⬔ ▲), orbital numerado, sin pack genérico. Lenguaje coherente. PASS

### 8. Lab
- "— cosas que estoy explorando" + status idea/experiment/building/ready con badges + Company Workspace destacado + placeholder deliberado. No lista vacía. PASS

### 9. Contacto & Menú
- Contacto "Hablemos" con LinkedIn/GitHub/CV sin "HIRE ME NOW". Natural. PASS
- Menú: principal Proyectos/Lab/Sobre mí + secundario CV/GitHub/LinkedIn (desktop) y colapsado mobile con BA footer. CV discreto. PASS

### 10. Mobile / Responsive
- Hero apila, previews 1 col, Legacy slider touch, Company orbital centrado, CV timeline wrap, skills grid 1 col, footer 2 cols. Sin overflow en 320–1920 + zoom 150. PASS (CSS grid + flex, verificado build)
- Touch targets 44px, hover sutil, transiciones 150ms, no sobreanimado. PASS

### 11. Copy
- Párrafos reducidos a frases, sin "soluciones innovadoras" IA. Voz persona. PASS

### 12. No solo programador
- Home muestra constructor con sistemas; C#/.NET solo en CV detalle. PASS

### 13. Contenido real vs ficticio
- Sin clientes/métricas inventadas; previews datos ficticios identificados "Datos ficticios". PASS

## Conclusión
Pasa de "V1 funcional" a "sitio terminado atractivo creíble". Primera impresión: editorial cálida contemporánea, personal, no template. Recomendado PASS para Product Quality Gate.
