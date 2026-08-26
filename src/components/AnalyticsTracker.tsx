import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isNewVisit, trackEvent, trackKnownExternalLink } from "../lib/analytics";

export default function AnalyticsTracker() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    if (isNewVisit()) trackEvent("visit", path);
    trackEvent("page_view", path);
    if (path === "/contacto") trackEvent("contact_open", path);
  }, [location.pathname]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a") : null;
      if (target instanceof HTMLAnchorElement) trackKnownExternalLink(target);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
