"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  ROOM_LABELS,
  STATUS_LABELS,
  isProductInStock,
  shopApi,
  type OrderStats,
  type ShopInvoice,
  type ShopOrder,
  type ShopProduct,
  type ShopProductStatusFilter,
  type ShopRoom,
  type ShopStats,
  type ShopSuggestionGroup,
} from "@/lib/shop-api";
import CampaignBannersPanel from "@/components/shop/CampaignBannersPanel";

type Tab = "products" | "orders" | "proformas" | "invoices";

const ROOM_ORDER = Object.keys(ROOM_LABELS) as ShopRoom[];

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

function isTab(v: string | null): v is Tab {
  return v === "products" || v === "orders" || v === "proformas" || v === "invoices";
}

function isRoom(v: string | null): v is ShopRoom {
  return Boolean(v && v in ROOM_LABELS);
}

function isProductStatusFilter(v: string | null): v is ShopProductStatusFilter {
  return v === "published" || v === "draft" || v === "archived" || v === "unpublished";
}

type ProductGroup = {
  room: string;
  roomLabel: string;
  categories: { category: string; items: ShopProduct[] }[];
  count: number;
};

function groupByRoomAndCategory(products: ShopProduct[]): ProductGroup[] {
  const roomMap = new Map<string, Map<string, ShopProduct[]>>();

  for (const p of products) {
    const room = p.room || "other";
    const category = p.category?.trim() || "بدون دسته";
    if (!roomMap.has(room)) roomMap.set(room, new Map());
    const cats = roomMap.get(room)!;
    if (!cats.has(category)) cats.set(category, []);
    cats.get(category)!.push(p);
  }

  const orderedRooms = [
    ...ROOM_ORDER.filter((r) => roomMap.has(r)),
    ...[...roomMap.keys()].filter((r) => !(r in ROOM_LABELS)).sort(),
  ];

  return orderedRooms.map((room) => {
    const cats = roomMap.get(room)!;
    const categories = [...cats.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "fa"))
      .map(([category, items]) => ({
        category,
        items: items.sort((a, b) => a.name.localeCompare(b.name, "fa")),
      }));
    return {
      room,
      roomLabel: ROOM_LABELS[room as ShopRoom] || room,
      categories,
      count: categories.reduce((n, c) => n + c.items.length, 0),
    };
  });
}

