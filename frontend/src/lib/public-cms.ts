import { getApiBase } from "@/lib/api-base";

export type PublicCmsEntry = {
  slug: string;
  title: string;
  excerpt?: string;
  description?: string;
  images?: string[];
  data?: Record<string, unknown>;
  tags?: string[];
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
