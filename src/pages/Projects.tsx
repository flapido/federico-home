import { Link } from "react-router-dom"
import { projects } from "../data/projects"

export default function Projects() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10">
      <div className="flex items-baseline gap-3">
        <h1 className="font-display text-[30px] md:text-[40px] tracking-[-0.03em] leading-none">Proyectos</h1>
        <span className="font-mono text-[11px] px-2 py-1 rounded-full border hairline bg-paper-2">005</span>
        <span className="text-[11px] font-mono text-stone">Hub · Showroom</span>
      </div>
      <p className="text-[13px] text-ink-light mt-2 max-w-[68ch]">Cinco piezas con identidad propia. Cada una con preview marketing liviano en el hub. La demo oficial vive en su proyecto demo independiente.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {projects.map(p=> (
          <Link key={p.slug} to={p.href} className="group rounded-[20px] border hairline bg-white overflow-hidden hover:shadow-sm transition">
            <div className="h-[180px] flex items-center justify-center border-b hairline" style={{background: p.bg}}>
              <div className="text-center">
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{color: p.color}}>{p.subtitle}</div>
                <div className="font-display text-[22px] tracking-[-0.02em] mt-1">{p.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] border hairline bg-white rounded-full px-3 py-1">
                  {p.demoStatus === "LOCAL_DEMO" ? "Demo lista · publicación pendiente" : p.demoStatus === "LIVE_DEMO" ? "Demo publicada" : <>{p.publicUrl} <span className="opacity-50 text-[10px]">(no publicado)</span></>}
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full" style={{background:p.color}} />
                <span className="text-stone font-mono">{p.year}</span>
                <span className="ml-auto px-2 py-0.5 rounded-full text-[10px] border font-mono bg-paper-2">{p.demoStatus}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] border ${p.statusTone==="live"?"bg-moss text-white border-moss": p.statusTone==="demo"?"bg-brass/20 border-brass/30":"bg-paper-2"}`}>{p.status}</span>
              </div>
              <p className="text-[13px] text-ink-light mt-2 leading-relaxed">{p.description}</p>
              <div className="mt-4 flex items-center justify-between text-[12px]">
                <span className="underline decoration-line underline-offset-4 group-hover:decoration-ink">Ver proyecto</span>
                <span className={`px-3 py-1 rounded-full ${p.demoStatus==="LIVE_DEMO"?"bg-ink text-paper":"bg-paper-2 border hairline"}`}>{p.demoStatus==="LIVE_DEMO"?"Probar demo ↗":p.demoStatus==="LOCAL_DEMO"?"Ver preview →":"Preview →"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 text-[11px] font-mono text-stone text-center">Federico Home no importa código de otros proyectos · Solo metadata/URL · Cuando exista una URL pública, el único cambio es LOCAL_DEMO → LIVE_DEMO + demoUrl</div>
    </div>
  )
}
