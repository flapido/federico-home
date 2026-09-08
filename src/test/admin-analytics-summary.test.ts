import { describe, expect, it } from "vitest";
import { onRequestGet } from "../../functions/api/admin/analytics/summary";

const newestTimestamp = Math.floor(Date.parse("2026-09-08T05:52:00Z") / 1000);
const olderTimestamp = Math.floor(Date.parse("2026-09-07T23:15:00Z") / 1000);

function database() {
  const queries: string[] = [];
  return {
    queries,
    db: {
      prepare: (query: string) => {
        queries.push(query);
        return {
          bind: (..._values: unknown[]) => ({ all: async <T>() => ({ results: resultFor<T>(query) }) }),
          all: async <T>() => ({ results: resultFor<T>(query) }),
        };
      },
    },
  };
}

function resultFor<T>(query: string): T[] {
  if (query.includes("admin_sessions")) return [{ id: 1 }] as T[];
  if (query.includes("analytics_visits")) return [
    { created_at: newestTimestamp, day: "2026-09-08", event_type: "visit", path: "/soluciones", source: "soluciones", country: "AR", region: "Buenos Aires", city: "CABA", referrer: "", user_agent_hash: "hash", visitor_hash: "newest01" },
    { created_at: olderTimestamp, day: "2026-09-07", event_type: "visit", path: "/about", source: "about", country: "AR", region: "Buenos Aires", city: "La Plata", referrer: "", user_agent_hash: "hash", visitor_hash: "older001" },
  ] as T[];
  return [];
}

describe("admin analytics recent activity", () => {
  it("formats the exact Argentine date and time and preserves newest-first activity", async () => {
    const { db, queries } = database();
    const response = await onRequestGet({ request: new Request("https://example.test/api/admin/analytics/summary", { headers: { Cookie: "fh_admin_session=test" } }), env: { ANALYTICS_DB: db, ADMIN_SESSION_SECRET: "secret" } });
    const body = await response.json() as { visitors: { recent: { time: string; path: string }[] } };

    expect(response.status).toBe(200);
    expect(body.visitors.recent).toEqual(expect.arrayContaining([
      expect.objectContaining({ time: "8 de septiembre de 2026, 02:52 a. m.", path: "/soluciones" }),
    ]));
    expect(body.visitors.recent.map((visit) => visit.path)).toEqual(["/soluciones", "/about"]);
    expect(queries).toContainEqual(expect.stringContaining("ORDER BY created_at DESC LIMIT 50"));
  });
});
