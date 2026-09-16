# FEATURED.md — Fuente de verdad de la sección Destacados

**Objetivo:** convertir visitas de perfil en evidencia (portfolio, código, CV) en ≤2 clics.
Orden por conversión, no por antigüedad.

---

## 1. Elementos a fijar (orden final)

### F-1 · Portfolio (link)

- URL: `https://federico-home.pages.dev/`
- Título sugerido: `Portfolio — Federico Lapido`
- Descripción: `Proyectos, experiencia y forma de trabajar: backend, integraciones, modernización de legacy e IA aplicada.`
- Por qué primero: es el activo controlado más completo y actualizado; destino del botón CTA del perfil.

### F-2 · CV en PDF (link)

- URL pública estable: `https://federico-home.pages.dev/cv/Federico_Lapido_CV.pdf`
- Título: `CV — Federico Lapido (PDF)`
- Por qué segundo: recruiters buscan el PDF; tenerlo fijado evita fricción de mensajes.
- Verificado contra el repo: mismo archivo immutable del inbox (`docs/inbox/Federico_Lapido_CV.pdf`).

### F-3 · GitHub (link)

- URL: `https://github.com/flapido`
- Título: `GitHub — flapido`
- Descripción: `Demos aisladas con datos ficticios y proyectos propios.` 
- Por qué tercero: evidencia de práctica; requiere curación previa (§4) para buena impresión.

### F-4 · Primer post publicado (reservado)

- Cuando el owner publique su primer post (borradores en `posts/drafts/`), fijarlo en esta posición.
- Publicación prohibida en este mandato; queda como paso manual documentado.

---

## 2. Reglas de la sección

- Máximo 4–5 ítems fijos; rotar solo cuando haya post nuevo relevante.
- Cada ítem debe abrir en pestaña nueva y funcionar sin login.
- Si un enlace deja de responder (ej. redeploy del portfolio), retirarlo antes que dejar roto.
- No destacar la cuenta secundaria `WTGLapido` (decisión abierta D-05 del reporte de intake).

## 3. Dependencias externas conocidas

- El portfolio deployado aún sirve el build anterior al rediseño V2 (`DIAGNOSTICO.md`).
  Los links elegidos (`/`, `/cv/…`) son rutas estables válidas también en V2, así el Destacado
  sigue siendo correcto después del redeploy.
- Redeploy/publicación: **fuera de este mandato** (no autorizado commit/push/deploy).

## 4. Curación complementaria de GitHub (G-15)

Quien llega desde LinkedIn aterriza en GitHub; dejarlo sin curar desperdicia el clic.

1. **Bio sugerida:** `Senior Software Engineer — backend, integraciones y modernización de legacy. IA aplicada con criterio humano.`
2. **Repos fijados (pinned):** `federico-home`, `stock-subastas-demo`, `legacy-app-explorer-demo`.
3. **Perfil README** (`flapido/flapido` repo): versión breve del About de LinkedIn con links a portfolio.
4. Revisar descripciones de repos antiguos (`apphistory-project`, `mimascota`) para que ninguna
   descripción contradiga el posicionamiento senior (pueden quedarse; solo describir bien).
