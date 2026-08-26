import { normalisePath, normaliseSource, recordEvent } from "../../functions/_lib/analytics";
import { onRequestPost as analyticsEvent } from "../../functions/api/analytics/event";
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

test("analytics event endpoint accepts one allowlisted event without a caller count", async () => {
  const { db, calls } = database();
  const request = new Request("https://example.test/api/analytics/event", { method: "POST", headers: { "content-type": "application/json", "CF-Connecting-IP": "analytics-test" }, body: JSON.stringify({ event: "visit", path: "/soluciones", source: "soluciones", count: 5000 }) });
  const response = await analyticsEvent({ request, env: { ANALYTICS_DB: db } });
  expect(response.status).toBe(202);
  expect(calls).toHaveLength(1);
  expect(calls[0].at(-1)).toBe("soluciones");
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
