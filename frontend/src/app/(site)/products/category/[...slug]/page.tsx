import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CategoryCatalog from "@/components/commerce/CategoryCatalog";
import Container from "@/components/layout/Container";
import ClipReveal from "@/components/motion/ClipReveal";
import FadeUp from "@/components/motion/FadeUp";
import {
  commerceCategories,
  getCommerceCategoryProducts,
  resolveCommerceCategory,
} from "@/data/commerce";
import { toFa } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return commerceCategories.flatMap((category) => [
    { slug: [category.slug] },
    ...category.children.map((child) => ({ slug: [category.slug, child.slug] })),
  ]);
}

type PageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = resolveCommerceCategory(slug);
  if (!category) return { title: "دسته‌بندی یافت نشد | خانه چوب و هنر" };
  const label = category.active?.label ?? category.root.label;
  return {
    title: `${label} | فروشگاه خانه چوب و هنر`,
    description: category.active
      ? `محصولات ${category.active.label} از مجموعه ${category.root.label} خانه چوب و هنر.`
      : category.root.description,
    openGraph: {
      title: `${label} | خانه چوب و هنر`,
      description: category.root.description,
      images: [category.root.image],
      locale: "fa_IR",
    },
  };
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = resolveCommerceCategory(slug);
  if (!category) notFound();
  const products = getCommerceCategoryProducts(category);
  const activeLabel = category.active?.label ?? category.root.label;

  return (
    <>
      <section className="relative flex min-h-[76svh] items-end overflow-hidden bg-forest text-paper">
        <Image
          src={category.root.image}
          alt={activeLabel}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,29,19,0.28)_0%,rgba(6,29,19,0.2)_30%,rgba(6,29,19,0.88)_100%)]" />
        <div className="commerce-grain absolute inset-0 opacity-25" aria-hidden />

        <Container className="relative z-10 pb-10 pt-36 md:pb-14 lg:pb-16">
          <nav className="mb-10 flex flex-wrap items-center gap-2 text-xs text-paper/60">
            <Link href="/" className="hover:text-paper">خانه</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-paper">محصولات</Link>
            {category.active ? (
              <>
                <span>/</span>
                <Link href={`/products/category/${category.root.slug}`} className="hover:text-paper">{category.root.label}</Link>
              </>
            ) : null}
            <span>/</span>
            <span className="text-peach">{activeLabel}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <ClipReveal>
                <p className="eyebrow text-peach">{category.root.eyebrow}</p>
              </ClipReveal>
              <ClipReveal delay={0.06} className="mt-6">
                <h1 className="text-[clamp(4rem,12vw,10rem)] font-extralight leading-[0.78] tracking-[-0.065em]">
                  {activeLabel}
                </h1>
              </ClipReveal>
            </div>
            <FadeUp delay={0.12} className="border-r border-paper/25 pr-5">
              <p className="text-lg leading-8 text-paper/75">
                {category.active
                  ? `${category.active.label}؛ بخشی از ${category.root.label} با انتخاب‌هایی برای سبک‌ها و مقیاس‌های متفاوت.`
                  : category.root.story}
              </p>
              <p className="mt-5 text-xs tracking-[0.2em] text-peach">{toFa(products.length)} PRODUCT</p>
            </FadeUp>
          </div>
        </Container>
      </section>

      {category.root.children.length ? (
        <section className="border-b border-forest/10 bg-paper py-7">
          <Container>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
              <Link
                href={`/products/category/${category.root.slug}`}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
                  !category.active ? "bg-forest text-paper" : "border border-forest/15 text-forest hover:border-forest"
                }`}
              >
                همه {category.root.label}
              </Link>
              {category.root.children.map((child) => (
                <Link
                  key={child.slug}
                  href={`/products/category/${category.root.slug}/${child.slug}`}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
                    category.active?.slug === child.slug
                      ? "bg-forest text-paper"
                      : "border border-forest/15 text-forest hover:border-forest"
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <Suspense fallback={<div className="min-h-[40rem] bg-paper" />}>
        <CategoryCatalog products={products} categoryLabel={activeLabel} campaignImage={category.root.image} />
      </Suspense>
    </>
  );
}
