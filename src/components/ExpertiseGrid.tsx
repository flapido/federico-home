import { skillCategories, type SkillCategory } from "../data/cv"

type ExpertiseGridProps = {
  compact?: boolean
  limit?: number
}

function Skills({ category, compact }: { category: SkillCategory; compact: boolean }) {
  const skills = compact ? category.skills.slice(0, 7) : category.skills
  return <div className="mt-4 flex flex-wrap gap-1.5">{skills.map(skill => <span key={skill} className="rounded-full border hairline bg-paper-2 px-2.5 py-1 text-[11px] leading-none text-ink-2">{skill}</span>)}{compact && category.skills.length > skills.length && <span className="rounded-full border hairline bg-white px-2.5 py-1 text-[11px] leading-none text-stone">+{category.skills.length - skills.length}</span>}</div>
}

export default function ExpertiseGrid({ compact = false, limit }: ExpertiseGridProps) {
  const categories = limit ? skillCategories.slice(0, limit) : skillCategories
  return (
    <div className={`grid gap-3 ${compact ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"}`}>
      {categories.map(category => (
        <article key={category.id} className="rounded-[18px] border hairline bg-white p-5">
          <div className="flex items-start justify-between gap-4"><div><h3 className="font-display text-[19px] leading-tight">{category.title}</h3><p className="mt-2 text-[12px] leading-relaxed text-ink-light">{category.description}</p></div><span className={`shrink-0 rounded-full border px-2 py-1 font-mono text-[9px] uppercase tracking-wide ${category.priority === "primary" ? "border-clay/30 bg-clay/10 text-clay-dark" : "hairline bg-paper-2 text-stone"}`}>{category.priority === "primary" ? "Core" : "Complementary"}</span></div>
          {compact ? <Skills category={category} compact /> : <details className="group mt-4"><summary className="cursor-pointer list-none text-[12px] font-medium text-ink"><span className="inline-flex items-center gap-2">Tecnologías y prácticas <span className="text-clay transition-transform group-open:rotate-45">+</span></span></summary><Skills category={category} compact={false} /></details>}
        </article>
      ))}
    </div>
  )
}
