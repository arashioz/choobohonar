import { productRooms } from "@/data/product-categories";
import type { AnyProduct, ProductRoom } from "@/data/products";

export const SHOP_BASE = process.env.NEXT_PUBLIC_SHOP_URL?.replace(/\/$/, "") ?? "https://choobohonar.com";

/** Main WooCommerce shop on choobohonar.com */
export function getShopUrl(): string {
  return `${SHOP_BASE}/shop/`;
}

/** Product-category archive for a top-level room (e.g. living → /product-category/livingroom/). */
export function getShopCategoryUrl(room: ProductRoom): string {
  const config = productRooms.find((entry) => entry.id === room);
  if (!config) return getShopUrl();
  const path = config.shopPath ?? config.wpSlug;
  return `${SHOP_BASE}/product-category/${path}/`;
}

export function getProductShopUrl(product: AnyProduct): string {
  if ("shopUrl" in product && product.shopUrl) return product.shopUrl;
  if (SHOP_BASE) return `${SHOP_BASE}/product/${encodeURIComponent(product.slug)}/`;
  return `/products/${product.slug}`;
}
