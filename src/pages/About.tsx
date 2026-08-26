import { Link } from "react-router-dom"
import { cv } from "../data/cv"
import { useEffect, useRef, useState } from "react"

const sections = [
  { title: "Quién soy", text: "Soy Federico Lapido, Senior Software Engineer. Me interesa el software que sostiene operaciones reales: el que integra sistemas, conserva reglas de negocio y necesita poder evolucionar con seguridad." },
  { title: "Mi trayectoria", text: "Más de 20 años trabajando sobre backend, integraciones empresariales, facturación electrónica, calidad y diagnóstico de sistemas. La experiencia no reemplaza la curiosidad: le da contexto." },
  { title: "Cómo pienso el software", text: "Empiezo por entender el comportamiento, las restricciones y el costo de cambiar. Busco soluciones claras, mantenibles y verificables antes que complejidad llamativa." },
  { title: "Cómo evolucionó mi trabajo", text: "A la ingeniería de backend e integraciones sumé automatización e IA aplicada para acelerar análisis, documentación, pruebas y exploración, manteniendo la revisión humana en las decisiones importantes." },
  { title: "Qué estoy construyendo actualmente", text: "Herramientas, procesos y experiencias que acercan la IA al trabajo real de ingeniería: con roles claros, evidencia, pruebas y control de calidad." },
  { title: "Qué puedo aportar", text: "Criterio para sistemas existentes, capacidad de diagnóstico, integración entre plataformas, modernización gradual y una práctica concreta de calidad durante todo el ciclo de desarrollo." },
]

function AboutAvatar() {
  const [reducedMotion, setReducedMotion] = useState(() => typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const [videoFailed, setVideoFailed] = useState(false)
  const started = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", updatePreference)
    return () => mediaQuery.removeEventListener("change", updatePreference)
  }, [])

  useEffect(() => {
    if (reducedMotion || videoFailed || started.current) return
    const video = videoRef.current
    if (!video) return
    started.current = true
    const playResult = video.play()
    playResult?.catch(() => setVideoFailed(true))
  }, [reducedMotion, videoFailed])

  if (reducedMotion || videoFailed) {
    return <img src="/fotos/federico-about.jpg" alt="Federico Lapido" className="aspect-video w-full object-cover object-center" />
  }

  return (
    <video
      ref={videoRef}
      className="aspect-video w-full bg-paper-2 object-cover object-center"
      src="/videos/federico-avatar.mp4"
      poster="/fotos/federico-about.jpg"
      autoPlay
      muted
      playsInline
      preload="metadata"
      onError={() => setVideoFailed(true)}
      onEnded={(event) => event.currentTarget.pause()}
      aria-hidden="true"
    />
  )
}

export default function About() {
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-10 sm:px-6 md:px-8 md:py-14">
      <header className="grid items-center gap-8 md:grid-cols-[1fr_.78fr] md:gap-14"><div><div className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Sobre mí</div><h1 className="mt-3 font-display text-[43px] leading-[.94] tracking-[-.045em] md:text-[58px]">Ingeniería con contexto, <span className="italic">curiosidad y cuidado.</span></h1><p className="mt-5 max-w-[57ch] text-[15px] leading-relaxed text-ink-light">El recorrido profesional no es un listado de herramientas: es aprender a entender sistemas grandes, encontrar la causa real y cambiar con responsabilidad.</p><div className="mt-7 flex flex-wrap gap-2"><Link to="/cv" className="rounded-full bg-ink px-5 py-3 text-[13px] text-paper">Ver CV</Link><Link to="/proyectos" className="rounded-full border hairline bg-white px-5 py-3 text-[13px]">Explorar proyectos</Link></div></div><figure className="overflow-hidden rounded-[22px] border hairline bg-paper-2"><AboutAvatar /><figcaption className="flex justify-between px-5 py-3 font-mono text-[10px] uppercase tracking-[.13em] text-stone"><span>Buenos Aires</span><span>Software Engineering</span></figcaption></figure></header>
      <div className="mt-12 grid gap-4 md:grid-cols-2">{sections.map((section, index) => <section key={section.title} className="rounded-[18px] border hairline bg-white p-6"><div className="font-mono text-[10px] text-clay-dark">0{index + 1}</div><h2 className="mt-4 font-display text-[22px] leading-none">{section.title}</h2><p className="mt-3 text-[13px] leading-relaxed text-ink-light">{section.text}</p></section>)}</div>
      <section className="mt-8 rounded-[18px] border hairline bg-paper-2 p-6 md:flex md:items-center md:justify-between md:gap-8"><div><div className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Contacto profesional</div><p className="mt-2 text-[13px] leading-relaxed text-ink-light">Para conocer experiencia, proyectos y disponibilidad de contacto, están los canales profesionales y el CV descargable.</p></div><div className="mt-5 flex shrink-0 flex-wrap gap-2 md:mt-0"><a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border hairline bg-white px-4 py-2 text-[12px]">LinkedIn ↗</a><a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="rounded-full border hairline bg-white px-4 py-2 text-[12px]">GitHub ↗</a></div></section>
    </div>
  )
}
