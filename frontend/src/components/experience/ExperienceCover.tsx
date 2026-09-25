"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

export default function ExperienceCover() {
  const rootRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const media = mediaRef.current;
    if (!root || !media) return;

    const lines = root.querySelectorAll<HTMLElement>("[data-hero-line]");
    const cta = root.querySelector<HTMLElement>("[data-hero-cta]");
    let cancelled = false;

    const showStatic = () => {
      if (cancelled) return;
      registerGsap();
      gsap.set([cta, ...Array.from(lines)], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        clearProps: "transform",
      });
    };

    if (prefersReducedMotion()) {
      showStatic();
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const failsafe = window.setTimeout(showStatic, 3200);

    try {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.set(lines, { yPercent: 110 });
        gsap.set(cta, { opacity: 0, y: 20 });

        gsap
          .timeline({
            onComplete: () => window.clearTimeout(failsafe),
          })
          .fromTo(media, { scale: 1.12 }, { scale: 1, duration: 1.55, ease: "power2.out" })
          .to(lines, { yPercent: 0, duration: 0.75, ease: "power4.out", stagger: 0.08 }, "-=0.45")
          .to(cta, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.35");
      }, root);
    } catch {
      showStatic();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={rootRef} className="relative h-[100svh] w-full overflow-hidden bg-forest">
      <div ref={mediaRef} className="absolute inset-0 will-change-transform">
        <img
          src="/experience/wall-mobile.jpg"
          alt="نهمین نمایشگاه معماری تهران، مهر ۱۴۰۵، برج میلاد"
          className="h-full w-full object-cover md:hidden"
        />
        <img
          src="/experience/wall-desktop.jpg"
          alt=""
          className="hidden h-full w-full object-cover md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/15 to-forest/25" />
      </div>
      <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-container flex-col justify-end px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:px-16">
        <h1 className="max-w-4xl text-balance text-[clamp(1.75rem,4.5vw,5rem)] font-light leading-[1.1] tracking-tightest text-paper">
          <span className="block overflow-hidden py-[0.04em] [transform:translateZ(0)]">
            <span data-hero-line className="block will-change-transform">
              نهمین نمایشگاه معماری تهران
            </span>
          </span>
        </h1>
        <p
          data-hero-cta
          className="mt-8 max-w-md text-sm leading-7 text-paper/80 sm:mt-10 md:text-base"
        >
          ۹ تا ۱۲ مهر ۱۴۰۵ · برج میلاد · ۱۴ تا ۲۰
        </p>
      </div>
    </section>
  );
}
