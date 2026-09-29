import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getGalleryItems, normalizeGalleryItem } from "@/data/gallery";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import GalleryExperience from "@/components/gallery/GalleryExperience";
import { fetchPublicCmsEntries } from "@/lib/public-cms";
import { fetchStorefrontProducts } from "@/lib/storefront-products";
import { DEFAULT_MATERIALS_HREF } from "@/data/materials";
import type { GalleryItem } from "@/data/gallery";

export const metadata: Metadata = {
  title: "گالری | خانه چوب و هنر",
  description:
    "گالری ترکیبی از پروژه‌ها، رویدادها، نمایشگاه‌ها، پشت‌صحنه ساخت، کالکشن‌ها و متریال‌های خانه چوب و هنر.",
};

export default async function GalleryPage() {
  const [pages, catalogProducts] = await Promise.all([
    fetchPublicCmsEntries("page"),
    fetchStorefrontProducts().catch(() => []),
  ]);
  const migratedItems = pages.find((page) => page.slug === "gallery")?.items;
  const items = Array.isArray(migratedItems) && migratedItems.length
    ? migratedItems
        .map((item, index) => normalizeGalleryItem(item as Record<string, unknown>, index))
        .filter((item): item is GalleryItem => Boolean(item))
    : getGalleryItems();

  return (
    <section className="relative overflow-clip bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="absolute inset-0 z-20">
        <div className="sticky top-0 flex h-svh items-center justify-center px-6">
          <div className="max-w-md rounded-[2rem] border border-forest/10 bg-paper/80 px-8 py-10 text-center shadow-[0_30px_80px_-30px_rgba(9,43,28,0.35)] backdrop-blur-xl md:px-12 md:py-12">
            <p className="eyebrow text-brick">Gallery</p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-light leading-tight tracking-tightest text-forest">
              گالری در دست ساخت
            </h1>
            <p className="mt-3 text-lg text-forest/55">بزودی…</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
              <Link href="/projects" className="rounded-full bg-forest px-5 py-2.5 text-paper transition-colors hover:bg-forest/90">
                دیدن پروژه‌ها
              </Link>
              <Link href="/products" className="rounded-full border border-forest/15 px-5 py-2.5 text-forest transition-colors hover:border-forest/40">
                فروشگاه
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden inert className="pointer-events-none select-none opacity-70 blur-[6px]">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">گالری</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <FadeUp as="p" className="eyebrow text-brick">
              آرشیو تصویری
            </FadeUp>
            <FadeUp
              as="h1"
              delay={0.05}
              className="mt-4 text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
            >
              گالری
            </FadeUp>
          </div>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            ترکیبی از پروژه‌ها، رویدادها، نمایشگاه‌ها و پشت‌صحنه فعالیت‌ها — نه فقط ویترین محصول.
          </FadeUp>
        </div>

        <Suspense fallback={<div className="mt-14 h-40 animate-pulse bg-forest/5" />}>
          <div className="mt-12 md:mt-16">
            <GalleryExperience items={items} catalogProducts={catalogProducts} />
          </div>
        </Suspense>

        <FadeUp delay={0.15} className="mt-20 border-t border-forest/10 pt-10">
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/projects" className="inline-flex items-center gap-2 text-forest transition-colors hover:text-brick">
              پروژه‌ها
              <span>←</span>
            </Link>
            <Link href="/collection" className="inline-flex items-center gap-2 text-forest/55 transition-colors hover:text-forest">
              کالکشن‌ها
              <span>←</span>
            </Link>
            <Link href={DEFAULT_MATERIALS_HREF} className="inline-flex items-center gap-2 text-forest/55 transition-colors hover:text-forest">
              متریال‌ها
              <span>←</span>
            </Link>
          </div>
        </FadeUp>
      </Container>
      </div>
    </section>
  );
}
