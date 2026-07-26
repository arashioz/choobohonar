export const AUTH_COOKIE = "admin_session";
export const AUTH_MAX_AGE = 60 * 60 * 8; // 8h — matches backend JWT

/** Server-side API base (Docker: API_URL=http://backend:3001/api). */
export function getApiBase() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api"
  );
}
