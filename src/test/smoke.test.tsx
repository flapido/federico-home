import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import Home from "../pages/Home"
import Projects from "../pages/Projects"
import Lab from "../pages/Lab"
import About from "../pages/About"
import CV from "../pages/CV"
import NotFound from "../pages/NotFound"

test("Home renders Federico and tagline", ()=>{
  render(<MemoryRouter><Home /></MemoryRouter>)
  expect(screen.getByText(/Federico/)).toBeInTheDocument()
  expect(screen.getByText(/Ideas convertidas en/)).toBeInTheDocument()
  expect(screen.getByText(/Explorar proyectos/)).toBeInTheDocument()
  expect(screen.getAllByText(/Buenos Aires/).length).toBeGreaterThan(0)
})

test("Projects lists 5", ()=>{
  render(<MemoryRouter><Projects /></MemoryRouter>)
  expect(screen.getByText(/Sistema de Subastas/)).toBeInTheDocument()
  expect(screen.getByText(/Company Workspace/)).toBeInTheDocument()
})

test("Lab renders", ()=>{
  render(<MemoryRouter><Lab /></MemoryRouter>)
  expect(screen.getByText(/^Lab$/)).toBeInTheDocument()
  expect(screen.getByText(/cosas que estoy explorando/)).toBeInTheDocument()
})

test("About breve", ()=>{
  render(<MemoryRouter><About /></MemoryRouter>)
  expect(screen.getByText(/Construyo cosas\./)).toBeInTheDocument()
  expect(screen.getByText(/Pruebo ideas/)).toBeInTheDocument()
})

test("CV profesional", ()=>{
  render(<MemoryRouter><CV /></MemoryRouter>)
  expect(screen.getByText(/Federico Lapido/)).toBeInTheDocument()
  expect(screen.getAllByText(/Software Engineer/).length).toBeGreaterThan(0)
  expect(screen.getByText(/WiseTech Global/)).toBeInTheDocument()
  expect(screen.getAllByText(/Buenos Aires/).length).toBeGreaterThan(0)
})

test("404", ()=>{
  render(<MemoryRouter><NotFound /></MemoryRouter>)
  expect(screen.getByText(/no encontrada/i)).toBeInTheDocument()
})
