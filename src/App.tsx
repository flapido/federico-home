import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import Lab from "./pages/Lab"
import About from "./pages/About"
import CV from "./pages/CV"
import Solutions from "./pages/Solutions"
import Contact from "./pages/Contact"
import AnalyticsTracker from "./components/AnalyticsTracker"
import NotFound from "./pages/NotFound"

export default function App(){
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="proyectos" element={<Projects />} />
          <Route path="proyectos/:slug" element={<ProjectDetail />} />
          <Route path="soluciones" element={<Solutions />} />
          <Route path="contacto" element={<Contact />} />
          <Route path="lab" element={<Lab />} />
          <Route path="about" element={<About />} />
          <Route path="cv" element={<CV />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
