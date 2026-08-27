export type GuideStep = { id: "home" | "projects" | "legacy" | "subastas" | "avatar" | "soluciones" | "contacto"; route: string; target: string; message: string; surprise?: boolean };
export const guideSteps: GuideStep[] = [
  { id: "home", route: "/", target: "guide-home", message: "Arranquemos por acá. Federico combina más de 20 años construyendo software con backend, arquitectura, integraciones e IA aplicada." },
  { id: "projects", route: "/proyectos", target: "guide-projects", message: "Acá hay proyectos, demos y experimentos reales. Mirá algunas cosas que ya construyó." },
  { id: "legacy", route: "/proyectos/legacy-web", target: "guide-legacy", message: "Conservar lo importante de un sistema y llevarlo a una experiencia web moderna." },
  { id: "subastas", route: "/proyectos/subastas", target: "guide-subastas", message: "También puede construir productos nuevos: esta base se adapta a ventas, catálogos o reservas." },
  { id: "avatar", route: "/about", target: "guide-avatar", message: "Antes de seguir, te quiero mostrar una pequeña sorpresa.", surprise: true },
  { id: "soluciones", route: "/soluciones", target: "guide-soluciones", message: "Todo esto también puede adaptarse a otras ideas y necesidades." },
  { id: "contacto", route: "/contacto", target: "guide-contacto", message: "Llegamos al final. Si algo de esto te dio una idea, podés contársela directamente a Federico." },
];
