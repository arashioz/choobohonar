"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryCycle, GalleryItem } from "@/data/gallery";
import { sourceLabels } from "@/data/gallery";
import {
  gsap,
  registerGsap,
  prefersReducedMotion,
  refreshScrollTriggers,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { GalleryCard, SimpleGridRow } from "@/components/gallery/GalleryCards";

function HorizontalRail({ items }: { items: GalleryItem[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || !items.length || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 64),
        ease: "none",
        scrollTrigger: scrollTriggerConfig({
          trigger: root,
          start: "top top",
          end: () => "+=" + Math.max(track.scrollWidth, window.innerWidth),
          pin: true,
          scrub: 2.4,
          anticipatePin: 1,
        }),
      });
    }, root);

    return () => ctx.revert();
  }, [items]);

  if (!items.length) return null;

  return (
    <section ref={rootRef} className="relative bg-white">
      <div className="flex h-[100svh] items-center overflow-hidden">
        <div ref={trackRef} className="flex gap-5 px-5 will-change-transform md:gap-7 md:px-10">
          {items.map((item) => (
            <div key={item.id} className="w-[72vw] shrink-0 md:w-[26rem]">
              <GalleryCard item={item} aspect="aspect-[4/5]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function measureCard(el: HTMLElement | null) {
  if (!el) {
    return { left: 0, top: 0, width: 280, height: 360 };
  }
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

export default function GalleryCycleBlock({ cycle, startIndex }: { cycle: GalleryCycle; startIndex: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const expandRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);

  const focusItem = cycle.rowItems[cycle.focusIndex];
  const isPair = cycle.rowKind === "pair";
  const bumpLayout = useCallback(() => refreshScrollTriggers(), []);

  useEffect(() => {
    setReduced(prefersReducedMotion());
  }, []);

  useEffect(() => {
    if (reduced || !focusItem) return;

    const root = rootRef.current;
    const pin = pinRef.current;
    const expand = expandRef.current;
    const grid = gridRef.current;
    const meta = metaRef.current;
    if (!root || !pin || !expand || !grid) return;

    registerGsap();

    const cards = cardRefs.current;

    const ctx = gsap.context(() => {
      const focusEl = () => cards[cycle.focusIndex];

      const placeExpandAtCard = () => {
        const m = measureCard(focusEl());
        gsap.set(expand, {
          position: "fixed",
          left: m.left,
          top: m.top,
          width: m.width,
          height: m.height,
          autoAlpha: 0,
          zIndex: 40,
          scale: 1,
        });
      };

      const tl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig({
          trigger: root,
          start: "top top",
          end: "+=300%",
          pin,
          scrub: 2.6,
          anticipatePin: 1,
          onRefresh: () => {
            if (tl.progress() < 0.08) placeExpandAtCard();
          },
        }),
      });

      tl.call(placeExpandAtCard, [], 0.08);

      tl.to(grid, { autoAlpha: 1, duration: 0.05 }, 0);
      tl.to(expand, { autoAlpha: 1, duration: 0.12 }, 0.1);

      tl.eventCallback("onUpdate", () => {
        const p = tl.progress();
        const el = focusEl();
        if (el) el.style.opacity = p > 0.12 && p < 0.88 ? "0" : "1";
      });

      tl.to(grid, { autoAlpha: 0, duration: 0.2 }, 0.18);

      tl.to(
        expand,
        {
          left: 0,
          top: 0,
          width: "100vw",
          height: "100svh",
          ease: "power1.inOut",
          duration: 1.1,
        },
        0.12
      );

      if (meta) {
        tl.fromTo(meta, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.72);
        tl.to(meta, { autoAlpha: 0, duration: 0.25 }, 1.38);
      }

      tl.to(
        expand,
        { autoAlpha: 0, scale: 0.9, ease: "power1.inOut", duration: 0.95 },
        1.48
      );
    }, root);

    const t = window.setTimeout(refreshScrollTriggers, 150);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
      cards.forEach((el) => {
        if (el) el.style.opacity = "1";
      });
    };
  }, [cycle.id, cycle.focusIndex, focusItem, reduced]);

  if (!focusItem) return null;

  const gridSection = (
    <div
      ref={gridRef}
      className={cn(
        "mx-auto grid max-w-container gap-5 md:gap-7",
        isPair ? "grid-cols-1 md:grid-cols-2 md:max-w-4xl" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      )}
    >
      {cycle.rowItems.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className={cn(i === 1 && !isPair && "md:mt-8", i === 2 && !isPair && "md:mt-3")}
          style={{ transform: `rotate(${i === 0 ? -0.5 : i === 1 ? 0.65 : -0.35}deg)` }}
        >
          <GalleryCard
            item={item}
            aspect={isPair ? "aspect-[4/5]" : i === 0 ? "aspect-[4/5]" : i === 1 ? "aspect-[3/4]" : "aspect-square"}
            priority={startIndex + i < 4}
            onLoad={bumpLayout}
          />
        </div>
      ))}
    </div>
  );

  if (reduced) {
    return (
      <div className="bg-white">
        <section className="px-5 py-10 md:px-10 md:py-14 lg:ps-[calc(14rem+2.5rem)]">{gridSection}</section>
        {isPair ? (
          <HorizontalRail items={cycle.railItems} />
        ) : (
          cycle.verticalRows.map((row, ri) => (
            <SimpleGridRow key={`${cycle.id}-v-${ri}`} items={row} triple />
          ))
        )}
      </div>
    );
  }

  return (
    <div className="bg-white">
      <article ref={rootRef} className="relative h-[300vh]" aria-label={focusItem.primary.label}>
        <div ref={pinRef} className="relative flex h-[100svh] items-start overflow-hidden bg-white px-5 pt-16 md:px-10 md:pt-20 lg:ps-[calc(14rem+2.5rem)] xl:ps-[calc(15rem+2.5rem)]">
          {gridSection}

          <div ref={expandRef} className="pointer-events-none relative overflow-hidden opacity-0" aria-hidden>
            <Image src={focusItem.src} alt="" fill sizes="100vw" className="object-cover" priority />
          </div>

          <div
            ref={metaRef}
            className="pointer-events-none absolute inset-x-0 bottom-0 z-50 px-6 pb-10 opacity-0 md:px-12 md:pb-12"
          >
            <div className="flex items-end justify-between gap-4">
              <span className="text-base font-medium text-white drop-shadow md:text-lg">{focusItem.primary.label}</span>
              <span className="text-[0.65rem] tracking-[0.22em] text-white/80 uppercase">
                {sourceLabels[focusItem.primary.source]}
              </span>
            </div>
          </div>
        </div>
      </article>

      {isPair ? (
        <HorizontalRail items={cycle.railItems} />
      ) : (
        cycle.verticalRows.map((row, ri) => (
          <SimpleGridRow key={`${cycle.id}-v-${ri}`} items={row} triple />
        ))
      )}
    </div>
  );
}
