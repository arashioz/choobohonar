"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { cartStore, type CartItem, DEFAULT_UNIT_PRICE } from "@/lib/cart";
import { toFa } from "@/lib/utils";

function formatPrice(n: number) {
  return `${toFa(n.toLocaleString("en-US"))} تومان`;
}

export default function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(cartStore.get());
    sync();
    window.addEventListener("choobohonar:cart", sync);
    return () => window.removeEventListener("choobohonar:cart", sync);
  }, []);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);

  if (items.length === 0) {
    return (
      <section className="bg-paper pb-24 pt-28 md:pt-36">
        <Container>
          <p className="eyebrow text-brick">سبد خرید</p>
          <h1 className="mt-4 text-3xl font-light tracking-tightest text-forest">سبد شما خالی است</h1>
          <p className="mt-3 max-w-md text-forest/60">از فروشگاه محصولی انتخاب کنید و اینجا برگردید.</p>
          <div className="mt-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm text-peach transition-colors hover:bg-forest-700"
            >
              رفتن به فروشگاه
              <span aria-hidden>←</span>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <Container>
        <p className="eyebrow text-brick">سبد خرید</p>
        <h1 className="mt-4 text-3xl font-light tracking-tightest text-forest md:text-4xl">
          محصولات انتخاب‌شده
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col gap-4 border border-forest/10 bg-white/70 p-4 sm:flex-row sm:items-center"
              >
                <div className="relative h-28 w-full shrink-0 overflow-hidden bg-forest/5 sm:h-24 sm:w-24">
                  {item.image ? (
                    <Image src={item.image} alt="" fill className="object-cover" unoptimized />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${encodeURIComponent(item.slug)}`} className="text-base text-forest hover:underline">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-forest/55">{formatPrice(item.unitPrice)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest"
                    onClick={() => cartStore.setQty(item.slug, item.qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{toFa(item.qty)}</span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border border-forest/15 text-forest"
                    onClick={() => cartStore.setQty(item.slug, item.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="ms-2 text-xs text-brick hover:underline"
                    onClick={() => cartStore.remove(item.slug)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 border border-forest/10 bg-white/80 p-6">
              <p className="text-sm text-forest/55">جمع جزء</p>
              <p className="mt-2 text-2xl font-light text-forest">{formatPrice(subtotal)}</p>
              <p className="mt-2 text-xs text-forest/45">
                هزینه ارسال در مرحله بعدی مشخص می‌شود.
                {items.some((i) => i.unitPrice === DEFAULT_UNIT_PRICE) ? (
                  <> قیمت برخی اقلام تخمینی است و هنگام ثبت نهایی قابل تأیید است.</>
                ) : null}
              </p>
              <div className="mt-6">
                <a
                  href="/checkout"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm text-peach transition-colors hover:bg-forest-700"
                >
                  ادامه خرید
                  <span aria-hidden>←</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
