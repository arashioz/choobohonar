"use client";

import { useEffect, useMemo, useState } from "react";
import type { GalleryFilter, GalleryItem } from "@/data/gallery";
import { buildGalleryCycles, filterGalleryItems, sourceLabels } from "@/data/gallery";
import { registerGsap, refreshScrollTriggers } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import GalleryCycleBlock from "@/components/gallery/GalleryCycleBlock";
import GallerySemanticSidebar from "@/components/gallery/GallerySemanticSidebar";

const filters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "\u0647\u0645\u0647" },
  { id: "project", label: "\u067e\u0631\u0648\u0698\u0647" },
  { id: "product", label: "\u0645\u062d\u0635\u0648\u0644" },
  { id: "collection", label: "\u06a9\u0627\u0644\u06a9\u0634\u0646" },
];

export default function GallerySurpriseExperience({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [semanticIds, setSemanticIds] = useState<Set<string> | null>(null);

  const filtered = useMemo(() => filterGalleryItems(items, filter), [items, filter]);

  const visibleItems = useMemo(() => {
    if (!semanticIds) return filtered;
    return filtered.filter((item) => semanticIds.has(item.id));
  }, [filtered, semanticIds]);

  const cycles = useMemo(() => buildGalleryCycles(visibleItems), [visibleItems]);

  const cycleOffsets = useMemo(() => {
    let count = 0;
    return cycles.map((cycle) => {
      const start = count;
      count +=
        cycle.rowItems.length +
        cycle.railItems.length +
        cycle.verticalRows.reduce((n, row) => n + row.length, 0);
      return start;
    });
  }, [cycles]);

  useEffect(() => {
    registerGsap();
    const t1 = window.setTimeout(refreshScrollTriggers, 100);
    const t2 = window.setTimeout(refreshScrollTriggers, 800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [cycles]);

  return (
    <div className="relative bg-white">
      <GallerySemanticSidebar items={filtered} onFilter={setSemanticIds} />

      <div className="lg:ps-56 xl:ps-60">
        <div className="border-t border-forest/[0.05] px-5 py-7 md:px-10 md:py-8 lg:hidden">
          <input
            type="search"
            placeholder={"\u062c\u0633\u062a\u062c\u0648\u06cc \u0633\u0645\u0646\u062a\u06cc\u06a9\u2026"}
            className="w-full border-b border-forest/15 bg-transparent py-2 text-sm font-light text-forest outline-none placeholder:text-forest/30"
            onChange={(e) => {
              const q = e.target.value.trim().toLowerCase();
              if (!q) {
                setSemanticIds(null);
                return;
              }
              setSemanticIds(
                new Set(
                  filtered
                    .filter((item) =>
                      [item.primary.label, item.alt, sourceLabels[item.primary.source]]
                        .join(" ")
                        .toLowerCase()
                        .includes(q)
                    )
                    .map((i) => i.id)
                )
              );
            }}
          />
        </div>

        <div className="border-t border-forest/[0.05] px-5 py-7 md:px-10 md:py-8 lg:border-t-0">
          <nav className="mx-auto flex max-w-container flex-wrap items-center gap-x-7 gap-y-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  "text-sm transition-colors duration-700",
                  filter === f.id ? "text-forest" : "text-forest/30 hover:text-forest/55"
                )}
              >
                {f.label}
              </button>
            ))}
          </nav>
        </div>

        {cycles.length ? (
          cycles.map((cycle, i) => (
            <GalleryCycleBlock key={cycle.id} cycle={cycle} startIndex={cycleOffsets[i]} />
          ))
        ) : (
          <p className="py-32 text-center text-sm font-light text-forest/40">
            {"\u062a\u0635\u0648\u06cc\u0631\u06cc \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u0641\u06cc\u0644\u062a\u0631 \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f."}
          </p>
        )}

        <div className="h-24 bg-white md:h-32" aria-hidden />
      </div>
    </div>
  );
}
