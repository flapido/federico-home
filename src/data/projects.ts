export type DemoStatus = "PREVIEW" | "LOCAL_DEMO" | "LIVE_DEMO"

export type Project = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  brief: string
  year: string
  status: string
  statusTone: "live" | "demo" | "archive"
  color: string
  bg: string
  href: string
  preview: "auction" | "tickets" | "prepaga" | "legacy" | "workspace"
  demoStatus: DemoStatus
  demoUrl?: string
  publicUrl: string
  externalPlaceholder: string
  featured?: boolean
  // Para credibilidad sin párrafo: 4 respuestas visuales
  what: string
  problem: string
  try: string
}

export const projects: Project[] = [
  {
    id: "subastas",
    slug: "subastas",
    title: "Sistema de Subastas",
    subtitle: "Lotes, pujas y cierre — sin planilla",
    description: "Subastas en vivo con control real de lotes y liquidación.",
    brief: "Subastas en vivo con control real de lotes y liquidación.",
    what: "Lotes con oferta actual, historial y tiempo.",
    problem: "Subastas desordenadas → flujo claro y cierre confiable.",
    try: "Mové una oferta, mirá el historial y simulá el cierre.",
    year: "2024 — hoy",
    status: "En producción · Demo lista",
    statusTone: "live",
    color: "#C07A5A",
    bg: "#FDF6EE",
    href: "/proyectos/subastas",
    preview: "auction",
    // La demo completa vive en stock-subastas-demo. URL pública verificada.
    demoStatus: "LIVE_DEMO",
    demoUrl: "https://stock-subastas-demo.pages.dev",
    publicUrl: "subastas.midominio.com",
    externalPlaceholder: "subastas.midominio.com",
    featured: true,
  },
  {
    id: "tickets",
    slug: "tickets",
    title: "Sistema de Tickets",
    subtitle: "Prioridad, estado y seguimiento — sin ruido",
    description: "De reporte a resolución, todo visible.",
    brief: "De reporte a resolución, todo visible.",
    what: "Tickets con prioridad, estado y responsable.",
    problem: "Seguimiento perdido → flujo visual y trazable.",
    try: "Movés un ticket de columna y ves el seguimiento.",
    year: "2023 — hoy",
    status: "En producción · Preview",
    statusTone: "live",
    color: "#4A5A52",
    bg: "#EEF2EF",
    href: "/proyectos/tickets",
    preview: "tickets",
    demoStatus: "PREVIEW",
    publicUrl: "tickets.midominio.com",
    externalPlaceholder: "tickets.midominio.com",
    featured: true,
  },
  {
    id: "prepaga",
    slug: "prepaga",
    title: "Venta Prepaga",
    subtitle: "Saldo, selección y confirmación — mobile",
    description: "Compra prepaga simple: elegís, pagás, listo.",
    brief: "Compra prepaga simple: elegís, pagás, listo.",
    what: "Experiencia mobile con saldo e importe claros.",
    problem: "Compra confusa → flujo de 2 toques y confirmación.",
    try: "Recorrido visual phone con selección y saldo.",
    year: "2023",
    status: "Producto · Preview mobile",
    statusTone: "demo",
    color: "#C9A86A",
    bg: "#FDF8EC",
    href: "/proyectos/prepaga",
    preview: "prepaga",
    demoStatus: "PREVIEW",
    publicUrl: "prepaga.midominio.com",
    externalPlaceholder: "prepaga.midominio.com",
    featured: true,
  },
  {
    id: "legacy-web",
    slug: "legacy-web",
    title: "Legacy → Web",
    subtitle: "De desktop gris a web clara — sin fricción",
    description: "Transformación visual y técnica sin perder el negocio.",
    brief: "Transformación visual y técnica sin perder el negocio.",
    what: "Antes: desktop fijo. Después: web responsive.",
    problem: "Sistema viejo acoplado → experiencia moderna y mantenible.",
    try: "Deslizá el antes/después — es protagonista.",
    year: "2022 — 2024",
    status: "Transformación · Demo lista",
    statusTone: "archive",
    color: "#2D2F2D",
    bg: "#F0EFEA",
    href: "/proyectos/legacy-web",
    preview: "legacy",
    // La demo completa vive en legacy-app-explorer-demo. URL pública verificada.
    demoStatus: "LIVE_DEMO",
    demoUrl: "https://legacy-app-explorer-demo.pages.dev",
    publicUrl: "legacy.midominio.com",
    externalPlaceholder: "legacy.midominio.com",
  },
  {
    id: "company-workspace",
    slug: "company-workspace",
    title: "Company Workspace",
    subtitle: "Una empresa virtual para construir software",
    description: "Siete roles orquestados de producto a release.",
    brief: "Siete roles orquestados de producto a release.",
    what: "Producto · Arquitectura · Diseño · Dev · QA · Seguridad · Release.",
    problem: "Proyecto sin ritmo → sistema que orquesta entrega con calidad.",
    try: "Explorá el orbital — cada rol tiene su foco.",
    year: "2025 — hoy",
    status: "Pieza especial · Sistema vivo",
    statusTone: "live",
    color: "#6B5A4A",
    bg: "#F5F0E8",
    href: "/proyectos/company-workspace",
    preview: "workspace",
    demoStatus: "PREVIEW",
    publicUrl: "company.midominio.com",
    externalPlaceholder: "company.midominio.com",
    featured: true,
  },
]

export type LabStatus = "idea" | "experiment" | "building" | "ready"

export type LabItem = {
  id: string
  title: string
  tag: string
  year: string
  color: string
  desc: string
  status: LabStatus
}

export const labItems: LabItem[] = [
  { id: "voice-notes", title: "Notas de voz → texto", tag: "IA · Audio", year: "2025", color: "#C07A5A", desc: "Transcripción con resumen automático — explorando.", status: "experiment" },
  { id: "csv-mapper", title: "CSV Mapper", tag: "Herramienta", year: "2025", color: "#4A5A52", desc: "Mapea CSVs sucios a esquemas limpios sin código.", status: "building" },
  { id: "auction-bot", title: "Puja automática", tag: "Experimento", year: "2024", color: "#1C1E1B", desc: "Agente que aprende patrones de puja (simulado).", status: "idea" },
  { id: "receipt-ocr", title: "Ticket → Gastos", tag: "IA · Visión", year: "2024", color: "#C9A86A", desc: "OCR de tickets con categorización.", status: "experiment" },
  { id: "micro-crm", title: "Micro CRM", tag: "Producto pequeño", year: "2024", color: "#7A6F66", desc: "CRM mínimo para seguimiento sin ruido.", status: "ready" },
  { id: "type-explorer", title: "Type Explorer", tag: "DX", year: "2023", color: "#9A9590", desc: "Visualizador de tipos para codebases grandes.", status: "ready" },
]
