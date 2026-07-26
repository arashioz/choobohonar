"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import BrandbookHeroMotion from "@/components/motion/BrandbookHeroMotion";
import RevealLine from "@/components/motion/RevealLine";
import BrandbookNavigation from "@/components/brandbook/layout/BrandbookNavigation";
import { brandbookNavItems } from "@/data/brandbook-nav";
import BrandFoundation from "@/components/brandbook/sections/BrandFoundation";
import StrategicIdentity from "@/components/brandbook/sections/StrategicIdentity";
import ProductDesign from "@/components/brandbook/sections/ProductDesign";
import BrandExperience from "@/components/brandbook/sections/BrandExperience";
import CommunicationSystem from "@/components/brandbook/sections/CommunicationSystem";
import VisualIdentity from "@/components/brandbook/sections/VisualIdentity";
import ImageryGallery from "@/components/brandbook/sections/ImageryGallery";
import CultureFuture from "@/components/brandbook/sections/CultureFuture";
import { scrollToTarget } from "@/lib/lenis-control";

const navItems = brandbookNavItems;

export default function BrandbookPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const observerRefs = useRef<Record<string, IntersectionObserverEntry>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observerRefs.current[entry.target.id] = entry;
        });

        const visible = Object.values(observerRefs.current)
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));

        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.08, 0.2] },
    );

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-paper" id="brandbook-scroll-root">
      <BrandbookNavigation items={navItems} activeId={activeSection} />

      <BrandbookHeroMotion className="items-stretch px-0 text-right">
        <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-30" aria-hidden />

        <div className="relative z-10 mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-20 sm:px-8 md:px-12 lg:grid-cols-12 lg:items-end lg:pb-20 lg:pl-16 lg:pr-24 lg:pt-24">
          <div className="lg:col-span-8">
            <div data-hero-logo className="mb-12 flex items-center gap-4">
              <span className="relative block h-12 w-28 sm:h-14 sm:w-36">
                <Image
                  src="/brand/downloads/choobohonar-lockup-persian-white.svg"
                  alt="خانه چوب و هنر"
                  fill
                  priority
                  className="object-contain object-right"
                />
              </span>
              <span className="h-8 w-px bg-peach/25" />
              <span className="text-[9px] uppercase leading-5 tracking-[0.18em] text-paper/35" dir="ltr">
                Brand System
                <br />
                Edition 01
              </span>
            </div>

            <p data-hero-soft className="eyebrow text-peach/70">
              Digital Brandbook — 2026
            </p>
            <h1
              data-hero-line
              className="mt-5 max-w-5xl text-balance text-[clamp(3.25rem,7vw,7.5rem)] font-extralight leading-[0.9] tracking-[-0.06em] text-paper"
            >
              ساختن خانه‌هایی
              <br />
              <span className="text-peach">با روح.</span>
            </h1>
            <p
              data-hero-soft
              className="mt-8 max-w-xl text-pretty text-sm font-light leading-8 text-paper/50 sm:text-base"
            >
              یک سیستم زنده برای تصمیم‌های بصری، کلامی و تجربه‌ای خانه چوب و هنر؛
              از میراث صنعتگری تا تصویر آینده‌ی برند.
            </p>
          </div>

          <div className="lg:col-span-3 lg:col-start-10">
            <div
              data-hero-soft
              className="overflow-hidden rounded-[1.75rem] border border-paper/10 bg-paper/[0.055] p-5 backdrop-blur-sm sm:p-6"
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="text-xs text-paper/45">راهنمای زنده برند</span>
                <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-sage/70" dir="ltr">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  Living system
                </span>
              </div>
              <div className="mb-4 flex items-center justify-between px-0.5">
                <span className="text-[10px] text-paper/40">
                  {navItems.length - 1} فصل
                </span>
                <span className="font-display text-[10px] text-peach/55" dir="ltr">
                  01–{String(navItems.length - 1).padStart(2, "0")}
                </span>
              </div>
              <div className="max-h-[17.5rem] space-y-0.5 overflow-y-auto pr-1 no-scrollbar">
                {navItems.slice(1).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToTarget(item.id)}
                    className="group flex w-full items-center justify-between rounded-xl px-2 py-2 text-right transition-colors hover:bg-paper/[0.07]"
                  >
                    <span>
                      <span className="block text-xs text-paper/75">{item.label}</span>
                      <span className="mt-0.5 block text-[9px] uppercase tracking-[0.12em] text-paper/25" dir="ltr">
                        {item.titleEn}
                      </span>
                    </span>
                    <span className="font-display text-[10px] text-peach/55 transition-transform group-hover:-translate-x-1" dir="ltr">
                      {item.number}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                data-hero-cue
                onClick={() => scrollToTarget("foundation")}
                className="mt-7 flex w-full items-center justify-between border-t border-paper/10 pt-5 text-xs text-paper/45 transition-colors hover:text-paper"
              >
                <span>شروع مطالعه</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/15 text-peach">
                  ↓
                </span>
              </button>
            </div>
          </div>
        </div>
      </BrandbookHeroMotion>

      <RevealLine className="mx-auto max-w-[1600px]" />

      <section id="foundation" className="scroll-mt-8">
        <BrandFoundation />
      </section>

      <RevealLine className="mx-auto max-w-[1600px] opacity-60" />

      <section id="strategy" className="scroll-mt-8">
        <StrategicIdentity />
      </section>

      <RevealLine className="mx-auto max-w-[1600px] opacity-60" />

      <section id="product" className="scroll-mt-8">
        <ProductDesign />
      </section>

      <section id="experience" className="scroll-mt-8">
        <BrandExperience />
      </section>

      <section id="communication" className="scroll-mt-8">
        <CommunicationSystem />
      </section>

      <section id="visual" className="scroll-mt-8">
        <VisualIdentity />
      </section>

      <ImageryGallery />

      <section id="culture" className="scroll-mt-8">
        <CultureFuture />
      </section>
    </div>
  );
}
