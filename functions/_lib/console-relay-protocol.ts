/**
 * Wire contract for the remote-console relay (protocol version 1).
 *
 * Text frames are JSON objects, max 16 KiB.  Binary frames are max 64 KiB and
 * are terminal output only: byte 0 is 1 and the remaining bytes are UTF-8
 * terminal data.  This keeps keystrokes and control messages inspectable while
 * avoiding JSON/base64 expansion for terminal output.
 *
 * Monitor extension: read-only agent observation messages (monitor.list, monitor.get, monitor.read).
 * These are completely separate from terminal.* messages and carry no mutators.
 */
export const CONSOLE_RELAY_PROTOCOL_VERSION = 1;
export const MAX_RELAY_JSON_BYTES = 16 * 1024;
export const MAX_RELAY_BINARY_BYTES = 64 * 1024;
export const MAX_RELAY_INPUT_BYTES = MAX_RELAY_JSON_BYTES - 512;
export const RELAY_PING_INTERVAL_MS = 25_000;
export const RELAY_IDLE_TIMEOUT_MS = 75_000;
export const RELAY_MAX_BUFFERED_BYTES = 512 * 1024;
export const BINARY_TERMINAL_OUTPUT = 1;
export const MAX_MONITOR_READ_CHARS = 32768;

export type RelayRole = "browser" | "browser-terminal" | "browser-monitor" | "agent";
export type TerminalAgent = "powershell" | "kilo" | "opencode" | "codex" | "antigravity";
export type MonitorState =
  | "WORKING"
  | "QUIET_WORKING"
  | "WAITING_INPUT"
  | "POSSIBLE_STALL"
  | "DEAD_SESSION"
  | "COMPLETED"
  | "FAILED"
  | "INTERRUPTED"
  | "OUTPUT_LIMIT"
  | "NEEDS_CONTINUE";
export type MonitorTask = {
  task_id: string;
  session_id: string;
  project: string;
  agent: string;
  status: string;
  monitor_state: MonitorState;
  started_at: string;
  updated_at: string;
  last_output_at: string | null;
  last_progress_at: string | null;
  output_sequence: number;
  continuation_count: number;
  files_changed_recently: boolean;
  cpu_activity: string;
  pid: number | null;
  duration_ms: number;
  branch: string | null;
  read_only: boolean;
  recommended_action: string;
  process_alive: boolean;
  session_alive: boolean;
  current_activity: string | null;
  last_output: string;
};
export type MonitorReadResult = {
  session_id: string;
  cursor: number;
  next_cursor: number;
  output: string;
  truncated: boolean;
  running: boolean;
};
export type RelayJsonMessage =
  | { type: "hello"; v: number; role: RelayRole; session: string; ticket?: string; ts?: number; nonce?: string; signature?: string }
  | { type: "terminal.open"; cols?: number; rows?: number; project: string; agent: TerminalAgent; request_id?: string; session_id?: string }
  | { type: "terminal.input"; data: string; session_id: string; request_id?: string }
  | { type: "terminal.resize"; cols: number; rows: number; session_id: string; request_id?: string }
  | { type: "terminal.output"; data: string; session_id: string; cursor?: number; truncated?: boolean }
  | { type: "terminal.exit"; session_id: string; code?: number; signal?: string; reason?: string; request_id?: string }
  | { type: "monitor.list"; request_id?: string }
  | { type: "monitor.get"; task_id: string; request_id?: string }
  | { type: "monitor.read"; session_id: string; cursor?: number; max_chars?: number; request_id?: string }
  | { type: "monitor.list"; tasks: MonitorTask[]; request_id?: string }
  | { type: "monitor.get"; task: MonitorTask; request_id?: string }
  | { type: "monitor.read"; result: MonitorReadResult; request_id?: string }
  | { type: "ping"; at?: number }
  | { type: "pong"; at?: number }
  | { type: "error"; code: string; message?: string };

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8", { fatal: true });
const sessionPattern = /^[A-Za-z0-9_-]{16,128}$/u;
const noncePattern = /^[A-Za-z0-9_-]{16,128}$/u;
const uuidPattern = /^[0-9a-f-]{36}$/iu;
const requestIdPattern = /^[A-Za-z0-9_-]{1,64}$/u;

