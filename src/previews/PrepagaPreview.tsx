/** PREVIEW — Prepaga — recorrido visual mobile marketing. No es la app completa. */
import { useState } from "react"

const products = [
  { id:1, name:"Pack 10 clases", price:4200 },
  { id:2, name:"Pack 20 clases", price:7800 },
  { id:3, name:"Mensual ilimitado", price:9500 },
]

export default function PrepagaPreview(){
  const [saldo, setSaldo] = useState(12500)
  const [cart, setCart] = useState<number[]>([])
  const [step, setStep] = useState<"browse"|"confirm"|"done">("browse")
  const total = cart.reduce((s,id)=> s + (products.find(p=>p.id===id)?.price ?? 0),0)

  const pay = ()=>{
    if(total>saldo) return
    setSaldo(s=> s-total)
    setStep("done")
    setTimeout(()=>{ setCart([]); setStep("browse")}, 1800)
  }

  return (
    <div className="flex justify-center">
      <div className="w-[340px] rounded-[28px] border-[8px] border-ink bg-white overflow-hidden shadow-xl relative">
        <div className="h-6 bg-ink flex items-center justify-center"><div className="w-16 h-1.5 bg-white/30 rounded-full" /></div>

        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Venta Prepaga</div>
            <div className="font-display text-[16px] leading-none">Hola, Federico</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono text-stone">Saldo</div>
            <div className="font-mono text-[15px] font-medium">${saldo.toLocaleString()}</div>
          </div>
        </div>

        {step==="browse" && (
          <div className="px-3 pb-4 space-y-3">
            <div className="rounded-[14px] bg-paper-2 border hairline p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-ink text-paper grid place-items-center font-mono text-[10px]">FL</div>
              <div className="text-[12px] leading-tight"><div className="font-medium">Saldo disponible</div><div className="text-stone font-mono">${saldo.toLocaleString()} · Prepago</div></div>
              <button onClick={()=>setSaldo(s=>s+5000)} className="ml-auto text-[11px] px-3 py-1 rounded-full bg-white border hairline">+ Cargar</button>
            </div>

            <div className="space-y-2">
              {products.map(p=>(
                <div key={p.id} className="rounded-[14px] border hairline p-3 flex items-center gap-3 bg-white">
                  <div className="w-10 h-10 rounded-[10px] bg-paper-3 border hairline grid place-items-center text-[11px] font-mono">${p.price}</div>
                  <div className="flex-1"><div className="text-[13px] font-medium leading-none">{p.name}</div><div className="text-[11px] text-stone font-mono">Entrega inmediata</div></div>
                  <button onClick={()=> setCart(c=> c.includes(p.id)? c: [...c,p.id])} className={`px-3 py-1.5 rounded-full text-[11px] border ${cart.includes(p.id)?"bg-moss text-white border-moss":"bg-ink text-paper"}`}>{cart.includes(p.id)?"✓":"Agregar"}</button>
                </div>
              ))}
            </div>

            <div className="rounded-[14px] bg-ink text-paper p-3 flex items-center justify-between">
              <div className="text-[12px]"><span className="opacity-70">Total</span> <span className="font-mono">${total.toLocaleString()}</span> {total>0 && <span className="opacity-70">· {cart.length} item(s)</span>}</div>
              <button disabled={cart.length===0} onClick={()=>setStep("confirm")} className="px-4 py-1.5 rounded-full bg-white text-ink text-[12px] font-medium disabled:opacity-40">Comprar →</button>
            </div>
            <div className="text-[10px] font-mono text-stone text-center">Preview marketing · Recorrido visual mobile</div>
          </div>
        )}

        {step==="confirm" && (
          <div className="px-4 pb-6 pt-2">
            <div className="text-[13px] font-medium">Confirmar compra</div>
            <div className="mt-2 space-y-1.5 text-[12px]">
              {cart.map(id=>{
                const p=products.find(x=>x.id===id)!
                return <div key={id} className="flex justify-between border-b hairline py-1.5"><span>{p.name}</span><span className="font-mono">${p.price.toLocaleString()}</span></div>
              })}
            </div>
            <div className="mt-3 flex justify-between font-medium text-[13px]"><span>Total</span><span className="font-mono">${total.toLocaleString()}</span></div>
            {total>saldo && <div className="mt-2 text-[11px] text-red-600">Saldo insuficiente — cargá saldo arriba</div>}
            <div className="mt-4 flex gap-2">
              <button onClick={()=>setStep("browse")} className="flex-1 py-2 rounded-full border hairline text-[12px]">Volver</button>
              <button onClick={pay} disabled={total>saldo} className="flex-1 py-2 rounded-full bg-ink text-paper text-[12px] disabled:opacity-40">Confirmar y pagar</button>
            </div>
          </div>
        )}

        {step==="done" && (
          <div className="px-4 pb-8 pt-8 text-center">
            <div className="w-12 h-12 rounded-full bg-moss text-white grid place-items-center mx-auto">✓</div>
            <div className="font-display text-[18px] mt-3">¡Listo!</div>
            <div className="text-[12px] text-stone mt-1">Compra confirmada · Saldo actualizado</div>
            <div className="font-mono text-[13px] mt-2">${saldo.toLocaleString()} disponible</div>
          </div>
        )}

        <div className="h-4 bg-paper-2 border-t hairline flex items-center justify-center"><div className="w-16 h-1 bg-ink/20 rounded-full" /></div>
      </div>
    </div>
  )
}
