"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/gsap";
import { toFa } from "@/lib/utils";
import { isUploadedMedia } from "@/lib/media";

export type ProductStory = {
  label: string;
  title: string;
  image: string;
};

export default function ProductStoriesRail({ stories }: { stories: ProductStory[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const scrollFrameRef = useRef<number | undefined>(undefined);
  const [active, setActive] = useState(0);

  const goTo = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const rail = railRef.current;
      if (!rail || !stories.length) return;
      const cards = rail.querySelectorAll<HTMLElement>("[data-story-card]");
      const normalized = (index + stories.length) % stories.length;
      cards[normalized]?.scrollIntoView({ behavior, block: "nearest", inline: "center" });
      activeRef.current = normalized;
      setActive(normalized);
    },
    [stories.length],
  );

  useEffect(() => {
    if (prefersReducedMotion() || stories.length < 2) return;
    const timer = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden) goTo(activeRef.current + 1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [goTo, stories.length]);

  const syncActiveCard = () => {
    if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const rail = railRef.current;
      if (!rail) return;
      const railCenter = rail.getBoundingClientRect().left + rail.clientWidth / 2;
      const cards = Array.from(rail.querySelectorAll<HTMLElement>("[data-story-card]"));
      let closest = activeRef.current;
      let distance = Number.POSITIVE_INFINITY;
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const nextDistance = Math.abs(rect.left + rect.width / 2 - railCenter);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });
      if (closest !== activeRef.current) {
        activeRef.current = closest;
        setActive(closest);
      }
    });
  };

  useEffect(
    () => () => {
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
    },
    [],
  );

  return (
    <div className="mt-16 lg:mt-24">
      <div className="mb-6 flex items-center justify-between gap-6 border-t border-paper/15 pt-5">
        <div className="flex items-center gap-3 text-xs tracking-[0.18em] text-paper/55">
          <span className="text-peach">{toFa(active + 1).padStart(2, "۰")}</span>
          <span className="h-px w-10 bg-paper/25" />
          <span>{toFa(stories.length).padStart(2, "۰")}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(activeRef.current - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper transition-all duration-300 hover:border-peach hover:bg-peach hover:text-forest"
            aria-label="روایت قبلی"
          >
            →
          </button>
          <button
            type="button"
            onClick={() => goTo(activeRef.current + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper transition-all duration-300 hover:border-peach hover:bg-peach hover:text-forest"
            aria-label="روایت بعدی"
          >
            ←
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        onScroll={syncActiveCard}
        onPointerEnter={() => { pausedRef.current = true; }}
        onPointerLeave={() => { pausedRef.current = false; }}
        onFocusCapture={() => { pausedRef.current = true; }}
        onBlurCapture={() => { pausedRef.current = false; }}
        className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-5 md:-mx-10 md:px-10 lg:-mx-16 lg:gap-5 lg:px-16"
        aria-label="روایت‌های ویدیویی محصولات"
      >
        {stories.map((story, index) => (
          <article
            data-story-card
            key={`${story.title}-${index}`}
            className="group relative aspect-[9/16] w-[76vw] shrink-0 snap-center overflow-hidden rounded-[1.25rem] bg-paper/5 sm:w-[47vw] lg:w-[27vw] xl:w-[22vw]"
          >
            <Image
              src={story.image}
              alt={story.title}
              fill
              unoptimized={isUploadedMedia(story.image)}
              sizes="(max-width: 640px) 76vw, (max-width: 1024px) 47vw, 27vw"
              className="object-cover transition-transform duration-[1400ms] ease-out-expo group-hover:scale-[1.045]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/95 via-forest/5 to-forest/20" />
            <div className="commerce-grain absolute inset-0 opacity-20" aria-hidden />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-[10px] tracking-[0.2em] text-paper/70">
              <span>{story.label}</span>
              <span>{toFa(index + 1).padStart(2, "۰")}</span>
            </div>
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/50 bg-forest/20 text-paper shadow-[0_0_0_10px_rgba(244,239,232,0.06)] backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-peach group-hover:bg-peach group-hover:text-forest"
            >
              <span className="translate-x-[-1px] text-sm">▶</span>
            </span>
            <h3 className="absolute inset-x-5 bottom-6 max-w-[16rem] text-2xl font-light leading-tight">
              {story.title}
            </h3>
          </article>
        ))}
      </div>

      <div className="mt-1 flex h-px gap-1" aria-hidden>
        {stories.map((story, index) => (
          <span
            key={`${story.title}-progress`}
            className={`flex-1 transition-colors duration-500 ${index === active ? "bg-peach" : "bg-paper/15"}`}
          />
        ))}
      </div>
    </div>
  );
}
