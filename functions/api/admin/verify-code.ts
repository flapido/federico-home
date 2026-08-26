import { OTP_ATTEMPT_LIMIT, SESSION_TTL_SECONDS, constantTimeEqual, randomToken, secretHash, sessionCookie, unixNow, type AdminEnv } from "../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };
const headers = { "Cache-Control": "no-store" };
const denied = () => Response.json({ error: "El código no es válido o ya venció." }, { status: 401, headers });

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.ANALYTICS_DB || !env.ADMIN_SESSION_SECRET) return denied();
  if (request.headers.get("content-type")?.toLowerCase().includes("application/json") !== true) return Response.json({ error: "Solicitud inválida." }, { status: 415, headers });
  let body: { code?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida." }, { status: 400, headers }); }
  const code = typeof body.code === "string" ? body.code.trim() : "";
  if (!/^\d{6}$/u.test(code)) return denied();
  const now = unixNow();
  const active = await env.ANALYTICS_DB.prepare("SELECT id, code_hash, attempts, expires_at FROM admin_otp_codes WHERE used_at IS NULL ORDER BY created_at DESC LIMIT 1").all<{ id: number; code_hash: string; attempts: number; expires_at: number }>();
  const otp = active.results[0];
  if (!otp || otp.expires_at <= now || otp.attempts >= OTP_ATTEMPT_LIMIT) {
    if (otp) await env.ANALYTICS_DB.prepare("UPDATE admin_otp_codes SET used_at = ? WHERE id = ?").bind(now, otp.id).run();
    return denied();
  }
  const hash = await secretHash(code, env.ADMIN_SESSION_SECRET);
  if (!constantTimeEqual(hash, otp.code_hash)) {
    const attempts = otp.attempts + 1;
    await env.ANALYTICS_DB.prepare("UPDATE admin_otp_codes SET attempts = ?, used_at = CASE WHEN ? >= ? THEN ? ELSE used_at END WHERE id = ? AND used_at IS NULL").bind(attempts, attempts, OTP_ATTEMPT_LIMIT, now, otp.id).run();
    return denied();
  }
  const consumed = await env.ANALYTICS_DB.prepare("UPDATE admin_otp_codes SET used_at = ? WHERE id = ? AND used_at IS NULL AND expires_at > ? AND attempts < ?").bind(now, otp.id, now, OTP_ATTEMPT_LIMIT).run();
  if ((consumed.meta?.changes ?? 0) !== 1) return denied();
  const token = randomToken();
  await env.ANALYTICS_DB.prepare("INSERT INTO admin_sessions (token_hash, created_at, expires_at) VALUES (?, ?, ?)").bind(await secretHash(token, env.ADMIN_SESSION_SECRET), now, now + SESSION_TTL_SECONDS).run();
  return Response.json({ ok: true }, { headers: { ...headers, "Set-Cookie": sessionCookie(token) } });
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "POST", ...headers } });
