import { NotFoundException } from '@nestjs/common';

export const STOREFRONT_CAMPAIGN_SLOTS = [
  {
    slug: 'livingroom',
    label: 'نشیمن',
    title: 'نشیمن',
    subtitle: 'کاناپه، مبل تک‌نفره و میزهایی برای مکث و گفتگو در مرکز خانه.',
    image:
      'https://choobohonar.com/wp-content/uploads/2026/01/مبل-چدار-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'bedroom',
    label: 'اتاق خواب',
    title: 'اتاق خواب',
    subtitle: 'تخت، پاتختی و دراور با بافت چوب؛ فضا برای استراحت و خلوت.',
    image:
      'https://choobohonar.com/wp-content/uploads/2023/07/تخت-خواب-آکومه-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'diningroom',
    label: 'غذاخوری',
    title: 'غذاخوری',
    subtitle: 'میز و صندلی برای دورهمی؛ تناسب مقیاس با فضا و نور.',
    image:
      'https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'bedding',
    label: 'کالای خواب',
    title: 'کالای خواب',
    subtitle: 'روتختی، ملحفه و لایه‌های نرم برای پایان روز.',
    image:
      'https://choobohonar.com/wp-content/uploads/2026/02/سرویس-روتختی-گلدن-رودز-53-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'carpet',
    label: 'فرش و گلیم',
    title: 'فرش و گلیم',
    subtitle: 'سطح فضا را کامل می‌کند؛ رنگ و بافت زیر پای نشیمن و غذاخوری.',
    image: 'https://choobohonar.com/wp-content/uploads/2025/07/فرش-زاب-کرم-1.jpg',
  },
  {
    slug: 'lighting',
    label: 'روشنایی',
    title: 'روشنایی',
    subtitle: 'آباژور، آویز و لوستر؛ نور، بافت چوب و پارچه را زنده می‌کند.',
    image: 'https://choobohonar.com/wp-content/uploads/2026/07/آباژور-گالن-1.jpg',
  },
  {
    slug: 'decor',
    label: 'دکور',
    title: 'دکور',
    subtitle: 'آینه، گلدان و جزئیاتی که فضا را شخصی می‌کند.',
    image:
      'https://choobohonar.com/wp-content/uploads/2023/05/دراور-آلدر-خانه-چوب-و-هنر-2.jpg',
  },
] as const;

export type CampaignBannerFields = {
  title?: string;
  subtitle?: string;
  image?: string;
  cardImage?: string;
  heroImage?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  heroText?: string;
};

const PATCH_KEYS = [
  'title',
  'subtitle',
  'image',
  'cardImage',
  'heroImage',
  'heroEyebrow',
  'heroTitle',
  'heroText',
] as const;

export function campaignBannerSlot(slug: string) {
  const slot = STOREFRONT_CAMPAIGN_SLOTS.find((entry) => entry.slug === slug);
  if (!slot) throw new NotFoundException('دسته‌بندی پیدا نشد');
  return slot;
}

export function serializeCampaignBanner(
  slug: string,
  item?: CampaignBannerFields | null,
) {
  const slot = campaignBannerSlot(slug);
  return {
    slug: slot.slug,
    label: slot.label,
    title: item?.title?.trim() || slot.title,
    subtitle: item?.subtitle?.trim() || slot.subtitle,
    image: item?.image?.trim() || slot.image,
    cardImage: item?.cardImage?.trim() || '',
    heroImage: item?.heroImage?.trim() || '',
    heroEyebrow: item?.heroEyebrow?.trim() || '',
    heroTitle: item?.heroTitle?.trim() || '',
    heroText: item?.heroText?.trim() || '',
  };
}

/** Only keys present in the admin request are written, so a cover save cannot wipe the in-grid banner. */
export function campaignBannerUpdate(slug: string, input: CampaignBannerFields) {
  const slot = campaignBannerSlot(slug);
  const next: Record<string, string> = { label: slot.label };
  for (const key of PATCH_KEYS) {
    if (input[key] !== undefined) next[key] = String(input[key] || '').trim();
  }
  return next;
}
