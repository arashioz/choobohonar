/**
 * Reconciles existing Mongo product variants with the WordPress CSV catalog.
 *
 * This is deliberately not a catalog seed: it never creates products,
 * touches collections/indexes, or changes the product schema. By default it
 * is a dry run. To write changes, require both flags:
 *   npm run catalog:reconcile-wordpress-variants -- --apply --confirm
 */
import * as dotenv from 'dotenv';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import mongoose, { Schema } from 'mongoose';

dotenv.config();

type Option = { name: string; value: string };
type CatalogAttribute = {
  name: string;
  terms?: { name: string }[];
  hasVariations?: boolean;
};
type CatalogVariant = {
  sku?: string;
  options?: Option[];
  price?: number;
  enabled?: boolean;
};
type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  room: string;
  attributes?: CatalogAttribute[];
  variants?: CatalogVariant[];
};
type StoredVariant = {
  sku?: string;
  options?: Option[];
  price?: number;
  enabled?: boolean;
  stockQty?: number;
  compareAtPrice?: number;
  image?: string;
};
type StoredProduct = {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  category?: string;
  room?: string;
  attributes?: { name: string; values?: string[]; required?: boolean }[];
  variants?: StoredVariant[];
};

const apply = process.argv.includes('--apply');
const confirmed = process.argv.includes('--confirm');
const mongoUri =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
const dataDir = join(process.cwd(), 'src/modules/shop/data');
const localCatalog = join(dataDir, 'wordpress-csv-catalog.local.json');
const catalogPath = existsSync(localCatalog)
  ? localCatalog
  : join(dataDir, 'wordpress-csv-catalog.json');

function text(value: unknown): string {
  return String(value ?? '').trim();
}

function normalize(value: unknown): string {
  return text(value)
    .replace(/[۰-۹]/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(digit).toString())
    .replace(/[٠-٩]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit).toString())
    .replace(/[آأإ]/g, 'ا')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
}

function normalizeSku(value: unknown): string {
  return normalize(value).replace(/[^a-z0-9-]/g, '');
}

function axisName(name: unknown, values: string[] = []): string {
  const label = normalize(name);
  const hasSeatValue = values.some((value) =>
    /\b\d+\s*(نفره|seat)|^(یک|دو|سه|چهار|پنج|شش) نفره$/u.test(normalize(value)),
  );
  const hasMechanismValue = values.some((value) =>
    /مکانیزم/u.test(normalize(value)),
  );
  if (hasSeatValue || /^(کاناپه|ظرفیت|نفره|seat|seater)$/u.test(label))
    return 'ظرفیت';
  if (hasMechanismValue || /^(نوع کاناپه|مکانیزم|canape)$/u.test(label))
    return 'مکانیزم';
  if (/^(سایز|اندازه|size)$/u.test(label)) return 'سایز';
  if (/^(نوع سرتخت|headboard type)$/u.test(label)) return 'نوع سرتخت';
  if (/^(سرتخت|headboard)$/u.test(label)) return 'سرتخت';
  if (/^(چوب|wood|متریال|material)$/u.test(label)) return 'چوب';
  if (/^(پارچه|fabric|رویه پارچه)$/u.test(label)) return 'پارچه';
  if (/کوسن|cushion/u.test(label)) return 'کوسن';
  if (/^(رنگ|color)$/u.test(label)) return 'رنگ';
  if (/^(فرم|شکل|form)$/u.test(label)) return 'فرم';
  if (/^(ارتفاع|height)$/u.test(label)) return 'ارتفاع';
  return text(name);
}

function normalizeOptions(options: Option[] = []): Option[] {
  const result = new Map<string, Option>();
  for (const option of options) {
    const value = text(option.value);
    if (!value) continue;
    const name = axisName(option.name, [value]);
    if (!name) continue;
    const key = `${normalize(name)}:${normalize(value)}`;
    if (!result.has(key)) result.set(key, { name, value });
  }
  return [...result.values()];
}

function sameOptions(left: Option[] = [], right: Option[] = []): boolean {
  const a = normalizeOptions(left);
  const b = normalizeOptions(right);
  return (
    a.length === b.length &&
    a.every(
      (option, index) =>
        normalize(option.name) === normalize(b[index]?.name) &&
        normalize(option.value) === normalize(b[index]?.value),
    )
  );
}

