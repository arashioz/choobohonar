"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { formatMoney } from "@/lib/commerce";
import { toFa } from "@/lib/utils";
import { useCart } from "@/components/commerce/cart/CartProvider";

export default function CartPageClient() {
  const { items, itemCount, subtotal, hydrated, setQuantity, removeItem } = useCart();
  const currency = items.find((item) => item.currencySymbol)?.currencySymbol || "تومان";

  if (!hydrated) {
    return (
      <section className="min-h-[75svh] bg-paper pb-24 pt-36">
        <Container>
          <div className="h-16 w-56 animate-pulse bg-forest/5" />
          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_23rem]">
            <div className="h-72 animate-pulse bg-forest/5" />
            <div className="h-80 animate-pulse bg-forest/5" />
          </div>
        </Container>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="flex min-h-[82svh] items-center bg-paper pb-24 pt-36">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-forest/15 text-forest">
              <BagIcon className="h-8 w-8" />
            </span>
            <p className="eyebrow mt-8 text-brick">Your Selection</p>
            <h1 className="mt-5 text-[clamp(3.2rem,7vw,6.5rem)] font-extralight leading-[0.88] tracking-tightest text-forest">
              سبد شما هنوز خالی‌ست
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-8 text-forest/55">
              از میان مبلمان، نور، فرش و اشیای خانه انتخاب کنید؛ جزئیات و گزینه‌های هر محصول در سبد شما حفظ می‌شود.
            </p>
            <Link
              href="/products"
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-8 text-sm font-medium text-paper transition-colors hover:bg-brick"
            >
              ورود به محصولات <span>←</span>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-[82svh] bg-paper pb-28 pt-32 md:pb-36 md:pt-40">
      <Container>
        <div className="flex flex-col justify-between gap-6 border-b border-forest/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow text-brick">Your Selection / {toFa(itemCount)}</p>
            <h1 className="mt-5 text-[clamp(3.4rem,7vw,7rem)] font-extralight leading-none tracking-tightest text-forest">
              سبد خرید
            </h1>
          </div>
          <Link href="/products" className="group inline-flex items-center gap-3 text-sm text-forest/60 hover:text-forest">
            ادامه انتخاب محصولات
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start xl:gap-20">
          <div className="divide-y divide-forest/10 border-y border-forest/10">
            {items.map((item) => (
              <article key={item.key} className="grid gap-5 py-7 sm:grid-cols-[9rem_1fr] md:grid-cols-[11rem_1fr] md:gap-8 md:py-9">
                <Link href={`/products/${item.slug}`} className="relative aspect-[4/5] overflow-hidden bg-forest/[0.045]">
                  <Image src={item.image} alt={item.name} fill sizes="176px" className="object-cover transition-transform duration-700 hover:scale-[1.035]" />
                </Link>

                <div className="flex min-w-0 flex-col justify-between gap-7">
                  <div className="flex items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="text-xs font-medium tracking-[0.12em] text-brick">{item.category}</p>
                      <Link href={`/products/${item.slug}`} className="mt-2 block text-2xl font-light tracking-tight text-forest transition-colors hover:text-brick md:text-3xl">
                        {item.name}
                      </Link>
                      {item.options.length ? (
                        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-forest/55">
                          {item.options.map((option) => (
                            <div key={option.id} className="flex gap-1.5">
                              <dt>{option.label}:</dt>
                              <dd className="text-forest">{option.value}</dd>
                            </div>
                          ))}
                        </dl>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="shrink-0 text-xs text-forest/40 underline-offset-4 transition-colors hover:text-brick hover:underline"
                    >
                      حذف
                    </button>
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div className="inline-flex h-11 items-center rounded-full border border-forest/15">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center text-lg text-forest transition-colors hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`کاهش تعداد ${item.name}`}
                      >
                        −
                      </button>
                      <span className="flex min-w-10 items-center justify-center text-sm font-medium text-forest" aria-live="polite">
                        {toFa(item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        disabled={item.quantity >= 20}
                        className="flex h-11 w-11 items-center justify-center text-lg text-forest transition-colors hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`افزایش تعداد ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-forest/40">جمع این محصول</p>
                      <p className="mt-1 text-base font-medium text-forest">
                        {item.unitPrice !== null ? formatMoney(item.unitPrice * item.quantity, item.currencySymbol) : "استعلام قیمت"}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="lg:sticky lg:top-28">
            <div className="bg-forest p-7 text-paper md:p-8">
              <p className="eyebrow text-peach">Order Summary</p>
              <dl className="mt-7 space-y-5 border-y border-paper/15 py-6 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-paper/60">تعداد محصولات</dt>
                  <dd>{toFa(itemCount)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-paper/60">هزینه ارسال</dt>
                  <dd className="text-xs text-peach">پس از انتخاب آدرس</dd>
                </div>
                <div className="flex items-end justify-between gap-4 border-t border-paper/15 pt-5">
                  <dt className="text-paper/60">جمع محصولات</dt>
                  <dd className="text-xl font-light">{formatMoney(subtotal, currency)}</dd>
                </div>
              </dl>
              <Link
                href="/checkout"
                className="mt-7 flex min-h-14 items-center justify-center gap-3 rounded-full bg-peach px-6 text-sm font-medium text-forest transition-all hover:bg-paper active:scale-[0.985]"
              >
                تکمیل اطلاعات و خرید <span>←</span>
              </Link>
              <p className="mt-5 text-center text-[11px] leading-6 text-paper/45">
                هزینه نهایی ارسال و زمان تحویل بر اساس مقصد و نوع محصول در مرحله بعد مشخص می‌شود.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-px bg-forest/10 text-center">
              <Trust label="ارسال تخصصی" />
              <Trust label="پرداخت امن" />
              <Trust label="پشتیبانی خرید" />
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function Trust({ label }: { label: string }) {
  return <span className="bg-paper px-2 py-4 text-[10px] leading-5 text-forest/55">{label}</span>;
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M5.75 8.25h12.5l.85 11H4.9l.85-11Z" stroke="currentColor" strokeWidth="1.35" />
      <path d="M9 9V6.75a3 3 0 0 1 6 0V9" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  );
}
