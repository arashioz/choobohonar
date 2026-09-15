/**
 * One-time, destructive replacement of the ShopProduct collection.
 *
 * The command deliberately refuses to run without --confirm-replace:
 *   npm run catalog:replace -- --confirm-replace
 */

import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ShopProductSchema } from '../modules/shop/schemas/shop-product.schema';

dotenv.config();

type CatalogTerm = { name: string };
type CatalogAttribute = {
  name: string;
  taxonomy?: string | null;
  hasVariations?: boolean;
  terms?: CatalogTerm[];
};
type CatalogVariant = {
  sku?: string;
  options?: { name: string; value: string }[];
  price?: number;
  compareAtPrice?: number;
  stockQty?: number;
  image?: string;
  enabled?: boolean;
};
type CatalogRow = {
  externalCode?: string;
  slug: string;
  name: string;
  category: string;
  room: string;
  status?: 'draft' | 'published' | 'archived';
  shortDescription?: string;
  longDescription?: string;
  specs?: { label: string; value: string }[];
  image?: string;
  gallery?: string[];
  attributes?: CatalogAttribute[];
  variants?: CatalogVariant[];
  prices?: { value?: string | null; regularValue?: string | null } | null;
  stockQty?: number;
  trackInventory?: boolean;
  sortOrder?: number;
};

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
const catalogPath = join(
  process.cwd(),
  'src/modules/shop/data/wordpress-csv-catalog.json',
);

function seriesFrom(attributes: CatalogAttribute[]): string | undefined {
  return attributes.find(
    (attribute) =>
      attribute.taxonomy === 'pa_collection' || attribute.name === 'کالکشن',
  )?.terms?.[0]?.name;
}

async function main() {
  if (!process.argv.includes('--confirm-replace')) {
    throw new Error(
      'Refusing to delete products. Run with: npm run catalog:replace -- --confirm-replace',
    );
  }

  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as CatalogRow[];
  if (!catalog.length)
    throw new Error('Catalog is empty; refusing to replace existing products.');

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_CONNECT_TIMEOUT_MS || 10_000,
    ),
  });
  const ShopProduct =
    mongoose.models.ShopProduct ||
    mongoose.model('ShopProduct', ShopProductSchema);

  const docs = catalog.map((row, index) => ({
    externalCode: row.externalCode,
    slug: row.slug,
    name: row.name,
    category: row.category,
    room: row.room,
    shortDescription: row.shortDescription || '',
    longDescription: row.longDescription || '',
    image: row.image || '',
    gallery: row.gallery || [],
    finishes: [],
    status: row.status || 'published',
    featured: false,
    suggested: false,
    series: seriesFrom(row.attributes || []),
    price: row.prices?.value ? Number(row.prices.value) : undefined,
    compareAtPrice: row.prices?.regularValue
      ? Number(row.prices.regularValue)
      : undefined,
    stockQty:
      row.stockQty ??
      (row.variants || []).reduce(
        (total, variant) => total + (variant.stockQty || 0),
        0,
      ),
    trackInventory: Boolean(row.trackInventory),
    specs: row.specs || [],
    highlights: [],
    attributes: (row.attributes || [])
      .map((attribute) => ({
        name: attribute.name,
        values: (attribute.terms || []).map((term) => term.name),
        required: Boolean(attribute.hasVariations),
      }))
      .filter((attribute) => attribute.name && attribute.values.length),
    variants: (row.variants || []).map((variant) => ({
      sku: variant.sku,
      options: variant.options || [],
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      stockQty: variant.stockQty || 0,
      image: variant.image,
      enabled: variant.enabled !== false,
    })),
    sortOrder: row.sortOrder ?? index,
    source: 'catalog',
  }));

  const deleted = await ShopProduct.deleteMany({});
  const inserted = await ShopProduct.insertMany(docs, { ordered: true });
  console.log(
    `Deleted ${deleted.deletedCount} existing products; seeded ${inserted.length} catalog products.`,
  );
  await mongoose.disconnect();
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => undefined);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
