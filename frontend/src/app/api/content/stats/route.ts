import { NextResponse } from "next/server";
import { getStats } from "@/lib/content-store";

export async function GET() {
  return NextResponse.json(getStats());
}
