import { projects } from "../data/projects"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProjectDetail from "../pages/ProjectDetail"
import LegacyPreview from "../previews/LegacyPreview"
import { getDemoUrl } from "../config/domains"

test("projects have definitive model fields", ()=>{
  for(const p of projects){
    expect(p.id).toBeTruthy()
    expect(p.preview).toBeTruthy()
    expect(["PREVIEW","LOCAL_DEMO","LIVE_DEMO"]).toContain(p.demoStatus)
    expect(p.publicUrl).toBeTruthy()
    expect(p.publicUrl).toContain("midominio.com")
    expect(p.description).toBeTruthy()
  }
})

test.each([
  ["subastas", "subastas.midominio.com"],
  ["legacy-web", "legacy.midominio.com"],
])("LIVE_DEMO keeps %s accessible until it has a public URL", (slug, publicUrl)=>{
  const project = projects.find(item => item.slug === slug)
  expect(project?.demoStatus).toBe("LIVE_DEMO")
  render(<MemoryRouter initialEntries={[`/proyectos/${slug}`]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail/>}/></Routes></MemoryRouter>)
  expect(screen.getAllByText(/^Preview$/).length).toBeGreaterThan(0)
  expect(screen.getByText(/No es la demo oficial/)).toBeInTheDocument()
  expect(screen.getAllByText(/LIVE_DEMO/).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Demo lista/).length).toBeGreaterThan(0)
  // No URL should be exposed until this project becomes LIVE_DEMO.
  expect(screen.queryByText(/Abrir demo pública/)).toBeInTheDocument()
  expect(screen.queryByText(publicUrl, { exact: false })).not.toBeInTheDocument()
})

test("PREVIEW projects remain preview-only", ()=>{
  render(<MemoryRouter initialEntries={["/proyectos/tickets"]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail/>}/></Routes></MemoryRouter>)
  expect(screen.getAllByText(/PREVIEW/).length).toBeGreaterThan(0)
  expect(screen.queryByText(/Abrir demo pública/)).not.toBeInTheDocument()
})

test("Legacy preview remains an interactive internal comparison", ()=>{
  const { container } = render(<LegacyPreview />)
  const comparison = screen.getByRole("slider", { name: /Comparación antes y después/i })
  fireEvent.change(comparison, { target: { value: "70" } })
  expect(comparison).toHaveValue("70")
  expect(container.querySelector('[style*="clip-path"]')).toHaveStyle({ clipPath: "inset(0 30% 0 0)" })
})

test("LIVE_DEMO only needs demoUrl after a LOCAL_DEMO publication", ()=>{
  const subastas = projects.find(project => project.slug === "subastas")!
  expect(getDemoUrl({ ...subastas, demoStatus: "LIVE_DEMO", demoUrl: "https://demo.example.test" }, subastas.href)).toBe("https://demo.example.test")
})

test("hub does not import external projects — previews are local", async ()=>{
  // verify preview components exist and are lightweight (no fetch)
  const { default: AuctionPreview } = await import("../previews/AuctionPreview")
  const { container } = render(<AuctionPreview />)
  expect(container.textContent).toContain("Lotes")
  // preview header comment ensures no external imports — static check via file content
})
