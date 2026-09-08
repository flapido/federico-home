import { describe, expect, it } from "vitest";
import { BINARY_TERMINAL_OUTPUT, MAX_RELAY_JSON_BYTES, createBrowserTicket, decodeTerminalOutput, encodeTerminalOutput, parseRelayJson, verifyBrowserTicket } from "../../functions/_lib/console-relay-protocol";
import { onRequestPost as relayTicket } from "../../functions/api/consola/relay-ticket";

describe("console relay protocol", () => {
  const session = "a".repeat(32);
  it("accepts bounded, versioned hello and terminal frames", () => {
    expect(parseRelayJson(JSON.stringify({ type: "hello", v: 1, role: "browser", session, ticket: "signed-ticket" }))).toMatchObject({ role: "browser" });
    expect(parseRelayJson(JSON.stringify({ type: "terminal.open", request_id: "open1", project: "federico-home", agent: "codex", cols: 120, rows: 30 }))).toMatchObject({ type: "terminal.open", project: "federico-home", agent: "codex" });
    expect(parseRelayJson(JSON.stringify({ type: "terminal.resize", session_id: "local-session-1", cols: 120, rows: 30 }))).toMatchObject({ type: "terminal.resize" });
    expect(parseRelayJson(JSON.stringify({ type: "terminal.resize", cols: 0, rows: 30 }))).toBeNull();
  });
  it("rejects unknown or oversized control frames", () => {
    expect(parseRelayJson(JSON.stringify({ type: "terminal.exec", command: "whoami" }))).toBeNull();
    expect(parseRelayJson("x".repeat(MAX_RELAY_JSON_BYTES + 1))).toBeNull();
  });
  it("round-trips tagged binary terminal output", () => {
    const frame = encodeTerminalOutput("hola ✓");
    expect(new Uint8Array(frame)[0]).toBe(BINARY_TERMINAL_OUTPUT);
    expect(decodeTerminalOutput(frame)).toBe("hola ✓");
    expect(decodeTerminalOutput(new Uint8Array([2, 1]).buffer)).toBeNull();
  });
  it("binds short-lived tickets to a session", async () => {
    const ticket = await createBrowserTicket(session, "test-secret", 1_000, 60);
    await expect(verifyBrowserTicket(ticket, "test-secret", 1_059)).resolves.toBe(session);
    await expect(verifyBrowserTicket(ticket, "wrong-secret", 1_059)).resolves.toBeNull();
    await expect(verifyBrowserTicket(ticket, "test-secret", 1_061)).resolves.toBeNull();
  });
  it("mints distinct OTP-authorized tickets for the one configured relay session", async () => {
    const relaySession = "r".repeat(32);
    const firstOtpTokenHash = "a".repeat(64);
    const secondOtpTokenHash = "b".repeat(64);
    const db = { prepare: () => ({ bind: () => ({ all: async () => ({ results: [{ id: 1 }] }) }) }) };
    const env = { ANALYTICS_DB: db, CONSOLE_SESSION_SECRET: "session-secret", CONSOLE_RELAY_TICKET_SECRET: "test-secret", CONSOLE_RELAY_URL: "wss://relay.example.test/relay", CONSOLE_RELAY_SESSION_ID: relaySession };
    const getTicket = async (token: string) => {
      const request = new Request("https://pages.example.test/api/consola/relay-ticket", { method: "POST", headers: { Origin: "https://pages.example.test", Cookie: `fh_console_session=${token}` } });
      const response = await relayTicket({ request, env });
      expect(response.status).toBe(200);
      return response.json() as Promise<{ url: string; ticket: string }>;
    };
    const [first, second] = await Promise.all([getTicket("first-otp-session"), getTicket("second-otp-session")]);
    expect(new URL(first.url).searchParams.get("session")).toBe(relaySession);
    expect(new URL(second.url).searchParams.get("session")).toBe(relaySession);
    expect(first.ticket).not.toBe(second.ticket);
    expect(`${first.url}.${first.ticket}`).not.toContain(firstOtpTokenHash);
    expect(`${second.url}.${second.ticket}`).not.toContain(secondOtpTokenHash);
  });
});
