"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { GalleryFilter, GalleryItem } from "@/data/gallery";
import { filterGalleryItems, galleryFilters } from "@/data/gallery";
import GalleryBentoGrid from "@/components/gallery/GalleryBentoGrid";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import FadeUp from "@/components/motion/FadeUp";
import { cn, toFa } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
};

export default function GalleryExperience({ items }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = (searchParams.get("tag") as GalleryFilter | null) ?? "all";
  const validInitial = galleryFilters.some((f) => f.id === initial) ? initial : "all";

  const [filter, setFilter] = useState<GalleryFilter>(validInitial);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const next = (searchParams.get("tag") as GalleryFilter | null) ?? "all";
    if (galleryFilters.some((f) => f.id === next)) setFilter(next);
  }, [searchParams]);

  const filtered = useMemo(() => filterGalleryItems(items, filter), [items, filter]);

  const selectFilter = (next: GalleryFilter) => {
    setFilter(next);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("tag");
      else params.set("tag", next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  return (
    <div>
      <FadeUp className="flex flex-col gap-6 border-y border-forest/10 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {galleryFilters.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFilter(item.id)}
                className={cn(
                  "border px-4 py-2 text-xs tracking-[0.12em] transition-colors duration-300",
                  selected
                    ? "border-forest bg-forest text-paper"
                    : "border-forest/15 text-forest/65 hover:border-forest/40 hover:text-forest"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-forest/50">{toFa(filtered.length)} تصویر</p>
      </FadeUp>

      <div className="mt-10 md:mt-14">
        <GalleryBentoGrid items={filtered} onOpen={setActive} />
      </div>

      {active ? (
        <GalleryLightbox item={active} onClose={() => setActive(null)} onSelect={setActive} />
      ) : null}
    </div>
  );
}
