import type { ShopProduct } from "@/data/products";
import type { MaterialSwatch } from "@/lib/storefront-products";

/** The circle uses the photo stored on the material in admin. Placeholders are not a photo. */
export function resolveMaterialImage(item: { image?: string }) {
  const image = (item.image || "").trim();
  if (!image || image.includes("material-placeholder")) return "";
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
