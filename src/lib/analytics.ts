export type AnalyticsEvent = "visit" | "page_view" | "contact_open" | "whatsapp_click" | "email_click" | "linkedin_click" | "demo_click" | "avatar_replay";

const sourceFromPath = (path: string) => {
  if (path === "/") return "home";
  if (path === "/soluciones") return "soluciones";
  if (path === "/contacto") return "contacto";
  if (path === "/about") return "about";
  if (path === "/proyectos") return "projects";
  if (path === "/lab") return "lab";
  if (path === "/cv") return "cv";
  const project = /^\/proyectos\/([a-z-]+)$/.exec(path)?.[1];
  return project === "legacy-web" || project === "subastas" || project === "archivo-digital" ? project : "other";
};

export function trackEvent(event: AnalyticsEvent, path = window.location.pathname, source = sourceFromPath(path)) {
  const payload = JSON.stringify({ event, path, source });
  try {
    if (navigator.sendBeacon) {
      const queued = navigator.sendBeacon("/api/analytics/event", new Blob([payload], { type: "application/json" }));
      if (queued) return;
    }
    void fetch("/api/analytics/event", { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => undefined);
  } catch { /* analytics is always best effort */ }
}

export function isNewVisit(now = Date.now()) {
  try {
    const key = "federico-home-visit-v1";
    const previous = Number(window.localStorage.getItem(key) || 0);
    if (previous > 0 && now - previous < 30 * 60 * 1000) return false;
    window.localStorage.setItem(key, String(now));
    return true;
  } catch { return false; }
}

export function trackKnownExternalLink(anchor: HTMLAnchorElement) {
  const href = anchor.href;
  if (href.startsWith("https://wa.me/5491157642626")) trackEvent("whatsapp_click");
  else if (href.startsWith("mailto:lapidofederico@gmail.com")) trackEvent("email_click");
  else if (href.startsWith("https://www.linkedin.com/in/federico-lapido")) trackEvent("linkedin_click");
  else if (anchor.dataset.analyticsDemo === "true") trackEvent("demo_click", window.location.pathname, anchor.dataset.analyticsSource || "other");
}
