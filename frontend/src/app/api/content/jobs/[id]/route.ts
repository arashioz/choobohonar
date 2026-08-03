import { NextResponse } from "next/server";
import { getJob, updateJobResult } from "@/lib/content-store";
import type { ContentJobResult } from "@/lib/content-types";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) return NextResponse.json({ message: "Job not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  if (!getJob(id)) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }
  const body = (await req.json()) as { result?: Partial<ContentJobResult> };
  if (!body.result) {
    return NextResponse.json({ message: "result is required" }, { status: 400 });
  }
  const updated = updateJobResult(id, body.result);
  return NextResponse.json(updated);
}
