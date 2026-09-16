# CHECKLIST.md — Aplicación en LinkedIn (requiere navegador autenticado)

**Quién:** únicamente el owner desde su sesión de LinkedIn.  
**Objetivo:** aplicar en el perfil real lo definido en `PROFILE.md`, `SKILLS.md`, `EXPERIENCE.md` y `FEATURED.md`, manteniendo esos archivos como fuente de verdad.

**Regla:** no publicar, enviar mensajes, solicitar recomendaciones ni hacer cambios sensibles de cuenta de forma automatizada.

Tiempo estimado total: 45–60 minutos.

---

# Paso 0 · Respaldo previo

- [ ] Abrir el perfil actual de LinkedIn.
- [ ] Hacer capturas de:
  - headline
  - About / Acerca de
  - experiencia
  - skills
  - destacados
  - educación
  - certificaciones
  - idiomas
  - información de contacto
- [ ] Guardar las capturas en `docs/linkedin/evidence/` si se desea trazabilidad.
- [ ] Opcional: usar LinkedIn → Settings → Get a copy of your data.
- [ ] No modificar nada hasta terminar el respaldo.

Motivo: permitir comparación antes/después y rollback manual.

---

# Paso 1 · Headline

Fuente:

`PROFILE.md` → **1. HEADLINE — DEFINITIVO**

- [ ] Editar el encabezado del perfil.
- [ ] Pegar exactamente:

```text
Senior Software Engineer | 20+ Years | Backend & Architecture | C#/.NET · Python | APIs & Integrations | AI Engineering · AI Agents | Legacy Modernization
```

- [ ] Guardar.
- [ ] Volver al perfil principal.
- [ ] Verificar que no quede cortado de manera incómoda.
- [ ] Verificar que se entiendan inmediatamente:
  - Senior Software Engineer
  - 20+ Years
  - C#/.NET
  - Backend
  - Architecture
  - Integrations
  - AI Engineering
  - Legacy Modernization

---

# Paso 2 · About / Acerca de

Fuente:

`PROFILE.md` → **2. ACERCA DE — TEXTO DEFINITIVO**

- [ ] Abrir sección Acerca de.
- [ ] Reemplazar el texto por la versión definitiva de `PROFILE.md`.
- [ ] Respetar saltos de línea.
- [ ] Mantener Portfolio y GitHub al final.
- [ ] Guardar.
- [ ] Revisar cómo se ven las primeras líneas antes de “ver más”.
- [ ] Revisar desktop.
- [ ] Revisar móvil si es posible.

Las primeras líneas deben comunicar:

- Senior Software Engineer
- más de 20 años
- software empresarial
- backend C#/.NET
- WiseTech Global

---

# Paso 3 · WiseTech Global

Fuente:

`EXPERIENCE.md` → **1. EXPERIENCIA PRINCIPAL — WISETECH GLOBAL**  
`EXPERIENCE.md` → **2. DESCRIPCIÓN WISETECH — VERSIÓN DEFINITIVA**

- [ ] Abrir la experiencia WiseTech Global.
- [ ] Cargo: `Software Engineer`.
- [ ] Tipo: Full-time.
- [ ] Ubicación: Buenos Aires, Argentina.
- [ ] Fecha inicio: 2004.
- [ ] Fecha fin: junio 2026.
- [ ] Desmarcar “Actualmente trabajo aquí”.
- [ ] Pegar la descripción definitiva.
- [ ] Guardar.

Verificar que aparezcan correctamente:

- [ ] C#/.NET
- [ ] Backend
- [ ] Accounting
- [ ] E-Invoicing
- [ ] System Integration
- [ ] REST APIs
- [ ] XML
- [ ] Testing
- [ ] NUnit / Moq
- [ ] Debugging
- [ ] Root Cause Analysis
- [ ] Refactoring
- [ ] Costa Rica
- [ ] México
- [ ] Chile
- [ ] República Dominicana

No agregar:

- clientes privados
- repositorios internos
- código propietario
- métricas internas
- URLs internas
- información confidencial

---

# Paso 4 · Skills principales

Fuente:

`SKILLS.md`

Prioridad:

1. C#
2. .NET
3. Backend Development
4. System Integration
5. Software Architecture

