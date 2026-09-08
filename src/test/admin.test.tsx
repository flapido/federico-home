import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Admin from "../pages/Admin";

const summary = {
  periods: { today: { visits: 1, pageViews: 1, contacts: 0, whatsapp: 0, avatar: 0 }, seven: { visits: 1, pageViews: 1, contacts: 0, whatsapp: 0, avatar: 0 }, thirty: { visits: 1, pageViews: 1, contacts: 0, whatsapp: 0, avatar: 0 }, total: { visits: 1, contacts: 0, avatar: 0 } },
  guide: { today: { impressions: 0, started: 0, completed: 0, exited: 0, avatar: 0, contact: 0, whatsapp: 0 }, seven: { impressions: 0, started: 0, completed: 0, exited: 0, avatar: 0, contact: 0, whatsapp: 0 }, thirty: { impressions: 0, started: 0, completed: 0, exited: 0, avatar: 0, contact: 0, whatsapp: 0 } },
  interactions: { contacts: 0, whatsapp: 0, email: 0, linkedin: 0, demos: 0, avatar: 0 }, avatar: { today: 0, seven: 0, thirty: 0, total: 0, aboutViews: 0, rate: 0 }, contact: { views: 0, submitted: 0, whatsapp: 0, email: 0, linkedin: 0, rate: 0 }, origins: [], pages: [], series: [],
  visitors: { today: 1, seven: 1, thirty: 1, topCountries: [], recent: [{ time: "8 de septiembre de 2026, 02:52 a. m.", location: "CABA, Buenos Aires, AR", path: "/soluciones", source: "soluciones", visitorId: "newest01" }] },
};

test("recent activity shows the complete Argentine date and time", async () => {
  const fetchMock = vi.fn((input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    return Promise.resolve(new Response(JSON.stringify(url.includes("analytics/summary") ? summary : { entries: [] }), { status: 200, headers: { "Content-Type": "application/json" } }));
  });
  vi.stubGlobal("fetch", fetchMock);

  render(<MemoryRouter initialEntries={["/admin/dashboard"]}><Admin /></MemoryRouter>);

  expect(await screen.findByRole("columnheader", { name: "Fecha y hora" })).toBeInTheDocument();
  expect(screen.getByText("8 de septiembre de 2026, 02:52 a. m.")).toBeInTheDocument();
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/admin/guestbook", { credentials: "same-origin" }));
  vi.unstubAllGlobals();
});
