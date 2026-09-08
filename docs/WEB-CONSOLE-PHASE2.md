# Web Console — Fase 2

## Límite de seguridad

El navegador no recibe una URL hacia el PC. `127.0.0.1:8022`, `127.0.0.1:8000`, Django, `node-pty` y el proceso Agent Console permanecen locales. El único tráfico del PC es un WebSocket **saliente** TLS hacia el Worker. El Durable Object reenvía bytes entre un único browser y un único agent para una sesión; no crea, ejecuta ni hospeda un PTY.

```
browser /consola -- HTTPS OTP/cookie --> Pages Functions -- ticket efímero --> Worker/DO
PC connector  --------------------- WSS saliente + HMAC -------------------> Worker/DO
                                                                          --> Agent Console local
```

## Configuración Cloudflare

Pages continúa usando `wrangler.toml` y D1 `ANALYTICS_DB`. Configurar estos secretos sólo server-side en Pages:

| Variable | Uso |
| --- | --- |
| `CONSOLE_OTP_SECRET` | HMAC del OTP existente. |
| `CONSOLE_SESSION_SECRET` | HMAC de la cookie/sesión. Debe ser independiente del OTP. |
| `CONSOLE_RELAY_TICKET_SECRET` | Firma los tickets browser de 60 s. Debe coincidir con el Worker. |
| `CONSOLE_RELAY_URL` | URL pública `wss://…/relay` del Worker; no es secreto. |
| `CONSOLE_RELAY_SESSION_ID` | Identificador estable (16–128 caracteres base64url) compartido con el sidecar como `WEB_CONSOLE_RELAY_SESSION`; no es un hash de OTP. |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Flujo OTP existente. |
| `AGENT_CONSOLE_NOTIFY_SECRET` | Notifier existente; no se reutiliza para el relay. |

El Worker se configura y migra separadamente mediante `wrangler.console-relay.toml`:

| Variable | Uso |
| --- | --- |
| `CONSOLE_RELAY_TICKET_SECRET` | Igual al secreto de Pages. |
| `AGENT_CONSOLE_RELAY_SECRET` | Secreto exclusivo del conector saliente del PC. |
| `CONSOLE_RELAY_ALLOWED_ORIGIN` | Origen exacto de Pages, por ejemplo `https://federico-home.pages.dev`. |
| `CONSOLE_RELAY` | Binding Durable Object definido en el TOML. |

La migración de Durable Object es `v1`, clase `ConsoleRelay`. Antes de desplegar, revisar el nombre/ruta pública y cargar secretos con Wrangler; no usar `VITE_*` para secretos. El despliegue de Pages y del Worker es una operación externa deliberadamente no ejecutada en esta entrega.

## Protocolo v1

Todo control es JSON UTF-8, máximo 16 KiB; `terminal.input.data` queda limitado a 15.5 KiB para reservar el envelope JSON. El único frame binario permitido es de agent a browser, máximo 64 KiB: primer byte `0x01`, resto UTF-8 de `terminal.output`; no existe `terminal.output` JSON en v1.

1. Browser solicita `POST /api/consola/relay-ticket` con cookie OTP y mismo `Origin`; recibe `{url,ticket}` por 60 s. Pages sólo emite ese ticket tras validar la sesión OTP, pero lo firma contra `CONSOLE_RELAY_SESSION_ID` estable, que coincide con `WEB_CONSOLE_RELAY_SESSION` del sidecar.
2. Ambos abren `wss://…/relay?session=<id-opaco>`. Browser manda `hello` con ticket. Agent manda `hello` con `ts`, `nonce` (16–128 base64url) y `signature = HMAC-SHA-256(base64url, "v1.agent.<session>.<ts>.<nonce>")` usando `AGENT_CONSOLE_RELAY_SECRET`.
3. Relay responde `pong`; browser manda `terminal.open` con proyecto, agente y tamaño. El agent adapta esa orden al control loopback de Agent Console. El PTY real sigue allí.

```json
{"type":"hello","v":1,"role":"browser","session":"<CONSOLE_RELAY_SESSION_ID>","ticket":"…"}
{"type":"hello","v":1,"role":"agent","session":"…","ts":1730000000,"nonce":"…","signature":"…"}
{"type":"terminal.open","request_id":"open1","project":"federico-home","agent":"codex","cols":120,"rows":30}
{"type":"terminal.open","request_id":"open1","session_id":"local-session","project":"federico-home","agent":"codex","cols":120,"rows":30}
{"type":"terminal.input","session_id":"local-session","data":"ls\r"}
{"type":"terminal.resize","session_id":"local-session","cols":120,"rows":30}
{"type":"terminal.output","session_id":"local-session","data":"…"}
{"type":"terminal.exit","session_id":"local-session","code":0}
{"type":"ping","at":1730000000000}
{"type":"pong","at":1730000000000}
{"type":"error","code":"agent_unavailable","message":"…"}
```

`project` debe cumplir `[A-Za-z0-9][A-Za-z0-9._ -]{0,127}` y `agent` es uno de `powershell`, `kilo`, `opencode`, `codex`, `antigravity`. La UI deja ambos explícitos (default visible: `federico-home` + `powershell`). El conector adapta `terminal.open/input/resize` a los mensajes locales existentes `create|attach|write|resize`; transforma `output` local al frame binario `0x01`. No debe aceptar comandos nuevos, abrir un listener público, ni transportar la cookie del navegador al PC.

## Controles del relay

- Ticket browser HMAC, emitido sólo tras la sesión OTP y con TTL de 60 s; se vincula a la sesión de relay estable, no al hash efímero de la cookie, y no sustituye la cookie.
- `Origin` exacto para browser y ausencia de `Origin` para agent; roles y dirección de los mensajes son validados.
- Un browser y un agent por Durable Object/sesión. Una reconexión reemplaza y cierra limpiamente al peer anterior.
- `ping/pong` cada 25 s, cierre por inactividad a 75 s, límite de cola 512 KiB y cierre 1013 por backpressure.
- Frames inválidos, excesivos o binarios en dirección incorrecta se cierran; `terminal.output` sólo puede originar en agent.

La página usa xterm.js como renderer del navegador desde una URL CDN fijada a versión. Para un entorno con CSP estricta o sin dependencia CDN, incorporar exactamente esa versión al pipeline de assets antes de publicar.

## Puerta de compatibilidad del sidecar

La inspección de sólo lectura del bridge disponible en `company-workspace-tickets-web-console-phase2` confirmó `hello v=1 role=agent` firmado y output binario `0x01`, pero detectó que al crear no devuelve el ACK `terminal.open` con `session_id`. Antes de desplegar este relay v1, el sidecar debe añadir ese ACK tras crear la sesión local. Sin él, el browser no puede enviar input/resize. Esta entrega no modifica dicho worktree por diseño.

## Prueba local

Las pruebas de protocolo no requieren credenciales: `npm test -- console-relay-protocol`. La integración real requiere un Worker/DO efímero, secretos distintos de producción y un conector saliente que apunte al Agent Console local; nunca exponer sus puertos para probarla.
