import { FitAddon } from "@xterm/addon-fit";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";
import { useCallback, useEffect, useRef, useState } from "react";
import { controlFrame, terminalInputFrames, validBinaryTerminalOutput } from "../lib/console-relay-client";

type RelayTicket = { url: string; ticket: string };
type ConnectionState = "connecting" | "online" | "offline" | "error";
type Props = { pcOnline: boolean; agentOnline: boolean };
const agentOptions = ["kilo", "opencode", "codex", "antigravity"] as const;

export default function RemoteTerminal({ pcOnline, agentOnline }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const disposeRef = useRef<{ dispose(): void } | null>(null);
  const retryRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const openedRef = useRef(false);
  const sessionIdRef = useRef("");
  const [state, setState] = useState<ConnectionState>("connecting");
  const [detail, setDetail] = useState("Solicitando acceso al relay…");
  const [project, setProject] = useState("federico-home");
  const [agent, setAgent] = useState("powershell");
  const [terminalActive, setTerminalActive] = useState(false);

  const openTerminal = useCallback(() => {
    const socket = socketRef.current;
    const terminal = terminalRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || !openedRef.current || !terminal || !/^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/.test(project)) return;
    const frame = controlFrame({ type: "terminal.open", request_id: crypto.randomUUID().replaceAll("-", ""), project, agent, cols: terminal.cols, rows: terminal.rows });
    if (!frame) { setDetail("La solicitud de apertura supera el límite del relay."); return; }
    socket.send(frame); setDetail(`Abriendo ${project} con ${agent}…`);
  }, [agent, project]);

  const closeTerminal = useCallback(() => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN || !sessionIdRef.current) return;
    const frame = controlFrame({ type: "terminal.exit", request_id: crypto.randomUUID().replaceAll("-", ""), session_id: sessionIdRef.current });
    if (frame) socket.send(frame);
    setDetail("Cerrando terminal…");
  }, []);

  useEffect(() => {
    stoppedRef.current = false;
    if (!hostRef.current) return;
    const terminal = new Terminal({ cursorBlink: true, convertEol: true, fontFamily: "'Fragment Mono', monospace", fontSize: 13, theme: { background: "#0b0f17", foreground: "#d6e1f2", cursor: "#5b8def" } });
    terminal.open(hostRef.current);
    const fit = new FitAddon(); terminal.loadAddon(fit); fit.fit(); terminalRef.current = terminal;
    const resize = () => {
      fit.fit(); const socket = socketRef.current;
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
      setState("connecting"); setDetail("Conectando al relay…"); openedRef.current = false;
      try {
        const response = await fetch("/api/consola/relay-ticket", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "same-origin" });
        if (!response.ok) throw new Error(response.status === 401 ? "La sesión expiró." : "No pude obtener acceso al relay.");
        const relay = await response.json() as RelayTicket;
        const session = new URL(relay.url).searchParams.get("session");
        if (!session) throw new Error("El relay no devolvió una sesión válida.");
        const ws = new WebSocket(relay.url); socketRef.current = ws; ws.binaryType = "arraybuffer";
        ws.onopen = () => ws.send(JSON.stringify({ type: "hello", v: 1, role: "browser", session, ticket: relay.ticket }));
        ws.onmessage = (event) => {
          if (typeof event.data !== "string") {
            if (!validBinaryTerminalOutput(event.data)) { ws.close(1008, "invalid binary relay frame"); return; }
            terminal.write(new Uint8Array(event.data).slice(1)); return;
          }
          try {
            const message = JSON.parse(event.data) as { type?: string; data?: string; message?: string; session_id?: string; at?: number };
            // The Worker closes idle peers after 75s. The original UI accepted
            // its ping silently, leaving authorized remote consoles to die.
            if (message.type === "ping") {
              const frame = controlFrame({ type: "pong", at: message.at ?? Date.now() });
              if (frame && ws.readyState === WebSocket.OPEN) ws.send(frame);
            } else if (message.type === "pong" && !openedRef.current) {
              openedRef.current = true; attempts = 0; setState("online"); setDetail("Relay conectado. Elegí proyecto y agente."); terminal.focus();
            } else if (message.type === "terminal.open" && message.session_id) {
              sessionIdRef.current = message.session_id; setTerminalActive(true); setDetail("Terminal local conectada."); resize(); terminal.focus();
            } else if (message.type === "terminal.output" && typeof message.data === "string") terminal.write(message.data);
            else if (message.type === "terminal.exit") { sessionIdRef.current = ""; setTerminalActive(false); terminal.write("\r\n[terminal finalizada]\r\n"); setState("online"); setDetail("Terminal finalizada. Podés abrir otra."); }
            else if (message.type === "error") { setState("error"); setDetail(message.message || "El relay rechazó la operación."); }
          } catch { ws.close(1008, "invalid relay response"); }
        };
        ws.onerror = () => setDetail("La conexión al relay falló.");
        ws.onclose = () => {
          if (stoppedRef.current) return;
          openedRef.current = false; sessionIdRef.current = ""; setTerminalActive(false); setState("offline"); setDetail("Relay desconectado; reintentando…");
          attempts += 1; retryRef.current = window.setTimeout(connect, Math.min(1_000 * 2 ** Math.min(attempts, 4), 10_000));
        };
      } catch (error) { setState("error"); setDetail(error instanceof Error ? error.message : "No pude conectar al relay."); }
    };
    void connect();
    return () => { stoppedRef.current = true; if (retryRef.current) window.clearTimeout(retryRef.current); observer.disconnect(); disposeRef.current?.dispose(); socketRef.current?.close(1000, "page closed"); terminal.dispose(); terminalRef.current = null; };
  }, []);

  return <section className="remote-console-shell" aria-label="Terminal remota">
    <header className="remote-console-toolbar" aria-label="Controles de consola">
      <span className="remote-console-brand"><span aria-hidden="true">&gt;_</span> Agent Console</span><span className="remote-console-divider" aria-hidden="true">|</span>
      <label className="remote-console-project"><span className="sr-only">Proyecto</span><input id="remote-project" value={project} onChange={(event) => setProject(event.target.value.slice(0, 128))} disabled={terminalActive} aria-label="Proyecto" placeholder="Proyecto" /></label>
      <button type="button" onClick={openTerminal} disabled={state !== "online" || terminalActive} className="remote-console-button remote-console-primary">+<span className="remote-console-button-label"> Nueva</span></button><span className="remote-console-divider" aria-hidden="true">|</span>
      <div className="remote-console-agents" role="group" aria-label="Agente para la nueva terminal">
        {agentOptions.map((option) => <button key={option} type="button" onClick={() => setAgent(option)} disabled={terminalActive} aria-pressed={agent === option} className="remote-console-button">{option === "opencode" ? "OpenCode" : option === "antigravity" ? "Antigravity" : option[0].toUpperCase() + option.slice(1)}</button>)}
      </div><span className="remote-console-spacer" />
      <button type="button" onClick={closeTerminal} disabled={!terminalActive} className="remote-console-button" aria-label="Cerrar terminal">×</button><span className={`remote-console-status ${state === "online" ? "is-online" : state === "error" ? "is-error" : ""}`} title={detail} aria-live="polite">●<span className="sr-only"> {detail}</span></span>
    </header>
    <nav className="remote-console-tabs" role="tablist" aria-label="Sesiones"><button type="button" role="tab" aria-selected="true" className="remote-console-tab">{terminalActive ? `${project} · ${agent}` : "Nueva sesión"}</button><span className="remote-console-connection">PC {pcOnline ? "ONLINE" : "OFFLINE"} · Agent Console {agentOnline ? "ONLINE" : "OFFLINE"} · {state.toUpperCase()}</span></nav>
    <div className="remote-console-stage"><div ref={hostRef} className="remote-console-terminal" />{!terminalActive && <div className="remote-console-empty" aria-live="polite"><strong>{detail}</strong><span>Elegí un agente y tocá Nueva para abrir una terminal.</span></div>}</div>
    <p className="remote-console-note">Relay WSS activo: el PTY sigue únicamente en Agent Console local.</p>
  </section>;
}
