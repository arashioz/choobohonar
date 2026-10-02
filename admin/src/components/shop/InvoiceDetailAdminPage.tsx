"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { shopApi, storefrontProductUrl, type ShopInvoice } from "@/lib/shop-api";
import {
  FOLLOW_UP_STATUS_LABELS,
  type FollowUpStatus,
} from "@/lib/follow-up-status";

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

export default function InvoiceDetailAdminPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<ShopInvoice | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busy, setBusy] = useState(false);
  const [followUp, setFollowUp] = useState<FollowUpStatus>("new");

  useEffect(() => {
    if (!params.id) return;
    shopApi.invoices
      .get(params.id)
      .then(async (next) => {
        setInvoice(next);
        if (next.kind === "proforma" && next.orderId) {
          const order = await shopApi.orders.get(next.orderId);
          setFollowUp((order.followUpStatus || "new") as FollowUpStatus);
        }
      })
      .catch((e) => {
        console.error("[admin/shop/invoice] load", e);
        setError(e instanceof Error ? e.message : "خطا");
      });
  }, [params.id]);

  if (error) return <div className="flex min-h-screen items-center justify-center bg-paper text-brick">{error}</div>;
  if (!invoice) return <div className="flex min-h-screen items-center justify-center bg-paper text-forest/50">…</div>;

  return (
    <div className="relative min-h-screen bg-paper print:bg-white">
      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md print:hidden">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href={invoice.kind === "proforma" ? "/admin/shop?tab=proformas" : "/admin/shop?tab=invoices"} className="text-xs text-forest/45">
            {invoice.kind === "proforma" ? "← پیش‌فاکتورها" : "← فاکتورها"}
          </Link>
          <div className="flex items-center gap-2">
            {invoice.kind === "proforma" ? (
              <select
                value={followUp}
                disabled={busy}
                onChange={async (event) => {
                  const next = event.target.value as FollowUpStatus;
                  setBusy(true);
                  setActionError("");
                  try {
                    const order = await shopApi.orders.setFollowUp(invoice.orderId, next);
                    setFollowUp((order.followUpStatus || next) as FollowUpStatus);
                  } catch (err) {
                    setActionError(err instanceof Error ? err.message : "تغییر وضعیت انجام نشد");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs"
              >
                {Object.entries(FOLLOW_UP_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            ) : null}
            {invoice.kind === "proforma" ? (
              <button
                type="button"
                disabled={busy}
                onClick={async () => {
                  const archived = invoice.status === "archived" || Boolean(invoice.archivedAt);
                  if (!window.confirm(archived ? "این پیش‌فاکتور به فهرست فعال برگردد؟" : "این پیش‌فاکتور بایگانی شود؟")) return;
                  setBusy(true);
                  setActionError("");
                  try {
                    if (archived) await shopApi.orders.restore(invoice.orderId);
                    else await shopApi.orders.archive(invoice.orderId);
                    const next = await shopApi.invoices.get(invoice._id);
                    setInvoice(next);
                  } catch (err) {
                    setActionError(err instanceof Error ? err.message : "بایگانی انجام نشد");
                  } finally {
                    setBusy(false);
                  }
                }}
                className="rounded-xl border border-forest/10 px-3 py-2 text-xs disabled:opacity-50"
              >
                {invoice.status === "archived" || invoice.archivedAt ? "بازگردانی از بایگانی" : "بایگانی"}
              </button>
            ) : null}
            <button type="button" onClick={() => window.print()} className="rounded-xl border border-forest/10 px-3 py-2 text-xs">
              چاپ
            </button>
          </div>
        </div>
      </header>

      {actionError ? (
        <p className="mx-auto max-w-3xl px-5 pt-4 text-sm text-brick sm:px-8 print:hidden">{actionError}</p>
      ) : null}
      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-forest/10 bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-brick">{invoice.kind === "proforma" ? "پیش‌فاکتور" : "فاکتور فروش"}</p>
              <h1 className="mt-2 text-2xl font-light text-forest" dir="ltr">{invoice.invoiceNumber}</h1>
              <p className="mt-1 text-xs text-forest/45">سفارش {invoice.orderNumber}</p>
            </div>
            <p className="text-xs text-forest/45">{new Date(invoice.issuedAt).toLocaleString("fa-IR")}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <p className="text-xs text-forest/40">خریدار</p>
              <p className="mt-1 text-forest">{invoice.customer.name}</p>
              <p className="text-forest/55" dir="ltr">{invoice.customer.phone}</p>
            </div>
            <div>
              <p className="text-xs text-forest/40">آدرس</p>
              <p className="mt-1 text-forest/70">
                {invoice.shipping.province}، {invoice.shipping.city} — {invoice.shipping.address}
              </p>
            </div>
          </div>

          <table className="mt-8 w-full text-sm">
            <thead className="border-b border-forest/10 text-xs text-forest/40">
              <tr>
                <th className="py-2 text-right font-medium">شرح</th>
                <th className="py-2 text-right font-medium">تعداد</th>
                <th className="py-2 text-right font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <tr key={`${item.slug}-${item.name}`} className="border-b border-forest/5">
                  <td className="py-3 text-forest">
                    <p>{item.name}</p>
                    {item.category || item.series ? (
                      <p className="mt-0.5 text-[11px] text-forest/40">
                        {[item.category, item.series ? `کالکشن ${item.series}` : ""].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                    <a href={storefrontProductUrl(item.slug, item.href)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[11px] text-brick hover:underline">
                      صفحه محصول
                    </a>
                  </td>
                  <td className="py-3 text-forest/60">{item.qty}</td>
                  <td className="py-3 text-forest">{formatPrice(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 space-y-1 text-sm text-forest">
            <div className="flex justify-between text-forest/55"><span>جمع جزء</span><span>{formatPrice(invoice.amounts.subtotal)}</span></div>
            <div className="flex justify-between text-forest/55"><span>ارسال</span><span>{formatPrice(invoice.amounts.shippingFee)}</span></div>
            <div className="flex justify-between text-base font-medium pt-2 border-t border-forest/10"><span>مبلغ نهایی</span><span>{formatPrice(invoice.amounts.total)}</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}
