import { Link, useParams } from "react-router-dom"
import AuctionPreview from "../previews/AuctionPreview"
import LegacyPreview from "../previews/LegacyPreview"
import PrepagaPreview from "../previews/PrepagaPreview"
import TicketsPreview from "../previews/TicketsPreview"
import WorkspacePreview from "../previews/WorkspacePreview"
import ArchivePreview from "../previews/ArchivePreview"
import CommercialEvidence from "../components/CommercialEvidence"
import { projects, type CaseStudy, type Project } from "../data/projects"

const previewByType = {
  auction: <AuctionPreview />,
  tickets: <TicketsPreview />,
  prepaga: <PrepagaPreview />,
  legacy: <LegacyPreview />,
  workspace: <WorkspacePreview />,
  archive: <ArchivePreview />,
}

function TextSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-t hairline pt-6"><h2 className="font-mono text-[10px] uppercase tracking-[.15em] text-stone">{title}</h2><div className="mt-3 text-[14px] leading-relaxed text-ink-2">{children}</div></section>
}

function ListSection({ title, values }: { title: string; values?: string[] }) {
  if (!values?.length) return null
  return <TextSection title={title}><ul className="grid gap-2 sm:grid-cols-2">{values.map(value => <li key={value} className="flex gap-2 text-[13px] leading-relaxed"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />{value}</li>)}</ul></TextSection>
}

function CaseStudy({ project, study }: { project: Project; study: CaseStudy }) {
  const statusMessage = project.demoStatus === "LOCAL_DEMO" ? "Existe una demo independiente disponible localmente. No hay URL pública confirmada." : project.demoStatus === "LIVE_DEMO" ? "Existe una demo pública verificada para este proyecto." : "La evidencia disponible en este hub es una preview interactiva con datos ficticios."
  return <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-12"><div className="space-y-6"><TextSection title="Overview"><p>{study.overview}</p></TextSection>{study.problem && <TextSection title="Problem"><p>{study.problem}</p></TextSection>}{study.solution && <TextSection title="Solution"><p>{study.solution}</p></TextSection>}{study.role && <TextSection title="My role"><p>{study.role}</p></TextSection>}{study.aiUsage && <TextSection title="AI usage"><p>{study.aiUsage}</p></TextSection>}</div><div className="space-y-6"><ListSection title="Architecture" values={study.architecture} /><ListSection title="Stack" values={study.stack} /><ListSection title="Engineering decisions" values={study.decisions} /><ListSection title="Quality" values={study.quality} /><ListSection title="Evidence" values={study.evidence} /><TextSection title="Current status"><p className="rounded-[12px] border hairline bg-paper-2 p-4 text-[13px]"><span className="font-mono text-[11px] text-clay-dark">{project.demoStatus}</span><br />{statusMessage}</p></TextSection></div></div>
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find(item => item.slug === slug)
  if (!project) return <div className="mx-auto max-w-[720px] px-5 py-16 text-center"><div className="font-mono text-[11px] uppercase tracking-widest text-stone">404</div><h1 className="mt-2 font-display text-[32px]">Proyecto no encontrado</h1><Link to="/proyectos" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-[13px] text-paper">Volver a proyectos</Link></div>

  const isLocalDemo = project.demoStatus === "LOCAL_DEMO"

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-6 md:px-8 md:py-12">
      <Link to="/proyectos" className="text-[13px] underline decoration-line underline-offset-4">← Todos los proyectos</Link>
      <header className="mt-7 overflow-hidden rounded-[22px] border hairline bg-white"><div className="grid lg:grid-cols-[1.1fr_.9fr]"><div className="p-7 md:p-10"><div className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: project.color }}>{project.subtitle}</div><h1 className="mt-4 font-display text-[42px] leading-[.94] tracking-[-.045em] md:text-[56px]">{project.title}</h1><p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-ink-light">{project.description}</p><div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full border hairline bg-paper-2 px-3 py-1.5 font-mono text-[10px]">{project.demoStatus}</span><span className="rounded-full border hairline bg-white px-3 py-1.5 text-[11px]">{project.status}</span><span className="rounded-full border hairline bg-white px-3 py-1.5 text-[11px]">Hub · Preview local</span></div></div><aside className="border-t hairline bg-paper-2/70 p-7 lg:border-l lg:border-t-0 md:p-10"><div className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Availability</div><p className="mt-4 font-display text-[25px] leading-tight">{isLocalDemo ? "Demo local, sin publicación" : "Preview con datos ficticios"}</p><p className="mt-3 text-[13px] leading-relaxed text-ink-light">{isLocalDemo ? "La demo pertenece a un proyecto independiente y está preparada localmente. Este hub no la publica ni la mantiene." : "La interacción que se ve aquí ayuda a entender el enfoque, pero no representa una demo oficial ni un sistema en producción."}</p><a href="#preview" className="mt-6 inline-block rounded-full bg-ink px-4 py-2.5 text-[13px] text-paper">Ver preview ↓</a></aside></div></header>

      <section className="mt-10"><div className="mb-7"><div className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Case study</div><h2 className="mt-2 font-display text-[32px] tracking-[-.035em]">Decisiones y evidencia disponible</h2></div><CaseStudy project={project} study={project.caseStudy} /></section>

      <CommercialEvidence project={project} />

      <section id="preview" className="scroll-mt-20 mt-12 overflow-hidden rounded-[22px] border hairline bg-white"><div className="flex flex-col justify-between gap-3 border-b hairline bg-paper-2/70 px-6 py-4 sm:flex-row sm:items-center md:px-8"><div><div className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Interactive preview</div><h2 className="mt-1 font-display text-[20px]">Recorrido representativo</h2></div><span className="w-fit rounded-full border hairline bg-white px-3 py-1 font-mono text-[10px]">Datos ficticios · Hub</span></div><div className="p-4 sm:p-6 md:p-8">{previewByType[project.preview]}</div><div className="border-t hairline bg-white px-6 py-4 text-[12px] leading-relaxed text-ink-light">Esta preview vive en Federico Home y no importa código, datos ni integraciones de proyectos hermanos. {isLocalDemo ? "La demo independiente continúa disponible solo de forma local." : "No hay una demo externa declarada para este proyecto."}</div></section>

      <nav className="mt-8 flex justify-between text-[13px]"><Link to="/proyectos" className="underline decoration-line underline-offset-4">← Todos los proyectos</Link><Link to="/lab" className="underline decoration-line underline-offset-4">Engineering Lab →</Link></nav>
    </div>
  )
}
