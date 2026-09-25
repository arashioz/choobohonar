import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ClipReveal from "@/components/motion/ClipReveal";
import CatalogPair from "@/components/experience/CatalogPair";
import ExperienceCover from "@/components/experience/ExperienceCover";
import InterludeSection from "@/components/sections/InterludeSection";
import SeasonalProductRails from "@/components/commerce/SeasonalProductRails";
import ExperienceStoreCycle from "@/components/experience/ExperienceStoreCycle";
import ExperienceStories from "@/components/experience/ExperienceStories";
import { shopProducts } from "@/data/products";
import { stores } from "@/data/stores";

export const metadata: Metadata = {
  title: "نهمین نمایشگاه معماری تهران | خانه چوب و هنر",
  description: "تجربه نمایشگاه خانه چوب و هنر در نهمین نمایشگاه معماری تهران. ۹ تا ۱۲ مهر ۱۴۰۵، برج میلاد.",
  alternates: { canonical: "/Experience" },
};

const catalogs = [
  {
    title: "دکور و اکسسوری",
    edition: "ACCESSORY",
    image: "/experience/catalogs/accessory-cover.jpg",
    file: "/experience/catalogs/accessory.pdf",
    alt: "جلد کاتالوگ دکور و اکسسوری",
  },
  {
    title: "روشنایی",
    edition: "LIGHT",
    image: "/experience/catalogs/light-cover.jpg",
    file: "/experience/catalogs/light.pdf",
    alt: "جلد کاتالوگ روشنایی",
  },
  {
    title: "ساعت",
    edition: "CLOCK",
    image: "/experience/catalogs/clock-cover.jpg",
    file: "/experience/catalogs/clock.pdf",
    alt: "جلد کاتالوگ ساعت",
  },
];

const laterCatalogs = [
  {
    title: "فرش",
    edition: "RUG",
    image: "/experience/catalogs/rug-cover.jpg",
    file: "/experience/catalogs/rug.pdf",
    alt: "جلد کاتالوگ فرش",
  },
  {
    title: "پارچه",
    edition: "TEXTILE",
    image: "/experience/catalogs/textile-cover.jpg",
    file: "/experience/catalogs/textile.pdf",
    alt: "جلد کاتالوگ پارچه",
  },
  {
    title: "کالای خواب",
    edition: "MATTRESS",
    image: "/experience/catalogs/mattress-cover.jpg",
    file: "/experience/catalogs/mattress.pdf",
    alt: "برگ کاتالوگ تشک",
  },
];

export default function ExperiencePage() {
  const featured = shopProducts.filter(
    (product) => product.image && (product.room === "decor" || product.room === "lighting"),
  );
  const branches = stores.filter((store) => store.kind === "branch");
  const agencies = stores.filter((store) => store.kind === "agency");

  return (
    <>
      <ExperienceCover />
      <InterludeSection />
      <ExperienceStories />

      <CatalogPair catalogs={catalogs} kicker="کاتالوگ" title="سه برگ از مجموعه" />

      <CatalogPair catalogs={laterCatalogs} kicker="ادامه مجموعه" title="سه برگ دیگر" tone="paper" />

      <section className="bg-paper py-16 md:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brick">بعد از نمایشگاه</p>
              <h2 className="mt-5 text-[clamp(2.2rem,4vw,4rem)] font-extralight leading-none tracking-tightest text-forest">
                شعب و نمایندگی‌ها
              </h2>
            </div>
            <Link href="/stores" className="text-sm text-forest/70">
              جزئیات فروشگاه‌ها
            </Link>
          </div>
          <ExperienceStoreCycle stores={[...branches, ...agencies]} />
        </Container>
      </section>

      <section className="bg-forest">
        <ClipReveal>
          <img
            src="/experience/banners/plp-03.jpg"
            alt="چیدمان نشیمن از بنر مجموعه"
            width={2400}
            height={1018}
            className="block h-auto w-full"
          />
        </ClipReveal>
      </section>

      <section className="bg-[#e8ded2] py-16 md:py-24">
        <Container>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brick">در نمایشگاه</p>
              <h2 className="mt-5 text-[clamp(2.4rem,4.5vw,4.2rem)] font-extralight leading-none tracking-tightest text-forest">
                از نزدیک
              </h2>
            </div>
            <Link href="/products" className="group inline-flex items-center gap-3 text-sm text-forest">
              مشاهده همه محصولات
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            </Link>
          </div>
          <SeasonalProductRails products={featured} />
        </Container>
      </section>
    </>
  );
}
