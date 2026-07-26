export const AUTH_COOKIE = "admin_session";
export const AUTH_MAX_AGE = 60 * 60 * 8; // 8h — matches backend JWT

export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
}
