import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { brand } from "@/data/nav";
import { stores, storesHero, storeKindLabel } from "@/data/stores";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "فروشگاه‌ها | خانه چوب و هنر",
  description:
    "آدرس شعب تهران و نمایندگی‌های خانه چوب و هنر در شیراز، بندرعباس و تبریز. برای اخذ نمایندگی با ما در تماس باشید.",
};

export default function StoresPage() {
  const branches = stores.filter((store) => store.kind === "branch");
  const agencies = stores.filter((store) => store.kind === "agency");

  return (
    <>
      <section className="relative min-h-[70svh] overflow-hidden bg-forest text-paper">
        <div className="absolute inset-0">
          <Image
            src={storesHero.image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-forest/72" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/50 to-forest/70" />
        </div>

        <Container className="relative z-10 flex min-h-[70svh] flex-col justify-end pb-16 pt-32 md:pb-24 md:pt-40">
          <nav className="mb-10 flex items-center gap-2 text-sm text-paper/55">
            <Link href="/" className="transition-colors hover:text-paper">
              خانه
            </Link>
            <span>/</span>
            <span className="text-paper/85">فروشگاه‌ها</span>
          </nav>
          <FadeUp>
            <p className="eyebrow text-peach">{storesHero.eyebrow}</p>
            <h1 className="mt-6 max-w-3xl text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest">
              {storesHero.title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-paper/78 md:text-lg">
              {storesHero.body}
            </p>
          </FadeUp>
        </Container>
      </section>

      <section className="bg-paper py-24 md:py-32">
        <Container>
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">تهران</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest text-forest">
              شعب خانه
            </h2>
          </FadeUp>

          <ol className="mt-12 divide-y divide-forest/10 border-y border-forest/10">
            {branches.map((store, index) => (
              <StoreRow key={store.id} store={store} index={index} />
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-24 md:py-32">
        <Container>
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">شهرهای دیگر</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest text-forest">
              نمایندگی‌ها
            </h2>
          </FadeUp>

          <ol className="mt-12 divide-y divide-forest/10 border-y border-forest/10">
            {agencies.map((store, index) => (
              <StoreRow key={store.id} store={store} index={index} />
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-peach py-24 text-forest md:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <FadeUp className="lg:col-span-7">
              <p className="eyebrow text-brick">همکاری فروش</p>
              <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.75rem)] font-light leading-[1.02] tracking-tightest">
                نماینده شوید
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest/70">
                اگر فضای فروش دارید و می‌خواهید محصولات خانه چوب و هنر را نمایندگی کنید، مشخصات فروشگاه را برای ما بفرستید.
              </p>
            </FadeUp>
            <FadeUp delay={0.08} className="lg:col-span-4 lg:col-start-9">
              <Button href="/contact/representation" variant="primary" showArrow>
                درخواست نمایندگی
              </Button>
              <p className="mt-6 text-sm text-forest/60">
                {brand.phone}
                <span className="mx-2 text-forest/30">/</span>
                <span dir="ltr">{brand.email}</span>
              </p>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}

function StoreRow({
  store,
  index,
}: {
  store: (typeof stores)[number];
  index: number;
}) {
  return (
    <li className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-start md:gap-8 md:py-10">
      <span className="font-sans text-sm text-brick md:col-span-1">{toFa(index + 1).padStart(2, "۰")}</span>
      <div className="md:col-span-4">
        <p className="text-xs tracking-[0.2em] text-forest/45">{storeKindLabel[store.kind]}</p>
        <h3 className="mt-2 text-2xl font-light tracking-tight text-forest md:text-3xl">{store.name}</h3>
        <p className="mt-1 text-sm text-forest/55">{store.city}</p>
      </div>
      <div className="space-y-2 text-base leading-8 text-forest/70 md:col-span-7">
        {store.address ? <p>{store.address}</p> : null}
        {store.phone ? (
          <p>
            <a href={`tel:${store.phone}`} dir="ltr" className="transition-colors hover:text-brick">
              {store.phone}
            </a>
          </p>
        ) : null}
        {store.hours ? <p>{store.hours}</p> : null}
      </div>
    </li>
  );
}
