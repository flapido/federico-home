import type { D1Database } from "../../_lib/analytics";
type Context = { env: { ANALYTICS_DB?: D1Database } };
export const onRequestGet = async ({ env }: Context) => { const entries = env.ANALYTICS_DB ? await env.ANALYTICS_DB.prepare("SELECT id,type,name,relationship,company,linkedin_url,message,published_at FROM guestbook_entries WHERE status='approved' AND publication_consent=1 ORDER BY published_at DESC LIMIT 12").all() : { results: [] }; return Response.json({ entries: entries.results }, { headers: { "Cache-Control": "public, max-age=60" } }); };
