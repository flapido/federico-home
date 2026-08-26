import { useEffect, useState } from "react";
import { analyticsClientEnabled } from "../lib/analytics";

export default function VisitCounter() {
  const [total, setTotal] = useState<number | null>(null);
  useEffect(() => {
    if (!analyticsClientEnabled()) return;
    let active = true;
    const load = () => void fetch("/api/analytics/visit-counter", { headers: { accept: "application/json" } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data: { total?: unknown }) => {
        const value = Number(data.total);
        if (active && Number.isSafeInteger(value) && value > 0) setTotal(value);
      }).catch(() => undefined);
    load();
    const retry = window.setTimeout(load, 700);
    return () => { active = false; window.clearTimeout(retry); };
  }, []);
  if (!total) return null;
  return <p className="mt-3 max-w-[34ch] text-[11px] leading-relaxed text-stone">Gracias por pasar por acá. Sos la visita Nº {new Intl.NumberFormat("es-AR").format(total)}.</p>;
}
