import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getApiBase } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });
  }

  try {
    const upstream = await fetch(
      `${getApiBase()}/admin/files${request.nextUrl.search}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "ارتباط با سرویس فایل‌ها برقرار نشد" },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });
  }

  try {
    const body = await request.text();
    const upstream = await fetch(`${getApiBase()}/admin/files`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
      cache: "no-store",
    });

    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "خطا در برقراری ارتباط برای حذف فایل" },
      { status: 502 },
    );
  }
}
