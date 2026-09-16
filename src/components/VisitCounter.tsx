import { useEffect, useState } from "react";
import { analyticsClientEnabled } from "../lib/analytics";

const CACHE_KEY = "fh:visit-counter:last-known";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function readCache(): number | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { value, ts } = JSON.parse(raw) as { value: number; ts: number };
    if (Date.now() - ts > CACHE_TTL_MS) return null;
    if (Number.isSafeInteger(value) && value > 0) return value;
  } catch { /* ignore */ }
  return null;
}

function writeCache(value: number) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ value, ts: Date.now() }));
  } catch { /* ignore */ }
}

function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch { /* ignore */ }
}

export default function VisitCounter() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    if (!analyticsClientEnabled()) return;
    let active = true;
    let loadAttempted = false;
    const load = () => {
      if (loadAttempted) return;
      loadAttempted = true;
      void fetch("/api/analytics/visit-counter", { headers: { accept: "application/json" } })
        .then((response) => {
          if (!response.ok) return Promise.reject(new Error(`HTTP ${response.status}`));
          return response.json();
        })
        .then((data: { total?: unknown }) => {
          const value = Number(data.total);
          if (active && Number.isSafeInteger(value) && value >= 0) {
            if (value > 0) {
              setTotal(value);
              writeCache(value);
            } else {
              setTotal(null);
              clearCache();
            }
          }
        })
        .catch((err) => {
          if (import.meta.env.DEV) console.warn("[VisitCounter] fetch failed:", err);
          const cached = readCache();
          if (active && cached !== null) setTotal(cached);
        });
    };
    load();
    return () => { active = false; };
  }, []);
  if (!total) return null;
  return <p className="mt-3 max-w-[34ch] text-[11px] leading-relaxed text-stone">Gracias por pasar por acá. Sos la visita Nº {new Intl.NumberFormat("es-AR").format(total)}.</p>;
}
