import { spawn } from "node:child_process"
import { mkdir } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = dirname(fileURLToPath(import.meta.url))
const baseUrl = "http://127.0.0.1:5173"
const outputDir = join(root, "screenshots", "v2")
const viewports = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "412x915", width: 412, height: 915 },
  { name: "430x932", width: 430, height: 932 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
]
const routes = ["/", "/proyectos", "/proyectos/subastas", "/proyectos/legacy-web", "/proyectos/archivo-digital", "/proyectos/company-workspace", "/soluciones", "/lab", "/about", "/cv", "/ruta-inexistente"]

async function available() {
  try {
    const response = await fetch(baseUrl)
    return response.ok
  } catch {
    return false
  }
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (await available()) return true
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  return false
}

const shouldStartServer = !(await available())
const dev = shouldStartServer ? spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1"], { cwd: root, stdio: "ignore", shell: true }) : null

try {
  if (!(await waitForServer())) throw new Error("No se pudo iniciar Vite en http://127.0.0.1:5173")
  await mkdir(outputDir, { recursive: true })
  const { chromium } = await import("playwright")
  const browser = await chromium.launch({ headless: true })
  const findings = []

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 })
    for (const route of routes) {
      const page = await context.newPage()
      const consoleErrors = []
      page.on("console", message => { if (message.type() === "error") consoleErrors.push(message.text()) })
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" })
      const dimensions = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }))
      const hasOverflow = dimensions.scrollWidth > dimensions.clientWidth
      const fileName = `${viewport.name}${route === "/" ? "-home" : route.replaceAll("/", "-")}.png`
      await page.screenshot({ path: join(outputDir, fileName), fullPage: true })
      if (!response?.ok() || hasOverflow || consoleErrors.length) findings.push({ viewport: viewport.name, route, status: response?.status(), overflow: hasOverflow, consoleErrors })
      await page.close()
    }
    await context.close()
  }

  await browser.close()
  if (findings.length) {
    console.error(JSON.stringify(findings, null, 2))
    process.exitCode = 1
  } else {
    console.log(`Visual smoke PASS · ${viewports.length} viewports · ${routes.length} routes · screenshots: ${outputDir}`)
  }
} finally {
  if (dev) dev.kill()
}
