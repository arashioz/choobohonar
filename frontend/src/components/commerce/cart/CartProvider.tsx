"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ShopProduct } from "@/data/products";

const CART_STORAGE_KEY = "choobohonar:storefront-cart:v1";
const LEGACY_CART_STORAGE_KEY = "choobohonar_cart_v1";
const MAX_ITEM_QUANTITY = 20;

export type CartOption = {
  id: string;
  label: string;
  valueId: string;
  value: string;
};

export type CartItem = {
  key: string;
  productId: number;
  slug: string;
  name: string;
  category: string;
  image: string;
  unitPrice: number | null;
  currencySymbol: string;
  quantity: number;
  options: CartOption[];
};

export type CartItemInput = Omit<CartItem, "key" | "quantity" | "options"> & {
  quantity?: number;
  options?: CartOption[];
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addProduct: (product: ShopProduct, options?: CartOption[]) => void;
  addItem: (item: CartItemInput) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function announceCartAdd(slug: string, name: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("choobohonar:cart-add", { detail: { slug, name } }));
}

function createCartKey(productId: number, options: CartOption[]): string {
  const optionKey = [...options]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((option) => `${option.id}:${option.valueId}`)
    .join("|");
  return `${productId}::${optionKey}`;
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<CartItem>;
  return (
    typeof item.key === "string" &&
    typeof item.productId === "number" &&
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.category === "string" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
}

function readStoredCart(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return readLegacyCart();
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return readLegacyCart();
    const items = parsed
      .filter(isCartItem)
      .map((item) => ({
        ...item,
        quantity: Math.min(Math.max(Math.round(item.quantity), 1), MAX_ITEM_QUANTITY),
        options: Array.isArray(item.options) ? item.options : [],
      }));
    return items;
  } catch {
    return [];
  }
}

function readLegacyCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(LEGACY_CART_STORAGE_KEY);
    const legacy: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(legacy)) return [];
    return legacy.flatMap((value) => {
      if (!value || typeof value !== "object") return [];
      const item = value as { productId?: string; slug?: string; name?: string; image?: string; unitPrice?: number; qty?: number };
      if (!item.slug || !item.name) return [];
      const productId = numericProductId(item.productId || item.slug);
      const quantity = Math.min(Math.max(Math.round(Number(item.qty) || 1), 1), MAX_ITEM_QUANTITY);
      return [{ key: createCartKey(productId, []), productId, slug: item.slug, name: item.name, category: "محصولات", image: item.image || "", unitPrice: Number.isFinite(Number(item.unitPrice)) ? Number(item.unitPrice) : null, currencySymbol: "تومان", quantity, options: [] }];
    });
  } catch { return []; }
}

function numericProductId(value: string): number {
  const direct = Number(value);
  if (Number.isFinite(direct) && direct > 0) return direct;
  return [...value].reduce((hash, char) => ((hash * 31 + char.charCodeAt(0)) >>> 0), 7) || 1;
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
    // The legacy key is only a one-time migration path. Keeping it would make
    // removed items return on a later refresh or a subsequent add action.
    try {
      window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    } catch {
      // Storage may be unavailable; the in-memory cart remains usable.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Cart remains usable in memory when storage is blocked or unavailable.
    }
  }, [hydrated, items]);

  useEffect(() => {
    const syncCart = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) setItems(readStoredCart());
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    // Legacy product cards write synchronously to their established key.
    // Merge that data into the storefront cart for a single visible cart.
    const syncLegacyCart = () => {
      const legacyItems = readLegacyCart();
      try {
        window.localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
      } catch {
        // The merged in-memory cart will still update the UI.
      }
      setItems((current) => {
        const legacyByKey = new Map(legacyItems.map((item) => [item.key, item]));
        const merged = current.map((item) => {
          const legacy = legacyByKey.get(item.key);
          return legacy ? { ...item, ...legacy } : item;
        });
        const currentKeys = new Set(current.map((item) => item.key));
        const additions = legacyItems.filter((item) => !currentKeys.has(item.key));
        return additions.length ? [...merged, ...additions] : merged;
      });
    };
    window.addEventListener("choobohonar:cart", syncLegacyCart);
    return () => window.removeEventListener("choobohonar:cart", syncLegacyCart);
  }, []);

  const addProduct = useCallback((product: ShopProduct, options: CartOption[] = []) => {
    const key = createCartKey(product.id, options);
    const rawPrice = Number(product.prices?.value ?? 0);
    const unitPrice = Number.isFinite(rawPrice) && rawPrice > 0 ? rawPrice : null;

    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) {
        return current.map((item) =>
          item.key === key
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_ITEM_QUANTITY) }
            : item,
        );
      }

      return [
        ...current,
        {
          key,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          image: product.image,
          unitPrice,
          currencySymbol: product.prices?.currencySymbol || "تومان",
          quantity: 1,
          options,
        },
      ];
    });
    announceCartAdd(product.slug, product.name);
  }, []);

  const addItem = useCallback((input: CartItemInput) => {
    const options = input.options || [];
    const key = createCartKey(input.productId, options);
    setItems((current) => {
      const existing = current.find((item) => item.key === key);
      if (existing) return current.map((item) => item.key === key ? { ...item, quantity: Math.min(item.quantity + (input.quantity || 1), MAX_ITEM_QUANTITY) } : item);
      return [...current, { ...input, key, quantity: Math.min(Math.max(input.quantity || 1, 1), MAX_ITEM_QUANTITY), options }];
    });
    announceCartAdd(input.slug, input.name);
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    const nextQuantity = Math.min(Math.max(Math.round(quantity), 1), MAX_ITEM_QUANTITY);
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, quantity: nextQuantity } : item)),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice ?? 0) * item.quantity, 0);
    return { items, itemCount, subtotal, hydrated, addProduct, addItem, setQuantity, removeItem, clearCart };
  }, [addItem, addProduct, clearCart, hydrated, items, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
