export type D1Database = {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<{ meta?: { changes?: number } }>; all<T>(): Promise<{ results: T[] }> } };
};

export const eventTypes = [
  "visit",
  "page_view",
  "contact_open",
  "contact_submit_success",
  "whatsapp_click",
  "email_click",
  "linkedin_click",
  "demo_click",
  "avatar_replay",
  "guide_impression", "guide_accepted", "guide_declined", "guide_started", "guide_restarted", "guide_restart", "guide_speed_change", "guide_robot_call", "guide_step_view", "guide_paused", "guide_resumed", "guide_skipped_step", "guide_completed", "guide_exited", "tour_avatar_view", "guide_contact_click", "guide_whatsapp_click",
  "guestbook_open", "guestbook_guest_selected", "guestbook_reference_selected", "guestbook_submit_success", "reference_submit_success", "guestbook_public_view", "guide_guestbook_click", "portfolio_share", "reference_invite_share", "reference_invite_copy", "published_reference_share",
  "guestbook_clean", "guestbook_review", "guestbook_blocked",
  "guide_guestbook_prompt", "guide_guestbook_accept", "guide_guestbook_decline",
] as const;
export type AnalyticsEvent = (typeof eventTypes)[number];
export const publicEventTypes = eventTypes.filter((event) => event !== "contact_submit_success");

const validPaths = new Set(["/", "/soluciones", "/contacto", "/about", "/proyectos", "/lab", "/cv", "/gracias"]);
const validProjects = new Set(["legacy-web", "subastas", "archivo-digital", "tickets", "prepaga", "company-workspace"]);
const validSources = new Set(["home", "soluciones", "contacto", "gracias", "legacy-web", "subastas", "archivo-digital", "avatares-ia", "avatar", "about", "projects", "lab", "cv", "x1", "x2", "x3", "other"]);

export function normalisePath(value: unknown) {
  if (typeof value !== "string") return "";
  const path = value.split("?")[0].split("#")[0];
  if (validPaths.has(path)) return path;
  const project = /^\/proyectos\/([a-z-]+)$/.exec(path)?.[1];
  return project && validProjects.has(project) ? `/proyectos/${project}` : "";
}

export function normaliseSource(value: unknown) {
  return typeof value === "string" && validSources.has(value) ? value : "other";
}

export function analyticsDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function extractGeo(request: Request) {
  return {
    country: request.headers.get("CF-IPCountry")?.slice(0, 2) ?? "",
    region: request.headers.get("CF-Region")?.slice(0, 128) ?? "",
    city: request.headers.get("CF-City")?.slice(0, 128) ?? "",
  };
}

export function extractReferrer(request: Request) {
  return request.headers.get("referer")?.split("?")[0]?.slice(0, 256) ?? "";
}

export function userAgentHash(userAgent: string) {
  let hash = 0;
  for (let index = 0; index < userAgent.length; index++) {
    hash = (hash << 5) - hash + userAgent.charCodeAt(index);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export async function hashVisitorId(visitorId: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(visitorId));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function recordEvent(db: D1Database | undefined, event: AnalyticsEvent, path: string, source: string, day = analyticsDay()) {
  if (!db || !normalisePath(path)) return;
  await db.prepare(`INSERT INTO analytics_event_totals (day, event_type, path, source, count)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(day, event_type, path, source) DO UPDATE SET count = count + 1`).bind(day, event, path, source).run();
}

export async function recordVisit(db: D1Database | undefined, event: AnalyticsEvent, path: string, source: string, request: Request, visitorId: string, secret: string) {
  if (!db || !normalisePath(path)) return;
  const geo = extractGeo(request);
  const day = analyticsDay();
  const created = Math.floor(Date.now() / 1000);
  const visitorHash = await hashVisitorId(visitorId, secret);
  await db.prepare(`INSERT INTO analytics_visits (created_at, day, event_type, path, source, country, region, city, referrer, user_agent_hash, visitor_hash)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(
    created, day, event, path, source,
    geo.country, geo.region, geo.city,
    extractReferrer(request),
    userAgentHash(request.headers.get("user-agent") ?? ""),
    visitorHash
  ).run();
}
