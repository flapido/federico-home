import { expect, test } from "vitest";
import { BINARY_TERMINAL_OUTPUT, MAX_RELAY_CONTROL_BYTES, terminalInputFrames, validBinaryTerminalOutput } from "../lib/console-relay-client";

test("input chunks always fit the complete relay JSON frame", () => {
  const frames = terminalInputFrames("local-session-1", "✓".repeat(20_000));
  expect(frames).not.toBeNull();
  expect(frames).toHaveLength(4);
  expect(frames!.every((frame) => new TextEncoder().encode(frame).byteLength <= MAX_RELAY_CONTROL_BYTES)).toBe(true);
});

test("only accepts the bounded tagged binary output frame", () => {
  expect(validBinaryTerminalOutput(new Uint8Array([BINARY_TERMINAL_OUTPUT, 65]).buffer)).toBe(true);
  expect(validBinaryTerminalOutput(new Uint8Array([2, 65]).buffer)).toBe(false);
  expect(validBinaryTerminalOutput(new Uint8Array([BINARY_TERMINAL_OUTPUT]).buffer)).toBe(false);
});
