/** PREVIEW — Legacy → Web — slider marketing antes/después. */
import { useState } from "react"

export default function LegacyPreview(){
  const [pos, setPos] = useState(52)
  return (
    <div>
      <div className="flex items-center gap-2 text-[11px] font-mono text-stone mb-3">
        <span className="w-2 h-2 rounded-full bg-stone" /> Arrastrá el divisor · 100% visual
      </div>
      <div className="relative rounded-[16px] border hairline overflow-hidden bg-white h-[320px] select-none">
        {/* Before */}
        <div className="absolute inset-0 bg-[#D8D2C4] p-4 flex flex-col">
          <div className="text-[10px] font-mono tracking-widest uppercase text-stone">Antes · Desktop · 2008</div>
          <div className="mt-3 flex-1 rounded-[10px] border-2 border-[#9A9590] bg-[#EFECE3] p-3 shadow-inner overflow-hidden">
            <div className="h-6 bg-[#9A9590] text-white text-[11px] font-mono flex items-center px-2">App.Legacy.exe — Sistema Viejo</div>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} className="h-10 border border-[#9A9590]/40 bg-white text-[8px] font-mono p-1">Campo {i+1}<div className="mt-1 h-2 bg-[#9A9590]/20" /></div>
              ))}
            </div>
            <div className="mt-2 flex gap-1">
              <span className="px-2 py-1 bg-[#9A9590] text-white text-[10px] font-mono">Aceptar</span>
              <span className="px-2 py-1 border border-[#9A9590] text-[10px] font-mono">Cancelar</span>
            </div>
            <div className="mt-2 text-[9px] font-mono text-stone">Resolución fija · Sin responsive · Latencia alta</div>
          </div>
        </div>
        {/* After - clipped */}
        <div className="absolute inset-0 bg-white p-4 flex flex-col" style={{clipPath: `inset(0 ${100-pos}% 0 0)`}}>
          <div className="text-[10px] font-mono tracking-widest uppercase text-stone">Después · Web Moderna</div>
          <div className="mt-3 flex-1 rounded-[14px] border hairline bg-ink text-paper p-4 flex flex-col">
            <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full bg-moss" /> Web · Responsive · Rápida</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="h-12 rounded-[10px] bg-white text-ink p-2 text-[11px]">Búsqueda<span className="block h-1.5 bg-ink/10 mt-1 rounded" /></div>
              <div className="h-12 rounded-[10px] bg-white/10 border border-white/15 p-2 text-[11px]">Lotes<span className="block h-1.5 bg-white/20 mt-1 rounded" /></div>
              <div className="h-12 rounded-[10px] bg-clay p-2 text-[11px] text-white">Acción<span className="block h-1.5 bg-white/40 mt-1 rounded" /></div>
            </div>
            <div className="mt-auto flex gap-2 text-[11px]"><span className="px-3 py-1 rounded-full bg-white text-ink">Explorar</span><span className="px-3 py-1 rounded-full border border-white/20">Mobile first</span></div>
          </div>
        </div>
        {/* Divider */}
        <div className="absolute top-0 bottom-0 w-1 bg-ink" style={{left: `calc(${pos}% - 2px)`}} />
        <button aria-label="Mover divisor" className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ink text-paper grid place-items-center border-2 border-white shadow-md cursor-ew-resize" style={{left: `calc(${pos}% - 16px)`}}
          onMouseDown={e=>{
            const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
            const move = (ev:MouseEvent)=> setPos(Math.max(10,Math.min(90, ((ev.clientX-rect.left)/rect.width)*100)))
            const up = ()=>{ window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up)}
            window.addEventListener("mousemove", move); window.addEventListener("mouseup", up)
          }}
          onTouchMove={e=>{
            const rect = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect()
            const touch = e.touches[0]
            setPos(Math.max(10,Math.min(90, ((touch.clientX-rect.left)/rect.width)*100)))
          }}
        >↔</button>
      </div>
      <input type="range" min={10} max={90} value={pos} onChange={e=>setPos(Number(e.target.value))} className="w-full mt-3 accent-black" aria-label="Comparación antes y después" />
      <div className="mt-2 flex justify-between text-[11px] font-mono text-stone"><span>Legacy desktop</span><span>→</span><span>Web moderna</span></div>
    </div>
  )
}
