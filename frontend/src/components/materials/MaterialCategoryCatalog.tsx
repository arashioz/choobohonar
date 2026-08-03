"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeUp from "@/components/motion/FadeUp";
import type { MaterialCommerceItem, MaterialCommerceMode } from "@/data/material-products";
import { cn, toFa } from "@/lib/utils";

const modeLabels: Record<MaterialCommerceMode | "all", string> = {
  all: "همه نمونه‌ها",
  direct: "خرید مستقیم",
  quote: "استعلام قیمت",
  sample: "درخواست نمونه",
};

export default function MaterialCategoryCatalog({
  items,
  categoryLabel,
}: {
  items: MaterialCommerceItem[];
  categoryLabel: string;
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<MaterialCommerceMode | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("fa");
    return items.filter((item) => {
      if (mode !== "all" && item.commerceMode !== mode) return false;
      if (q && !`${item.name} ${item.code} ${item.subtitle}`.toLocaleLowerCase("fa").includes(q)) return false;
      return true;
    });
  }, [items, mode, query]);

  return (
    <section className="bg-paper py-20 md:py-28 lg:py-32">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-4 border-y border-forest/10 py-5 md:flex-row md:items-center md:justify-between">
          <label className="relative max-w-xl flex-1">
            <span className="sr-only">جستجو در {categoryLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`جستجو بر اساس نام یا کد ${categoryLabel}...`}
              className="h-12 w-full rounded-full border border-forest/15 bg-white/50 pr-12 pl-5 text-sm text-forest outline-none placeholder:text-forest/40 focus:border-forest/40"
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/45" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {(Object.keys(modeLabels) as (MaterialCommerceMode | "all")[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2.5 text-xs transition-colors",
                  mode === value ? "bg-forest text-paper" : "border border-forest/15 text-forest hover:border-forest/40",
                )}
              >
                {modeLabels[value]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 text-sm text-forest/50">
          <p>{toFa(filtered.length)} نمونه</p>
          <p>مرتب‌سازی: منتخب کتابخانه</p>
        </div>

        {filtered.length ? (
          <div className="mt-12 grid gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, index) => (
              <FadeUp key={item.slug} delay={index * 0.06}>
                <Link href={`/materials/${item.categoryId}/${item.slug}`} className="group block focus-visible:outline-none">
                  <div className="grid aspect-[4/5] grid-rows-[1.1fr_0.9fr] overflow-hidden bg-forest/5">
                    <div className="relative overflow-hidden">
                      <Image
                        src={item.applicationImage}
                        alt={`کاربرد ${item.name}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="media-hover object-cover"
                      />
                      <span className="absolute right-4 top-4 rounded-full bg-paper/90 px-3 py-1.5 text-[10px] tracking-[0.14em] text-forest backdrop-blur-md">
                        {item.code}
                      </span>
                    </div>
                    <div className="relative p-5" style={{ background: `linear-gradient(145deg, ${item.accent}, ${item.color})` }}>
                      <div className="absolute inset-5 border border-white/25" />
                      <div className="relative flex h-full items-end justify-between gap-4 text-white">
                        <p className="text-xs tracking-[0.16em] opacity-75">CHH MATERIAL</p>
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/35 transition-colors group-hover:bg-white group-hover:text-forest group-focus-visible:bg-white group-focus-visible:text-forest">↙</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4 border-b border-forest/10 pb-4">
                    <div>
                      <h2 className="text-2xl font-light text-forest">{item.name}</h2>
                      <p className="mt-2 text-sm text-forest/50">{item.subtitle}</p>
                    </div>
                    <p className="shrink-0 pt-1 text-xs text-brick">{item.priceLabel}</p>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-forest/20 px-6 py-16 text-center text-forest/55">
            نمونه‌ای با این مشخصات پیدا نشد.
          </div>
        )}
      </div>
    </section>
  );
}
