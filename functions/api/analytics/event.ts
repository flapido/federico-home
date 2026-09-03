import { normalisePath, normaliseSource, publicEventTypes, recordEvent, recordVisit, type AnalyticsEvent, type D1Database } from "../../_lib/analytics";
import { hasAdminSession, type AdminEnv } from "../../_lib/admin-auth";

interface Env extends AdminEnv { ANALYTICS_DB?: D1Database }
const requests = new Map<string, number[]>();

const json = (body: Record<string, string>, status = 202) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

function rateAllowed(request: Request) {
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const current = (requests.get(key) || []).filter((time) => now - time < 60_000);
  if (current.length >= 30) return false;
  current.push(now); requests.set(key, current); return true;
}

function readVisitorCookie(request: Request) {
  const prefix = "fh_visitor_id=";
  return request.headers.get("Cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length) ?? "";
}

function generateVisitorId() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Formato inválido." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 512 || !rateAllowed(request)) return json({ error: "Solicitud no disponible." }, 429);
  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; } catch { return json({ error: "Solicitud inválida." }, 400); }
  const event = payload.event;
  const path = normalisePath(payload.path);
  if (typeof event !== "string" || !publicEventTypes.includes(event as AnalyticsEvent) || !path) return json({ error: "Evento inválido." }, 400);

  const isOwner = env.ANALYTICS_DB && env.ADMIN_SESSION_SECRET && await hasAdminSession(request, env);
  if (isOwner) return json({ ok: "true" });

  const visitorId = readVisitorCookie(request) || generateVisitorId();
  const headers: Record<string, string> = { "Cache-Control": "no-store" };
  if (!readVisitorCookie(request)) {
    headers["Set-Cookie"] = `fh_visitor_id=${visitorId}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${60 * 60 * 24 * 365}`;
  }

  try {
    if (env.ANALYTICS_DB) {
      await recordEvent(env.ANALYTICS_DB, event as AnalyticsEvent, path, normaliseSource(payload.source));
      if (env.ADMIN_SESSION_SECRET) {
        await recordVisit(env.ANALYTICS_DB, event as AnalyticsEvent, path, normaliseSource(payload.source), request, visitorId, env.ADMIN_SESSION_SECRET);
      }
    }
  } catch {
    return json({ error: "Servicio no disponible." }, 503);
  }
  return Response.json({ ok: "true" }, { status: 202, headers });
};
