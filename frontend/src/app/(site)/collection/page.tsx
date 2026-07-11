import type { Metadata } from "next";
import Link from "next/link";
import { finishes, getProductsByFinish } from "@/data/products";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کالکشن پرداخت چوب | خانه چوب و هنر",
  description: "مرور پرداخت‌های چوب و مشاهده محصولاتی که در هر کالکشن قابل سفارش هستند.",
};

export default function CollectionPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">خانه</Link>
          <span>/</span>
          <span className="text-forest">کالکشن</span>
        </nav>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp as="h1" className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest">کالکشن پرداخت چوب</FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">هر پرداخت، شخصیت متفاوتی به فضا می‌دهد. از اینجا می‌توانید ببینید هر رنگ و بافت روی چه محصولاتی قابل سفارش است.</FadeUp>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {finishes.map((finish, index) => {
            const productCount = getProductsByFinish(finish.id).length;
            return (
              <FadeUp key={finish.id} delay={index * 0.08}>
                <Link href={`/collection/${finish.id}`} className="group block border border-forest/10 bg-white/60 p-6 transition-colors hover:border-forest/20 hover:bg-forest/[0.02]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-light tracking-tight text-forest">{finish.label}</h2>
                      <p className="mt-2 text-sm leading-6 text-forest/55">{toFa(productCount)} محصول در این کالکشن قابل سفارش است.</p>
                    </div>
                    <span className="h-14 w-14 rounded-full border border-forest/10" style={{ backgroundColor: finish.hex }} />
                  </div>
                  <span className="mt-10 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">مشاهده جزئیات کالکشن<span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span></span>
                </Link>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
