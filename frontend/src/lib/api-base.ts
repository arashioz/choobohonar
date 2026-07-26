/**
 * Browser must always call same-origin `/api`.
 * On the server (Docker), `localhost:3001` is the wrong host —
 * use `API_URL=http://backend:3001/api` instead.
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") return "/api";
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "/api"
  );
}
