export type SkillCategory = {
  id: string
  title: string
  shortTitle: string
  priority: "primary" | "supporting"
  description: string
  skills: string[]
}

export type WorkflowStep = {
  title: string
  detail: string
}

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    title: "Backend Engineering",
    shortTitle: "Backend",
    priority: "primary",
    description: "Diseño y evolución de servicios, reglas de negocio e integraciones empresariales.",
    skills: ["C#", ".NET Framework", ".NET", ".NET Core", "ASP.NET", "ASP.NET Core", "MVC", "MVVM", "Entity Framework", "NHibernate", "Java", "Python", "FastAPI", "Flask", "Django", "Node.js"],
  },
  {
    id: "integrations",
    title: "Enterprise Integrations",
    shortTitle: "Integrations",
    priority: "primary",
    description: "APIs, mensajería y procesamiento confiable entre sistemas con reglas de negocio distintas.",
    skills: ["REST APIs", "Web Services", "System Integration", "API Integration", "Message Queues", "MSMQ", "Kafka", "RabbitMQ", "Tibco", "MQ Series", "XML", "JSON", "File-based integrations", "Batch Processing", "Schedulers", "Redis", "Enterprise Messaging"],
  },
  {
    id: "architecture",
    title: "Software Architecture",
    shortTitle: "Architecture",
    priority: "primary",
    description: "Experiencia de arquitectura aplicada para mantener límites claros y cambios controlados.",
    skills: ["Software Architecture", "Backend Architecture", "Integration Architecture", "API Architecture", "Microservices", "SOA", "Distributed Systems", "Clean Architecture", "SOLID", "Dependency Injection", "Design Patterns", "Event-driven Integration", "Legacy Modernization"],
  },
  {
    id: "ai",
    title: "AI Engineering",
    shortTitle: "AI Engineering",
    priority: "primary",
    description: "IA incorporada al proceso de ingeniería para acelerar análisis, calidad y automatización con revisión humana.",
    skills: ["Generative AI", "LLMs", "Prompt Engineering", "AI Agents", "RAG", "AI-Assisted Development", "Codebase Analysis", "AI-assisted Debugging", "Root Cause Assistance", "Automated Test Generation", "Documentation Generation", "Refactoring Assistance", "Requirements Analysis", "Automated Workflows", "Rapid Prototyping", "Local AI", "Ollama", "OpenAI / AI APIs"],
  },
  {
    id: "quality",
    title: "Testing & Software Quality",
    shortTitle: "Quality",
    priority: "primary",
    description: "Calidad como una práctica de diseño, diagnóstico y evolución continua.",
    skills: ["Unit Testing", "Integration Testing", "Automated Testing", "NUnit", "Moq", "TDD", "Code Review", "Refactoring", "Debugging", "Performance Analysis", "Root Cause Analysis", "Software Quality", "Maintainability", "Clean Code"],
  },
  {
    id: "java",
    title: "Java Ecosystem",
    shortTitle: "Java",
    priority: "supporting",
    description: "Experiencia y conocimiento técnico dentro del ecosistema Java empresarial.",
    skills: ["Java", "Spring", "Spring Boot", "Spring MVC", "Spring Data", "Spring Batch", "Spring Security", "Spring Integration", "Spring REST", "LDAP", "AMQP", "Spring Data Redis", "Spring Cache", "Spring AOP", "Hibernate", "Lambda"],
  },
  {
    id: "data",
    title: "Data, Python & ETL",
    shortTitle: "Data / ETL",
    priority: "supporting",
    description: "Procesamiento, análisis y movimientos de datos como capacidad complementaria de ingeniería.",
    skills: ["Python", "NumPy", "Pandas", "Spark", "Scikit-learn", "SQLAlchemy", "Requests", "Jupyter Notebook", "Data Analysis", "Data Science", "Machine Learning", "Data Processing", "ETL", "ETL Architecture", "Java ETLs", "Python ETLs", "Apache NiFi", "Microsoft Fabric", "Big Data", "Data Engineering", "Data Analytics"],
  },
  {
    id: "databases",
    title: "Databases & Search",
    shortTitle: "Databases",
    priority: "supporting",
    description: "Modelado y trabajo con almacenamiento relacional, documental, caché y búsqueda.",
    skills: ["SQL Server", "PostgreSQL", "MySQL", "Oracle", "Amazon RDS", "Microsoft Fabric", "Access", "HSQLDB", "MongoDB", "Amazon DocumentDB", "Elasticsearch", "Redis"],
  },
  {
    id: "cloud",
    title: "Cloud & Delivery",
    shortTitle: "Cloud / DevOps",
    priority: "supporting",
    description: "Entornos, entrega y operación de aplicaciones como parte del ciclo de vida del software.",
    skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "OpenShift", "Git", "GitHub", "Azure DevOps", "CI/CD", "IIS", "Tomcat", "WebLogic"],
  },
  {
    id: "frontend",
    title: "Frontend Complementary",
    shortTitle: "Frontend",
    priority: "supporting",
    description: "Capacidad complementaria para construir y modernizar experiencias web conectadas a sistemas robustos.",
    skills: ["React", "JavaScript", "HTML", "CSS", "AJAX", "jQuery", "Bootstrap", "DataTables", "DHTML", "JSON"],
  },
  {
    id: "bi",
    title: "Business Intelligence",
    shortTitle: "BI",
    priority: "supporting",
    description: "Visualización y lectura operativa de datos para acompañar decisiones.",
    skills: ["Business Intelligence", "Dashboards", "Data Visualization", "Power BI", "Looker Studio", "Kibana", "D3.js"],
  },
]

