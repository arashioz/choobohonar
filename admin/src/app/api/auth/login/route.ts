import { NextResponse } from "next/server";
import { AUTH_COOKIE, AUTH_MAX_AGE, getApiBase } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { username?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "درخواست نامعتبر است" }, { status: 400 });
  }

  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";

  if (!username || !password) {
    return NextResponse.json(
      { message: "نام کاربری و رمز عبور الزامی است" },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBase()}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "ارتباط با سرور برقرار نشد" },
      { status: 502 },
    );
  }

  const data = (await upstream.json().catch(() => ({}))) as {
    token?: string;
    message?: string;
  };

  if (!upstream.ok || !data.token) {
    return NextResponse.json(
      { message: data.message === "Invalid credentials" ? "نام کاربری یا رمز عبور اشتباه است" : data.message || "ورود ناموفق بود" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_MAX_AGE,
  });

  return response;
}