export function encodedByteLength(value: string) { return textEncoder.encode(value).byteLength; }
export function isRelaySession(value: unknown): value is string { return typeof value === "string" && sessionPattern.test(value); }
export function isRelayNonce(value: unknown): value is string { return typeof value === "string" && noncePattern.test(value); }
function isRequestId(value: unknown): value is string { return value === undefined || (typeof value === "string" && requestIdPattern.test(value)); }
function isTaskId(value: unknown): value is string { return typeof value === "string" && uuidPattern.test(value); }

function dimensions(value: Record<string, unknown>) {
  return Number.isInteger(value.cols) && Number.isInteger(value.rows) && Number(value.cols) >= 1 && Number(value.cols) <= 500 && Number(value.rows) >= 1 && Number(value.rows) <= 500;
}
const agents = new Set<TerminalAgent>(["powershell", "kilo", "opencode", "codex", "antigravity"]);
const identifier = (value: unknown) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u.test(value);
const project = (value: unknown) => typeof value === "string" && /^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/u.test(value);
const requestId = (value: unknown) => value === undefined || (typeof value === "string" && /^[A-Za-z0-9_-]{1,64}$/u.test(value));

/** Parses only messages which can be forwarded by the relay. */
export function parseRelayJson(raw: string): RelayJsonMessage | null {
  if (encodedByteLength(raw) > MAX_RELAY_JSON_BYTES) return null;
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return null; }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const msg = value as Record<string, unknown>;
  if (typeof msg.type !== "string") return null;
  if (msg.type === "hello") {
    if (msg.v !== CONSOLE_RELAY_PROTOCOL_VERSION || (msg.role !== "browser" && msg.role !== "browser-terminal" && msg.role !== "browser-monitor" && msg.role !== "agent") || !isRelaySession(msg.session)) return null;
    if (msg.role === "browser" || msg.role === "browser-terminal" || msg.role === "browser-monitor") return typeof msg.ticket === "string" && msg.ticket.length <= 2048 ? msg as RelayJsonMessage : null;
    return typeof msg.ts === "number" && Number.isSafeInteger(msg.ts) && isRelayNonce(msg.nonce) && typeof msg.signature === "string" && msg.signature.length <= 128 ? msg as RelayJsonMessage : null;
  }
  if (msg.type === "terminal.open") {
    const acknowledgement = msg.session_id !== undefined && identifier(msg.session_id);
    const openRequest = dimensions(msg);
    if (acknowledgement) {
      return requestId(msg.request_id) ? msg as RelayJsonMessage : null;
    }
    return project(msg.project) && agents.has(msg.agent as TerminalAgent) && requestId(msg.request_id) && openRequest ? msg as RelayJsonMessage : null;
  }
  if (msg.type === "terminal.resize") return dimensions(msg) && identifier(msg.session_id) && requestId(msg.request_id) ? msg as RelayJsonMessage : null;
  if (msg.type === "terminal.input") return typeof msg.data === "string" && encodedByteLength(msg.data) <= MAX_RELAY_INPUT_BYTES && identifier(msg.session_id) && requestId(msg.request_id) ? msg as RelayJsonMessage : null;
  // v1 terminal output is the tagged binary frame; JSON output is rejected.
  if (msg.type === "terminal.output") return null;
  if (msg.type === "terminal.exit") return identifier(msg.session_id) && requestId(msg.request_id) && (msg.code === undefined || (Number.isInteger(msg.code) && Number(msg.code) >= 0 && Number(msg.code) <= 255)) && (msg.signal === undefined || (typeof msg.signal === "string" && msg.signal.length <= 64)) && (msg.reason === undefined || (typeof msg.reason === "string" && msg.reason.length <= 64)) ? msg as RelayJsonMessage : null;
  if (msg.type === "monitor.list") {
    const isResponse = Array.isArray(msg.tasks);
    if (isResponse) return isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
    return isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
  }
  if (msg.type === "monitor.get") {
    const isResponse = typeof msg.task === "object" && msg.task !== null;
    if (isResponse) return isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
    return isTaskId(msg.task_id) && isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
  }
  if (msg.type === "monitor.read") {
    const isResponse = typeof msg.result === "object" && msg.result !== null;
    if (isResponse) return isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
    return identifier(msg.session_id) && (msg.cursor === undefined || (Number.isSafeInteger(msg.cursor) && msg.cursor >= 0)) && (msg.max_chars === undefined || (Number.isSafeInteger(msg.max_chars) && msg.max_chars > 0 && msg.max_chars <= MAX_MONITOR_READ_CHARS)) && isRequestId(msg.request_id) ? msg as RelayJsonMessage : null;
  }
  if (msg.type === "ping" || msg.type === "pong") return msg.at === undefined || (typeof msg.at === "number" && Number.isSafeInteger(msg.at)) ? msg as RelayJsonMessage : null;
  if (msg.type === "error") return typeof msg.code === "string" && msg.code.length <= 64 && (msg.message === undefined || (typeof msg.message === "string" && msg.message.length <= 256)) ? msg as RelayJsonMessage : null;
  return null;
}

