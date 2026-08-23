import { cv } from "../data/cv"

export default function CV(){
  return (
    <div className="max-w-[860px] mx-auto px-6 md:px-8 py-10 print:py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        <div className="w-[88px] h-[88px] rounded-[18px] border hairline bg-white grid place-items-center shrink-0 overflow-hidden">
          {/* placeholder avatar — reemplazar con /fotos/federico-profile.webp */}
          <div className="w-full h-full grid place-items-center bg-paper-2 text-stone">
            <span className="font-display text-[22px] tracking-[-0.02em]">FL</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-stone">
            <span className="w-6 h-px bg-line" /> CV · {cv.location}
          </div>
          <h1 className="font-display text-[34px] md:text-[40px] tracking-[-0.03em] leading-none mt-2">{cv.name}</h1>
          <div className="text-[13px] text-ink-light mt-2 leading-relaxed">{cv.title}</div>
          <div className="text-[13px] font-display text-ink-2 mt-3 leading-relaxed max-w-[60ch]">{cv.headline}</div>
          <div className="mt-4 flex flex-wrap gap-2 text-[12px]">
            <a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border hairline bg-white hover:bg-paper-2">LinkedIn ↗</a>
            <a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border hairline bg-white hover:bg-paper-2">GitHub ↗</a>
            {cv.hasPdf && <a href={cv.pdfPath} download className="px-3 py-1.5 rounded-full bg-ink text-paper hover:bg-black">Descargar CV ↓</a>}
          </div>
        </div>
      </div>

      {/* Perfil */}
      <div className="mt-8 rounded-[16px] border hairline bg-white p-6 print:border print:shadow-none">
        <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Perfil</div>
        <p className="text-[13.5px] leading-relaxed mt-2 text-ink-2 max-w-[70ch]">{cv.summary}</p>
        <div className="mt-3 text-[12px] text-stone leading-relaxed">C# · .NET · SQL / SQL Server · REST APIs · sistemas enterprise · integraciones · facturación electrónica · testing automatizado · arquitectura mantenible · desarrollo asistido con IA.</div>
      </div>

      {/* Experiencia */}
      <div className="mt-6 rounded-[16px] border hairline bg-white p-6">
        <div className="flex items-baseline justify-between">
          <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Experiencia</div>
          <div className="font-mono text-[11px] text-stone">20+ años</div>
        </div>
        {cv.experience.map(e=>(
          <div key={e.org} className="mt-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-display text-[18px] tracking-[-0.01em]">{e.role}</span>
              <span className="text-stone">·</span>
              <span className="font-medium text-[13px]">{e.org}</span>
              <span className="ml-auto font-mono text-[11px] text-stone">{e.period} · {e.location}</span>
            </div>
            <div className="text-[12px] text-ink-light mt-1 leading-relaxed">{e.summary}</div>
            <ul className="mt-3 grid gap-1.5 text-[13px] leading-relaxed text-ink-2 list-disc pl-5 marker:text-stone">
              {e.bullets.map(b=> <li key={b}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Proyectos relevantes */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {cv.relevantProjects.map(p=>(
          <div key={p.title} className="rounded-[16px] border hairline bg-paper-2 p-5">
            <div className="font-display text-[14px] leading-tight">{p.title}</div>
            <div className="text-[12px] text-ink-light mt-2 leading-relaxed">{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div className="mt-6 rounded-[16px] border hairline bg-white p-6">
        <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Skills</div>
        <div className="mt-4 grid md:grid-cols-2 gap-6 text-[12px]">
          <div>
            <div className="font-medium text-ink">Core</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{cv.skills.core.map(s=> <span key={s} className="px-2.5 py-1 rounded-full bg-paper-2 border hairline">{s}</span>)}</div>
          </div>
          <div>
            <div className="font-medium text-ink">Calidad</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{cv.skills.quality.map(s=> <span key={s} className="px-2.5 py-1 rounded-full bg-paper-2 border hairline">{s}</span>)}</div>
          </div>
          <div>
            <div className="font-medium text-ink">Tooling & Data</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{[...cv.skills.tooling, ...cv.skills.data].map(s=> <span key={s} className="px-2.5 py-1 rounded-full bg-paper-2 border hairline">{s}</span>)}</div>
          </div>
          <div>
            <div className="font-medium text-ink">IA</div>
            <div className="mt-2 flex flex-wrap gap-1.5">{cv.skills.ai.map(s=> <span key={s} className="px-2.5 py-1 rounded-full bg-ink text-paper">{s}</span>)}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-[16px] border hairline bg-white p-5">
          <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Idiomas</div>
          <div className="mt-3 space-y-2 text-[13px]">
            {cv.languages.map(l=> <div key={l.lang} className="flex justify-between gap-2"><span className="font-medium">{l.lang}</span><span className="text-stone text-[12px]">{l.level}</span></div>)}
          </div>
        </div>
        <div className="rounded-[16px] border hairline bg-white p-5">
          <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Educación</div>
          <div className="font-display text-[14px] mt-3">{cv.education.title}</div>
          <div className="text-[12px] text-stone">{cv.education.place}</div>
        </div>
        <div className="rounded-[16px] border hairline bg-white p-5">
          <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Certificación</div>
          <div className="font-display text-[14px] mt-3">{cv.certification.title}</div>
          <div className="text-[12px] text-stone">{cv.certification.issuer} · {cv.certification.year}</div>
        </div>
      </div>

      {/* Contacto */}
      <div className="mt-6 rounded-[16px] border hairline bg-ink text-paper p-6 flex flex-col md:flex-row gap-4 justify-between print:bg-white print:text-ink print:border">
        <div>
          <div className="font-mono text-[11px] tracking-widest uppercase opacity-60 print:text-stone">Contacto</div>
          <div className="font-display text-[16px] mt-1">Hablemos</div>
          <div className="text-[12px] opacity-70 print:opacity-100 print:text-stone mt-1">Respuesta breve. Sin formularios por ahora.</div>
        </div>
        <div className="flex flex-wrap gap-2 self-start md:self-center">
          <a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-white text-ink text-[13px] print:border">LinkedIn</a>
          <a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full border border-white/20 text-white text-[13px] print:border print:text-ink">GitHub</a>
        </div>
      </div>

      <div className="mt-4 text-center text-[11px] font-mono text-stone print:hidden">Imprimí esta página (Ctrl+P) para guardar como PDF — CSS print optimizado.</div>

      <style>{`@media print {
        header, footer, nav { display: none !important; }
        body { background: #fff !important; }
        a { text-decoration: none !important; }
        .paper-texture { background: #fff !important; }
      }`}</style>
    </div>
  )
}
