import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, getApiBase } from "@/lib/auth";

export const dynamic = "force-dynamic";

function resource(request: NextRequest) {
  return request.nextUrl.searchParams.get("kind") === "interior" ? "interior-brief" : "lead";
}

async function proxy(request: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE)?.value;
  if (!token) return NextResponse.json({ message: "نشست شما منقضی شده است" }, { status: 401 });

  const params = new URLSearchParams(request.nextUrl.search);
  params.delete("kind");
  const query = params.toString();
  try {
    const upstream = await fetch(`${getApiBase()}/${resource(request)}${query ? `?${query}` : ""}`, {
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