export function encodeTerminalOutput(data: string) {
  const bytes = textEncoder.encode(data);
  if (bytes.byteLength + 1 > MAX_RELAY_BINARY_BYTES) throw new RangeError("terminal output frame is too large");
  const frame = new Uint8Array(bytes.byteLength + 1);
  frame[0] = BINARY_TERMINAL_OUTPUT;
  frame.set(bytes, 1);
  return frame.buffer;
}

export function decodeTerminalOutput(frame: ArrayBuffer): string | null {
  const bytes = new Uint8Array(frame);
  if (bytes.byteLength < 2 || bytes.byteLength > MAX_RELAY_BINARY_BYTES || bytes[0] !== BINARY_TERMINAL_OUTPUT) return null;
  try { return textDecoder.decode(bytes.subarray(1)); } catch { return null; }
}

export function agentSignaturePayload(session: string, ts: number, nonce: string) {
  return `v1.agent.${session}.${ts}.${nonce}`;
}

export function browserTicketPayload(session: string, expiresAt: number, nonce: string) {
  return `v1.browser.${session}.${expiresAt}.${nonce}`;
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
const fromB64url = (value: string) => {
  try { const raw = atob(value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4)); return Uint8Array.from(raw, (char) => char.charCodeAt(0)); } catch { return null; }
};
async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", textEncoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, textEncoder.encode(value))));
}
function constantTimeEqual(left: string, right: string) { if (left.length !== right.length) return false; let diff = 0; for (let i = 0; i < left.length; i += 1) diff |= left.charCodeAt(i) ^ right.charCodeAt(i); return diff === 0; }

/** Creates a short-lived, opaque browser ticket after the existing OTP session was checked. */
export async function createBrowserTicket(session: string, secret: string, now = Math.floor(Date.now() / 1000), ttlSeconds = 60) {
  if (!isRelaySession(session) || !secret || ttlSeconds < 1 || ttlSeconds > 300) throw new TypeError("invalid browser ticket input");
  const random = new Uint8Array(18); crypto.getRandomValues(random);
  const expiresAt = now + ttlSeconds;
  const nonce = b64url(random);
  const body = b64url(textEncoder.encode(JSON.stringify({ s: session, e: expiresAt, n: nonce })));
  return `${body}.${await sign(browserTicketPayload(session, expiresAt, nonce), secret)}`;
}

/** Returns the ticket-bound session id, or null; callers must compare it to their route/session. */
export async function verifyBrowserTicket(ticket: string, secret: string, now = Math.floor(Date.now() / 1000)): Promise<string | null> {
  const [encoded, signature, ...rest] = ticket.split(".");
  if (!encoded || !signature || rest.length || ticket.length > 2048) return null;
  const bytes = fromB64url(encoded); if (!bytes) return null;
  let payload: { s?: unknown; e?: unknown; n?: unknown };
  try { payload = JSON.parse(textDecoder.decode(bytes)); } catch { return null; }
  if (!isRelaySession(payload.s) || !Number.isSafeInteger(payload.e) || !isRelayNonce(payload.n) || Number(payload.e) < now) return null;
  return constantTimeEqual(signature, await sign(browserTicketPayload(payload.s, Number(payload.e), payload.n), secret)) ? payload.s : null;
}
