import {
  unixNow,
  type ConsoleEnv,
} from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };

const json = (body: Record<string, unknown>, status = 200, init?: { headers?: Record<string, string> }) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) } });

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.ANALYTICS_DB) return json({ error: "Servicio no disponible." }, 503);

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "JSON inválido." }, 400);
  }

  const now = unixNow();
  const ts = typeof payload.ts === "number" ? payload.ts : now;
  const pcId = typeof payload.pc_id === "string" ? payload.pc_id.slice(0, 64) : "unknown";
  const platform = typeof payload.platform === "string" ? payload.platform.slice(0, 32) : "unknown";
  const django = typeof payload.django === "string" ? payload.django.slice(0, 16) : "unknown";
  const agentConsole = typeof payload.agent_console === "string" ? payload.agent_console.slice(0, 16) : "unknown";
  const bridge = typeof payload.bridge === "string" ? payload.bridge.slice(0, 16) : "unknown";

  // Keep only last N heartbeats per pc_id to avoid unbounded growth
  const countRow = await env.ANALYTICS_DB
    .prepare("SELECT COUNT(*) AS count FROM console_heartbeats WHERE pc_id = ?")
    .bind(pcId)
    .all<{ count: number }>();
  const count = Number(countRow.results[0]?.count ?? 0);
  if (count >= 1000) {
    await env.ANALYTICS_DB
      .prepare("DELETE FROM console_heartbeats WHERE pc_id = ? ORDER BY received_at ASC LIMIT 100")
      .bind(pcId)
      .run();
  }

  await env.ANALYTICS_DB
    .prepare(
      "INSERT INTO console_heartbeats (ts, pc_id, platform, django, agent_console, bridge, received_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    .bind(ts, pcId, platform, django, agentConsole, bridge, now)
    .run();

  return json({ ok: true });
};

export const onRequest = () =>
  json({ error: "Método no permitido." }, 405, { headers: { Allow: "POST" } });
