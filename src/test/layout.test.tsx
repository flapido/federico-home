import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import Layout from "../components/Layout"
import VisitCounter from "../components/VisitCounter"

vi.mock("../lib/analytics", () => ({ analyticsClientEnabled: () => true }))

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); localStorage.clear(); cleanup() })

function renderLayout() {
  return render(<MemoryRouter initialEntries={["/"]}><Routes><Route element={<Layout />}><Route index element={<div>Página de inicio</div>} /><Route path="proyectos" element={<div>Proyectos cargados</div>} /></Route></Routes></MemoryRouter>)
}

describe("VisitCounter resilience", () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubEnv("VITE_ENABLE_VISIT_COUNTER", "true")
  })

  test("does not render or fetch while disabled", () => {
    vi.stubEnv("VITE_ENABLE_VISIT_COUNTER", "false")
    localStorage.setItem("fh:visit-counter:last-known", JSON.stringify({ value: 1234, ts: Date.now() }))
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ total: 1234 }), { status: 200, headers: { "content-type": "application/json" } }))
    vi.stubGlobal("fetch", fetchMock)

    render(<VisitCounter />)

    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("does not render or fetch when the flag is absent", () => {
    vi.unstubAllEnvs()
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ total: 1234 }), { status: 200, headers: { "content-type": "application/json" } }))
    vi.stubGlobal("fetch", fetchMock)

    render(<VisitCounter />)

    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  test("retains the last known count while the endpoint is unavailable", async () => {
    localStorage.setItem("fh:visit-counter:last-known", JSON.stringify({ value: 1234, ts: Date.now() }))
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "No disponible." }), { status: 503, headers: { "content-type": "application/json" } })))
    render(<VisitCounter />)
    expect(await screen.findByText(/Nº 1\.234/)).toBeInTheDocument()
  })

  test("does not display expired cache when the endpoint is unavailable", async () => {
    localStorage.setItem("fh:visit-counter:last-known", JSON.stringify({ value: 9999, ts: Date.now() - 11 * 60 * 1000 }))
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: "No disponible." }), { status: 503, headers: { "content-type": "application/json" } })))
    render(<VisitCounter />)
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  })

  test("clears the cache when the endpoint returns a valid zero total", async () => {
    localStorage.setItem("fh:visit-counter:last-known", JSON.stringify({ value: 1234, ts: Date.now() }))
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ total: 0 }), { status: 200, headers: { "content-type": "application/json" } })))
    render(<VisitCounter />)
    await vi.waitFor(() => expect(localStorage.getItem("fh:visit-counter:last-known")).toBeNull())
    expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  })

  test("renders and stores a fresh valid count", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ total: 5678 }), { status: 200, headers: { "content-type": "application/json" } }))
    vi.stubGlobal("fetch", fetchMock)
    render(<VisitCounter />)
    expect(await screen.findByText(/Nº 5\.678/)).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(JSON.parse(localStorage.getItem("fh:visit-counter:last-known") ?? "null")).toMatchObject({ value: 5678 })
  })
})

test("layout exposes a skip link and verified professional contact", () => {
  const fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
  renderLayout()
  expect(screen.getByRole("link", { name: /Saltar al contenido/i })).toHaveAttribute("href", "#contenido")
  expect(screen.getAllByRole("link", { name: "Email" }).some(link => link.getAttribute("href") === "mailto:lapidofederico@gmail.com")).toBe(true)
  expect(screen.queryByText(/federico\.lapido@email/i)).not.toBeInTheDocument()
  expect(screen.queryByText(/Nº/)).not.toBeInTheDocument()
  expect(fetchMock).not.toHaveBeenCalled()
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
