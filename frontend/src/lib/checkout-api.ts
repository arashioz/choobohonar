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

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `خطا ${res.status}`);
  }
  return res.json() as Promise<T>;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `خطا ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const checkoutApi = {
  createOrder: (input: {
    items: CartItem[];
    customer: CheckoutCustomer;
    shipping: CheckoutShipping;
    shippingFee?: number;
  }) => post<ShopOrder>("/shop/orders", input),
  pay: (orderId: string, simulate: "success" | "fail" = "success") =>
    post<ShopOrder>(`/shop/orders/${orderId}/pay`, { simulate }),
  get: (orderId: string) => getJson<ShopOrder>(`/shop/orders/${orderId}`),
};
