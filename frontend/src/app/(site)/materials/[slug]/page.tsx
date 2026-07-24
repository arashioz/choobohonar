import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMaterial, materials, woodFinishes } from "@/data/materials";
import { getProductsByFinish } from "@/data/products";
import { toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const material = getMaterial(params.slug);
  if (!material) return { title: "متریال یافت نشد | خانه چوب و هنر" };
  return {
    title: `${material.label} | متریال‌های خانه چوب و هنر`,
    description: material.shortDescription,
  };
}

export default function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const material = getMaterial(params.slug);
  if (!material) notFound();

  const isWood = material.id === "wood";

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <Link href="/materials" className="transition-colors hover:text-forest">
            متریال
          </Link>
          <span>/</span>
          <span className="text-forest">{material.label}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 border-b border-forest/10 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <FadeUp as="p" className="eyebrow text-brick">
              {material.eyebrow}
            </FadeUp>
            <FadeUp
              as="h1"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
            >
              {material.label}
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/65">
              {material.longDescription}
            </FadeUp>
          </div>
          <FadeUp delay={0.1} className="relative aspect-[4/3] w-full overflow-hidden bg-forest/5">
            <Image
              src={material.image}
              alt={material.label}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </FadeUp>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3">
          {material.highlights.map((item, index) => (
            <FadeUp key={item.title} delay={index * 0.08}>
              <p className="eyebrow text-forest/45">{toFa(`0${index + 1}`)}</p>
              <h2 className="mt-3 text-xl font-light tracking-tight text-forest">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-forest/60">{item.description}</p>
            </FadeUp>
          ))}
        </div>

        {isWood ? (
          <div className="mt-20">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-2xl font-light tracking-tight text-forest">پرداخت چوب</h2>
                <p className="mt-3 max-w-lg text-base text-forest/60">
                  هر پرداخت، شخصیت متفاوتی به سازه می‌دهد. جزئیات و محصولات مرتبط را ببینید.
                </p>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {woodFinishes.map((finish, index) => {
                const productCount = getProductsByFinish(finish.id).length;
                return (
                  <FadeUp key={finish.id} delay={index * 0.06}>
                    <Link
                      href={`/materials/wood/${finish.id}`}
                      className="group flex items-center justify-between gap-4 border border-forest/10 bg-white/50 p-5 transition-colors hover:border-forest/20 hover:bg-forest/[0.02]"
                    >
                      <div>
                        <h3 className="text-xl font-light tracking-tight text-forest">{finish.label}</h3>
                        <p className="mt-2 text-sm text-forest/55">
                          {toFa(productCount)} محصول با این پرداخت
                        </p>
                      </div>
                      <span
                        className="h-12 w-12 shrink-0 rounded-full border border-forest/10"
                        style={{ backgroundColor: finish.hex }}
                      />
                    </Link>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-16 flex flex-wrap gap-6 text-sm">
          <Link href="/materials" className="inline-flex items-center gap-2 text-forest transition-colors hover:text-brick">
            همه متریال‌ها
            <span>←</span>
          </Link>
          <Link href="/collection" className="inline-flex items-center gap-2 text-forest/55 transition-colors hover:text-forest">
            کالکشن‌های محصول
            <span>←</span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
