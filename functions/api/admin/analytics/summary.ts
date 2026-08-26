import { hasAdminSession, restricted, type AdminEnv } from "../../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };
type Row = { day: string; event_type: string; path: string; source: string; count: number };
type TotalRow = { event_type: string; count: number };
const event = (rows: Row[], type: string, from: string, path?: string) => rows.filter((row) => row.event_type === type && row.day >= from && (!path || row.path === path)).reduce((sum, row) => sum + Number(row.count), 0);
const day = (offset: number) => { const value = new Date(); value.setUTCDate(value.getUTCDate() - offset); return value.toISOString().slice(0, 10); };

export const onRequestGet = async ({ request, env }: Context) => {
  if (!(await hasAdminSession(request, env)) || !env.ANALYTICS_DB) return restricted();
  const today = day(0), seven = day(6), thirty = day(29);
  const [rowsResult, totalResult] = await Promise.all([
    env.ANALYTICS_DB.prepare("SELECT day, event_type, path, source, count FROM analytics_event_totals WHERE day >= ?").bind(thirty).all<Row>(),
    env.ANALYTICS_DB.prepare("SELECT event_type, SUM(count) AS count FROM analytics_event_totals GROUP BY event_type").all<TotalRow>(),
  ]);
  const rows = rowsResult.results;
  const period = (from: string) => ({
    visits: event(rows, "visit", from), pageViews: event(rows, "page_view", from), contacts: event(rows, "contact_submit_success", from), whatsapp: event(rows, "whatsapp_click", from), avatar: event(rows, "avatar_replay", from),
  });
  const totals = Object.fromEntries(totalResult.results.map((row) => [row.event_type, Number(row.count)]));
  const dates = Array.from({ length: 30 }, (_, index) => day(29 - index));
  const series = dates.map((date) => ({ date, visits: event(rows, "visit", date), contacts: event(rows, "contact_submit_success", date) }));
  const pageCounts = new Map<string, number>();
  rows.filter((row) => row.event_type === "page_view").forEach((row) => pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + Number(row.count)));
  const origins = ["soluciones", "legacy-web", "subastas", "archivo-digital", "avatares-ia"].map((source) => ({ source, count: rows.filter((row) => row.event_type === "contact_submit_success" && row.source === source).reduce((sum, row) => sum + Number(row.count), 0) }));
  const contactViews = event(rows, "page_view", thirty, "/contacto");
  const contactSubmits = event(rows, "contact_submit_success", thirty);
  const aboutViews = event(rows, "page_view", thirty, "/about");
  const avatarReplays = event(rows, "avatar_replay", thirty);
  return Response.json({
    periods: { today: period(today), seven: period(seven), thirty: period(thirty), total: { visits: totals.visit ?? 0, contacts: totals.contact_submit_success ?? 0, avatar: totals.avatar_replay ?? 0 } },
    interactions: { contacts: totals.contact_submit_success ?? 0, whatsapp: totals.whatsapp_click ?? 0, email: totals.email_click ?? 0, linkedin: totals.linkedin_click ?? 0, demos: totals.demo_click ?? 0, avatar: totals.avatar_replay ?? 0 },
    avatar: { today: event(rows, "avatar_replay", today), seven: event(rows, "avatar_replay", seven), thirty: avatarReplays, total: totals.avatar_replay ?? 0, aboutViews, rate: aboutViews ? avatarReplays / aboutViews : 0 },
    contact: { views: contactViews, submitted: contactSubmits, whatsapp: event(rows, "whatsapp_click", thirty, "/contacto"), email: event(rows, "email_click", thirty, "/contacto"), linkedin: event(rows, "linkedin_click", thirty, "/contacto"), rate: contactViews ? contactSubmits / contactViews : 0 },
    origins: [...origins, { source: "otro", count: rows.filter((row) => row.event_type === "contact_submit_success" && !origins.some((origin) => origin.source === row.source)).reduce((sum, row) => sum + Number(row.count), 0) }],
    pages: [...pageCounts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 5).map(([path, count]) => ({ path, count })),
    series,
  }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "GET", "Cache-Control": "no-store" } });
