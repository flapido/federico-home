# V2.2 — Guía interactiva del portal

## Arquitectura

`PortalGuide` mantiene una visita data-driven desde `src/data/guideTour.ts`. Cada paso declara ruta, `data-tour-id` y copy breve. El estado y la preferencia viven sólo en `sessionStorage`; no se almacena identidad ni contenido del visitante.

## Comportamiento

- La invitación aparece sólo en Home, cinco segundos después, y se puede rechazar sin insistencia durante la sesión.
- La guía usa scroll suave, spotlight y puntero visual propios; nunca mueve el cursor real ni bloquea la interacción.
- Wheel, touch, teclas de navegación, Pausar o Escape detienen la automatización. Salir cancela timers, spotlight y rutas futuras.
- Reduced motion sustituye el scroll suave por salto mínimo. El avatar mantiene su propio fallback estático y el tour no registra `avatar_replay`.

## Cómo extender

Agregar un objeto a `guideSteps`, colocar el `data-tour-id` estable en la superficie destino y usar sólo los eventos allowlisted. Si falta un objetivo, el paso se omite sin romper la navegación.

## Privacidad

Los eventos sólo cuentan tipos, ruta y origen normalizados. No contienen textos, PII, sesiones, credenciales ni mensajes de contacto.
