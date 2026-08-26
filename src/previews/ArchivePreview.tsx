const evidence = [
  ["/solutions/archivo-digital/catalogo-demo.png", "Vista real del catálogo de Archivo Digital con búsqueda, filtros y fichas", "Explorar el archivo", "Listado, búsqueda y filtros"],
  ["/solutions/archivo-digital/tucuman-public.png", "Ficha real de material histórico público dentro de Acervo Tucumán", "Ficha y recursos", "Información organizada por registro"],
  ["/solutions/archivo-digital/visor-pdf-demo.png", "Visor real de documento PDF con páginas y controles de navegación", "Visor PDF", "Lectura y navegación multipágina"],
]

export default function ArchivePreview() {
  return <div className="grid gap-4 md:grid-cols-3">{evidence.map(([src, alt, title, detail]) => <figure key={src} className="overflow-hidden rounded-[14px] border hairline bg-paper-2/60"><img src={src} alt={alt} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" /><figcaption className="p-4"><h3 className="font-display text-[19px] leading-tight">{title}</h3><p className="mt-2 text-[12px] leading-relaxed text-ink-light">{detail}</p></figcaption></figure>)}</div>
}
