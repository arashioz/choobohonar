import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import FadeUp from "@/components/motion/FadeUp";
import { getMaterial } from "@/data/materials";
import {
  getMaterialCommerceItem,
  getMaterialCommerceItems,
  materialCommerceItems,
} from "@/data/material-products";
import { shopProducts } from "@/data/products";
import { toFa } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return materialCommerceItems.map((item) => ({ slug: item.categoryId, item: item.slug }));
}

type PageProps = { params: Promise<{ slug: string; item: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, item: itemSlug } = await params;
  const item = getMaterialCommerceItem(slug, itemSlug);
  const material = getMaterial(slug);
  if (!item || !material) return { title: "نمونه متریال یافت نشد | خانه چوب و هنر" };
  return {
    title: `${item.name} | متریال ${material.label}`,
    description: item.description,
    openGraph: {
      title: `${item.name} | خانه چوب و هنر`,
      description: item.description,
      images: [item.applicationImage],
      locale: "fa_IR",
    },
  };
}

export default async function MaterialProductPage({ params }: PageProps) {
  const { slug, item: itemSlug } = await params;
  const item = getMaterialCommerceItem(slug, itemSlug);
  const material = getMaterial(slug);
  if (!item || !material) notFound();
  const relatedMaterials = getMaterialCommerceItems(material.id).filter((entry) => entry.slug !== item.slug).slice(0, 3);
  const relatedProducts = shopProducts
    .filter((product) => product.image && product.room !== "bedding")
    .slice(item.categoryId === "fabric" ? 4 : 0, item.categoryId === "fabric" ? 7 : 3);

  const actionLabel =
    item.commerceMode === "direct"
      ? "خرید متریال"
      : item.commerceMode === "sample"
        ? "درخواست نمونه"
        : "درخواست پیش‌فاکتور";

  return (
    <>
      <section className="relative min-h-[88svh] overflow-hidden bg-forest text-paper">
        <div className="absolute inset-0 grid lg:grid-cols-2">
          <div className="relative min-h-[50svh] lg:min-h-full">
            <Image src={item.applicationImage} alt={`کاربرد ${item.name}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-transparent to-forest/20" />
          </div>
          <div className="relative hidden lg:block" style={{ background: `linear-gradient(145deg, ${item.accent}, ${item.color})` }}>
            <div className="absolute inset-12 border border-white/20" />
            <div className="commerce-grain absolute inset-0 opacity-25" />
            <p className="absolute bottom-16 left-16 text-xs tracking-[0.28em] text-white/60">CHH MATERIAL / {item.code}</p>
          </div>
        </div>

        <Container className="relative z-10 flex min-h-[88svh] flex-col justify-end pb-12 pt-36 md:pb-16">
          <nav className="mb-auto flex flex-wrap items-center gap-2 text-xs text-paper/65">
            <Link href="/" className="hover:text-paper">خانه</Link>
            <span>/</span>
            <Link href="/materials" className="hover:text-paper">متریال</Link>
            <span>/</span>
            <Link href={`/materials/${material.id}`} className="hover:text-paper">{material.label}</Link>
            <span>/</span>
            <span className="text-peach">{item.name}</span>
          </nav>

          <div className="max-w-2xl bg-forest/80 p-6 backdrop-blur-md md:p-9 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <p className="eyebrow text-peach">{material.label} / {item.code}</p>
            <h1 className="mt-5 text-[clamp(3.5rem,7vw,7rem)] font-extralight leading-[0.86] tracking-tightest">{item.name}</h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-paper/70">{item.subtitle}</p>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28 lg:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-24">
            <div>
              <FadeUp>
                <p className="eyebrow text-brick">Material profile</p>
                <h2 className="mt-5 max-w-3xl text-[clamp(2.7rem,5vw,5rem)] font-extralight leading-[0.92] tracking-tightest text-forest">
                  یک انتخاب برای لمس نزدیک‌تر
                </h2>
                <p className="mt-7 max-w-3xl text-xl leading-10 text-forest/60">{item.description}</p>
              </FadeUp>

              <div className="mt-14 grid gap-px bg-forest/10 sm:grid-cols-2">
                {item.specs.map((spec, index) => (
                  <FadeUp key={spec.label} delay={index * 0.05} className="bg-paper p-6 md:p-8">
                    <p className="text-xs tracking-[0.18em] text-forest/40">0{toFa(index + 1)}</p>
                    <p className="mt-4 text-sm text-forest/50">{spec.label}</p>
                    <p className="mt-2 text-xl font-light text-forest">{spec.value}</p>
                  </FadeUp>
                ))}
                <div className="bg-paper p-6 md:p-8">
                  <p className="text-xs tracking-[0.18em] text-forest/40">0{toFa(item.specs.length + 1)}</p>
                  <p className="mt-4 text-sm text-forest/50">واحد سفارش</p>
                  <p className="mt-2 text-xl font-light text-forest">{item.unit}</p>
                </div>
              </div>

              <div className="mt-16 grid gap-10 border-t border-forest/10 pt-12 md:grid-cols-2">
                <div>
                  <p className="eyebrow text-brick">کاربردهای پیشنهادی</p>
                  <ul className="mt-6 divide-y divide-forest/10 border-t border-forest/10">
                    {item.uses.map((use) => (
                      <li key={use} className="flex items-center justify-between py-4 text-forest">
                        {use}<span className="text-brick">↙</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="eyebrow text-brick">نگهداری</p>
                  <p className="mt-6 text-base leading-8 text-forest/60">{item.care}</p>
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="border border-forest/10 bg-white/55 p-6 md:p-8">
                <div className="aspect-[4/3] p-5" style={{ background: `linear-gradient(145deg, ${item.accent}, ${item.color})` }}>
                  <div className="flex h-full flex-col justify-between border border-white/25 p-4 text-white">
                    <span className="text-[10px] tracking-[0.22em]">{item.code}</span>
                    <span className="text-xs">PHYSICAL SAMPLE</span>
                  </div>
                </div>
                <p className="mt-6 text-xs text-forest/45">روش سفارش</p>
                <p className="mt-2 text-2xl font-light text-forest">{item.priceLabel}</p>
                <p className="mt-3 text-sm leading-7 text-forest/50">نمونه نهایی ممکن است به دلیل ماهیت طبیعی متریال، تفاوت جزئی رنگ و بافت داشته باشد.</p>
                <Link
                  href={`/contact/consultation?material=${item.slug}`}
                  className="mt-7 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-forest px-6 text-sm font-medium text-paper transition-colors hover:bg-brick"
                >
                  {actionLabel}
                </Link>
                <Link href="/contact" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-forest/15 px-6 text-sm text-forest hover:border-forest">
                  گفتگو با کارشناس
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-20 md:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brick">Same family</p>
              <h2 className="mt-5 text-4xl font-extralight tracking-tight text-forest md:text-6xl">نمونه‌های هم‌خانواده</h2>
            </div>
            <Link href={`/materials/${material.id}`} className="text-sm text-forest">همه {material.label}ها ←</Link>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedMaterials.map((related) => (
              <Link key={related.slug} href={`/materials/${related.categoryId}/${related.slug}`} className="group block">
                <div className="aspect-[5/4] p-5" style={{ background: `linear-gradient(145deg, ${related.accent}, ${related.color})` }}>
                  <div className="flex h-full items-end justify-between border border-white/25 p-5 text-white">
                    <span>{related.code}</span><span>↙</span>
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-light text-forest">{related.name}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="eyebrow text-brick">In application</p>
              <h2 className="mt-5 text-4xl font-extralight tracking-tight text-forest md:text-6xl">محصولات پیشنهادی</h2>
            </div>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((product) => <CommerceProductCard key={product.slug} product={product} />)}
          </div>
        </Container>
      </section>
    </>
  );
}
