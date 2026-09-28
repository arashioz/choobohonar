import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
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

export function normalizeMaterialName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[آأإ]/g, 'ا')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\s‌ـ\-_/]+/g, '');
}

export const MATERIAL_PLACEHOLDER_URL = '/uploads/material-placeholder.png';

/** A material photo the admin uploaded. Catalog files under /uploads/products are not. */
export function isAdminMaterialImage(value: string) {
  const url = value.trim();
  return url.startsWith('/uploads/') && !url.startsWith('/uploads/products/');
}

const STATIC_WOOD_SWATCH =
  /^\/images\/materials\/wood\/(?:wa|pw|pl|pd|pg|sb|sm|al|be|gr)\.jpg$/;

/** Bundled wood photos live in the storefront so Next can optimize them. */
export function isStaticWoodSwatch(value: string) {
  return STATIC_WOOD_SWATCH.test(value.trim());
}

export function staticWoodSwatchPath(slug: string) {
  const safe = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  const path = `/images/materials/wood/${safe}.jpg`;
  return isStaticWoodSwatch(path) ? path : '';
}

export function materialImageOrPlaceholder(value: string) {
  const url = value.trim();
  if (isStaticWoodSwatch(url) || isAdminMaterialImage(url)) return url;
  return MATERIAL_PLACEHOLDER_URL;
}

/** Keep an admin upload. Placeholder and the old /uploads/materials copies point at the static file. */
export function materialSwatchImage(slug: string, stored: string) {
  const url = stored.trim();
  if (
    !url ||
    url === MATERIAL_PLACEHOLDER_URL ||
    /^\/uploads\/materials\/[a-z0-9-]+\.jpg$/i.test(url)
  ) {
    return staticWoodSwatchPath(slug) || MATERIAL_PLACEHOLDER_URL;
  }
  return materialImageOrPlaceholder(url);
}

/** Copy the committed swatch into the uploads volume so nginx and the admin can serve it. */
export function ensureMaterialPlaceholder() {
  const destDir = join(process.cwd(), 'uploads');
  const dest = join(destDir, 'material-placeholder.png');
  const source = join(
    process.cwd(),
    'src/modules/cms/data/material-placeholder.png',
  );
  mkdirSync(destDir, { recursive: true });
  if (!existsSync(dest)) copyFileSync(source, dest);
  return MATERIAL_PLACEHOLDER_URL;
}

export function isProductWoodAttribute(name: string) {
  return (
    /چوب|wood|پرداخت|فینیش/i.test(name) &&
    !/سر\s*تخت|هدبورد|headboard|پایه/i.test(name)
  );
}

function loadWoodAssets(): WoodAsset[] {
  const filePath = join(
    process.cwd(),
    'src/modules/cms/data/product-wood-assets.json',
  );
  return JSON.parse(readFileSync(filePath, 'utf8')) as WoodAsset[];
}

const MATERIAL_REMOVALS_SLUG = 'material-removals';

type MaterialRemovalList = { slugs: string[]; names: string[] };

function removalKeys(entry: {
  slug?: string;
  title?: string;
  data?: unknown;
}): MaterialRemovalList {
  const data =
    entry.data && typeof entry.data === 'object'
      ? (entry.data as Record<string, unknown>)
      : {};
  const previousSlugs = Array.isArray(data.previousSlugs)
    ? data.previousSlugs.map((item) => String(item))
    : [];
  const aliases = Array.isArray(data.aliases)
    ? data.aliases.map((item) => String(item))
    : [];
  return {
    slugs: [...new Set([entry.slug || '', ...previousSlugs].map((item) => item.trim()).filter(Boolean))],
    names: [...new Set([entry.title || '', ...aliases].map((item) => normalizeMaterialName(item)).filter(Boolean))],
  };
}

export async function loadMaterialRemovals(
  entryModel: Model<CmsEntryDocument>,
): Promise<MaterialRemovalList> {
  const page = await entryModel
    .findOne({ kind: 'page', slug: MATERIAL_REMOVALS_SLUG })
    .select({ data: 1 })
    .lean()
    .exec();
  const data =
    page?.data && typeof page.data === 'object'
      ? (page.data as Record<string, unknown>)
      : {};
  const slugs = Array.isArray(data.slugs)
    ? data.slugs.map((item) => String(item).trim()).filter(Boolean)
    : [];
  const names = Array.isArray(data.names)
    ? data.names.map((item) => normalizeMaterialName(String(item))).filter(Boolean)
    : [];
  return {
    slugs: [...new Set(slugs)],
    names: [...new Set(names)],
  };
}

