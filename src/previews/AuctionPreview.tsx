/**
 * PREVIEW — Subastas
 * Marketing preview liviano para Federico Home (hub).
 * NO es la demo oficial del producto stock-subastas.
 * Interacciones: mover oferta, historial ficticio, animación cierre.
 * La demo completa está lista en stock-subastas-demo; su publicación sigue pendiente.
 */
import { useState } from "react"

type Lot = { id:number; title:string; current:number; bids:number; ends:string; state:"Abierto"|"Cerrando"|"Cerrado"; winner?:string }

const lots: Lot[] = [
  { id:184, title:"Reloj suizo · 1962", current:42500, bids:14, ends:"02:14", state:"Abierto"},
  { id:185, title:"Cámara Leica M3", current:68200, bids:22, ends:"00:42", state:"Cerrando"},
  { id:186, title:"Bicicleta plegable", current:18900, bids:8, ends:"12:05", state:"Abierto"},
]

export default function AuctionPreview(){
  const [selected, setSelected] = useState(184)
  const lot = lots.find(l=>l.id===selected)!
  const [offer, setOffer] = useState(43700)
  const [history, setHistory] = useState([
    { time:"08:41", user:"— lucía", amount:41300 },
    { time:"08:42", user:"— vos", amount:42500 },
    { time:"08:42", user:"— martín", amount:43100 },
  ])
  const [closed, setClosed] = useState(false)

  const pujar = ()=>{
    setHistory(h=> [...h, { time:new Date().toLocaleTimeString().slice(0,5), user:"— vos", amount: offer }])
    setOffer(o=> o+600)
  }

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-4">
      <div className="space-y-3">
        <div className="text-[11px] tracking-[0.12em] uppercase text-stone font-mono">Lotes</div>
        {lots.map(l=>(
          <button key={l.id} onClick={()=>setSelected(l.id)} className={`w-full text-left rounded-[14px] border p-3 flex gap-3 ${selected===l.id?"bg-ink text-paper border-ink":"bg-white hairline hover:bg-paper-2"}`}>
            <div className={`w-10 h-10 rounded-[10px] grid place-items-center font-mono text-[11px] ${selected===l.id?"bg-white/15":"bg-paper-2 border hairline"}`}>#{l.id}</div>
            <div className="flex-1">
              <div className="text-[13px] font-medium leading-none">{l.title}</div>
              <div className={`text-[11px] font-mono mt-1 ${selected===l.id?"opacity-70":"text-stone"}`}>${l.current.toLocaleString()} · {l.bids} pujas · {l.ends}</div>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-full border h-fit ${l.state==="Cerrando"?"bg-amber-100 border-amber-200 text-amber-900": l.state==="Cerrado"?"bg-stone text-white":"bg-moss text-white border-moss"}`}>{l.state}</span>
          </button>
        ))}
        <div className="rounded-[12px] bg-white border hairline p-3 text-[11px] leading-relaxed text-ink-light">
          Simulación de evolución de puja. Sin datos sensibles. Al cerrar, se anuncia ganador.
        </div>
      </div>

      <div className="bg-white rounded-[16px] border hairline overflow-hidden">
        <div className="p-5 border-b hairline flex items-start justify-between gap-4">
          <div>
            <div className="font-display text-[18px]">Lote #{lot.id} · {lot.title}</div>
            <div className="text-[12px] text-stone font-mono mt-1">Estado: {closed?"Cerrado · Ganador: vos":"Abierto"} · Cierra en {lot.ends}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[11px] text-stone">Puja actual</div>
            <div className="font-display text-[26px] tracking-[-0.02em]">${history[history.length-1].amount.toLocaleString()}</div>
          </div>
        </div>

        <div className="p-5 grid md:grid-cols-[1.2fr_.8fr] gap-5">
          <div>
            <div className="text-[11px] font-mono tracking-widest uppercase text-stone">Historial de ofertas</div>
            <div className="mt-3 space-y-2 max-h-[180px] overflow-auto pr-1">
              {history.map((h,i)=>(
                <div key={i} className="flex items-center gap-2 text-[12px] font-mono">
                  <span className="text-stone w-12">{h.time}</span>
                  <span className="flex-1">{h.user}</span>
                  <span className="font-medium">${h.amount.toLocaleString()}</span>
                  {i===history.length-1 && <span className="w-2 h-2 rounded-full bg-moss animate-pulse" />}
                </div>
              ))}
            </div>
            <div className="mt-4 h-16 flex items-end gap-[3px]">
              {history.map((h,i)=>(
                <div key={i} className="flex-1 bg-clay/70 rounded-t" style={{height: `${40 + i*12}%`}} title={`$${h.amount}`} />
              ))}
              <div className="flex-1 bg-ink rounded-t" style={{height: "92%"}} />
            </div>
            <div className="text-[11px] font-mono text-stone mt-1">Evolución de la puja</div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[14px] border hairline bg-paper-2 p-4">
              <div className="text-[11px] font-mono text-stone">Tu oferta</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={()=>setOffer(o=>Math.max(1000,o-500))} className="w-8 h-8 rounded-full border hairline bg-white grid place-items-center">−</button>
                <div className="flex-1 text-center font-mono text-[16px] font-medium">${offer.toLocaleString()}</div>
                <button onClick={()=>setOffer(o=>o+500)} className="w-8 h-8 rounded-full border hairline bg-white grid place-items-center">+</button>
              </div>
              <button onClick={pujar} disabled={closed} className="mt-3 w-full py-2.5 rounded-full bg-ink text-paper text-[13px] font-medium disabled:opacity-40 hover:bg-black">Pujar ${offer.toLocaleString()}</button>
              <button onClick={()=>setClosed(v=>!v)} className="mt-2 w-full py-2 rounded-full border hairline bg-white text-[12px]">{closed?"Reabrir (simulado)":"Simular cierre"}</button>
              {closed && <div className="mt-3 text-[12px] text-moss font-medium text-center">✓ Cerrado — Ganador: vos (${history[history.length-1].amount.toLocaleString()})</div>}
            </div>
            <div className="text-[11px] text-stone leading-relaxed">Preview marketing — datos de ejemplo. Demo completa lista · publicación pendiente.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
