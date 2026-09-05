import {
  constantTimeEqual,
  secretHash,
  unixNow,
  type ConsoleEnv,
} from "../../_lib/console-auth";

type Context = { request: Request; env: ConsoleEnv };

const headers = { "Cache-Control": "no-store" };
const failure = (message: string, status = 400) =>
  Response.json({ error: message }, { status, headers });

const MAX_BODY_BYTES = 4096;
const CLOCK_SKEW_SECONDS = 300;

type TaskNotifyPayload = {
  task_id?: string;
  project?: string;
  agent?: string;
  status?: string;
  tests?: string;
  qa?: string;
  product_quality_gate?: string;
  short_summary?: string;
  pending?: string[];
  event?: string;
};

function buildTelegramMessage(payload: TaskNotifyPayload): string | null {
  const project = (payload.project || "").slice(0, 120) || "-";
  const agent = (payload.agent || "-").slice(0, 40);
  const tests = (payload.tests || "-").slice(0, 32);
  const qa = (payload.qa || "-").slice(0, 32);
  const gate = (payload.product_quality_gate || "-").slice(0, 32);
  const summary = (payload.short_summary || "").slice(0, 180);

  switch ((payload.status || "").toUpperCase()) {
    case "COMPLETED":
      return `✅ Trabajo terminado\n\nProyecto: ${project}\nAgente: ${agent}\nTests: ${tests}\nQA: ${qa}\nQuality Gate: ${gate}${summary ? "\n" + summary : ""}`;
    case "FAILED":
      return `❌ Trabajo falló\n\nProyecto: ${project}\nAgente: ${agent}\nMotivo: ${summary || "sin detalle"}`;
    case "NEEDS_CONTINUE": {
      const pending = Array.isArray(payload.pending)
        ? payload.pending.map((item) => `- ${String(item).slice(0, 120)}`).join("\n")
        : "- (sin detalle)";
      return `⚠️ Trabajo incompleto\n\nProyecto: ${project}\nAgente: ${agent}\nPendiente:\n${pending}`;
    }
    case "WAITING_INPUT":
      return `⏸ ${agent} necesita una respuesta\n\nProyecto: ${project}\nSesión: ${(payload.task_id || "-").slice(0, 64)}`;
    case "INTERRUPTED":
      return `⚠️ Trabajo interrumpido\n\nProyecto: ${project}\nAgente: ${agent}\nMotivo: ${summary || "proceso desapareció sin resultado"}`;
    default:
      return null;
  }
}

