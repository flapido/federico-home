interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}

type PagesContext<E> = { request: Request; env: E };
type PagesFunction<E> = (
  context: PagesContext<E>,
) => Response | Promise<Response>;

const allowedInterests = new Set([
  "Tengo una idea",
  "Software a medida",
  "Modernizar un sistema",
  "Automatización / IA",
  "Avatar con IA",
  "Archivo digital",
  "Consulta o duda",
  "Otro",
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const recentRequests = new Map<string, number[]>();
const rateWindowMs = 10 * 60 * 1000;
const rateLimit = 5;

const response = (body: Record<string, string>, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const compact = (value: unknown, max: number) =>
  typeof value === "string"
    ? value
        .trim()
        .replace(/[\p{Cc}]/gu, " ")
        .slice(0, max)
    : "";

function withinRateLimit(request: Request) {
  const client = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const active = (recentRequests.get(client) || []).filter(
    (timestamp) => now - timestamp < rateWindowMs,
  );
  if (active.length >= rateLimit) return false;
  active.push(now);
  recentRequests.set(client, active);
  return true;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return response({ error: "Formato de consulta inválido." }, 415);
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return response({ error: "No pude leer la consulta." }, 400);
  }
  if (compact(payload.website, 200)) return response({ ok: "true" });
  const name = compact(payload.name, 80);
  const email = compact(payload.email, 160).toLowerCase();
  const interest = compact(payload.interest, 80);
  const message = compact(payload.message, 2000);
  const origin = compact(payload.origin, 60).replace(/[^a-z0-9-]/gi, "");
  const page = compact(payload.page, 180).replace(/[^a-z0-9/?#._-]/gi, "");
  if (name.length < 2) return response({ error: "Escribí tu nombre." }, 400);
  if (!emailPattern.test(email))
    return response({ error: "Revisá tu email. Parece que falta algo." }, 400);
  if (!allowedInterests.has(interest))
    return response({ error: "Elegí una opción válida." }, 400);
  if (message.length < 10)
    return response(
      { error: "Contame un poquito más para poder entender tu consulta." },
      400,
    );
  if (!withinRateLimit(request))
    return response(
      { error: "ProbÃ¡ de nuevo en unos minutos o escribime por WhatsApp." },
      429,
    );
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID)
    return response(
      { error: "No pude enviar el formulario en este momento." },
      503,
    );
  const text = [
    "NUEVA CONSULTA — Federico Home",
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    `Interés: ${interest}`,
    "",
    "Mensaje:",
    message,
    "",
    `Origen: ${origin || "contacto"}`,
    `Página: ${page || "/contacto"}`,
    `Fecha: ${new Date().toISOString()}`,
  ].join("\n");
  try {
    const telegram = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
      },
    );
    if (!telegram.ok)
      return response(
        { error: "No pude enviar el formulario en este momento." },
        502,
      );
  } catch {
    return response(
      { error: "No pude enviar el formulario en este momento." },
      502,
    );
  }
  return response({ ok: "true" });
};
