import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import ImmersiveMaterialsBanner from "@/components/commerce/ImmersiveMaterialsBanner";
import ProductStoriesRail from "@/components/commerce/ProductStoriesRail";
import ClipReveal from "@/components/motion/ClipReveal";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import { commerceCategories, getFeaturedCommerceProducts } from "@/data/commerce";

export default function ProductsLanding() {
  const featured = getFeaturedCommerceProducts(8);
  const stories = getFeaturedCommerceProducts(10).map((product) => ({
    label: product.category,
    title: product.name,
    image: product.image,
  }));
  const heroProduct = featured[0];

  return (
    <>
      <section className="relative flex min-h-[94svh] items-end overflow-hidden bg-forest text-paper">
        {heroProduct?.image ? (
          <Image
            src={heroProduct.image}
            alt="مجموعه محصولات خانه چوب و هنر"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,29,19,0.2)_0%,rgba(6,29,19,0.18)_35%,rgba(6,29,19,0.9)_100%)]" />
        <div className="commerce-grain absolute inset-0 opacity-25" aria-hidden />

        <Container className="relative z-10 pb-12 pt-36 md:pb-16 lg:pb-20">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_20rem]">
            <div>
              <ClipReveal>
                <p className="eyebrow text-peach">The Home Collection / 2026</p>
              </ClipReveal>
              <ClipReveal delay={0.08} className="mt-6">
                <h1 className="max-w-5xl text-[clamp(4rem,12vw,10.5rem)] font-extralight leading-[0.76] tracking-[-0.065em] text-paper">
                  برای زندگی
                  <br />
                  ساخته شده
                </h1>
              </ClipReveal>
            </div>
            <FadeUp delay={0.18} className="border-r border-paper/25 pr-5 lg:pb-2">
              <p className="text-base leading-8 text-paper/75">
                مجموعه‌ای از مبلمان، نور و اشیای خانه؛ طراحی‌شده برای لمس، استفاده و ماندن در زمان.
              </p>
              <Link
                href="/products/category/livingroom"
                className="mt-7 inline-flex items-center gap-3 text-sm font-medium text-peach"
              >
                شروع از نشیمن <span aria-hidden>←</span>
              </Link>
            </FadeUp>
          </div>
        </Container>

        <div className="absolute bottom-0 left-0 hidden border-r border-t border-paper/20 px-6 py-4 text-xs tracking-[0.2em] text-paper/60 md:block">
          SCROLL TO DISCOVER ↓
        </div>
      </section>

      <section className="bg-paper py-24 md:py-32 lg:py-40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <FadeUp>
              <p className="eyebrow text-brick">فضاها و دسته‌ها</p>
              <h2 className="mt-6 max-w-xl text-[clamp(2.8rem,6vw,6rem)] font-extralight leading-[0.9] tracking-tightest text-forest">
                هر اتاق،
                <br />
                یک روایت تازه
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="max-w-2xl lg:justify-self-end">
              <p className="text-lg leading-9 text-forest/60 md:text-xl">
                دسته‌بندی فروشگاه از ساختار واقعی چوب و هنر می‌آید، اما در تجربه‌ای ساده‌تر و تصویری‌تر بازطراحی شده است.
              </p>
            </FadeUp>
          </div>

          <Stagger className="mt-16 grid gap-5 md:grid-cols-2 lg:mt-24" selector="[data-category-card]" amount={0.7}>
            {commerceCategories.map((category, index) => (
              <Link
                data-category-card
                key={category.slug}
                href={`/products/category/${category.slug}`}
                className={`group relative block overflow-hidden bg-forest ${
                  index === 0 || index === 5 ? "md:col-span-2" : ""
                }`}
              >
                <div className={index === 0 || index === 5 ? "aspect-[16/8]" : "aspect-[5/4]"}>
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    sizes={index === 0 || index === 5 ? "100vw" : "50vw"}
                    className="media-hover object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-paper md:p-9 lg:p-12">
                    <div>
                      <p className="text-xs tracking-[0.24em] text-peach">{category.eyebrow}</p>
                      <h3 className="mt-3 text-3xl font-extralight tracking-tight md:text-5xl">{category.label}</h3>
                      <p className="mt-3 hidden max-w-md text-sm leading-7 text-paper/65 sm:block">{category.description}</p>
                    </div>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/30 text-xl transition-[border-color,background-color,color,transform] duration-500 group-hover:-translate-x-1 group-hover:border-peach group-hover:bg-peach group-hover:text-forest group-focus-visible:-translate-x-1 group-focus-visible:border-peach group-focus-visible:bg-peach group-focus-visible:text-forest">
                      ↙
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-24 md:py-32">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <FadeUp>
              <p className="eyebrow text-brick">انتخاب این فصل</p>
              <h2 className="mt-5 text-[clamp(2.7rem,5vw,5.5rem)] font-extralight leading-none tracking-tightest text-forest">
                هشت قطعه، هشت حضور
              </h2>
            </FadeUp>
            <Link href="/products/category/livingroom" className="group inline-flex items-center gap-3 text-sm text-forest">
              مشاهده کاتالوگ کامل
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            </Link>
          </div>

          <div className="mt-14 grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {featured.map((product, index) => (
              <FadeUp key={product.slug} delay={Math.min(index * 0.04, 0.2)} className="h-full">
                <CommerceProductCard product={product} imageAspect="portrait" />
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      <section className="overflow-hidden bg-forest py-24 text-paper md:py-32 lg:py-40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <FadeUp>
              <p className="eyebrow text-peach">Product Stories</p>
              <h2 className="mt-6 text-[clamp(2.8rem,6vw,6rem)] font-extralight leading-[0.9] tracking-tightest">
                نزدیک‌تر
                <br />
                از همیشه
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-9 text-paper/60">
                جایگاه ویدیوهای عمودی برای دیدن بافت، مقیاس و جزئیات واقعی محصول. زیرساخت برای اتصال به محتوای ویدیویی CMS آماده است.
              </p>
            </FadeUp>
          </div>

          <ProductStoriesRail stories={stories} />
        </Container>
      </section>

      <ImmersiveMaterialsBanner />
    </>
  );
}
