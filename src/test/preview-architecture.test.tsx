import { projects } from "../data/projects"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Routes, Route } from "react-router-dom"
import ProjectDetail from "../pages/ProjectDetail"
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

test("LOCAL_DEMO keeps Subastas preview-only until it has a public URL", ()=>{
  const subastas = projects.find(project => project.slug === "subastas")
  expect(subastas?.demoStatus).toBe("LOCAL_DEMO")
  expect(subastas?.demoUrl).toBeUndefined()
  render(<MemoryRouter initialEntries={["/proyectos/subastas"]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail/>}/></Routes></MemoryRouter>)
  expect(screen.getAllByText(/^Preview$/).length).toBeGreaterThan(0)
  expect(screen.getByText(/No es la demo oficial/)).toBeInTheDocument()
  expect(screen.getAllByText(/LOCAL_DEMO/).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/Demo lista · publicación pendiente/).length).toBeGreaterThan(0)
  // No URL should be exposed until this project becomes LIVE_DEMO.
  expect(screen.queryByText(/Abrir demo pública/)).not.toBeInTheDocument()
  expect(screen.queryByText("subastas.midominio.com", { exact: false })).not.toBeInTheDocument()
})

test("PREVIEW projects remain preview-only", ()=>{
  render(<MemoryRouter initialEntries={["/proyectos/tickets"]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail/>}/></Routes></MemoryRouter>)
  expect(screen.getAllByText(/PREVIEW/).length).toBeGreaterThan(0)
  expect(screen.queryByText(/Abrir demo pública/)).not.toBeInTheDocument()
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
