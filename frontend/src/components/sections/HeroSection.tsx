"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { brandAssets } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

/**
 * White cloth pulled from the green floor.
 * 4 cubics / state. Flanks tuck inward; crest stays modest and rounded.
 */
const WHITE = {
  rest:
    "M0 80 C32 80 55 80 68 80 C82 80 90 80 100 80 C110 80 118 80 132 80 C145 80 168 80 200 80 L200 80 L0 80 Z",
  // Weight gathers — sides already draw inward
  tension:
    "M0 80 C32 80 55 77 68 72 C82 66 90 64 100 64 C110 64 118 66 132 72 C145 77 168 80 200 80 L200 80 L0 80 Z",
  // Pinch — rounded crest, deep inward waists on both flanks
  pull:
    "M0 80 C34 80 58 75 70 68 C84 58 92 55 100 55 C108 55 116 58 130 68 C142 75 166 80 200 80 L200 80 L0 80 Z",
} as const;

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
      // Keep white fabric hidden at rest
      const fabric = el.querySelector<SVGPathElement>("[data-hero-fabric]");
      if (fabric) gsap.set(fabric, { attr: { d: WHITE.rest } });
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

        const fabric = el.querySelector<SVGPathElement>("[data-hero-fabric]");
        const shade = el.querySelector<SVGPathElement>("[data-hero-shade]");

        if (fabric) {
          gsap.set(fabric, { attr: { d: WHITE.rest } });
          if (shade) gsap.set(shade, { attr: { d: WHITE.rest }, opacity: 0 });

          const pull = gsap.timeline({ repeat: -1, repeatDelay: 1.45, delay: 0.55 });

          // 1) Slow gather — weight loads, sides tuck in
          pull
            .to(fabric, { attr: { d: WHITE.tension }, duration: 0.58, ease: "power2.in" }, 0)
            .to(shade, { attr: { d: WHITE.tension }, opacity: 0.18, duration: 0.58, ease: "power2.in" }, 0.04)

            // 2) Sharp lift — then immediate release
            .to(fabric, { attr: { d: WHITE.pull }, duration: 0.48, ease: "power3.out" }, 0.58)
            .to(shade, { attr: { d: WHITE.pull }, opacity: 0.28, duration: 0.48, ease: "power3.out" }, 0.62)

            // 3) Heavy drop (no hold)
            .to(fabric, { attr: { d: WHITE.tension }, duration: 0.16, ease: "power4.in" })
            .to(shade, { attr: { d: WHITE.tension }, opacity: 0.12, duration: 0.16, ease: "power4.in" }, "<")

            .to(fabric, { attr: { d: WHITE.rest }, duration: 0.52, ease: "power2.out" })
            .to(shade, { attr: { d: WHITE.rest }, opacity: 0, duration: 0.42, ease: "power2.out" }, "<0.04");
        }

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
        {/* Stronger floor wash so the field reads as solid green */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/45" />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-container flex-col justify-end px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:px-16">
        <p data-hero-eyebrow className="eyebrow mb-3 text-peach sm:mb-4">
          خانه چوب و هنر — میراثی نیم‌قرنی
        </p>
        <h1 className="max-w-4xl text-balance text-[clamp(1.75rem,4.5vw,5rem)] font-light leading-[1.1] tracking-tightest text-paper">
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
      </div>

      {/* White cloth — hidden at rest; rises from the green floor */}
      <div
        data-hero-cue
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[4.5rem] overflow-hidden sm:h-20"
        aria-hidden
      >
        <svg className="h-full w-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <filter id="hero-cloth-soft" x="-8%" y="-20%" width="116%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
              <feOffset dy="1" result="off" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.22" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path data-hero-shade d={WHITE.rest} fill="#041510" opacity="0" />
          <path
            data-hero-fabric
            d={WHITE.rest}
            fill="#F4EFE8"
            filter="url(#hero-cloth-soft)"
          />
        </svg>
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
          <Image src={brandAssets.monogram.white} alt="" fill className="object-contain" priority />
        </div>
      </div>
    </section>
  );
}
