import { describe, expect, it } from "vitest";
import { OTP_TTL_SECONDS, SESSION_TTL_SECONDS, constantTimeEqual, expiredSessionCookie, randomOtp, randomToken, sessionCookie } from "../../functions/_lib/admin-auth";

describe("admin OTP primitives", () => {
  it("creates six-digit one-time codes with the configured short lifetime", () => {
    expect(randomOtp()).toMatch(/^\d{6}$/);
    expect(OTP_TTL_SECONDS).toBe(300);
  });

  it("creates high-entropy session tokens and secure cookie attributes", () => {
    const token = randomToken();
    expect(token.length).toBeGreaterThan(40);
    expect(sessionCookie(token)).toContain("HttpOnly; Secure; SameSite=Strict; Path=/");
    expect(sessionCookie(token)).toContain(`Max-Age=${SESSION_TTL_SECONDS}`);
    expect(expiredSessionCookie()).toContain("Max-Age=0");
  });

  it("compares hashes without accepting unequal values", () => {
    expect(constantTimeEqual("a".repeat(64), "a".repeat(64))).toBe(true);
    expect(constantTimeEqual("a".repeat(64), "b".repeat(64))).toBe(false);
    expect(constantTimeEqual("short", "longer")).toBe(false);
  });
});
