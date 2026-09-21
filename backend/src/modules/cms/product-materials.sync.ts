import { readFileSync } from 'fs';
import { join } from 'path';
import type { Model } from 'mongoose';
import type { CmsEntry, CmsEntryDocument } from './schemas/cms-entry.schema';

type WoodAsset = {
  code: string;
  slug?: string;
  names: string[];
  hex: string;
  file: string;
};

type ProductLike = {
  attributes?: { name?: string; values?: string[] }[];
};

const FALLBACK_HEX: Record<string, string> = {
  'مشکی موج نما براق': '#1A1A1A',
  'گردویی تولیپ': '#4A2C22',
  خودرنگ: '#C8A77A',
  'گردویی تیره': '#3D241C',
  طلایی: '#C4A35A',
  'سندبلاست طوسی': '#8A8580',
  مشکی: '#1C1C1C',
};

const FALLBACK_SLUGS: Record<string, string> = {
  'مشکی موج نما براق': 'glossy-black-grain',
  'گردویی تولیپ': 'tulip-walnut',
  خودرنگ: 'self-color',
  'گردویی تیره': 'dark-walnut',
  طلایی: 'gold',
  'سندبلاست طوسی': 'sandblast-gray',
  مشکی: 'black',
};

export function normalizeMaterialName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[آأإ]/g, 'ا')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\s‌ـ\-_/]+/g, '');
}

export function isProductWoodAttribute(name: string) {
  return (
    /چوب|wood|پرداخت|فینیش/i.test(name) &&
    !/سر\s*تخت|هدبورد|headboard|پایه/i.test(name)
  );
}

export function materialSlugFromTitle(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || `wood-${Date.now()}`
  );
}

function loadWoodAssets(): WoodAsset[] {
  const filePath = join(
    process.cwd(),
    'src/modules/cms/data/product-wood-assets.json',
  );
  return JSON.parse(readFileSync(filePath, 'utf8')) as WoodAsset[];
}

function matchAsset(title: string, assets: WoodAsset[]) {
  const normalized = normalizeMaterialName(title);
  return assets.find((asset) =>
    asset.names.some((name) => normalizeMaterialName(name) === normalized),
  );
}

export function collectProductWoodNames(products: ProductLike[]) {
  const names = new Set<string>();
  for (const product of products) {
    for (const attribute of product.attributes || []) {
      if (!isProductWoodAttribute(String(attribute.name || ''))) continue;
      for (const value of attribute.values || []) {
        const name = String(value || '').trim();
        if (name) names.add(name);
      }
    }
  }
  return [...names].sort((a, b) => a.localeCompare(b, 'fa'));
}

export async function syncProductWoodMaterials(
  entryModel: Model<CmsEntryDocument>,
  products: ProductLike[],
) {
  const assets = loadWoodAssets();
  const titles = collectProductWoodNames(products);
  const existing = await entryModel
    .find({ kind: 'material' })
    .lean()
    .exec();

  const findExisting = (title: string, slug: string) => {
    const normalized = normalizeMaterialName(title);
    return existing.find((entry) => {
      const data =
        entry.data && typeof entry.data === 'object'
          ? (entry.data as Record<string, unknown>)
          : {};
      const aliases = Array.isArray(data.aliases)
        ? data.aliases.map((item) => String(item))
        : [];
      return (
        entry.slug === slug ||
        normalizeMaterialName(entry.title) === normalized ||
        aliases.some((alias) => normalizeMaterialName(alias) === normalized)
      );
    });
  };

  const keepIds: string[] = [];
  for (const title of titles) {
    const asset = matchAsset(title, assets);
    const slug =
      asset?.slug ||
      asset?.code.toLowerCase() ||
      FALLBACK_SLUGS[title] ||
      materialSlugFromTitle(title);
    const current = findExisting(title, slug);
    const image = asset ? `/images/materials/${asset.code.toLowerCase()}.jpg` : '';
    const hex = asset?.hex || FALLBACK_HEX[title] || '#8B6B52';
    const aliases = [...new Set([title, ...(asset?.names || [])])];
    const nextData = {
      ...(current?.data && typeof current.data === 'object' ? current.data : {}),
      code: asset?.code || String((current?.data as { code?: string } | undefined)?.code || ''),
      family: 'wood',
      categoryId: 'wood',
      materialType: 'چوب',
      materialTypes: ['چوب', 'پرداخت'],
      color: title,
      colors: [title],
      colorHex: hex,
      hex,
      image,
      applicationImage: image,
      aliases,
      sample: true,
      source: 'product-wood',
      eyebrow: asset?.code ? `چوب / ${asset.code}` : 'پرداخت چوب',
    };

    if (current) {
      keepIds.push(String(current._id));
      const previousSlugs = Array.isArray((current.data as { previousSlugs?: string[] } | undefined)?.previousSlugs)
        ? [...(current.data as { previousSlugs: string[] }).previousSlugs]
        : [];
      if (current.slug && current.slug !== slug && !previousSlugs.includes(current.slug)) {
        previousSlugs.push(current.slug);
      }
      await entryModel.updateOne(
        { _id: current._id },
        {
          $set: {
            slug,
            status: 'published',
            title: current.title || title,
            'data.previousSlugs': previousSlugs,
            excerpt: current.excerpt || `پرداخت چوب ${title}`,
            'data.code': nextData.code,
            'data.family': 'wood',
            'data.categoryId': 'wood',
            'data.materialType': 'چوب',
            'data.materialTypes': ['چوب', 'پرداخت'],
            'data.color': title,
            'data.colorHex': hex,
            'data.hex': hex,
            'data.image': image || (current.data as { image?: string } | undefined)?.image || '',
            'data.applicationImage':
              image || (current.data as { applicationImage?: string } | undefined)?.applicationImage || '',
            'data.aliases': aliases,
            'data.sample': true,
            'data.source': 'product-wood',
            'data.eyebrow': nextData.eyebrow,
            ...(image ? { images: [image] } : {}),
          },
        },
      );
    } else {
      const created = await entryModel.create({
        kind: 'material',
        title,
        slug,
        status: 'published',
        excerpt: `پرداخت چوب ${title}`,
        description: `پرداخت ${title} از متریال‌های استفاده‌شده روی محصولات خانه چوب و هنر.`,
        images: image ? [image] : [],
        data: nextData,
        tags: ['wood', 'چوب'],
        publishedAt: new Date(),
      } as Partial<CmsEntry>);
      keepIds.push(String(created._id));
      existing.push(created.toObject() as typeof existing[number]);
    }
  }

  if (keepIds.length) {
    await entryModel.updateMany(
      { kind: 'material', _id: { $nin: keepIds } },
      { $set: { status: 'archived' } },
    );
  }

  return { titles, count: titles.length };
}
