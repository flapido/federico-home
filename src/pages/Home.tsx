import { Link } from "react-router-dom"
import ExpertiseGrid from "../components/ExpertiseGrid"
import SectionHeading from "../components/SectionHeading"
import Workflow from "../components/Workflow"
import { aiWorkflow, cv, legacyWorkflow, workMethod } from "../data/cv"
import { projects } from "../data/projects"

const impactItems = [
  ["20+ YEARS", "Software Engineering"],
  ["ENTERPRISE", "Production Systems"],
  ["BACKEND", "C# · .NET · Python · Java"],
  ["ARCHITECTURE", "APIs · Integrations · Microservices"],
  ["AI", "LLMs · Agents · Automation"],
  ["MODERNIZATION", "Legacy → Modern Systems"],
]

export default function Home() {
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3)
  const experience = cv.experience[0]

  return (
    <div>
      <section className="mx-auto max-w-[1280px] px-5 pb-8 pt-8 sm:px-6 md:px-8 md:pb-12 md:pt-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.22fr_.78fr] md:gap-12">
          <div className="max-w-[760px]">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-stone"><span className="h-px w-7 bg-line" /> Buenos Aires, Argentina</div>
            <h1 className="mt-4 font-display text-[46px] leading-[.93] tracking-[-0.055em] sm:text-[58px] md:text-[70px]">Federico <span className="italic font-[400]">Lapido</span></h1>
            <p className="mt-5 font-display text-[24px] leading-[1.08] tracking-[-0.025em] text-ink-2 sm:text-[28px]">Senior Software Engineer</p>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-clay-dark sm:text-[16px]">Backend · Architecture · Integrations · AI Engineering</p>
            <p className="mt-4 max-w-[60ch] text-[15px] leading-relaxed text-ink-2">Más de 20 años construyendo, manteniendo y modernizando software empresarial.</p>
            <p className="mt-3 max-w-[68ch] text-[12px] leading-relaxed text-ink-light">C#/.NET · Python · Java · APIs · SQL · Microservices · AI Agents · Legacy Modernization</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href="#experiencia" className="rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper transition-colors hover:bg-ink-2">Ver experiencia ↓</a>
              <a href="#proyectos-destacados" className="rounded-full border hairline bg-white px-5 py-3 text-[13px] font-medium transition-colors hover:bg-paper-2">Ver proyectos</a>
              <a href={cv.pdfPath} download className="rounded-full border hairline bg-paper-2 px-5 py-3 text-[13px] font-medium transition-colors hover:bg-paper-3">Descargar CV</a>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-ink-light"><a href="#expertise" className="underline decoration-line underline-offset-4 hover:text-ink">Technical Expertise</a><a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">GitHub ↗</a><a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 hover:text-ink">LinkedIn ↗</a></div>
          </div>
          <figure className="relative mx-auto w-full max-w-[380px] md:max-w-none">
            <div className="absolute -inset-3 rounded-[28px] border border-brass/30 bg-brass/10" aria-hidden="true" />
            <img src="/fotos/federico-profile.jpg" alt="Federico Lapido" className="relative aspect-[4/4.25] w-full rounded-[22px] border hairline bg-paper-2 object-cover object-[50%_28%]" />
            <figcaption className="relative mt-3 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.12em] text-stone"><span>Software engineering</span><span>BA · AR</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y hairline bg-paper-2/60">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between md:px-8"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-clay-dark">Soluciones y servicios</div><h2 className="mt-2 font-display text-[28px] leading-none">Software que puedo adaptar a tu necesidad.</h2><p className="mt-2 max-w-[65ch] text-[13px] leading-relaxed text-ink-light">Sistemas de venta, modernización, archivos digitales, automatización e IA aplicada con foco en un problema concreto.</p></div><Link to="/soluciones" className="shrink-0 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper">Ver soluciones →</Link></div>
      </section>

      <section aria-label="Impacto profesional" className="border-y hairline bg-white/70">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 divide-x divide-y divide-line sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {impactItems.map(([value, label]) => <div key={value} className="min-h-[98px] px-5 py-5 sm:px-6"><div className="font-mono text-[10px] tracking-[0.13em] text-clay-dark">{value}</div><div className="mt-2 font-display text-[15px] leading-tight text-ink-2">{label}</div></div>)}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Professional profile" title="Ingeniería que entiende el sistema antes de cambiarlo." intro="Combino backend, integraciones y mantenimiento evolutivo con una forma de trabajo atenta al negocio, la calidad y la capacidad de diagnóstico." />
          <div className="grid gap-3 sm:grid-cols-2">
            {["Software engineering y backend", "Arquitectura e integraciones", "Debugging y resolución de problemas", "Testing, calidad y automatización", "Datos, ETL y procesos batch", "IA aplicada al ciclo de ingeniería"].map((item, index) => <div key={item} className="rounded-[16px] border hairline bg-white p-5"><span className="font-mono text-[10px] text-stone">0{index + 1}</span><p className="mt-3 font-display text-[17px] leading-tight">{item}</p></div>)}
          </div>
        </div>
      </section>

      <section id="expertise" className="scroll-mt-20 border-y hairline bg-paper-2/65">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><SectionHeading eyebrow="Technical Expertise" title="Profundidad donde importa. Amplitud cuando aporta." intro="Tecnologías y prácticas organizadas por contexto, sin porcentajes ni una pared de badges." /><Link to="/cv#skills" className="shrink-0 text-[13px] underline decoration-line underline-offset-4 hover:text-clay-dark">Ver expertise completo en CV →</Link></div>
          <div className="mt-9"><ExpertiseGrid compact limit={5} /></div>
        </div>
      </section>

      <section id="experiencia" className="scroll-mt-20 mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><SectionHeading eyebrow="Selected experience" title="Trayectoria sostenida en software empresarial." intro="Una experiencia extensa que reúne ingeniería de backend, facturación electrónica, integraciones y calidad." /><Link to="/cv#experience" className="text-[13px] underline decoration-line underline-offset-4">Ver CV profesional →</Link></div>
        <article className="mt-8 overflow-hidden rounded-[22px] border hairline bg-white">
          <div className="grid lg:grid-cols-[.42fr_.58fr]"><div className="bg-ink p-7 text-paper md:p-9"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-brass">2004 – June 2026</div><h3 className="mt-5 font-display text-[32px] leading-[.98] tracking-[-.035em]">{experience.org}</h3><p className="mt-3 font-display text-[19px] text-paper/90">{experience.role}</p><p className="mt-2 text-[13px] text-paper/65">{experience.location}</p><div className="mt-8 border-t border-white/15 pt-5 text-[12px] leading-relaxed text-paper/70">Más de dos décadas en construcción, evolución y diagnóstico de software empresarial.</div></div><div className="p-7 md:p-9"><p className="max-w-[65ch] text-[14px] leading-relaxed text-ink-2">{experience.summary}</p><ol className="mt-7 grid gap-3 sm:grid-cols-2">{experience.chapters.map((chapter, index) => <li key={chapter} className="flex gap-3 border-t hairline pt-3 text-[13px] leading-relaxed"><span className="font-mono text-[10px] text-clay-dark">0{index + 1}</span><span>{chapter}</span></li>)}</ol></div></div>
        </article>
        <div className="mt-5 flex flex-wrap gap-2">{cv.careerHighlights.map(item => <span key={item} className="rounded-full border hairline bg-paper-2 px-3 py-1.5 text-[11px] text-ink-2">{item}</span>)}</div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20"><div className="grid gap-10 xl:grid-cols-[.72fr_1.28fr]"><div><SectionHeading eyebrow="Software Engineering + AI" title="IA para ampliar el trabajo de ingeniería, no para delegar el criterio." light intro="La IA acelera análisis, desarrollo y automatización. Arquitectura, testing, revisión y responsabilidad técnica siguen siendo humanas." /><p className="mt-7 max-w-[45ch] border-l border-brass pl-4 text-[13px] leading-relaxed text-paper/75">La mejor ayuda aparece cuando se integra a un proceso: entender antes de generar, probar antes de concluir y revisar antes de entregar.</p></div><Workflow steps={aiWorkflow} tone="dark" /></div></div>
      </section>

      <section id="proyectos-destacados" className="scroll-mt-20 mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><SectionHeading eyebrow="Selected projects" title="Proyectos como evidencia, no como catálogo." intro="El hub resume cada pieza y deja claro qué es preview, qué tiene demo local y qué puede explorarse en detalle." /><Link to="/proyectos" className="shrink-0 text-[13px] underline decoration-line underline-offset-4">Ver todos los proyectos →</Link></div>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">{featuredProjects.map(project => <Link key={project.slug} to={project.href} className="group flex min-h-[260px] flex-col rounded-[20px] border hairline bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-sm"><div className="flex items-center justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[.13em]" style={{ color: project.color }}>{project.demoStatus}</span><span className="h-2.5 w-2.5 rounded-full" style={{ background: project.color }} /></div><h3 className="mt-7 font-display text-[25px] leading-[.98] tracking-[-.03em]">{project.title}</h3><p className="mt-3 text-[13px] leading-relaxed text-ink-light">{project.description}</p><div className="mt-auto flex items-center justify-between border-t hairline pt-5 text-[12px]"><span>{project.status}</span><span className="font-medium underline decoration-line underline-offset-4 group-hover:decoration-ink">Case study →</span></div></Link>)}</div>
      </section>

      <section className="border-y hairline bg-paper-2/60">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20"><div className="grid gap-10 lg:grid-cols-[.78fr_1.22fr]"><div><SectionHeading eyebrow="Legacy → Modern" title="Modernizar software sin perder el conocimiento del negocio." intro="Una modernización responsable no parte de borrar lo existente. Recupera reglas, reduce acoplamiento y migra con pruebas y control." /><Link to="/proyectos/legacy-web" className="mt-6 inline-block text-[13px] underline decoration-line underline-offset-4">Ver case study Legacy → Web</Link></div><Workflow steps={legacyWorkflow} compact /></div></div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="overflow-hidden rounded-[22px] border hairline bg-white"><div className="grid lg:grid-cols-[.78fr_1.22fr]"><div className="bg-[#F5F0E8] p-7 md:p-9"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-clay-dark">Featured engineering case study</div><h2 className="mt-3 font-display text-[34px] leading-[.98] tracking-[-.04em]">Company Workspace</h2><p className="mt-4 text-[14px] leading-relaxed text-ink-light">Una manera de coordinar agentes especializados de IA como un equipo de software, con responsabilidades separadas y límites humanos claros.</p><Link to="/proyectos/company-workspace" className="mt-7 inline-block rounded-full bg-ink px-5 py-3 text-[13px] text-paper">Explorar el caso →</Link></div><div className="p-7 md:p-9"><div className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Workflow controlado</div><div className="mt-5 grid gap-2 sm:grid-cols-2">{["Owner Execution Mandate", "Intake & Requirements", "Architecture & Senior Design", "Development", "Independent Verification", "Regression & Functional QA", "Security when applicable", "Evidence & Quality Gate"].map((item, index) => <div key={item} className="flex gap-3 rounded-[12px] border hairline bg-paper-2/60 p-3 text-[12px] leading-snug"><span className="font-mono text-[10px] text-clay-dark">0{index + 1}</span><span>{item}</span></div>)}</div><p className="mt-5 text-[12px] leading-relaxed text-ink-light">El foco no es solo generar código: es proceso, trazabilidad, control, pruebas, evidencia y calidad.</p></div></div></div>
      </section>

      <section className="border-y hairline bg-white">
        <div className="mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20"><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]"><SectionHeading eyebrow="How I work" title="Un método pragmático para software que necesita durar." intro="Lo técnico es importante; también lo es entender qué se está cambiando, por qué y cómo se comprobará." /><Workflow steps={workMethod} compact /></div></div>
      </section>

      <section id="contacto" className="scroll-mt-20 mx-auto max-w-[1280px] px-5 py-14 sm:px-6 md:px-8 md:py-20">
        <div className="rounded-[22px] bg-ink p-7 text-paper md:flex md:items-center md:justify-between md:gap-8 md:p-10"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-brass">Contacto</div><h2 className="mt-3 font-display text-[32px] leading-none">Conversemos sobre el problema correcto.</h2><p className="mt-3 max-w-[58ch] text-[13px] leading-relaxed text-paper/70">Para oportunidades de ingeniería, modernización, integraciones o construcción de herramientas con IA aplicada.</p></div><div className="mt-6 flex flex-wrap gap-2 md:mt-0 md:shrink-0"><a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-4 py-2.5 text-[13px] text-ink">LinkedIn ↗</a><a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-4 py-2.5 text-[13px] text-paper">GitHub ↗</a><a href={`mailto:${cv.links.email}`} className="rounded-full border border-white/20 px-4 py-2.5 text-[13px] text-paper">Email</a></div></div>
      </section>
    </div>
  )
}
