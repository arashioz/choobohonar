import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "گالری | خانه چوب و هنر",
  description: "گالری تصاویر خانه چوب و هنر به‌زودی در دسترس قرار می‌گیرد.",
};

export default function GalleryPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:min-h-[70svh] md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">گالری</span>
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <FadeUp>
            <p className="eyebrow text-brick">به‌زودی</p>
          </FadeUp>
          <FadeUp as="h1" delay={0.05} className="mt-6 text-balance text-[clamp(2rem,5vw,3.75rem)] font-light leading-[1.05] tracking-tightest text-forest">
            گالری در حال آماده‌سازی است
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="mt-6 text-pretty text-lg leading-relaxed text-forest/65">
            گالری تصاویر پروژه‌ها، محصولات و کالکشن‌ها به‌زودی با تجربه‌ای جدید در دسترس قرار می‌گیرد. تا آن
            زمان می‌توانید نمونه‌کارها و محصولات را از بخش‌های زیر ببینید.
          </FadeUp>

          <FadeUp delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/projects" variant="primary" showArrow>
              مشاهده پروژه‌ها
            </Button>
            <Button href="/products" variant="secondary">
              مرور محصولات
            </Button>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
