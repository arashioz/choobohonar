/**
 * Backfill shop finishes and CMS project featured/product fields.
 *
 *   npm run migrate:content-models
 */
import * as dotenv from 'dotenv';
import mongoose, { Schema } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';

dotenv.config();

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';

function extractProductSlugs(data: Record<string, unknown>): string[] {
  const collected: string[] = [];
  const take = (value: unknown) => {
    if (!value) return;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string' && item.trim()) collected.push(item.trim());
        else if (item && typeof item === 'object') {
          const record = item as { productSlug?: unknown; slug?: unknown };
          const slug = record.productSlug || record.slug;
          if (typeof slug === 'string' && slug.trim()) collected.push(slug.trim());
        }
      }
    }
  };
  take(data.productSlugs);
  take(data.productIds);
  take(data.products);
  take(data.heroMarkers);
  return [...new Set(collected)];
}

async function main() {
  await mongoose.connect(mongoUri);
  const Product = mongoose.model(
    'ShopProduct',
    new Schema({}, { strict: false }),
  );
  const Cms = mongoose.model<{
    slug?: string;
    data?: Record<string, unknown>;
  }>(
    'CmsEntryMigrate',
    new Schema({}, { strict: false }),
    'cms_entries',
  );

  const finishes = await Product.updateMany(
    { $or: [{ finishes: { $exists: false } }, { finishes: null }] },
    { $set: { finishes: [] } },
  );
  console.log(`shop finishes backfill: ${finishes.modifiedCount}`);

  let rows: Array<Record<string, unknown>> = [];
  try {
    rows = JSON.parse(
      readFileSync(
        join(process.cwd(), 'src/modules/cms/data/legacy-projects.json'),
        'utf8',
      ),
    );
  } catch {
    rows = [];
  }
  const bySlug = new Map(
    rows
      .filter((row) => typeof row.slug === 'string' && row.slug)
      .map((row) => [String(row.slug), row]),
  );

  const projects = await Cms.find({ kind: 'project' }).lean().exec();
  let updated = 0;
  for (const project of projects) {
    const data =
      project.data && typeof project.data === 'object' && !Array.isArray(project.data)
        ? { ...(project.data as Record<string, unknown>) }
        : {};
    const legacy = bySlug.get(String(project.slug)) || {};
    const slugs = extractProductSlugs({ ...legacy, ...data });
    let changed = false;
    if (slugs.length && (!Array.isArray(data.productSlugs) || !data.productSlugs.length)) {
      data.productSlugs = slugs;
      data.productIds = slugs;
      changed = true;
    }
    if (data.featured === undefined && typeof legacy.featured === 'boolean') {
      data.featured = legacy.featured;
      changed = true;
    }
    const existingImages = Array.isArray(data.featuredImages)
      ? data.featuredImages.filter(
          (image): image is string => typeof image === 'string' && image.length > 0,
        )
      : [];
    if (!existingImages.length && Array.isArray(legacy.featuredImages)) {
      data.featuredImages = legacy.featuredImages
        .filter((image): image is string => typeof image === 'string' && image.length > 0)
        .slice(0, 2);
      changed = true;
    }
    if (changed) {
      await Cms.updateOne({ _id: project._id }, { $set: { data } });
      updated += 1;
    }
  }

  const featured = await Cms.find({ kind: 'project', 'data.featured': true })
    .sort({ updatedAt: -1 })
    .select({ _id: 1 })
    .lean()
    .exec();
  if (featured.length > 2) {
    await Cms.updateMany(
      { _id: { $in: featured.slice(2).map((entry) => entry._id) } },
      { $set: { 'data.featured': false } },
    );
  }

  console.log(`cms projects updated: ${updated}; featured kept: ${Math.min(featured.length, 2)}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
