"use client";

import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/data/gallery";

export default function GalleryMarquee({ items }: { items: GalleryItem[] }) {
  if (!items.length) return null;

  const loop = [...items, ...items];

  return (
    <div className="relative isolate overflow-hidden border-y border-forest/10 bg-forest">
      <div className="gallery-marquee-track flex h-32 w-max items-center gap-4 py-3 md:h-40 md:gap-6 md:py-4">
        {loop.map((item, i) => (
          <Link
            key={`${item.id}-marquee-${i}`}
            href={item.primary.href}
            className="group relative block h-24 w-40 shrink-0 overflow-hidden md:h-32 md:w-52"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="208px"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-forest/30 transition-colors group-hover:bg-forest/10" />
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-forest/95 to-transparent px-2 py-2 text-[11px] text-paper">
              {item.primary.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
