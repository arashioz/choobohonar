import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { interiorCustomizationPieces } from "@/data/interior-architecture";

export default function InteriorCustomizationBand() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">سفارشی‌سازی</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              قطعاتی که برای فضای شما ساخته می‌شوند
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest/68 md:text-lg">
              مبلمان و عناصر چوبی هر پروژه با ابعاد، روکش و جزئیات همان فضا طراحی و در کارگاه ساخته می‌شوند — نه از روی
              کاتالوگ آماده.
            </p>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {interiorCustomizationPieces.map((piece, index) => (
            <FadeUp key={piece.id} delay={index * 0.08}>
              <Link
                href={piece.href}
                className="group relative block overflow-hidden rounded-2xl border border-forest/10 bg-forest"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={piece.image}
                    alt={piece.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-xs tracking-[0.24em] text-peach/85">{piece.eyebrow}</p>
                  <h3 className="mt-2 text-2xl font-light tracking-tight text-paper md:text-3xl">{piece.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-7 text-paper/70">{piece.description}</p>
                </div>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
