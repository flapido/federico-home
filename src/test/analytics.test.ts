import { normalisePath, normaliseSource, recordEvent } from "../../functions/_lib/analytics";
import { onRequestPost as analyticsEvent } from "../../functions/api/analytics/event";
import { onRequestGet as visitCounter } from "../../functions/api/analytics/visit-counter";
import { isNewVisit } from "../lib/analytics";

function database() {
  const calls: unknown[][] = [];
  return {
    calls,
    db: {
      prepare: () => ({ bind: (...values: unknown[]) => ({ run: async () => { calls.push(values); }, all: async <T>() => ({ results: [] as T[] }) }) }),
    },
  };
}

test("analytics normalises only approved paths and sources", () => {
  expect(normalisePath("/proyectos/legacy-web?email=no")).toBe("/proyectos/legacy-web");
  expect(normalisePath("/api/private")).toBe("");
  expect(normaliseSource("subastas")).toBe("subastas");
  expect(normaliseSource("https://example.test/?secret")).toBe("other");
});

test("one visit is emitted per 30 minute browser window", () => {
  localStorage.clear();
  expect(isNewVisit(1_000)).toBe(true);
  expect(isNewVisit(1_001)).toBe(false);
  expect(isNewVisit(1_000 + 30 * 60 * 1000)).toBe(true);
});

test("visit counter response is edge-cacheable without changing its total contract", async () => {
  const { db } = database();
  const request = new Request("https://example.test/api/analytics/visit-counter", {
    headers: { "CF-Connecting-IP": "test-ip" }
  });
  const response = await visitCounter({ request, env: { ANALYTICS_DB: db } });
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ total: 0 });
  expect(response.headers.get("Cache-Control")).toBe("public, max-age=30, s-maxage=60, stale-while-revalidate=300");
});

test("analytics event endpoint accepts one allowlisted event without a caller count", async () => {
    const { db, calls } = database();
    const request = new Request("https://example.test/api/analytics/event", { method: "POST", headers: { "content-type": "application/json", "CF-Connecting-IP": "analytics-test" }, body: JSON.stringify({ event: "visit", path: "/soluciones", source: "soluciones", count: 5000 }) });
    const response = await analyticsEvent({ request, env: { ANALYTICS_DB: db, ADMIN_SESSION_SECRET: "secret" } });
    expect(response.status).toBe(202);
    // recordEvent + recordVisit + incrementSiteTotal
    expect(calls).toHaveLength(3);
    expect(calls[0].at(-1)).toBe("soluciones");
    expect(calls[1]).toHaveLength(11);
    // Third call is incrementSiteTotal
    expect(calls[2]).toEqual(["visit_total", (await import("../../functions/_lib/analytics")).analyticsDay()]);
  });

test("contact success cannot be forged through the public analytics endpoint", async () => {
  const { db } = database();
  const request = new Request("https://example.test/api/analytics/event", { method: "POST", headers: { "content-type": "application/json", "CF-Connecting-IP": "analytics-contact-test" }, body: JSON.stringify({ event: "contact_submit_success", path: "/contacto", source: "contacto" }) });
  expect((await analyticsEvent({ request, env: { ANALYTICS_DB: db } })).status).toBe(400);
});

test("recordEvent uses an atomic single increment", async () => {
  const { db, calls } = database();
  await recordEvent(db, "avatar_replay", "/about", "about", "2026-08-26");
  expect(calls[0]).toEqual(["2026-08-26", "avatar_replay", "/about", "about"]);
});
