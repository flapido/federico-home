import {
  CONSOLE_OTP_REQUEST_LIMIT,
  CONSOLE_OTP_REQUEST_WINDOW_SECONDS,
  CONSOLE_OTP_TTL_SECONDS,
  randomOtp,
  secretHash,
  unixNow,
  type ConsoleEnv,
} from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };

const headers = { "Cache-Control": "no-store" };
const failure = () => Response.json({ error: "No pude enviar un código en este momento." }, { status: 503, headers });

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.ANALYTICS_DB || !env.CONSOLE_OTP_SECRET || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return failure();
  if (request.headers.get("content-type")?.toLowerCase().includes("application/json") !== true) return Response.json({ error: "Solicitud inválida." }, { status: 415, headers });
  if (Number(request.headers.get("content-length") ?? "0") > 128) return Response.json({ error: "Solicitud inválida." }, { status: 400, headers });

  const now = unixNow();
  const recent = await env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS count FROM console_otp_codes WHERE created_at >= ?").bind(now - CONSOLE_OTP_REQUEST_WINDOW_SECONDS).all<{ count: number }>();
  if (Number(recent.results[0]?.count ?? 0) >= CONSOLE_OTP_REQUEST_LIMIT) return Response.json({ error: "Esperá unos minutos antes de pedir otro código." }, { status: 429, headers });

  const code = randomOtp();
  const message = `Federico Home — Acceso a Consola Remota\n\nTu código es:\n\n${code}\n\nVence en 5 minutos.\n\nSi no solicitaste este acceso, ignorá el mensaje.`;
  try {
    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: message }),
    });
    const payload = await telegram.json() as { ok?: boolean };
    if (!telegram.ok || payload.ok !== true) return failure();

    const hash = await secretHash(code, env.CONSOLE_OTP_SECRET);
    await env.ANALYTICS_DB.prepare("UPDATE console_otp_codes SET used_at = ? WHERE used_at IS NULL").bind(now).run();
    await env.ANALYTICS_DB.prepare("INSERT INTO console_otp_codes (code_hash, created_at, expires_at) VALUES (?, ?, ?)").bind(hash, now, now + CONSOLE_OTP_TTL_SECONDS).run();
    return Response.json({ ok: true }, { headers });
  } catch {
    return failure();
  }
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "POST", ...headers } });
