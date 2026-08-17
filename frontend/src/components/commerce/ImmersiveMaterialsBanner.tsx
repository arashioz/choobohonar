"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  scrollTriggerConfig,
} from "@/lib/gsap";

export default function ImmersiveMaterialsBanner() {
  const rootRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLAnchorElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    const cta = ctaRef.current;
    if (!root || !panel || !cta) return;
    let signalTimer: number | undefined;

    const signal = () => {
      if (signalTimer) window.clearTimeout(signalTimer);
      cta.classList.remove("is-prompting");
      window.requestAnimationFrame(() => {
        cta.classList.add("is-prompting");
        signalTimer = window.setTimeout(() => cta.classList.remove("is-prompting"), 2800);
      });
    };

    if (prefersReducedMotion()) {
      signal();
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        panel,
        {
          yPercent: 18,
          scale: 0.9,
          clipPath: "inset(8% 4% 7% 4% round 2rem)",
          filter: "brightness(0.72)",
        },
        {
          yPercent: 0,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          filter: "brightness(1)",
          ease: "none",
          scrollTrigger: scrollTriggerConfig({
            trigger: root,
            start: "top bottom",
            end: "top top",
            scrub: 1.15,
          }),
        },
      );

      gsap.fromTo(
        panel.querySelector("[data-material-copy]"),
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power4.out",
          duration: 1.25,
          scrollTrigger: scrollTriggerConfig({
            trigger: root,
            start: "top 38%",
            once: true,
            onEnter: signal,
            onEnterBack: signal,
          }),
        },
      );
    }, root);

    return () => {
      if (signalTimer) window.clearTimeout(signalTimer);
      ctx.revert();
    };
  }, []);

  const moveCta = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion()) return;
    const cta = ctaRef.current;
    if (!cta) return;
    const rect = cta.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cta.style.setProperty("--glow-x", `${x}px`);
    cta.style.setProperty("--glow-y", `${y}px`);
    gsap.to(cta, {
      x: (x - rect.width / 2) * 0.1,
      y: (y - rect.height / 2) * 0.16,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const resetCta = () => {
    if (!ctaRef.current) return;
    gsap.to(ctaRef.current, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
  };

  return (
    <section ref={rootRef} className="relative h-[145svh] bg-[#e8ded2]" aria-label="کتابخانه متریال">
      <Link
        ref={panelRef}
        href="/materials"
        className="group sticky top-0 block h-[100svh] overflow-hidden bg-forest text-paper will-change-transform"
      >
        <Image
          src="https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg"
          alt="متریال‌های خانه چوب و هنر"
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-[1800ms] ease-out-expo group-hover:scale-[1.025]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,29,19,0.94)_0%,rgba(6,29,19,0.74)_40%,rgba(6,29,19,0.2)_76%,rgba(6,29,19,0.36)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(6,29,19,0.7)_0%,transparent_45%)]" />
        <div className="commerce-grain absolute inset-0 opacity-25" aria-hidden />

        <div className="absolute inset-5 border border-paper/15 md:inset-8 lg:inset-12" aria-hidden />
        <div className="absolute left-8 top-9 hidden text-[10px] tracking-[0.28em] text-paper/55 md:block lg:left-14 lg:top-14">
          MATERIAL INDEX / 2026
        </div>
        <div className="absolute bottom-9 left-8 hidden items-center gap-3 text-[10px] tracking-[0.22em] text-paper/55 md:flex lg:bottom-14 lg:left-14">
          <span className="h-px w-12 bg-paper/30" />
          SCROLL / ENTER THE LIBRARY
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-container items-end px-8 pb-24 pt-32 md:px-16 md:pb-28 lg:px-24 lg:pb-24">
          <div data-material-copy className="max-w-4xl">
            <p className="eyebrow text-peach">Material Library / 04 Families</p>
            <h2 className="mt-7 text-[clamp(4rem,11vw,10.5rem)] font-extralight leading-[0.76] tracking-[-0.06em]">
              ماده،
              <br />
              قبل از فرم
            </h2>
            <div className="mt-9 flex flex-col gap-8 border-r border-paper/25 pr-5 md:flex-row md:items-end md:justify-between md:pr-7">
              <p className="max-w-xl text-base leading-8 text-paper/70 md:text-lg md:leading-9">
                کتابخانه‌ای زنده برای لمس، مقایسه و سفارش نمونه‌ی چوب، پارچه، روکش و فلز؛ نقطه‌ای که هر محصول از آن آغاز می‌شود.
              </p>
              <span
                ref={ctaRef}
                onPointerMove={moveCta}
                onPointerLeave={resetCta}
                className="material-cta relative inline-flex min-h-16 shrink-0 items-center gap-5 overflow-hidden rounded-full border border-peach/75 bg-peach px-7 py-4 font-medium text-forest shadow-[0_16px_55px_rgba(247,185,148,0.14)] md:min-h-[4.5rem] md:px-9"
              >
                <span className="material-cta__signal absolute inset-0 rounded-full" aria-hidden />
                <span className="material-cta__scan absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-18deg] bg-white/70 blur-md" aria-hidden />
                <span className="relative z-10">ورود به کتابخانه متریال</span>
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-forest text-paper transition-transform duration-500 group-hover:-translate-x-1">
                  ←
                </span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
