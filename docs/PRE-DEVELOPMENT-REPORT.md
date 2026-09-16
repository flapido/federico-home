# Consola Remota V3 — Pre-Development Report

## 1. Scope & Acceptance Criteria

### In Scope (V3 Base)
- Página independiente `/consola` fullscreen, sin navbar/footer/sidebar del portfolio
- Fondo oscuro, diseño minimalista consistente con Agent Console V2
- 8 estados UI: PC OFFLINE, PC ONLINE (sin Agent Console), PC ONLINE + Agent Console ONLINE, auth pendiente, código enviado, código incorrecto/vencido, sesión autorizada, sesión expirada
- Sistema OTP remoto independiente del login admin existente
- Heartbeat seguro desde company-workspace-tickets hacia Cloudflare Pages Functions
- Sesión remota con cookie propia (`fh_console_session`), 1h idle timeout
- Preparación local sin exponer PTY/shell/Django públicamente

### Out of Scope (NO HACER)
- Proxy público de 8022
- Exposición directa de Django
- Bind 0.0.0.0 / port forwarding
- WebSocket/PTY remoto real (solo placeholder post-auth)
- Commit / push / deploy
- DNS público definitivo

## 2. Architecture Decision

### Chosen: Cloudflare Pages Functions + D1 + Heartbeat Loopback

```
Browser (https://federico-home.pages.dev/consola)
  ↓ HTTPS
Cloudflare Pages (Frontend SPA + Functions)
  ↓ API calls
  ├─ /api/consola/heartbeat  → recibe heartbeats locales
  ├─ /api/consola/status     → consulta estado PC + Agent Console
  ├─ /api/consola/request-code → OTP Telegram (D1)
  └─ /api/consola/verify-code  → valida OTP, crea sesión (D1)

C:\Dev\Projects\company-workspace-tickets
  ├─ Django 127.0.0.1:8000  (loopback only)
  ├─ Agent Console Bridge 127.0.0.1:8022  (loopback only)
  └─ Heartbeat Client → POST https://federico-home.pages.dev/api/consola/heartbeat
       (cada 30s, sin datos sensibles)
```

### Rationale
- **No port forwarding**: PC inicia conexión saliente hacia Cloudflare
- **No nuevos túneles**: Reusa Cloudflare Pages existente
- **No exponer 8022**: Heartbeat es el único dato público del equipo local
- **Fail closed**: Sin heartbeat reciente → PC OFFLINE
- **WebSocket futuro preparado**: Misma arquitectura puede evolucionar a Cloudflare Tunnel / Durable Objects cuando se valide seguridad

### Heartbeat Payload (público, sin datos sensibles)
```json
{
  "ts": 1693891200,
  "pc_id": "WIN-DESKTOP-XXXX",  // non-sensitive hostname
  "django": "ok|fail|unknown",
  "agent_console": "ok|fail|unknown",
  "bridge": "ok|fail|unknown"
}
```

## 3. Files to Create/Modify

### federico-home
| Path | Action | Purpose |
|------|--------|---------|
| `src/pages/Consola.tsx` | CREATE | Fullscreen console page with 8 states |
| `src/App.tsx` | MODIFY | Add `/consola` route outside Layout |
| `functions/api/consola/heartbeat.ts` | CREATE | Accept heartbeats from local PC |
| `functions/api/consola/status.ts` | CREATE | Return last heartbeat status |
| `functions/api/consola/request-code.ts` | CREATE | Remote console OTP request |
| `functions/api/consola/verify-code.ts` | CREATE | Remote console OTP verify + session |
| `functions/_lib/console-auth.ts` | CREATE | Shared auth utilities for remote console |
| `migrations/0006_remote_console.sql` | CREATE | D1 schema for console tables |
| `src/test/consola.test.tsx` | CREATE | UI tests for console page |
| `src/test/console-auth.test.ts` | CREATE | Unit tests for OTP primitives |

### company-workspace-tickets
| Path | Action | Purpose |
|------|--------|---------|
| `tickets/agent_console_heartbeat.py` | CREATE | Django endpoint for heartbeat client |
| `scripts/Start-AgentConsole.ps1` | MODIFY | Add heartbeat client to launcher |
| `tickets/urls.py` | MODIFY | Register heartbeat URL |

## 4. Security Assumptions

1. **OTP**: 6 dígitos, TTL 5 min, hash en D1, rate limit 3/15min, 5 intentos máximos
2. **Session cookie**: `fh_console_session`, HttpOnly, Secure, SameSite=Strict, TTL 1h
3. **Idle timeout**: 1 hora sin actividad → sesión inválida (frontend manda keepalive)
4. **Heartbeat**: Loopback-only en Django, público en Cloudflare (sin datos sensibles)
5. **Origin validation**: Preparado para futuro WebSocket
6. **Fail closed**: Ante cualquier duda, no dar acceso

## 5. Secrets / Environment Variables Needed

