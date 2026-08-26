# Federico Home V2.1 — Soluciones

Fecha: 2026-08-26

## Alcance entregado

- Nueva ruta pública `/soluciones`, incorporada a navegación desktop, móvil y footer.
- Entrada discreta desde Home: «Software que puedo adaptar a tu necesidad».
- Página comercial basada en problema → solución → evidencia → adaptación → CTA.
- Estados honestos: `DEMO LOCAL`, `CASO REAL` y `CONCEPTO`.

## Evidencia curada

| Caso | Estado | Asset público | Origen y revisión |
|---|---|---|---|
| Sistema de Subastas | DEMO LOCAL | `public/solutions/subastas/case-study.png` | Captura real del case study existente, datos ficticios, sin endpoint público declarado. |
| Legacy → Web | DEMO LOCAL | `public/solutions/legacy/dashboard-demo.png` | Captura real de la propuesta web con datos de demo; inspeccionada visualmente, sin personas, cuentas ni secretos reales. |
| Archivo y Memoria Digital | CASO REAL | `public/solutions/acervo/pdf-viewer.png` | Captura QA real del visor PDF de Acervo Digital con documento local de prueba. |
| MVP, automatización e IA aplicada | CONCEPTO | Visual editorial de proceso | No se presenta como producto terminado ni como screenshot de aplicación. |

## Selección y descarte

Se inspeccionaron `stock-subastas`, `stock-subastas-demo`, `legacy-app-explorer`, `legacy-app-explorer-demo`, `acervo-digital`, `company-workspace-tickets`, `fastapi-ia-lab`, y otros proyectos locales por nombre y documentación disponible. Se seleccionaron Subastas, Legacy y Acervo por contar con evidencia visual revisable; Company Workspace respalda el flujo editorial de IA y QA. Se descartaron Tickets, Home Assistant, FastAPI local y proyectos incompletos como evidencia comercial principal por no tener una superficie pública o una documentación/estado suficientemente presentable.

Todos los paths y proyectos cuyo nombre contiene `quiniela` o `quiniela-analytics` quedaron excluidos: no se inspeccionaron para este trabajo, no se copiaron assets y no se mencionan en el producto.

## Límite de demos

Subastas y Legacy se presentan como `DEMO LOCAL`: los manifests de sus proyectos hermanos declaran `demoUrl: null`. No se publica un enlace externo funcional para ninguno. Acervo se usa como evidencia visual, sin afirmar disponibilidad pública.
