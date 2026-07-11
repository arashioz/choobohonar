import { NextResponse } from "next/server";
import { getJob, reviewJob } from "@/lib/content-store";
import type { ReviewInput } from "@/lib/api";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!getJob(params.id)) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }
  const body = (await req.json()) as ReviewInput;
  const updated = reviewJob(params.id, body);
  return NextResponse.json(updated);
}
