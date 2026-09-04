export type ConsoleEnv = {
  CONSOLE_OTP_SECRET?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  CONSOLE_SESSION_SECRET?: string;
};

export const CONSOLE_OTP_TTL_SECONDS = 5 * 60;
export const CONSOLE_SESSION_TTL_SECONDS = 60 * 60;
export const CONSOLE_OTP_REQUEST_LIMIT = 3;
export const CONSOLE_OTP_REQUEST_WINDOW_SECONDS = 15 * 60;
export const CONSOLE_OTP_ATTEMPT_LIMIT = 5;
export const CONSOLE_SESSION_COOKIE = "fh_console_session";
export const CONSOLE_HEARTBEAT_TIMEOUT_SECONDS = 90;

export function unixNow() {
  return Math.floor(Date.now() / 1000);
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

export async function secretHash(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(signature));
}

export function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function randomOtp() {
  const limit = 1_000_000;
  const ceiling = Math.floor(0x1_0000_0000 / limit) * limit;
  const value = new Uint32Array(1);
  do crypto.getRandomValues(value);
  while (value[0] >= ceiling);
  return String(value[0] % limit).padStart(6, "0");
}

export function readCookie(request: Request, name: string) {
  const prefix = `${name}=`;
  return (
    request.headers.get("Cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) ?? ""
  );
}

export function sessionCookie(token: string) {
  return `${CONSOLE_SESSION_COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${CONSOLE_SESSION_TTL_SECONDS}`;
}

export function expiredSessionCookie() {
  return `${CONSOLE_SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export async function hasConsoleSession(request: Request, env: ConsoleEnv) {
  const token = readCookie(request, CONSOLE_SESSION_COOKIE);
  if (!token || !env.CONSOLE_SESSION_SECRET || token.length > 256) return false;
  const hash = await secretHash(token, env.CONSOLE_SESSION_SECRET);
  // Reuse ANALYTICS_DB if available; otherwise fail closed
  if (!env.ANALYTICS_DB) return false;
  const result = await env.ANALYTICS_DB
    .prepare("SELECT id FROM console_sessions WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ? LIMIT 1")
    .bind(hash, unixNow())
    .all<{ id: number }>();
  return result.results.length === 1;
}

export function restricted() {
  return Response.json({ error: "Acceso restringido." }, { status: 401, headers: { "Cache-Control": "no-store" } });
}
