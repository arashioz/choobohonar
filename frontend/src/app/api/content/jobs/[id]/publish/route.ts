import { NextResponse } from "next/server";
import { getJob, publishJob } from "@/lib/content-store";

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  const existing = getJob(params.id);
  if (!existing) {
    return NextResponse.json({ message: "Job not found" }, { status: 404 });
  }
  if (existing.status !== "approved") {
    return NextResponse.json({ message: "Job must be approved before publishing" }, { status: 400 });
  }
  const updated = publishJob(params.id);
  return NextResponse.json(updated);
}
