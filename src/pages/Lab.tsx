import { Link } from "react-router-dom"
import { labItems, type LabStatus } from "../data/projects"

const statusClass: Record<LabStatus, string> = {
  IDEA: "border-line bg-paper-2 text-stone",
  EXPERIMENT: "border-brass/40 bg-brass/10 text-ink-2",
  BUILDING: "border-moss bg-moss text-paper",
  READY: "border-ink bg-ink text-paper",
}

export default function Lab() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-6 md:px-8 md:py-14">
      <header className="max-w-[68ch]"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Engineering Lab</div><h1 className="mt-3 font-display text-[44px] leading-[.94] tracking-[-.045em] md:text-[56px]">Experimentos y prototipos, <span className="italic">con estado claro.</span></h1><p className="mt-5 text-[14px] leading-relaxed text-ink-light">Un espacio para exploración de IA, automatización y herramientas de ingeniería. Cada entrada indica qué tan madura es; no presenta ideas como productos terminados.</p></header>
      <div className="mt-8 flex flex-wrap gap-2">{(["IDEA", "EXPERIMENT", "BUILDING", "READY"] as LabStatus[]).map(status => <span key={status} className={`rounded-full border px-3 py-1.5 font-mono text-[10px] ${statusClass[status]}`}>{status}</span>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">{labItems.map(item => { const content = <><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">{item.tag}</span><span className={`rounded-full border px-2 py-1 font-mono text-[10px] ${statusClass[item.status]}`}>{item.status}</span></div><h2 className="mt-7 font-display text-[27px] leading-none">{item.title}</h2><p className="mt-4 text-[13px] leading-relaxed text-ink-light">{item.description}</p>{item.href && <span className="mt-7 inline-block text-[12px] font-medium underline decoration-line underline-offset-4">Ver case study →</span>}</>; return item.href ? <Link key={item.id} to={item.href} className="rounded-[20px] border hairline bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm">{content}</Link> : <article key={item.id} className="rounded-[20px] border hairline bg-white p-6">{content}</article> })}</div>
      <aside className="mt-8 rounded-[18px] border hairline bg-paper-2 p-6"><div className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Criterio de publicación</div><p className="mt-3 max-w-[72ch] text-[13px] leading-relaxed text-ink-light">El Lab prioriza piezas que pueden describirse públicamente sin revelar datos privados, credenciales o detalles de proyectos de terceros. Las exploraciones sin suficiente contexto permanecen fuera del portfolio.</p><Link to="/proyectos" className="mt-5 inline-block text-[13px] underline decoration-line underline-offset-4">Volver a proyectos →</Link></aside>
    </div>
  )
}
