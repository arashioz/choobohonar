"use client";

import Image from "next/image";
import type { ShopProduct } from "@/data/products";
import Button from "@/components/ui/Button";

export default function ShopProductIntro({ product }: { product: ShopProduct }) {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="eyebrow text-brick">{product.category}</p>
        <h1 className="mt-2 text-4xl font-light tracking-tightest text-forest md:text-5xl">{product.name}</h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-forest/70">{product.shortDescription}</p>

        <p className="mt-6 max-w-md text-sm leading-relaxed text-forest/55">
          این صفحه برای معرفی محصول است. برای مشاهده ابعاد، رنگ‌ها، قیمت و ثبت سفارش به فروشگاه رسمی خانه چوب و
          هنر منتقل می‌شوید.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button as="a" href={product.shopUrl} variant="primary" showArrow target="_blank" rel="noopener noreferrer">
            مشاهده و خرید در فروشگاه
          </Button>
          <Button as="a" href="/contact/consultation" variant="secondary">
            مشاوره طراحی داخلی
          </Button>
        </div>
      </div>
    </div>
  );
}
