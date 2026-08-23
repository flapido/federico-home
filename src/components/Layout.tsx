import { NavLink, Outlet, useLocation } from "react-router-dom"
import { useState } from "react"

function Nav() {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  const isHome = loc.pathname === "/"

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-xl border-b hairline ${isHome ? "bg-[var(--color-paper)]/80" : "bg-[var(--color-paper)]/90"}`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-[56px] flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3 group shrink-0">
          <span className="w-7 h-7 rounded-[9px] bg-ink text-paper grid place-items-center text-[11px] font-mono tracking-widest border border-line group-hover:rotate-[-6deg] transition">FL</span>
          <span className="font-display text-[17px] tracking-[-0.02em]">Federico</span>
          <span className="hidden lg:inline text-[11px] tracking-[0.14em] uppercase text-stone border-l pl-3 ml-1 hairline">Casa digital · BA</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1 text-[13px]" aria-label="Principal">
          <NavLink to="/proyectos" className={({isActive})=> `px-3 py-1.5 rounded-full transition ${isActive ? "bg-ink text-paper" : "hover:bg-paper-3 text-ink-light hover:text-ink"}`}>Proyectos</NavLink>
          <NavLink to="/lab" className={({isActive})=> `px-3 py-1.5 rounded-full transition ${isActive ? "bg-ink text-paper" : "hover:bg-paper-3 text-ink-light hover:text-ink"}`}>Lab</NavLink>
          <NavLink to="/about" className={({isActive})=> `px-3 py-1.5 rounded-full transition ${isActive ? "bg-ink text-paper" : "hover:bg-paper-3 text-ink-light hover:text-ink"}`}>Sobre mí</NavLink>
        </nav>

        <nav className="hidden md:flex items-center gap-1 text-[12px]" aria-label="Secundario">
          <NavLink to="/cv" className={({isActive})=> `px-3 py-1.5 rounded-full border hairline ${isActive ? "bg-paper-3" : "hover:bg-paper-2"}`}>CV</NavLink>
          <a href="https://github.com/flapido" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full border hairline bg-white hover:bg-paper-2">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/federico-lapido" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-full bg-ink text-paper hover:bg-black">LinkedIn ↗</a>
        </nav>

        <button aria-label="Abrir menú" aria-expanded={open} onClick={()=>setOpen(v=>!v)} className="md:hidden w-9 h-9 rounded-full border hairline grid place-items-center shrink-0">
          <span className="w-4 h-[1.5px] bg-ink block shadow-[0_5px_0_0_#1C1E1B,0_-5px_0_0_#1C1E1B]" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t hairline bg-paper px-6 py-4 flex flex-col gap-1 text-sm">
          <NavLink onClick={()=>setOpen(false)} to="/proyectos" className="py-2.5 border-b hairline">Proyectos</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/lab" className="py-2.5 border-b hairline">Lab</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/about" className="py-2.5 border-b hairline">Sobre mí</NavLink>
          <NavLink onClick={()=>setOpen(false)} to="/cv" className="py-2.5 border-b hairline">CV</NavLink>
          <a href="https://github.com/flapido" target="_blank" rel="noopener noreferrer" className="py-2.5 flex justify-between">GitHub <span>↗</span></a>
          <a href="https://www.linkedin.com/in/federico-lapido" target="_blank" rel="noopener noreferrer" className="py-2.5 flex justify-between">LinkedIn <span>↗</span></a>
          <div className="text-[11px] font-mono text-stone mt-2">Buenos Aires, Argentina · Casa digital</div>
        </div>
      )}
    </header>
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-ink text-paper px-3 py-1 text-sm rounded">Saltar al contenido</a>
      <Nav />
      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t hairline mt-12 bg-white/60">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-[8px] bg-ink text-paper grid place-items-center text-[10px] font-mono">FL</span>
                <span className="font-display text-[15px]">Federico Lapido</span>
                <span className="hidden sm:inline text-[11px] text-stone">— Buenos Aires, Argentina</span>
              </div>
              <div className="text-ink-light mt-2 text-[13px] leading-relaxed max-w-[48ch]">Ideas convertidas en cosas que funcionan. Casa digital hecha a mano — proyectos con previews, Lab y CV.</div>
              <div className="mt-3 flex gap-2 text-[11px] font-mono text-stone"><span>Fraunces + Instrument Sans</span><span>·</span><span>Papel #FDFBF7</span></div>
            </div>
            <div className="text-[13px] leading-relaxed grid grid-cols-2 gap-6 md:gap-10">
              <div>
                <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Explorar</div>
                <div className="mt-2 flex flex-col gap-1"><a href="/proyectos" className="hover:underline underline-offset-4">Proyectos</a><a href="/lab" className="hover:underline underline-offset-4">Lab</a><a href="/about" className="hover:underline underline-offset-4">Sobre mí</a><a href="/cv" className="hover:underline underline-offset-4">CV</a></div>
              </div>
              <div>
                <div className="font-mono text-[11px] tracking-widest uppercase text-stone">Contacto</div>
                <div className="mt-2 flex flex-col gap-1"><a href="https://www.linkedin.com/in/federico-lapido" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">LinkedIn ↗</a><a href="https://github.com/flapido" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">GitHub ↗</a><a href="/cv" className="hover:underline underline-offset-4">Descargar CV</a></div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t hairline flex flex-col md:flex-row gap-2 justify-between text-[11px] font-mono text-stone">
            <span>© {new Date().getFullYear()} Federico Lapido — Hecho a mano, sin neón.</span>
            <span>Hospedable en tu propia PC · <a href="/proyectos" className="underline">Showroom</a></span>
          </div>
        </div>
      </footer>
    </div>
  )
}
