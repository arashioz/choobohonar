import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ClipReveal from "@/components/motion/ClipReveal";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import { getMaterialCommerceItems } from "@/data/material-products";
import { isUploadedMedia } from "@/lib/media";
import { fetchPublicMaterialFamilies } from "@/lib/public-materials";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "کتابخانه و فروشگاه متریال | خانه چوب و هنر",
  description: "چوب، پارچه، روکش و فلز؛ مشاهده مشخصات فنی، مقایسه و درخواست نمونه متریال‌های خانه چوب و هنر.",
};

export default async function MaterialsPage() {
  const visibleMaterials = await fetchPublicMaterialFamilies();
  return (
    <>
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#73563d] text-paper">
        <Image
          src="https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg"
          alt="کتابخانه متریال خانه چوب و هنر"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,43,28,0.18)_0%,rgba(9,43,28,0.18)_38%,rgba(9,43,28,0.92)_100%)]" />
        <div className="commerce-grain absolute inset-0 opacity-30" aria-hidden />
        <Container className="relative z-10 pb-12 pt-36 md:pb-16 lg:pb-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end">
            <div>
              <ClipReveal>
                <p className="eyebrow text-peach">Material Library / 2026</p>
              </ClipReveal>
              <ClipReveal delay={0.07} className="mt-6">
                <h1 className="max-w-5xl text-[clamp(4rem,12vw,10rem)] font-extralight leading-[0.78] tracking-[-0.065em]">
                  ماده، پیش از فرم
                </h1>
              </ClipReveal>
            </div>
            <FadeUp delay={0.14} className="border-r border-paper/25 pr-5">
              <p className="text-lg leading-8 text-paper/75">
                کتابخانه‌ای زنده برای لمس، مقایسه و انتخاب موادی که شخصیت هر محصول را می‌سازند.
              </p>
              <Link href="#material-categories" className="mt-7 inline-flex items-center gap-3 text-sm text-peach">
                کشف متریال‌ها <span>↓</span>
              </Link>
            </FadeUp>
          </div>
        </Container>
      </section>

      <section id="material-categories" className="bg-paper py-24 md:py-32 lg:py-40">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <FadeUp>
              <p className="eyebrow text-brick">چوب و پارچه</p>
              <h2 className="mt-6 text-[clamp(3rem,6vw,6rem)] font-extralight leading-[0.9] tracking-tightest text-forest">
                برای چشم،
                <br />
                برای لمس
              </h2>
            </FadeUp>
            <FadeUp delay={0.1} className="max-w-xl lg:justify-self-end">
              <p className="text-lg leading-9 text-forest/60">
                هر خانواده منطق انتخاب خودش را دارد؛ فعلاً چوب و پارچه در کتابخانه باز است و خانواده‌های بعدی به‌تدریج اضافه می‌شوند.
              </p>
            </FadeUp>
          </div>

          <Stagger className="mt-16 grid gap-px bg-forest/10 md:grid-cols-2 lg:mt-24" selector="[data-material-card]">
            {visibleMaterials.map((material, index) => {
              const items = getMaterialCommerceItems(material.id);
              const first = items[0];
              return (
                <Link
                  data-material-card
                  key={material.id}
                  href={`/materials/${material.id}`}
                  className="group relative min-h-[31rem] overflow-hidden bg-paper p-7 md:p-9 lg:min-h-[37rem] lg:p-12"
                >
                  {material.image ? (
                    <>
                      <Image
                        src={material.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized={isUploadedMedia(material.image)}
                        className="object-cover opacity-20 transition-opacity duration-700 group-hover:opacity-35"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,248,245,0.05),rgba(250,248,245,0.9)_76%)]" />
                    </>
                  ) : null}
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <p className="font-display text-2xl text-brick">0{toFa(index + 1)}</p>
                    <p className="text-xs tracking-[0.18em] text-forest/45">{items.length ? `${toFa(items.length)} SAMPLE` : material.eyebrow}</p>
                  </div>

                  <div className="absolute inset-x-7 top-28 z-10 grid grid-cols-3 gap-2 md:inset-x-9 lg:inset-x-12">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.slug} className="aspect-square" style={{ background: `linear-gradient(135deg, ${item.accent}, ${item.color})` }}>
                        <span className="sr-only">{item.name}</span>
                      </div>
                    ))}
                    {!items.length ? <div className="col-span-3 aspect-[3/1] rounded-sm border border-forest/10" style={{ background: `linear-gradient(135deg, ${material.colorHex}, #f4eee6)` }} /> : null}
                  </div>

                  <div className="absolute inset-x-7 bottom-7 z-10 md:inset-x-9 md:bottom-9 lg:inset-x-12 lg:bottom-12">
                    <p className="eyebrow text-brick">{material.eyebrow}</p>
                    <div className="mt-4 flex items-end justify-between gap-6">
                      <div>
                        <h3 className="text-4xl font-extralight tracking-tight text-forest md:text-5xl">{material.label}</h3>
                        <p className="mt-4 max-w-sm text-sm leading-7 text-forest/55">{material.shortDescription}</p>
                      </div>
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-forest/20 text-xl text-forest transition-all duration-500 group-hover:bg-forest group-hover:text-paper">
                        ↙
                      </span>
                    </div>
                  </div>
                  {first ? (
                    <div className="absolute bottom-0 right-0 h-1 w-0 bg-brick transition-all duration-700 ease-out-expo group-hover:w-full" />
                  ) : null}
                </Link>
              );
            })}
          </Stagger>
        </Container>
      </section>

      <section className="bg-forest py-20 text-paper md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <FadeUp>
              <p className="eyebrow text-peach">Material consultation</p>
              <h2 className="mt-5 text-[clamp(2.6rem,5vw,5rem)] font-extralight leading-[0.92] tracking-tightest">
                هنوز میان چند انتخاب مردد هستید؟
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-paper/60">
                تیم متریال بر اساس نور، کاربرد و سبک پروژه، پالت مناسب را کنار هم می‌چیند.
              </p>
            </FadeUp>
            <Link href="/contact/consultation" className="inline-flex min-h-14 items-center justify-center rounded-full bg-peach px-8 text-sm font-medium text-forest transition-colors hover:bg-paper">
              رزرو مشاوره متریال
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
