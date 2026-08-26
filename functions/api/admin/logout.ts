import { expiredSessionCookie, hasAdminSession, readCookie, secretHash, SESSION_COOKIE, unixNow, type AdminEnv } from "../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };
export const onRequestPost = async ({ request, env }: Context) => {
  const token = readCookie(request, SESSION_COOKIE);
  if (token && await hasAdminSession(request, env) && env.ANALYTICS_DB && env.ADMIN_SESSION_SECRET) {
    await env.ANALYTICS_DB.prepare("UPDATE admin_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL").bind(unixNow(), await secretHash(token, env.ADMIN_SESSION_SECRET)).run();
  }
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store", "Set-Cookie": expiredSessionCookie() } });
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
