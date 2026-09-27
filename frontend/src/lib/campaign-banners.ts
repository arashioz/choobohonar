import { getApiBase } from "@/lib/api-base";

export type CampaignBanner = {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
  cardImage?: string;
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroText?: string;
};

export async function fetchCampaignBanners(): Promise<CampaignBanner[]> {
  try {
    const res = await fetch(`${getApiBase()}/shop/campaign-banners`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const banners = (await res.json()) as CampaignBanner[];
    return Array.isArray(banners) ? banners : [];
  } catch {
    return [];
  }
}

export async function fetchCampaignBanner(slug: string): Promise<CampaignBanner | null> {
  try {
    const res = await fetch(`${getApiBase()}/shop/campaign-banners/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const banner = (await res.json()) as CampaignBanner;
    const hasContent = Boolean(
      banner?.title ||
        banner?.subtitle ||
        banner?.image ||
        banner?.heroImage ||
        banner?.heroTitle ||
        banner?.heroText ||
        banner?.cardImage,
    );
    if (!hasContent) return null;
    return banner;
  } catch {
    return null;
  }
}
