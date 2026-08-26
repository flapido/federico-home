type SectionHeadingProps = {
  eyebrow: string
  title: string
  intro?: string
  light?: boolean
}

export default function SectionHeading({ eyebrow, title, intro, light = false }: SectionHeadingProps) {
  return (
    <div className="max-w-[68ch]">
      <div className={`font-mono text-[10px] uppercase tracking-[0.16em] ${light ? "text-brass" : "text-stone"}`}>{eyebrow}</div>
      <h2 className="mt-2 font-display text-[30px] leading-[1.02] tracking-[-0.035em] sm:text-[36px]">{title}</h2>
      {intro && <p className={`mt-3 text-[14px] leading-relaxed ${light ? "text-paper/75" : "text-ink-light"}`}>{intro}</p>}
    </div>
  )
}
