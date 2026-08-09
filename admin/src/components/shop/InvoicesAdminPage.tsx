"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { shopApi, type ShopInvoice } from "@/lib/shop-api";

function formatPrice(n: number) {
  return `${n.toLocaleString("en-US")} تومان`;
}

export default function InvoicesAdminPage() {
  const [items, setItems] = useState<ShopInvoice[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shopApi.invoices.list({ q: q || undefined, limit: 40 });
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="relative min-h-screen bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />
      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="eyebrow text-brick">Invoices</p>
            <h1 className="mt-1 text-2xl font-light text-forest">فاکتورهای فروش</h1>
          </div>
          <Link href="/admin/shop/orders" className="rounded-xl border border-forest/10 px-3 py-2 text-xs text-forest/60">
            خریدهای آنلاین
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {error ? <p className="mb-4 text-sm text-brick">{error}</p> : null}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="جستجوی فاکتور / سفارش / مشتری"
          className="mb-6 w-full max-w-md rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm"
        />

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
                <tr><td colSpan={5} className="px-4 py-8 text-center text-forest/40">…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-forest/40">فاکتوری نیست</td></tr>
              ) : (
                items.map((inv) => (
                  <tr key={inv._id} className="border-t border-forest/5 hover:bg-forest/[0.02]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/shop/invoices/${inv._id}`} className="text-forest hover:underline" dir="ltr">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="px-4 py-3" dir="ltr">{inv.orderNumber}</td>
                    <td className="px-4 py-3 text-forest/70">{inv.customer.name}</td>
                    <td className="px-4 py-3">{formatPrice(inv.amounts.total)}</td>
                    <td className="px-4 py-3 text-xs text-forest/45">
                      {new Date(inv.issuedAt).toLocaleDateString("fa-IR")}
                    </td>
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