export const aiWorkflow: WorkflowStep[] = [
  { title: "Understand", detail: "Contexto, dominio y restricciones." },
  { title: "Analyze", detail: "Código, datos y causas posibles." },
  { title: "Design", detail: "Límites y decisión técnica." },
  { title: "Build", detail: "Implementación incremental." },
  { title: "Test", detail: "Pruebas y escenarios relevantes." },
  { title: "Review", detail: "Criterio humano y evidencia." },
  { title: "Automate", detail: "Flujos repetibles con control." },
]

export const legacyWorkflow: WorkflowStep[] = [
  { title: "Understand Existing System", detail: "Lectura del comportamiento actual." },
  { title: "Identify Business Rules", detail: "Reglas que no se pueden perder." },
  { title: "Decouple", detail: "Separar responsabilidades y dependencias." },
  { title: "Introduce APIs", detail: "Abrir límites de integración." },
  { title: "Modern Backend", detail: "Evolucionar sin reescribir a ciegas." },
  { title: "Modern Web", detail: "Mejorar la experiencia paso a paso." },
  { title: "Automated Tests", detail: "Proteger el conocimiento recuperado." },
  { title: "Controlled Migration", detail: "Avanzar con validación y reversibilidad." },
]

export const workMethod: WorkflowStep[] = [
  { title: "Understand", detail: "Entender problema, negocio y restricciones." },
  { title: "Design", detail: "Elegir una solución simple y mantenible." },
  { title: "Build", detail: "Implementar de forma incremental." },
  { title: "Test", detail: "Automatizar calidad donde aporta protección." },
  { title: "Diagnose", detail: "Encontrar la causa real antes de corregir." },
  { title: "Improve", detail: "Refactorizar y evolucionar con cuidado." },
  { title: "Accelerate with AI", detail: "Aplicar IA cuando aporta velocidad y profundidad." },
]

export const cv = {
  name: "Federico Lapido",
  location: "Buenos Aires, Argentina",
  title: "Senior Software Engineer",
  specialties: "Backend · Architecture · Integrations · AI Engineering",
  headline: "Más de 20 años construyendo, manteniendo y modernizando software empresarial.",
  summary: "Ingeniero de software enfocado en backend, integraciones empresariales, calidad y evolución de sistemas. Combino experiencia en C#/.NET, APIs y debugging profundo con una práctica actual de IA aplicada al análisis, la automatización y la entrega de software.",

  links: {
    github: "https://github.com/flapido",
    linkedin: "https://www.linkedin.com/in/federico-lapido",
    email: "lapidofederico@gmail.com",
  },

  experience: [
    {
      org: "WiseTech Global",
      role: "Software Engineer",
      location: "Buenos Aires, Argentina",
      period: "2004 – June 2026",
      summary: "Trabajo de ingeniería backend para Accounting y E-Invoicing dentro de software empresarial.",
      chapters: [
        "Enterprise Software Engineering y Backend Engineering",
        "Accounting, E-Invoicing e integraciones fiscales para Costa Rica, México, Chile y República Dominicana",
        "Handlers, pipelines de mensajería, XML mappings, lógica de negocio y REST APIs",
        "Testing y calidad: NUnit, Moq, TDD, refactoring, debugging profundo y Root Cause Analysis",
        "Documentación técnica y Developer Functional Reviews",
        "AI-Assisted Engineering como evolución actual del proceso de trabajo",
      ],
    },
  ],

  careerHighlights: [
    "20+ Years · Enterprise Software",
    "Backend Engineering",
    "Multi-country Integrations",
    "Accounting & E-Invoicing",
    "Automated Testing",
    "Integration Engineering",
    "Legacy Modernization",
    "AI-Assisted Engineering",
  ],

  relevantProjects: [
    {
      title: "Integraciones de facturación electrónica",
      desc: "Integraciones fiscales para los países documentados, con mapeos XML, pipelines y reglas de integración.",
    },
    {
      title: "Calidad y diagnóstico",
      desc: "Testing automatizado, TDD, refactoring, investigación de incidentes y análisis de causa raíz.",
    },
    {
      title: "IA aplicada a ingeniería",
      desc: "Asistencia para análisis, debugging, generación de pruebas y documentación bajo revisión humana.",
    },
  ],

  languages: [
    { lang: "Español", level: "Nativo" },
    { lang: "Inglés", level: "Professional working / Technical proficiency" },
  ],

  education: {
    title: "Estudios en Tecnología de la Información",
    place: "Argentina",
  },

  certification: {
    title: "Google Gemini — Artificial Intelligence",
    issuer: "LinkedIn Learning",
    year: "2025",
  },

  hasPdf: true,
  pdfPath: "/cv/Federico_Lapido_CV.pdf",
} as const
