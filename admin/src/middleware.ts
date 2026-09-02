import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const PUBLIC_PATHS = ["/admin/login", "/admin/brandbook/print"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (
    pathname === "/admin/login" &&
    (request.nextUrl.searchParams.has("username") || request.nextUrl.searchParams.has("password"))
  ) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("username");
    url.searchParams.delete("password");
    return NextResponse.redirect(url);
  }

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAuthApi = pathname.startsWith("/admin/api/auth/");

  if (isAuthApi) {
    return NextResponse.next();
  }

  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname === "/brandbook" ||
    pathname.startsWith("/brandbook/");

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = token ? "/admin" : "/admin/login";
    return NextResponse.redirect(url);
  }

  if (!token && needsAuth && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname === "/brandbook" ? "/admin/brandbook" : pathname);
    return NextResponse.redirect(url);
  }

  if (token && pathname === "/admin/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  if (pathname === "/brandbook" || pathname.startsWith("/brandbook/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/brandbook/, "/admin/brandbook") || "/admin/brandbook";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|file.svg|window.svg|vercel.svg).*)",
  ],
};
