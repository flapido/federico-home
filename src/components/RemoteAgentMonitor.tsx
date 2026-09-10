import { useCallback, useEffect, useRef, useState } from "react";
import { controlFrame, monitorListFrame, monitorReadFrame, MAX_MONITOR_READ_CHARS } from "../lib/console-relay-client";

type MonitorState =
  | "WORKING"
  | "QUIET_WORKING"
  | "WAITING_INPUT"
  | "POSSIBLE_STALL"
  | "DEAD_SESSION"
  | "COMPLETED"
  | "FAILED"
  | "INTERRUPTED"
  | "OUTPUT_LIMIT"
  | "NEEDS_CONTINUE";

type MonitorTask = {
  task_id: string;
  session_id: string;
  project: string;
  agent: string;
  status: string;
  monitor_state: MonitorState;
  started_at: string;
  updated_at: string;
  last_output_at: string | null;
  last_progress_at: string | null;
  output_sequence: number;
  continuation_count: number;
  files_changed_recently: boolean;
  cpu_activity: string;
  pid: number | null;
  duration_ms: number;
  branch: string | null;
  read_only: boolean;
  recommended_action: string;
  process_alive: boolean;
  session_alive: boolean;
  current_activity: string | null;
  last_output: string;
};

type MonitorReadResult = {
  session_id: string;
  cursor: number;
  next_cursor: number;
  output: string;
  truncated: boolean;
  running: boolean;
};

type ConnectionState = "connecting" | "online" | "offline" | "error";

type Props = {
  pcOnline: boolean;
  agentOnline: boolean;
};

const MONITOR_STATE_LABELS: Record<MonitorState, string> = {
  WORKING: "Trabajando",
  QUIET_WORKING: "Trabajando (silencioso)",
  WAITING_INPUT: "Esperando entrada",
  POSSIBLE_STALL: "Posible estancamiento",
  DEAD_SESSION: "Sesión muerta",
  COMPLETED: "Completado",
  FAILED: "Fallido",
  INTERRUPTED: "Interrumpido",
  OUTPUT_LIMIT: "Límite de salida",
  NEEDS_CONTINUE: "Requiere continuación",
};

const MONITOR_STATE_COLORS: Record<MonitorState, string> = {
  WORKING: "bg-emerald-500",
  QUIET_WORKING: "bg-teal-500",
  WAITING_INPUT: "bg-amber-500",
  POSSIBLE_STALL: "bg-orange-500",
  DEAD_SESSION: "bg-red-500",
  COMPLETED: "bg-slate-500",
  FAILED: "bg-red-600",
  INTERRUPTED: "bg-fuchsia-500",
  OUTPUT_LIMIT: "bg-amber-600",
  NEEDS_CONTINUE: "bg-blue-500",
};

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${totalSeconds % 60}s`;
  return `${totalSeconds}s`;
}

function formatAge(dateString: string | null): string {
  if (!dateString) return "—";
  try {
    const diff = Date.now() - new Date(dateString).getTime();
    if (diff < 0) return "—";
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `hace ${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `hace ${hours}h`;
  } catch {
    return "—";
  }
}

