import Image from "next/image";
import type { Product } from "@/data/products";
import { cn, toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function TechnicalContent({ product }: { product: Product }) {
  return (
    <section className="bg-forest py-24 text-paper md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp as="p" className="eyebrow text-peach">
            محتوای تخصصی
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-tightest"
          >
            جزئیات ساخت، متریال و نگهداری
          </FadeUp>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {product.technical.map((block, i) => {
            const reversed = i % 2 === 1;
            return (
              <FadeUp
                key={block.title}
                className={cn(
                  "grid grid-cols-1 items-center gap-8 md:gap-14",
                  block.image ? "lg:grid-cols-2" : "lg:grid-cols-1"
                )}
              >
                {block.image && (
                  <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-paper/5", reversed && "lg:order-2")}>
                    <Image
                      src={block.image}
                      alt={block.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={cn(block.image ? "" : "max-w-3xl", reversed && "lg:order-1")}>
                  <p className="font-display text-lg text-peach">{toFa(`0${i + 1}`)}</p>
                  <h3 className="mt-3 text-2xl font-light tracking-tight text-paper md:text-3xl">{block.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-paper/70 md:text-lg">{block.body}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
