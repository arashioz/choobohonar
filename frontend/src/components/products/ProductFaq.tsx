"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function ProductFaq({ product }: { product: Product }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!product.faq.length) return null;

  return (
    <section className="bg-forest py-24 text-paper md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <FadeUp as="p" className="eyebrow text-peach">
              سوالات متداول
            </FadeUp>
            <FadeUp
              as="h2"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-light leading-[1.02] tracking-tightest"
            >
              پاسخ به پرسش‌های شما
            </FadeUp>
            <FadeUp delay={0.1} className="mt-6 max-w-sm leading-relaxed text-paper/60">
              پاسخ خود را پیدا نکردید؟ کارشناسان ما در جلسه‌ی مشاوره‌ی رایگان همراه شما هستند.
            </FadeUp>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="flex flex-col border-t border-paper/15">
              {product.faq.map((item, i) => {
                const isOpen = open === i;
                return (
                  <div key={item.q} className="border-b border-paper/15">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 py-6 text-right"
                    >
                      <span className="text-lg font-light text-paper md:text-xl">{item.q}</span>
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper/30 text-lg transition-transform duration-300 ease-out-expo",
                          isOpen && "rotate-45 bg-peach text-forest"
                        )}
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-out-expo",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 leading-relaxed text-paper/70">{item.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
