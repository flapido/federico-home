import type { WorkflowStep } from "../data/cv"

type WorkflowProps = {
  steps: WorkflowStep[]
  tone?: "light" | "dark"
  compact?: boolean
}

export default function Workflow({ steps, tone = "light", compact = false }: WorkflowProps) {
  const isDark = tone === "dark"
  return (
    <ol className={`workflow-grid ${compact ? "workflow-grid-compact" : ""}`}>
      {steps.map((step, index) => (
        <li key={step.title} className={`relative rounded-[16px] border p-4 ${isDark ? "border-white/15 bg-white/[0.06]" : "hairline bg-white"}`}>
          <span className={`font-mono text-[10px] ${isDark ? "text-brass" : "text-stone"}`}>0{index + 1}</span>
          <h3 className="mt-2 font-display text-[16px] leading-tight">{step.title}</h3>
          <p className={`mt-2 text-[12px] leading-relaxed ${isDark ? "text-paper/70" : "text-ink-light"}`}>{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}
