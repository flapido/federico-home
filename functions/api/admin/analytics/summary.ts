import { hasAdminSession, restricted, type AdminEnv } from "../../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };
type Row = { day: string; event_type: string; path: string; source: string; count: number };
type TotalRow = { event_type: string; count: number };
type VisitRow = { created_at: number; day: string; event_type: string; path: string; source: string; country: string; region: string; city: string; referrer: string; user_agent_hash: string; visitor_hash: string };
const event = (rows: Row[], type: string, from: string, path?: string) => rows.filter((row) => row.event_type === type && row.day >= from && (!path || row.path === path)).reduce((sum, row) => sum + Number(row.count), 0);
const day = (offset: number) => { const value = new Date(); value.setUTCDate(value.getUTCDate() - offset); return value.toISOString().slice(0, 10); };
const formatTime = (timestamp: number) => new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp * 1000));

function buildLocation(row: VisitRow) {
  const parts = [row.city, row.region, row.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "Desconocida";
}

export const onRequestGet = async ({ request, env }: Context) => {
  if (!(await hasAdminSession(request, env)) || !env.ANALYTICS_DB) return restricted();
  const today = day(0), seven = day(6), thirty = day(29);
  const [rowsResult, totalResult, visitsResult] = await Promise.all([
    env.ANALYTICS_DB.prepare("SELECT day, event_type, path, source, count FROM analytics_event_totals WHERE day >= ?").bind(thirty).all<Row>(),
    env.ANALYTICS_DB.prepare("SELECT event_type, SUM(count) AS count FROM analytics_event_totals GROUP BY event_type").all<TotalRow>(),
    env.ANALYTICS_DB.prepare("SELECT created_at, day, event_type, path, source, country, region, city, referrer, user_agent_hash, visitor_hash FROM analytics_visits WHERE day >= ? ORDER BY created_at DESC LIMIT 50").bind(thirty).all<VisitRow>(),
  ]);
  const rows = rowsResult.results;
  const period = (from: string) => ({
    visits: event(rows, "visit", from), pageViews: event(rows, "page_view", from), contacts: event(rows, "contact_submit_success", from), whatsapp: event(rows, "whatsapp_click", from), avatar: event(rows, "avatar_replay", from),
  });
  const guide = (from: string) => ({ impressions: event(rows, "guide_impression", from), started: event(rows, "guide_started", from), completed: event(rows, "guide_completed", from), exited: event(rows, "guide_exited", from), avatar: event(rows, "tour_avatar_view", from), contact: event(rows, "guide_contact_click", from), whatsapp: event(rows, "guide_whatsapp_click", from) });
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

  const visitsToday = visitsResult.results.filter((row) => row.day === today).length;
  const visitsSeven = visitsResult.results.filter((row) => row.day >= seven).length;
  const visitsThirty = visitsResult.results.length;
  const countryCounts = new Map<string, number>();
  visitsResult.results.forEach((row) => {
    const key = row.country || "Desconocido";
    countryCounts.set(key, (countryCounts.get(key) ?? 0) + 1);
  });
  const topCountries = Array.from(countryCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([country, count]) => ({ country, count }));
  const recent = visitsResult.results.slice(0, 20).map((row) => ({
    time: formatTime(row.created_at),
    location: buildLocation(row),
    path: row.path,
    source: row.source,
    visitorId: row.visitor_hash.slice(0, 8),
  }));

  return Response.json({
    periods: { today: period(today), seven: period(seven), thirty: period(thirty), total: { visits: totals.visit ?? 0, contacts: totals.contact_submit_success ?? 0, avatar: totals.avatar_replay ?? 0 } },
    guide: { today: guide(today), seven: guide(seven), thirty: guide(thirty) },
    interactions: { contacts: totals.contact_submit_success ?? 0, whatsapp: totals.whatsapp_click ?? 0, email: totals.email_click ?? 0, linkedin: totals.linkedin_click ?? 0, demos: totals.demo_click ?? 0, avatar: totals.avatar_replay ?? 0 },
    avatar: { today: event(rows, "avatar_replay", today), seven: event(rows, "avatar_replay", seven), thirty: avatarReplays, total: totals.avatar_replay ?? 0, aboutViews, rate: aboutViews ? avatarReplays / aboutViews : 0 },
    contact: { views: contactViews, submitted: contactSubmits, whatsapp: event(rows, "whatsapp_click", thirty, "/contacto"), email: event(rows, "email_click", thirty, "/contacto"), linkedin: event(rows, "linkedin_click", thirty, "/contacto"), rate: contactViews ? contactSubmits / contactViews : 0 },
    origins: [...origins, { source: "otro", count: rows.filter((row) => row.event_type === "contact_submit_success" && !origins.some((origin) => origin.source === row.source)).reduce((sum, row) => sum + Number(row.count), 0) }],
    pages: [...pageCounts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 5).map(([path, count]) => ({ path, count })),
    series,
    visitors: {
      today: visitsToday,
      seven: visitsSeven,
      thirty: visitsThirty,
      topCountries,
      recent,
    },
  }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequest = () => Response.json({ error: "Método no permitido." }, { status: 405, headers: { "Cache-Control": "no-store" } });
