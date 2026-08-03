"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ShopProduct } from "@/data/products";

const CART_STORAGE_KEY = "choobohonar:storefront-cart:v1";
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

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  hydrated: boolean;
  addProduct: (product: ShopProduct, options?: CartOption[]) => void;
  setQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

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
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(isCartItem)
      .map((item) => ({
        ...item,
        quantity: Math.min(Math.max(Math.round(item.quantity), 1), MAX_ITEM_QUANTITY),
        options: Array.isArray(item.options) ? item.options : [],
      }));
  } catch {
    return [];
  }
}

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStoredCart());
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
    return { items, itemCount, subtotal, hydrated, addProduct, setQuantity, removeItem, clearCart };
  }, [addProduct, clearCart, hydrated, items, removeItem, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
