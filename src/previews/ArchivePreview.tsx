const records = [
  ["Documento", "Ficha histórica", "Categoría y metadata"],
  ["Imagen", "Colección visual", "Navegación por recurso"],
  ["PDF", "Documento multipágina", "Vista y lectura"],
]

export default function ArchivePreview() {
  return <div className="grid gap-3 sm:grid-cols-3">{records.map(([type, title, detail], index) => <article key={type} className="rounded-[14px] border hairline bg-paper-2/60 p-4"><div className="flex h-24 items-end rounded-[10px] bg-[#6B3430] p-3 text-paper" style={{ background: index === 1 ? "#7A5A4A" : index === 2 ? "#2D2F2D" : undefined }}><span className="font-mono text-[10px] uppercase tracking-[.14em]">{type}</span></div><h3 className="mt-4 font-display text-[19px] leading-tight">{title}</h3><p className="mt-2 text-[12px] leading-relaxed text-ink-light">{detail}</p></article>)}</div>
}
