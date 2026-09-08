import {
  MAX_RELAY_BINARY_BYTES, MAX_RELAY_JSON_BYTES, RELAY_IDLE_TIMEOUT_MS, RELAY_MAX_BUFFERED_BYTES,
  RELAY_PING_INTERVAL_MS, agentSignaturePayload, isRelaySession,
  parseRelayJson, verifyBrowserTicket, type RelayJsonMessage, type RelayRole,
} from "../functions/_lib/console-relay-protocol";

/** Secrets are server-side only. Browser tickets must be minted after the existing OTP session check. */
export interface RelayEnv {
  CONSOLE_RELAY: DurableObjectNamespaceLike;
  CONSOLE_RELAY_TICKET_SECRET: string;
  AGENT_CONSOLE_RELAY_SECRET: string;
  CONSOLE_RELAY_ALLOWED_ORIGIN?: string;
}
interface DurableObjectNamespaceLike { idFromName(name: string): unknown; get(id: unknown): { fetch(request: Request): Promise<Response> }; }
interface DurableObjectStateLike {}
interface SocketLike {
  accept(): void; send(data: string | ArrayBuffer): void; close(code?: number, reason?: string): void;
  addEventListener(name: "message" | "close" | "error", handler: (event: { data?: unknown }) => void): void;
  readonly bufferedAmount?: number;
}
declare const WebSocketPair: { new(): { 0: SocketLike; 1: SocketLike } };

const encoder = new TextEncoder();
const clockSkewSeconds = 60;
const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
async function hmac(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value))));
}
function equal(left: string, right: string) { if (left.length !== right.length) return false; let diff = 0; for (let i = 0; i < left.length; i++) diff |= left.charCodeAt(i) ^ right.charCodeAt(i); return diff === 0; }
function reject(code: string, message: string) { return Response.json({ error: code, message }, { status: 400, headers: { "Cache-Control": "no-store" } }); }

export async function verifyAgentHello(message: Extract<RelayJsonMessage, { type: "hello" }>, secret: string, now = Math.floor(Date.now() / 1000)) {
  return message.role === "agent" && typeof message.ts === "number" && typeof message.nonce === "string" && typeof message.signature === "string" && Math.abs(now - message.ts) <= clockSkewSeconds && equal(message.signature, await hmac(agentSignaturePayload(message.session, message.ts, message.nonce), secret));
}

export default { async fetch(request: Request, env: RelayEnv) {
  if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return reject("upgrade_required", "WebSocket required");
  const session = new URL(request.url).searchParams.get("session") ?? "";
  if (!isRelaySession(session)) return reject("invalid_session", "Invalid session");
  const id = env.CONSOLE_RELAY.idFromName(session);
  return env.CONSOLE_RELAY.get(id).fetch(request);
} };

