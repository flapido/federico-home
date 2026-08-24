import { Link } from "react-router-dom"
import { projects } from "../data/projects"
import { labItems } from "../data/projects"

export default function Home() {
  return (
    <div>
      {/* Hero — menos texto, más identidad */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 pt-8 md:pt-12 pb-6">
        <div className="grid md:grid-cols-[1.45fr_.85fr] gap-8 md:gap-10 items-start">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-stone">
              <span className="w-6 h-px bg-line inline-block" /> Casa digital · Buenos Aires, Argentina
            </div>
            <h1 className="font-display font-[300] tracking-[-0.04em] leading-[0.9] text-[44px] md:text-[76px] lg:text-[86px] mt-3">
              Federico<br />
              <span className="italic font-[500]">Lapido.</span>
            </h1>
            <p className="font-display text-[19px] md:text-[22px] leading-[1.35] tracking-[-0.01em] mt-5 max-w-[30ch] text-ink-2">
              Ideas convertidas en
              <span className="relative inline-block ml-2">
                <span className="relative z-10">cosas que funcionan.</span>
                <span className="absolute left-0 right-0 bottom-[0.2em] h-[0.45em] bg-[#C07A5A1A] -rotate-[0.5deg]" aria-hidden />
              </span>
            </p>
            <div className="mt-3 text-[12px] text-stone flex items-center gap-2">
              <span className="w-7 h-px bg-line" />
              <span>Software Engineer · Backend · Integraciones</span>
              <span className="opacity-40">·</span>
              <span className="hidden sm:inline">Más de 20 años · WiseTech Global</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/proyectos" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-[11px] rounded-full text-[14px] font-medium hover:bg-black transition">
                Explorar proyectos <span aria-hidden>→</span>
              </Link>
              <a href="#proyectos" className="inline-flex items-center px-5 py-[11px] rounded-full border hairline text-[13px] bg-white/70 hover:bg-white transition">Ver showroom ↓</a>
              <a href="https://wa.me/5491157642626?text=Hola%20Federico%2C%20vengo%20de%20tu%20p%C3%A1gina%20y%20quer%C3%ADa%20contactarte%20por..." className="inline-flex items-center px-5 py-[11px] rounded-full border border-brass/30 bg-brass/10 text-terracotta hover:bg-brass/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-paper transition-colors" aria-label="WhatsApp de Federico Lapido" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" focusable="false">
                  <path d="M17.227 1.5a2.72 2.72 0 0 0-1.735-.951l-2.192.695a2.72 2.72 0 0 0-.6.868l.838 2.119a2.72 2.72 0 0 0 1.132 1.82l2.194.6a2.72 2.72 0 0 0 .909-.598l-.856-2.236a2.72 2.72 0 0 0-.604-.787l-2.26-.555a2.72 2.72 0 0 0-1.078-.1zM5.098 4.63a1.98 1.98 0 0 1 .038 2.966l2.16 1.56c.568.412.052.926-.823.823h-3.372l.608-2.156a1.98 1.98 0 0 1 2.028-1.833l2.16-1.56c.539-.39.023-.858-.786-.858h-1.288a1.98 1.98 0 0 1-1.978-1.978ZM9.853 1.5a2.22 2.22 0 0 1 1.558 0l2.187.685a2.22 2.22 0 0 1 .294 2.195l-1.25 2.66c-.168.355-.53.534-.839.307l-2.335-1.073a2.22 2.22 0 0 1-.117-2.255l2.186-.685a2.22 2.22 0 0 1 1.557 0l2.188.685c.302.001.587.013.839-.306l1.25-2.66a2.22 2.22 0 0 1 .294-2.195l-1.25-2.66c-.309-.537-.574-.717-.839-.306l-2.335 1.073Zm-5.044 0a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[11px] font-mono text-stone">
              <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-moss animate-pulse" /> 5 proyectos · previews</span>
              <span className="w-px h-3 bg-line" />
              <span>Lab · Sobre mí · Contacto</span>
            </div>
          </div>

          {/* Identidad visual propia — foto placeholder + monograma + índice */}
          <div className="relative md:pt-1">
            <div className="absolute -inset-3 bg-paper-3 rounded-[24px] rotate-[1deg] hidden md:block" aria-hidden />
            <div className="absolute -inset-3 bg-white rounded-[24px] rotate-[-0.8deg] border hairline hidden md:block" aria-hidden />
            <div className="relative bg-white border hairline rounded-[20px] overflow-hidden">
              {/* Foto placeholder elegante */}
<div className="h-[180px] bg-paper-2 border-b hairline relative overflow-hidden flex items-center gap-4 px-6">
<div className="w-[180px] h-[180px] rounded-[20px] border-2 border-white bg-white shadow-sm grid place-items-center overflow-hidden shrink-0">
<img src="/fotos/federico-profile.jpg" alt="Federico Lapido" className="w-full h-full object-cover object-position-20% 35%" onError={e=>{(e.target as HTMLImageElement).style.display='none'}} />
<span className="font-display text-[28px] tracking-[-0.02em] text-stone">FL</span>
</div>
<div className="text-[15px] leading-tight">
<div className="font-display text-[16px]">Persona real detrás</div>
<div className="text-stone mt-1">Buenos Aires · Construyo sistemas que funcionan en producción.</div>
</div>
</div>
                <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full border border-brass/20 hidden md:block" aria-hidden />
              </div>
              <div className="px-6 pt-4 pb-4">
                <div className="text-[11px] tracking-[0.14em] uppercase text-stone flex items-center justify-between">
                  <span>Índice</span><span className="font-mono text-[10px]">005 · Hub</span>
                </div>
                <div className="mt-3 space-y-2.5 font-display text-[15px] leading-none">
                  {projects.map((p,i)=> (
                    <Link key={p.slug} to={p.href} className="flex items-baseline justify-between gap-4 group py-2 border-b last:border-0 hairline hover:pl-1 transition-all">
                      <span className="flex gap-3"><span className="font-mono text-[11px] text-stone mt-[3px]">{String(i+1).padStart(2,"0")}</span> <span className="group-hover:italic transition">{p.title}</span></span>
                      <span className="text-stone text-[11px]">↗</span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4 flex gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-1 rounded-full bg-paper-2 border hairline">Visual</span>
                  <span className="px-2 py-1 rounded-full bg-paper-2 border hairline">Interactivo</span>
                  <span className="px-2 py-1 rounded-full bg-ink text-paper">Preview</span>
                </div>
              </div>
              <div className="h-[64px] bg-ink text-paper px-6 flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] tracking-widest uppercase opacity-60">Siguiente</div>
                  <div className="font-display text-[14px]">Lab — cosas que exploro →</div>
                </div>
                <Link to="/lab" className="w-8 h-8 rounded-full bg-white text-ink grid place-items-center text-[12px]">→</Link>
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full border border-brass/30 hidden md:grid place-items-center bg-paper/80 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-brass" />
            </div>
          </div>
        </div>
      </section>

      {/* Showroom — proyectos */}
      <section id="proyectos" className="max-w-[1280px] mx-auto px-6 md:px-8 py-6 md:py-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-[22px] md:text-[28px] tracking-[-0.02em]">Proyectos <span className="text-stone font-[300]">— el centro del showroom</span></h2>
          <Link to="/proyectos" className="text-[12px] tracking-wide underline underline-offset-4 decoration-line hover:decoration-ink">Ver todos →</Link>
        </div>
        <p className="text-[12px] text-stone mt-1">Qué es · Qué resuelve · Qué podés probar · En qué estado está — sin párrafos.</p>

        <div className="mt-5 grid md:grid-cols-12 gap-4 md:gap-5 auto-rows-[280px]">
          <Link to="/proyectos/subastas" className="md:col-span-7 group relative overflow-hidden rounded-[20px] border hairline bg-white flex flex-col hover:shadow-sm transition">
            <div className="flex-1 p-6 md:p-7 flex flex-col">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="w-2 h-2 rounded-full" style={{background: projects[0].color}} />
                <span className="tracking-[0.12em] uppercase text-stone">Subastas · Lotes, oferta, historial, tiempo</span>
                <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded-full border hairline">{projects[0].demoStatus}</span>
              </div>
              <h3 className="font-display text-[26px] md:text-[30px] tracking-[-0.02em] mt-2 leading-none">Sistema de Subastas</h3>
              <p className="text-[13px] text-ink-light mt-2 max-w-[38ch] leading-relaxed">De planilla caótica a subasta clara. Preview con puja y cierre simulado · demo publicada.</p>
              <div className="mt-auto pt-5">
                <div className="rounded-[14px] border hairline bg-paper-2 p-3 flex gap-2 overflow-hidden">
                  <div className="flex-1 bg-white rounded-[10px] border hairline p-3">
                    <div className="h-2 w-16 bg-ink/10 rounded mb-2" />
                    <div className="h-6 bg-ink text-paper rounded-full grid place-items-center text-[11px]">Puja $ 42.500 →</div>
                    <div className="mt-2 flex gap-1.5 text-[10px] font-mono text-stone"><span>08:42</span><span>—</span><span className="text-ink">+ $1.200</span></div>
                  </div>
                  <div className="hidden sm:block flex-1 bg-white rounded-[10px] border hairline p-3">
                    <div className="text-[11px] font-medium">Lote #184 · Reloj suizo</div>
                    <div className="mt-1 h-1.5 bg-line rounded-full overflow-hidden"><div className="h-full w-[68%] bg-clay rounded-full" /></div>
                    <div className="mt-1 text-[10px] text-stone font-mono">Cierra en 02:14 · Estado: Abierto</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-9 px-6 flex items-center justify-between text-[12px] border-t hairline bg-paper-2/60">
              <span className="text-stone">Qué ver: lotes · oferta · historial · cierre</span><span className="group-hover:translate-x-0.5 transition">↗</span>
            </div>
          </Link>

          <Link to="/proyectos/tickets" className="md:col-span-5 group relative overflow-hidden rounded-[20px] border hairline bg-moss text-paper flex flex-col hover:shadow-sm transition">
            <div className="p-6 md:p-7 flex-1">
              <div className="text-[11px] tracking-[0.12em] uppercase opacity-70">Tickets · Prioridad, estado, responsable</div>
              <h3 className="font-display text-[24px] mt-2 leading-none">Sistema de Tickets</h3>
              <p className="text-[13px] opacity-80 mt-2 leading-relaxed">Flujo visual de reporte a resolución. Sin texto.</p>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {["Abierto","En proceso","Resuelto"].map(k=>(
                  <div key={k} className="bg-white/10 rounded-[12px] p-2.5 border border-white/10">
                    <div className="text-[10px] tracking-wide uppercase opacity-70">{k}</div>
                    <div className="mt-2 space-y-1.5">
                      <div className="h-6 bg-white rounded-full" />
                      <div className="h-6 bg-white/80 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-9 px-6 flex items-center justify-between text-[12px] border-t border-white/10">
              <span className="opacity-80">Prioridades · Estados · Seguimiento</span><span>↗</span>
            </div>
          </Link>

          <Link to="/proyectos/prepaga" className="md:col-span-5 group rounded-[20px] border hairline bg-white overflow-hidden flex hover:shadow-sm transition">
            <div className="flex-1 p-6 md:p-7">
              <div className="text-[11px] tracking-[0.12em] uppercase text-stone">Prepaga · Selección, saldo, confirmación</div>
              <h3 className="font-display text-[24px] mt-2 leading-none">Venta Prepaga</h3>
              <p className="text-[13px] text-ink-light mt-2">2 toques y listo. Preview phone con importe y saldo.</p>
              <div className="mt-4 inline-flex items-center gap-2 text-[12px] border hairline rounded-full px-3 py-1.5">Mobile · Ver flujo <span>↗</span></div>
            </div>
            <div className="w-[140px] bg-paper-2 border-l hairline p-3 hidden sm:flex flex-col items-center">
              <div className="w-[112px] h-[168px] rounded-[18px] border-[6px] border-ink bg-white overflow-hidden relative">
                <div className="h-2 bg-ink/10 m-2 rounded" />
                <div className="mx-2 space-y-1.5"><div className="h-12 bg-paper-3 rounded-xl border hairline" /><div className="h-8 bg-ink rounded-full grid place-items-center text-[10px] text-white">Comprar $4.200</div></div>
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-ink/20 rounded-full" />
              </div>
            </div>
          </Link>

          <Link to="/proyectos/legacy-web" className="md:col-span-7 group rounded-[20px] border hairline overflow-hidden bg-paper-2 flex flex-col hover:shadow-sm transition">
            <div className="flex-1 grid grid-cols-2">
              <div className="p-6 md:p-7 bg-[#EAE6DE] border-r hairline">
                <div className="text-[10px] font-mono tracking-widest uppercase text-stone">Antes</div>
                <div className="mt-3 bg-white border hairline rounded-[10px] p-3 shadow-sm">
                  <div className="h-2 w-10 bg-ink/20 rounded mb-2" />
                  <div className="grid grid-cols-3 gap-1"><div className="h-8 bg-ink/5 border hairline rounded" /><div className="h-8 bg-ink/5 border hairline rounded" /><div className="h-8 bg-ink/5 border hairline rounded" /></div>
                  <div className="mt-2 text-[9px] font-mono text-stone">App.Desktop.exe — 2008</div>
                </div>
              </div>
              <div className="p-6 md:p-7 bg-white">
                <div className="text-[10px] font-mono tracking-widest uppercase text-stone">Después</div>
                <div className="mt-3 bg-ink text-paper rounded-[10px] p-3">
                  <div className="h-2 w-16 bg-white/20 rounded mb-2" />
                  <div className="h-6 bg-white text-ink rounded-full grid place-items-center text-[11px]">Web moderna</div>
                  <div className="mt-2 text-[10px] font-mono opacity-60">→ responsive · clara · sin fricción</div>
                </div>
              </div>
            </div>
            <div className="h-9 px-6 flex items-center justify-between text-[12px] border-t hairline bg-white">
              <span className="font-display">Legacy → Web — deslizador protagonista</span><span className="group-hover:translate-x-0.5 transition">↗</span>
            </div>
          </Link>

          <Link to="/proyectos/company-workspace" className="md:col-span-12 group rounded-[20px] border hairline bg-ink text-paper overflow-hidden hover:shadow-sm transition">
            <div className="grid md:grid-cols-[1.1fr_.9fr] gap-0">
              <div className="p-6 md:p-8">
                <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase opacity-60"><span className="w-2 h-2 rounded-full bg-brass" /> Pieza especial</div>
                <h3 className="font-display text-[26px] md:text-[30px] mt-2 leading-none">Company Workspace</h3>
                <p className="text-[13px] opacity-70 mt-2 max-w-[46ch]">Una empresa virtual para construir software. Visual, sin párrafos.</p>
                <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                  {["producto","arquitectura","diseño","desarrollo","QA","seguridad","release"].map(r=>(
                    <span key={r} className="px-2.5 py-1 rounded-full bg-white/10 border border-white/10">{r}</span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-[12px] border border-white/15 rounded-full px-4 py-2 group-hover:bg-white group-hover:text-ink transition">Explorar orbital →</div>
              </div>
              <div className="p-6 md:p-8 bg-white/5 border-t md:border-t-0 md:border-l border-white/10 flex items-center justify-center">
                <div className="relative w-[220px] h-[220px]">
                  <div className="absolute inset-0 rounded-full border border-white/10" />
                  <div className="absolute inset-6 rounded-full border border-white/10" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-16 h-16 rounded-full bg-brass text-ink grid place-items-center font-mono text-[10px] leading-none text-center">CW<br/>OS</div>
                  </div>
                  {Array.from({length:7}).map((_,i)=>{
                    const angle = (i*360/7)-90
                    const r=86
                    const x= 110 + r*Math.cos(angle*Math.PI/180)
                    const y= 110 + r*Math.sin(angle*Math.PI/180)
                    return <div key={i} className="absolute w-8 h-8 rounded-full bg-white text-ink grid place-items-center text-[9px] font-mono border" style={{left:x-16, top:y-16}}>{i+1}</div>
                  })}
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Lab teaser */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[20px] md:text-[24px] tracking-[-0.02em]">Lab <span className="text-stone font-[300]">— cosas que exploro</span></h2>
          <Link to="/lab" className="text-[12px] underline decoration-line underline-offset-4 hover:decoration-ink">Ver Lab →</Link>
        </div>
        <div className="mt-4 grid md:grid-cols-3 gap-3">
          {labItems.slice(0,3).map(item=>(
            <div key={item.id} className="rounded-[14px] border hairline bg-white p-4">
              <div className="flex items-center gap-2 text-[11px]"><span className="w-2 h-2 rounded-full" style={{background:item.color}} /><span className="font-mono uppercase text-stone">{item.tag}</span><span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-paper-2 border hairline">{item.status}</span></div>
              <div className="font-display text-[14px] mt-2">{item.title}</div>
              <div className="text-[12px] text-ink-light mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sobre mí teaser */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <div className="rounded-[20px] border hairline bg-white p-6 md:p-8 grid md:grid-cols-[1.2fr_.8fr] gap-6 items-center">
          <div>
            <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Sobre mí</div>
            <div className="font-display text-[20px] mt-1 leading-tight">Construyo cosas, pruebo ideas y me interesa cómo funcionan los sistemas.</div>
            <div className="text-[12px] text-stone mt-2">Buenos Aires · Detalle profesional en CV.</div>
          </div>
          <div className="flex gap-2 justify-start md:justify-end">
            <Link to="/about" className="px-5 py-2.5 rounded-full border hairline text-[13px] bg-paper-2">Sobre mí →</Link>
            <Link to="/cv" className="px-5 py-2.5 rounded-full bg-ink text-paper text-[13px]">CV</Link>
          </div>
        </div>
      </section>

      {/* Contacto — sin formulario backend */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
        <div className="rounded-[20px] border hairline bg-ink text-paper p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <div className="font-mono text-[11px] tracking-widest uppercase opacity-60">Contacto</div>
            <div className="font-display text-[22px] mt-1">Hablemos</div>
            <div className="text-[13px] opacity-70 mt-1 max-w-[40ch] leading-relaxed">Sin marketing desesperado. Si algo de acá te sirve, escribí.</div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* GitHub */}
            <a href="https://github.com/flapido" className="flex items-center gap-2 px-4 py-2 rounded-full border border-brass/30 bg-brass/10 text-terracotta hover:bg-brass/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-paper transition-colors" target="_blank" rel="noopener noreferrer" aria-label="GitHub de Federico Lapido">
              <svg viewBox="0 0 19 19" fill="currentColor" width="16" height="16" focusable="false">
                <path d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1.009-.077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844"/>
              </span>
              GitHub
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/federico-lapido" className="flex items-center gap-2 px-4 py-2 rounded-full border border-brass/30 bg-brass/10 text-terracotta hover:bg-brass/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-paper transition-colors" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn de Federico Lapido">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" focusable="false">
                <path d="M15 11.593v2.806c0 .387.316.7 .7 .7h2.5c.387 0 .7-.313.7-.7V7.5c0-.387-.313-.7-.7-.7h-2.5c-.387 0-.7.313-.7.7v2.552m0-11.593a4.08 4.08 0 1 0 0 8.164 4.08 4.08 0 0 0 0-8.164ZM7.11 7.583a1.96 1.96 0 1 1 0 3.922 1.96 1.96 0 0 1 0-3.922Zm5.856 0a1.96 1.96 0 1 1 0 3.922 1.96 1.96 0 0 1 0-3.922Z"/>
              </span>
              LinkedIn
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/5491157642626?text=Hola%20Federico%2C%20vengo%20de%20tu%20página%20y%20quería%20contactarte%20por..." className="flex items-center gap-2 px-4 py-2 rounded-full border border-brass/30 bg-brass/10 text-terracotta hover:bg-brass/20 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-paper transition-colors" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp de Federico Lapido">
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" focusable="false">
                <path d="M17.227 1.5a2.72 2.72 0 0 0-1.735-.951l-2.192.695a2.72 2.72 0 0 0-.6.868l.838 2.119a2.72 2.72 0 0 0 1.132 1.82l2.194.6a2.72 2.72 0 0 0 .909-.598l-.856-2.236a2.72 2.72 0 0 0-.604-.787l-2.26-.555a2.72 2.72 0 0 0-1.078-.1zM5.098 4.63a1.98 1.98 0 0 1 .038 2.966l2.16 1.56c.568.412.052.926-.823.823h-3.372l.608-2.156a1.98 1.98 0 0 1 2.028-1.833l2.16-1.56c.539-.39.023-.858-.786-.858h-1.288a1.98 1.98 0 0 1-1.978-1.978ZM9.853 1.5a2.22 2.22 0 0 1 1.558 0l2.187.685a2.22 2.22 0 0 1 .294 2.195l-1.25 2.66c-.168.355-.53.534-.839.307l-2.335-1.073a2.22 2.22 0 0 1-.117-2.255l2.186-.685a2.22 2.22 0 0 1 1.557 0l2.188.685c.302.001.587.013.839-.306l1.25-2.66a2.22 2.22 0 0 1 .294-2.195l-1.25-2.66c-.309-.537-.574-.717-.839-.306l-2.335 1.073Zm-5.044 0a2.22 2.22 0 1 0 0 4.44 2.22 2.22 0 0 0 0-4.44Z"/>
              </span>
              WhatsApp
            </a>
            {/* CV */}
            <a href="/cv" className="flex items-center gap-2 px-4 py-2 rounded-full border border-brass/30 bg-brass/10 text-terracotta hover:bg-brass/20 hover:text-ink transition">CV</a>
          </div>
        </div>
        <div className="mt-3 text-center text-[11px] font-mono text-stone">Hecho a mano en Buenos Aires · Hospedable en tu propia PC · Sin neón</div>
      </section>
    </div>
  )
}