- [ ] Revisar las skills existentes antes de borrar nada.
- [ ] Conservar endorsements valiosos.
- [ ] Reordenar las skills principales.
- [ ] Mantener Microsoft SQL Server y sus validaciones.
- [ ] Agregar skills nuevas solamente mediante el autocompletado real de LinkedIn.
- [ ] No inventar nombres que LinkedIn no reconozca.

Primer bloque recomendado:

- [ ] C#
- [ ] .NET
- [ ] .NET Framework
- [ ] Backend Development
- [ ] System Integration
- [ ] Software Architecture
- [ ] REST APIs
- [ ] Microsoft SQL Server
- [ ] SQL
- [ ] ASP.NET Core
- [ ] API Integration
- [ ] Enterprise Software
- [ ] Python
- [ ] Java

---

# Paso 5 · Skills de AI Engineering

Fuente:

`SKILLS.md` → bloques AI Engineering.

Agregar únicamente si LinkedIn ofrece una skill estándar equivalente:

- [ ] Artificial Intelligence (AI)
- [ ] Generative AI
- [ ] Prompt Engineering
- [ ] Large Language Models (LLM)
- [ ] AI Agents
- [ ] AI-Assisted Development
- [ ] Agentic AI
- [ ] Workflow Automation
- [ ] Retrieval-Augmented Generation (RAG)
- [ ] Multi-Agent Systems

No cargar como skill si LinkedIn no la reconoce.

Herramientas como:

- OpenAI Codex
- ChatGPT
- Ollama
- OpenCode
- Qwen2.5-Coder
- Codex SDK
- MCP

tienen más valor descriptivo en portfolio/proyectos que como skills sueltas.

---

# Paso 6 · Asociar skills a WiseTech

Fuente:

`EXPERIENCE.md` → **4. SKILLS A ASOCIAR CON WISETECH**

Prioridad si LinkedIn limita la cantidad:

1. C#
2. .NET
3. System Integration
4. REST APIs
5. Root Cause Analysis

Si permite más:

- Backend Development
- Microsoft SQL Server
- SQL
- XML
- JSON
- NUnit
- Moq
- Unit Testing
- TDD
- Debugging
- Refactoring
- Enterprise Software
- Electronic Invoicing

No asociar por defecto a WiseTech:

- Ollama
- OpenCode
- Qwen
- Company Workspace
- MCP
- FastAPI
- AI Agents

salvo que exista evidencia real de uso dentro del trabajo.

---

# Paso 7 · Certificación

Fuente:

`PROFILE.md` / `SKILLS.md` / `EXPERIENCE.md`

Certificación documentada:

`Google Gemini — Artificial Intelligence`

Emisor:

`LinkedIn Learning`

Año:

`2025`

- [ ] Revisar primero la credencial real.
- [ ] Confirmar nombre exacto.
- [ ] Confirmar fecha.
- [ ] No inventar Credential ID.
- [ ] No inventar Credential URL.
- [ ] Guardar solamente datos comprobados.

---

# Paso 8 · Destacados / Featured

Fuente:

`FEATURED.md`

Orden:

## F-1 Portfolio

URL:

`https://federico-home.pages.dev/`

Título:

`Portfolio — Federico Lapido`

- [ ] Agregar.
- [ ] Probar enlace.

## F-2 CV PDF

URL:

`https://federico-home.pages.dev/cv/Federico_Lapido_CV.pdf`

Título:

`CV — Federico Lapido (PDF)`

- [ ] Agregar.
- [ ] Probar enlace.

## F-3 GitHub

URL:

`https://github.com/flapido`

Título:

`GitHub — flapido`

- [ ] Agregar.
- [ ] Probar enlace.

## F-4 Post técnico

- [ ] No agregar todavía si no existe un post elegido/publicado.
- [ ] Cuando se publique un post fuerte, evaluar fijarlo como cuarto elemento.

---

# Paso 9 · Proyectos

Fuente:

`EXPERIENCE.md` → **10. PROYECTOS PERSONALES ACTUALES**

Prioridad sugerida:

1. Company Workspace
2. Legacy → Web
3. Sistema de Subastas
4. Federico Home

- [ ] Crear proyectos solamente si LinkedIn ofrece una presentación limpia y útil.
- [ ] Usar estados reales.
- [ ] No llamar “producción” a una demo.
- [ ] Usar solamente URLs públicas verificadas.

