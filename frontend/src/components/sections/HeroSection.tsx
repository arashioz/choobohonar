"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const monogram = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const [loaderHidden, setLoaderHidden] = useState(false);

  useEffect(() => {
    const el = root.current ?? document.getElementById("top");
    if (!el) return;

    const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
    const eyebrow = el.querySelector<HTMLElement>("[data-hero-eyebrow]");
    const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
    let cancelled = false;

    const hideLoader = () => {
      if (cancelled) return;
      setLoaderHidden(true);
    };

    const showStatic = () => {
      if (cancelled) return;
      registerGsap();
      gsap.set([eyebrow, cue, ...Array.from(lines)], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        clearProps: "transform",
      });
      hideLoader();
    };

    const failsafe = window.setTimeout(showStatic, 2200);
    const hardFailsafe = window.setTimeout(showStatic, 5000);

    if (prefersReducedMotion()) {
      showStatic();
      return () => {
        cancelled = true;
        window.clearTimeout(failsafe);
        window.clearTimeout(hardFailsafe);
      };
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;

    try {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.set(lines, { yPercent: 110 });
        gsap.set([eyebrow, cue], { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          onComplete: () => {
            window.clearTimeout(failsafe);
            window.clearTimeout(hardFailsafe);
            hideLoader();
          },
        });

        tl.fromTo(
          monogram.current,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }
        )
          .to(monogram.current, { opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.4")
          .to(loader.current, { yPercent: -100, duration: 1.1, ease: "power4.inOut" }, "-=0.1")
          .fromTo(media.current, { scale: 1.18 }, { scale: 1, duration: 2.6, ease: "power2.out" }, "<")
          .to(lines, { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.12 }, "-=0.7")
          .to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
          .to(cue, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

        gsap.to(media.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: scrollTriggerConfig({
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          }),
        });
      }, el);
    } catch {
      showStatic();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
      window.clearTimeout(failsafe);
      window.clearTimeout(hardFailsafe);
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] w-full overflow-hidden bg-forest">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/anzhelik.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/30 to-forest/40" />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-container flex-col justify-end px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:px-16">
        <p data-hero-eyebrow className="eyebrow mb-4 text-peach sm:mb-6">
          خانه چوب و هنر — میراثی نیم‌قرنی
        </p>
        <h1 className="max-w-5xl text-balance text-[clamp(2rem,5.5vw,7.5rem)] font-light leading-[1.08] tracking-tightest text-paper">
          <span className="block overflow-hidden py-[0.04em]">
            <span data-hero-line className="block will-change-transform">
              فرم،
            </span>
          </span>
          <span className="block overflow-hidden py-[0.04em]">
            <span data-hero-line className="block will-change-transform">
              از <span className="text-peach">احساس</span> پیروی می‌کند
            </span>
          </span>
        </h1>
        <div data-hero-cue className="mt-8 flex items-center gap-3 text-paper/70 sm:mt-12">
          <span className="text-xs tracking-[0.25em]">اسکرول کنید</span>
          <span className="relative flex h-10 w-px justify-center bg-paper/30">
            <span className="absolute top-0 h-3 w-px animate-scroll-cue bg-peach" />
          </span>
        </div>
      </div>

      <div
        ref={loader}
        aria-hidden={loaderHidden}
        className={cn(
          "hero-loader absolute inset-0 z-30 flex items-center justify-center bg-forest",
          loaderHidden &&
            "pointer-events-none invisible -translate-y-full opacity-0 transition-[transform,opacity,visibility] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]"
        )}
      >
        <div ref={monogram} className="relative h-16 w-[72px] opacity-0 sm:h-20 sm:w-[90px]">
          <Image src="/brand/monogram-white.svg" alt="" fill className="object-contain" priority />
        </div>
      </div>
    </section>
  );
}
