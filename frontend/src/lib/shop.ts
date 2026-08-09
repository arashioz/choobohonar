import type { AnyProduct, ProductRoom } from "@/data/products";

/** On-site product catalog (no external WooCommerce redirects). */
export function getShopUrl(): string {
  return "/products";
}

/** Filter catalog by room on this site. */
export function getShopCategoryUrl(room: ProductRoom): string {
  return `/products?room=${encodeURIComponent(room)}`;
}

/** Product detail page on this site. */
export function getProductShopUrl(product: AnyProduct | { slug: string }): string {
  return `/products/${product.slug}`;
}