## Company Workspace

Debe transmitir:

- AI Agents
- Multi-Agent Workflows
- Requirements
- Architecture
- Development
- Verification
- QA
- Quality Gates
- Human Control

No describirlo simplemente como “prompts”.

---

# Paso 10 · Educación

Fuente:

`EXPERIENCE.md` → **13. EDUCACIÓN**

- [ ] No inventar información.
- [ ] Verificar ORT.
- [ ] Verificar nombre exacto de la institución.
- [ ] Verificar título secundario.
- [ ] Verificar formación terciaria.
- [ ] Verificar denominación oficial de `Analista de Sistemas`.
- [ ] Verificar fechas antes de cargarlas.
- [ ] Si falta un dato importante, dejarlo pendiente.

---

# Paso 11 · Idiomas

Fuente:

`EXPERIENCE.md` → **15. IDIOMAS**

## Español

- [ ] Nativo o bilingüe.

## Inglés

- [ ] Professional working proficiency.

No exagerar el nivel.

Eliminar duplicados tipo:

- Spanish
- Español

si aparecen como skills innecesarias.

---

# Paso 12 · Foto

Fuente:

`PROFILE.md` → **4. FOTO**

- [ ] Mantener foto profesional real.
- [ ] Sin marco público #OpenToWork.
- [ ] Rostro claramente visible.
- [ ] Crop centrado.
- [ ] No aplicar filtros artificiales.
- [ ] No reemplazar por imagen generada por IA.

---

# Paso 13 · Banner

Fuente:

`PROFILE.md` → **5. BANNER**

Texto recomendado:

```text
Federico Lapido
Senior Software Engineer
Backend · Architecture · Integrations · AI Engineering
C#/.NET · Python · APIs · AI Agents · Legacy Modernization
```

- [ ] Reemplazar banner genérico/mar por banner profesional cuando esté listo.
- [ ] Mantener diseño sobrio.
- [ ] Verificar que la foto de perfil no tape texto importante.
- [ ] Verificar desktop.
- [ ] Verificar móvil.

Dimensión recomendada:

`1584 × 396 px`

---

# Paso 14 · Open to Work

Fuente:

`PROFILE.md` → **6. OPEN TO WORK**

Decisión actual:

**Visible solamente para técnicos de selección / recruiters.**

- [ ] Confirmar que Open to Work siga activo.
- [ ] Confirmar modalidad recruiters only.
- [ ] Confirmar que NO aparezca marco verde público.
- [ ] Cargos:
  - Senior Software Engineer
  - Backend Engineer
  - Software Engineer
- [ ] Tipo:
  - Full-time
  - Contract
- [ ] Ubicación:
  - Buenos Aires
  - Remote

No agregar `Software Architect` como cargo principal.

---

# Paso 15 · Contacto y CTA

Fuente:

`PROFILE.md` → **7. INFORMACIÓN DE CONTACTO**  
`PROFILE.md` → **8. BOTÓN / CTA DEL PERFIL**

- [ ] Email correcto.
- [ ] Portfolio agregado.
- [ ] GitHub agregado si LinkedIn lo permite.
- [ ] Teléfono no público.
- [ ] Cumpleaños oculto.
- [ ] Fecha de nacimiento oculta.
- [ ] URL personalizada correcta:
  `linkedin.com/in/federico-lapido`
- [ ] CTA preferido: `Ver portfolio`.
- [ ] URL CTA:
  `https://federico-home.pages.dev/`

---

# Paso 16 · Configuración general

Fuente:

`PROFILE.md` → **18. CONFIGURACIÓN GENERAL**

Verificar:

- [ ] Nombre: Federico Lapido.
- [ ] Sin títulos dentro del campo nombre.
- [ ] Ubicación: Buenos Aires, Argentina.
- [ ] Industria: Software Development.
- [ ] Perfil público habilitado.
- [ ] URL personalizada correcta.
- [ ] Portfolio visible.
- [ ] GitHub visible.
- [ ] WiseTech finalizado en junio 2026.
- [ ] Open To Work solo recruiters.
- [ ] Sin marco verde público.

---

# Paso 17 · Revisión visual completa

Volver al perfil principal y verlo como visitante.

Comprobar en menos de 5 segundos:

