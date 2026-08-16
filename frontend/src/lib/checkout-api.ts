import { getApiBase } from "@/lib/api-base";
import type { CartItem } from "@/lib/cart";

export type CheckoutCustomer = {
  name: string;
  phone: string;
  email?: string;
};

export type CheckoutShipping = {
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  lat: number;
  lng: number;
  mapNote?: string;
};

export type ShopOrder = {
  _id: string;
  orderNumber: string;
  status: string;
  items: CartItem[];
  customer: CheckoutCustomer;
  shipping: CheckoutShipping;
  payment: {
    method: string;
    status: string;
    paidAt?: string;
    mockRef?: string;
  };
  amounts: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };
  invoiceId?: string;
  createdAt?: string;
  statusHistory?: {
    from: string;
    to: string;
    at: string;
    note?: string;
    by?: string;
  }[];
};

/** Parse NestJS / plain-text API error bodies into a readable Persian message. */
export function formatApiError(text: string, status: number): string {
  const raw = text?.trim();
  if (!raw) return `خطای سرور (${status})`;

  try {
    const json = JSON.parse(raw) as {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };
    if (Array.isArray(json.message)) {
      return json.message.join(" · ");
    }
    if (typeof json.message === "string" && json.message) {
      return json.message;
    }
    if (json.error) return String(json.error);
  } catch {
    // not JSON
  }

  if (raw.length > 280) return `خطای سرور (${status})`;
  return raw;
}

function toOrderPayload(input: {
  items: CartItem[];
  customer: CheckoutCustomer;
  shipping: CheckoutShipping;
  shippingFee?: number;
}) {
  return {
    items: input.items.map((item) => ({
      slug: item.slug,
      name: item.name,
      image: item.image || undefined,
      qty: Number(item.qty) || 1,
      unitPrice: Number(item.unitPrice) || 0,
      ...(item.productId ? { productId: item.productId } : {}),
    })),
    customer: {
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      ...(input.customer.email?.trim()
        ? { email: input.customer.email.trim() }
        : {}),
    },
    shipping: {
      address: input.shipping.address.trim(),
      city: input.shipping.city.trim(),
      province: input.shipping.province.trim(),
      lat: Number(input.shipping.lat),
      lng: Number(input.shipping.lng),
      ...(input.shipping.postalCode?.trim()
        ? { postalCode: input.shipping.postalCode.trim() }
        : {}),
      ...(input.shipping.mapNote?.trim()
        ? { mapNote: input.shipping.mapNote.trim() }
        : {}),
    },
    shippingFee: Number(input.shippingFee) || 0,
  };
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(formatApiError(text, res.status));
  }
  return res.json() as Promise<T>;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(formatApiError(text, res.status));
  }
  return res.json() as Promise<T>;
}

export const checkoutApi = {
  createOrder: (input: {
    items: CartItem[];
    customer: CheckoutCustomer;
    shipping: CheckoutShipping;
    shippingFee?: number;
  }) => post<ShopOrder>("/shop/orders", toOrderPayload(input)),
  pay: (orderId: string, simulate: "success" | "fail" = "success") =>
    post<ShopOrder>(`/shop/orders/${orderId}/pay`, { simulate }),
  get: (orderId: string) => getJson<ShopOrder>(`/shop/orders/${orderId}`),
};
