export default function About(){
  const hasProfile = true // cambia a true cuando exista la fotografía real — el img hará fallback automático
  return (
    <div className="max-w-[980px] mx-auto px-6 md:px-8 py-10">
      <div className="grid md:grid-cols-[1.15fr_.85fr] gap-8 items-start">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-stone"><span className="w-6 h-px bg-line" /> Sobre mí</div>
          <h1 className="font-display text-[34px] md:text-[42px] tracking-[-0.03em] leading-none mt-3">Construyo cosas.<br/><span className="italic font-[300]">Pruebo ideas.</span></h1>
          <p className="text-[14px] leading-relaxed mt-4 text-ink-2 max-w-[52ch]">Me interesa entender cómo funcionan los sistemas y dejarlos mejor que como los encontré. Esta casa digital es donde muestro lo que hago — sin humo, con previews que podés probar.</p>
          <p className="text-[13px] text-ink-light mt-3 leading-relaxed max-w-[60ch]">Buenos Aires, Argentina. Trabajo backend, integraciones y producto. Si querés detalle profesional, está el CV.</p>
          <div className="mt-6 flex gap-2 text-[12px]">
            <a href="/cv" className="px-4 py-2 rounded-full bg-ink text-paper">Ver CV →</a>
            <a href="/proyectos" className="px-4 py-2 rounded-full border hairline bg-white">Proyectos</a>
          </div>
        </div>

        <div className="rounded-[20px] border hairline bg-white overflow-hidden">
          <div className="aspect-[4/3] bg-paper-2 grid place-items-center relative overflow-hidden">
            <img src="/fotos/federico-profile.jpg" alt="Federico Lapido" className="absolute inset-0 w-full h-full object-cover object-position-50% 35%" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
            {!hasProfile && <div className="relative text-center p-6">
              <div className="w-14 h-14 rounded-full border hairline bg-white grid place-items-center mx-auto font-display text-stone">FL</div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-stone mt-3">Foto real — placeholder</div>
              <div className="text-[11px] text-stone mt-1">Reemplazar: <span className="font-mono bg-paper-2 px-1 rounded border hairline">/fotos/federico-profile.webp</span></div>
            </div>}
          </div>
          <div className="px-5 py-4 border-t hairline flex items-center justify-between text-[11px]">
            <span className="font-mono text-stone">Buenos Aires · 2026</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-moss" /> Disponible para charlar</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-4">
        {[
          { title:"Intereses", desc:"Sistemas, herramientas que ahorran tiempo, IA aplicada con criterio." },
          { title:"Lugares", desc:"Cafés para trabajar, calles para caminar, ciudades para volver." },
          { title:"Objetos", desc:"Pequeñas historias — no biografía inventada." },
        ].map(card=>(
          <div key={card.title} className="rounded-[16px] border hairline bg-white overflow-hidden flex flex-col">
            <div className="h-[120px] bg-paper-2 border-b hairline relative flex items-center justify-center px-4">
            </div>
            <div className="p-4 flex-1">
              <div className="font-display text-[14px] leading-relaxed">{card.title}</div>
              <div className="text-[12px] text-ink-light mt-1 leading-relaxed">{card.desc}</div>
            </div>
            <div className="border-t hairline border-white/10"></div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[16px] border hairline bg-paper-2 p-5 flex flex-col md:flex-row gap-4 justify-between">
        <div className="text-[13px] leading-relaxed">¿Querés ver algo funcionando? <a href="/proyectos" className="underline decoration-line underline-offset-4">Explorá proyectos</a> o escribí via <a href="https://www.linkedin.com/in/federico-lapido" target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4">LinkedIn</a>.</div>
        <div className="text-[11px] font-mono text-stone self-start md:self-center">Sin biografías inventadas · Solo placeholders reemplazables</div>
      </div>
    </div>
  )
}
