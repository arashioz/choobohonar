"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getProduct } from "@/data/products";
import type { ProductMarker } from "@/data/projects";
import { getProductShopUrl } from "@/lib/shop";
import { cn } from "@/lib/utils";

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

type AnchorRect = { top: number; left: number; width: number; height: number };

type ImageWithProductMarkersProps = {
  src: string;
  alt: string;
  markers?: ProductMarker[];
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ImageWithProductMarkers({
  src,
  alt,
  markers = [],
  fill = false,
  sizes,
  priority,
  className,
  imageClassName,
}: ImageWithProductMarkersProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [anchorRect, setAnchorRect] = useState<AnchorRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const activeMarker = markers.find((m) => m.id === activeId);
  const activeProduct = activeMarker ? getProduct(activeMarker.productSlug) : undefined;

  const close = useCallback(() => {
    setActiveId(null);
    setAnchorRect(null);
  }, []);

  const openMarker = useCallback((markerId: string) => {
    const el = markerRefs.current[markerId];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setAnchorRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    setActiveId(markerId);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!activeId) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      close();
    };

    const onScroll = () => close();

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [activeId, close]);

  const imageProps = fill
    ? { fill: true as const, sizes: sizes ?? "100vw", className: cn("object-cover", imageClassName) }
    : { width: 1200, height: 800, sizes: sizes ?? "100vw", className: cn("h-full w-full object-cover", imageClassName) };

  const useLocalImage = src.startsWith("/images/");

  const panelWidth = 288;
  const panelLeft =
    anchorRect && isDesktop
      ? clamp(anchorRect.left + anchorRect.width / 2, panelWidth / 2 + 16, window.innerWidth - panelWidth / 2 - 16)
      : undefined;
  const panelTop =
    anchorRect && isDesktop
      ? clamp(anchorRect.top + anchorRect.height + 12, 16, window.innerHeight - 360)
      : undefined;

  const panel =
    activeProduct && activeMarker && mounted
      ? createPortal(
          <>
            <div
              className="fixed inset-0 z-[9998] bg-forest/30 backdrop-blur-[2px] md:bg-forest/15"
              onClick={close}
              aria-hidden
            />

            <div
              ref={panelRef}
              className={cn(
                "fixed z-[9999] overflow-hidden rounded-2xl border border-forest/10 bg-paper shadow-2xl",
                isDesktop ? "w-72" : "inset-x-4 bottom-4 w-auto"
              )}
              style={
                isDesktop && panelLeft !== undefined && panelTop !== undefined
                  ? { left: panelLeft, top: panelTop, transform: "translateX(-50%)" }
                  : undefined
              }
              role="dialog"
              aria-label={activeProduct.name}
            >
              <div className="relative aspect-[4/3] w-full bg-forest/5">
                <Image
                  src={activeProduct.image}
                  alt={activeProduct.name}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={close}
                  className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-paper/90 text-forest backdrop-blur-sm transition-colors hover:bg-peach"
                  aria-label={"\u0628\u0633\u062a\u0646"}
                >
                  {"\u00d7"}
                </button>
              </div>

              <div className="p-5">
                <p className="font-display text-sm text-brick">{activeProduct.series}</p>
                <h3 className="mt-1 text-lg font-light tracking-tight text-forest">{activeProduct.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-forest/65">{activeProduct.shortDescription}</p>

                <a
                  href={getProductShopUrl(activeProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-forest-700"
                >
                  {"\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0628\u06cc\u0634\u062a\u0631"}
                  <span aria-hidden>{"\u2197"}</span>
                </a>
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <div ref={containerRef} className={cn("relative h-full w-full", className)}>
        <Image
          src={src}
          alt={alt}
          priority={priority}
          unoptimized={useLocalImage}
          {...imageProps}
        />

        {markers.length > 0 && (
          <div className="absolute inset-0">
            {markers.map((marker) => {
              const isActive = marker.id === activeId;
              const productName = getProduct(marker.productSlug)?.name ?? marker.productSlug;
              return (
                <button
                  key={marker.id}
                  ref={(el) => {
                    markerRefs.current[marker.id] = el;
                  }}
                  type="button"
                  aria-label={`\u0645\u062d\u0635\u0648\u0644: ${productName}`}
                  aria-expanded={isActive}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isActive) close();
                    else openMarker(marker.id);
                  }}
                  className="group/marker absolute z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none"
                  style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                >
                  <span
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-500 ease-out-expo",
                      isActive
                        ? "scale-110 border-peach bg-peach text-forest shadow-lg"
                        : "border-paper/80 bg-forest/75 text-paper backdrop-blur-sm group-hover/marker:scale-110 group-hover/marker:border-peach group-hover/marker:bg-peach group-hover/marker:text-forest"
                    )}
                  >
                    {!isActive && (
                      <span className="absolute inset-0 animate-ping rounded-full bg-peach/30 opacity-75" />
                    )}
                    <span className="relative text-sm font-light leading-none">+</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {panel}
    </>
  );
}
