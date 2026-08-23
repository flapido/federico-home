export const cv = {
  name: "Federico Lapido",
  location: "Buenos Aires, Argentina",
  title: "Software Engineer — Backend · Integraciones · AI-Assisted Development",
  headline: "Más de 20 años construyendo sistemas que funcionan en producción.",
  summary:
    "Backend e integraciones empresariales. Enfoque en C#/.NET, SQL Server, REST APIs y arquitectura mantenible. Especializado en facturación electrónica, testing automatizado y desarrollo asistido con IA.",

  links: {
    github: "https://github.com/flapido",
    linkedin: "https://www.linkedin.com/in/federico-lapido",
    email: "federico.lapido@email.com", // no exponer teléfono; email placeholder si no configurado — reemplazar en public/cv si se desea
  },

  experience: [
    {
      org: "WiseTech Global",
      role: "Software Engineer",
      location: "Buenos Aires",
      period: "2004 – June 2026",
      summary: "Desarrollo backend C#/.NET para módulos Accounting y E-Invoicing en plataforma enterprise global.",
      bullets: [
        "Integraciones fiscales para Costa Rica, México, Chile y República Dominicana.",
        "Handlers, pipelines de mensajería, XML mappings y lógica de integración.",
        "REST APIs, testing automatizado (NUnit, Moq), TDD, refactoring y debugging profundo.",
        "Root cause analysis, documentación técnica y Developer Functional Reviews.",
        "Uso de IA para análisis, debugging, generación de tests y documentación.",
      ],
    },
  ],

  relevantProjects: [
    {
      title: "Integraciones de Facturación Electrónica",
      desc: "Integraciones fiscales enterprise multi-país con validación, mapeos XML y pipelines robustos.",
    },
    {
      title: "Automatización de Testing",
      desc: "Suites de tests unitarios y de integración, TDD, Moq y pipelines de calidad.",
    },
    {
      title: "IA aplicada al Desarrollo",
      desc: "Análisis asistido, generación de tests, debugging y documentación con IA — sin perder rigor.",
    },
  ],

  skills: {
    core: ["C#", ".NET", "SQL", "SQL Server", "REST APIs", "Backend Development", "System Integration", "API Integration"],
    quality: ["NUnit", "Moq", "Unit Testing", "TDD", "Clean Code", "SOLID", "Dependency Injection"],
    tooling: ["Git", "GitHub", "Azure DevOps", "Visual Studio Code"],
    data: ["XML", "JSON"],
    ai: ["Prompt Engineering", "AI-Assisted Development"],
  },

  languages: [
    { lang: "Español", level: "Nativo" },
    { lang: "Inglés", level: "Profesional técnico — Professional working proficiency" },
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

  hasPdf: true, // public/cv/Federico_Lapido_CV.pdf existe — habilita Descargar CV
  pdfPath: "/cv/Federico_Lapido_CV.pdf",
}
