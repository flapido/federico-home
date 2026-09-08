import { getConsoleSession, type ConsoleEnv } from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };

export const onRequestGet = async ({ request, env }: Context) => {
  const session = await getConsoleSession(request, env);
  return Response.json(
    { authorized: Boolean(session) },
    { status: session ? 200 : 401, headers: { "Cache-Control": "no-store" } },
  );
};

export const onRequest = () => Response.json(
  { error: "M\u00e9todo no permitido." },
  { status: 405, headers: { Allow: "GET", "Cache-Control": "no-store" } },
);
