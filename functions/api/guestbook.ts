import { recordEvent, type D1Database } from "../_lib/analytics";

type Env = { ANALYTICS_DB?: D1Database; TELEGRAM_BOT_TOKEN?: string; TELEGRAM_CHAT_ID?: string };
type Context = { request: Request; env: Env; waitUntil?: (value: Promise<unknown>) => void };
const attempts = new Map<string, number[]>();
const clean = (value: unknown, max: number) => typeof value === "string" ? value.trim().replace(/[\p{Cc}]/gu, " ").slice(0, max) : "";
const linkedIn = (value: string) => !value || /^https:\/\/(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[a-z0-9-_%]+\/?$/iu.test(value);
const limited = (request: Request) => { const key = request.headers.get("CF-Connecting-IP") || "edge"; const now = Date.now(); const recent = (attempts.get(key) || []).filter((time) => now - time < 15 * 60_000); if (recent.length >= 3) return true; recent.push(now); attempts.set(key, recent); return false; };
const reply = (body: Record<string, string>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export const onRequestPost = async ({ request, env, waitUntil }: Context) => {
  if (!env.ANALYTICS_DB) return reply({ error: "No pude guardar el mensaje ahora." }, 503);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "Solicitud inválida." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 4096 || limited(request)) return reply({ error: "Probá nuevamente en unos minutos." }, 429);
  let raw: Record<string, unknown>; try { raw = await request.json() as Record<string, unknown>; } catch { return reply({ error: "Solicitud inválida." }, 400); }
  if (clean(raw.website, 100)) return reply({ ok: "true" });
  const type = raw.type === "professional_reference" ? "professional_reference" : raw.type === "guestbook" ? "guestbook" : "";
  const name = clean(raw.name, 80), relationship = clean(raw.relationship, 100), company = clean(raw.company, 100), message = clean(raw.message, type === "professional_reference" ? 1200 : 500), linkedin = clean(raw.linkedin_url, 200);
  const consent = raw.publication_consent === true;
  if (name.length < 2) return reply({ error: "Escribí tu nombre o apodo." }, 400);
  if (!type || message.length < (type === "professional_reference" ? 20 : 5)) return reply({ error: type === "professional_reference" ? "Contame brevemente cómo fue trabajar conmigo." : "Dejame unas palabras antes de enviar." }, 400);
  if (type === "professional_reference" && relationship.length < 2) return reply({ error: "Contame tu cargo o relación con Federico." }, 400);
  if (type === "professional_reference" && !consent) return reply({ error: "Necesito tu autorización antes de poder publicar esta referencia." }, 400);
  if (!linkedIn(linkedin)) return reply({ error: "Revisá el enlace de LinkedIn." }, 400);
  const now = Math.floor(Date.now() / 1000);
  await env.ANALYTICS_DB.prepare("INSERT INTO guestbook_entries (type,name,relationship,company,linkedin_url,message,publication_consent,status,created_at) VALUES (?,?,?,?,?,?,?,'pending',?)").bind(type, name, relationship || null, company || null, linkedin || null, message, consent ? 1 : 0, now).run();
  const event = type === "professional_reference" ? "reference_submit_success" as const : "guestbook_submit_success" as const;
  const analytics = recordEvent(env.ANALYTICS_DB, event, "/gracias", type === "professional_reference" ? "other" : "contacto").catch(() => undefined); if (waitUntil) waitUntil(analytics);
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) { const text = [`${type === "professional_reference" ? "NUEVA REFERENCIA PROFESIONAL" : "NUEVO MENSAJE — Libro de visitas"}`, "", `Nombre: ${name}`, relationship && `Relación: ${relationship}`, company && `Empresa: ${company}`, "", type === "professional_reference" ? "Referencia:" : "Mensaje:", message, "", `Publicación autorizada: ${consent ? "Sí" : "No"}`, "Estado: Pendiente"].filter(Boolean).join("\n"); const telegram = fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }) }).catch(() => undefined); if (waitUntil) waitUntil(telegram); }
  return reply({ ok: "true" });
};
export const onRequest = () => reply({ error: "Método no permitido." }, 405);
