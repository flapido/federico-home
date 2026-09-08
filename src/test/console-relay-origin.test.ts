import { describe, expect, it, vi, beforeEach } from "vitest";
import { ConsoleRelay } from "../../workers/console-relay";
import { createBrowserTicket } from "../../functions/_lib/console-relay-protocol";

class MockSocket {
  listeners = new Map<string, Set<Function>>();
  closed = false;
  closeCode = 0;
  closeReason = "";
  bufferedAmount = 0;
  accept = vi.fn();
  send = vi.fn();
  close = vi.fn((code: number, reason: string) => { this.closed = true; this.closeCode = code; this.closeReason = reason; });
  addEventListener = vi.fn((name: string, handler: Function) => { if (!this.listeners.has(name)) this.listeners.set(name, new Set()); this.listeners.get(name)!.add(handler); });
  _emit(name: string, data?: unknown) { this.listeners.get(name)?.forEach((h) => h({ data })); }
}

let lastServerSocket: MockSocket | null = null;

(globalThis as any).WebSocketPair = class {
  0 = new MockSocket();
  1 = (lastServerSocket = new MockSocket());
};

const OriginalResponse = globalThis.Response;
beforeEach(() => {
  globalThis.Response = class extends OriginalResponse {
    constructor(body: any, init?: ResponseInit) {
      if (init && init.status === 101) {
        super(body, { ...init, status: 200 });
      } else {
        super(body, init);
      }
    }
  } as any;
  lastServerSocket = null;
});

function makeRequest(origin: string | null, session: string) {
  const headers = new Headers({ Upgrade: "websocket" });
  if (origin) headers.set("Origin", origin);
  return new Request(`https://relay.example.test/relay?session=${session}`, { headers });
}

function makeEnv(allowedOrigin?: string) {
  return {
    CONSOLE_RELAY: {
      idFromName: vi.fn(() => "test-id"),
      get: vi.fn(() => ({ fetch: vi.fn() })),
    },
    CONSOLE_RELAY_TICKET_SECRET: "test-secret",
    AGENT_CONSOLE_RELAY_SECRET: "test-agent-secret",
    CONSOLE_RELAY_ALLOWED_ORIGIN: allowedOrigin,
  };
}

async function runOriginTest(allowedOrigin: string | undefined, requestOrigin: string | null, expectAllow: boolean) {
  const session = "a".repeat(32);
  const ticket = await createBrowserTicket(session, "test-secret", Math.floor(Date.now() / 1000), 60);

  const request = makeRequest(requestOrigin, session);
  const env = makeEnv(allowedOrigin);

  const relay = new ConsoleRelay({} as any, env);

  await relay.fetch(request);

  const serverWs = lastServerSocket!;
  serverWs._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser", session, ticket }));

  await new Promise((r) => setTimeout(r, 10));

  if (expectAllow) {
    expect(serverWs.closed).toBe(false);
  } else {
    expect(serverWs.closed).toBe(true);
    expect(serverWs.closeCode).toBe(1008);
    expect(serverWs.closeReason).toBe("origin denied");
  }
}

describe("console relay origin validation (fail-closed)", () => {
  const allowedOrigin = "https://pages.example.test";
  const wrongOrigin = "https://evil.example.test";

  it("allows browser with correct origin when ALLOWED_ORIGIN is configured", async () => {
    await runOriginTest(allowedOrigin, allowedOrigin, true);
  });

  it("denies browser with incorrect origin when ALLOWED_ORIGIN is configured", async () => {
    await runOriginTest(allowedOrigin, wrongOrigin, false);
  });

  it("denies browser with missing origin when ALLOWED_ORIGIN is configured", async () => {
    await runOriginTest(allowedOrigin, null, false);
  });

  it("denies browser when CONSOLE_RELAY_ALLOWED_ORIGIN is not configured (fail-closed)", async () => {
    await runOriginTest(undefined, allowedOrigin, false);
  });

  it("denies browser when CONSOLE_RELAY_ALLOWED_ORIGIN is empty string (fail-closed)", async () => {
    await runOriginTest("", allowedOrigin, false);
  });
});