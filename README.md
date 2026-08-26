# Federico Home V2 — Senior Engineering Portfolio

Portfolio profesional de Federico Lapido. Es un hub estático para presentar experiencia, expertise técnico, case studies y experimentos de ingeniería. No incorpora código, datos ni lógica de los proyectos hermanos.

## Enfoque V2

- Senior Software Engineer: backend, arquitectura, integraciones, calidad, modernización legacy e IA aplicada.
- Lenguaje visual editorial: papel, tinta, terracota y latón; fotografía real y tipografía cuidada.
- Contenido estructurado en `src/data/` para evitar que los datos profesionales queden dispersos en JSX.
- Case studies con estados honestos: `PREVIEW`, `LOCAL_DEMO` y `LIVE_DEMO`.
- Accesibilidad base: HTML semántico, enlace para saltar al contenido, foco visible y soporte de reducción de movimiento.

## Contacto server-side

La consulta de `/contacto` usa la Pages Function `functions/api/contacto.ts`. Para habilitar entrega real, Cloudflare Pages requiere los secretos server-side `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID`; nunca deben usar prefijo `VITE_`, guardarse en Git ni aparecer en el bundle.

## Stack

- Vite + React 19 + TypeScript + React Router 7
- Tailwind CSS 4
- Vitest + Testing Library
- Playwright disponible para QA local

## Ejecutar localmente

Requiere Node 20 o superior.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

`npm run dev` sirve la aplicación en `http://localhost:5173` por defecto. `npm run preview` permite revisar el build estático generado en `dist/`.

## Rutas

- `/` — resumen profesional, experiencia, expertise, IA, legacy, proyectos y contacto.
- `/proyectos` — case studies del hub.
- `/proyectos/:slug` — detalle y preview local de cada proyecto.
- `/lab` — Engineering Lab con estado explícito de cada experimento.
- `/about` — trayectoria, forma de trabajo y contribución.
- `/cv` — CV web y descarga del PDF público existente.

## Contenido y evidencia

- `src/data/cv.ts` contiene perfil, experiencia confirmada, categorías técnicas, workflows y datos del CV web.
- `src/data/projects.ts` contiene metadata de proyectos, estados de demo, case studies y Lab.
- La información profesional parte del CV disponible en `docs/inbox/` y del mandato V2. No agregar métricas, clientes, títulos, certificaciones o resultados sin evidencia pública verificable.

## Estado de demos

Federico Home solo presenta metadata y previews con datos ficticios:

- `PREVIEW`: recorrido interactivo dentro del hub; no es una demo oficial.
- `LOCAL_DEMO`: el proyecto hermano tiene una demo local independiente, sin URL pública confirmada.
- `LIVE_DEMO`: solo puede usarse cuando existe una URL pública verificada.

Las demos siguen siendo responsabilidad de cada proyecto independiente. Este repositorio no crea ni sincroniza demos de terceros.

## Estructura principal

```text
src/
  components/  Layout y componentes de presentación reutilizables
  data/        contenido profesional y metadata de case studies
  pages/       Home, Projects, ProjectDetail, Lab, About, CV y 404
  previews/    previews ligeras, locales y con datos ficticios
  test/        cobertura enfocada de UI y arquitectura del hub
public/
  cv/          PDF público descargable
  fotos/       fotografía de perfil
```

## Mejora futura

V2.x podrá incorporar un avatar profesional animado, opcional y compatible con `prefers-reduced-motion`: foto quieta, sonrisa leve, dos pulgares arriba y regreso a un estado neutro. No forma parte de V2.

## Límites

No incluye backend, autenticación, bases de datos, producción, analítica, servicios externos ni despliegue. La publicación, cambios DNS y acciones de Git remotas requieren autorización separada.
