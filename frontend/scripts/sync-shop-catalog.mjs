/**
 * Fetches the full WooCommerce catalog from choobohonar.com
 * and writes src/data/shop-catalog.json for the showcase site.
 *
 * Run: node scripts/sync-shop-catalog.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/shop-catalog.json");
const API = "https://choobohonar.com/wp-json/wc/store/v1/products";

const ROOM_PARENTS = {
  livingroom: "living",
  bedroom: "bedroom",
  diningroom: "dining",
  bedding: "bedding",
  carpet: "carpet",
  lighting: "lighting",
  decor: "decor",
  dishes: "dishes",
};

const PARENT_CAT_SLUGS = new Set([
  "livingroom",
  "bedroom",
  "diningroom",
  "bedding",
  "carpet",
  "lighting",
  "decor",
  "dishes",
  "product",
]);

function mapRoom(categories) {
  for (const c of categories) {
    if (ROOM_PARENTS[c.slug]) return ROOM_PARENTS[c.slug];
  }
  return "decor";
}

function getCategoryLabel(categories) {
  const specific = categories.filter((c) => !PARENT_CAT_SLUGS.has(c.slug));
  return specific[0]?.name ?? categories[0]?.name ?? "محصول";
}

function decodeSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePrice(prices) {
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

async function fetchPage(page) {
  const res = await fetch(`${API}?per_page=100&page=${page}`);
  if (!res.ok) throw new Error(`API page ${page} failed: ${res.status}`);
  return res.json();
}

async function main() {
  const all = [];
  let page = 1;

  while (true) {
    process.stdout.write(`Fetching page ${page}…\n`);
    const batch = await fetchPage(page);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    page += 1;
  }

  const catalog = all.map((p) => ({
    id: p.id,
    slug: decodeSlug(p.slug),
    name: p.name.replace(/\s+/g, " ").trim(),
    category: getCategoryLabel(p.categories ?? []),
    room: mapRoom(p.categories ?? []),
    shortDescription:
      stripHtml(p.short_description) ||
      stripHtml(p.description).slice(0, 220) ||
      "مشاهده جزئیات، ابعاد و انتخاب‌های این محصول از خانه چوب و هنر.",
    image: p.images?.[0]?.src ?? "",
    gallery: (p.images ?? []).map((image) => image.src).filter(Boolean),
    categories: (p.categories ?? []).map((category) => ({
      id: category.id,
      name: category.name,
      slug: decodeSlug(category.slug),
    })),
    attributes: (p.attributes ?? []).map((attribute) => ({
      id: attribute.id,
      name: attribute.name,
      taxonomy: attribute.taxonomy,
      hasVariations: attribute.has_variations,
      terms: (attribute.terms ?? []).map((term) => ({
        id: term.id,
        name: term.name,
        slug: decodeSlug(term.slug),
        default: Boolean(term.default),
      })),
    })),
    prices: normalizePrice(p.prices),
    averageRating: p.average_rating ?? "0",
    reviewCount: p.review_count ?? 0,
    isPurchasable: Boolean(p.is_purchasable),
    isInStock: Boolean(p.is_in_stock),
    hasOptions: Boolean(p.has_options),
    shopUrl: p.permalink,
  }));

  fs.writeFileSync(OUT, JSON.stringify(catalog, null, 2), "utf8");
  process.stdout.write(`Wrote ${catalog.length} products to ${OUT}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
