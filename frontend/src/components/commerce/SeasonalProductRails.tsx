"use client";

import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import type { ShopProduct } from "@/data/products";
import { cn } from "@/lib/utils";

export default function SeasonalProductRails({ products }: { products: ShopProduct[] }) {
  const midpoint = Math.ceil(products.length / 2);
  const topRow = products.slice(0, midpoint);
  const bottomRow = products.slice(midpoint);

  return (
    <div className="mt-14 space-y-10 lg:mt-20">
      <MarqueeRow products={topRow} />
      {bottomRow.length ? <MarqueeRow products={bottomRow} reverse /> : null}
    </div>
  );
}

function MarqueeRow({ products, reverse = false }: { products: ShopProduct[]; reverse?: boolean }) {
  if (!products.length) return null;
  const loop = [...products, ...products];

  return (
    <div className="relative -mx-6 overflow-hidden md:-mx-10 lg:-mx-16">
      <div
        className={cn(
          "flex w-max gap-5 pr-5 hover:[animation-play-state:paused]",
          reverse ? "seasonal-marquee-track-reverse" : "seasonal-marquee-track",
        )}
      >
        {loop.map((product, index) => (
          <div key={`${product.slug}-${index}`} className="w-[16.5rem] shrink-0 sm:w-[18rem] lg:w-[20rem]">
            <CommerceProductCard product={product} imageAspect="portrait" />
          </div>
        ))}
      </div>
    </div>
  );
}
