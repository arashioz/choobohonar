/**
 * Restores products that belong to a WordPress collection into the active
 * storefront/API catalog. Existing catalog records are never overwritten, so
 * admin edits and locally migrated media remain intact. It is idempotent and
 * intentionally keeps original WordPress image URLs for newly restored media.
 *
 * Run: node scripts/merge-wordpress-collection-products-into-catalog.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "frontend/src/data/choobohonar-products.json");
const catalogFiles = [
  path.join(root, "backend/src/modules/shop/data/shop-catalog.json"),
  path.join(root, "frontend/src/data/shop-catalog.json"),
];
const roomByCategory = { livingroom: "living", bedroom: "bedroom", bedding: "bedding", diningroom: "dining", carpet: "carpet", lighting: "lighting", decor: "decor", dishes: "dishes" };

function decode(value = "") { try { return decodeURIComponent(value); } catch { return value; } }
function text(value = "") { return String(value).replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim(); }

function toCatalogProduct(product, index) {
  const categories = product.categories || [];
  const attributes = (product.attributes || []).map((attribute) => ({
    id: attribute.id,
    name: attribute.name,
    taxonomy: attribute.taxonomy || null,
    hasVariations: Boolean(attribute.has_variations),
    terms: (attribute.terms || []).map((term) => ({ id: term.id, name: term.name, slug: decode(term.slug), default: Boolean(term.default) })),
  }));
  const gallery = [...new Set((product.images || []).map((image) => image.src).filter(Boolean))];
  const prices = product.prices ? {
    value: product.prices.price || null,
    regularValue: product.prices.regular_price || null,
    saleValue: product.prices.sale_price || null,
    minValue: product.prices.price || null,
    maxValue: product.prices.price || null,
    currencyCode: product.prices.currency_code || "IRT",
    currencySymbol: product.prices.currency_symbol || "تومان",
    minorUnit: product.prices.currency_minor_unit || 0,
  } : null;
  return {
    id: product.id,
    slug: decode(product.slug),
    name: text(product.name),
    category: categories[0]?.name || "محصول",
    room: categories.map((category) => roomByCategory[decode(category.slug)]).find(Boolean) || "decor",
    shortDescription: text(product.short_description) || text(product.description).slice(0, 220) || "مشاهده جزئیات این محصول از خانه چوب و هنر.",
    longDescription: text(product.description),
    image: gallery[0],
    gallery,
    categories: categories.map((category) => ({ id: category.id, name: category.name, slug: decode(category.slug) })),
    attributes,
    prices,
    averageRating: product.average_rating || "0",
    reviewCount: product.review_count || 0,
    isPurchasable: Boolean(product.is_purchasable),
    isInStock: Boolean(product.is_in_stock),
    hasOptions: attributes.some((attribute) => attribute.hasVariations),
    shopUrl: product.permalink || "",
    variants: [],
    sortOrder: index,
  };
}

const source = JSON.parse(await readFile(sourceFile, "utf8"));
const collectionProducts = source.products.filter((product) => (product.attributes || []).some((attribute) => attribute.taxonomy === "pa_collection" && attribute.terms?.length) && product.images?.some((image) => image.src));
if (!collectionProducts.length) throw new Error("No collection products found in the WordPress export.");
let restored = 0;
for (const filename of catalogFiles) {
  const current = JSON.parse(await readFile(filename, "utf8"));
  const currentSlugs = new Set(current.map((product) => product.slug));
  const missing = collectionProducts.filter((product) => !currentSlugs.has(decode(product.slug))).map((product, index) => toCatalogProduct(product, current.length + index));
  restored = missing.length;
  await writeFile(filename, `${JSON.stringify([...current, ...missing], null, 2)}\n`, "utf8");
}
console.log(`Restored ${restored} WordPress collection products into both active catalogs.`);
