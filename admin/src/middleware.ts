import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAuthApi = pathname.startsWith("/api/auth/");

  if (isAuthApi) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = token ? "/admin" : "/login";
    return NextResponse.redirect(url);
  }

  if (!token && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (token && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|file.svg|window.svg|vercel.svg).*)",
  ],
};