function sourceAttributes(product: CatalogProduct) {
  const sourceVariants = (product.variants || []).filter(
    (variant) => Number(variant.price) > 0,
  );
  const valuesByAxis = new Map<string, string[]>();
  const requiredAxes = new Set<string>();

  for (const attribute of product.attributes || []) {
    const values = (attribute.terms || [])
      .map((term) => text(term.name))
      .filter(Boolean);
    const name = axisName(attribute.name, values);
    if (name) valuesByAxis.set(normalize(name), values);
  }
  for (const variant of sourceVariants) {
    for (const option of normalizeOptions(variant.options)) {
      const key = normalize(option.name);
      requiredAxes.add(key);
      const values = valuesByAxis.get(key) || [];
      if (!values.some((value) => normalize(value) === normalize(option.value)))
        values.push(option.value);
      valuesByAxis.set(key, values);
    }
  }
  return { valuesByAxis, requiredAxes };
}

function reconciledAttributes(
  stored: StoredProduct,
  source: CatalogProduct,
): StoredProduct['attributes'] {
  const { valuesByAxis, requiredAxes } = sourceAttributes(source);
  const result = new Map<
    string,
    { name: string; values: string[]; required: boolean }
  >();

  for (const attribute of stored.attributes || []) {
    const values = (attribute.values || []).map(text).filter(Boolean);
    const name = axisName(attribute.name, values);
    const key = normalize(name);
    result.set(key, {
      name,
      values: valuesByAxis.get(key) || values,
      required: requiredAxes.has(key),
    });
  }
  for (const [key, values] of valuesByAxis) {
    if (result.has(key)) continue;
    const sourceAttribute = (source.attributes || []).find(
      (attribute) =>
        normalize(
          axisName(
            attribute.name,
            (attribute.terms || []).map((term) => term.name),
          ),
        ) === key,
    );
    const sourceOption = (source.variants || [])
      .flatMap((variant) => normalizeOptions(variant.options))
      .find((option) => normalize(option.name) === key);
    const canonicalName = sourceAttribute
      ? axisName(sourceAttribute.name, values)
      : sourceOption?.name || key;
    result.set(key, {
      name: canonicalName,
      values,
      required: requiredAxes.has(key),
    });
  }
  return [...result.values()];
}

