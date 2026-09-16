# Implementation Plan — D1 Read-Limit 503 Mitigation for Visit Counter

**Branch:** `fix/admin-otp-visitor-counter`
**Plan file:** `.kilo/plans/1789162140733-d1-cache-assessment.md`

## 0. Problem Statement (1 sentence)

The `/api/analytics/visit-counter` endpoint sets `Cache-Control: no-store` and is called twice per page load (initial + 700ms retry), exhausting D1's 25,000 free-tier reads/day and causing transient 503s. Visitors see a blank counter during outages.

## 1. Current State (verified in working tree)

### `VisitCounter.tsx` — client-side cache added (in diff)
- `CACHE_TTL_MS = 60 * 60 * 1000` (1 hour) — **too long for a counter**
- `readCache()` / `writeCache()` with try/catch — OK
- Falls back to localStorage on fetch failure — OK, defense-in-depth
- 700ms `setTimeout` retry intact — doubles D1 reads per page load

### `visit-counter.ts` — server endpoint **unchanged** (no diff)
- `SELECT COALESCE(SUM(count), 0) AS total FROM analytics_event_totals WHERE event_type = 'visit'` — correct, minimal (1 row)
- **Both 200 and 503 responses use `Cache-Control: no-store`** — the root cause

### `Admin.tsx` — `responseError()` helper added (in diff)
- Gracefully handles HTML/non-JSON 503 responses from Cloudflare — OK, complementary

### Codebase precedent
- `functions/api/guestbook/public.ts:3` already uses `Cache-Control: public, max-age=60` for a public D1-read endpoint on the **same** `ANALYTICS_DB` binding. The visit counter is inconsistent with this established pattern.

## 2. Design Decisions (all resolved)

### Critical Cloudflare directive constraint (verified via Cloudflare docs)

> **"Do not use `s-maxage` with `stale-while-revalidate`."** — Cloudflare Origin Cache Control docs
> **`s-maxage` disables `stale-while-revalidate`** — Per RFC 9111, `s-maxage` implies `proxy-revalidate`, which prevents shared caches from serving stale content.
> **`stale-if-error` is also ignored** when `s-maxage` or `proxy-revalidate` is present.

**Implication**: A directive like `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` would have **both** stale directives silently ignored on Cloudflare. The original plan's recommendation was technically incorrect for this platform.

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cache TTL directive | `max-age=60` (not `s-maxage=60`) | `s-maxage` disables ALL stale directives on Cloudflare; `max-age` does not |
| Stale-on-error | `stale-if-error=300` | Explicitly serves cached response when origin returns 5xx (500/502/503/504) for up to 5 min past expiry. This is the directive that directly handles the D1 read-limit 503 |
| Stale-while-revalidate | `stale-while-revalidate=300` (optional, for non-blocking revalidation) | After 60s, serves stale + revalidates in background. Concurrent visitors all get stale (0 D1 reads). Without this, each request blocks on D1 after 60s |
| Browser cache | Acceptable via `max-age=60` | Browser caches 60s too. For a portfolio counter, this is fine — count is inherently approximate; 700ms retry gets cached response |
| Client localStorage TTL | Shorten to 10 min | Last-resort backstop only; 1h is too misleading for "Nº X" |
| 503 responses | Keep `no-store` | Error responses must never be cached or propagated as valid |
| Query change | None | SUM is correct and minimal (1 row = 1 read); problem is read volume, not query efficiency |
| Retry at 700ms | Keep | With edge caching, the retry hits the edge cache (0 D1 reads); removing it is out of scope |

## 3. Implementation Tasks

### Task 1: Add edge caching to `visit-counter.ts` (server-side fix — PRIMARY)
**File:** `functions/api/analytics/visit-counter.ts`
**Change:** One header value on the 200 response only.

```diff
- return Response.json({ total: Number(data.results[0]?.total || 0) }, { headers: { "Cache-Control": "no-store" } });
+ return Response.json({ total: Number(data.results[0]?.total || 0) }, { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300, stale-if-error=300" } });
```

503 responses (lines 5 and 9) keep `Cache-Control: no-store` — no change.

**Directive breakdown:**
- `public` — cacheable by shared (edge) and private (browser) caches
- `max-age=60` — fresh for 60 seconds (NOT `s-maxage`, which would disable stale directives)
- `stale-while-revalidate=300` — serve stale + background revalidate for up to 5 min after expiry (non-blocking, reduces D1 reads during revalidation)
- `stale-if-error=300` — serve stale when origin returns 5xx for up to 5 min past expiry (directly handles D1 read-limit 503)

### Task 2: Shorten client localStorage TTL
**File:** `src/components/VisitCounter.tsx`

```diff
- const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
+ const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
```

### Task 3: Add test for expired cache (TTL boundary)
**File:** `src/test/layout.test.tsx`

Add a test that sets a cache entry with `ts = Date.now() - 11min` and mocks fetch to return 503. Expected: counter renders nothing (no stale count displayed).

```typescript
test("does not display expired cache when the endpoint is unavailable", async () => {
  localStorage.setItem("fh:visit-counter:last-known", JSON.stringify({ value: 9999, ts: Date.now() - 11 * 60 * 1000 }))
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "No disponible." }), { status: 503, headers: { "content-type": "application/json" } })))
  render(<VisitCounter />)
  expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
})
```

