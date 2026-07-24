"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { GalleryItem } from "@/data/gallery";
import { getRelatedGalleryItems, tagLabels } from "@/data/gallery";
import { registerGsap, gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn, toFa } from "@/lib/utils";

type Props = {
  item: GalleryItem;
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
};

export default function GalleryLightbox({ item, onClose, onSelect }: Props) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const related = useMemo(() => getRelatedGalleryItems(item), [item]);
  const rail = useMemo(
    () => [item, ...related.filter((r) => r.id !== item.id)],
    [item, related]
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (rail.length < 2) return;
      const idx = rail.findIndex((r) => r.id === item.id);
      if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
        onSelect(rail[(idx + 1) % rail.length]);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowRight") {
        onSelect(rail[(idx - 1 + rail.length) % rail.length]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onSelect, rail, item.id]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (prefersReducedMotion()) {
      gsap.set([overlay, panel], { opacity: 1, clearProps: "transform" });
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: 28, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [item.id]);

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!mounted) return null;

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-forest/55 backdrop-blur-[3px] md:items-center md:p-8"
      onClick={handleBackdrop}
    >
      <div
        ref={panelRef}
        className="relative flex max-h-[94svh] w-full max-w-6xl flex-col overflow-hidden bg-paper shadow-2xl md:max-h-[88svh] md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center border border-forest/10 bg-paper/90 text-forest transition-colors hover:border-forest/30 hover:bg-paper"
          aria-label="بستن"
        >
          ✕
        </button>

        <aside className="flex w-full shrink-0 flex-col border-t border-forest/10 md:w-[min(100%,22rem)] md:border-l md:border-t-0 md:border-forest/10">
          <div className="border-b border-forest/10 px-6 py-6">
            <span className="inline-flex items-center border border-forest/15 px-2.5 py-1 text-[0.65rem] tracking-[0.18em] text-brick">
              {tagLabels[item.tag]}
            </span>
            <h2 className="mt-4 text-2xl font-light tracking-tight text-forest">{item.alt}</h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/65">{item.caption}</p>
            {item.href ? (
              <Link
                href={item.href}
                className="mt-5 inline-flex items-center gap-2 text-sm text-brick transition-colors hover:text-forest"
              >
                مشاهده مرتبط
                <span>←</span>
              </Link>
            ) : null}
          </div>

          {related.length ? (
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <p className="eyebrow text-forest/45">مرتبط · {toFa(related.length)}</p>
              <ul className="mt-4 space-y-3">
                {related.map((rel) => (
                  <li key={rel.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(rel)}
                      className={cn(
                        "group flex w-full items-center gap-3 text-right transition-opacity",
                        rel.id === item.id ? "opacity-40" : "hover:opacity-90"
                      )}
                    >
                      <span className="relative h-16 w-14 shrink-0 overflow-hidden bg-forest/5">
                        <Image src={rel.src} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.65rem] tracking-[0.14em] text-brick/80">
                          {tagLabels[rel.tag]}
                        </span>
                        <span className="mt-1 block truncate text-sm text-forest">{rel.alt}</span>
                        <span className="mt-0.5 block truncate text-xs text-forest/50">{rel.caption}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>

        <div className="relative min-h-[42svh] flex-1 bg-forest/5 md:min-h-0">
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 65vw"
            className="object-cover"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
