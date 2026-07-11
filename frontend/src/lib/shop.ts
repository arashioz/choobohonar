import type { AnyProduct } from "@/data/products";

const SHOP_BASE = process.env.NEXT_PUBLIC_SHOP_URL?.replace(/\/$/, "") ?? "https://choobohonar.com";

export function getProductShopUrl(product: AnyProduct): string {
  if ("shopUrl" in product && product.shopUrl) return product.shopUrl;
  if (SHOP_BASE) return `${SHOP_BASE}/product/${encodeURIComponent(product.slug)}/`;
  return `/products/${product.slug}`;
}
