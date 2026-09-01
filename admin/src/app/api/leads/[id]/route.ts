import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getApiBase } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function proxy(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });

  const { id } = await context.params;
  const kind = request.nextUrl.searchParams.get("kind") === "interior" ? "interior-brief" : "lead";
  try {
    const upstream = await fetch(`${getApiBase()}/${kind}/${encodeURIComponent(id)}`, {
      method: request.method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: request.method === "GET" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
    });
    return new NextResponse(await upstream.arrayBuffer(), {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "ارتباط با سرویس درخواست‌ها برقرار نشد" }, { status: 502 });
  }
}

export const GET = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
