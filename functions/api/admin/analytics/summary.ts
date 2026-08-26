export const onRequest = () => Response.json({ error: "Acceso restringido." }, { status: 403, headers: { "Cache-Control": "no-store" } });
