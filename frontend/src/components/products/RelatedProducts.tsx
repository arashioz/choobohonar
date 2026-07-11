"use client";

import Image from "next/image";
import Link from "next/link";
import type { AnyProduct } from "@/data/products";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function RelatedProducts({ products }: { products: AnyProduct[] }) {
  if (!products.length) return null;

  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h2"
            className="text-balance text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            محصولات مرتبط
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link href="/products" className="group inline-flex items-center gap-3 text-lg text-forest transition-colors hover:text-brick">
              همه محصولات
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {products.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.08}>
              <Link href={`/products/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-light tracking-tight text-forest">{p.name}</h3>
                  <span className="text-sm text-forest/65">{p.category}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-forest/60">{p.shortDescription}</p>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
