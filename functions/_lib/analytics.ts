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
] as const;
export type AnalyticsEvent = (typeof eventTypes)[number];
export const publicEventTypes = eventTypes.filter((event) => event !== "contact_submit_success");

const validPaths = new Set(["/", "/soluciones", "/contacto", "/about", "/proyectos", "/lab", "/cv"]);
const validProjects = new Set(["legacy-web", "subastas", "archivo-digital", "tickets", "prepaga", "company-workspace"]);
const validSources = new Set(["home", "soluciones", "contacto", "legacy-web", "subastas", "archivo-digital", "avatares-ia", "about", "projects", "lab", "cv", "other"]);

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

export async function recordEvent(db: D1Database | undefined, event: AnalyticsEvent, path: string, source: string, day = analyticsDay()) {
  if (!db || !normalisePath(path)) return;
  await db.prepare(`INSERT INTO analytics_event_totals (day, event_type, path, source, count)
    VALUES (?, ?, ?, ?, 1)
    ON CONFLICT(day, event_type, path, source) DO UPDATE SET count = count + 1`).bind(day, event, path, source).run();
}
