"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GalleryFilter, GalleryItem } from "@/data/gallery";
import { filterGalleryItems, sourceLabels } from "@/data/gallery";
import { cn, toFa } from "@/lib/utils";

const filters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "\u0647\u0645\u0647" },
  { id: "project", label: "\u067e\u0631\u0648\u0698\u0647" },
  { id: "product", label: "\u0645\u062d\u0635\u0648\u0644" },
  { id: "collection", label: "\u06a9\u0627\u0644\u06a9\u0634\u0646" },
];

function GalleryCard({ item, wide }: { item: GalleryItem; wide?: boolean }) {
  const extraLinks = item.related.slice(0, 2);

  return (
    <figure className={cn("group", wide ? "md:col-span-2" : "")}>
      <div className="relative overflow-hidden bg-forest/5">
        <Link href={item.primary.href} className="block">
          <div className={cn("relative w-full overflow-hidden", wide ? "aspect-[16/9]" : "aspect-[4/5]")}>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={wide ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
              className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-forest/0 transition-colors duration-500 group-hover:bg-forest/20" />
          </div>
        </Link>

        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-500 ease-out-expo group-hover:translate-y-0 md:p-4">
          <div className="rounded-xl bg-paper/95 p-3 backdrop-blur-sm md:p-4">
            <p className="eyebrow text-brick">{sourceLabels[item.primary.source]}</p>
            <Link
              href={item.primary.href}
              className="mt-1 block text-sm font-light text-forest hover:text-brick md:text-base"
            >
              {item.primary.label}
            </Link>
            {extraLinks.length > 0 && (
              <ul className="mt-2 space-y-1 border-t border-forest/10 pt-2">
                {extraLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-xs text-forest/60 transition-colors hover:text-brick">
                      {sourceLabels[link.source]} {"\u2014"} {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 flex items-baseline justify-between gap-2 md:hidden">
        <span className="truncate text-sm font-light text-forest">{item.primary.label}</span>
        <span className="shrink-0 text-xs text-forest/50">{sourceLabels[item.primary.source]}</span>
      </figcaption>
    </figure>
  );
}

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const filtered = useMemo(() => filterGalleryItems(items, filter), [items, filter]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              filter === f.id
                ? "border-forest bg-forest text-paper"
                : "border-forest/20 text-forest/70 hover:border-forest/40 hover:text-forest"
            )}
          >
            {f.label}
          </button>
        ))}
        <span className="ms-auto text-sm text-forest/50">
          {toFa(filtered.length)} {"\u062a\u0635\u0648\u06cc\u0631"}
        </span>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-14 md:gap-6 lg:grid-cols-3">
        {filtered.map((item, i) => (
          <GalleryCard key={item.id} item={item} wide={i % 5 === 0} />
        ))}
      </div>

      {!filtered.length && (
        <p className="mt-16 text-center text-forest/55">
          {"\u062a\u0635\u0648\u06cc\u0631\u06cc \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u0641\u06cc\u0644\u062a\u0631 \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f."}
        </p>
      )}
    </div>
  );
}
