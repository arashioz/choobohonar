"use client";

import Image from "next/image";
import type { GalleryItem } from "@/data/gallery";
import { tagLabels } from "@/data/gallery";
import FadeUp from "@/components/motion/FadeUp";
import { cn } from "@/lib/utils";

const bentoClass: Record<GalleryItem["bento"], string> = {
  hero: "sm:col-span-2 sm:row-span-2 aspect-[4/5] sm:aspect-auto sm:min-h-[28rem]",
  tall: "sm:row-span-2 aspect-[3/4] sm:aspect-auto sm:min-h-[28rem]",
  wide: "sm:col-span-2 aspect-[16/10]",
  square: "aspect-square sm:aspect-auto sm:min-h-[13.5rem]",
};

type Props = {
  items: GalleryItem[];
  onOpen: (item: GalleryItem) => void;
};

export default function GalleryBentoGrid({ items, onOpen }: Props) {
  if (!items.length) {
    return (
      <div className="border border-dashed border-forest/15 px-6 py-20 text-center text-forest/55">
        تصویری در این فیلتر یافت نشد.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[minmax(13.5rem,auto)]">
      {items.map((item, index) => (
        <FadeUp
          key={item.id}
          delay={Math.min(index * 0.05, 0.35)}
          className={cn("h-full min-h-0", bentoClass[item.bento])}
        >
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="group relative block h-full min-h-[13rem] w-full overflow-hidden bg-forest/5 text-right"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes={
                item.bento === "hero" || item.bento === "wide"
                  ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              }
              className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/70 via-forest/15 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <span className="inline-flex border border-paper/25 bg-forest/20 px-2 py-0.5 text-[0.6rem] tracking-[0.2em] text-peach backdrop-blur-sm">
                {tagLabels[item.tag]}
              </span>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-paper/90 md:text-[0.95rem]">
                {item.caption}
              </p>
            </div>
            <span
              aria-hidden
              className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center border border-paper/25 bg-forest/25 text-sm text-paper opacity-0 backdrop-blur-sm transition-all duration-300 ease-out-expo group-hover:opacity-100"
            >
              +
            </span>
          </button>
        </FadeUp>
      ))}
    </div>
  );
}
