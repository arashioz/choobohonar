import { getApiBase } from "@/lib/api-base";

export type PublicCmsEntry = {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  images?: string[];
  data?: Record<string, unknown>;
  tags?: string[];
  items?: unknown[];
};

export type PublicCmsPage<T = Record<string, unknown>> = Omit<PublicCmsEntry, "items"> & {
  items?: T;
};

/** Return CMS records with their migrated legacy fields flattened for pages. */
export async function fetchPublicCmsEntries(kind: string): Promise<PublicCmsEntry[]> {
  try {
    const response = await fetch(`${getApiBase()}/public-cms/${kind}`, { cache: "no-store" });
    if (!response.ok) return [];
    const items = await response.json() as PublicCmsEntry[];
    return Array.isArray(items) ? items.map((item) => ({ ...(item.data || {}), ...item, slug: item.slug, title: item.title })) : [];
  } catch {
    return [];
  }
}

/** Fetch one published page and expose its seeded payload under `items`. */
export async function fetchPublicCmsPage<T = Record<string, unknown>>(slug: string): Promise<PublicCmsPage<T> | null> {
  const entries = await fetchPublicCmsEntries("page");
  const page = entries.find((entry) => entry.slug === slug);
  return page ? page as PublicCmsPage<T> : null;
}
