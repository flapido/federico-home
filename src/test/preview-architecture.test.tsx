import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { projects } from "../data/projects"
import ProjectDetail from "../pages/ProjectDetail"
import LegacyPreview from "../previews/LegacyPreview"

test("projects use the explicit demo-state model", () => {
  for (const project of projects) {
    expect(project.id).toBeTruthy()
    expect(project.preview).toBeTruthy()
    expect(["PREVIEW", "LOCAL_DEMO", "LIVE_DEMO"]).toContain(project.demoStatus)
    expect(project.caseStudy.overview).toBeTruthy()
  }
})

test.each(["subastas", "legacy-web"])("%s is described as a local demo without public link", slug => {
  render(<MemoryRouter initialEntries={[`/proyectos/${slug}`]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail />} /></Routes></MemoryRouter>)
  expect(screen.getAllByText("LOCAL_DEMO").length).toBeGreaterThan(0)
  expect(screen.getByText(/Demo local, sin publicación/i)).toBeInTheDocument()
  expect(screen.queryByRole("link", { name: /demo pública/i })).not.toBeInTheDocument()
})

test("PREVIEW projects remain preview-only", () => {
  render(<MemoryRouter initialEntries={["/proyectos/tickets"]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail />} /></Routes></MemoryRouter>)
  expect(screen.getAllByText("PREVIEW").length).toBeGreaterThan(0)
  expect(screen.getAllByText(/datos ficticios/i).length).toBeGreaterThan(0)
})

test("Legacy preview remains an interactive internal comparison", () => {
  const { container } = render(<LegacyPreview />)
  const comparison = screen.getByRole("slider", { name: /Comparación antes y después/i })
  fireEvent.change(comparison, { target: { value: "70" } })
  expect(comparison).toHaveValue("70")
  expect(container.querySelector('[style*="clip-path"]')).toHaveStyle({ clipPath: "inset(0 30% 0 0)" })
})

test("Company Workspace case study preserves human-controlled wording", () => {
  render(<MemoryRouter initialEntries={["/proyectos/company-workspace"]}><Routes><Route path="/proyectos/:slug" element={<ProjectDetail />} /></Routes></MemoryRouter>)
  expect(screen.getAllByText(/límites humanos/i).length).toBeGreaterThan(0)
  expect(screen.getByText(/OWNER_EXECUTION_MANDATE/i)).toBeInTheDocument()
})
