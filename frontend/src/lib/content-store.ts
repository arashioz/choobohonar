import type { ContentJob, CreateJobInput, QueueStats, ReviewInput } from "@/lib/api";
import seedData from "@/data/content-seed.json";

type StoreGlobal = { __contentJobs?: ContentJob[]; __seedVersion?: number };
const SEED_VERSION = 2;

function getJobs(): ContentJob[] {
  const g = globalThis as StoreGlobal;
  if (!g.__contentJobs || g.__seedVersion !== SEED_VERSION) {
    const now = new Date().toISOString();
    g.__contentJobs = (seedData as Omit<ContentJob, "createdAt" | "updatedAt">[]).map((job) => ({
      ...job,
      createdAt: now,
      updatedAt: now,
    })) as ContentJob[];
    g.__seedVersion = SEED_VERSION;
  }
  return g.__contentJobs;
}

function newId(): string {
  return `674a${Date.now().toString(16).slice(-8)}${Math.random().toString(16).slice(2, 10)}`;
}

function mockResult(input: CreateJobInput): ContentJob["result"] {
  if (input.type === "blog") {
    const topic = input.topic || "New blog topic";
    return {
      title: `${topic} | Choob va Honar`,
      slug: topic.toLowerCase().replace(/\s+/g, "-").slice(0, 60),
      excerpt: `Guide about ${topic}`,
      category: "",
      author: "Team",
      body: `Sample content for "${topic}".`,
      content: [{ type: "paragraph", text: `Sample content for "${topic}".` }],
      metaTitle: `${topic} | Choob va Honar`,
      metaDescription: `Guide about ${topic}`,
      keywords: input.targetKeywords || [],
      tags: input.targetKeywords || [],
      internalLinks: [],
      gallery: [],
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(topic.slice(0, 12))}/1200/630`,
      coverImage: `https://picsum.photos/seed/${encodeURIComponent(topic.slice(0, 12))}/1200/630`,
      marketingCopy: `Fresh content about ${topic}.`,
    };
  }
  const name = input.productName || "Product";
  return {
    title: `${name} | Choob va Honar`,
    body: `Product intro: ${name}.`,
    metaTitle: `${name} | Choob va Honar`,
    metaDescription: `${name} — handcrafted furniture`,
    keywords: input.materials || [],
    imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name.slice(0, 12))}/1200/630`,
    marketingCopy: `${name} — natural materials.`,
  };
}

export function listJobs(status?: string): ContentJob[] {
  const jobs = getJobs();
  const filtered = status ? jobs.filter((j) => j.status === status) : jobs;
  return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getJob(id: string): ContentJob | undefined {
  return getJobs().find((j) => j._id === id);
}

export function createJob(input: CreateJobInput): ContentJob {
  const ts = new Date().toISOString();
  const job: ContentJob = {
    _id: newId(),
    type: input.type,
    language: input.language,
    priority: input.priority || "normal",
    input: input.type === "blog"
      ? { topic: input.topic, targetKeywords: input.targetKeywords || [] }
      : { productName: input.productName, materials: input.materials || [], features: input.features || [] },
    status: "awaiting_review",
    currentStep: "Ready for review",
    progress: 100,
    result: mockResult(input),
    llmProvider: "mock",
    imageProvider: "mock",
    createdAt: ts,
    updatedAt: ts,
  };
  getJobs().unshift(job);
  return job;
}

export function updateJobResult(id: string, partial: Partial<ContentJob["result"]>): ContentJob | undefined {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j._id === id);
  if (idx === -1) return undefined;
  const job = jobs[idx];
  const ts = new Date().toISOString();
  const updated: ContentJob = { ...job, result: { ...job.result, ...partial }, updatedAt: ts };
  jobs[idx] = updated;
  return updated;
}

export function reviewJob(id: string, input: ReviewInput): ContentJob | undefined {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j._id === id);
  if (idx === -1) return undefined;
  const job = jobs[idx];
  const ts = new Date().toISOString();
  let result = { ...job.result };
  if (input.action === "edited" && input.changes) result = { ...result, ...input.changes };
  const status = input.action === "rejected" ? "rejected" : "approved";
  const updated: ContentJob = { ...job, status, result, adminNote: input.reason, reviewedAt: ts, updatedAt: ts };
  jobs[idx] = updated;
  return updated;
}

export function publishJob(id: string): ContentJob | undefined {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j._id === id);
  if (idx === -1) return undefined;
  const job = jobs[idx];
  if (job.status !== "approved") return undefined;
  const ts = new Date().toISOString();
  const updated: ContentJob = { ...job, status: "published", publishedAt: ts, updatedAt: ts };
  jobs[idx] = updated;
  return updated;
}

export function getStats(): QueueStats {
  const jobs = getJobs();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return {
    pending: jobs.filter((j) => j.status === "pending").length,
    processing: jobs.filter((j) => j.status === "processing" || j.status === "image_generation").length,
    awaitingReview: jobs.filter((j) => j.status === "awaiting_review").length,
    completedToday: jobs.filter((j) => j.status === "published" && j.publishedAt && new Date(j.publishedAt) >= todayStart).length,
  };
}
