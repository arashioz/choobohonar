import { getApiBase } from "@/lib/api-base";

export type CampaignBanner = {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  image: string;
};

export async function fetchCampaignBanner(slug: string): Promise<CampaignBanner | null> {
  try {
    const res = await fetch(`${getApiBase()}/shop/campaign-banners/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const banner = (await res.json()) as CampaignBanner;
    if (!banner?.title && !banner?.subtitle && !banner?.image) return null;
    return banner;
  } catch {
    return null;
  }
}