function MonitorStateBadge({ state }: { state: MonitorState }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-[11px] font-mono font-medium ${MONITOR_STATE_COLORS[state]} text-white`}
      title={state}
    >
      {MONITOR_STATE_LABELS[state]}
    </span>
  );
}

function AgentCard({
  task,
  onViewOutput,
  isExpanded,
  output,
  outputCursor,
  outputLoading,
}: {
  task: MonitorTask;
  onViewOutput: () => void;
  isExpanded: boolean;
  output: string;
  outputCursor: number;
  outputLoading: boolean;
}) {
  const duration = formatDuration(task.duration_ms);
  const lastOutputAge = formatAge(task.last_output_at);
  const lastProgressAge = formatAge(task.last_progress_at);

  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Proyecto</span>
            <span className="font-medium text-white truncate max-w-[200px] sm:max-w-none">{task.project}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Agente</span>
            <span className="font-medium text-white capitalize">{task.agent}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          <MonitorStateBadge state={task.monitor_state} />
          <span className="font-mono text-[11px] text-stone whitespace-nowrap">{duration}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        <div>
          <span className="font-mono uppercase tracking-[.14em] text-stone">Estado tarea</span>
          <span className="block font-medium text-white mt-0.5">{task.status}</span>
        </div>
        <div>
          <span className="font-mono uppercase tracking-[.14em] text-stone">Última salida</span>
          <span className="block font-medium text-white mt-0.5">{lastOutputAge}</span>
        </div>
        <div>
          <span className="font-mono uppercase tracking-[.14em] text-stone">Progreso</span>
          <span className="block font-medium text-white mt-0.5">{lastProgressAge}</span>
        </div>
        <div>
          <span className="font-mono uppercase tracking-[.14em] text-stone">PID</span>
          <span className="block font-medium text-white mt-0.5">{task.pid ?? "—"}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Proceso:</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${task.process_alive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
          {task.process_alive ? "activo" : "inactivo"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">PTY:</span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono ${task.session_alive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
          {task.session_alive ? "activo" : "inactivo"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone ml-auto">READ ONLY</span>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">Task ID</span><span className="block font-mono text-white/70 truncate">{task.task_id}</span></div>
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">Session ID</span><span className="block font-mono text-white/70 truncate">{task.session_id}</span></div>
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">Secuencia</span><span className="block font-mono text-white/70">{task.output_sequence}</span></div>
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">Continuaciones</span><span className="block font-mono text-white/70">{task.continuation_count}</span></div>
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">Archivos recientes</span><span className="block font-mono text-white/70">{task.files_changed_recently ? "sí" : "no"}</span></div>
            <div><span className="font-mono uppercase tracking-[.14em] text-stone">CPU</span><span className="block font-mono text-white/70">{task.cpu_activity}</span></div>
            <div className="sm:col-span-2"><span className="font-mono uppercase tracking-[.14em] text-stone">Rama</span><span className="block font-mono text-white/70">{task.branch ?? "—"}</span></div>
            <div className="sm:col-span-2"><span className="font-mono uppercase tracking-[.14em] text-stone">Acción recomendada</span><span className="block font-mono text-white/70">{task.recommended_action}</span></div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Salida reciente (cursor: {outputCursor})</span>
              <span className="font-mono text-[10px] text-stone">{outputLoading ? "Cargando…" : `${output.length} chars`}</span>
            </div>
            <pre className="rounded bg-black/40 p-3 overflow-x-auto max-h-64 sm:max-h-96 font-mono text-[11px] leading-relaxed text-white/80 whitespace-pre-wrap break-all">
              {output || <span className="text-stone">(sin salida reciente)</span>}
            </pre>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onViewOutput}
        className="mt-3 w-full sm:w-auto rounded-full bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Ocultar salida" : "Ver salida"}
      </button>
    </article>
  );
}

export default function RemoteAgentMonitor({ pcOnline, agentOnline }: Props) {
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);
  const requestIdCounter = useRef(0);
  const pendingRequests = useRef<Map<string, (value: unknown) => void>>(new Map());

  const [state, setState] = useState<ConnectionState>("connecting");
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);
  const [detail, setDetail] = useState("Conectando al relay…");
  const [tasks, setTasks] = useState<MonitorTask[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [outputCursor, setOutputCursor] = useState(0);
  const [outputLoading, setOutputLoading] = useState(false);

  const generateRequestId = useCallback(() => {
    return `req_${++requestIdCounter.current}_${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  const send = useCallback((frame: string | null) => {
    const socket = socketRef.current;
    if (socket?.readyState === WebSocket.OPEN && frame) {
      socket.send(frame);
      return true;
    }
    return false;
  }, []);

  const waitForResponse = useCallback((requestId: string, timeoutMs = 5000): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        pendingRequests.current.delete(requestId);
        reject(new Error("Timeout waiting for response"));
      }, timeoutMs);
      pendingRequests.current.set(requestId, (value) => {
        window.clearTimeout(timer);
        resolve(value);
      });
    });
  }, []);

  const refreshList = useCallback(async () => {
    const requestId = generateRequestId();
    const frame = monitorListFrame(requestId);
    if (!send(frame)) return;
    try {
      const response = await waitForResponse(requestId);
      if (response && typeof response === "object" && "tasks" in response) {
        const tasksData = (response as { tasks: MonitorTask[] }).tasks;
        setTasks(tasksData);
      }
    } catch {
      // Ignore individual refresh failures
    }
  }, [generateRequestId, send, waitForResponse]);

  const refreshListRef = useRef(refreshList);
  useEffect(() => { refreshListRef.current = refreshList; }, [refreshList]);

  const fetchTaskOutput = useCallback(async (task: MonitorTask) => {
    if (state !== "online") return;
    setOutputLoading(true);
    setOutput("");
    setOutputCursor(0);
    const requestId = generateRequestId();
    const frame = monitorReadFrame(task.session_id, 0, MAX_MONITOR_READ_CHARS, requestId);
    if (!send(frame)) {
      setOutputLoading(false);
      return;
    }
    try {
      const response = await waitForResponse(requestId);
      if (response && typeof response === "object" && "result" in response) {
        const result = (response as { result: MonitorReadResult }).result;
        setOutput(result.output);
        setOutputCursor(result.next_cursor);
      }
    } catch {
      setOutput("Error al cargar la salida.");
    } finally {
      setOutputLoading(false);
    }
  }, [state, generateRequestId, send, waitForResponse]);

  const handleViewOutput = useCallback((task: MonitorTask) => {
    if (expandedTaskId === task.task_id) {
      setExpandedTaskId(null);
      setOutput("");
      setOutputCursor(0);
    } else {
      setExpandedTaskId(task.task_id);
      fetchTaskOutput(task);
    }
  }, [expandedTaskId, fetchTaskOutput]);

  useEffect(() => {
    stoppedRef.current = false;
    let attempts = 0;

    const connect = async () => {
      if (stoppedRef.current) return;
      try {
        const response = await fetch("/api/consola/relay-ticket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
        });
        if (!response.ok) throw new Error(response.status === 401 ? "La sesión expiró." : "No pude obtener acceso al relay.");
        const relay = (await response.json()) as { url: string; ticket: string };
        const session = new URL(relay.url).searchParams.get("session");
        if (!session) throw new Error("El relay no devolvió una sesión válida.");
        const ws = new WebSocket(relay.url);
        socketRef.current = ws;
        ws.binaryType = "arraybuffer";

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "hello", v: 1, role: "browser-monitor", session, ticket: relay.ticket }));
        };

        ws.onmessage = (event) => {
          if (typeof event.data !== "string") return;
          try {
            const message = JSON.parse(event.data) as { type?: string; request_id?: string; tasks?: MonitorTask[]; task?: MonitorTask; result?: MonitorReadResult; message?: string; code?: string; at?: number };
            if (message.type === "ping") {
              const frame = controlFrame({ type: "pong", at: message.at ?? Date.now() });
              if (frame && ws.readyState === WebSocket.OPEN) ws.send(frame);
              return;
            }
            if (message.type === "pong") {
              if (stateRef.current !== "online") {
                setState("online");
                setDetail("Relay conectado. Cargando agentes…");
                refreshListRef.current();
              }
              return;
            }
            const requestId = message.request_id;
            if (requestId && pendingRequests.current.has(requestId)) {
              const resolver = pendingRequests.current.get(requestId)!;
              pendingRequests.current.delete(requestId);
              resolver(message);
              return;
            }
            if (message.type === "error") {
              setDetail(message.message || `Error: ${message.code}`);
              setState("error");
            }
          } catch {
            ws.close(1008, "invalid relay response");
          }
        };

        ws.onerror = () => setDetail("La conexión al relay falló.");
        ws.onclose = () => {
          if (stoppedRef.current) return;
          setState("offline");
          setDetail("Relay desconectado; reintentando…");
          attempts += 1;
          retryRef.current = window.setTimeout(connect, Math.min(1_000 * 2 ** Math.min(attempts, 4), 10_000));
        };
      } catch (err) {
        setState("error");
        setDetail(err instanceof Error ? err.message : "No pude conectar al relay.");
      }
    };

    void connect();
    return () => {
      stoppedRef.current = true;
      if (retryRef.current) window.clearTimeout(retryRef.current);
      socketRef.current?.close(1000, "page closed");
      socketRef.current = null;
    };
  }, []);

  const emptyState = (
    <div className="remote-monitor-empty" aria-live="polite">
      <div className="text-center py-12 sm:py-16">
        <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <svg className="h-8 w-8 text-stone" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Sin agentes activos</h3>
        <p className="mt-1 text-sm text-stone max-w-xs mx-auto">No hay tareas observables en este momento.</p>
        {state === "offline" && <p className="mt-3 text-sm text-amber-400">Relay desconectado. Reintentando…</p>}
        {state === "error" && <p className="mt-3 text-sm text-red-400">{detail || "Error de conexión"}</p>}
      </div>
    </div>
  );

  return (
    <section className="remote-monitor-shell" aria-label="Monitor de agentes remoto">
      <header className="remote-monitor-toolbar" aria-label="Controles de monitor">
        <div className="flex items-center gap-3">
          <span className="remote-monitor-brand">
            <span aria-hidden="true">◈</span> Agentes Activos
          </span>
          <span className="remote-monitor-divider" aria-hidden="true">|</span>
          <span className={`remote-monitor-status ${state === "online" ? "is-online" : state === "error" ? "is-error" : ""}`} title={detail} aria-live="polite">
            ● <span className="sr-only">{detail}</span>
          </span>
          <span className="remote-monitor-spacer" />
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.14em] text-stone">
          <span>PC {pcOnline ? "ONLINE" : "OFFLINE"}</span>
          <span aria-hidden="true">·</span>
          <span>Agent Console {agentOnline ? "ONLINE" : "OFFLINE"}</span>
          <span aria-hidden="true">·</span>
          <span>{state.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={refreshList}
            disabled={state !== "online"}
            className="remote-monitor-button"
            aria-label="Actualizar lista"
            title="Actualizar"
          >
            ⟳
          </button>
        </div>
      </header>

      <nav className="remote-monitor-tabs" role="tablist" aria-label="Vista">
        <button type="button" role="tab" aria-selected="true" className="remote-monitor-tab">
          Lista ({tasks.length})
        </button>
      </nav>

      <div className="remote-monitor-stage">
        {tasks.length === 0 ? emptyState : (
          <div className="remote-monitor-grid" role="list" aria-label="Agentes activos">
            {tasks.map((task) => (
              <AgentCard
                key={task.task_id}
                task={task}
                onViewOutput={() => handleViewOutput(task)}
                isExpanded={expandedTaskId === task.task_id}
                output={output}
                outputCursor={outputCursor}
                outputLoading={outputLoading}
              />
            ))}
          </div>
        )}
      </div>

      <p className="remote-monitor-note">Monitor READ ONLY / SOLO LECTURA — El PTY permanece únicamente en Agent Console local.</p>
    </section>
  );
}