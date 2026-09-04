import type { ShopProduct, ProductRoom } from "@/data/products";
import { getApiBase } from "@/lib/api-base";

type BackendProduct = {
  _id?: string;
  slug: string;
  name: string;
  category?: string;
  room?: ProductRoom;
  shortDescription?: string;
  image?: string;
  gallery?: string[];
  shopUrl?: string;
  finishes?: string[];
  price?: number;
  stockQty?: number;
  trackInventory?: boolean;
  featured?: boolean;
  sortOrder?: number;
  series?: string;
  attributes?: { name: string; values: string[]; required?: boolean }[];
  variants?: { _id?: string; sku?: string; options: { name: string; value: string }[]; price?: number; compareAtPrice?: number; stockQty?: number; enabled?: boolean }[];
};

export function normalizeStorefrontProduct(item: BackendProduct): ShopProduct {
  const price = Number.isFinite(Number(item.price)) && Number(item.price) > 0 ? String(item.price) : null;
  const image = item.image || item.gallery?.[0] || "";
  return {
    kind: "catalog",
    id: Number.parseInt(item._id || "0", 16) || 0,
    slug: item.slug,
    name: item.name,
    category: item.category || "محصولات خانه",
    room: item.room || "living",
    shortDescription: item.shortDescription || "",
    image,
    gallery: item.gallery || (image ? [image] : []),
    categories: [{ id: 0, name: item.category || "محصولات خانه", slug: item.category || "all" }],
    attributes: [
      ...(item.series ? [{ id: -1, name: "کالکشن", taxonomy: "pa_collection", hasVariations: false, terms: [{ id: 0, name: item.series, slug: item.series, default: true }] }] : []),
      ...(item.attributes || []).map((attribute, index) => ({ id: index, name: attribute.name, taxonomy: null, hasVariations: true, terms: attribute.values.map((value, valueIndex) => ({ id: valueIndex, name: value, slug: value, default: valueIndex === 0 })) })),
    ],
    prices: price ? { value: price, regularValue: price, saleValue: null, minValue: price, maxValue: price, currencyCode: "IRR", currencySymbol: "تومان", minorUnit: 0 } : null,
    averageRating: "0",
    reviewCount: 0,
    isPurchasable: true,
    isInStock: item.variants?.length ? item.variants.some((variant) => variant.enabled !== false && (variant.stockQty || 0) > 0) : (item.trackInventory ? (item.stockQty || 0) > 0 : true),
    hasOptions: Boolean(item.attributes?.length),
    shopUrl: item.shopUrl || "",
    variants: item.variants?.map((variant, index) => ({ id: variant._id || variant.sku || String(index), options: variant.options || [], price: variant.price, compareAtPrice: variant.compareAtPrice, stockQty: variant.stockQty || 0, enabled: variant.enabled !== false })),
  };
}

export async function fetchStorefrontProducts(): Promise<ShopProduct[]> {
  try {
    const response = await fetch(`${getApiBase()}/shop/products?status=published&limit=1000`, { cache: "no-store" });
    if (!response.ok) return [];
    const payload = await response.json() as { items?: BackendProduct[] } | BackendProduct[];
    const items = Array.isArray(payload) ? payload : payload.items || [];
    return items.map(normalizeStorefrontProduct);
  } catch {
    return [];
  }
}
