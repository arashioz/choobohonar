import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import MaterialCategoryCatalog from "@/components/materials/MaterialCategoryCatalog";
import ClipReveal from "@/components/motion/ClipReveal";
import FadeUp from "@/components/motion/FadeUp";
import { getMaterial, materials } from "@/data/materials";
import { getMaterialCommerceItems } from "@/data/material-products";
import { toFa } from "@/lib/utils";

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.id }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = getMaterial(slug);
  if (!material) return { title: "متریال یافت نشد | خانه چوب و هنر" };
  return {
    title: `${material.label} | فروشگاه متریال خانه چوب و هنر`,
    description: material.longDescription,
  };
}

export default async function MaterialCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const material = getMaterial(slug);
  if (!material) notFound();
  const items = getMaterialCommerceItems(material.id);
  const heroItem = items[0];

  return (
    <>
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-forest text-paper">
        {heroItem ? (
          <Image src={heroItem.applicationImage} alt={material.label} fill priority sizes="100vw" className="object-cover" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,29,19,0.28)_0%,rgba(6,29,19,0.26)_35%,rgba(6,29,19,0.92)_100%)]" />
        <div className="commerce-grain absolute inset-0 opacity-30" aria-hidden />
        <Container className="relative z-10 pb-12 pt-36 md:pb-16">
          <nav className="mb-10 flex items-center gap-2 text-xs text-paper/60">
            <Link href="/" className="hover:text-paper">خانه</Link>
            <span>/</span>
            <Link href="/materials" className="hover:text-paper">متریال</Link>
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

      <MaterialCategoryCatalog items={items} categoryLabel={material.label} />
    </>
  );
}