- [ ] Senior Software Engineer queda claro.
- [ ] 20+ años queda claro.
- [ ] C#/.NET aparece como fortaleza.
- [ ] Backend aparece.
- [ ] Integrations aparece.
- [ ] Architecture aparece sin falsear cargo.
- [ ] AI Engineering aparece como diferencial actual.
- [ ] Legacy Modernization aparece.
- [ ] Portfolio es fácil de encontrar.
- [ ] GitHub es fácil de encontrar.
- [ ] No parece un perfil exclusivamente de E-Invoicing.
- [ ] No parece un perfil exclusivamente de IA.
- [ ] La trayectoria enterprise se entiende.

---

# Paso 18 · Prueba en incógnito

- [ ] Abrir ventana incógnito/no autenticada.
- [ ] Abrir:
  `https://www.linkedin.com/in/federico-lapido/`
- [ ] Revisar qué partes del perfil son visibles públicamente.
- [ ] Abrir portfolio.
- [ ] Abrir CV PDF.
- [ ] Abrir GitHub.
- [ ] Confirmar que no haya enlaces rotos.
- [ ] Confirmar que no haya datos privados expuestos accidentalmente.

---

# Paso 19 · GitHub

Fuente:

`FEATURED.md` → **4. Curación complementaria de GitHub**

Revisar:

- [ ] Bio.
- [ ] Repos pinned.
- [ ] README del perfil.
- [ ] Descripciones de repos.
- [ ] Repos antiguos que puedan generar mala primera impresión.

Bio sugerida:

```text
Senior Software Engineer — backend, integraciones y modernización de legacy. IA aplicada con criterio humano.
```

Repos sugeridos para fijar, siempre que estén públicos y correctamente preparados:

- federico-home
- stock-subastas-demo
- legacy-app-explorer-demo

---

# Paso 20 · Posts

Fuente:

`docs/linkedin/posts/drafts/`

- [ ] No publicar todos juntos.
- [ ] Elegir un borrador.
- [ ] Revisar texto manualmente.
- [ ] Publicar solamente cuando el owner lo decida.
- [ ] No automatizar publicación.
- [ ] Después de publicar un post fuerte, evaluar fijarlo en Featured.
- [ ] Mantener una cadencia razonable, no spam.

---

# Paso 21 · CHANGELOG

Después de aplicar cambios:

- [ ] Abrir `CHANGELOG.md`.
- [ ] Registrar fecha.
- [ ] Registrar qué se aplicó realmente.
- [ ] Registrar diferencias entre propuesta y resultado final.
- [ ] Actualizar los archivos fuente si LinkedIn obligó a usar una variante diferente.
- [ ] Mantener PROFILE, SKILLS, EXPERIENCE y FEATURED sincronizados con el perfil vivo.

---

# Paso 22 · Criterio de cierre

La optimización principal de LinkedIn se considera completa cuando:

- [ ] Headline aplicado.
- [ ] About aplicado.
- [ ] WiseTech actualizado.
- [ ] Fecha de fin correcta.
- [ ] Skills principales ordenadas.
- [ ] AI skills relevantes cargadas.
- [ ] Certificación verificada.
- [ ] Portfolio en Featured.
- [ ] CV en Featured.
- [ ] GitHub en Featured.
- [ ] Idiomas revisados.
- [ ] Educación verificada o explícitamente pendiente.
- [ ] Foto revisada.
- [ ] Banner profesional aplicado o documentado como pendiente.
- [ ] Open To Work solo recruiters.
- [ ] Contacto revisado.
- [ ] Perfil probado en incógnito.
- [ ] CHANGELOG actualizado.

Los posts y la curación continua de GitHub son tareas posteriores y evolutivas.

---

# REGLA FINAL

No cambiar LinkedIn por intuición aislada.

Flujo recomendado:

1. revisar fuente de verdad;
2. verificar que el dato sea real;
3. hacer respaldo;
4. aplicar cambio;
5. revisar visualmente;
6. comprobar privacidad;
7. actualizar CHANGELOG;
8. mantener los documentos sincronizados.

Objetivo final:

**un perfil que muestre con claridad una trayectoria senior en Software Engineering, backend C#/.NET, integraciones y arquitectura, con evolución actual hacia AI Engineering, agentes y modernización de sistemas legacy.**