function sanitizeForTelegram(text: string): string {
  return text
    .replace(/\x1b\[[?0-9;:]*[ -/]*[@-~]/g, "")
    .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)/g, "")
    .replace(/\x1b[()][A-Za-z0-9]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);
}

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.ANALYTICS_DB || !env.AGENT_CONSOLE_NOTIFY_SECRET || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return Response.json({ error: "Servicio no disponible." }, { status: 503, headers });
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.includes("application/json")) {
    return failure("Solicitud inválida.", 415);
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES) {
    return failure("Payload demasiado extenso.", 413);
  }

  const authHeader = request.headers.get("authorization") || "";
  const expectedPrefix = "Bearer agent-console-notify/";
  if (!authHeader.startsWith(expectedPrefix)) {
    return failure("No autorizado.", 401);
  }
  const bearer = authHeader.slice(expectedPrefix.length);
  const [tsPart, sigPart] = bearer.split(":");
  if (!tsPart || !sigPart) return failure("No autorizado.", 401);

  const ts = Number(tsPart);
  if (!Number.isFinite(ts) || Math.abs(unixNow() - ts) > CLOCK_SKEW_SECONDS) {
    return failure("Solicitud expirada.", 401);
  }

  let body: TaskNotifyPayload;
  try {
    body = (await request.json()) as TaskNotifyPayload;
  } catch {
    return failure("JSON inválido.", 400);
  }

  const normalized = JSON.stringify({
    task_id: typeof body.task_id === "string" ? body.task_id.slice(0, 64) : "",
    project: typeof body.project === "string" ? body.project.slice(0, 120) : "",
    agent: typeof body.agent === "string" ? body.agent.slice(0, 40) : "",
    status: typeof body.status === "string" ? body.status.toUpperCase().slice(0, 32) : "",
    tests: typeof body.tests === "string" ? body.tests.slice(0, 32) : "",
    qa: typeof body.qa === "string" ? body.qa.slice(0, 32) : "",
    product_quality_gate: typeof body.product_quality_gate === "string" ? body.product_quality_gate.slice(0, 32) : "",
    short_summary: typeof body.short_summary === "string" ? body.short_summary.slice(0, 180) : "",
    pending: Array.isArray(body.pending) ? body.pending.map((item) => String(item).slice(0, 120)).slice(0, 10) : [],
    event: typeof body.event === "string" ? body.event.slice(0, 80) : "status-change",
  });

  const expectedSignature = await secretHash(`${tsPart}:${normalized}`, env.AGENT_CONSOLE_NOTIFY_SECRET);
  if (!constantTimeEqual(expectedSignature, sigPart)) {
    return failure("No autorizado.", 401);
  }

  const message = buildTelegramMessage(body);
  if (!message) {
    return failure("Sin mensaje para este estado.", 422);
  }

  const text = sanitizeForTelegram(message);
  // Opaque HMAC-derived key: D1 can atomically claim a delivery without
  // retaining task metadata or allowing a replay to reach Telegram twice.
  const idempotencyKey = await secretHash(
    `${normalized.task_id}:${normalized.status}:${normalized.event}`,
    env.AGENT_CONSOLE_NOTIFY_SECRET,
  );
  const now = unixNow();
  const taskId = normalized.task_id || "-";
  const status = normalized.status || "-";
  let claimed = false;
  const inserted = await env.ANALYTICS_DB.prepare(
    "INSERT INTO console_task_notifications (task_id, status, sent_at, idempotency_key, delivery_state, attempt_count) VALUES (?, ?, ?, ?, 'pending', 1) ON CONFLICT DO NOTHING"
  ).bind(taskId, status, now, idempotencyKey).run();
  claimed = (inserted.meta?.changes ?? 0) === 1;
  if (!claimed) {
    const existing = await env.ANALYTICS_DB.prepare(
      "SELECT delivery_state FROM console_task_notifications WHERE idempotency_key = ? LIMIT 1"
    ).bind(idempotencyKey).all<{ delivery_state: string }>();
    if (existing.results[0]?.delivery_state === "failed") {
      const retry = await env.ANALYTICS_DB.prepare(
        "UPDATE console_task_notifications SET delivery_state = 'pending', sent_at = ?, attempt_count = attempt_count + 1 WHERE idempotency_key = ? AND delivery_state = 'failed'"
      ).bind(now, idempotencyKey).run();
      claimed = (retry.meta?.changes ?? 0) === 1;
    }
    if (!claimed) return Response.json({ ok: true, deduplicated: true }, { status: 202, headers });
  }
  try {
    const telegram = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    });
    const payload = await telegram.json() as { ok?: boolean };
    if (!telegram.ok || payload.ok !== true) {
      await env.ANALYTICS_DB.prepare(
        "UPDATE console_task_notifications SET delivery_state = 'failed' WHERE idempotency_key = ? AND delivery_state = 'pending'"
      ).bind(idempotencyKey).run();
      return Response.json({ error: "Telegram rechazó el envío." }, { status: 502, headers });
    }

    await env.ANALYTICS_DB.prepare(
      "UPDATE console_task_notifications SET delivery_state = 'sent' WHERE idempotency_key = ? AND delivery_state = 'pending'"
    ).bind(idempotencyKey).run();

    return Response.json({ ok: true }, headers);
  } catch {
    await env.ANALYTICS_DB.prepare(
      "UPDATE console_task_notifications SET delivery_state = 'failed' WHERE idempotency_key = ? AND delivery_state = 'pending'"
    ).bind(idempotencyKey).run().catch(() => undefined);
    return Response.json({ error: "Error de red." }, { status: 502, headers });
  }
};

export const onRequest = () =>
  Response.json({ error: "Método no permitido." }, { status: 405, headers: { Allow: "POST", ...headers } });
