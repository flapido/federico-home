import { describe, expect, it } from "vitest";
import {
  CONSOLE_OTP_TTL_SECONDS,
  CONSOLE_SESSION_TTL_SECONDS,
  constantTimeEqual,
  randomOtp,
  randomToken,
  sessionCookie,
} from "../../functions/_lib/console-auth";

describe("console OTP primitives", () => {
  it("creates six-digit one-time codes with the configured short lifetime", () => {
    expect(randomOtp()).toMatch(/^\d{6}$/);
    expect(CONSOLE_OTP_TTL_SECONDS).toBe(300);
  });

  it("creates high-entropy session tokens and secure cookie attributes", () => {
    const token = randomToken();
    expect(token.length).toBeGreaterThan(40);
    expect(sessionCookie(token)).toContain("HttpOnly; Secure; SameSite=Strict; Path=/");
    expect(sessionCookie(token)).toContain(`Max-Age=${CONSOLE_SESSION_TTL_SECONDS}`);
  });

  it("compares hashes without accepting unequal values", () => {
    expect(constantTimeEqual("a".repeat(64), "a".repeat(64))).toBe(true);
    expect(constantTimeEqual("a".repeat(64), "b".repeat(64))).toBe(false);
    expect(constantTimeEqual("short", "longer")).toBe(false);
  });
});
