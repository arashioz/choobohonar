import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getApiBase } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });
  try {
    const upstream = await fetch(`${getApiBase()}/admin/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": request.headers.get("content-type") || "multipart/form-data" },
      body: await request.arrayBuffer(),
      cache: "no-store",
    });
    return new NextResponse(await upstream.arrayBuffer(), { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" } });
  } catch {
    return NextResponse.json({ message: "آپلود فایل انجام نشد" }, { status: 502 });
  }
}
