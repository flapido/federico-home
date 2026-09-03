import { describe, expect, it } from "vitest";
import { hashVisitorId, recordVisit, userAgentHash } from "../../functions/_lib/analytics";
import { onRequestPost as analyticsEvent } from "../../functions/api/analytics/event";

function database() {
  const calls: unknown[][] = [];
  return {
    calls,
    db: {
      prepare: (_query: string) => ({
        bind: (...values: unknown[]) => {
          calls.push(values);
          return {
            run: async () => { /* tracked via calls */ },
            all: async <T>() => {
              if (_query.includes("admin_sessions")) {
                return { results: [{ id: 1 }] as T[] };
              }
              return { results: [] as T[] };
            },
          };
        },
      }),
    },
  };
}

describe("analytics visits privacy and owner exclusion", () => {
  it("hashes visitor id deterministically", async () => {
    const a = await hashVisitorId("abc-123", "secret");
    const b = await hashVisitorId("abc-123", "secret");
    expect(a).toBe(b);
    expect(a).not.toBe("abc-123");
    expect(a).toMatch(/^[0-9a-f]+$/);
  });

  it("computes a short stable user agent hash", () => {
    expect(userAgentHash("Mozilla/5.0")).toBe(userAgentHash("Mozilla/5.0"));
    expect(userAgentHash("Mozilla/5.0").length).toBeLessThanOrEqual(8);
  });

  it("extracts geo and referrer from request headers", async () => {
    const request = new Request("https://example.test", {
      headers: {
        "CF-IPCountry": "AR",
        "CF-Region": "Buenos Aires",
        "CF-City": "CABA",
        referer: "https://google.com/?q=test",
        "user-agent": "Mozilla/5.0",
      },
    });
    const geo = (await import("../../functions/_lib/analytics")).extractGeo(request);
    const referrer = (await import("../../functions/_lib/analytics")).extractReferrer(request);
    expect(geo).toEqual({ country: "AR", region: "Buenos Aires", city: "CABA" });
    expect(referrer).toBe("https://google.com/");
  });

  it("falls back to empty geo when headers are missing", async () => {
    const request = new Request("https://example.test");
    const geo = (await import("../../functions/_lib/analytics")).extractGeo(request);
    const referrer = (await import("../../functions/_lib/analytics")).extractReferrer(request);
    expect(geo).toEqual({ country: "", region: "", city: "" });
    expect(referrer).toBe("");
  });

  it("records a visit row with privacy-safe fields", async () => {
    const { db, calls } = database();
    const request = new Request("https://example.test", {
      headers: {
        "CF-IPCountry": "AR",
        "CF-Region": "Buenos Aires",
        "CF-City": "CABA",
        referer: "https://google.com/",
        "user-agent": "Mozilla/5.0",
      },
    });
    await recordVisit(db, "visit", "/proyectos/archivo-digital", "archivo-digital", request, "visitor-1", "secret");
    expect(calls).toHaveLength(1);
    const bound = calls[0] as unknown[];
    expect(bound[1]).toBe((await import("../../functions/_lib/analytics")).analyticsDay());
    expect(bound[2]).toBe("visit");
    expect(bound[10]).toBe(await hashVisitorId("visitor-1", "secret"));
  });

  it("owner session is completely excluded from analytics and visitor cookie", async () => {
    const { db, calls } = database();
    const request = new Request("https://example.test/api/analytics/event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "CF-Connecting-IP": "owner-test",
        Cookie: "fh_admin_session=owner-token",
      },
      body: JSON.stringify({ event: "visit", path: "/soluciones", source: "soluciones" }),
    });
    const response = await analyticsEvent({ request, env: { ANALYTICS_DB: db, ADMIN_SESSION_SECRET: "secret" } });
    expect(response.status).toBe(202);
    // Only hasAdminSession query should run; no recordEvent, no recordVisit, no Set-Cookie
    expect(calls).toHaveLength(1);
    expect(response.headers.get("Set-Cookie")).toBeNull();
  });

  it("normal visitor generates both public totals and private visit record", async () => {
    const { db, calls } = database();
    const request = new Request("https://example.test/api/analytics/event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "CF-Connecting-IP": "visitor-test",
      },
      body: JSON.stringify({ event: "visit", path: "/soluciones", source: "soluciones" }),
    });
    const response = await analyticsEvent({ request, env: { ANALYTICS_DB: db, ADMIN_SESSION_SECRET: "secret" } });
    expect(response.status).toBe(202);
    expect(calls).toHaveLength(2);
    expect(calls[0].at(-1)).toBe("soluciones"); // recordEvent source
    expect(calls[1]).toHaveLength(11); // recordVisit has 11 bound values
    expect(response.headers.get("Set-Cookie")).toContain("fh_visitor_id=");
  });

  it("reuses existing visitor cookie instead of generating a new one", async () => {
    const { db, calls } = database();
    const request = new Request("https://example.test/api/analytics/event", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "CF-Connecting-IP": "visitor-test",
        Cookie: "fh_visitor_id=existing-id",
      },
      body: JSON.stringify({ event: "visit", path: "/", source: "home" }),
    });
    const response = await analyticsEvent({ request, env: { ANALYTICS_DB: db, ADMIN_SESSION_SECRET: "secret" } });
    expect(response.status).toBe(202);
    expect(calls).toHaveLength(2);
    expect(calls[1][10]).toBe(await hashVisitorId("existing-id", "secret"));
    expect(response.headers.get("Set-Cookie")).toBeNull();
  });
});
