"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ORDER_STATUS_LABELS,
  shopApi,
  type ShopOrder,
} from "@/lib/shop-api";

const FLOW = ["pending", "confirmed", "paid", "preparing", "shipping", "delivered"];

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

export default function OrderDetailAdminPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<ShopOrder | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    if (!params.id) return;
    try {
      setOrder(await shopApi.orders.get(params.id));
    } catch (e) {
      console.error("[admin/shop/order] load", e);
      setError(e instanceof Error ? e.message : "خطا");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function setStatus(status: string) {
    if (!order) return;
    setBusy(true);
    setError("");
    try {
      setOrder(await shopApi.orders.updateStatus(order._id, status));
    } catch (e) {
      console.error("[admin/shop/order] status", e);
      setError(e instanceof Error ? e.message : "به‌روزرسانی ناموفق");
    } finally {
      setBusy(false);
    }
  }

  async function makeInvoice() {
    if (!order) return;
    setBusy(true);
    try {
      await shopApi.orders.issueInvoice(order._id);
      await load();
    } catch (e) {
      console.error("[admin/shop/order] invoice", e);
      setError(e instanceof Error ? e.message : "صدور فاکتور ناموفق");
    } finally {
      setBusy(false);
    }
  }

  if (error && !order) {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-brick">{error}</div>;
  }
  if (!order) {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-forest/50">در حال بارگذاری…</div>;
  }

  return (
    <div className="relative min-h-screen bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />
      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <Link href="/admin/shop" className="text-xs text-forest/45 hover:text-forest">← فروشگاه</Link>
            <h1 className="mt-1 text-2xl font-light text-forest" dir="ltr">{order.orderNumber}</h1>
          </div>
          <div className="flex gap-2">
            {order.invoiceId ? (
              <Link href={`/admin/shop/invoices/${order.invoiceId}`} className="rounded-xl bg-forest px-3 py-2 text-xs text-peach">
                مشاهده فاکتور
              </Link>
            ) : (
              <button type="button" disabled={busy} onClick={() => void makeInvoice()} className="rounded-xl border border-forest/15 px-3 py-2 text-xs disabled:opacity-50">
                صدور فاکتور
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl space-y-6 px-5 py-8 sm:px-8">
        {error ? <p className="text-sm text-brick">{error}</p> : null}

        <section className="rounded-2xl border border-forest/10 bg-white/80 p-5">
          <p className="text-xs text-forest/45 mb-3">استپ وضعیت سفارش</p>
          <div className="flex flex-wrap gap-2">
            {FLOW.map((s) => {
              const active = order.status === s;
              const idx = FLOW.indexOf(order.status);
              const done = FLOW.indexOf(s) <= idx && order.status !== "cancelled";
              return (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => void setStatus(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    active
                      ? "border-forest bg-forest text-peach"
                      : done
                        ? "border-sage/50 bg-sage/20 text-forest"
                        : "border-forest/10 text-forest/40"
                  }`}
                >
                  {ORDER_STATUS_LABELS[s]}
                </button>
              );
            })}
            <button
              type="button"
              disabled={busy}
              onClick={() => void setStatus("cancelled")}
              className="rounded-full border border-brick/25 px-3 py-1.5 text-xs text-brick"
            >
              لغو
            </button>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-forest/10 bg-white/80 p-5 text-sm">
            <h2 className="font-medium text-forest">مشتری</h2>
            <p className="mt-2 text-forest/70">{order.customer.name}</p>
            <p className="text-forest/50" dir="ltr">{order.customer.phone}</p>
            {order.customer.email ? <p className="text-forest/50" dir="ltr">{order.customer.email}</p> : null}
          </section>
          <section className="rounded-2xl border border-forest/10 bg-white/80 p-5 text-sm">
            <h2 className="font-medium text-forest">آدرس و نقشه</h2>
            <p className="mt-2 text-forest/70">
              {order.shipping.province}، {order.shipping.city}
            </p>
            <p className="text-forest/60">{order.shipping.address}</p>
            {typeof order.shipping.lat === "number" && typeof order.shipping.lng === "number" ? <><p className="mt-2 text-xs text-forest/40" dir="ltr">{order.shipping.lat.toFixed(5)}, {order.shipping.lng.toFixed(5)}</p><a className="mt-2 inline-block text-xs text-brick hover:underline" href={`https://www.openstreetmap.org/?mlat=${order.shipping.lat}&mlon=${order.shipping.lng}#map=16/${order.shipping.lat}/${order.shipping.lng}`} target="_blank" rel="noreferrer">باز کردن روی نقشه</a></> : <p className="mt-2 text-xs text-forest/40">موقعیت نقشه ثبت نشده است.</p>}
          </section>
        </div>

        <section className="rounded-2xl border border-forest/10 bg-white/80 p-5">
          <h2 className="text-sm font-medium text-forest">اقلام</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.slug} className="flex justify-between gap-3 text-forest/70">
                <span>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.qty * item.unitPrice)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-forest/10 pt-3 text-sm text-forest">
            <div className="flex justify-between"><span>جمع</span><span>{formatPrice(order.amounts.subtotal)}</span></div>
            <div className="flex justify-between text-forest/55"><span>ارسال</span><span>{formatPrice(order.amounts.shippingFee)}</span></div>
            <div className="mt-1 flex justify-between font-medium"><span>نهایی</span><span>{formatPrice(order.amounts.total)}</span></div>
            <p className="mt-2 text-xs text-forest/45">پرداخت: {order.payment.status} {order.payment.mockRef ? `· ${order.payment.mockRef}` : ""}</p>
          </div>
        </section>

        {order.statusHistory?.length ? (
          <section className="rounded-2xl border border-forest/10 bg-white/80 p-5">
            <h2 className="text-sm font-medium text-forest">تاریخچه وضعیت</h2>
            <ul className="mt-3 space-y-2 text-xs text-forest/55">
              {order.statusHistory.map((h, i) => (
                <li key={`${h.at}-${i}`}>
                  {ORDER_STATUS_LABELS[h.from] || h.from} → {ORDER_STATUS_LABELS[h.to] || h.to}
                  {h.note ? ` · ${h.note}` : ""}
                  <span className="ms-2 text-forest/35" dir="ltr">{new Date(h.at).toLocaleString("fa-IR")}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}
