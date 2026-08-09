import { getApiBase } from "@/lib/api-base";

export type LeadType =
  | "contact"
  | "consultation"
  | "cooperation"
  | "representation";

export type SubmitLeadInput = {
  type: LeadType;
  source?: string;
  name: string;
  phone: string;
  email?: string;
  data: Record<string, unknown>;
};

export type SubmitInteriorBriefInput = {
  styles: string[];
  moodboardRound1?: string;
  moodboardRound2?: string;
  location: string;
  area: string;
  spaceType: string;
  roomCount?: string;
  budget?: string;
  timeline?: string;
  consultation: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
};

type OkResponse = { id: string; ok: true };

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function submitLead(input: SubmitLeadInput) {
  return postJson<OkResponse>("/lead", input);
}

export function submitInteriorBrief(input: SubmitInteriorBriefInput) {
  return postJson<OkResponse>("/interior-brief", input);
}
