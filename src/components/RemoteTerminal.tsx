import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { controlFrame, terminalInputFrames, validBinaryTerminalOutput } from "../lib/console-relay-client";

type RelayTicket = { url: string; ticket: string };
type ConnectionState = "connecting" | "online" | "offline" | "error";
export default function RemoteTerminal() {
  const hostRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const disposeRef = useRef<{ dispose(): void } | null>(null);
  const retryRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const openedRef = useRef(false);
  const sessionIdRef = useRef("");
  const [state, setState] = useState<ConnectionState>("connecting");
  const [detail, setDetail] = useState("Solicitando acceso al relayâ€¦");
  const [project, setProject] = useState("federico-home");
  const [agent, setAgent] = useState("powershell");

  const openTerminal = useCallback(() => {
    const socket = socketRef.current;
    const terminal = terminalRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || !openedRef.current || !terminal || !/^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/.test(project)) return;
    const frame = controlFrame({ type: "terminal.open", request_id: crypto.randomUUID().replaceAll("-", ""), project, agent, cols: terminal.cols, rows: terminal.rows });
    if (!frame) { setDetail("La solicitud de apertura supera el lÃ­mite del relay."); return; }
    socket.send(frame); setDetail(`Abriendo ${project} con ${agent}â€¦`);
  }, [agent, project]);

  useEffect(() => {
    stoppedRef.current = false;
    if (!hostRef.current) return;
    const terminal = new Terminal({
      cursorBlink: true, convertEol: true, fontFamily: "'Fragment Mono', monospace", fontSize: 13,
      theme: { background: "#0B0D0C", foreground: "#FDFBF7", cursor: "#C9A86A" },
    });
    terminal.open(hostRef.current);
    const fit = new FitAddon(); terminal.loadAddon(fit); fit.fit();
    terminalRef.current = terminal;
    const resize = () => {
      fit?.fit();
      const socket = socketRef.current;
      if (socket?.readyState === WebSocket.OPEN && openedRef.current && sessionIdRef.current) {
        const frame = controlFrame({ type: "terminal.resize", session_id: sessionIdRef.current, cols: terminal.cols, rows: terminal.rows });
        if (frame) socket.send(frame);
      }
    };
    const observer = new ResizeObserver(resize); observer.observe(hostRef.current);
    disposeRef.current = terminal.onData((data) => {
      const socket = socketRef.current;
      if (socket?.readyState === WebSocket.OPEN && openedRef.current && sessionIdRef.current) {
        const frames = terminalInputFrames(sessionIdRef.current, data);
        if (!frames) { setDetail("Entrada demasiado extensa para el relay."); return; }
        frames.forEach((frame) => socket.send(frame));
      }
    });

    let attempts = 0;
    const connect = async () => {
      if (stoppedRef.current) return;
      setState("connecting"); setDetail("Conectando al relayâ€¦"); openedRef.current = false;
      try {
        const response = await fetch("/api/consola/relay-ticket", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" });
        if (!response.ok) throw new Error(response.status === 401 ? "La sesiÃ³n expirÃ³." : "No pude obtener acceso al relay.");
        const relay = await response.json() as RelayTicket;
        const ws = new WebSocket(relay.url); socketRef.current = ws; ws.binaryType = "arraybuffer";
        ws.onopen = () => ws.send(JSON.stringify({ type: "hello", v: 1, role: "browser", session: new URL(relay.url).searchParams.get("session"), ticket: relay.ticket }));
        ws.onmessage = (event) => {
          if (typeof event.data !== "string") {
            if (!validBinaryTerminalOutput(event.data)) { ws.close(1008, "invalid binary relay frame"); return; }
            terminal.write(new Uint8Array(event.data).slice(1)); return;
          }
          try {
            const message = JSON.parse(event.data) as { type?: string; data?: string; message?: string; session_id?: string };
            if (message.type === "pong" && !openedRef.current) {
              openedRef.current = true; attempts = 0; setState("online"); setDetail("Relay conectado. ElegÃ­ proyecto y agente."); terminal.focus();
            } else if (message.type === "terminal.open" && message.session_id) {
              sessionIdRef.current = message.session_id; setDetail("Terminal local conectada."); resize(); terminal.focus();
            } else if (message.type === "terminal.output" && typeof message.data === "string") terminal.write(message.data);
            else if (message.type === "terminal.exit") { sessionIdRef.current = ""; terminal.write("\r\n[terminal finalizada]\r\n"); setState("online"); setDetail("Terminal finalizada. PodÃ©s abrir otra."); }
            else if (message.type === "error") { setState("error"); setDetail(message.message || "El relay rechazÃ³ la operaciÃ³n."); }
          } catch { ws.close(1008, "invalid relay response"); }
        };
        ws.onerror = () => setDetail("La conexiÃ³n al relay fallÃ³.");
        ws.onclose = () => {
          if (stoppedRef.current) return;
          openedRef.current = false; setState("offline"); setDetail("Relay desconectado; reintentandoâ€¦");
          sessionIdRef.current = "";
          attempts += 1; retryRef.current = window.setTimeout(connect, Math.min(1_000 * 2 ** Math.min(attempts, 4), 10_000));
        };
      } catch (error) {
        setState("error"); setDetail(error instanceof Error ? error.message : "No pude conectar al relay.");
      }
    };
    void connect();
    return () => {
      stoppedRef.current = true; if (retryRef.current) window.clearTimeout(retryRef.current); observer.disconnect(); disposeRef.current?.dispose(); socketRef.current?.close(1000, "page closed"); terminal.dispose(); terminalRef.current = null;
    };
  }, []);

  return <section className="mt-7" aria-label="Terminal remota">
    <div className="mb-3 flex items-center justify-between gap-3 text-xs text-stone"><span>{detail}</span><span className={state === "online" ? "text-emerald-400" : state === "error" ? "text-red-400" : "text-amber-300"}>{state.toUpperCase()}</span></div>
    <div className="mb-3 grid gap-2 sm:grid-cols-[1fr_10rem_auto]"><label className="sr-only" htmlFor="remote-project">Proyecto</label><input id="remote-project" value={project} onChange={(event) => setProject(event.target.value.slice(0, 128))} className="rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper" placeholder="Proyecto" /><label className="sr-only" htmlFor="remote-agent">Agente</label><select id="remote-agent" value={agent} onChange={(event) => setAgent(event.target.value)} className="rounded border border-white/15 bg-white/5 px-3 py-2 text-sm text-paper"><option value="powershell">PowerShell</option><option value="kilo">Kilo</option><option value="opencode">OpenCode</option><option value="codex">Codex</option><option value="antigravity">Antigravity</option></select><button type="button" onClick={openTerminal} disabled={state !== "online" || Boolean(sessionIdRef.current)} className="rounded bg-white px-4 py-2 text-sm font-medium text-ink disabled:opacity-50">Abrir terminal</button></div>
    <div ref={hostRef} className="min-h-72 overflow-hidden rounded border border-white/15 bg-[#0B0D0C] p-2" />
    <p className="mt-3 text-xs leading-relaxed text-stone">Esta vista sÃ³lo retransmite entrada y salida. El PTY continÃºa en Agent Console local.</p>
  </section>;
}
