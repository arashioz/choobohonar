import type { Product } from "@/data/products";
import { toFa, cn } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${toFa(value)} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < value ? "text-brick" : "text-forest/20"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ProductReviews({ product }: { product: Product }) {
  const reviews = product.reviews;
  if (!reviews.length) return null;

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  // Persian decimal separator (٫) instead of a Latin dot.
  const averageFa = toFa(average.toFixed(1)).replace(".", "٫");

  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <FadeUp as="p" className="eyebrow text-brick">
              نظرات کاربران
            </FadeUp>
            <FadeUp
              as="h2"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-tightest text-forest"
            >
              تجربه‌ی خریداران
            </FadeUp>
            <FadeUp delay={0.1} className="mt-8 flex items-end gap-4">
              <span className="font-display text-6xl text-forest">{averageFa}</span>
              <div className="pb-2">
                <Stars value={Math.round(average)} className="text-lg" />
                <p className="mt-1 text-sm text-forest/55">از مجموع {toFa(reviews.length)} دیدگاه</p>
              </div>
            </FadeUp>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="flex flex-col divide-y divide-forest/10 border-t border-forest/10">
              {reviews.map((r, i) => (
                <FadeUp key={`${r.author}-${i}`} delay={i * 0.06} className="py-7 first:pt-8">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest/8 text-forest">
                        {r.author.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-forest">{r.author}</p>
                        {r.location && <p className="text-xs text-forest/65">{r.location}</p>}
                      </div>
                    </div>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-4 leading-relaxed text-forest/75">{r.body}</p>
                  <p className="mt-3 text-xs text-forest/40">{r.date}</p>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
