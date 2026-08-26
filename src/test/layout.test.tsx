import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Layout from "../components/Layout"

function renderLayout() {
  return render(<MemoryRouter initialEntries={["/"]}><Routes><Route element={<Layout />}><Route index element={<div>Página de inicio</div>} /><Route path="proyectos" element={<div>Proyectos cargados</div>} /></Route></Routes></MemoryRouter>)
}

test("layout exposes a skip link and verified professional contact", () => {
  renderLayout()
  expect(screen.getByRole("link", { name: /Saltar al contenido/i })).toHaveAttribute("href", "#contenido")
  expect(screen.getAllByRole("link", { name: "Email" }).some(link => link.getAttribute("href") === "mailto:lapidofederico@gmail.com")).toBe(true)
  expect(screen.queryByText(/federico\.lapido@email/i)).not.toBeInTheDocument()
})

test("mobile navigation exposes core destinations and closes after navigation", async () => {
  const user = userEvent.setup()
  renderLayout()
  await user.click(screen.getByRole("button", { name: /Abrir menú/i }))
  const navigation = screen.getByRole("navigation", { name: /Principal móvil/i })
  expect(within(navigation).getByRole("link", { name: "Experiencia" })).toHaveAttribute("href", "/#experiencia")
  await user.click(within(navigation).getByRole("link", { name: "Proyectos" }))
  expect(screen.getByText("Proyectos cargados")).toBeInTheDocument()
  expect(screen.queryByRole("navigation", { name: /Principal móvil/i })).not.toBeInTheDocument()
})
