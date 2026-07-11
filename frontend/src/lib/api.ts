import type { ContentJobResult } from "@/lib/content-types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  jobs: {
    list: (status?: string) =>
      apiFetch<ContentJob[]>(`/content/jobs${status ? `?status=${status}` : ""}`),
    get: (id: string) => apiFetch<ContentJob>(`/content/jobs/${id}`),
    create: (data: CreateJobInput) =>
      apiFetch<ContentJob>("/content/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, result: Partial<ContentJobResult>) =>
      apiFetch<ContentJob>(`/content/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ result }),
      }),
    review: (id: string, data: ReviewInput) =>
      apiFetch<ContentJob>(`/content/jobs/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    publish: (id: string) =>
      apiFetch<ContentJob>(`/content/jobs/${id}/publish`, { method: "PATCH" }),
  },
  stats: () => apiFetch<QueueStats>("/content/stats"),
};

export interface ContentJob {
  _id: string;
  type: "blog" | "product";
  language: "fa" | "en";
  priority: "high" | "normal" | "low";
  input: {
    topic?: string;
    targetKeywords?: string[];
    productName?: string;
    materials?: string[];
    features?: string[];
  };
  status:
    | "pending"
    | "processing"
    | "image_generation"
    | "awaiting_review"
    | "approved"
    | "rejected"
    | "published";
  currentStep: string;
  progress: number;
  result: ContentJobResult;
  llmProvider: string;
  imageProvider: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  publishedAt?: string;
}

export interface QueueStats {
  pending: number;
  processing: number;
  awaitingReview: number;
  completedToday: number;
}

export interface CreateJobInput {
  type: "blog" | "product";
  language: "fa" | "en";
  priority?: "high" | "normal" | "low";
  topic?: string;
  targetKeywords?: string[];
  productName?: string;
  materials?: string[];
  features?: string[];
}

export interface ReviewInput {
  action: "approved" | "rejected" | "edited";
  reason?: string;
  changes?: Partial<ContentJobResult>;
}

export type { ContentJobResult, ContentBlock, InternalLink, GalleryImage } from "@/lib/content-types";
