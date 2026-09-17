/**
 * Browser must always call same-origin `/api`.
 * Server Components cannot fetch a relative `/api` URL (no origin), so local
 * `next dev` talks to the Nest process on localhost. In Docker, set
 * `API_URL=http://backend:3001/api` instead of relying on this fallback.
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") return "/api";
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:3001/api"
  );
}