### Task 4: Server-side Cache-Control header test (manual or harness)
If a server-test harness exists for Functions, verify: 200 response has `Cache-Control: public, max-age=60, stale-while-revalidate=300, stale-if-error=300`; 503 response has `Cache-Control: no-store`. Otherwise, validate via `curl -I` on staging.

## 4. Files Changed Summary

| File | Change | Impact |
|------|--------|--------|
| `functions/api/analytics/visit-counter.ts` | 1 header value on 200 response | Edge caching enabled — D1 reads reduced ~99% |
| `src/components/VisitCounter.tsx` | TTL 1h → 10min | Less misleading stale data during outages |
| `src/test/layout.test.tsx` | +1 test | Validates expired-cache boundary |
| `Admin.tsx` | Already in diff, no change | `responseError()` helper — complementary fix |

**No changes to:** `wrangler.toml`, `migrations/*`, `_lib/analytics.ts`, `_lib/admin-auth.ts`, any `D1Database` type, any auth secrets.

## 5. Three-Tier Freshness Model (post-implementation)

| Scenario | Tier | Max staleness | D1 reads |
|----------|------|---------------|----------|
| Normal traffic | Edge cache (`max-age=60`) | 0–60s | ~1 per 60s/edge POP |
| D1 transient 503 | Edge `stale-if-error` | 60–360s | 0 |
| D1 slow but not erroring | Edge `stale-while-revalidate` | 60–360s | 0 (background revalidate) |
| D1 prolonged outage (>6min) | Client localStorage | 360s–960s | 0 |
| All tiers expired | Blank counter | N/A | 0 (visitor sees nothing) |

The last row only triggers after 10+ minutes of complete D1 failure — acceptable for "transient" scenario.

## 6. Risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Stale count shown (up to 5 min at edge) | High | Low | 5-min staleness on a portfolio counter is acceptable; copy says "Sos la visita Nº" without claiming real-time |
| Browser caches stale counter for 60s | High | Low | Count is inherently approximate; 60s browser cache is acceptable on a portfolio site |
| Cache stampede at 60s edge expiry | Low | Low | `stale-while-revalidate=300` serves stale + background revalidate; concurrent visitors all served stale (0 D1 reads) |
| `s-maxage` used by mistake | N/A (prevented) | High | Document the Cloudflare constraint explicitly; code review checklist item |
| `consola/status.ts` has same `no-store` pattern | Out of scope | Medium | Same D1 read concern but not in current mandate; flag for separate ticket |
| Admin summary endpoint reads 50+ rows/query | Out of scope | Medium | `summary.ts` uses `no-store` and returns up to 50 rows per call; D1 read-heavy but behind admin auth |
| CI coverage of Cache-Control header | Low | Low | No existing server-side test harness for Functions; manual validation via `curl -I` on staging |
| `stale-if-error` ignored if Always Online enabled | Low | Low | Check Cloudflare dashboard — if Always Online is on, SWR/sIE are disabled (documented Cloudflare behavior) |

## 7. Validation / Acceptance Criteria

1. **AC-1**: `visit-counter.ts` 200 response has `Cache-Control: public, max-age=60, stale-while-revalidate=300, stale-if-error=300`
2. **AC-2**: `visit-counter.ts` 503 responses retain `Cache-Control: no-store`
3. **AC-3**: `VisitCounter.tsx` localStorage TTL = 10 minutes (600,000 ms)
4. **AC-4**: `wrangler.toml` unchanged (no new bindings, KV, or D1 databases)
5. **AC-5**: No migration files added or modified
6. **AC-6**: No D1 schema changes (no new tables, indexes, or columns)
7. **AC-7**: `npm test` passes (all existing + new tests)
8. **AC-8**: `npm run build` passes
9. **AC-9**: `curl -I https://<deploy-url>/api/analytics/visit-counter` shows `cache-control: public, max-age=60, ...` on 200
10. **AC-10**: D1 read count reduced — verifiable via Cloudflare dashboard (should drop significantly after deploy)
11. **AC-11**: Visitors see a number (not blank) during transient 503 — edge `stale-if-error` serves stale data

## 8. Validation Commands

```bash
# Local test
npm test

# Local build
npm run build

# Staging/production header check (after deploy)
curl -sI https://federico-home.pages.dev/api/analytics/visit-counter | grep -i cache-control

# D1 usage monitoring (Cloudflare dashboard)
# → D1 → Analytics → Reads (should drop after deploy)

# Verify Always Online is disabled (Cloudflare dashboard)
# → Caching → Configuration → Always Online (should be off for SWR/sIE to work)
```

## 9. Rollback

Single header change — revert `visit-counter.ts` line 8 to `Cache-Control: no-store`. No migration, no data, no config to roll back.

---

**Decision:** Implement Tasks 1–3 (3 files, ~3 lines of production code + 1 test). No server-side query change, no infrastructure change, no auth change. The client-side cache in the diff is acceptable but the 1-hour TTL should be shortened to 10 minutes. The `Cache-Control` header must use `max-age` (not `s-maxage`) to avoid silently disabling stale directives on Cloudflare.