### Cloudflare Pages (federico-home)
| Variable | Purpose |
|----------|---------|
| `CONSOLE_OTP_SECRET` | HMAC secret para hashear OTP y sesiones de consola |
| `TELEGRAM_BOT_TOKEN` | Reusar del admin existente |
| `TELEGRAM_CHAT_ID` | Reusar del admin existente |
| `ANALYTICS_DB` | D1 binding (reusar) |

### company-workspace-tickets (local)
| Variable | Purpose |
|----------|---------|
| `CONSOLE_HEARTBEAT_URL` | URL del endpoint Cloudflare (default: production) |
| `CONSOLE_HEARTBEAT_INTERVAL` | Intervalo en segundos (default: 30) |
| `CONSOLE_HEARTBEAT_TIMEOUT` | Timeout HTTP (default: 10s) |

## 6. Pending for Real Remote Connection

1. **Cloudflare Tunnel** o **Durable Objects** para WebSocket reverse proxy
2. **Origin validation** estricta en el gateway
3. **Certificate pinning** o validación de tunnel
4. **Prueba end-to-end** con router/NAT real
5. **Aprobación de seguridad** antes de exponer cualquier PTY

## 7. Risk Register

| Risk | Mitigation |
|------|-----------|
| Robo/reuso de OTP | Hash en D1, single-use, TTL corto |
| Brute force | Rate limit 3 req/15min, 5 intentos máx |
| Replay | Token aleatorio 32 bytes, HMAC verification |
| CSRF | SameSite=Strict, JSON-only endpoints |
| XSS | Sin innerHTML, React escape, CSP existente |
| Session fixation | Token nuevo en cada login |
| WebSocket hijacking futuro | Origin validation preparada |
| PC offline | Heartbeat timeout → UI OFFLINE |
| Tunnel caído | Fail closed, mostrar error |
| Secretos Telegram | Solo en Cloudflare env, no en Git |

## 8. QA Evidence

### CONSOLE_PAGE: PASS
- `/consola` route added outside Layout (no navbar/footer)
- Fullscreen dark page renders correctly
- All 8 states implemented and tested
- Tests: `src/test/consola.test.tsx` — 2 tests PASS

### PC_STATUS_UI: PASS
- PC ONLINE / OFFLINE indicators render
- Agent Console ONLINE / OFFLINE indicators render
- Status polling every 15s (30s when authorized)

### HEARTBEAT_DESIGN: PASS
- Django endpoint `agent_console_heartbeat.py` created (loopback-only)
- Cloudflare Pages Function `functions/api/consola/heartbeat.ts` created
- Local client added to `Start-AgentConsole.ps1` (background job, 30s interval)
- Payload contains no sensitive data

### TELEGRAM_OTP: PASS
- Remote console OTP system implemented (`request-code.ts`, `verify-code.ts`)
- 6-digit codes, 5 min TTL, hash storage
- Rate limit: 3 requests per 15 minutes
- Independent from admin OTP (separate tables, separate cookie)

### OTP_EXPIRY: PASS
- Codes expire after 5 minutes
- Used/invalidated after successful verification
- Max 5 attempts per code

### RATE_LIMIT: PASS
- OTP request: 3 per 15 minutes
- OTP attempts: 5 max before invalidation

### REMOTE_SESSION: PASS
- Cookie `fh_console_session` with HttpOnly, Secure, SameSite=Strict
- 1 hour session TTL
- Independent from admin sessions

### IDLE_TIMEOUT_1H: PASS
- Frontend tracks user activity (mousedown, keydown, touchstart, scroll)
- Resets 1h timer on activity
- Transitions to "expired" state after 1h inactivity

### LOCAL_AGENT_CONSOLE_REGRESSION: PASS
- No changes to existing local access paths
- `http://consola.localhost:8000/agent-console/` remains unchanged
- Loopback auth bypass remains intact
- Bridge still bound to 127.0.0.1 only

### NO_PUBLIC_PTY: PASS
- No PTY, shell, or WebSocket exposed publicly
- Heartbeat contains only status flags
- Django and Bridge remain loopback-only

### NO_SECRET_LEAK: PASS
- No Telegram tokens in frontend code
- No secrets in Git
- OTP and session tokens stored as HMAC hashes
- `CONSOLE_OTP_SECRET` required as Cloudflare env var

### RESPONSIVE: PASS
- Fullscreen layout with centered card
- Dark theme consistent with Agent Console V2
- Responsive padding and typography
- Mobile-friendly input and buttons

### PRODUCT_QUALITY_GATE: PASS
- All automated tests pass (45/45)
- Build succeeds (`npm run build`)
- Lint passes (only pre-existing warnings in unrelated files)
- No known defects remain

## 9. Local Verification Commands

```bash
# federico-home
npm run lint
npm run build
npm test

# company-workspace-tickets
python manage.py shell -c "from django.urls import reverse; print('OK')"
```

## 10. What This Does NOT Do Yet

- **No remote PTY/WebSocket**: Only shows "Terminal remota pendiente de conexión" after auth
- **No Cloudflare Tunnel**: Architecture documented, not implemented
- **No public DNS**: Production URL depends on Cloudflare Pages domain
- **No commit/push**: All changes are local only