function sameAttributes(
  left: StoredProduct['attributes'] = [],
  right: StoredProduct['attributes'] = [],
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isPriority(product: CatalogProduct): 'carpet' | 'bedding' | undefined {
  const label = normalize(
    `${product.category} ${product.room} ${product.name}`,
  );
  if (/فرش|گلیم/u.test(label)) return 'carpet';
  if (/کالای خواب|روتخت|ملحفه|بالش|لحاف/u.test(label)) return 'bedding';
  return undefined;
}

async function main() {
  if (apply && !confirmed)
    throw new Error(
      'Refusing to write. Use both --apply and --confirm after reviewing dry-run output.',
    );

  const catalog = JSON.parse(
    readFileSync(catalogPath, 'utf8'),
  ) as CatalogProduct[];
  const sourceBySlug = new Map(
    catalog.map((product) => [normalize(product.slug), product]),
  );
  const sourceByName = new Map<string, CatalogProduct[]>();
  for (const product of catalog) {
    const key = normalize(product.name);
    sourceByName.set(key, [...(sourceByName.get(key) || []), product]);
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: Number(
      process.env.MONGO_CONNECT_TIMEOUT_MS || 10_000,
    ),
  });
  const ProductModel = mongoose.model<StoredProduct>(
    'VariantReconciliationProduct',
    new Schema({}, { strict: false }),
    'shopproducts',
  );
  const stored = await ProductModel.find({}).lean().exec();
  const operations: mongoose.AnyBulkWriteOperation<StoredProduct>[] = [];
  const report = {
    mode: apply ? 'apply' : 'dry-run',
    catalog: catalogPath,
    scannedProducts: stored.length,
    matchedProducts: 0,
    changedProducts: 0,
    variantsAdded: 0,
    variantsUpdated: 0,
    incompleteVariantsRemoved: 0,
    attributesNormalized: 0,
    skippedSourceVariantsWithoutOptions: 0,
    unmatchedProducts: [] as string[],
    priorityChanges: { carpet: 0, bedding: 0 },
    examples: [] as Array<{ slug: string; name: string; changes: string[] }>,
  };

  for (const product of stored) {
    const bySlug = sourceBySlug.get(normalize(product.slug));
    const byName = sourceByName.get(normalize(product.name)) || [];
    const source = bySlug || (byName.length === 1 ? byName[0] : undefined);
    if (!source) {
      if (report.unmatchedProducts.length < 25)
        report.unmatchedProducts.push(product.slug);
      continue;
    }
    report.matchedProducts += 1;
    const changes: string[] = [];
    const existing = product.variants || [];
    const sourceVariants = (source.variants || []).filter(
      (variant) => Number(variant.price) > 0,
    );
    const sourceBySku = new Map(
      sourceVariants
        .filter((variant) => normalizeSku(variant.sku))
        .map((variant) => [normalizeSku(variant.sku), variant]),
    );
    const nextVariants: StoredVariant[] = [];

    for (const variant of existing) {
      const sku = normalizeSku(variant.sku);
      const sourceVariant = sku ? sourceBySku.get(sku) : undefined;
      const currentOptions = normalizeOptions(variant.options);
      if (!sku && !currentOptions.length) {
        report.incompleteVariantsRemoved += 1;
        changes.push('removed incomplete variant');
        continue;
      }
      if (!sourceVariant) {
        nextVariants.push({ ...variant, options: currentOptions });
        continue;
      }
      const options = normalizeOptions(sourceVariant.options);
      if (!options.length) {
        report.skippedSourceVariantsWithoutOptions += 1;
        nextVariants.push({ ...variant, options: currentOptions });
        continue;
      }
      const next = {
        ...variant,
        sku: sourceVariant.sku,
        options,
        price: sourceVariant.price,
        enabled: sourceVariant.enabled !== false,
      };
      if (
        Number(variant.price) !== Number(next.price) ||
        variant.enabled !== next.enabled ||
        !sameOptions(variant.options, options)
      ) {
        report.variantsUpdated += 1;
        changes.push(`updated SKU ${sourceVariant.sku}`);
      }
      nextVariants.push(next);
    }

    const existingSkus = new Set(
      nextVariants.map((variant) => normalizeSku(variant.sku)).filter(Boolean),
    );
    for (const sourceVariant of sourceVariants) {
      const sku = normalizeSku(sourceVariant.sku);
      const options = normalizeOptions(sourceVariant.options);
      if (!sku || existingSkus.has(sku)) continue;
      if (!options.length) {
        report.skippedSourceVariantsWithoutOptions += 1;
        continue;
      }
      nextVariants.push({
        sku: sourceVariant.sku,
        options,
        price: sourceVariant.price,
        enabled: sourceVariant.enabled !== false,
      });
      existingSkus.add(sku);
      report.variantsAdded += 1;
      changes.push(`added SKU ${sourceVariant.sku}`);
    }

    const attributes = reconciledAttributes(product, source);
    if (!sameAttributes(product.attributes, attributes)) {
      report.attributesNormalized += 1;
      changes.push('normalized axes');
    }
    const variantsChanged =
      JSON.stringify(existing) !== JSON.stringify(nextVariants);
    if (!variantsChanged && sameAttributes(product.attributes, attributes))
      continue;

    report.changedProducts += 1;
    const priority = isPriority(source);
    if (priority) report.priorityChanges[priority] += 1;
    if (report.examples.length < 25)
      report.examples.push({ slug: product.slug, name: product.name, changes });
    operations.push({
      updateOne: {
        filter: { _id: product._id },
        update: { $set: { variants: nextVariants, attributes } },
      },
    });
  }

  if (apply && operations.length)
    await ProductModel.bulkWrite(operations, { ordered: false });
  console.log(
    JSON.stringify(
      { ...report, writes: apply ? operations.length : 0 },
      null,
      2,
    ),
  );
  await mongoose.disconnect();
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => undefined);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
