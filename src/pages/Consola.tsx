import { useEffect, useRef, useState } from "react";
import RemoteTerminal from "../components/RemoteTerminal";
import RemoteAgentMonitor from "../components/RemoteAgentMonitor";

type ConsoleStatus = {
  pc_online: boolean;
  agent_console_online: boolean;
  last_seen: string | null;
  pc_id: string | null;
  platform: string | null;
};

type AuthState = "idle" | "pending" | "sent" | "authorized" | "expired" | "error";

type ViewMode = "terminal" | "monitor";

const request = (path: string, init?: RequestInit) =>
  fetch(path, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) }, credentials: "same-origin" });

function ConsolePage() {
  const [status, setStatus] = useState<ConsoleStatus | null>(null);
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("terminal");
  const lastActivityRef = useRef(0);
  const statusTimer = useRef<number | null>(null);
  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  const pcOnline = status?.pc_online ?? false;
  const agentOnline = status?.agent_console_online ?? false;

  // A refresh keeps the HttpOnly Phase 1 cookie private while restoring UI state.
  useEffect(() => {
    void fetch("/api/consola/session", { credentials: "same-origin" })
      .then((response) => { if (response.ok) setAuthState("authorized"); })
      .catch(() => undefined);
  }, []);

  // Idle timeout: 1 hour
  useEffect(() => {
    if (authState !== "authorized") {
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      return;
    }
    const resetIdle = () => {
      lastActivityRef.current = Date.now();
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => {
        setAuthState("expired");
      }, 60 * 60 * 1000);
    };
    resetIdle();
    const events = ["mousedown", "keydown", "touchstart", "scroll"] as const;
    const handler = () => resetIdle();
    events.forEach((e) => document.addEventListener(e, handler));
    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [authState]);

  // Poll status every 15s when not authorized, every 30s when authorized
  useEffect(() => {
    if (statusTimer.current) window.clearInterval(statusTimer.current);
    const load = async () => {
      try {
        const response = await request("/api/consola/status");
        if (response.ok) {
          const data = (await response.json()) as ConsoleStatus;
          setStatus(data);
        }
      } catch {
        // network error → keep previous state or default offline
      }
    };
    load();
    statusTimer.current = window.setInterval(load, authState === "authorized" ? 30_000 : 15_000);
    return () => {
      if (statusTimer.current) window.clearInterval(statusTimer.current);
    };
  }, [authState]);

  const sendCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await request("/api/consola/request-code", { method: "POST", body: "{}" });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "No pude enviar el código.");
      }
      setAuthState("sent");
    } catch (issue) {
      setError(issue instanceof Error && issue.message ? issue.message : "No pude enviar el código.");
      setAuthState("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await request("/api/consola/verify-code", { method: "POST", body: JSON.stringify({ code }) });
      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Código inválido.");
      }
      setAuthState("authorized");
      setCode("");
    } catch (issue) {
      setError(issue instanceof Error && issue.message ? issue.message : "No pude validar el código.");
      setAuthState("error");
    } finally {
      setLoading(false);
    }
  };

  const isDark = true;
  const bgClass = isDark ? "bg-[#0B0D0C]" : "bg-paper";
  const textClass = isDark ? "text-paper" : "text-ink";
  const inputBg = isDark ? "bg-white/5" : "bg-paper";
  const inputBorder = isDark ? "border-white/10" : "hairline";

  // OTP gates access only. The authenticated terminal must use the complete
  // viewport instead of inheriting the compact authentication card.
  if (authState === "authorized") {
    return (
      <div className="console-remote-page bg-[#0b0f17] text-[#d6e1f2] min-h-screen flex flex-col">
        <header className="console-view-header" aria-label="Vista de consola">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <span className="console-view-brand"><span aria-hidden="true">{'>_'}</span> Consola Remota</span>
            <nav className="console-view-tabs ml-auto flex items-center gap-1" role="tablist" aria-label="Modo de vista">
              <button
                role="tab"
                aria-selected={viewMode === "terminal"}
                onClick={() => setViewMode("terminal")}
                className={`console-view-tab px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === "terminal" ? "bg-white/10 text-white" : "text-stone hover:text-white"}`}
              >
                Terminal
              </button>
              <button
                role="tab"
                aria-selected={viewMode === "monitor"}
                onClick={() => setViewMode("monitor")}
                className={`console-view-tab px-3 py-1.5 rounded-lg text-sm font-medium transition ${viewMode === "monitor" ? "bg-white/10 text-white" : "text-stone hover:text-white"}`}
              >
                Monitor
              </button>
            </nav>
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[.14em] text-stone">
              <span>PC {pcOnline ? "ONLINE" : "OFFLINE"}</span>
              <span aria-hidden="true">&middot;</span>
              <span>Agent Console {agentOnline ? "ONLINE" : "OFFLINE"}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 min-h-0">
          <div className={viewMode === "terminal" ? "" : "hidden"}>
            <RemoteTerminal pcOnline={pcOnline} agentOnline={agentOnline} />
          </div>
          <div className={viewMode === "monitor" ? "" : "hidden"}>
            <RemoteAgentMonitor pcOnline={pcOnline} agentOnline={agentOnline} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${bgClass} ${textClass} flex min-h-screen flex-col`}>
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          {/* Status indicators */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${pcOnline ? "bg-emerald-400" : "bg-red-400"}`} aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">
                PC {pcOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${agentOnline ? "bg-emerald-400" : "bg-red-400"}`} aria-hidden="true" />
              <span className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">
                Agent Console {agentOnline ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
          </div>

          {/* Auth flow */}
          {authState === "idle" && (
            <section className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="consola-title">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Federico Home — Consola Remota</p>
              <h1 id="consola-title" className="mt-3 font-display text-3xl tracking-[-.04em]">Acceso remoto</h1>
              <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-stone">
                Necesitás un código de un solo uso enviado por Telegram. Vence en unos minutos.
              </p>
              <button
                type="button"
                onClick={sendCode}
                disabled={loading}
                className="mt-7 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Enviando…" : "Enviar código"}
              </button>
            </section>
          )}

          {authState === "sent" && (
            <section className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="consola-title">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Federico Home — Consola Remota</p>
              <h1 id="consola-title" className="mt-3 font-display text-3xl tracking-[-.04em]">Código enviado</h1>
              <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-stone">
                Te envié un código a Telegram. Ingresalo abajo.
              </p>
              <form className="mt-7" onSubmit={verifyCode} noValidate>
                <label htmlFor="consola-code" className="text-sm font-medium text-paper">
                  Código
                </label>
                <input
                  id="consola-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  autoFocus
                  aria-describedby={error ? "consola-error" : undefined}
                  className={`mt-2 w-full border ${inputBorder} ${inputBg} px-4 py-3 font-mono text-xl tracking-[.35em] text-paper outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/10`}
                />
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="mt-5 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {loading ? "Verificando…" : "Entrar"}
                </button>
              </form>
            </section>
          )}

          {(authState === "error" || authState === "expired") && (
            <section className="rounded-[18px] border border-white/10 bg-white/[0.03] p-6 sm:p-8" aria-labelledby="consola-title">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Federico Home — Consola Remota</p>
              <h1 id="consola-title" className="mt-3 font-display text-3xl tracking-[-.04em]">
                {authState === "expired" ? "Sesión expirada" : "Código inválido"}
              </h1>
              <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-stone">
                {authState === "expired"
                  ? "La sesión remota expiró por inactividad. Volvé a autenticarte."
                  : error || "El código no es válido o ya venció."}
              </p>
              <button
                type="button"
                onClick={() => { setAuthState("idle"); setError(""); setCode(""); }}
                className="mt-7 w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-ink transition hover:bg-white/90"
              >
                Reintentar
              </button>
            </section>
          )}

          <p id="consola-error" className="mt-4 min-h-5 text-sm text-red-400" aria-live="polite">
            {error}
          </p>
        </div>
      </main>
    </div>
  );
}

export default ConsolePage;