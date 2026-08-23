/** PREVIEW — Company Workspace — interacción orbital marketing. */
import { useState } from "react"

const roles = [
  { id:"producto", name:"Producto", desc:"Define qué construir", icon:"◈", color:"#C07A5A" },
  { id:"arquitectura", name:"Arquitectura", desc:"Límites y riesgos técnicos", icon:"⬢", color:"#2D2F2D" },
  { id:"diseño", name:"Diseño", desc:"Visual y experiencia", icon:"◎", color:"#C9A86A" },
  { id:"desarrollo", name:"Desarrollo", desc:"Construye", icon:"▣", color:"#4A5A52" },
  { id:"qa", name:"QA", desc:"Verifica", icon:"✓", color:"#6B6E6B" },
  { id:"seguridad", name:"Seguridad", desc:"Privacidad y riesgo", icon:"⬔", color:"#7A6F66" },
  { id:"release", name:"Release", desc:"Entrega", icon:"▲", color:"#A85A3A" },
]

export default function WorkspacePreview(){
  const [active, setActive] = useState("diseño")
  const a = roles.find(r=>r.id===active)!

  return (
    <div>
      <div className="text-center">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-stone">Construí una empresa virtual para crear software</div>
        <div className="font-display text-[18px] mt-1">7 roles · orquestados</div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {roles.map(r=>(
          <button key={r.id} onClick={()=>setActive(r.id)} className={`px-3 py-2 rounded-full border text-[12px] flex items-center gap-2 transition ${active===r.id?"bg-ink text-paper border-ink":"bg-white hairline hover:bg-paper-2"}`}>
            <span className="w-6 h-6 rounded-full grid place-items-center text-[11px] border" style={{background: r.color, color:"#fff", borderColor:r.color}}>{r.icon}</span>
            {r.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-[1.1fr_.9fr] gap-4 items-start">
        <div className="rounded-[16px] border hairline bg-white p-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full grid place-items-center text-white" style={{background:a.color}}>{a.icon}</span>
            <div>
              <div className="font-display text-[16px] leading-none">{a.name}</div>
              <div className="text-[11px] font-mono text-stone tracking-wide uppercase">{a.id}</div>
            </div>
            <span className="ml-auto text-[11px] px-2 py-1 rounded-full bg-paper-2 border hairline">Activo</span>
          </div>
          <div className="mt-4 text-[13px] leading-relaxed text-ink-light">{a.desc} — sin párrafos largos, solo lo esencial. El flujo pasa de Producto → Arquitectura → Diseño → Desarrollo → QA → Seguridad → Release.</div>
          <div className="mt-4 flex gap-2 text-[11px] font-mono">
            <span className="px-2 py-1 rounded-full bg-ink text-paper">Entrada → Salida</span>
            <span className="px-2 py-1 rounded-full border hairline">Documentado</span>
          </div>
        </div>

        <div className="rounded-[16px] border hairline bg-paper-2 p-4">
          <div className="text-[11px] font-mono tracking-widest uppercase text-stone">Flujo</div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {roles.map(r=>(
              <span key={r.id} className={`px-2 py-1 rounded-full text-[11px] border ${r.id===active?"bg-ink text-paper border-ink":"bg-white hairline"}`}>{r.name}</span>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-line rounded-full overflow-hidden flex">
            <div className="bg-ink" style={{width: `${(roles.findIndex(x=>x.id===active)+1)/roles.length*100}%`}} />
          </div>
          <div className="mt-2 text-[11px] font-mono text-stone">{roles.findIndex(x=>x.id===active)+1} / {roles.length} — orquestación secuencial</div>
          <div className="mt-4 rounded-[12px] bg-white border hairline p-3 text-[11px] leading-relaxed">
            <span className="font-medium">Company Workspace</span> no es un template. Es el sistema con el que se construyó esta misma casa digital.
          </div>
        </div>
      </div>
    </div>
  )
}
