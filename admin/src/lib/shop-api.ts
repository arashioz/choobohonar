export type ShopRoom =
  | "living"
  | "bedroom"
  | "bedding"
  | "dining"
  | "decor"
  | "carpet"
  | "lighting"
  | "dishes";

export type ShopProductStatus = "draft" | "published" | "archived";

export type ShopProduct = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  room: ShopRoom;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery: string[];
  shopUrl?: string;
  finishes: string[];
  status: ShopProductStatus;
  featured: boolean;
  suggested: boolean;
  suggestionNote?: string;
  series?: string;
  price?: number;
  compareAtPrice?: number;
  stockQty: number;
  trackInventory: boolean;
  dimensions?: { width?: number; depth?: number; height?: number };
  specs: { label: string; value: string }[];
  highlights: { title: string; description: string }[];
  attributes: { name: string; values: string[]; required: boolean }[];
  variants: { sku?: string; options: { name: string; value: string }[]; price?: number; compareAtPrice?: number; stockQty: number; image?: string; enabled: boolean }[];
  sortOrder: number;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ShopStats = {
  total: number;
  published: number;
  draft: number;
  archived: number;
  featured: number;
  suggested: number;
  missingImage: number;
  missingShopUrl: number;
  byRoom: { room: string; count: number }[];
};

export type ShopSuggestionGroup = {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  actionHref?: string;
  products: Partial<ShopProduct>[];
};

export const ROOM_LABELS: Record<ShopRoom, string> = {
  living: "نشیمن",
  bedroom: "اتاق خواب",
  bedding: "کالای خواب",
  dining: "غذاخوری",
  decor: "دکوراتیو",
  carpet: "فرش",
  lighting: "روشنایی",
  dishes: "ظروف",
};

export const STATUS_LABELS: Record<ShopProductStatus, string> = {
  draft: "پیش‌نویس",
  published: "منتشر شده",
  archived: "آرشیو",
};

async function shopFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `/admin/api/shop${path}`;
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    const message = formatShopApiError(text, res.status);
    console.error("[admin/shop-api]", {
      method: options?.method || "GET",
      url,
      status: res.status,
      body: text.slice(0, 1000),
      message,
    });
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

function formatShopApiError(text: string, status: number): string {
  const raw = text?.trim();
  if (!raw) return `خطای ${status}`;

  try {
    const json = JSON.parse(raw) as {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };
    if (Array.isArray(json.message)) return json.message.join(" · ");
    if (typeof json.message === "string" && json.message) return json.message;
    if (json.error) return String(json.error);
  } catch {
    // plain text
  }

  if (status === 401) return "نشست منقضی شده — دوباره وارد شوید";
  if (status === 403) return "دسترسی مجاز نیست";
  if (raw.length > 280) return `خطای سرور (${status})`;
  return raw;
}

export const shopApi = {
  list: (params: Record<string, string | number | undefined> = {}) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== "") qs.set(k, String(v));
    });
    const q = qs.toString();
    return shopFetch<{
      items: ShopProduct[];
      total: number;
      page: number;
      limit: number;
      pages: number;
    }>(`/products${q ? `?${q}` : ""}`);
  },
  get: (id: string) => shopFetch<ShopProduct>(`/products/${id}`),
  create: (body: Partial<ShopProduct>) =>
    shopFetch<ShopProduct>("/products", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Partial<ShopProduct>) =>
    shopFetch<ShopProduct>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    shopFetch<{ ok: true }>(`/products/${id}`, { method: "DELETE" }),
  stats: () => shopFetch<ShopStats>("/stats"),
  suggestions: () =>
    shopFetch<{ items: ShopSuggestionGroup[]; count: number }>("/suggestions"),
  seed: (force = false) =>
    shopFetch<{
      ok: boolean;
      skipped?: boolean;
      message?: string;
      total?: number;
      upserted?: number;
      modified?: number;
    }>("/products/seed", {
      method: "POST",
      body: JSON.stringify({ force }),
    }),
  categories: () =>
    shopFetch<{ category: string; room: string; count: number }[]>(
      "/categories",
    ),

  orders: {
    list: (params: Record<string, string | number | undefined> = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") qs.set(k, String(v));
      });
      const q = qs.toString();
      return shopFetch<{
        items: ShopOrder[];
        total: number;
        page: number;
        pages: number;
      }>(`/orders${q ? `?${q}` : ""}`);
    },
    get: (id: string) => shopFetch<ShopOrder>(`/orders/${id}`),
    updateStatus: (id: string, status: string, note?: string) =>
      shopFetch<ShopOrder>(`/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      }),
    issueInvoice: (id: string) =>
      shopFetch<ShopInvoice>(`/orders/${id}/invoice`, { method: "POST" }),
    stats: () => shopFetch<OrderStats>("/orders/stats"),
  },

  invoices: {
    list: (params: Record<string, string | number | undefined> = {}) => {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== "") qs.set(k, String(v));
      });
      const q = qs.toString();
      return shopFetch<{
        items: ShopInvoice[];
        total: number;
        page: number;
        pages: number;
      }>(`/invoices${q ? `?${q}` : ""}`);
    },
    get: (id: string) => shopFetch<ShopInvoice>(`/invoices/${id}`),
  },
};

export type ShopOrder = {
  _id: string;
  orderNumber: string;
  status: string;
  items: {
    slug: string;
    name: string;
    image?: string;
    qty: number;
    unitPrice: number;
  }[];
  customer: { name: string; phone: string; email?: string };
  shipping: {
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    lat?: number;
    lng?: number;
    mapNote?: string;
  };
  payment: { method: string; status: string; paidAt?: string; mockRef?: string };
  amounts: { subtotal: number; shippingFee: number; total: number };
  invoiceId?: string;
  statusHistory?: {
    from: string;
    to: string;
    at: string;
    note?: string;
    by?: string;
  }[];
  createdAt?: string;
};

export type ShopInvoice = {
  _id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  issuedAt: string;
  status: string;
  customer: { name: string; phone: string; email?: string };
  shipping: {
    address: string;
    city: string;
    province: string;
    postalCode?: string;
  };
  items: {
    slug: string;
    name: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  amounts: { subtotal: number; shippingFee: number; total: number };
};

export type OrderStats = {
  total: number;
  paid: number;
  preparing: number;
  shipping: number;
  delivered: number;
  pendingPay: number;
  revenue: number;
  flow: string[];
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "فاکتور شده",
  paid: "پرداخت‌شده",
  preparing: "آماده‌سازی",
  shipping: "ارسال",
  delivered: "تحویل شده",
  cancelled: "لغو",
};
