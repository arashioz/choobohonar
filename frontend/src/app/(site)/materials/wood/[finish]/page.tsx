import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getWoodFinish, woodFinishes } from "@/data/materials";
import { getProductsByFinish } from "@/data/products";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export function generateStaticParams() {
  return woodFinishes.map((finish) => ({ finish: finish.id }));
}

export function generateMetadata({ params }: { params: { finish: string } }): Metadata {
  const finish = getWoodFinish(params.finish);
  if (!finish) return { title: "پرداخت یافت نشد | خانه چوب و هنر" };
  return {
    title: `پرداخت ${finish.label} | متریال چوب`,
    description: `محصولات قابل سفارش با پرداخت چوب ${finish.label} را مشاهده کنید.`,
  };
}

export default function WoodFinishDetailPage({ params }: { params: { finish: string } }) {
  const finish = getWoodFinish(params.finish);
  if (!finish) notFound();
  const matchingProducts = getProductsByFinish(finish.id);

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex flex-wrap items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <Link href="/materials" className="transition-colors hover:text-forest">
            متریال
          </Link>
          <span>/</span>
          <Link href="/materials/wood" className="transition-colors hover:text-forest">
            چوب
          </Link>
          <span>/</span>
          <span className="text-forest">{finish.label}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 border-b border-forest/10 pb-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <FadeUp as="p" className="eyebrow text-brick">
              پرداخت چوب
            </FadeUp>
            <FadeUp
              as="h1"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
            >
              {finish.label}
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/65">
              این پرداخت برای فضاهایی مناسب است که به گرمای چوب، عمق بافت و حضور آرام رنگ نیاز دارند. در این
              صفحه محصولات قابل سفارش با این پرداخت را می‌بینید.
            </FadeUp>
          </div>
          <div className="flex items-center justify-start gap-6 lg:justify-end">
            <span
              className="h-24 w-24 rounded-full border border-forest/10 shadow-[inset_0_0_0_8px_rgba(255,255,255,0.35)]"
              style={{ backgroundColor: finish.hex }}
            />
            <div className="text-sm text-forest/55">
              <p>کد پرداخت</p>
              <p className="mt-2 text-lg text-forest">{finish.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-light tracking-tight text-forest">محصولات مرتبط</h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick"
          >
            مشاهده همه محصولات
            <span>←</span>
          </Link>
        </div>

        {matchingProducts.length ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {matchingProducts.map((product, index) => (
              <FadeUp key={product.slug} delay={index * 0.08}>
                <Link href={`/products/${product.slug}`} className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-light tracking-tight text-forest">{product.name}</h3>
                    <span className="text-sm text-forest/65">{product.category}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-forest/60">{product.shortDescription}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                    مشاهده محصول
                    <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        ) : (
          <p className="mt-10 text-forest/55">فعلاً محصول ویترینی با این پرداخت ثبت نشده است.</p>
        )}

        <div className="mt-16">
          <Link
            href="/materials/wood"
            className="inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick"
          >
            بازگشت به متریال چوب
            <span>←</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
