import { createBrowserTicket, isRelaySession } from "../../_lib/console-relay-protocol";
import { getConsoleSession, hasSameOrigin, type ConsoleEnv } from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };
const headers = { "Cache-Control": "no-store" };

export async function buildRelayTicket(relayUrl: string, relaySessionId: string, ticketSecret: string) {
  if (!isRelaySession(relaySessionId)) throw new TypeError("invalid relay session");
  const relay = new URL(relayUrl);
  if (relay.protocol !== "wss:") throw new TypeError("invalid relay url");
  relay.searchParams.set("session", relaySessionId);
  return { url: relay.toString(), ticket: await createBrowserTicket(relaySessionId, ticketSecret) };
}

export const onRequestPost = async ({ request, env }: Context) => {
  if (!hasSameOrigin(request) || !env.CONSOLE_RELAY_TICKET_SECRET || !env.CONSOLE_RELAY_URL || !env.CONSOLE_RELAY_SESSION_ID) {
    return Response.json({ error: "Acceso restringido." }, { status: 401, headers });
  }
  if (!(await getConsoleSession(request, env))) return Response.json({ error: "Acceso restringido." }, { status: 401, headers });

  try {
    return Response.json(await buildRelayTicket(env.CONSOLE_RELAY_URL, env.CONSOLE_RELAY_SESSION_ID, env.CONSOLE_RELAY_TICKET_SECRET), { headers });
  } catch {
    return Response.json({ error: "Relay no disponible." }, { status: 503, headers });
  }
};

export const onRequest = () => Response.json(
  { error: "M\u00e9todo no permitido." },
  { status: 405, headers: { Allow: "POST", ...headers } },
);
