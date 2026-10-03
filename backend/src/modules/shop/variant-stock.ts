export type StockVariant = {
  sku?: string;
  options?: { name: string; value: string }[];
  price?: number;
  compareAtPrice?: number;
  stockQty?: number;
  image?: string;
  enabled?: boolean;
};

export type StockShape = {
  inStock?: boolean;
  trackInventory?: boolean;
  stockQty?: number;
  variants?: StockVariant[];
};

export function deriveInStock(product: StockShape): boolean {
  if (typeof product.inStock === 'boolean') return product.inStock;
  if (product.variants?.length) {
    return product.variants.some(
      (variant) => variant.enabled !== false && (variant.stockQty || 0) > 0,
    );
  }
  if (product.trackInventory) return (product.stockQty || 0) > 0;
  return true;
}

/**
 * Product-level stock no longer turns a variant back on.
 * enabled=false stays on the product and is treated as unavailable.
 */
export function applyInStockFlag<T extends StockShape>(
  product: T,
  inStock: boolean,
): T & { inStock: boolean; trackInventory: true; stockQty: number; variants: StockVariant[] } {
  let flooredSellable = false;
  const variants = (product.variants || []).map((variant) => {
    const sellable = variant.enabled !== false;
    const current = Number(variant.stockQty || 0);
    let stockQty = current;
    if (!inStock) {
      stockQty = 0;
    } else if (sellable && !flooredSellable) {
      stockQty = Math.max(current, 1);
      flooredSellable = true;
    }
    return {
      ...variant,
      options: (variant.options || []).map((option) => ({
        name: option.name,
        value: option.value,
      })),
      enabled: sellable,
      stockQty,
    };
  });

  return {
    ...product,
    inStock,
    trackInventory: true,
    stockQty: inStock ? Math.max(Number(product.stockQty || 0), 1) : 0,
    variants,
  };
}
