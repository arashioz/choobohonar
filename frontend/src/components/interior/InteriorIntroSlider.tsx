"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { interiorStyles as fallbackStyles } from "@/data/interior-architecture";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export default function InteriorIntroSlider({ styles = fallbackStyles }: { styles?: typeof fallbackStyles }) {
  const slides = styles.slice(0, 6).map((style) => ({
    src: style.image,
    alt: style.label,
    caption: style.description,
    label: style.label,
  }));
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || slides.length < 2 || paused) return;
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % slides.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [paused]);

  const current = slides[active];

  return (
    <figure
      className="relative mt-10 overflow-hidden rounded-2xl border border-forest/10 bg-forest"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div className="relative aspect-[4/5] sm:aspect-[5/6]">
        {slides.map((slide, index) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 42vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-out-expo",
              index === active ? "opacity-100" : "opacity-0",
            )}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
        {current ? (
          <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="text-xs tracking-[0.22em] text-peach/90">{current.label}</p>
            <p className="mt-2 text-sm leading-6 text-paper/80">{current.caption}</p>
          </figcaption>
        ) : null}
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-end gap-1.5 p-4" role="tablist" aria-label="اسلایدهای طراحی تا اجرا">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={index === active}
            aria-label={slide.label}
            onClick={() => setActive(index)}
            className={cn(
              "h-1.5 w-6 rounded-full transition-colors",
              index === active ? "bg-peach" : "bg-paper/35 hover:bg-paper/60",
            )}
          />
        ))}
      </div>
    </figure>
  );
}
