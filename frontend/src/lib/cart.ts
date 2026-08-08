export type CartItem = {
  productId?: string;
  slug: string;
  name: string;
  image: string;
  qty: number;
  unitPrice: number;
};

const KEY = "choobohonar_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("choobohonar:cart"));
}

export const cartStore = {
  get: read,
  count(): number {
    return read().reduce((sum, item) => sum + item.qty, 0);
  },
  subtotal(): number {
    return read().reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  },
  add(item: Omit<CartItem, "qty"> & { qty?: number }) {
    const items = read();
    const idx = items.findIndex((x) => x.slug === item.slug);
    if (idx >= 0) {
      items[idx].qty += item.qty ?? 1;
    } else {
      items.push({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        image: item.image,
        unitPrice: item.unitPrice,
        qty: item.qty ?? 1,
      });
    }
    write(items);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("choobohonar:cart-add", {
          detail: { slug: item.slug, name: item.name },
        }),
      );
    }
  },
  setQty(slug: string, qty: number) {
    const items = read()
      .map((item) => (item.slug === slug ? { ...item, qty } : item))
      .filter((item) => item.qty > 0);
    write(items);
  },
  remove(slug: string) {
    write(read().filter((item) => item.slug !== slug));
  },
  clear() {
    write([]);
  },
};

/** Default unit price when product has no price in catalog (تومان). */
export const DEFAULT_UNIT_PRICE = 12_500_000;
