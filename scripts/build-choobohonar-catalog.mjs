/**
 * Converts the WooCommerce export plus the local-image manifest into the
 * catalog seed consumed by both the Next storefront and Nest shop module.
 *
 * Run after download-choobohonar-product-images.mjs:
 *   node scripts/build-choobohonar-catalog.mjs
 *   node scripts/build-choobohonar-catalog.mjs --check
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const inputFile = path.join(root, "frontend/src/data/choobohonar-products.json");
const manifestFile = path.join(root, "backend/uploads/products/manifest.json");
const outputFiles = [
  path.join(root, "frontend/src/data/shop-catalog.json"),
  path.join(root, "backend/src/modules/shop/data/shop-catalog.json"),
];
const checkOnly = process.argv.includes("--check");

const ROOM_BY_CATEGORY = {
  livingroom: "living",
  bedroom: "bedroom",
  bedding: "bedding",
  diningroom: "dining",
  carpet: "carpet",
  lighting: "lighting",
  decor: "decor",
  dishes: "dishes",
};

const PARENT_CATEGORY_SLUGS = new Set([...Object.keys(ROOM_BY_CATEGORY), "product", "accessory"]);

function decode(value = "") {
  try { return decodeURIComponent(value); } catch { return value; }
}

function stripHtml(value = "") {
  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#(?:x0*([0-9a-f]+)|([0-9]+));/gi, (_, hex, decimal) => String.fromCodePoint(Number.parseInt(hex || decimal, hex ? 16 : 10)))
    .replace(/\s+/g, " ")
    .trim();
}

function roomFor(categories) {
  for (const category of categories || []) {
    const room = ROOM_BY_CATEGORY[decode(category.slug)];
    if (room) return room;
  }
  return "decor";
}

function categoryFor(categories) {
  const specific = (categories || []).find((category) => !PARENT_CATEGORY_SLUGS.has(decode(category.slug)));
  return specific?.name || categories?.[0]?.name || "محصول";
}

function localImage(source, images) {
  if (!source) return "";
  const local = images[source];
  if (!local) throw new Error(`Image was not downloaded: ${source}`);
  return local;
}

function normalizePrices(prices) {
  if (!prices) return null;
  return {
    value: prices.price ?? null,
    regularValue: prices.regular_price ?? null,
    saleValue: prices.sale_price ?? null,
    minValue: prices.price_range?.min_amount ?? prices.price ?? null,
    maxValue: prices.price_range?.max_amount ?? prices.price ?? null,
    currencyCode: prices.currency_code ?? "IRT",
    currencySymbol: prices.currency_symbol ?? "تومان",
    minorUnit: prices.currency_minor_unit ?? 0,
  };
}

function catalogAttributes(product) {
  return (product.attributes || []).map((attribute) => ({
    id: attribute.id,
    name: attribute.name,
    taxonomy: attribute.taxonomy || null,
    hasVariations: Boolean(attribute.has_variations),
    terms: (attribute.terms || []).map((term) => ({
      id: term.id,
      name: term.name,
      slug: decode(term.slug),
      default: Boolean(term.default),
    })),
  }));
}

function variationOptions(variation, attributes) {
  return Object.entries(variation.attributes || {}).flatMap(([key, rawValue]) => {
    if (!rawValue) return [];
    const taxonomy = key.replace(/^attribute_/, "");
    const attribute = attributes.find((item) => item.taxonomy === taxonomy);
    const value = decode(String(rawValue));
    const term = attribute?.terms.find((item) => item.slug === value);
    // A term can be absent in malformed legacy data; preserving the value is
    // still better than dropping the sellable variation altogether.
    return [{ name: attribute?.name || taxonomy.replace(/^pa_/, ""), value: term?.name || value }];
  });
}

function catalogVariants(product, attributes, images) {
  return (product.variations || []).map((variation) => {
    const originalImage = variation.image?.full_src || variation.image?.url || variation.image?.src || "";
    const price = Number(variation.display_price);
    const regularPrice = Number(variation.display_regular_price);
    const enabled = Boolean(variation.variation_is_active && variation.variation_is_visible && variation.is_purchasable);
    return {
      id: String(variation.variation_id),
      sku: variation.sku || undefined,
      options: variationOptions(variation, attributes),
      price: Number.isFinite(price) && price > 0 ? price : undefined,
      compareAtPrice: Number.isFinite(regularPrice) && regularPrice > price ? regularPrice : undefined,
      // WooCommerce Store API does not expose exact stock quantity here.
      // One means sellable; zero means unavailable, while inventory remains untracked.
      stockQty: variation.is_in_stock ? 1 : 0,
      image: originalImage ? localImage(originalImage, images) : undefined,
      enabled,
    };
  });
}

async function main() {
  const [source, manifest] = await Promise.all([
    readFile(inputFile, "utf8").then(JSON.parse),
    readFile(manifestFile, "utf8").then(JSON.parse),
  ]);
  if (manifest.failures?.length) throw new Error(`Image manifest has ${manifest.failures.length} failed download(s)`);

  const catalog = source.products.map((product, index) => {
    const attributes = catalogAttributes(product);
    const gallery = (product.images || []).map((image) => localImage(image.src, manifest.images));
    const variants = catalogVariants(product, attributes, manifest.images);
    const primaryImage = gallery[0] || variants.find((variant) => variant.image)?.image || "";
    if (!primaryImage) throw new Error(`Product has no local image: ${product.name}`);
    const prices = normalizePrices(product.prices);
    const variantPrices = variants.map((variant) => variant.price).filter(Number.isFinite);
    const price = prices?.value || (variantPrices.length ? String(Math.min(...variantPrices)) : null);
    const maxPrice = prices?.maxValue || (variantPrices.length ? String(Math.max(...variantPrices)) : price);

    return {
      id: product.id,
      slug: decode(product.slug),
      name: String(product.name).replace(/\s+/g, " ").trim(),
      category: categoryFor(product.categories),
      room: roomFor(product.categories),
      shortDescription: stripHtml(product.short_description) || stripHtml(product.description).slice(0, 220) || "مشاهده جزئیات، ابعاد و انتخاب‌های این محصول از خانه چوب و هنر.",
      longDescription: stripHtml(product.description),
      image: primaryImage,
      gallery: [...new Set(gallery)],
      categories: (product.categories || []).map((category) => ({ id: category.id, name: category.name, slug: decode(category.slug) })),
      attributes,
      prices: prices ? { ...prices, value: price, minValue: prices.minValue || price, maxValue: maxPrice } : null,
      averageRating: product.average_rating ?? "0",
      reviewCount: product.review_count ?? 0,
      isPurchasable: Boolean(product.is_purchasable),
      isInStock: variants.length ? variants.some((variant) => variant.enabled && variant.stockQty > 0) : Boolean(product.is_in_stock),
      hasOptions: attributes.some((attribute) => attribute.hasVariations),
      shopUrl: product.permalink || "",
      variants,
      sortOrder: index,
    };
  });

  const result = `${JSON.stringify(catalog, null, 2)}\n`;
  if (checkOnly) {
    const existing = await Promise.all(outputFiles.map((file) => readFile(file, "utf8")));
    if (existing.some((value) => value !== result)) throw new Error("Catalog seeds are stale. Run: node scripts/build-choobohonar-catalog.mjs");
    console.log(`Catalog is current: ${catalog.length} products, ${catalog.reduce((sum, product) => sum + product.variants.length, 0)} variants.`);
    return;
  }
  await Promise.all(outputFiles.map((file) => writeFile(file, result, "utf8")));
  console.log(`Wrote ${catalog.length} products and ${catalog.reduce((sum, product) => sum + product.variants.length, 0)} variants to both catalog seeds.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
