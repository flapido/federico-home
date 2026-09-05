import { onRequestPost } from "../../functions/api/consola/task-notify";
import { secretHash, unixNow } from "../../functions/_lib/console-auth";

type Row = { state: string; attempts: number };

function database() {
  const rows = new Map<string, Row>();
  return {
    db: {
      prepare(sql: string) {
        return { bind: (...values: unknown[]) => ({
          run: async () => {
            if (sql.startsWith("INSERT INTO")) {
              const key = String(values[3]);
              if (rows.has(key)) return { meta: { changes: 0 } };
              rows.set(key, { state: "pending", attempts: 1 });
              return { meta: { changes: 1 } };
            }
            const key = String(values.at(-1)); const row = rows.get(key);
            if (!row) return { meta: { changes: 0 } };
            if (sql.includes("delivery_state = 'sent'")) row.state = "sent";
            if (sql.includes("delivery_state = 'failed'")) row.state = "failed";
            if (sql.includes("attempt_count = attempt_count + 1") && row.state === "failed") { row.state = "pending"; row.attempts += 1; return { meta: { changes: 1 } }; }
            return { meta: { changes: 1 } };
          },
          all: async <T>() => {
            const row = rows.get(String(values[0]));
            return { results: row ? [{ delivery_state: row.state } as T] : [] };
          },
        }) };
      },
    }, rows,
  };
}

const env = (db: unknown) => ({ ANALYTICS_DB: db, AGENT_CONSOLE_NOTIFY_SECRET: "notify-test-secret", TELEGRAM_BOT_TOKEN: "bot-test", TELEGRAM_CHAT_ID: "chat-test" });
async function request(event = "status-change") {
  const body = { task_id: "task-1", project: "demo", agent: "codex", status: "COMPLETED", tests: "", qa: "", product_quality_gate: "", short_summary: "", pending: [], event };
  const ts = String(unixNow());
  const signature = await secretHash(`${ts}:${JSON.stringify(body)}`, "notify-test-secret");
  return new Request("https://example.test/api/consola/task-notify", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer agent-console-notify/${ts}:${signature}` }, body: JSON.stringify(body) });
}

test("first send works and replay is deduplicated", async () => {
  const { db } = database(); let sends = 0;
  const original = globalThis.fetch;
  globalThis.fetch = async () => { sends += 1; return new Response(JSON.stringify({ ok: true }), { status: 200 }); };
  try {
    expect((await onRequestPost({ request: await request(), env: env(db) })).status).toBe(200);
    expect((await onRequestPost({ request: await request(), env: env(db) })).status).toBe(202);
    expect(sends).toBe(1);
  } finally { globalThis.fetch = original; }
});

test("concurrent duplicate claims only one Telegram delivery", async () => {
  const { db } = database(); let sends = 0; let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; }); const original = globalThis.fetch;
  globalThis.fetch = async () => { sends += 1; await gate; return new Response(JSON.stringify({ ok: true })); };
  try {
    const first = onRequestPost({ request: await request(), env: env(db) });
    const second = onRequestPost({ request: await request(), env: env(db) });
    await Promise.resolve(); release(); const responses = await Promise.all([first, second]);
    expect(responses.map(r => r.status).sort()).toEqual([200, 202]); expect(sends).toBe(1);
  } finally { globalThis.fetch = original; }
});

test("failed send is recorded and a later retry can deliver once", async () => {
  const { db } = database(); let sends = 0; const original = globalThis.fetch;
  globalThis.fetch = async () => { sends += 1; return sends === 1 ? new Response(JSON.stringify({ ok: false }), { status: 502 }) : new Response(JSON.stringify({ ok: true })); };
  try {
    expect((await onRequestPost({ request: await request(), env: env(db) })).status).toBe(502);
    expect((await onRequestPost({ request: await request(), env: env(db) })).status).toBe(200);
    expect(sends).toBe(2);
  } finally { globalThis.fetch = original; }
});
