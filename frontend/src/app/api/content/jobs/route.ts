import { NextRequest, NextResponse } from "next/server";
import { createJob, listJobs } from "@/lib/content-store";
import type { CreateJobInput } from "@/lib/api";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || undefined;
  return NextResponse.json(listJobs(status));
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateJobInput;
  if (!body.type || !body.language) {
    return NextResponse.json({ message: "type and language are required" }, { status: 400 });
  }
  return NextResponse.json(createJob(body), { status: 201 });
}
