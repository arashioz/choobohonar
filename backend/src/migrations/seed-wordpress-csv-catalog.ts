/**
 * Safe WordPress CSV seed: upserts parent products with their WordPress
 * variations nested on the same product.
 * It never deletes products; re-running it updates the same imported records.
 *
 * Run: npm run catalog:seed-wordpress-csv
 */
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ShopProductSchema } from '../modules/shop/schemas/shop-product.schema';

dotenv.config();

type CatalogAttribute = {
  name: string;
  terms?: { name: string }[];
  hasVariations?: boolean;
};
type CatalogRow = {
  externalCode?: string;
  slug: string;
  name: string;
  category: string;
  room: string;
  status: 'draft' | 'published' | 'archived';
  shortDescription?: string;
  longDescription?: string;
  image?: string;
  gallery?: string[];
  attributes?: CatalogAttribute[];
  variants?: {
    sku?: string;
    options?: { name: string; value: string }[];
    price?: number;
    compareAtPrice?: number;
    stockQty?: number;
    image?: string;
    enabled?: boolean;
  }[];
  prices?: { value?: number | null; regularValue?: number | null };
  stockQty?: number;
  trackInventory?: boolean;
  /** WooCommerce's explicit «در انبار؟» state when no numeric quantity exists. */
  inStock?: boolean;
  sortOrder?: number;
  source?: string;
};

const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
const catalogDataDir = join(process.cwd(), 'src/modules/shop/data');
const localCatalogPath = join(catalogDataDir, 'wordpress-csv-catalog.local.json');
const catalogPath = existsSync(localCatalogPath)
  ? localCatalogPath
  : join(catalogDataDir, 'wordpress-csv-catalog.json');

async function main() {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as CatalogRow[];
  const sourceRows = catalog.reduce(
    (total, row) =>
      total +
      (row.variants?.length || 0) +
      (row.category === 'محصولات بدون والد وردپرس' ? 0 : 1),
    0,
  );
  if (sourceRows !== 966) {
    throw new Error(`Expected all 966 WordPress CSV rows, received ${sourceRows}.`);
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_CONNECT_TIMEOUT_MS || 10_000,
    ),
  });
  const ShopProduct =
    mongoose.models.ShopProduct ||
    mongoose.model('ShopProduct', ShopProductSchema);
  const ops = catalog.map((row) => ({
    updateOne: {
      filter: { slug: row.slug },
      update: {
        $set: {
          externalCode: row.externalCode,
          name: row.name,
          category: row.category,
          room: row.room,
          status: row.status,
          shortDescription: row.shortDescription || '',
          longDescription: row.longDescription || '',
          image: row.image || '',
          gallery: row.gallery || [],
          price: row.prices?.value ?? undefined,
          compareAtPrice: row.prices?.regularValue ?? undefined,
          stockQty: row.stockQty || 0,
          trackInventory: Boolean(row.trackInventory),
          // The WordPress CSV uses a separate availability flag.  Its stock
          // quantity is empty (and normalizes to zero) for many sellable
          // products, so deriving availability from stockQty would mark them
          // all unavailable.
          inStock: row.inStock,
          attributes: (row.attributes || []).map((attribute) => ({
            name: attribute.name,
            values: (attribute.terms || []).map((term) => term.name),
            required: Boolean(attribute.hasVariations),
          })),
          variants: (row.variants || []).map((variant) => ({
            sku: variant.sku,
            options: variant.options || [],
            price: variant.price,
            compareAtPrice: variant.compareAtPrice,
            stockQty: variant.stockQty || 0,
            image: variant.image,
            enabled: variant.enabled !== false,
          })),
          sortOrder: row.sortOrder || 0,
          // Keep the same source as the in-app seed. This makes the admin's
          // «سینک کامل وردپرس» and «جایگزینی کامل» controls manage exactly
          // these imported records on later runs.
          source: 'catalog',
        },
        $setOnInsert: {
          slug: row.slug,
          finishes: [],
          featured: false,
          suggested: false,
          specs: [],
          highlights: [],
        },
      },
      upsert: true,
    },
  }));

  const result = await ShopProduct.bulkWrite(ops, { ordered: false });
  console.log(
    JSON.stringify({
      products: catalog.length,
      sourceRows,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    }),
  );
  await mongoose.disconnect();
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => undefined);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
