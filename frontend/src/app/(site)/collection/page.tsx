import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collections, getCollectionProductCount } from "@/data/collections";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کالکشن‌ها | خانه چوب و هنر",
  description: "مجموعه‌های محصول خانه چوب و هنر؛ از کالکشن سولو تا مجموعه‌های آینده برند.",
};

export default function CollectionPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">کالکشن</span>
        </nav>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h1"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            کالکشن‌ها
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            مجموعه‌های واقعی محصول با زبان طراحی یکپارچه — متریال‌ها را در بخش جداگانه‌ای معرفی می‌کنیم.
          </FadeUp>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {collections.map((collection, index) => {
            const productCount = getCollectionProductCount(collection.slug);
            return (
              <FadeUp key={collection.slug} delay={index * 0.08}>
                <Link href={`/collection/${collection.slug}`} className="group block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest/5">
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow text-brick">{collection.eyebrow}</p>
                      <h2 className="mt-3 text-3xl font-light tracking-tight text-forest md:text-4xl">
                        {collection.name}
                      </h2>
                      <p className="mt-3 max-w-md text-base leading-relaxed text-forest/60">
                        {collection.shortDescription}
                      </p>
                      <p className="mt-3 text-sm text-forest/50">{toFa(productCount)} محصول در این مجموعه</p>
                    </div>
                    <span className="font-display text-lg text-forest/40">{collection.nameEn}</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                    مشاهده کالکشن
                    <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                  </span>
                </Link>
              </FadeUp>
            );
          })}
        </div>

        <FadeUp delay={0.2} className="mt-20 border-t border-forest/10 pt-10">
          <p className="max-w-xl text-base leading-relaxed text-forest/60">
            برای آشنایی با چوب، پارچه، روکش و فلز به بخش متریال‌ها سر بزنید.
          </p>
          <Link
            href="/materials"
            className="mt-4 inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick"
          >
            مشاهده متریال‌ها
            <span>←</span>
          </Link>
        </FadeUp>
      </Container>
    </section>
  );
}
