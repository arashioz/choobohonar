import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { materials } from "@/data/materials";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export const metadata: Metadata = {
  title: "متریال‌ها | خانه چوب و هنر",
  description: "چوب، پارچه، روکش و فلز — متریال‌هایی که هویت ساخت خانه چوب و هنر را شکل می‌دهند.",
};

export default function MaterialsPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">متریال</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h1"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            متریال‌ها
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            چهار متریال اصلی که ساخت، لمس و شخصیت محصولات را تعریف می‌کنند.
          </FadeUp>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
          {materials.map((material, index) => (
            <FadeUp key={material.id} delay={index * 0.08}>
              <Link href={`/materials/${material.id}`} className="group block">
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-forest/5">
                  <Image
                    src={material.image}
                    alt={material.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="eyebrow text-peach/90">{material.eyebrow}</p>
                    <h2 className="mt-2 text-3xl font-light tracking-tight text-paper md:text-4xl">
                      {material.label}
                    </h2>
                  </div>
                </div>
                <p className="mt-5 max-w-md text-base leading-relaxed text-forest/65">
                  {material.shortDescription}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                  جزئیات متریال
                  <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.25} className="mt-20 border-t border-forest/10 pt-10">
          <p className="max-w-xl text-base leading-relaxed text-forest/60">
            برای دیدن مجموعه‌های محصول مانند کالکشن سولو به بخش کالکشن‌ها بروید.
          </p>
          <Link
            href="/collection"
            className="mt-4 inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick"
          >
            مشاهده کالکشن‌ها
            <span>←</span>
          </Link>
        </FadeUp>
      </Container>
    </section>
  );
}