export function isRemovedMaterial(
  removed: MaterialRemovalList,
  title: string,
  slug: string,
) {
  return (
    removed.slugs.includes(slug) ||
    removed.names.includes(normalizeMaterialName(title))
  );
}

/** Remember an admin delete so catalog sync and sample seed cannot recreate it. */
export async function rememberRemovedMaterial(
  entryModel: Model<CmsEntryDocument>,
  entry: { slug?: string; title?: string; data?: unknown },
) {
  const keys = removalKeys(entry);
  if (!keys.slugs.length && !keys.names.length) return;
  const current = await loadMaterialRemovals(entryModel);
  await entryModel.updateOne(
    { kind: 'page', slug: MATERIAL_REMOVALS_SLUG },
    {
      $set: {
        kind: 'page',
        title: 'حذف‌های متریال',
        slug: MATERIAL_REMOVALS_SLUG,
        status: 'draft',
        data: {
          slugs: [...new Set([...current.slugs, ...keys.slugs])],
          names: [...new Set([...current.names, ...keys.names])],
        },
      },
    },
    { upsert: true },
  );
}

async function deleteRemovedMaterials(
  entryModel: Model<CmsEntryDocument>,
  removed: MaterialRemovalList,
) {
  if (!removed.slugs.length && !removed.names.length) return;
  const rows = await entryModel
    .find({ kind: 'material' })
    .select({ slug: 1, title: 1, data: 1 })
    .lean()
    .exec();
  const ids = rows
    .filter((row) => {
      const data =
        row.data && typeof row.data === 'object'
          ? (row.data as Record<string, unknown>)
          : {};
      const aliases = Array.isArray(data.aliases)
        ? data.aliases.map((item) => String(item))
        : [];
      return (
        removed.slugs.includes(row.slug) ||
        removed.names.includes(normalizeMaterialName(row.title)) ||
        aliases.some((alias) => removed.names.includes(normalizeMaterialName(alias)))
      );
    })
    .map((row) => row._id);
  if (ids.length) await entryModel.deleteMany({ _id: { $in: ids } });
}

function sampleMaterialSlugs() {
  const filePath = join(process.cwd(), 'src/modules/cms/data/material-samples.json');
  const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<{ slug?: string }>;
  return rows.map((row) => String(row.slug || '').trim()).filter(Boolean);
}

/** Drop archived demo samples that are not real product finishes, and keep them from returning. */
export async function retireArchivedSampleMaterials(
  entryModel: Model<CmsEntryDocument>,
) {
  const slugs = sampleMaterialSlugs();
  if (!slugs.length) return;
  const rows = await entryModel
    .find({ kind: 'material', slug: { $in: slugs }, status: 'archived' })
    .lean()
    .exec();
  for (const row of rows) {
    const data =
      row.data && typeof row.data === 'object'
        ? (row.data as Record<string, unknown>)
        : {};
    if (data.source === 'product-wood') continue;
    await rememberRemovedMaterial(entryModel, row);
    await entryModel.deleteOne({ _id: row._id });
  }
}

