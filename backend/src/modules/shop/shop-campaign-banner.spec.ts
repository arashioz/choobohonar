import { NotFoundException } from '@nestjs/common';
import {
  STOREFRONT_CAMPAIGN_SLOTS,
  campaignBannerUpdate,
  serializeCampaignBanner,
  type CampaignBannerFields,
} from './campaign-banner';

function apply(
  store: Map<string, CampaignBannerFields>,
  slug: string,
  input: CampaignBannerFields,
) {
  const next = {
    ...(store.get(slug) || {}),
    ...campaignBannerUpdate(slug, input),
  };
  store.set(slug, next);
  return serializeCampaignBanner(slug, next);
}

describe('category page cover and in-grid banner', () => {
  it('lists every product category with an independent cover and banner', () => {
    const rows = STOREFRONT_CAMPAIGN_SLOTS.map((slot) =>
      serializeCampaignBanner(slot.slug, null),
    );
    expect(rows.map((row) => row.slug)).toEqual(
      STOREFRONT_CAMPAIGN_SLOTS.map((slot) => slot.slug),
    );
    for (const row of rows) {
      expect(row.label).toBeTruthy();
      expect(row.image).toBeTruthy();
      expect(row.heroImage).toBe('');
      expect(row.cardImage).toBe('');
    }
  });

  it('keeps the page cover and the in-grid banner from overwriting each other', () => {
    const store = new Map<string, CampaignBannerFields>();
    const cover = apply(store, 'livingroom', {
      heroImage: '/uploads/living-cover.jpg',
      heroEyebrow: 'Living / 01',
      heroTitle: 'نشیمن سفارشی',
      heroText: 'کاور صفحه نشیمن',
    });
    expect(cover.heroImage).toBe('/uploads/living-cover.jpg');
    expect(cover.heroTitle).toBe('نشیمن سفارشی');
    expect(cover.image).toBe(
      STOREFRONT_CAMPAIGN_SLOTS.find((slot) => slot.slug === 'livingroom')?.image,
    );

    const banner = apply(store, 'livingroom', {
      image: '/uploads/living-banner.jpg',
      title: 'بنر داخل فهرست',
      subtitle: 'بین کارت‌های محصول',
    });
    expect(banner.image).toBe('/uploads/living-banner.jpg');
    expect(banner.title).toBe('بنر داخل فهرست');
    expect(banner.subtitle).toBe('بین کارت‌های محصول');
    expect(banner.heroImage).toBe('/uploads/living-cover.jpg');
    expect(banner.heroTitle).toBe('نشیمن سفارشی');
    expect(banner.heroText).toBe('کاور صفحه نشیمن');

    const card = apply(store, 'livingroom', {
      cardImage: '/uploads/living-card.jpg',
    });
    expect(card.cardImage).toBe('/uploads/living-card.jpg');
    expect(card.heroImage).toBe('/uploads/living-cover.jpg');
    expect(card.image).toBe('/uploads/living-banner.jpg');
  });

  it('lets every category store its own cover and banner', () => {
    const store = new Map<string, CampaignBannerFields>();
    for (const slot of STOREFRONT_CAMPAIGN_SLOTS) {
      const saved = apply(store, slot.slug, {
        heroImage: `/uploads/${slot.slug}-cover.jpg`,
        image: `/uploads/${slot.slug}-banner.jpg`,
        title: `بنر ${slot.label}`,
      });
      expect(saved.slug).toBe(slot.slug);
      expect(saved.heroImage).toBe(`/uploads/${slot.slug}-cover.jpg`);
      expect(saved.image).toBe(`/uploads/${slot.slug}-banner.jpg`);
      expect(saved.title).toBe(`بنر ${slot.label}`);
    }

    const listed = STOREFRONT_CAMPAIGN_SLOTS.map((slot) =>
      serializeCampaignBanner(slot.slug, store.get(slot.slug)),
    );
    expect(listed).toHaveLength(STOREFRONT_CAMPAIGN_SLOTS.length);
    expect(new Set(listed.map((row) => row.heroImage)).size).toBe(
      STOREFRONT_CAMPAIGN_SLOTS.length,
    );
  });

  it('clears a custom cover without removing the in-grid banner', () => {
    const store = new Map<string, CampaignBannerFields>();
    apply(store, 'carpet', {
      heroImage: '/uploads/carpet-cover.jpg',
      image: '/uploads/carpet-banner.jpg',
      title: 'بنر فرش',
    });
    const cleared = apply(store, 'carpet', { heroImage: '' });
    expect(cleared.heroImage).toBe('');
    expect(cleared.image).toBe('/uploads/carpet-banner.jpg');
    expect(cleared.title).toBe('بنر فرش');
  });

  it('rejects a category that is not on the storefront', () => {
    expect(() => campaignBannerUpdate('unknown-room', { heroImage: '/x.jpg' })).toThrow(
      NotFoundException,
    );
  });
});
