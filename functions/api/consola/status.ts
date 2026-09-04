import { CONSOLE_HEARTBEAT_TIMEOUT_SECONDS, unixNow, type ConsoleEnv } from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };

export const onRequestGet = async ({ env }: Context) => {
  if (!env.ANALYTICS_DB) return Response.json({ error: "No disponible." }, { status: 503, headers: { "Cache-Control": "no-store" } });

  const now = unixNow();
  const cutoff = now - CONSOLE_HEARTBEAT_TIMEOUT_SECONDS;

  const result = await env.ANALYTICS_DB
    .prepare("SELECT ts, pc_id, platform, django, agent_console, bridge, received_at FROM console_heartbeats ORDER BY received_at DESC LIMIT 1")
    .all<{ ts: number; pc_id: string; platform: string; django: string; agent_console: string; bridge: string; received_at: number }>();

  const latest = result.results[0];
  if (!latest || latest.received_at < cutoff) {
    return Response.json({
      pc_online: false,
      agent_console_online: false,
      last_seen: latest ? new Date(latest.received_at * 1000).toISOString() : null,
      pc_id: latest ? latest.pc_id : null,
    }, { headers: { "Cache-Control": "no-store" } });
  }

  return Response.json({
    pc_online: latest.django === "ok" || latest.bridge === "ok",
    agent_console_online: latest.agent_console === "ok" && latest.bridge === "ok",
    last_seen: new Date(latest.received_at * 1000).toISOString(),
    pc_id: latest.pc_id,
    platform: latest.platform,
  }, { headers: { "Cache-Control": "no-store" } });
};
