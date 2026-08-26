/** PREVIEW — Tickets — marketing preview liviano. No es la demo oficial tickets-demo. */
import { useState } from "react"

type Ticket = { id:string; title:string; prio:"Alta"|"Media"|"Baja"; status:"Abierto"|"En progreso"|"Esperando"|"Resuelto"; assignee:string }

const initial: Ticket[] = [
  { id:"TK-241", title:"Error en cálculo de impuestos", prio:"Alta", status:"Abierto", assignee:"FL" },
  { id:"TK-242", title:"Agregar exportación CSV", prio:"Media", status:"En progreso", assignee:"MQ" },
  { id:"TK-243", title:"Revisar permisos de cliente", prio:"Baja", status:"Esperando", assignee:"—" },
  { id:"TK-244", title:"Duplicado en listado de lotes", prio:"Alta", status:"Resuelto", assignee:"FL" },
  { id:"TK-245", title:"Mejorar búsqueda de tickets", prio:"Media", status:"Abierto", assignee:"—" },
]

const cols = ["Abierto","En progreso","Esperando","Resuelto"] as const

export default function TicketsPreview(){
  const [tickets, setTickets] = useState(initial)
  const [selected, setSelected] = useState<Ticket>(initial[0])

  const move = (t:Ticket, dir:1|-1)=>{
    const idx = cols.indexOf(t.status)
    const next = cols[idx+dir]
    if(!next) return
    setTickets(ts=> ts.map(x=> x.id===t.id? {...x, status: next}:x))
    setSelected(s=> s.id===t.id? {...s, status: next}:s)
  }

  return (
    <div>
      <div className="flex gap-2 overflow-auto pb-2 no-scrollbar">
        {cols.map(c=>(
          <div key={c} className="min-w-[220px] flex-1 rounded-[14px] border hairline bg-white overflow-hidden">
            <div className="px-3 py-2 border-b hairline bg-paper-2 flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone">{c}</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-white border hairline">{tickets.filter(t=>t.status===c).length}</span>
            </div>
            <div className="p-2 space-y-2 min-h-[160px]">
              {tickets.filter(t=>t.status===c).map(t=>(
                <button key={t.id} onClick={()=>setSelected(t)} className={`w-full text-left rounded-[12px] border p-3 ${selected.id===t.id?"bg-ink text-paper border-ink":"bg-paper-2 hairline hover:bg-white"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px]">{t.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${t.prio==="Alta"?"bg-red-50 border-red-200 text-red-700": t.prio==="Media"?"bg-amber-50 border-amber-200 text-amber-800":"bg-moss/10 border-moss/20 text-moss"}`}>{t.prio}</span>
                    <span className="ml-auto w-6 h-6 rounded-full bg-white/20 border grid place-items-center text-[10px] font-mono">{t.assignee}</span>
                  </div>
                  <div className={`text-[12px] leading-snug mt-1.5 ${selected.id===t.id?"":"text-ink"}`}>{t.title}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid md:grid-cols-[1.2fr_.8fr] gap-4">
        <div className="rounded-[14px] border hairline bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] px-2 py-1 rounded-full border hairline bg-paper-2">{selected.id}</span>
            <span className="text-[13px] font-medium">{selected.title}</span>
          </div>
          <div className="mt-4">
            <div className="text-[11px] font-mono tracking-widest uppercase text-stone">Seguimiento</div>
            <div className="mt-2 space-y-2 text-[12px]">
              {[
                ["08:10","Creado","— sistema"],
                ["09:30","Prioridad Alta asignada","FL"],
                ["11:05","En progreso","MQ"],
                ["14:20","Esperando confirmación","—"],
              ].map(([time, ev, who])=>(
                <div key={time} className="flex gap-3">
                  <span className="font-mono text-stone w-12">{time}</span>
                  <span className="w-2 h-2 rounded-full bg-ink mt-1.5" />
                  <span className="flex-1">{ev} <span className="text-stone">· {who}</span></span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={()=>move(selected,-1)} className="px-3 py-1.5 rounded-full border hairline text-[12px] bg-paper-2">← Anterior</button>
            <button onClick={()=>move(selected,1)} className="px-3 py-1.5 rounded-full bg-ink text-paper text-[12px]">Siguiente →</button>
            <span className="ml-auto text-[11px] font-mono text-stone self-center">Estado: {selected.status}</span>
          </div>
        </div>
        <div className="rounded-[14px] border hairline bg-moss text-paper p-4">
          <div className="text-[11px] tracking-widest uppercase opacity-70 font-mono">Resolución</div>
          <div className="font-display text-[16px] mt-1">Resolver sin ruido</div>
          <div className="text-[12px] opacity-80 mt-2 leading-relaxed">Prioridades visibles, estados claros, historial trazable. Visual antes que párrafos.</div>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-mono opacity-70"><span className="h-2 w-2 rounded-full bg-white" /> Estados representativos · datos ficticios</div>
        </div>
      </div>
    </div>
  )
}
