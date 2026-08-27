import { onRequestPost } from "../../functions/api/guestbook";

test("a guestbook greeting is stored pending and remains visible to admin even without publication consent", async () => {
  const calls: unknown[][] = [];
  const db = { prepare: () => ({ bind: (...values: unknown[]) => ({ run: async () => { calls.push(values); }, all: async <T>() => ({ results: [] as T[] }) }) }) };
  const request = new Request("https://example.test/api/guestbook", { method: "POST", headers: { "content-type": "application/json", "CF-Connecting-IP": "guestbook-visible-test" }, body: JSON.stringify({ type: "guestbook", name: "QA", message: "Un saludo válido.", publication_consent: false, website: "" }) });
  const response = await onRequestPost({ request, env: { ANALYTICS_DB: db } });
  expect(response.status).toBe(200);
  expect(calls[0]).toEqual(expect.arrayContaining(["guestbook", "QA", "Un saludo válido.", 0, "pending", "clean"]));
});
