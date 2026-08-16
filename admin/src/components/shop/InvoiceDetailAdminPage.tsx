"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { shopApi, type ShopInvoice } from "@/lib/shop-api";

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

export default function InvoiceDetailAdminPage() {
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<ShopInvoice | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.id) return;
    shopApi.invoices
      .get(params.id)
      .then(setInvoice)
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
          <Link href="/admin/shop?tab=invoices" className="text-xs text-forest/45">← فاکتورها</Link>
          <button type="button" onClick={() => window.print()} className="rounded-xl border border-forest/10 px-3 py-2 text-xs">
            چاپ
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-forest/10 bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-brick">فاکتور فروش</p>
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
                <tr key={item.slug} className="border-b border-forest/5">
                  <td className="py-3 text-forest">{item.name}</td>
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
