import { hasAdminSession, restricted, unixNow, type AdminEnv } from "../../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv };
type EntryAction = { id?: unknown; status?: unknown; action?: unknown };

export const onRequestGet = async ({ request, env }: Context) => {
  if (!(await hasAdminSession(request, env)) || !env.ANALYTICS_DB) return restricted();
  const result = await env.ANALYTICS_DB.prepare("SELECT * FROM guestbook_entries ORDER BY created_at DESC LIMIT 100").all();
  return Response.json({ entries: result.results }, { headers: { "Cache-Control": "no-store" } });
};

export const onRequestPost = async ({ request, env }: Context) => {
  if (!(await hasAdminSession(request, env)) || !env.ANALYTICS_DB) return restricted();
  let body: EntryAction;
  try { body = await request.json(); } catch { return Response.json({ error: "Solicitud inválida." }, { status: 400 }); }
  const id = Number(body.id);
  if (!Number.isInteger(id)) return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  const existing = await env.ANALYTICS_DB.prepare("SELECT publication_consent FROM guestbook_entries WHERE id=?").bind(id).all<{ publication_consent: number }>();
  if (!existing.results[0]) return Response.json({ error: "No encontrado." }, { status: 404 });
  if (body.action === "delete") {
    await env.ANALYTICS_DB.prepare("DELETE FROM guestbook_entries WHERE id=?").bind(id).run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }
  if (body.action === "recover") {
    await env.ANALYTICS_DB.prepare("UPDATE guestbook_entries SET status='pending', moderation='clean', moderation_reason=NULL WHERE id=?").bind(id).run();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  }
  const status = String(body.status);
  if (!["approved", "private", "rejected", "pending"].includes(status)) return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  if (status === "approved" && Number(existing.results[0].publication_consent) !== 1) return Response.json({ error: "No hay autorización para publicar." }, { status: 400 });
  const now = unixNow();
  await env.ANALYTICS_DB.prepare("UPDATE guestbook_entries SET status=?, approved_at=CASE WHEN ?='approved' THEN ? ELSE approved_at END, published_at=CASE WHEN ?='approved' THEN ? ELSE published_at END WHERE id=?").bind(status, status, now, status, now, id).run();
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
};
