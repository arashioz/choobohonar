import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CAMPAIGN_UTM, utmChannels } from "@/data/channels";

const byPath = new Map(utmChannels.map((channel) => [channel.id, channel]));

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/kit") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const key = request.nextUrl.pathname.replace(/^\//, "").toLowerCase();
  const channel = byPath.get(key);
  if (!channel) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("utm_source", channel.source);
  url.searchParams.set("utm_medium", channel.medium);
  url.searchParams.set("utm_campaign", CAMPAIGN_UTM);
  url.searchParams.set("utm_content", channel.content);
  url.searchParams.set("ch", channel.id);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/kit", "/sms", "/telegram", "/instagram", "/linkedin", "/yektanet", "/aparat"],
};
