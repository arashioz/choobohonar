"use client";

import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/data/gallery";
import { sourceLabels } from "@/data/gallery";
import { cn } from "@/lib/utils";

function ExpandIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden className="text-white">
      <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function GalleryCard({
  item,
  className,
  aspect = "aspect-[4/5]",
  priority,
  onLoad,
}: {
  item: GalleryItem;
  className?: string;
  aspect?: string;
  priority?: boolean;
  onLoad?: () => void;
}) {
  return (
    <figure data-grid-card className={cn("relative", className)}>
      <Link
        href={item.primary.href}
        className="group block"
        aria-label={`${item.primary.label} - ${sourceLabels[item.primary.source]}`}
      >
        <div className={cn("relative overflow-hidden bg-neutral-100", aspect)}>
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-[1200ms] ease-out-expo group-hover:scale-[1.03]"
            onLoad={onLoad}
          />

          <div className="absolute inset-0 flex flex-col justify-end opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
            <div className="bg-gradient-to-t from-black/55 via-black/20 to-transparent px-4 pb-4 pt-16 md:px-5 md:pb-5">
              <div className="flex items-end justify-between gap-4">
                <span className="text-sm font-medium leading-tight text-white md:text-[0.95rem]">
                  {item.primary.label}
                </span>
                <div className="flex shrink-0 items-center gap-2.5">
                  <span className="hidden text-[0.6rem] tracking-[0.22em] text-white/75 uppercase sm:inline">
                    {sourceLabels[item.primary.source]}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/45 bg-white/10 backdrop-blur-sm">
                    <ExpandIcon />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </figure>
  );
}

export function SimpleGridRow({ items, triple }: { items: GalleryItem[]; triple?: boolean }) {
  return (
    <section className="bg-white px-5 py-10 md:px-10 md:py-14 lg:px-14 lg:ps-[calc(14rem+2.5rem)] xl:ps-[calc(15rem+2.5rem)]">
      <div
        className={cn(
          "mx-auto grid max-w-container gap-5 md:gap-7",
          triple ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 md:grid-cols-2 md:max-w-4xl"
        )}
      >
        {items.map((item, i) => (
          <GalleryCard
            key={item.id}
            item={item}
            aspect={triple ? (i === 0 ? "aspect-[4/5]" : i === 1 ? "aspect-[3/4]" : "aspect-square") : "aspect-[4/5]"}
            className={cn(triple && i === 1 && "md:mt-8", triple && i === 2 && "md:mt-3")}
          />
        ))}
      </div>
    </section>
  );
}
