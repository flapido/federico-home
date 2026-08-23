// Federico Home = hub/showroom. No mantiene lógica de producto ni demo.
// Cada producto real vive en C:\Dev\Projects\<producto>
// Cada demo pública completa vive en C:\Dev\Projects\<producto>-demo y se publica en subdominio.
// Federico Home solo presenta (PREVIEW) y enlaza (demoUrl/publicUrl).
// midominio.com es PLACEHOLDER no publicado — no configurar DNS hasta autorización.

export const BASE_DOMAIN = "midominio.com"
export const USE_SUBDOMAINS = false // true solo cuando demo real tenga URL pública
export const PLACEHOLDER_NOTE = "no publicado — placeholder"

export const projectSubdomains: Record<string, string> = {
  subastas: `https://subastas.${BASE_DOMAIN}`,
  tickets: `https://tickets.${BASE_DOMAIN}`,
  prepaga: `https://prepaga.${BASE_DOMAIN}`,
  "legacy-web": `https://legacy.${BASE_DOMAIN}`,
  "company-workspace": `https://company.${BASE_DOMAIN}`,
  lab: `https://lab.${BASE_DOMAIN}`,
}

// Solo usado cuando LIVE_DEMO; en PREVIEW/LOCAL_DEMO devuelve ruta interna
export function getProjectUrl(slug: string, internalPath: string) {
  if (USE_SUBDOMAINS && projectSubdomains[slug]) return projectSubdomains[slug]
  return internalPath
}

export function getDemoUrl(project: { demoStatus: string; demoUrl?: string; publicUrl: string }, fallback: string) {
  if (project.demoStatus === "LIVE_DEMO" && project.demoUrl) return project.demoUrl
  if (project.demoStatus === "LIVE_DEMO") return `https://${project.publicUrl}`
  return fallback
}
