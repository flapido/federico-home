import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "../pages/Contact";
import { onRequestPost } from "../../functions/api/contacto";

test("contact validates friendly errors before sending", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("button", { name: /enviar consulta/i }));
  expect(await screen.findByText("Escribí tu nombre.")).toBeInTheDocument();
  expect(screen.getByText(/Revisá tu email/i)).toBeInTheDocument();
  expect(screen.getByText(/Contame un poquito más/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Nombre/)).toHaveFocus();
});

test("contact preserves the message when the endpoint is unavailable", async () => {
  const user = userEvent.setup();
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(new Response("", { status: 503 })),
  );
  render(
    <MemoryRouter>
      <Contact />
    </MemoryRouter>,
  );
  await user.type(screen.getByLabelText(/Nombre/), "Ana");
  await user.type(screen.getByLabelText(/Email/), "ana@example.com");
  await user.type(
    screen.getByLabelText(/Contame tu idea/i),
    "Necesito una consulta breve sobre un sistema.",
  );
  await user.click(screen.getByRole("button", { name: /enviar consulta/i }));
  expect(
    await screen.findByText(/No pude enviar el formulario/i),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/Contame tu idea/i)).toHaveValue(
    "Necesito una consulta breve sobre un sistema.",
  );
  vi.unstubAllGlobals();
});

test("contact endpoint rejects malformed requests without Telegram credentials", async () => {
  const request = new Request("https://example.test/api/contacto", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "A",
      email: "not-an-email",
      interest: "Otro",
      message: "corto",
    }),
  });
  const response = await onRequestPost({ request, env: {} });
  expect(response.status).toBe(400);
  expect((await response.json()).error).toBe("Escribí tu nombre.");
});
