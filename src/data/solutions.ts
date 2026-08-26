export type SolutionStatus = "DEMO LOCAL" | "CASO REAL" | "CONCEPTO"

export type Solution = {
  slug: string
  eyebrow: string
  title: string
  status: SolutionStatus
  image?: { src: string; alt: string; caption: string }
  problem: string
  solution: string
  audience: string
  adaptations: string[]
  stack: string
  cta: string
  href?: string
}

export const solutions: Solution[] = [
  {
    slug: "subastas-catalogos",
    eyebrow: "Ventas, catálogos y reglas",
    title: "Sistemas para vender, reservar o gestionar ofertas",
    status: "DEMO LOCAL",
    image: { src: "/solutions/subastas/case-study.png", alt: "Captura real del caso Sistema de Subastas con lotes, ofertas y cierre", caption: "Sistema de Subastas · recorrido con datos ficticios dentro del portfolio" },
    problem: "Cuando productos, consultas, precios y reglas viven en planillas o mensajes, seguir una operación se vuelve difícil.",
    solution: "Un flujo claro para catálogo, detalle, ofertas, compra directa o reservas, con estados visibles y reglas de negocio.",
    audience: "Comercios, equipos comerciales y negocios que necesitan ordenar una operación concreta.",
    adaptations: ["catálogos de productos", "reservas", "marketplaces pequeños", "licitaciones privadas"],
    stack: "React · TypeScript · UI responsive",
    cta: "Ver caso de subastas",
    href: "/proyectos/subastas",
  },
  {
    slug: "legacy-web",
    eyebrow: "Modernización incremental",
    title: "Llevar un sistema importante a la web, sin empezar de cero",
    status: "DEMO LOCAL",
    image: { src: "/solutions/legacy/dashboard-demo.png", alt: "Captura real de una interfaz web de operaciones de producción con métricas y actividad", caption: "Legacy → Web · evidencia visual de una propuesta de modernización" },
    problem: "Un sistema antiguo puede seguir resolviendo algo valioso, aunque sea difícil de mantener, integrar o usar desde otros equipos.",
    solution: "Primero se entiende el proceso y se preservan las reglas. Después se desacopla, se exponen APIs y se migra por etapas con pruebas.",
    audience: "Empresas con VB6, .NET desktop, Access, formularios antiguos o procesos sostenidos con Excel.",
    adaptations: ["sistemas internos", "formularios operativos", "procesos de planta", "migraciones progresivas"],
    stack: "APIs · Web responsive · Testing",
    cta: "Ver enfoque Legacy → Web",
    href: "/proyectos/legacy-web",
  },
  {
    slug: "archivo-digital",
    eyebrow: "Archivo y memoria digital",
    title: "Documentos, fotos e historias que se puedan encontrar y recorrer",
    status: "CASO REAL",
    image: { src: "/solutions/acervo/pdf-viewer.png", alt: "Captura real de un visor de documento PDF con páginas y controles", caption: "Acervo Digital · visor de documento local con navegación por páginas" },
    problem: "Un archivo útil no es solo una carpeta llena de PDFs o fotos: necesita contexto, navegación y una forma simple de volver a encontrar cada pieza.",
    solution: "Experiencias digitales para colecciones, documentos, galerías y fichas, con la base para crecer en búsqueda y clasificación.",
    audience: "Familias, instituciones, bibliotecas, archivos históricos y equipos que conservan documentación.",
    adaptations: ["memoria familiar", "colecciones", "bibliotecas", "documentación empresarial"],
    stack: "Document viewer · galerías · metadata",
    cta: "Explorar el tipo de solución",
  },
  {
    slug: "mvp-ia",
    eyebrow: "MVP, automatización e IA aplicada",
    title: "Una primera versión útil para probar una idea o simplificar un proceso",
    status: "CONCEPTO",
    problem: "No toda necesidad necesita un sistema enorme. A veces hace falta ordenar un workflow, validar una idea o quitar pasos repetitivos.",
    solution: "Una versión acotada: formularios, paneles, automatizaciones, procesamiento de archivos, integraciones o asistencia sobre documentos.",
    audience: "Profesionales, PyMEs y equipos que quieren comprobar valor antes de escalar.",
    adaptations: ["MVPs", "paneles internos", "importación de datos", "asistentes y workflows"],
    stack: "APIs · archivos · automatización · IA con revisión humana",
    cta: "Contame tu idea",
    href: "/#contacto",
  },
]
