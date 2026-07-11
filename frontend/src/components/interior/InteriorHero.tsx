"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";
import { interiorHero } from "@/data/interior-architecture";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/gsap";

export default function InteriorHero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-interior-hero-copy] > *",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.12, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(
        "[data-interior-hero-media]",
        { scale: 1.08 },
        { scale: 1, duration: 2.2, ease: "power2.out" }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative min-h-[92svh] overflow-hidden bg-forest text-paper">
      <div data-interior-hero-media className="absolute inset-0">
        <Image src={interiorHero.image} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest/72" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/70" />
      </div>

      <Container className="relative z-10 flex min-h-[92svh] flex-col justify-end pb-16 pt-32 md:pb-24 md:pt-40">
        <nav className="mb-10 flex items-center gap-2 text-sm text-paper/55">
          <Link href="/" className="transition-colors hover:text-paper">
            خانه
          </Link>
          <span>/</span>
          <span className="text-paper/85">{interiorHero.eyebrow}</span>
        </nav>

        <div data-interior-hero-copy className="max-w-3xl">
          <p className="eyebrow text-peach">{interiorHero.eyebrow}</p>
          <h1 className="mt-6 text-balance text-[clamp(2.25rem,6vw,4.75rem)] font-light leading-[1.02] tracking-tightest">
            {interiorHero.title}
          </h1>
          <p className="mt-5 text-xl font-light text-peach/95 md:text-2xl">{interiorHero.subtitle}</p>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-paper/78 md:text-lg">
            {interiorHero.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/interior-architecture-services/order" variant="primary" showArrow>
              شروع فرم سفارش طراحی
            </Button>
            <Link
              href="/projects"
              className="inline-flex items-center gap-3 rounded-xl border border-paper/30 px-7 py-4 text-sm font-medium text-paper transition-colors hover:border-paper hover:bg-paper hover:text-forest"
            >
              مشاهده پروژه‌ها
              <span aria-hidden>←</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
