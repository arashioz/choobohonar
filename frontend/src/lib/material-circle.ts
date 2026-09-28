import type { ShopProduct } from "@/data/products";
import type { MaterialSwatch } from "@/lib/storefront-products";

const woodCodes = ["wa", "pw", "pl", "pd", "pg", "sb", "sm", "al", "be", "gr"] as const;

/** Cropped swatches in the frontend public folder, so Next can optimize them. */
export function staticWoodSwatchPath(slug: string) {
  const code = slug.trim().toLowerCase().split("-")[0] || "";
  return (woodCodes as readonly string[]).includes(code) ? `/images/materials/wood/${code}.jpg` : "";
}

/**
 * Admin uploads stay on /uploads. The bundled wood photos are static frontend files.
 * Older records still point at /uploads/materials/{code}.jpg; those map back here.
 */
export function resolveMaterialImage(item: { slug?: string; image?: string }) {
  const image = (item.image || "").trim();
  const bundled = staticWoodSwatchPath(item.slug || "");
  const legacy = image.match(/^\/uploads\/materials\/([a-z0-9-]+)\.jpg$/i);
  if (legacy) return staticWoodSwatchPath(legacy[1]) || bundled || image;
  if (!image || image.includes("material-placeholder")) return bundled || image;
  return image;
}

function normalizeSwatchKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[آأإ]/g, "ا")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/روکش|سند\s*بلاست|کد/g, "")
    .replace(/[\s‌ـ\-_/]+/g, "");
}

export function matchMaterialSwatch(swatches: MaterialSwatch[], value: string) {
  const normalized = normalizeSwatchKey(value);
  if (!normalized) return undefined;
  return swatches.find((item) => {
    const keys = [item.slug, item.name, item.color, item.code, ...(item.aliases || [])];
    return keys.some((key) => key && (key === value || normalizeSwatchKey(key) === normalized));
  });
}

const woodAttributeName = /^(چوب|متریال|پرداخت|فینیش|رویه|wood|material|finish)$/i;

export type MaterialCircle = { name: string; image: string };

export function materialCirclesForProduct(product: ShopProduct, materials: MaterialSwatch[]): MaterialCircle[] {
  const keys = [
    ...(product.finishes || []),
    ...product.attributes
      .filter((attribute) => woodAttributeName.test(attribute.name.trim()))
      .flatMap((attribute) => attribute.terms.map((term) => term.name)),
  ];
  const seen = new Set<string>();
  const circles: MaterialCircle[] = [];
  for (const key of keys) {
    const match = matchMaterialSwatch(materials, key);
    if (!match || seen.has(match.slug)) continue;
    const image = resolveMaterialImage(match);
    if (!image) continue;
    seen.add(match.slug);
    circles.push({ name: match.name, image });
  }
  return circles.slice(0, 4);
}
