import { hasAdminSession, restricted, type AdminEnv } from "../_lib/admin-auth";

type Context = { request: Request; env: AdminEnv; next: () => Promise<Response> };

export const onRequest = async (context: Context) => {
  const path = new URL(context.request.url).pathname;
  // /admin is deliberately the public, data-free login surface. Nested admin
  // routes only serve an authenticated dashboard bundle.
  if (path === "/admin") return context.next();
  if (!(await hasAdminSession(context.request, context.env))) return restricted();
  return context.next();
};
