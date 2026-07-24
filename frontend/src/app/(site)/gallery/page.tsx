import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getGalleryItems } from "@/data/gallery";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import GalleryExperience from "@/components/gallery/GalleryExperience";

export const metadata: Metadata = {
  title: "گالری | خانه چوب و هنر",
  description:
    "گالری ترکیبی از پروژه‌ها، رویدادها، نمایشگاه‌ها، پشت‌صحنه ساخت، کالکشن‌ها و متریال‌های خانه چوب و هنر.",
};

export default function GalleryPage() {
  const items = getGalleryItems();

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
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
            <GalleryExperience items={items} />
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
            <Link href="/materials" className="inline-flex items-center gap-2 text-forest/55 transition-colors hover:text-forest">
              متریال‌ها
              <span>←</span>
            </Link>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
