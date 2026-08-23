import { labItems } from "../data/projects"
import { Link } from "react-router-dom"

const statusLabel: Record<string, {label:string, cls:string}> = {
  idea: { label:"idea", cls:"bg-paper-2 border-line" },
  experiment: { label:"experiment", cls:"bg-amber-50 border-amber-200 text-amber-900" },
  building: { label:"building", cls:"bg-moss text-white border-moss" },
  ready: { label:"ready", cls:"bg-ink text-paper border-ink" },
}

export default function Lab(){
  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10">
      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-[30px] md:text-[40px] tracking-[-0.03em] leading-none">Lab</h1>
        <span className="text-stone font-display italic text-[22px]">— cosas que estoy explorando</span>
        <span className="ml-2 font-mono text-[11px] px-2 py-1 rounded-full border hairline bg-paper-2">{labItems.length} piezas</span>
      </div>
      <p className="text-[13px] text-ink-light mt-2 max-w-[66ch]">Herramientas, IA, prototipos y proyectos pequeños. Company Workspace también nació acá. Cada pieza tiene estado — agregar una nueva es añadir una entrada a <span className="font-mono bg-paper-2 px-1 rounded border hairline">labItems</span>.</p>

      <div className="mt-6 flex flex-wrap gap-1.5 text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded-full border hairline bg-paper-2">idea</span>
        <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">experiment</span>
        <span className="px-2.5 py-1 rounded-full bg-moss text-white border">building</span>
        <span className="px-2.5 py-1 rounded-full bg-ink text-paper border">ready</span>
        <span className="ml-2 text-stone self-center">— sin proyectos inventados</span>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {labItems.map(item=>{
          const s = statusLabel[item.status]
          return (
            <div key={item.id} className="group rounded-[16px] border hairline bg-white p-5 hover:shadow-sm transition flex flex-col">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{background:item.color}} />
                <span className="font-mono tracking-wide uppercase text-stone">{item.tag}</span>
                <span className={`ml-auto font-mono text-[10px] px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>
              </div>
              <div className="font-display text-[16px] mt-3 leading-none">{item.title}</div>
              <div className="text-[12px] text-ink-light mt-2 leading-relaxed flex-1">{item.desc}</div>
              <div className="mt-4 flex items-center gap-2 text-[11px]"><span className="font-mono text-stone">{item.year}</span><span className="ml-auto w-6 h-6 rounded-full border hairline grid place-items-center group-hover:translate-x-0.5 transition">↗</span></div>
            </div>
          )
        })}
        <div className="rounded-[16px] border-dashed border-2 border-line bg-paper-2/40 p-5 grid place-items-center text-center min-h-[168px]">
          <div>
            <div className="w-8 h-8 rounded-full border hairline bg-white grid place-items-center mx-auto text-stone">+</div>
            <div className="font-display text-[14px] mt-2">Agregar experimento</div>
            <div className="text-[11px] font-mono text-stone mt-1">Añadir a labItems — status: idea → ready</div>
            <div className="text-[11px] text-stone mt-1">Placeholder deliberado, no incompleto.</div>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[16px] border hairline bg-ink text-paper p-6 flex flex-col md:flex-row gap-4 justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase opacity-60">Destacado del Lab</div>
          <div className="font-display text-[18px] mt-1">Company Workspace — empresa virtual para construir software</div>
          <div className="text-[12px] opacity-70 mt-1">Producto · Arquitectura · Diseño · Dev · QA · Seguridad · Release — nació como experimento, hoy es sistema vivo.</div>
        </div>
        <Link to="/proyectos/company-workspace" className="self-start md:self-center px-5 py-2.5 rounded-full bg-white text-ink text-[13px] shrink-0">Ver pieza especial →</Link>
      </div>
    </div>
  )
}
