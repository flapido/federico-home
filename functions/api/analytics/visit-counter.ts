import type { D1Database } from "../../_lib/analytics";

interface Env { ANALYTICS_DB?: D1Database }
export const onRequestGet = async ({ env }: { env: Env }) => {
  if (!env.ANALYTICS_DB) return Response.json({ error: "No disponible." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const data = await env.ANALYTICS_DB.prepare("SELECT COALESCE(SUM(count), 0) AS total FROM analytics_event_totals WHERE event_type = 'visit'").bind().all<{ total: number }>();
    return Response.json({ total: Number(data.results[0]?.total || 0) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "No disponible." }, { status: 503, headers: { "Cache-Control": "no-store" } }); }
};
