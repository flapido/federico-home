import { describe, expect, it, vi, beforeEach } from "vitest";
import { ConsoleRelay } from "../../workers/console-relay";
import { createBrowserTicket } from "../../functions/_lib/console-relay-protocol";
import crypto from "node:crypto";

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

const pairs: any[] = [];
(globalThis as any).WebSocketPair = class {
  0 = new MockSocket();
  1 = new MockSocket();
  constructor() { pairs.push(this); }
};

const OriginalResponse = globalThis.Response;
beforeEach(() => {
  pairs.length = 0;
  globalThis.Response = class extends OriginalResponse {
    constructor(body: any, init?: ResponseInit) {
      if (init && init.status === 101) {
        super(body, { ...init, status: 200 });
      } else {
        super(body, init);
      }
    }
  } as any;
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

async function mintTicket(session: string) {
  return createBrowserTicket(session, "test-secret", Math.floor(Date.now() / 1000), 60);
}

function agentSignature(session: string, ts: number, nonce: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(`v1.agent.${session}.${ts}.${nonce}`, "utf8").digest("base64url");
}

describe("console relay coexistence", () => {
  const allowedOrigin = "https://pages.example.test";
  const session = "a".repeat(32);

  it("TERMINAL_MONITOR_COEXIST: agent, terminal browser and monitor browser connect without replacing each other", async () => {
    const env = makeEnv(allowedOrigin);
    const relay = new ConsoleRelay({} as any, env);

    await relay.fetch(makeRequest(allowedOrigin, session));
    const terminalPair = pairs.pop()!;

    await relay.fetch(makeRequest(allowedOrigin, session));
    const monitorPair = pairs.pop()!;

    await relay.fetch(makeRequest(null, session));
    const agentPair = pairs.pop()!;

    const terminalTicket = await mintTicket(session);
    const monitorTicket = await mintTicket(session);
    const ts = Math.floor(Date.now() / 1000);
    const agentNonce = "nonce-agent-1234";
    const agentSig = agentSignature(session, ts, agentNonce, "test-agent-secret");

    terminalPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-terminal", session, ticket: terminalTicket }));
    monitorPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: monitorTicket }));
    await new Promise((r) => setTimeout(r, 10));

    agentPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "agent", session, ts, nonce: agentNonce, signature: agentSig }));
    await new Promise((r) => setTimeout(r, 10));

    expect(terminalPair[1].closed).toBe(false);
    expect(monitorPair[1].closed).toBe(false);
    expect(agentPair[1].closed).toBe(false);
  });

  it("MONITOR_DISCONNECT_NO_TERMINAL_EXIT: monitor disconnect does not send terminal.exit", async () => {
    const env = makeEnv(allowedOrigin);
    const relay = new ConsoleRelay({} as any, env);

    await relay.fetch(makeRequest(allowedOrigin, session));
    const terminalPair = pairs.pop()!;

    await relay.fetch(makeRequest(allowedOrigin, session));
    const monitorPair = pairs.pop()!;

    await relay.fetch(makeRequest(null, session));
    const agentPair = pairs.pop()!;

    const terminalTicket = await mintTicket(session);
    const monitorTicket = await mintTicket(session);
    const ts = Math.floor(Date.now() / 1000);
    const agentNonce = "nonce-agent-1234";
    const agentSig = agentSignature(session, ts, agentNonce, "test-agent-secret");

    terminalPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-terminal", session, ticket: terminalTicket }));
    monitorPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: monitorTicket }));
    agentPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "agent", session, ts, nonce: agentNonce, signature: agentSig }));
    await new Promise((r) => setTimeout(r, 10));

    monitorPair[1]._emit("close");
    await new Promise((r) => setTimeout(r, 10));

    const sentExit = agentPair[0].send.mock.calls.find((call: any) => typeof call[0] === "string" && JSON.parse(call[0]).type === "terminal.exit");
    expect(sentExit).toBeUndefined();
    expect(terminalPair[1].closed).toBe(false);
  });

  it("TERMINAL_INPUT_AFTER_MONITOR: terminal input still reaches agent after monitor connects", async () => {
    const env = makeEnv(allowedOrigin);
    const relay = new ConsoleRelay({} as any, env);

    await relay.fetch(makeRequest(allowedOrigin, session));
    const terminalPair = pairs.pop()!;

    await relay.fetch(makeRequest(allowedOrigin, session));
    const monitorPair = pairs.pop()!;

    await relay.fetch(makeRequest(null, session));
    const agentPair = pairs.pop()!;

    const terminalTicket = await mintTicket(session);
    const monitorTicket = await mintTicket(session);
    const ts = Math.floor(Date.now() / 1000);
    const agentNonce = "nonce-agent-1234";
    const agentSig = agentSignature(session, ts, agentNonce, "test-agent-secret");

    terminalPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-terminal", session, ticket: terminalTicket }));
    monitorPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: monitorTicket }));
    agentPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "agent", session, ts, nonce: agentNonce, signature: agentSig }));
    await new Promise((r) => setTimeout(r, 10));

    terminalPair[1]._emit("message", JSON.stringify({ type: "terminal.input", session_id: "term-session-1", data: "dir\r" }));
    await new Promise((r) => setTimeout(r, 10));

    const sentToAgent = agentPair[1].send.mock.calls.find((call: any) => typeof call[0] === "string" && JSON.parse(call[0]).type === "terminal.input");
    expect(sentToAgent).toBeDefined();
    expect(JSON.parse(sentToAgent[0]).data).toBe("dir\r");
  });

  it("TERMINAL_OUTPUT_AFTER_MONITOR: terminal still receives binary output after monitor connects", async () => {
    const env = makeEnv(allowedOrigin);
    const relay = new ConsoleRelay({} as any, env);

    await relay.fetch(makeRequest(allowedOrigin, session));
    const terminalPair = pairs.pop()!;

    await relay.fetch(makeRequest(allowedOrigin, session));
    const monitorPair = pairs.pop()!;

    await relay.fetch(makeRequest(null, session));
    const agentPair = pairs.pop()!;

    const terminalTicket = await mintTicket(session);
    const monitorTicket = await mintTicket(session);
    const ts = Math.floor(Date.now() / 1000);
    const agentNonce = "nonce-agent-1234";
    const agentSig = agentSignature(session, ts, agentNonce, "test-agent-secret");

    terminalPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-terminal", session, ticket: terminalTicket }));
    monitorPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: monitorTicket }));
    agentPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "agent", session, ts, nonce: agentNonce, signature: agentSig }));
    await new Promise((r) => setTimeout(r, 10));

    const binaryFrame = new Uint8Array([1, 72, 101, 108, 108, 111]).buffer;
    agentPair[1]._emit("message", binaryFrame);
    await new Promise((r) => setTimeout(r, 10));

    const terminalCalls = terminalPair[1].send.mock.calls.filter((call: any) => call[0] === binaryFrame);
    const monitorCalls = monitorPair[1].send.mock.calls.filter((call: any) => call[0] === binaryFrame);
    expect(terminalCalls.length).toBeGreaterThan(0);
    expect(monitorCalls.length).toBeGreaterThan(0);
  });

  it("SESSION_ID_PRESERVED: terminal session_id is preserved across monitor connect/disconnect", async () => {
    const env = makeEnv(allowedOrigin);
    const relay = new ConsoleRelay({} as any, env);

    await relay.fetch(makeRequest(allowedOrigin, session));
    const terminalPair = pairs.pop()!;

    await relay.fetch(makeRequest(allowedOrigin, session));
    const monitorPair = pairs.pop()!;

    await relay.fetch(makeRequest(null, session));
    const agentPair = pairs.pop()!;

    const terminalTicket = await mintTicket(session);
    const monitorTicket = await mintTicket(session);
    const ts = Math.floor(Date.now() / 1000);
    const agentNonce = "nonce-agent-1234";
    const agentSig = agentSignature(session, ts, agentNonce, "test-agent-secret");

    terminalPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-terminal", session, ticket: terminalTicket }));
    monitorPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: monitorTicket }));
    agentPair[1]._emit("message", JSON.stringify({ type: "hello", v: 1, role: "agent", session, ts, nonce: agentNonce, signature: agentSig }));
    await new Promise((r) => setTimeout(r, 10));

    agentPair[1]._emit("message", JSON.stringify({ type: "terminal.open", session_id: "term-session-1" }));
    await new Promise((r) => setTimeout(r, 10));

    expect((relay as any).localTerminalSession).toBe("term-session-1");

    monitorPair[1]._emit("close");
    await new Promise((r) => setTimeout(r, 10));

    expect((relay as any).localTerminalSession).toBe("term-session-1");
    expect(terminalPair[1].closed).toBe(false);
  });
});
