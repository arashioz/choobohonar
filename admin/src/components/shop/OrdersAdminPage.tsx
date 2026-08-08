"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ORDER_STATUS_LABELS,
  shopApi,
  type OrderStats,
  type ShopOrder,
} from "@/lib/shop-api";

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

export default function OrdersAdminPage() {
  const [items, setItems] = useState<ShopOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, st] = await Promise.all([
        shopApi.orders.list({ status: status || undefined, q: q || undefined, limit: 40 }),
        shopApi.orders.stats(),
      ]);
      setItems(list.items);
      setStats(st);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [q, status]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="relative min-h-screen bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />
      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="eyebrow text-brick">Orders</p>
            <h1 className="mt-1 text-2xl font-light text-forest">خریدهای آنلاین</h1>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/shop" className="rounded-xl border border-forest/10 px-3 py-2 text-xs text-forest/60">
              محصولات
            </Link>
            <Link href="/admin/shop/invoices" className="rounded-xl border border-forest/10 px-3 py-2 text-xs text-forest/60">
              فاکتورها
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {error ? <p className="mb-4 text-sm text-brick">{error}</p> : null}

        {stats ? (
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              ["کل سفارش‌ها", stats.total],
              ["پرداخت‌شده", stats.paid],
              ["آماده‌سازی", stats.preparing],
              ["ارسال", stats.shipping],
              ["تحویل", stats.delivered],
              ["در انتظار پرداخت", stats.pendingPay],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-2xl border border-forest/10 bg-white/70 px-4 py-3">
                <p className="text-[11px] text-forest/45">{label}</p>
                <p className="mt-1 text-xl font-light text-forest">{value}</p>
              </div>
            ))}
          </div>
        ) : null}
        {stats ? (
          <p className="mt-3 text-sm text-forest/55">
            درآمد پرداخت‌شده: <span className="text-forest">{formatPrice(stats.revenue)}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="جستجوی شماره / نام / تلفن"
            className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm"
          >
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-forest/10 bg-white/80">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-forest/10 text-xs text-forest/45">
              <tr>
                <th className="px-4 py-3 font-medium">سفارش</th>
                <th className="px-4 py-3 font-medium">مشتری</th>
                <th className="px-4 py-3 font-medium">مبلغ</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">پرداخت</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-forest/40">در حال بارگذاری…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-forest/40">سفارشی نیست</td></tr>
              ) : (
                items.map((order) => (
                  <tr key={order._id} className="border-t border-forest/5 hover:bg-forest/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/shop/orders/${order._id}`} className="font-medium text-forest hover:underline" dir="ltr">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-forest/70">
                      <div>{order.customer.name}</div>
                      <div className="text-xs text-forest/40" dir="ltr">{order.customer.phone}</div>
                    </td>
                    <td className="px-4 py-3">{formatPrice(order.amounts.total)}</td>
                    <td className="px-4 py-3">{ORDER_STATUS_LABELS[order.status] || order.status}</td>
                    <td className="px-4 py-3 text-xs text-forest/55">{order.payment.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
