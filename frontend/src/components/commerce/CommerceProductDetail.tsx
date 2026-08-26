"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ShopProduct } from "@/data/products";
import { formatCatalogPrice, getCollectionName, getProductAttributeOptions } from "@/lib/commerce";
import { isUploadedMedia } from "@/lib/media";
import { cn, toFa } from "@/lib/utils";
import { useCart, type CartOption } from "@/components/commerce/cart/CartProvider";

const roomCategoryPaths = {
  living: "livingroom",
  bedroom: "bedroom",
  bedding: "bedding",
  dining: "diningroom",
  decor: "decor",
  carpet: "carpet",
  lighting: "lighting",
  dishes: "decor",
} as const;

export default function CommerceProductDetail({ product }: { product: ShopProduct }) {
  const { addProduct } = useCart();
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const attributes = useMemo(() => getProductAttributeOptions(product).slice(0, 5), [product]);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      attributes.map((attribute) => [
        attribute.id,
        attribute.options.find((option) => option.default)?.id ?? attribute.options[0]?.id ?? "",
      ]),
    ),
  );
  const [added, setAdded] = useState(false);
  const collection = getCollectionName(product);
  const priceValue = Number(product.prices?.value ?? 0);
  const canAddToCart = product.isPurchasable && Number.isFinite(priceValue) && priceValue > 0;

  const handleAddToCart = () => {
    const options: CartOption[] = attributes
      .map((attribute) => {
        const option = attribute.options.find((item) => item.id === selected[attribute.id]);
        return option
          ? { id: attribute.id, label: attribute.label, valueId: option.id, value: option.label }
          : null;
      })
      .filter((option): option is CartOption => Boolean(option));
    addProduct(product, options);
    setAdded(true);
  };

  return (
    <>
      <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-forest/50">
            <Link href="/" className="hover:text-forest">خانه</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-forest">محصولات</Link>
            <span>/</span>
            <Link href={`/products/category/${roomCategoryPaths[product.room]}`} className="hover:text-forest">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-forest">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] lg:gap-16 xl:gap-24">
            <div className="min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-forest/[0.04] md:aspect-[5/6]">
                {activeImage ? (
                  <Image
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    unoptimized={isUploadedMedia(activeImage)}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover animate-[commerce-image-in_600ms_cubic-bezier(0.16,1,0.3,1)]"
                  />
                ) : null}
                <div className="absolute right-5 top-5 flex flex-col gap-2">
                  <span className="rounded-full bg-paper/90 px-4 py-2 text-xs font-medium text-forest backdrop-blur-md">
                    {product.isInStock ? "آماده سفارش" : "تولید سفارشی"}
                  </span>
                  {collection ? (
                    <span className="rounded-full bg-forest/85 px-4 py-2 text-xs font-medium text-paper backdrop-blur-md">
                      کالکشن {collection}
                    </span>
                  ) : null}
                </div>
                <a href={activeImage} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-forest backdrop-blur-md" aria-label="بازکردن تصویر اصلی محصول">
                  ↗
                </a>
              </div>

              {gallery.length > 1 ? (
                <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
                  {gallery.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={cn(
                        "relative aspect-square w-24 shrink-0 overflow-hidden border transition-colors md:w-28",
                        activeImage === src ? "border-forest" : "border-transparent opacity-65 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt={`${product.name}، تصویر ${toFa(index + 1)}`} fill unoptimized={isUploadedMedia(src)} sizes="112px" className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-brick">{collection ? `Collection ${collection}` : product.category}</p>
              <h1 className="mt-5 text-[clamp(3rem,6vw,6rem)] font-extralight leading-[0.88] tracking-tightest text-forest">
                {product.name}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-forest/60">{product.shortDescription}</p>

              <div className="mt-8 flex items-end justify-between gap-6 border-y border-forest/10 py-6">
                <div>
                  <p className="text-xs text-forest/45">قیمت</p>
                  <p className="mt-2 text-2xl font-light text-forest">{formatCatalogPrice(product)}</p>
                </div>
                {product.reviewCount > 0 ? (
                  <div className="text-left">
                    <p className="text-sm text-brick">★★★★★</p>
                    <p className="mt-1 text-xs text-forest/45">{toFa(product.reviewCount)} نظر</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-7 space-y-7">
                {attributes.map((attribute) => (
                  <fieldset key={attribute.id}>
                    <div className="flex items-center justify-between gap-4">
                      <legend className="text-sm font-medium text-forest">{attribute.label}</legend>
                      <span className="text-xs text-forest/45">
                        {attribute.options.find((option) => option.id === selected[attribute.id])?.label}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {attribute.options.slice(0, 10).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelected((current) => ({ ...current, [attribute.id]: option.id }));
                            setAdded(false);
                          }}
                          className={cn(
                            "rounded-full border px-4 py-2 text-xs transition-colors",
                            selected[attribute.id] === option.id
                              ? "border-forest bg-forest text-paper"
                              : "border-forest/15 text-forest/65 hover:border-forest/40 hover:text-forest",
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]">
                {canAddToCart ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-medium text-paper transition-all duration-300 hover:bg-brick active:scale-[0.985]"
                  >
                    {added ? "افزودن یک عدد دیگر" : "افزودن به سبد خرید"}
                    <span className="text-lg">+</span>
                  </button>
                ) : (
                  <Link
                    href="/contact/consultation"
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-medium text-paper transition-colors hover:bg-brick"
                  >
                    استعلام و ثبت سفارش <span>←</span>
                  </Link>
                )}
                <Link
                  href="/contact/consultation"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-forest/20 px-6 text-sm text-forest transition-colors hover:border-forest"
                >
                  مشاوره
                </Link>
              </div>

              {added ? (
                <div role="status" aria-live="polite" className="mt-3 flex items-center justify-between gap-4 rounded-2xl bg-peach/35 px-5 py-4 text-sm text-forest">
                  <span>محصول با انتخاب‌های شما به سبد اضافه شد.</span>
                  <Link href="/cart" className="shrink-0 font-medium text-brick transition-colors hover:text-forest">
                    مشاهده سبد ←
                  </Link>
                </div>
              ) : null}

              <div className="mt-8 grid grid-cols-3 divide-x-reverse divide-x divide-forest/10 border-t border-forest/10 pt-6 text-center">
                <TrustItem title="ارسال تخصصی" detail="سراسر کشور" />
                <TrustItem title="تضمین اصالت" detail="مواد و ساخت" />
                <TrustItem title="پشتیبانی" detail="پیش و پس از خرید" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest py-24 text-paper md:py-32 lg:py-40">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="eyebrow text-peach">Material & Craft</p>
              <h2 className="mt-6 text-[clamp(3rem,6vw,6rem)] font-extralight leading-[0.88] tracking-tightest">
                زیبایی، از جزئیات آغاز می‌شود
              </h2>
            </div>
            <div className="grid gap-px bg-paper/15 sm:grid-cols-2">
              {product.attributes.slice(0, 6).map((attribute, index) => (
                <div key={attribute.id} className="bg-forest p-6 md:p-8">
                  <p className="font-display text-2xl text-peach">0{toFa(index + 1)}</p>
                  <h3 className="mt-4 text-xl font-light">{attribute.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-paper/60">
                    {attribute.terms.map((term) => term.name).join("، ") || "قابل انتخاب در زمان سفارش"}
                  </p>
                </div>
              ))}
              {!product.attributes.length ? (
                <div className="col-span-full bg-forest p-8 text-paper/65">
                  مشخصات فنی تکمیلی پس از اتصال API جدید نمایش داده می‌شود.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function TrustItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-2 first:pr-0 last:pl-0">
      <p className="text-xs font-medium text-forest">{title}</p>
      <p className="mt-1 text-[10px] text-forest/40">{detail}</p>
    </div>
  );
}
