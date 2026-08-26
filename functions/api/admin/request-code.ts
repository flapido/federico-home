import { OTP_REQUEST_LIMIT, OTP_REQUEST_WINDOW_SECONDS, OTP_TTL_SECONDS, randomOtp, secretHash, unixNow, type AdminEnv } from "../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };

const headers = { "Cache-Control": "no-store" };
const failure = () => Response.json({ error: "No pude enviar un código en este momento." }, { status: 503, headers });

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.ANALYTICS_DB || !env.ADMIN_SESSION_SECRET || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return failure();
  if (request.headers.get("content-type")?.toLowerCase().includes("application/json") !== true) return Response.json({ error: "Solicitud inválida." }, { status: 415, headers });
  if (Number(request.headers.get("content-length") ?? "0") > 128) return Response.json({ error: "Solicitud inválida." }, { status: 400, headers });
  const now = unixNow();
  const recent = await env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS count FROM admin_otp_codes WHERE created_at >= ?").bind(now - OTP_REQUEST_WINDOW_SECONDS).all<{ count: number }>();
  if (Number(recent.results[0]?.count ?? 0) >= OTP_REQUEST_LIMIT) return Response.json({ error: "Esperá unos minutos antes de pedir otro código." }, { status: 429, headers });

  const code = randomOtp();
  const message = `Federico Home — Acceso a Analytics\n\nTu código es:\n\n${code}\n\nVence en 5 minutos.\n\nSi no solicitaste este acceso, ignorá el mensaje.`;
  try {
    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message }),
    });
    const payload = await telegram.json() as { ok?: boolean };
    if (!telegram.ok || payload.ok !== true) return failure();
    const hash = await secretHash(code, env.ADMIN_SESSION_SECRET);
    await env.ANALYTICS_DB.prepare("UPDATE admin_otp_codes SET used_at = ? WHERE used_at IS NULL").bind(now).run();
    await env.ANALYTICS_DB.prepare("INSERT INTO admin_otp_codes (code_hash, created_at, expires_at) VALUES (?, ?, ?)").bind(hash, now, now + OTP_TTL_SECONDS).run();
    return Response.json({ ok: true }, { headers });
  } catch {
    return failure();
  }
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "POST", ...headers } });
