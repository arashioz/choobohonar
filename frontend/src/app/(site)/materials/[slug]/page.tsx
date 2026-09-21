import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import MaterialCategoryCatalog from "@/components/materials/MaterialCategoryCatalog";
import ClipReveal from "@/components/motion/ClipReveal";
import FadeUp from "@/components/motion/FadeUp";
import { DEFAULT_MATERIALS_HREF } from "@/data/materials";
import { isUploadedMedia } from "@/lib/media";
import { fetchMaterialCatalog, fetchPublicMaterial } from "@/lib/public-materials";
import { toFa } from "@/lib/utils";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = await fetchPublicMaterial(slug);
  if (!material) return { title: "متریال یافت نشد | خانه چوب و هنر" };
  return {
    title: `${material.label} | فروشگاه متریال خانه چوب و هنر`,
    description: material.longDescription,
  };
}

export default async function MaterialCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const material = await fetchPublicMaterial(slug);
  if (!material) notFound();
  const items = await fetchMaterialCatalog(material.id);
  const heroImage = items[0]?.applicationImage || material.image;
  const details = [
    { label: "نوع", values: material.materialTypes },
    { label: "رنگ", values: material.colors },
    { label: "پرداخت", values: material.finishes },
    { label: "کاربرد", values: material.applications },
  ].filter((item) => item.values.length);

  return (
    <>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-forest text-paper">
        {heroImage ? (
          <Image src={heroImage} alt={material.label} fill priority sizes="100vw" unoptimized={isUploadedMedia(heroImage)} className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,29,19,0.28)_0%,rgba(6,29,19,0.26)_35%,rgba(6,29,19,0.92)_100%)]" />
        <div className="commerce-grain absolute inset-0 opacity-30" aria-hidden />
        <Container className="relative z-10 pb-12 pt-36 md:pb-16">
          <nav className="mb-10 flex items-center gap-2 text-xs text-paper/60">
            <Link href="/" className="hover:text-paper">خانه</Link>
            <span>/</span>
            <Link href={DEFAULT_MATERIALS_HREF} className="hover:text-paper">متریال</Link>
            <span>/</span>
            <span className="text-peach">{material.label}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <ClipReveal>
                <p className="eyebrow text-peach">{material.eyebrow}</p>
              </ClipReveal>
              <ClipReveal delay={0.06} className="mt-6">
                <h1 className="text-[clamp(4rem,12vw,10rem)] font-extralight leading-[0.78] tracking-[-0.065em]">
                  {material.label}
                </h1>
              </ClipReveal>
            </div>
            <FadeUp delay={0.12} className="border-r border-paper/25 pr-5">
              <p className="text-lg leading-8 text-paper/75">{material.longDescription}</p>
              <p className="mt-5 text-xs tracking-[0.2em] text-peach">{toFa(items.length)} MATERIAL SAMPLE</p>
            </FadeUp>
          </div>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-16 md:py-20">
        <Container>
          <div className="grid gap-px bg-forest/10 md:grid-cols-3">
            {material.highlights.map((highlight, index) => (
              <FadeUp key={highlight.title} delay={index * 0.06} className="bg-[#e8ded2] p-7 md:p-9">
                <p className="font-display text-2xl text-brick">0{toFa(index + 1)}</p>
                <h2 className="mt-4 text-xl font-light text-forest">{highlight.title}</h2>
                <p className="mt-3 text-sm leading-7 text-forest/55">{highlight.description}</p>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      {details.length || material.specs.length || material.care ? (
        <section className="bg-paper py-16 md:py-24">
          <Container>
            <div className="grid gap-px bg-forest/10 md:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="bg-paper p-6 md:p-8">
                  <p className="text-xs text-forest/45">{detail.label}</p>
                  <p className="mt-3 text-lg font-light leading-8 text-forest">{detail.values.join("، ")}</p>
                </div>
              ))}
              {material.specs.map((spec) => (
                <div key={`${spec.label}-${spec.value}`} className="bg-paper p-6 md:p-8">
                  <p className="text-xs text-forest/45">{spec.label}</p>
                  <p className="mt-3 text-lg font-light leading-8 text-forest">{spec.value}</p>
                </div>
              ))}
              {material.care ? <div className="bg-paper p-6 md:col-span-2 md:p-8"><p className="text-xs text-forest/45">نگهداری</p><p className="mt-3 max-w-3xl text-sm leading-8 text-forest/65">{material.care}</p></div> : null}
            </div>
          </Container>
        </section>
      ) : null}

      {items.length ? (
        <MaterialCategoryCatalog items={items} categoryLabel={material.label} />
      ) : (
        <section className="bg-paper pb-24 pt-4 md:pb-32">
          <Container>
            <div className="flex flex-col items-start justify-between gap-6 border-t border-forest/10 pt-10 sm:flex-row sm:items-center">
              <div><p className="text-xl font-light text-forest">برای انتخاب این متریال راهنمایی می‌خواهید؟</p><p className="mt-2 text-sm text-forest/55">نمونه و جزئیات نهایی در زمان مشاوره بررسی می‌شود.</p></div>
              <Link href="/contact/consultation" className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm text-paper">درخواست مشاوره ←</Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
