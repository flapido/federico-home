export const onRequest = () => new Response("Acceso restringido.", { status: 403, headers: { "Cache-Control": "no-store" } });
