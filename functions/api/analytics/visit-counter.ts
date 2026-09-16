import type { D1Database } from "../../_lib/analytics";

interface Env { ANALYTICS_DB?: D1Database }

const requests = new Map<string, number[]>();

function rateAllowed(request: Request): boolean {
  const key = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Date.now();
  const current = (requests.get(key) || []).filter((time) => now - time < 60_000);
  if (current.length >= 30) return false;
  current.push(now);
  requests.set(key, current);
  return true;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.ANALYTICS_DB) return Response.json({ error: "No disponible." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  if (!rateAllowed(request)) return Response.json({ error: "Demasiadas solicitudes." }, { status: 429, headers: { "Cache-Control": "no-store" } });
  try {
    const data = await env.ANALYTICS_DB.prepare("SELECT value FROM analytics_site_totals WHERE key = 'visit_total'").bind().all<{ value: number }>();
    const total = data.results[0]?.value ?? 0;
    return Response.json({ total }, { headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=300" } });
  } catch { return Response.json({ error: "No disponible." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
};