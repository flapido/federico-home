export type DemoStatus = "PREVIEW" | "LOCAL_DEMO" | "LIVE_DEMO"

export type CaseStudy = {
  overview: string
  problem?: string
  solution?: string
  architecture?: string[]
  stack?: string[]
  role?: string
  decisions?: string[]
  quality?: string[]
  aiUsage?: string
  evidence?: string[]
}

export type Project = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  year: string
  status: string
  statusTone: "preview" | "local" | "featured"
  color: string
  bg: string
  href: string
  preview: "auction" | "tickets" | "prepaga" | "legacy" | "workspace" | "archive"
  demoStatus: DemoStatus
  featured?: boolean
  caseStudy: CaseStudy
}

export const projects: Project[] = [
  {
    id: "subastas",
    slug: "subastas",
    title: "Sistema de Subastas",
    subtitle: "Lotes, pujas y cierre",
    description: "Presentación de un flujo de lotes, ofertas y cierre en una interfaz clara.",
    year: "Proyecto independiente",
    status: "Demo local disponible",
    statusTone: "local",
    color: "#944A30",
    bg: "#FDF6EE",
    href: "/proyectos/subastas",
    preview: "auction",
    demoStatus: "LOCAL_DEMO",
    featured: true,
    caseStudy: {
      overview: "Una vista de producto centrada en el estado de cada lote, su historial de ofertas y el momento de cierre.",
      problem: "Ordenar información de una subasta para que el estado y la siguiente acción sean fáciles de seguir.",
      solution: "Una interfaz con listado, detalle, historial y controles de interacción representados con datos ficticios.",
      architecture: ["Hub con preview local", "Demo independiente con estado aislado", "Datos ficticios para la demostración"],
      stack: ["React", "TypeScript", "UI responsive"],
      decisions: ["El hub no incorpora lógica ni datos del proyecto independiente.", "La preview deja claro que no es la demo oficial."],
      quality: ["Estados visibles para lotes y ofertas", "Interacciones ligeras que no persisten datos"],
      evidence: ["Demo declarada como LOCAL_DEMO; sin URL pública verificada."],
    },
  },
  {
    id: "tickets",
    slug: "tickets",
    title: "Sistema de Tickets",
    subtitle: "Prioridad, estado y seguimiento",
    description: "Presentación de seguimiento de trabajo con prioridad, estado y responsables.",
    year: "Proyecto independiente",
    status: "Preview en el hub",
    statusTone: "preview",
    color: "#4A5A52",
    bg: "#EEF2EF",
    href: "/proyectos/tickets",
    preview: "tickets",
    demoStatus: "PREVIEW",
    featured: true,
    caseStudy: {
      overview: "Un preview de flujo visual para hacer legibles la prioridad, el estado y el historial de un ticket.",
      problem: "Dar visibilidad al seguimiento sin esconder el estado actual en conversaciones o planillas.",
      solution: "Columnas de estado, detalle seleccionado y una secuencia de eventos representada con datos ficticios.",
      stack: ["React", "TypeScript", "Interacción local"],
      decisions: ["Se usa una preview ligera, no una demo de producto.", "Los datos son solamente representativos."],
      quality: ["Transición de estado controlada en la preview", "Diseño de lectura rápida para mobile y desktop"],
      evidence: ["Estado público: PREVIEW. No hay demo externa declarada."],
    },
  },
  {
    id: "prepaga",
    slug: "prepaga",
    title: "Venta Prepaga",
    subtitle: "Saldo, selección y confirmación",
    description: "Recorrido mobile de selección, confirmación y saldo simulado.",
    year: "Proyecto independiente",
    status: "Preview mobile en el hub",
    statusTone: "preview",
    color: "#775B22",
    bg: "#FDF8EC",
    href: "/proyectos/prepaga",
    preview: "prepaga",
    demoStatus: "PREVIEW",
    featured: true,
    caseStudy: {
      overview: "Un recorrido visual de compra prepaga pensado para pantallas pequeñas.",
      problem: "Mantener selección, total y confirmación visibles durante una operación breve.",
      solution: "Un flujo de tres pasos con estado local y valores ficticios.",
      stack: ["React", "TypeScript", "Mobile-first UI"],
      decisions: ["No simula pagos ni persiste operaciones.", "La interfaz indica explícitamente su condición de preview."],
      quality: ["Estados de saldo suficiente e insuficiente", "Secuencia de confirmación aislada"],
      evidence: ["Estado público: PREVIEW. No hay demo externa declarada."],
    },
  },
  {
    id: "legacy-web",
    slug: "legacy-web",
    title: "Legacy → Web",
    subtitle: "Modernización incremental",
    description: "Comparación visual de un sistema desktop y una experiencia web más actual.",
    year: "Proyecto independiente",
    status: "Demo local disponible",
    statusTone: "local",
    color: "#2D2F2D",
    bg: "#F0EFEA",
    href: "/proyectos/legacy-web",
    preview: "legacy",
    demoStatus: "LOCAL_DEMO",
    caseStudy: {
      overview: "Una explicación visual del paso de una interfaz desktop a una experiencia web responsive.",
      problem: "Modernizar sin perder reglas de negocio ni asumir que una reescritura completa es segura.",
      solution: "Una migración incremental que recupera comportamiento, desacopla y agrega pruebas antes de ampliar el cambio.",
      architecture: ["Comprensión del sistema existente", "Límites mediante APIs", "Migración controlada por etapas"],
      stack: ["Legacy systems", "APIs", "Web responsive", "Automated tests"],
      decisions: ["La preview representa un enfoque, no un sistema de cliente.", "La demo se mantiene independiente y con datos ficticios."],
      quality: ["Preservación de reglas de negocio", "Pruebas como red de seguridad para la migración"],
      evidence: ["Demo declarada como LOCAL_DEMO; sin URL pública verificada."],
    },
  },
  {
    id: "company-workspace",
    slug: "company-workspace",
    title: "Company Workspace",
    subtitle: "Proceso de ingeniería asistido por IA",
    description: "Un sistema local para coordinar roles especializados, evidencia y quality gates.",
    year: "2025 – actualidad",
    status: "Proyecto destacado",
    statusTone: "featured",
    color: "#6B5A4A",
    bg: "#F5F0E8",
    href: "/proyectos/company-workspace",
    preview: "workspace",
    demoStatus: "PREVIEW",
    featured: true,
    caseStudy: {
      overview: "Una forma de coordinar agentes especializados de IA como un equipo de software con responsabilidades separadas.",
      problem: "La generación de código aislada no garantiza requisitos claros, verificación independiente ni trazabilidad.",
      solution: "OWNER_EXECUTION_MANDATE, intake, roles especializados, escenarios de regresión, corrección iterativa y quality gates.",
      architecture: ["Owner → Project Manager", "Product / Requirements → Architecture → Design", "Development → Verification → QA", "Security cuando aplica → Quality Gate"],
      stack: ["AI agents", "Requirements", "QA", "Evidence", "Quality gates"],
      role: "Diseño del proceso, orquestación de roles y definición de límites humanos para trabajo de ingeniería asistido por IA.",
      decisions: ["Separar requisitos, desarrollo, diseño, verificación y seguridad para evitar una sola autoevaluación.", "Mantener gates humanos y límites explícitos para acciones sensibles.", "Usar evidencia y bucles de corrección, no solo generación de código."],
      quality: ["Intake y requirements review", "Senior design review sobre producto renderizado", "Verifier, QA funcional, regresión y gates"],
      aiUsage: "Los agentes aceleran tareas especializadas; las decisiones, límites, revisión y responsabilidad siguen bajo control humano.",
      evidence: ["Repositorio local con Operating Model, Agent Contracts, skills y gates.", "Este portfolio se desarrolla bajo ese proceso controlado."],
    },
  },
  {
    id: "archivo-digital",
    slug: "archivo-digital",
    title: "Archivo Digital",
    subtitle: "Documentos, imágenes e información organizada",
    description: "Una aplicación estática para recorrer fichas, categorías y documentos con una experiencia editorial.",
    year: "Caso real · datos públicos",
    status: "Evidencia de producto",
    statusTone: "featured",
    color: "#6B3430",
    bg: "#FBF1EC",
    href: "/proyectos/archivo-digital",
    preview: "archive",
    demoStatus: "PREVIEW",
    featured: true,
    caseStudy: {
      overview: "Archivo Digital ordena documentos, imágenes e información en fichas navegables para que una colección se pueda recorrer y encontrar.",
      problem: "Cuando el material vive disperso en carpetas, PDFs y planillas, consultarlo o compartirlo exige demasiados pasos.",
      solution: "Un catálogo editorial con fichas, categorías, recursos asociados y visor de documentos. La evidencia usa un conjunto histórico público de Tucumán y excluye archivos privados.",
      architecture: ["Sitio estático publicable", "Datos y assets por colección", "Rutas relativas y navegación por ficha"],
      stack: ["HTML · CSS · JavaScript", "Fichas · categorías · visor PDF", "Responsive"],
      decisions: ["Separar la plantilla de la información de cada colección.", "Usar solamente datos públicos o de prueba en la evidencia del portfolio."],
      quality: ["QA visual desktop y mobile", "Recursos locales y navegación sin backend"],
      evidence: ["Captura real de Acervo Tucumán con información histórica pública.", "La evidencia excluye archivos y datos privados."],
    },
  },
]

export type LabStatus = "IDEA" | "EXPERIMENT" | "BUILDING" | "READY"

export type LabItem = {
  id: string
  title: string
  tag: string
  description: string
  status: LabStatus
  href?: string
}

export const labItems: LabItem[] = [
  {
    id: "local-ai",
    title: "FastAPI + Local AI",
    tag: "AI · Automation",
    description: "Experimento local con un endpoint FastAPI que deriva consultas a Ollama. Sin publicación ni descripción comercial.",
    status: "EXPERIMENT",
  },
  {
    id: "company-workspace",
    title: "Company Workspace",
    tag: "AI Engineering · Process",
    description: "Sistema de trabajo con roles, evidencia, QA y límites humanos para delivery de software asistido por IA.",
    status: "READY",
    href: "/proyectos/company-workspace",
  },
]
