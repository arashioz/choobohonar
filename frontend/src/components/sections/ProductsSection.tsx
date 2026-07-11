"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { featuredProducts, finishes } from "@/data/products";
import { getProductShopUrl } from "@/lib/shop";
import { toFa, cn } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

export default function ProductsSection() {
  const [active, setActive] = useState(0);
  const [activeFinish, setActiveFinish] = useState<string | null>(null);
  const product = featuredProducts[active];

  const selectProduct = (i: number) => {
    setActive(i);
    setActiveFinish(null);
  };

  return (
    <section id="products" className="bg-paper py-28 md:py-40">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h2"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            محصولات
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            نمونه‌های منتخب از مجموعه خانه چوب و هنر — برای خرید به فروشگاه رسمی منتقل می‌شوید.
          </FadeUp>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
            {featuredProducts.map((p, i) => (
              <Image
                key={p.slug}
                src={p.image}
                alt={p.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn("object-cover transition-opacity duration-700 ease-out-expo", i === active ? "opacity-100" : "opacity-0")}
              />
            ))}
          </div>

          <div className="flex flex-col justify-center">
            <p className="font-display text-xl text-brick">{product.series}</p>
            <h3 className="mt-2 text-4xl font-light tracking-tightest text-forest md:text-5xl">{product.name}</h3>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-forest/70">{product.longDescription}</p>

            <div className="mt-8">
              <p className="eyebrow text-forest/65">پرداخت چوب</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {product.finishes.map((fid) => {
                  const f = finishes.find((x) => x.id === fid);
                  if (!f) return null;
                  const selected = activeFinish === fid;
                  return (
                    <button key={fid} type="button" onClick={() => setActiveFinish(fid)} className="group flex items-center gap-2" title={f.label}>
                      <span
                        className={cn(
                          "h-9 w-9 rounded-full border transition-all duration-300",
                          selected ? "border-forest ring-2 ring-forest ring-offset-2 ring-offset-paper" : "border-forest/15 group-hover:scale-110"
                        )}
                        style={{ backgroundColor: f.hex }}
                      />
                      <span className={cn("text-sm transition-colors", selected ? "text-forest" : "text-forest/65")}>{f.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3 border-t border-forest/10 pt-6 text-sm">
              <Spec label="عرض" value={`${toFa(product.dimensions.width)} سانتی‌متر`} />
              <Spec label="عمق" value={`${toFa(product.dimensions.depth)} سانتی‌متر`} />
              <Spec label="ارتفاع" value={`${toFa(product.dimensions.height)} سانتی‌متر`} />
              {product.specs.map((s) => (
                <Spec key={s.label} label={s.label} value={s.value} />
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button as="a" href={`/products/${product.slug}`} variant="primary" showArrow>
                معرفی محصول
              </Button>
              <Button
                as="a"
                href={getProductShopUrl(product)}
                variant="secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                خرید از فروشگاه
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {featuredProducts.map((p, i) => (
            <Link key={p.slug} href={`/products/${p.slug}`} onMouseEnter={() => selectProduct(i)} className="group block text-right">
              <div
                className={cn(
                  "relative aspect-[4/5] w-full overflow-hidden transition-all duration-500",
                  i === active ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : "opacity-80 hover:opacity-100"
                )}
              >
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
              </div>
              <h4 className="mt-3 text-sm font-medium text-forest">{p.name}</h4>
              <p className="text-xs text-forest/65">{p.category}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button as="a" href="/products" variant="secondary" showArrow>
            مشاهده همه محصولات
          </Button>
        </div>
      </Container>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-forest/65">{label}</dt>
      <dd className="mt-0.5 text-forest">{value}</dd>
    </div>
  );
}
