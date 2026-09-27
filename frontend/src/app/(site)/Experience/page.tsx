import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ClipReveal from "@/components/motion/ClipReveal";
import CatalogPair from "@/components/experience/CatalogPair";
import ExperienceAbout from "@/components/experience/ExperienceAbout";
import ExperienceCover from "@/components/experience/ExperienceCover";
import ExperienceProjects from "@/components/experience/ExperienceProjects";
import ExperienceStoreCycle from "@/components/experience/ExperienceStoreCycle";
import { stores } from "@/data/stores";
import { fetchPublicProjects } from "@/lib/public-projects";

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
    title: "منسوجات",
    edition: "TEXTILE",
    image: "/experience/catalogs/textile-cover.jpg",
    file: "/experience/catalogs/textile.pdf",
    alt: "جلد کاتالوگ منسوجات",
  },
  {
    title: "کالای خواب",
    edition: "MATTRESS",
    image: "/experience/catalogs/mattress-cover.jpg",
    file: "/experience/catalogs/mattress.pdf",
    alt: "ست کالای خواب خانه چوب و هنر",
    frame: "object-center",
  },
  {
    title: "نشیمن و غذاخوری",
    edition: "LIVING",
    image: "/experience/catalogs/living-cover.jpg",
    file: "/experience/catalogs/living.pdf",
    alt: "کاتالوگ نشیمن و غذاخوری خانه چوب و هنر",
    frame: "object-center",
  },
];

export default async function ExperiencePage() {
  const projects = await fetchPublicProjects();
  const branches = stores.filter((store) => store.kind === "branch");
  const agencies = stores.filter((store) => store.kind === "agency");

  return (
    <>
      <ExperienceCover />
      <ExperienceAbout />

      <CatalogPair catalogs={catalogs} kicker="کاتالوگ" title="سه برگ از مجموعه" />

      <CatalogPair
        catalogs={laterCatalogs}
        kicker="ادامه مجموعه"
        title="از فرش تا نشیمن"
        tone="paper"
        aside={
          <div className="flex h-full flex-col justify-between gap-8 border border-forest/10 bg-forest/[0.03] px-5 py-8 sm:px-8 md:px-10 md:py-12">
            <div>
              <p className="eyebrow text-brick">چوب و هنر</p>
              <h3 className="mt-5 max-w-md text-balance text-[clamp(1.7rem,3vw,2.6rem)] font-extralight leading-[1.2] tracking-tightest">
                هر برگ، گوشه‌ای از خانه
              </h3>
            </div>
            <div className="max-w-xl">
              <p className="text-pretty text-base leading-8 text-forest/72">
                فرش، منسوجات، کالای خواب و نشیمن و غذاخوری را می‌توانید همین‌جا دانلود کنید و بعد از نمایشگاه همراه داشته باشید.
              </p>
              <p className="mt-5 text-pretty text-base leading-8 text-forest/72">
                خانه چوب و هنر از پیوند صنعتگری و تجربهٔ زیستن در خانه شکل گرفته است. بیش از پنج دهه، این مسیر با آرامش ادامه داشته؛ از کارگاه تا کنجی که در آن زندگی می‌کنید.
              </p>
            </div>
          </div>
        }
      />

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

      <ExperienceProjects projects={projects} />
    </>
  );
}