export default function ShopAdminPage({ productsOnly = false }: { productsOnly?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const roomParam = searchParams.get("room");
  const statusParam = searchParams.get("status");
  const requestedTab: Tab = isTab(tabParam) ? tabParam : roomParam ? "products" : "orders";
  // Products have one canonical workspace: مدیریت آثار ← محصولات.
  const tab: Tab = productsOnly ? "products" : requestedTab === "products" ? "orders" : requestedTab;
  const activeRoom = isRoom(roomParam) ? roomParam : "";
  const activeProductStatus = isProductStatusFilter(statusParam) ? statusParam : "";

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [stats, setStats] = useState<ShopStats | null>(null);
  const [suggestions, setSuggestions] = useState<ShopSuggestionGroup[]>([]);
  const [orders, setOrders] = useState<ShopOrder[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [invoices, setInvoices] = useState<ShopInvoice[]>([]);
  const [q, setQ] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [collapsedRooms, setCollapsedRooms] = useState<Record<string, boolean>>(
    {},
  );
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [stockBusyId, setStockBusyId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(),
  );
  const [bulkStockBusy, setBulkStockBusy] = useState(false);
  const [deleteBusyId, setDeleteBusyId] = useState("");
  const [bannerOpen, setBannerOpen] = useState(false);

  function importPrices(file: File) {
    setImporting(true); setImportProgress(0); setError(""); setMessage("");
    const request = new XMLHttpRequest();
    request.open("POST", "/admin/api/shop/products/import-price");
    request.upload.onprogress = (event) => { if (event.lengthComputable) setImportProgress(Math.round((event.loaded / event.total) * 100)); };
    request.onload = () => {
      setImporting(false); setImportProgress(100);
      try { const result = JSON.parse(request.responseText); if (request.status >= 200 && request.status < 300) { setMessage(`قیمت: ${result.updated} به‌روزرسانی، ${result.unchanged || 0} بدون تغییر، ${result.skipped} رد شد.`); void loadProducts(); } else setError(result.message || "ورود فایل ناموفق بود"); }
      catch { setError("پاسخ ورود فایل معتبر نیست"); }
    };
    request.onerror = () => { setImporting(false); setError("ارتباط با سرویس فروشگاه برقرار نشد"); };
    const data = new FormData(); data.append("file", file); request.send(data);
  }

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function setTab(next: Tab) {
    updateParams((params) => {
      if (next === "orders") params.delete("tab");
      else params.set("tab", next);
      if (next !== "products") {
        params.delete("room");
        params.delete("status");
      }
    });
  }

  function setRoomFilter(room: ShopRoom | "") {
    updateParams((params) => {
      params.set("tab", "products");
      if (room) params.set("room", room);
      else params.delete("room");
    });
  }

  function setProductStatusFilter(status: ShopProductStatusFilter | "") {
    updateParams((params) => {
      params.set("tab", "products");
      if (status) params.set("status", status);
      else params.delete("status");
    });
  }

  const productGroups = useMemo(
    () => groupByRoomAndCategory(products),
    [products],
  );

  const loadProducts = useCallback(async () => {
    const list = await shopApi.list({
      q: q || undefined,
      room: activeRoom || undefined,
      status: activeProductStatus || undefined,
      limit: 1000,
    });
    setProducts(list.items);
    setProductTotal(list.total);
    setSelectedProductIds((current) => {
      const visibleIds = new Set(list.items.map((product) => product._id));
      return new Set([...current].filter((id) => visibleIds.has(id)));
    });

    const [statsResult, suggestionsResult] = await Promise.allSettled([
      shopApi.stats(),
      shopApi.suggestions(),
    ]);
    if (statsResult.status === "fulfilled") setStats(statsResult.value);
    if (suggestionsResult.status === "fulfilled") {
      setSuggestions(suggestionsResult.value.items);
    }
  }, [q, activeRoom, activeProductStatus]);

  const loadOrders = useCallback(async () => {
    const [list, st] = await Promise.all([
      shopApi.orders.list({
        status: orderStatus || undefined,
        q: q || undefined,
        kind: tab === "proformas" ? "proforma" : "online",
        limit: 40,
      }),
      shopApi.orders.stats(),
    ]);
    setOrders(list.items);
    setOrderStats(st);
  }, [q, orderStatus, tab]);

  const loadInvoices = useCallback(async () => {
    const res = await shopApi.invoices.list({ q: q || undefined, kind: "invoice", limit: 40 });
    setInvoices(res.items);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        if (tab === "products") await loadProducts();
        if (tab === "orders" || tab === "proformas") await loadOrders();
        if (tab === "invoices") await loadInvoices();
      } catch (e) {
        if (!cancelled) {
          console.error("[admin/shop]", tab, e);
          setError(e instanceof Error ? e.message : "خطا در دریافت داده");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, loadProducts, loadOrders, loadInvoices]);

  async function onSeed(replaceAll = false) {
    if (replaceAll && !window.confirm("تمام محصولات فعلی فروشگاه حذف و فقط کاتالوگ جدید جایگزین شود؟ این عمل قابل بازگشت نیست.")) return;
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await shopApi.seed(replaceAll, replaceAll);
      setMessage(
        res.skipped
          ? res.message || "کاتالوگ از قبل موجود است"
          : `${res.replaced ? "کاتالوگ قبلی جایگزین شد" : "کاتالوگ سینک شد"}: ${res.upserted ?? res.total ?? 0} محصول`,
      );
      await loadProducts();
    } catch (e) {
      console.error("[admin/shop] seed failed:", e);
      setError(e instanceof Error ? e.message : "خطا در سینک کاتالوگ");
    } finally {
      setBusy(false);
    }
  }

  async function updateSelectedStock(inStock: boolean) {
    const ids = [...selectedProductIds];
    if (!ids.length) return;
    const action = inStock ? "موجود" : "ناموجود";
    if (!window.confirm(`${ids.length} محصول انتخاب‌شده ${action} شوند؟`)) return;
    setBulkStockBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await shopApi.updateBulkStock(ids, inStock);
      setMessage(`${result.updated} محصول ${action} شد.`);
      setSelectedProductIds(new Set());
      await loadProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تغییر گروهی موجودی ناموفق بود");
    } finally {
      setBulkStockBusy(false);
    }
  }

  function toggleProductSelection(id: string, selected: boolean) {
    setSelectedProductIds((current) => {
      const next = new Set(current);
      if (selected) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleAllProducts(selected: boolean) {
    setSelectedProductIds(selected ? new Set(products.map((product) => product._id)) : new Set());
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "orders", label: "سفارشات آنلاین" },
    { id: "proformas", label: "پیش‌فاکتورها" },
    { id: "invoices", label: "فاکتورها" },
  ];

  return (
    <div className="relative min-h-screen bg-paper">
      <div
        className="pointer-events-none absolute inset-0 brandbook-grid opacity-40"
        aria-hidden
      />

      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="eyebrow text-brick">{productsOnly ? "PRODUCT CATALOG" : "Shop"}</p>
            <h1 className="mt-1 text-2xl font-light text-forest">{productsOnly ? "مدیریت محصولات" : "فروشگاه"}</h1>
          </div>
          {tab === "products" ? (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSeed()}
                disabled={busy}
                className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs text-forest/70 disabled:opacity-50"
              >
                سینک کامل وردپرس
              </button>
              <button
                type="button"
                onClick={() => onSeed(true)}
                disabled={busy}
                className="rounded-xl border border-brick/20 bg-white px-3 py-2 text-xs text-brick disabled:opacity-50"
              >
                جایگزینی کامل با وردپرس
              </button>
              <button
                type="button"
                onClick={() => setBannerOpen(true)}
                className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs text-forest/70"
              >
                بنر کمپین‌های محصول
              </button>
              <Link
                href="/admin/manage/products/new"
                className="rounded-xl bg-forest px-3 py-2 text-xs text-peach"
              >
                محصول جدید
              </Link>
            </div>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl space-y-6 px-5 py-8 sm:px-8">
        {!productsOnly && <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                tab === t.id
                  ? "bg-forest text-peach"
                  : "border border-forest/10 bg-white text-forest/60 hover:bg-forest/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>}

        {message ? (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </p>
        ) : null}
        {error ? <p className="text-sm text-brick">{error}</p> : null}

        <div className="flex flex-wrap gap-2">
          {tab === "products" ? <><a href="/admin/api/shop/products/export-price" className="rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm text-forest/70 hover:border-forest/35">دریافت فایل قیمت</a><label className="cursor-pointer rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm text-forest/70"><input type="file" accept=".xlsx" className="sr-only" disabled={importing} onChange={(event) => { const file = event.target.files?.[0]; if (file) importPrices(file); event.currentTarget.value = ""; }} />{importing ? `در حال ورود ${importProgress}٪` : "آپلود قیمت‌های ویرایش‌شده"}</label></> : null}
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={
              tab === "products"
                ? "جستجوی محصول…"
                : tab === "invoices"
                  ? "جستجوی فاکتور / سفارش / مشتری"
                  : "جستجوی شماره / نام / تلفن"
            }
            className="w-full max-w-md rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm"
          />
          {tab === "orders" || tab === "proformas" ? (
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm"
            >
              <option value="">همه وضعیت‌ها</option>
              {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          ) : null}
        </div>
        {importing ? <div className="h-2 overflow-hidden rounded-full bg-forest/10"><div className="h-full bg-forest transition-[width]" style={{ width: `${importProgress}%` }} /></div> : null}

        {tab === "orders" || tab === "proformas" ? (
          <>
            {tab === "orders" && orderStats ? (
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {[
                  ["کل سفارش‌ها", orderStats.total],
                  ["پرداخت‌شده", orderStats.paid],
                  ["آماده‌سازی", orderStats.preparing],
                  ["ارسال", orderStats.shipping],
                  ["تحویل", orderStats.delivered],
                  ["در انتظار پرداخت", orderStats.pendingPay],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-2xl border border-forest/10 bg-white/70 px-4 py-3"
                  >
                    <p className="text-[11px] text-forest/45">{label}</p>
                    <p className="mt-1 text-xl font-light text-forest">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {tab === "orders" && orderStats ? (
              <p className="text-sm text-forest/55">
                درآمد پرداخت‌شده:{" "}
                <span className="text-forest">
                  {formatPrice(orderStats.revenue)}
                </span>
              </p>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white/80">
              <table className="w-full text-right text-sm">
                <thead className="border-b border-forest/10 text-xs text-forest/45">
                  <tr>
                    <th className="px-4 py-3 font-medium">{tab === "proformas" ? "پیش‌فاکتور" : "سفارش"}</th>
                    <th className="px-4 py-3 font-medium">مشتری</th>
                    <th className="px-4 py-3 font-medium">مبلغ</th>
                    <th className="px-4 py-3 font-medium">وضعیت</th>
                    <th className="px-4 py-3 font-medium">پرداخت</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-forest/40"
                      >
                        در حال بارگذاری…
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-forest/40"
                      >
                        {tab === "proformas" ? "پیش‌فاکتوری نیست" : "سفارشی نیست"}
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-t border-forest/5 hover:bg-forest/[0.02]"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={order.proformaId ? `/admin/shop/invoices/${order.proformaId}` : `/admin/shop/orders/${order._id}`}
                            className="font-medium text-forest hover:underline"
                            dir="ltr"
                          >
                            {order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-forest/70">
                          <div>{order.customer.name}</div>
                          <div
                            className="text-xs text-forest/40"
                            dir="ltr"
                          >
                            {order.customer.phone}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {formatPrice(order.amounts.total)}
                        </td>
                        <td className="px-4 py-3">
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </td>
                        <td className="px-4 py-3 text-xs text-forest/55">
                          {order.payment.status}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        {tab === "invoices" ? (
          <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white/80">
            <table className="w-full text-right text-sm">
              <thead className="border-b border-forest/10 text-xs text-forest/45">
                <tr>
                  <th className="px-4 py-3 font-medium">فاکتور</th>
                  <th className="px-4 py-3 font-medium">سفارش</th>
                  <th className="px-4 py-3 font-medium">مشتری</th>
                  <th className="px-4 py-3 font-medium">مبلغ</th>
                  <th className="px-4 py-3 font-medium">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-forest/40"
                    >
                      در حال بارگذاری…
                    </td>
                  </tr>
                ) : invoices.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-forest/40"
                    >
                      فاکتوری نیست
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="border-t border-forest/5 hover:bg-forest/[0.02]"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/shop/invoices/${inv._id}`}
                          className="text-forest hover:underline"
                          dir="ltr"
                        >
                          {inv.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3" dir="ltr">
                        {inv.orderNumber}
                      </td>
                      <td className="px-4 py-3 text-forest/70">
                        {inv.customer.name}
                      </td>
                      <td className="px-4 py-3">
                        {formatPrice(inv.amounts.total)}
                      </td>
                      <td className="px-4 py-3 text-xs text-forest/45">
                        {new Date(inv.issuedAt).toLocaleDateString("fa-IR")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === "products" ? (
          <>
            {stats ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["کل", stats.total],
                  ["منتشر شده", stats.published],
                  ["منتشر نشده", stats.unpublished],
                  ["پیشنهادی", stats.suggested],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-2xl border border-forest/10 bg-white/70 px-4 py-3"
                  >
                    <p className="text-[11px] text-forest/45">{label}</p>
                    <p className="mt-1 text-xl font-light text-forest">{value}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {[
                { value: "", label: "همه وضعیت‌ها", count: stats?.total },
                { value: "published", label: "منتشر شده", count: stats?.published },
                { value: "unpublished", label: "منتشر نشده", count: stats?.unpublished },
              ].map(({ value, label, count }) => (
                <button
                  key={value || "all-statuses"}
                  type="button"
                  onClick={() => setProductStatusFilter(value as ShopProductStatusFilter | "")}
                  className={`rounded-xl px-3 py-1.5 text-xs transition ${
                    activeProductStatus === value
                      ? "bg-forest text-peach"
                      : "border border-forest/10 bg-white text-forest/60 hover:bg-forest/5"
                  }`}
                >
                  {label}
                  {count != null ? ` (${count})` : ""}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRoomFilter("")}
                className={`rounded-xl px-3 py-1.5 text-xs transition ${
                  !activeRoom
                    ? "bg-forest text-peach"
                    : "border border-forest/10 bg-white text-forest/60 hover:bg-forest/5"
                }`}
              >
                همه فضاها
                {stats ? ` (${stats.total})` : ""}
              </button>
              {(stats?.byRoom?.length
                ? stats.byRoom
                    .slice()
                    .sort(
                      (a, b) =>
                        ROOM_ORDER.indexOf(a.room as ShopRoom) -
                        ROOM_ORDER.indexOf(b.room as ShopRoom),
                    )
                : ROOM_ORDER.map((room) => ({ room, count: 0 }))
              ).map(({ room, count }) => (
                <button
                  key={room}
                  type="button"
                  onClick={() => setRoomFilter(room as ShopRoom)}
                  className={`rounded-xl px-3 py-1.5 text-xs transition ${
                    activeRoom === room
                      ? "bg-forest text-peach"
                      : "border border-forest/10 bg-white text-forest/60 hover:bg-forest/5"
                  }`}
                >
                  {ROOM_LABELS[room as ShopRoom] || room}
                  {count ? ` (${count})` : ""}
                </button>
              ))}
            </div>

            {loading ? (
              <p className="py-10 text-center text-sm text-forest/40">
                در حال بارگذاری…
              </p>
            ) : productGroups.length === 0 ? (
              <p className="py-10 text-center text-sm text-forest/40">
                محصولی نیست
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-medium text-forest">
                    محصولات بر اساس فضا و دسته
                  </h2>
                  <span className="text-xs text-forest/40">
                    {productTotal} مورد
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-xl border border-forest/10 bg-white/75 px-4 py-3 text-xs text-forest">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-forest"
                      checked={products.length > 0 && selectedProductIds.size === products.length}
                      onChange={(event) => toggleAllProducts(event.target.checked)}
                    />
                    انتخاب همه نتایج
                  </label>
                  {selectedProductIds.size ? <>
                    <span className="text-forest/55">{selectedProductIds.size} محصول انتخاب شده</span>
                    <button type="button" disabled={bulkStockBusy} onClick={() => updateSelectedStock(true)} className="rounded-lg bg-forest px-3 py-2 text-paper disabled:opacity-50">موجود کردن</button>
                    <button type="button" disabled={bulkStockBusy} onClick={() => updateSelectedStock(false)} className="rounded-lg border border-brick/25 px-3 py-2 text-brick disabled:opacity-50">ناموجود کردن</button>
                    <button type="button" disabled={bulkStockBusy} onClick={() => setSelectedProductIds(new Set())} className="text-forest/45 underline disabled:opacity-50">لغو انتخاب</button>
                  </> : null}
                </div>

                {productGroups.map((group) => {
                  const collapsed = collapsedRooms[group.room] === true;
                  return (
                    <section
                      key={group.room}
                      className="overflow-hidden rounded-2xl border border-forest/10 bg-white/80"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setCollapsedRooms((prev) => ({
                            ...prev,
                            [group.room]: !collapsed,
                          }))
                        }
                        className="flex w-full items-center justify-between gap-3 border-b border-forest/10 bg-forest/[0.03] px-4 py-3 text-right"
                      >
                        <div>
                          <h3 className="text-sm font-medium text-forest">
                            {group.roomLabel}
                          </h3>
                          <p className="mt-0.5 text-[11px] text-forest/45">
                            {group.categories.length} دسته · {group.count} محصول
                          </p>
                        </div>
                        <span className="text-xs text-forest/40">
                          {collapsed ? "باز کردن" : "بستن"}
                        </span>
                      </button>

                      {!collapsed
                        ? group.categories.map((cat) => (
                            <div key={cat.category}>
                              <div className="flex items-center justify-between border-b border-forest/8 bg-paper/70 px-4 py-2">
                                <h4 className="text-xs font-medium text-forest/80">
                                  {cat.category}
                                </h4>
                                <span className="text-[11px] text-forest/40">
                                  {cat.items.length} مورد
                                </span>
                              </div>
                              <table className="w-full text-right text-sm">
                                <thead className="sr-only">
                                  <tr>
                                    <th>انتخاب</th>
                                    <th>نام</th>
                                    <th>قیمت</th>
                                    <th>وضعیت</th>
                                    <th>موجودی</th>
                                    <th>عملیات</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {cat.items.map((p) => (
                                    <tr
                                      key={p._id}
                                      className="border-t border-forest/5 hover:bg-forest/[0.02]"
                                    >
                                      <td className="px-4 py-3">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 cursor-pointer accent-forest"
                                          aria-label={`انتخاب ${p.name}`}
                                          checked={selectedProductIds.has(p._id)}
                                          onChange={(event) => toggleProductSelection(p._id, event.target.checked)}
                                        />
                                      </td>
                                      <td className="px-4 py-3 font-medium text-forest">
                                        {p.name}
                                      </td>
                                      <td className="px-4 py-3 text-forest/70">
                                        {p.price != null
                                          ? formatPrice(p.price)
                                          : "—"}
                                      </td>
                                      <td className="px-4 py-3 text-forest/60">
                                        {STATUS_LABELS[p.status] || p.status}
                                      </td>
                                      <td className="px-4 py-3">
                                        <input
                                          type="checkbox"
                                          className="h-4 w-4 cursor-pointer accent-forest"
                                          aria-label={`موجود در فروشگاه: ${p.name}`}
                                          checked={isProductInStock(p)}
                                          disabled={stockBusyId === p._id}
                                          onChange={async (event) => {
                                            const inStock = event.target.checked;
                                            setStockBusyId(p._id);
                                            setError("");
                                            try {
                                              const updated = await shopApi.update(p._id, { inStock });
                                              setProducts((current) =>
                                                current.map((item) => (item._id === p._id ? { ...item, ...updated } : item)),
                                              );
                                            } catch (err) {
                                              setError(err instanceof Error ? err.message : "تغییر موجودی ناموفق بود");
                                            } finally {
                                              setStockBusyId("");
                                            }
                                          }}
                                        />
                                      </td>
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                          <Link
                                            href={`/admin/manage/products/${p._id}`}
                                            className="text-forest hover:underline"
                                          >
                                            ویرایش
                                          </Link>
                                          <button
                                            type="button"
                                            title="حذف محصول"
                                            aria-label={`حذف ${p.name}`}
                                            disabled={deleteBusyId === p._id}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-forest/45 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                                            onClick={async () => {
                                              if (!window.confirm(`محصول «${p.name}» حذف شود؟`)) return;
                                              setDeleteBusyId(p._id);
                                              setError("");
                                              try {
                                                await shopApi.remove(p._id);
                                                setProducts((current) => current.filter((item) => item._id !== p._id));
                                                setProductTotal((total) => Math.max(0, total - 1));
                                              } catch (err) {
                                                setError(err instanceof Error ? err.message : "حذف محصول ناموفق بود");
                                              } finally {
                                                setDeleteBusyId("");
                                              }
                                            }}
                                          >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                                              <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12Z" strokeLinecap="round" strokeLinejoin="round" />
                                              <path d="M10 11v6M14 11v6" strokeLinecap="round" />
                                            </svg>
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ))
                        : null}
                    </section>
                  );
                })}
              </div>
            )}

            {suggestions.length > 0 ? (
              <section className="rounded-2xl border border-forest/10 bg-white/80 p-5">
                <h2 className="text-sm font-medium text-forest">
                  پیشنهادات تکمیل کاتالوگ
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {suggestions.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl border border-forest/8 bg-paper/60 p-4"
                    >
                      <h3 className="font-medium text-forest">{g.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-forest/55">
                        {g.description}
                      </p>
                      {g.actionHref ? (
                        <Link
                          href={productsOnly ? g.actionHref.replace("/admin/shop", "/admin/manage/products") : g.actionHref}
                          className="mt-3 inline-block text-xs text-brick hover:underline"
                        >
                          مشاهده
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
      {bannerOpen ? <CampaignBannersPanel onClose={() => setBannerOpen(false)} /> : null}
    </div>
  );
}
