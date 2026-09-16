# Pre-development report — Analytics Owner Exclusion + Private Visitor History

Fecha: 2026-09-03
Rama: master
Commit base: d644428

## Decisión

Se implementa exclusión del propietario en analytics público y se agrega historial privado de visitantes en Admin, manteniendo la arquitectura actual de Cloudflare Pages Functions + D1.

## Estado base verificado

- Rama `master` alineada con `origin/master` en `d644428`.
- Build PASS (`tsc -b && vite build`).
- Tests PASS (32/32).
- QA baseline PASS (docs/qa/SCENARIOS.md).
- Cambios locales sin commit preservados (capturas, docs, test-results, .kilo/, public/fotos/).
- No se hará commit, push, merge ni deploy en este ciclo.

## Arquitectura elegida

### 1. Identificación del propietario

- Se aprovecha la sesión admin existente (`fh_admin_session`, HttpOnly, Secure, SameSite=Strict).
- Los endpoints públicos de analytics revisan el cookie `fh_admin_session` server-side.
- Si la sesión es válida, se marca la solicitud como `is_owner = 1` y se excluye de los totales públicos.
- No se agrega IP fija ni nuevas credenciales.
- No se exponen secretos al frontend.

### 2. Exclusión de analytics público

- En `/api/analytics/event`: si `hasAdminSession` es true, se salta `recordEvent` en `analytics_event_totals` pero se registra en el historial privado.
- En `functions/api/contacto.ts` y `functions/api/guestbook.ts`: se agrega la misma verificación antes de llamar a `recordEvent`.
- El contador público (`/api/analytics/visit-counter`) deja de incrementarse para el propietario porque los eventos del propietario ya no se insertan en `analytics_event_totals`.
- Datos históricos: se preservan sin modificar. Se documenta que pueden contener visitas del propietario.

### 3. Historial privado de visitantes

Nueva tabla D1 `analytics_visits` (migración `0005_analytics_visits.sql`):

```sql
CREATE TABLE IF NOT EXISTS analytics_visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at INTEGER NOT NULL,
  day TEXT NOT NULL,
  event_type TEXT NOT NULL,
  path TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL DEFAULT '',
  country TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT '',
  city TEXT NOT NULL DEFAULT '',
  referrer TEXT NOT NULL DEFAULT '',
  user_agent_hash TEXT NOT NULL DEFAULT '',
  visitor_hash TEXT NOT NULL DEFAULT '',
  is_owner INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS analytics_visits_day
  ON analytics_visits (day);

CREATE INDEX IF NOT EXISTS analytics_visits_visitor_day
  ON analytics_visits (visitor_hash, day);
```

Datos guardados:
- `created_at`: timestamp Unix.
- `day`: fecha ISO.
- `event_type`: tipo de evento allowlisted.
- `path`: ruta normalizada.
- `source`: origen normalizado.
- `country`, `region`, `city`: desde headers de Cloudflare (`CF-IPCountry`, `CF-Region`, `CF-City`).
- `referrer`: header `referer` normalizado, sin query string.
- `user_agent_hash`: hash determinista del user-agent para agrupar dispositivo/navegador sin guardar el string completo.
- `visitor_hash`: HMAC-SHA256 del ID de visitante, para deduplicar sesiones sin exponer PII.
- `is_owner`: 1 si la solicitud tiene sesión admin válida.

Datos NO guardados:
- IP completa.
- Cookies de sesión admin.
- Query strings de URLs.
- Cuerpo de formularios.
- Datos sensibles de usuario.

Visitor ID:
- Cookie `fh_visitor_id` con UUID aleatorio, 1 año, Secure, SameSite=Strict.
- Se setea server-side en la respuesta de `/api/analytics/event` si no existe.
- No se expone al frontend más allá del cookie estándar.

### 4. Admin UI

Se agrega sección "Visitantes" en `/admin` con:

- 3 cards resumen: Hoy, Últimos 7 días, Países principales.
- Tabla reciente: Hora | Ubicación | Entrada | Origen | Visitante (hash acortado).
- Estética consistente con el resto del panel (editorial/cálida/profesional).

### 5. API Admin extendida

`/api/admin/analytics/summary` agrega al JSON de respuesta:

```typescript
visitors: {
  today: number;
  seven: number;
  thirty: number;
  topCountries: { country: string; count: number }[];
  recent: {
    time: string;
    location: string;
    path: string;
    source: string;
    visitorId: string;
    isOwner: boolean;
  }[];
};
```

## Archivos a modificar

1. `migrations/0005_analytics_visits.sql` — nuevo.
2. `functions/_lib/analytics.ts` — helpers para historial privado (`extractGeo`, `extractReferrer`, `userAgentHash`, `hashVisitorId`, `recordVisit`).
3. `functions/api/analytics/event.ts` — exclusión de propietario, registro en `analytics_visits`, cookie `fh_visitor_id`.
4. `functions/api/analytics/visit-counter.ts` — sin cambios funcionales (la exclusión se resuelve en inserción), pero se confirma compatibilidad.
5. `functions/api/contacto.ts` — exclusión de propietario antes de `recordEvent`.
6. `functions/api/guestbook.ts` — exclusión de propietario antes de `recordEvent`.
7. `functions/api/admin/analytics/summary.ts` — extender respuesta con `visitors`.
8. `src/lib/analytics.ts` — sin cambios obligatorios (el server maneja la cookie).
9. `src/pages/Admin.tsx` — nueva sección "Visitantes".
10. `src/test/analytics-visits.test.ts` — tests nuevos.
11. `src/test/analytics.test.ts` — ajustes menores si corresponde.

## Riesgos y mitigaciones

- **Riesgo:** Sesiones admin existentes no excluyen hasta nuevo login.
  - **Mitigación:** Esperable. El owner debe volver a autenticarse para activar la exclusión.
- **Riesgo:** Cookie `fh_visitor_id` puede bloquearse por navegadores.
  - **Mitigación:** Si no hay cookie, se genera una nueva en cada request. La deduplicación es best-effort.
- **Riesgo:** Headers de Cloudflare pueden no estar disponibles en desarrollo local.
  - **Mitigación:** Se usan valores default `""`; localhost ya está excluido de analytics por `analyticsClientEnabled()`.
- **Riesgo:** Incremento de tamaño de D1.
  - **Mitigación:** Se guardan filas compactas; sin PII. Se puede agregar pruning futuro si crece mucho.

## Criterios de aceptación

- [ ] Sesión admin válida excluye eventos públicos.
- [ ] Visitantes normales continúan registrándose.
- [ ] Contador público excluye al propietario.
- [ ] Historial privado solo accesible con sesión admin.
- [ ] No se almacena IP completa.
- [ ] Visitas recientes muestran ubicación/origen/página.
- [ ] Localhost sigue sin analytics.
- [ ] Build PASS.
- [ ] Tests PASS.
- [ ] QA relevante PASS.
- [ ] Sin regresiones.
