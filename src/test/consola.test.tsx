import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Consola from "../pages/Consola";

test("renders offline state by default with dark background", () => {
  render(
    <MemoryRouter initialEntries={["/consola"]}>
      <Routes>
        <Route path="/consola" element={<Consola />} />
      </Routes>
    </MemoryRouter>,
  );
  expect(screen.getByText(/PC OFFLINE/i)).toBeInTheDocument();
  expect(screen.getByText(/Agent Console OFFLINE/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Acceso remoto/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Enviar código/i })).toBeInTheDocument();
});

test("shows sent state after successful code request", async () => {
  const user = userEvent.setup();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = vi.fn().mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.includes("/api/consola/request-code") && init?.method === "POST") {
      return Promise.resolve(new Response("", { status: 200 }));
    }
    if (url.includes("/api/consola/status")) {
      return Promise.resolve(new Response(JSON.stringify({
        pc_online: false,
        agent_console_online: false,
        last_seen: null,
        pc_id: null,
        platform: null,
      }), { status: 200, headers: { "Content-Type": "application/json" } }));
    }
    return originalFetch(input, init);
  });

  render(
    <MemoryRouter initialEntries={["/consola"]}>
      <Routes>
        <Route path="/consola" element={<Consola />} />
      </Routes>
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("button", { name: /Enviar código/i }));
  expect(await screen.findByText(/Código enviado/i)).toBeInTheDocument();
  expect(screen.getByLabelText("Código")).toBeInTheDocument();

  globalThis.fetch = originalFetch;
});
