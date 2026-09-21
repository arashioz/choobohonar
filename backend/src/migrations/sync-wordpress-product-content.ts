/**
 * Content-only WordPress importer.
 *
 * It updates descriptions on products that already exist in Mongo. It never
 * creates products and never changes prices, stock, attributes or variants.
 *
 * Run a dry-run first:
 *   npm run catalog:sync-wordpress-content
 * Then write deliberately:
 *   npm run catalog:sync-wordpress-content -- --apply --confirm
 */
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import mongoose from 'mongoose';
import { join } from 'path';
import { ShopProductSchema } from '../modules/shop/schemas/shop-product.schema';

dotenv.config();

type CatalogRow = {
  slug: string;
  name: string;
  shortDescription?: string;
  longDescription?: string;
};

type ExistingProductContent = {
  _id: unknown;
  shortDescription?: string;
  longDescription?: string;
};

const shouldApply =
  process.argv.includes('--apply') && process.argv.includes('--confirm');
const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
const dataDir = join(process.cwd(), 'src/modules/shop/data');
const localCatalogPath = join(dataDir, 'wordpress-csv-catalog.local.json');
const catalogPath = existsSync(localCatalogPath)
  ? localCatalogPath
  : join(dataDir, 'wordpress-csv-catalog.json');

function text(value: unknown) {
  return String(value || '').trim();
}

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as CatalogRow[];
  const rows = catalog.filter(
    (row) =>
      text(row.slug) &&
      (text(row.shortDescription) || text(row.longDescription)),
  );

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_CONNECT_TIMEOUT_MS || 10_000,
    ),
  });
  const ShopProduct =
    mongoose.models.ShopProduct ||
    mongoose.model('ShopProduct', ShopProductSchema);

  let missing = 0;
  let unchanged = 0;
  const updates: { slug: string; name: string; fields: string[] }[] = [];
  for (const row of rows) {
    const existing = (await ShopProduct.findOne({ slug: row.slug })
      .select('slug name shortDescription longDescription')
      .lean()
      .exec()) as ExistingProductContent | null;
    if (!existing) {
      missing += 1;
      continue;
    }
    const patch: Record<string, string> = {};
    if (
      text(row.shortDescription) &&
      text(existing.shortDescription) !== text(row.shortDescription)
    )
      patch.shortDescription = text(row.shortDescription);
    if (
      text(row.longDescription) &&
      text(existing.longDescription) !== text(row.longDescription)
    )
      patch.longDescription = text(row.longDescription);
    if (!Object.keys(patch).length) {
      unchanged += 1;
      continue;
    }
    updates.push({
      slug: row.slug,
      name: row.name,
      fields: Object.keys(patch),
    });
    if (shouldApply)
      await ShopProduct.updateOne(
        { _id: existing._id },
        { $set: patch },
      ).exec();
  }

  console.log(
    JSON.stringify(
      {
        mode: shouldApply ? 'apply' : 'dry-run',
        catalogPath,
        candidates: rows.length,
        changed: updates.length,
        unchanged,
        missing,
        sample: updates.slice(0, 20),
      },
      null,
      2,
    ),
  );
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect().catch(() => undefined);
  process.exitCode = 1;
});
