"use client";

import { useState } from "react";
import type { FaqItem } from "@/data/posts/types";
import FadeUp from "@/components/motion/FadeUp";
import { cn } from "@/lib/utils";

export default function PostFAQ({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <FadeUp className="mt-20 border-t border-forest/10 pt-14">
      <p className="eyebrow text-brick">پرسش‌های متداول</p>
      <h2 className="mt-3 text-2xl font-light tracking-tight text-forest md:text-3xl">
        سوالات رایج
      </h2>

      <div className="mt-8 flex flex-col divide-y divide-forest/10">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-start justify-between gap-4 py-5 text-right transition-colors hover:text-brick"
                aria-expanded={isOpen}
              >
                <span className="text-lg font-light leading-snug text-forest">{item.question}</span>
                <span
                  className={cn(
                    "mt-1 shrink-0 text-xl text-forest/40 transition-transform duration-300",
                    isOpen && "rotate-45",
                  )}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out-expo",
                  isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
              >
                <div className="overflow-hidden">
                  <p className="text-base leading-relaxed text-forest/70">{item.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FadeUp>
  );
}
