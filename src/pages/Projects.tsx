import { Link } from "react-router-dom"
import { projects, type DemoStatus } from "../data/projects"

const statusCopy: Record<DemoStatus, string> = {
  PREVIEW: "Preview en el hub",
  LOCAL_DEMO: "Demo local disponible",
  LIVE_DEMO: "Demo pública disponible",
}

export default function Projects() {
  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-6 md:px-8 md:py-14">
      <div className="max-w-[68ch]"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Engineering case studies</div><h1 className="mt-3 font-display text-[42px] leading-none tracking-[-.045em] md:text-[52px]">Proyectos con contexto y evidencia.</h1><p className="mt-5 text-[14px] leading-relaxed text-ink-light">Federico Home es un hub: presenta el enfoque de cada proyecto y mantiene sus previews locales separadas de los productos y demos independientes.</p></div>

      <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map(project => <Link key={project.slug} to={project.href} className="group flex min-h-[310px] flex-col overflow-hidden rounded-[20px] border hairline bg-white transition hover:-translate-y-0.5 hover:shadow-sm"><div className="h-2" style={{ background: project.color }} /><div className="flex flex-1 flex-col p-6"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[.13em]" style={{ color: project.color }}>{project.demoStatus}</span><span className="rounded-full border hairline bg-paper-2 px-2 py-1 text-[10px] text-stone">{project.year}</span></div><h2 className="mt-7 font-display text-[25px] leading-[.98] tracking-[-.03em]">{project.title}</h2><p className="mt-2 text-[12px] font-medium text-clay-dark">{project.subtitle}</p><p className="mt-4 text-[13px] leading-relaxed text-ink-light">{project.description}</p><div className="mt-auto flex items-center justify-between border-t hairline pt-5 text-[12px]"><span>{statusCopy[project.demoStatus]}</span><span className="font-medium underline decoration-line underline-offset-4 group-hover:decoration-ink">Ver caso →</span></div></div></Link>)}
      </div>

      <div className="mt-8 rounded-[16px] border hairline bg-paper-2/70 p-5 text-[12px] leading-relaxed text-ink-light"><span className="font-medium text-ink">Estados honestos:</span> <span className="font-mono">PREVIEW</span> es una representación interactiva dentro de este hub; <span className="font-mono">LOCAL_DEMO</span> indica una demo independiente sin URL pública confirmada; <span className="font-mono">LIVE_DEMO</span> solo se usa con una URL pública verificada.</div>
    </div>
  )
}
