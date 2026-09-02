export type CmsKind = "product" | "material" | "project" | "collection" | "article" | "page";
export type CmsStatus = "draft" | "published" | "archived";

export type CmsEntry = {
  _id: string;
  kind: CmsKind;
  title: string;
  slug: string;
  status: CmsStatus;
  excerpt: string;
  description: string;
  content: string;
  images: string[];
  seo: { title?: string; description?: string; keywords?: string[] };
  data: Record<string, unknown>;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CmsEntryInput = Omit<Partial<CmsEntry>, "_id" | "kind" | "createdAt" | "updatedAt"> & {
  title: string;
};

export const resourceToKind = {
  products: "product",
  materials: "material",
  projects: "project",
  collections: "collection",
} as const;

export type ResourcePath = keyof typeof resourceToKind;

export async function cmsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/admin/api/cms/${path.replace(/^\//, "")}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      (data as { message?: string | string[] }).message;
    throw new Error(
      Array.isArray(message)
        ? message.join(" · ")
        : message || `خطا در ارتباط با سرور (${response.status})`,
    );
  }
  return data as T;
}

/** Normalize list responses so UI never gets a non-array `items`. */
export function cmsListItems(result: unknown): CmsEntry[] {
  if (Array.isArray(result)) return result as CmsEntry[];
  if (result && typeof result === "object" && Array.isArray((result as { items?: unknown }).items)) {
    return (result as { items: CmsEntry[] }).items;
  }
  return [];
}

export function formatMoney(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "بدون قیمت";
  return `${amount.toLocaleString("fa-IR")} تومان`;
}
