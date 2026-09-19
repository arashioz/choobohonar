"use client";

import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import type { ShopProduct } from "@/data/products";
import { cn } from "@/lib/utils";

const MIN_PER_ROW = 8;

function fillRow(products: ShopProduct[], offset: number, length: number) {
  return Array.from({ length }, (_, index) => products[(index + offset) % products.length]);
}

export default function SeasonalProductRails({ products }: { products: ShopProduct[] }) {
  const pool = products.filter((product) => product.image);
  if (!pool.length) return null;

  const perRow = Math.max(MIN_PER_ROW, Math.ceil(pool.length / 2));
  const topRow = fillRow(pool, 0, perRow);
  const bottomRow = fillRow(pool, Math.ceil(pool.length / 2), perRow);

  return (
    <div className="mt-14 space-y-8 md:space-y-10 lg:mt-20">
      <MarqueeRow products={topRow} duration={110} />
      <MarqueeRow products={bottomRow} reverse duration={128} />
    </div>
  );
}

function MarqueeRow({
  products,
  reverse = false,
  duration,
}: {
  products: ShopProduct[];
  reverse?: boolean;
  duration: number;
}) {
  const copies = [0, 1] as const;

  return (
    <div dir="ltr" className="relative -mx-6 overflow-hidden md:-mx-10 lg:-mx-16">
      <div
        className={cn("seasonal-marquee-track flex w-max", reverse && "seasonal-marquee-track-reverse")}
        style={{ animationDuration: `${duration}s` }}
      >
        {copies.map((copy) => (
          <div key={copy} className="flex gap-4 pe-4 sm:gap-5 sm:pe-5" aria-hidden={copy === 1}>
            {products.map((product, index) => (
              <div
                key={`${copy}-${product.slug}-${index}`}
                className="w-[13.5rem] shrink-0 sm:w-[16.5rem] lg:w-[19.5rem]"
              >
                <CommerceProductCard product={product} imageAspect="portrait" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
