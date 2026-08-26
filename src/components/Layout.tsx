import { Link, NavLink, Outlet } from "react-router-dom"
import { useState } from "react"
import { cv } from "../data/cv"
import VisitCounter from "./VisitCounter"

const homeLinks = [
  { href: "/#experiencia", label: "Experiencia" },
  { href: "/#expertise", label: "Expertise" },
]

function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return <NavLink to={to} className={({ isActive }) => `rounded-full px-3 py-2 transition-colors ${isActive && !to.includes("#") ? "bg-ink text-paper" : "text-ink-light hover:bg-paper-2 hover:text-ink"}`}>{children}</NavLink>
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-3 px-5 sm:px-6 md:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Federico Lapido, inicio">
          <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-ink font-mono text-[10px] tracking-wide text-paper transition-transform group-hover:-rotate-3">FL</span>
          <span className="font-display text-[17px] tracking-[-0.02em]">Federico Lapido</span>
          <span className="hidden border-l hairline pl-3 text-[10px] uppercase tracking-[0.14em] text-stone lg:inline">Senior Software Engineer</span>
        </Link>

        <nav className="hidden items-center gap-0.5 text-[13px] md:flex" aria-label="Principal">
          {homeLinks.map(link => <a key={link.href} href={link.href} className="rounded-full px-3 py-2 text-ink-light transition-colors hover:bg-paper-2 hover:text-ink">{link.label}</a>)}
          <HeaderLink to="/proyectos">Proyectos</HeaderLink>
          <HeaderLink to="/soluciones">Soluciones</HeaderLink>
          <HeaderLink to="/lab">Lab</HeaderLink>
          <HeaderLink to="/about">Sobre mí</HeaderLink>
        </nav>

        <div className="hidden items-center gap-1.5 md:flex">
          <HeaderLink to="/cv">CV</HeaderLink>
          <Link to="/contacto" className="rounded-full bg-ink px-3.5 py-2 text-[12px] text-paper transition-colors hover:bg-ink-2">Contame tu idea</Link>
        </div>

        <button type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(value => !value)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border hairline bg-white md:hidden">
          <span className="block h-[1.5px] w-4 bg-ink shadow-[0_5px_0_0_#1C1E1B,0_-5px_0_0_#1C1E1B]" />
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="border-t hairline bg-paper px-5 py-3 text-[15px] shadow-sm md:hidden" aria-label="Principal móvil">
          <div className="mx-auto flex max-w-[1280px] flex-col">
            {homeLinks.map(link => <a key={link.href} href={link.href} className="border-b hairline py-3" onClick={() => setOpen(false)}>{link.label}</a>)}
            <NavLink to="/proyectos" onClick={() => setOpen(false)} className="border-b hairline py-3">Proyectos</NavLink>
            <NavLink to="/soluciones" onClick={() => setOpen(false)} className="border-b hairline py-3">Soluciones</NavLink>
            <NavLink to="/lab" onClick={() => setOpen(false)} className="border-b hairline py-3">Lab</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)} className="border-b hairline py-3">Sobre mí</NavLink>
            <NavLink to="/cv" onClick={() => setOpen(false)} className="border-b hairline py-3">CV</NavLink>
            <NavLink to="/contacto" onClick={() => setOpen(false)} className="border-b hairline py-3">Contame tu idea</NavLink>
            <div className="flex flex-wrap gap-2 pt-4 text-[12px]">
              <a href={cv.links.github} target="_blank" rel="noopener noreferrer" className="rounded-full border hairline bg-white px-3 py-2">GitHub ↗</a>
              <a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full border hairline bg-white px-3 py-2">LinkedIn ↗</a>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

export default function Layout() {
  return (
    <div className="paper-texture flex min-h-screen flex-col">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Nav />
      <main id="contenido" className="flex-1"><Outlet /></main>
      <footer className="mt-14 border-t hairline bg-white/60">
        <div className="mx-auto max-w-[1280px] px-5 py-9 sm:px-6 md:px-8">
          <div className="grid gap-8 md:grid-cols-[1.25fr_.75fr]">
            <div>
              <div className="flex items-center gap-2.5"><span className="grid h-7 w-7 place-items-center rounded-[9px] bg-ink font-mono text-[9px] text-paper">FL</span><span className="font-display text-[17px]">Federico Lapido</span></div>
              <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-ink-light">Senior Software Engineer. Backend, arquitectura, integraciones y IA aplicada para construir y evolucionar software con criterio.</p>
              <VisitCounter />
            </div>
            <div className="grid grid-cols-2 gap-6 text-[13px]">
              <div><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">Explorar</div><div className="mt-3 flex flex-col gap-2"><a href="/#experiencia" className="hover:underline">Experiencia</a><a href="/#expertise" className="hover:underline">Expertise</a><Link to="/proyectos" className="hover:underline">Proyectos</Link><Link to="/soluciones" className="hover:underline">Soluciones</Link><Link to="/cv" className="hover:underline">CV</Link></div></div>
              <div><div className="font-mono text-[10px] uppercase tracking-[0.14em] text-stone">Contacto</div><div className="mt-3 flex flex-col gap-2"><Link to="/contacto" className="hover:underline">Contame tu idea</Link><a href="https://wa.me/5491157642626?text=Hola%20Federico%2C%20vi%20tu%20portfolio%20y%20quer%C3%ADa%20hacerte%20una%20consulta." target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp ↗</a><a href={cv.links.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn ↗</a><a href={`mailto:${cv.links.email}`} className="hover:underline">Email</a></div></div>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-2 border-t hairline pt-5 font-mono text-[10px] text-stone sm:flex-row"><span>© {new Date().getFullYear()} Federico Lapido · Buenos Aires, Argentina</span><span>Portfolio profesional · Hub de proyectos independientes</span></div>
        </div>
      </footer>
    </div>
  )
}
