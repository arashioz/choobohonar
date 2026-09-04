import { mkdir, appendFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

type Payload = {
  name?: string;
  phone?: string;
  city?: string;
  tier?: string;
  joinClub?: boolean;
  page?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    channel?: string;
  };
};

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (name.length < 2 || phone.length < 7) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const lead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    phone,
    city: String(body.city || "").trim(),
    tier: body.tier || "guest",
    joinClub: Boolean(body.joinClub),
    page: body.page || "",
    utm: {
      source: body.utm?.source || "",
      medium: body.utm?.medium || "",
      campaign: body.utm?.campaign || "52years",
      content: body.utm?.content || "",
      term: body.utm?.term || "",
      channel: body.utm?.channel || "direct",
    },
  };

  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "leads.jsonl"), `${JSON.stringify(lead)}\n`, "utf8");

  const upstream = process.env.LEADS_API_URL;
  if (upstream) {
    try {
      await fetch(upstream, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consultation",
          source: `campaign-52:${lead.utm.channel}`,
          name: lead.name,
          phone: lead.phone,
          data: {
            campaign: "52years",
            city: lead.city,
            tier: lead.tier,
            joinClub: lead.joinClub,
            utm: lead.utm,
            page: lead.page,
          },
        }),
      });
    } catch {
      // Local persistence already succeeded; upstream is best-effort.
    }
  }

  return NextResponse.json({ ok: true, id: lead.id });
}
