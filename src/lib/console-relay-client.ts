export const MAX_RELAY_CONTROL_BYTES = 16 * 1024;
export const MAX_RELAY_BINARY_BYTES = 64 * 1024;
export const MAX_MONITOR_READ_CHARS = 32768;
export const BINARY_TERMINAL_OUTPUT = 1;

const encoder = new TextEncoder();
export const byteLength = (value: string) => encoder.encode(value).byteLength;

export function controlFrame(value: Record<string, unknown>) {
  const encoded = JSON.stringify(value);
  return byteLength(encoded) <= MAX_RELAY_CONTROL_BYTES ? encoded : null;
}

/** Splits by Unicode code point and verifies the complete JSON envelope. */
export function terminalInputFrames(sessionId: string, data: string) {
  const frames: string[] = [];
  let chunk = "";
  for (const character of data) {
    const candidate = chunk + character;
    if (controlFrame({ type: "terminal.input", session_id: sessionId, data: candidate })) { chunk = candidate; continue; }
    if (!chunk) return null;
    frames.push(controlFrame({ type: "terminal.input", session_id: sessionId, data: chunk })!);
    chunk = character;
    if (!controlFrame({ type: "terminal.input", session_id: sessionId, data: chunk })) return null;
  }
  if (chunk) frames.push(controlFrame({ type: "terminal.input", session_id: sessionId, data: chunk })!);
  return frames;
}

export function validBinaryTerminalOutput(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer && value.byteLength >= 2 && value.byteLength <= MAX_RELAY_BINARY_BYTES && new Uint8Array(value)[0] === BINARY_TERMINAL_OUTPUT;
}

export function monitorListFrame(requestId?: string) {
  return controlFrame({ type: "monitor.list", ...(requestId ? { request_id: requestId } : {}) });
}

export function monitorGetFrame(taskId: string, requestId?: string) {
  return controlFrame({ type: "monitor.get", task_id: taskId, ...(requestId ? { request_id: requestId } : {}) });
}

export function monitorReadFrame(sessionId: string, cursor: number, maxChars: number, requestId?: string) {
  return controlFrame({ type: "monitor.read", session_id: sessionId, cursor, max_chars: maxChars, ...(requestId ? { request_id: requestId } : {}) });
}
