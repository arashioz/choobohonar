"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import { finishes } from "@/data/products";
import { getProductShopUrl } from "@/lib/shop";
import { toFa, cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

export default function ProductHero({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeFinish, setActiveFinish] = useState<string | null>(null);
  const gallery = product.gallery.length ? product.gallery : [product.image];

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
          {gallery.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={product.name}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={cn(
                "object-cover transition-opacity duration-700 ease-out-expo",
                i === activeImage ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveImage(i)}
              className={cn(
                "relative aspect-square w-full overflow-hidden transition-all duration-300",
                i === activeImage ? "ring-2 ring-forest ring-offset-2 ring-offset-paper" : "opacity-70 hover:opacity-100"
              )}
              aria-label={`تصویر ${toFa(i + 1)}`}
            >
              <Image src={src} alt="" fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <p className="font-display text-xl text-brick">{product.series}</p>
        <h1 className="mt-2 text-4xl font-light tracking-tightest text-forest md:text-5xl">{product.name}</h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-forest/70">{product.longDescription}</p>

        <div className="mt-8">
          <p className="eyebrow text-forest/65">پرداخت چوب</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {product.finishes.map((fid) => {
              const f = finishes.find((x) => x.id === fid);
              if (!f) return null;
              const selected = activeFinish === fid;
              return (
                <a key={fid} href={`/materials/wood/${fid}`} className="group flex items-center gap-2" title={f.label} onMouseEnter={() => setActiveFinish(fid)}>
                  <span
                    className={cn(
                      "h-9 w-9 rounded-full border transition-all duration-300",
                      selected ? "border-forest ring-2 ring-forest ring-offset-2 ring-offset-paper" : "border-forest/15 group-hover:scale-110"
                    )}
                    style={{ backgroundColor: f.hex }}
                  />
                  <span className={cn("text-sm transition-colors", selected ? "text-forest" : "text-forest/65")}>{f.label}</span>
                </a>
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

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <Spec label="گارانتی" value={product.warranty} />
          <Spec label="زمان تحویل" value={product.leadTime} />
        </dl>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button
            as="a"
            href={getProductShopUrl(product)}
            variant="primary"
            showArrow
            target="_blank"
            rel="noopener noreferrer"
          >
            خرید از فروشگاه
          </Button>
          <Button as="a" href="/contact?intent=services" variant="secondary">
            مشاوره طراحی داخلی
          </Button>
        </div>
      </div>
    </div>
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
