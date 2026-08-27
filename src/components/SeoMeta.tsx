import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const site = "https://federico-home.pages.dev";
const pages: Record<string, [string, string]> = {
  "/": ["Federico Lapido — Senior Software Engineer", "Backend, arquitectura, integraciones, modernización legacy e IA aplicada."],
  "/soluciones": ["Federico Lapido — Software a medida, automatización e IA", "Software a medida, modernización de sistemas, automatización e IA aplicada."],
  "/proyectos": ["Proyectos — Federico Lapido", "Casos de desarrollo, demos y evidencia de software real."],
  "/proyectos/legacy-web": ["Modernización de sistemas Legacy — Federico Lapido", "Caso de modernización progresiva de sistemas hacia una experiencia web."],
  "/proyectos/subastas": ["Sistema de Subastas — Caso de desarrollo | Federico Lapido", "Caso real de catálogo, compra y subastas adaptable a otros procesos."],
  "/proyectos/archivo-digital": ["Archivo Digital — Gestión documental | Federico Lapido", "Documentos, imágenes e información organizada en una experiencia navegable."],
  "/about": ["Sobre mí — Federico Lapido", "Experiencia, criterio técnico y recorrido profesional de Federico Lapido."],
  "/lab": ["Lab — Federico Lapido", "Experimentos, procesos y herramientas en exploración."],
  "/cv": ["CV — Federico Lapido", "Currículum profesional de Federico Lapido, Senior Software Engineer."],
  "/contacto": ["Contacto — Federico Lapido", "Contame tu idea, consulta o necesidad de software."],
  "/gracias": ["Libro de visitas y referencias — Federico Lapido", "Dejá un saludo o una referencia profesional para Federico Lapido."],
};
export default function SeoMeta() { const { pathname } = useLocation(); useEffect(() => { const [title, description] = pages[pathname] || pages["/"]; const canonical = `${site}${pathname === "/" ? "/" : pathname}`; document.title = title; document.querySelector('meta[name="description"]')?.setAttribute("content", description); document.querySelector('link[rel="canonical"]')?.setAttribute("href", canonical); document.querySelector('meta[property="og:title"]')?.setAttribute("content", title); document.querySelector('meta[property="og:description"]')?.setAttribute("content", description); document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical); document.querySelector('meta[name="robots"]')?.setAttribute("content", pathname.startsWith("/admin") ? "noindex,nofollow" : "index,follow"); }, [pathname]); return null; }
