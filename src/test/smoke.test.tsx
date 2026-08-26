import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About";
import CV from "../pages/CV";
import Home from "../pages/Home";
import Lab from "../pages/Lab";
import NotFound from "../pages/NotFound";
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/ProjectDetail";
import Solutions from "../pages/Solutions";
import Contact from "../pages/Contact";

test("Home communicates senior positioning and primary paths", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /Federico Lapido/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument();
  expect(screen.getByText(/Más de 20 años construyendo/i)).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Ver experiencia/i }),
  ).toHaveAttribute("href", "#experiencia");
  expect(screen.getByRole("link", { name: /Descargar CV/i })).toHaveAttribute(
    "href",
    "/cv/Federico_Lapido_CV.pdf",
  );
  expect(screen.getAllByText("Technical Expertise").length).toBeGreaterThan(0);
});

test("Projects lists case studies with honest statuses", () => {
  render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /Proyectos con contexto/i }),
  ).toBeInTheDocument();
  expect(screen.getByText("Sistema de Subastas")).toBeInTheDocument();
  expect(screen.getByText("Company Workspace")).toBeInTheDocument();
  expect(screen.getByText("Archivo Digital")).toBeInTheDocument();
  expect(screen.getAllByText("LOCAL_DEMO").length).toBeGreaterThan(0);
});

test("Commercial case studies retain visual evidence and safe CTAs", () => {
  render(
    <MemoryRouter initialEntries={["/proyectos/legacy-web"]}>
      <Routes>
        <Route path="/proyectos/:slug" element={<ProjectDetail />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByText(/De una pantalla fija/i)).toBeInTheDocument();
  expect(
    screen.getByRole("img", { name: /sistema desktop legado/i }),
  ).toHaveAttribute("src", "/solutions/legacy/legacy-before.png");
  expect(
    screen.getByRole("link", { name: /Contame tu idea/i }),
  ).toHaveAttribute("href", "/contacto?origen=legacy-web");
});

test("Solutions presents evidence, honest states and commercial contact", () => {
  render(
    <MemoryRouter>
      <Solutions />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /Software real para/i }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("DEMO LOCAL")).toHaveLength(2);
  expect(screen.getByText("CASO REAL")).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: /Ver caso de subastas/i }),
  ).toHaveAttribute("href", "/proyectos/subastas");
  expect(screen.queryByText(/Quiniela/i)).not.toBeInTheDocument();
});

test("Contact offers a short, accessible commercial path", () => {
  render(
    <MemoryRouter initialEntries={["/contacto?origen=legacy-web"]}>
      <Contact />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /No hace falta tener todo definido/i }),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/Nombre/)).toHaveAttribute(
    "autocomplete",
    "name",
  );
  expect(screen.getByLabelText(/Email/)).toHaveAttribute(
    "autocomplete",
    "email",
  );
  expect(screen.getByRole("link", { name: /WhatsApp/i })).toHaveAttribute(
    "href",
    expect.stringContaining("wa.me/5491157642626"),
  );
  expect(screen.getByRole("link", { name: /Email/i })).toHaveAttribute(
    "href",
    expect.stringContaining("lapidofederico@gmail.com"),
  );
});

test("Lab renders Engineering Lab and explicit experiment state", () => {
  render(
    <MemoryRouter>
      <Lab />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /Experimentos y prototipos/i }),
  ).toBeInTheDocument();
  expect(screen.getAllByText("EXPERIMENT").length).toBeGreaterThan(0);
  expect(screen.getByText("FastAPI + Local AI")).toBeInTheDocument();
});

test("About contains professional sections", () => {
  render(
    <MemoryRouter>
      <About />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { name: /Ingeniería con contexto/i }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Quién soy" }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Qué puedo aportar" }),
  ).toBeInTheDocument();
});

test("CV preserves confirmed professional facts", () => {
  render(
    <MemoryRouter>
      <CV />
    </MemoryRouter>,
  );
  expect(screen.getAllByText(/Federico Lapido/i).length).toBeGreaterThan(0);
  expect(screen.getByText("WiseTech Global")).toBeInTheDocument();
  expect(screen.getAllByText("2004 – June 2026").length).toBeGreaterThan(0);
  expect(
    screen.getByText("Google Gemini — Artificial Intelligence"),
  ).toBeInTheDocument();
});

test("404 remains controlled", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>,
  );
  expect(screen.getByText(/Página no encontrada/i)).toBeInTheDocument();
});