export async function syncProductWoodMaterials(
  entryModel: Model<CmsEntryDocument>,
  _products: { attributes?: { name?: string; values?: string[] }[] }[],
) {
  const assets = loadWoodAssets();
  ensureMaterialPlaceholder();
  const removed = await loadMaterialRemovals(entryModel);
  await deleteRemovedMaterials(entryModel, removed);
  const existing = await entryModel
    .find({ kind: 'material' })
    .lean()
    .exec();

  const keepIds: string[] = [];
  const findExisting = (title: string, slug: string) => {
    const normalized = normalizeMaterialName(title);
    const available = existing.filter((entry) => !keepIds.includes(String(entry._id)));
    return (
      available.find((entry) => entry.slug === slug) ||
      available.find((entry) => normalizeMaterialName(entry.title) === normalized) ||
      available.find((entry) => {
        const data =
          entry.data && typeof entry.data === 'object'
            ? (entry.data as Record<string, unknown>)
            : {};
        const aliases = Array.isArray(data.aliases)
          ? data.aliases.map((item) => String(item))
          : [];
        return aliases.some((alias) => normalizeMaterialName(alias) === normalized);
      })
    );
  };
  const titles: string[] = [];
  for (const asset of assets) {
    const title = asset.names[0]?.trim();
    const slug = (asset.slug || asset.code.toLowerCase()).trim();
    if (!title || !slug) continue;
    if (isRemovedMaterial(removed, title, slug)) continue;
    titles.push(title);
    const current = findExisting(title, slug);
    const hex = asset.hex || '#8B6B52';
    const aliases = [...new Set(asset.names.map((name) => name.trim()).filter(Boolean))];
    const nextData = {
      ...(current?.data && typeof current.data === 'object' ? current.data : {}),
      code: asset.code,
      family: 'wood',
      categoryId: 'wood',
      materialType: 'چوب',
      materialTypes: ['چوب', 'پرداخت'],
      color: title,
      colors: [title],
      colorHex: hex,
      hex,
      image: materialSwatchImage(slug, ''),
      applicationImage: MATERIAL_PLACEHOLDER_URL,
      coverImage: MATERIAL_PLACEHOLDER_URL,
      aliases,
      sample: true,
      source: 'product-wood',
      eyebrow: `چوب / ${asset.code}`,
    };

    if (current) {
      keepIds.push(String(current._id));
      const currentData =
        current.data && typeof current.data === 'object'
          ? (current.data as Record<string, unknown>)
          : {};
      const previousSlugs = Array.isArray(currentData.previousSlugs)
        ? [...(currentData.previousSlugs as string[])]
        : [];
      if (current.slug && current.slug !== slug && !previousSlugs.includes(current.slug)) {
        previousSlugs.push(current.slug);
      }
      const keptImage = materialSwatchImage(slug, String(currentData.image || ''));
      const keptApplication = materialImageOrPlaceholder(
        String(currentData.applicationImage || ''),
      );
      const keptCover = materialImageOrPlaceholder(String(currentData.coverImage || ''));
      const gallery = (current.images || [])
        .map((item) => String(item || '').trim())
        .filter(isAdminMaterialImage);
      const patch: Record<string, unknown> = {
        slug,
        status: 'published',
        title,
        'data.previousSlugs': previousSlugs,
        excerpt: current.excerpt || `پرداخت چوب ${title}`,
        'data.code': asset.code,
        'data.family': 'wood',
        'data.categoryId': 'wood',
        'data.materialType': 'چوب',
        'data.materialTypes': ['چوب', 'پرداخت'],
        'data.color': title,
        'data.colorHex': hex,
        'data.hex': hex,
        'data.image': keptImage,
        'data.applicationImage': keptApplication,
        'data.coverImage': keptCover,
        'data.aliases': aliases,
        'data.sample': true,
        'data.source': 'product-wood',
        'data.eyebrow': nextData.eyebrow,
        images: gallery,
      };
      await entryModel.updateOne({ _id: current._id }, { $set: patch });
    } else {
      const created = await entryModel.create({
        kind: 'material',
        title,
        slug,
        status: 'published',
        excerpt: `پرداخت چوب ${title}`,
        description: `پرداخت ${title} از متریال‌های خانه چوب و هنر. تصویر از پنل مدیریت بارگذاری می‌شود.`,
        images: [],
        data: nextData,
        tags: ['wood', 'چوب'],
        publishedAt: new Date(),
      } as Partial<CmsEntry>);
      keepIds.push(String(created._id));
      existing.push(created.toObject() as typeof existing[number]);
    }
  }

  const familySlugs = new Set(['wood', 'fabric', 'veneer', 'metal']);
  for (const entry of existing) {
    if (familySlugs.has(entry.slug)) keepIds.push(String(entry._id));
  }

  const leftovers = existing.filter(
    (entry) => !keepIds.includes(String(entry._id)) && !familySlugs.has(entry.slug),
  );
  for (const entry of leftovers) {
    await rememberRemovedMaterial(entryModel, entry);
    await entryModel.deleteOne({ _id: entry._id });
  }

  return { titles, count: titles.length };
}
