import { Link } from "react-router-dom"
export default function NotFound(){
  return (
    <div className="max-w-[640px] mx-auto px-6 py-16 text-center">
      <div className="w-12 h-12 rounded-full border hairline bg-paper-2 grid place-items-center mx-auto font-mono text-stone">404</div>
      <h1 className="font-display text-[28px] mt-4">Página no encontrada</h1>
      <p className="text-[13px] text-ink-light mt-2">La ruta no existe. Volvé al inicio o explorá proyectos.</p>
      <div className="mt-6 flex justify-center gap-2">
        <Link to="/" className="px-5 py-2 rounded-full bg-ink text-paper text-[13px]">Inicio</Link>
        <Link to="/proyectos" className="px-5 py-2 rounded-full border hairline text-[13px] bg-white">Proyectos</Link>
      </div>
    </div>
  )
}
