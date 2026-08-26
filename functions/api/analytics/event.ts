import { normalisePath, normaliseSource, publicEventTypes, recordEvent, type AnalyticsEvent, type D1Database } from "../../_lib/analytics";

interface Env { ANALYTICS_DB?: D1Database }
const requests = new Map<string, number[]>();

const json = (body: Record<string, string>, status = 202) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function rateAllowed(request: Request) {
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const current = (requests.get(key) || []).filter((time) => now - time < 60_000);
  if (current.length >= 30) return false;
  current.push(now); requests.set(key, current); return true;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Formato inválido." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 512 || !rateAllowed(request)) return json({ error: "Solicitud no disponible." }, 429);
  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; } catch { return json({ error: "Solicitud inválida." }, 400); }
  const event = payload.event;
  const path = normalisePath(payload.path);
  if (typeof event !== "string" || !publicEventTypes.includes(event as AnalyticsEvent) || !path) return json({ error: "Evento inválido." }, 400);
  try { await recordEvent(env.ANALYTICS_DB, event as AnalyticsEvent, path, normaliseSource(payload.source)); } catch { return json({ error: "Servicio no disponible." }, 503); }
  return json({ ok: "true" });
};
