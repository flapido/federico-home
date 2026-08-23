import { useParams, Link } from "react-router-dom"
import { projects } from "../data/projects"
import AuctionPreview from "../previews/AuctionPreview"
import TicketsPreview from "../previews/TicketsPreview"
import PrepagaPreview from "../previews/PrepagaPreview"
import LegacyPreview from "../previews/LegacyPreview"
import WorkspacePreview from "../previews/WorkspacePreview"
import { getProjectUrl, getDemoUrl } from "../config/domains"

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projects.find(x=>x.slug===slug)
  if(!p) return (
    <div className="max-w-[720px] mx-auto px-6 py-16 text-center">
      <div className="font-mono text-[11px] tracking-widest uppercase text-stone">404</div>
      <h1 className="font-display text-[30px] mt-2">Proyecto no encontrado</h1>
      <Link to="/proyectos" className="inline-block mt-6 px-5 py-2 rounded-full bg-ink text-paper text-sm">Volver a proyectos</Link>
    </div>
  )

  const preview = {
    subastas: <AuctionPreview />,
    tickets: <TicketsPreview />,
    prepaga: <PrepagaPreview />,
    "legacy-web": <LegacyPreview />,
    "company-workspace": <WorkspacePreview />,
  }[p.slug] ?? null

  const isLive = p.demoStatus === "LIVE_DEMO"
  const isLocal = p.demoStatus === "LOCAL_DEMO"

  // Texto del preview: evita concatenaciones anidadas en JSX que causan TS1005
  const previewPreviewText = isLocal
    ? "Preview marketing del hub. La demo completa está lista localmente; publicación pendiente."
    : isLive
    ? `La demo completa ya está disponible en ${p.demoUrl}`
    : `Preview marketing del hub. La demo completa vivirá en ${p.publicUrl} cuando el proyecto ${p.id}-demo esté listo.`

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 pt-8">
        <Link to="/proyectos" className="text-[13px] underline decoration-line underline-offset-4">← Proyectos</Link>
        <div className="mt-6 rounded-[20px] border hairline overflow-hidden bg-white">
          <div className="grid md:grid-cols-[1.15fr_.85fr]">
            <div className="p-7 md:p-8">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{background:p.color}} />
                <span className="tracking-[0.12em] uppercase text-stone">{p.subtitle}</span>
                <span className="ml-auto font-mono text-[10px] px-2 py-1 rounded-full border hairline">{p.year}</span>
              </div>
              <h1 className="font-display text-[32px] md:text-[40px] tracking-[-0.03em] leading-none mt-3">{p.title}</h1>
              <p className="text-[14px] text-ink-light mt-3 leading-relaxed max-w-[50ch]">{p.description} — preview marketing liviano. La demo oficial vive en su proyecto independiente.</p>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[12px]">
                <div className="rounded-[12px] border hairline bg-paper-2 p-3"><div className="font-mono text-[10px] tracking-widest uppercase text-stone">Qué es</div><div className="mt-1 leading-snug">{p.what}</div></div>
                <div className="rounded-[12px] border hairline bg-paper-2 p-3"><div className="font-mono text-[10px] tracking-widest uppercase text-stone">Problema</div><div className="mt-1 leading-snug">{p.problem}</div></div>
                <div className="rounded-[12px] border hairline bg-white p-3"><div className="font-mono text-[10px] tracking-widest uppercase text-stone">Probar</div><div className="mt-1 leading-snug">{p.try}</div><div className="mt-1 font-mono text-[11px] text-stone">{p.status} · {p.demoStatus}</div></div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
                <span className={`px-3 py-1 rounded-full border ${p.statusTone==="live"?"bg-moss text-white border-moss":"bg-paper-2"}`}>{p.status}</span>
                <span className="px-3 py-1 rounded-full border hairline font-mono">{isLocal ? "Demo lista · publicación pendiente" : isLive ? "Demo publicada" : <>{p.publicUrl} <span className="opacity-50">· no publicado</span></>}</span>
                <span className="px-3 py-1 rounded-full bg-paper-3 border hairline">Hub · Preview</span>
              </div>

              <div className="mt-3 text-[11px] text-stone">Arquitectura: <span className="font-mono bg-paper-2 px-1.5 py-0.5 rounded border hairline">{p.demoStatus}</span> — {isLive ? "Abre demo pública" : isLocal ? "Demo lista · publicación pendiente" : "Solo preview interno"}</div>

              <div className="mt-8 flex gap-3 flex-wrap">
                {isLive ? (
                  <a href={getDemoUrl(p, p.href)} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-ink text-paper text-[13px] font-medium hover:bg-black transition">Probar demo ↗</a>
                ) : (
                  <a href="#preview" className="px-5 py-2.5 rounded-full bg-ink text-paper text-[13px] font-medium">Ver preview ↓</a>
                )}
                <a href={getProjectUrl(p.slug, p.href)} onClick={e=>{ e.preventDefault(); document.getElementById("preview")?.scrollIntoView({behavior:"smooth"})}} className="px-5 py-2.5 rounded-full border hairline text-[13px] bg-paper-2">Ver recorrido</a>
                {isLive && <span className="self-center text-[11px] font-mono text-moss">LIVE_DEMO → {p.demoUrl ?? `https://${p.publicUrl}`}</span>}
                {isLocal && <span className="self-center text-[11px] font-mono text-stone">LOCAL_DEMO — Demo lista · publicación pendiente</span>}
                {!isLive && !isLocal && <span className="self-center text-[11px] font-mono text-stone">PREVIEW — demo oficial aún no creada</span>}
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {["Portada","Recorrido","Preview"].map((k,i)=>(
                  <div key={k} className="rounded-[12px] border hairline bg-paper-2 p-3">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-stone">0{i+1}</div>
                    <div className="font-display text-[13px] mt-1">{k}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l hairline p-6 md:p-7 flex flex-col justify-center" style={{background:p.bg}}>
              <div className="bg-white rounded-[16px] border hairline p-4">
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-stone">Portada / Captura</div>
                <div className="mt-3 h-[160px] rounded-[12px] border hairline bg-paper-2 grid place-items-center text-stone text-[12px] text-center p-4">
                  <span>Captura editorial de {p.title}<br/><span className="font-mono text-[11px]">— espacio para screenshot real —</span></span>
                </div>
                <div className="mt-3 flex gap-2 text-[11px]">
                  <span className="px-2 py-1 rounded-full bg-ink text-paper">Estado: {p.statusTone}</span>
                  <span className="px-2 py-1 rounded-full border hairline">{p.demoStatus}</span>
                </div>
                <div className="mt-3 text-[11px] font-mono text-stone break-all">{isLocal ? "Demo lista · publicación pendiente" : isLive ? "Demo publicada" : getProjectUrl(p.slug, p.href) + " → " + p.publicUrl + " (no publicado)"}</div>
              </div>
              <div className="mt-4 text-[11px] text-stone leading-relaxed">Hub no importa código de otros proyectos. Solo metadata/URL. Ver <span className="font-mono">src/config/domains.ts</span>.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recorrido visual */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 mt-6">
        <div className="rounded-[20px] border hairline bg-white p-6 md:p-8">
          <h2 className="font-display text-[20px]">Recorrido visual</h2>
          <p className="text-[13px] text-ink-light mt-1">Entendible casi sin leer. Tres momentos clave.</p>
          <div className="mt-6 grid md:grid-cols-3 gap-4">
            {[1,2,3].map(n=>(
              <div key={n} className="rounded-[16px] border hairline overflow-hidden">
                <div className="h-[140px] bg-paper-2 grid place-items-center font-mono text-[11px] text-stone">Visual {n} — {p.title}</div>
                <div className="p-4">
                  <div className="font-display text-[14px]">Paso {n}</div>
                  <div className="text-[12px] text-ink-light leading-relaxed mt-1">Breve frase que explica sin párrafo. Visual al centro.</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview — NO es la demo oficial */}
      <div id="preview" className="max-w-[1280px] mx-auto px-6 md:px-8 mt-6">
        <div className="rounded-[20px] border hairline bg-white overflow-hidden">
          <div className="px-6 md:px-8 py-4 flex items-center justify-between border-b hairline bg-paper-2/60">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-clay" />
              <span className="font-display text-[15px]">Preview</span>
              <span className="hidden sm:inline text-[11px] px-2 py-0.5 rounded-full bg-white border hairline text-stone">Marketing · Hub · No es la demo oficial</span>
            </div>
            <span className="font-mono text-[11px] text-stone hidden sm:inline">Interacción ligera · Datos ficticios</span>
          </div>
          <div className="p-4 md:p-6 bg-paper">
            {preview}
          </div>
          <div className="px-6 py-3 bg-white border-t hairline text-[11px] text-stone flex flex-col sm:flex-row gap-2 justify-between">
            <span className="flex gap-2"><span>◎</span> <span>{previewPreviewText}</span></span>
            {isLive ? (
              <a href={getDemoUrl(p, p.href)} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1 rounded-full bg-ink text-paper text-center">Abrir demo pública ↗</a>
            ) : (
              <span className="shrink-0 px-3 py-1 rounded-full bg-paper-2 border hairline text-center font-mono">{p.demoStatus} — {isLocal ? "publicación pendiente" : "solo preview"}</span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 md:px-8 mt-6 flex justify-between text-[13px]">
        <Link to="/proyectos" className="underline decoration-line underline-offset-4">← Todos los proyectos</Link>
        <Link to="/lab" className="underline decoration-line underline-offset-4">Lab →</Link>
      </div>
    </div>
  )
}
