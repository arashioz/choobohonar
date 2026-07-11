import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function ProjectInteriorCta() {
  return (
    <section className="bg-forest py-20 text-paper md:py-28">
      <Container>
        <FadeUp className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-peach">طراحی داخلی</p>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest">
            برای فضایی شبیه این پروژه آماده‌اید؟
          </h2>
          <p className="mt-5 text-pretty text-base leading-relaxed text-paper/72 md:text-lg">
            فرم هوشمند سفارش طراحی داخلی را تکمیل کنید تا سلیقه و جزئیات فنی فضای خود را با تیم معماری
            داخلی خانه چوب و هنر به اشتراک بگذارید.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/interior-architecture-services/order"
              className="inline-flex items-center gap-2 rounded-xl bg-peach px-7 py-4 text-sm font-medium text-forest transition-colors hover:bg-paper"
            >
              شروع فرم سفارش طراحی
              <span aria-hidden>←</span>
            </Link>
            <Link
              href="/interior-architecture-services"
              className="inline-flex items-center gap-2 text-sm text-peach/90 transition-colors hover:text-peach"
            >
              بیشتر درباره خدمات
              <span aria-hidden>←</span>
            </Link>
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
