import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getApiBase } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json({ message: "فایل ارسال نشد" }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${getApiBase()}/admin/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
      },
      // Stream the multipart body instead of buffering it in Next (10MB default).
      body: request.body,
      duplex: "half",
      cache: "no-store",
    } as RequestInit);
    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json({ message: "آپلود فایل انجام نشد" }, { status: 502 });
  }
}