export class ConsoleRelay {
  private peers = new Map<RelayRole, SocketLike>();
  private lastSeen = new Map<SocketLike, number>();
  private origins = new Map<SocketLike, string | null>();
  private relaySession: string | undefined;
  private localTerminalSession: string | undefined;
  private timer: ReturnType<typeof setInterval> | undefined;
  constructor(_state: DurableObjectStateLike, private env: RelayEnv) {}
  async fetch(request: Request) {
    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") return reject("upgrade_required", "WebSocket required");
    const requestedSession = new URL(request.url).searchParams.get("session") ?? "";
    if (!isRelaySession(requestedSession) || (this.relaySession && this.relaySession !== requestedSession)) return reject("invalid_session", "Invalid session");
    this.relaySession = requestedSession;
    const pair = new WebSocketPair(); const client = pair[0]; const socket = pair[1]; socket.accept();
    this.lastSeen.set(socket, Date.now());
    this.origins.set(socket, request.headers.get("Origin"));
    socket.addEventListener("message", (event) => void this.onMessage(socket, event.data));
    socket.addEventListener("close", () => this.detach(socket)); socket.addEventListener("error", () => this.detach(socket));
    this.ensureTimer();
    return new Response(null, { status: 101, webSocket: client } as ResponseInit);
  }
  private ensureTimer() { if (!this.timer) this.timer = setInterval(() => this.tick(), RELAY_PING_INTERVAL_MS); }
  private tick() { const now = Date.now(); for (const [socket, seen] of this.lastSeen) { if (now - seen > RELAY_IDLE_TIMEOUT_MS) this.close(socket, 4000, "idle timeout"); else this.send(socket, JSON.stringify({ type: "ping", at: now })); } }
  private async onMessage(socket: SocketLike, data: unknown) {
    this.lastSeen.set(socket, Date.now());
    if (typeof data !== "string") { this.onBinary(socket, data); return; }
    if (encoder.encode(data).byteLength > MAX_RELAY_JSON_BYTES) return this.close(socket, 1009, "frame too large");
    const message = parseRelayJson(data); if (!message) return this.close(socket, 1008, "invalid protocol frame");
    const current = [...this.peers.entries()].find(([, peer]) => peer === socket)?.[0];
    if (!current) return void this.authorize(socket, message);
    const browserCommand = message.type === "terminal.open" || message.type === "terminal.input" || message.type === "terminal.resize" || message.type === "terminal.exit";
    const agentResponse = message.type === "terminal.open" || message.type === "terminal.output" || message.type === "terminal.exit" || message.type === "error";
    if (message.type === "hello" || (current === "browser" && !browserCommand && message.type !== "ping" && message.type !== "pong") || (current === "agent" && !agentResponse && message.type !== "ping" && message.type !== "pong")) return this.close(socket, 1008, "role violation");
    if (current === "browser" && message.type === "terminal.open" && (message.session_id !== undefined || !Number.isInteger(message.cols) || !Number.isInteger(message.rows))) return this.close(socket, 1008, "invalid open request");
    if (current === "agent" && message.type === "terminal.open" && !message.session_id) return this.close(socket, 1008, "open acknowledgement missing session");
    if (message.type === "ping") return this.send(socket, JSON.stringify({ type: "pong", at: message.at }));
    if (message.type === "pong") return;
    if (current === "agent" && message.type === "terminal.open" && message.session_id) this.localTerminalSession = message.session_id;
    if (current === "agent" && message.type === "terminal.exit") this.localTerminalSession = undefined;
    this.forward(current === "browser" ? "agent" : "browser", data);
  }
  private async authorize(socket: SocketLike, message: RelayJsonMessage) {
    if (message.type !== "hello") return this.close(socket, 1008, "hello required");
    if (message.session !== this.relaySession) return this.close(socket, 1008, "session mismatch");
    // Browsers must present the configured Pages origin. Agents are outbound
    // WSS clients and deliberately have no Origin header.
    if (message.role === "browser" && this.env.CONSOLE_RELAY_ALLOWED_ORIGIN && this.origins.get(socket) !== this.env.CONSOLE_RELAY_ALLOWED_ORIGIN) return this.close(socket, 1008, "origin denied");
    if (message.role === "agent" && this.origins.get(socket)) return this.close(socket, 1008, "agent origin denied");
    const ok = message.role === "browser" ? (await verifyBrowserTicket(message.ticket ?? "", this.env.CONSOLE_RELAY_TICKET_SECRET)) === message.session : await verifyAgentHello(message, this.env.AGENT_CONSOLE_RELAY_SECRET);
    if (!ok) return this.close(socket, 1008, "authentication failed");
    const prior = this.peers.get(message.role); if (prior) this.close(prior, 4001, "replaced by reconnect");
    this.peers.set(message.role, socket); this.send(socket, JSON.stringify({ type: "pong", at: Date.now() }));
  }
  private onBinary(socket: SocketLike, data: unknown) {
    const role = [...this.peers.entries()].find(([, peer]) => peer === socket)?.[0];
    if (role !== "agent" || !(data instanceof ArrayBuffer) || data.byteLength < 2 || data.byteLength > MAX_RELAY_BINARY_BYTES || new Uint8Array(data)[0] !== 1) return this.close(socket, 1008, "binary role or size violation");
    this.lastSeen.set(socket, Date.now()); this.forward("browser", data);
  }
  private forward(role: RelayRole, data: string | ArrayBuffer) { const peer = this.peers.get(role); if (peer) this.send(peer, data); }
  private send(socket: SocketLike, data: string | ArrayBuffer) { if ((socket.bufferedAmount ?? 0) > RELAY_MAX_BUFFERED_BYTES) return this.close(socket, 1013, "backpressure"); try { socket.send(data); } catch { this.detach(socket); } }
  private close(socket: SocketLike, code: number, reason: string) { try { socket.close(code, reason); } finally { this.detach(socket); } }
  private detach(socket: SocketLike) {
    const role = [...this.peers.entries()].find(([, peer]) => peer === socket)?.[0];
    this.lastSeen.delete(socket); this.origins.delete(socket);
    for (const [peerRole, peer] of this.peers) if (peer === socket) this.peers.delete(peerRole);
    // A browser departure must explicitly close the local PTY through the
    // outbound sidecar so a replacement browser cannot inherit a stale task.
    if (role === "browser" && this.localTerminalSession) {
      const agent = this.peers.get("agent");
      if (agent) this.send(agent, JSON.stringify({ type: "terminal.exit", session_id: this.localTerminalSession, reason: "browser_disconnected" }));
      this.localTerminalSession = undefined;
    }
    if (role === "agent") {
      const browser = this.peers.get("browser");
      if (browser) this.send(browser, JSON.stringify({ type: "error", code: "agent_disconnected", message: "Agent Console se desconectó." }));
      this.localTerminalSession = undefined;
    }
    if (!this.lastSeen.size && this.timer) { clearInterval(this.timer); this.timer = undefined; }
  }
}
