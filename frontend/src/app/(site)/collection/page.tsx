import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { collections, getCollectionProductCount, fetchApiCollections } from "@/data/collections";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import { DEFAULT_MATERIALS_HREF } from "@/data/materials";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کالکشن‌ها | خانه چوب و هنر",
  description: "مجموعه‌های محصول خانه چوب و هنر؛ از کالکشن سولو تا مجموعه‌های آینده برند.",
};

export default async function CollectionPage() {
  const apiCollections = await fetchApiCollections();
  const showApi = apiCollections.length > 0;

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">خانه</Link>
          <span>/</span>
          <span className="text-forest">کالکشن</span>
        </nav>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp as="h1" className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest">
            کالکشن‌ها
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            مجموعه‌های واقعی محصول با زبان طراحی یکپارچه — متریال‌ها را در بخش جداگانه‌ای معرفی می‌کنیم.
          </FadeUp>
        </div>

        {showApi ? (
          <Stagger className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2" selector="[data-collection-card]" amount={0.45}>
            {apiCollections.map((collection) => (
                <Link data-collection-card key={collection.slug} href={`/collection/${collection.slug}`} className="group block">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest/5">
                    {collection.image ? (
                      <Image src={collection.image} alt={collection.name} fill unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-forest/30">
                        <span className="text-sm">{collection.name}</span>
                      </div>
                    )}
                    {collection.series ? (
                      <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-medium text-forest backdrop-blur-md">
                        سری {collection.series}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <h2 className="text-3xl font-light tracking-tight text-forest md:text-4xl">{collection.name}</h2>
                    <p className="mt-3 text-sm text-forest/50">{toFa(collection.productCount ?? collection.products?.length ?? 0)} محصول در این مجموعه</p>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                    مشاهده کالکشن <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                  </span>
                </Link>
            ))}
          </Stagger>
        ) : (
          <Stagger className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2" selector="[data-collection-card]" amount={0.45}>
            {collections.map((collection) => {
              const productCount = getCollectionProductCount(collection.slug);
              return (
                  <Link data-collection-card key={collection.slug} href={`/collection/${collection.slug}`} className="group block">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-forest/5">
                      <Image src={collection.image} alt={collection.name} fill unoptimized sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]" />
                      {collection.nameEn || collection.eyebrow ? (
                        <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-medium text-forest backdrop-blur-md">
                          سری {collection.nameEn || collection.eyebrow}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-6">
                      <h2 className="text-3xl font-light tracking-tight text-forest md:text-4xl">{collection.name}</h2>
                      <p className="mt-3 text-sm text-forest/50">{toFa(productCount)} محصول در این مجموعه</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                      مشاهده کالکشن <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                    </span>
                  </Link>
              );
            })}
          </Stagger>
        )}

        <FadeUp delay={0.2} className="mt-20 border-t border-forest/10 pt-10">
          <p className="max-w-xl text-base leading-relaxed text-forest/60">
            برای آشنایی با چوب به بخش متریال‌ها سر بزنید.
          </p>
          <Link href={DEFAULT_MATERIALS_HREF} className="mt-4 inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick">
            مشاهده متریال‌ها <span>←</span>
          </Link>
        </FadeUp>
      </Container>
    </section>
  );
}
