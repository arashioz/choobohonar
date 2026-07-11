import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import MagazineList from "@/components/magazine/MagazineList";

export const metadata: Metadata = {
  title: "مجله | خانه چوب و هنر",
  description:
    "مجله‌ی خانه چوب و هنر؛ راهنمای خرید، مراقبت از چوب، الهام دکوراسیون و پشت صحنه‌ی ساخت مبلمان.",
};

export default function MagazineIndexPage() {
  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">مجله</span>
        </nav>

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h1"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            مجله
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            یادداشت‌هایی درباره‌ی چوب، طراحی و زندگی در خانه‌ای که دوستش دارید.
          </FadeUp>
        </div>

        <MagazineList />
      </Container>
    </section>
  );
}
