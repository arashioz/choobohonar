"use client";

import { useEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  scrollTriggerConfig,
  refreshScrollTriggers,
  ScrollTrigger,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ScrollTimelineProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ScrollTimeline({ children, className }: ScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const progress = progressRef.current;
    if (!container || !progress) return;

    if (prefersReducedMotion()) {
      gsap.set(progress, { scaleY: 1 });
      container.querySelectorAll("[data-timeline-dot]").forEach((dot) => {
        dot.classList.add("is-active");
      });
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(progress, { transformOrigin: "top center", scaleY: 0 });

      gsap.to(progress, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: scrollTriggerConfig({
          trigger: container,
          start: "top 75%",
          end: "bottom 58%",
          scrub: 0.65,
        }),
      });

      const items = container.querySelectorAll<HTMLElement>("[data-timeline-item]");
      items.forEach((item) => {
        const dot = item.querySelector<HTMLElement>("[data-timeline-dot]");
        if (!dot) return;

        ScrollTrigger.create(
          scrollTriggerConfig({
            trigger: item,
            start: "top 84%",
            once: true,
            onEnter: () => dot.classList.add("is-active"),
          }),
        );
      });
    }, container);

    requestAnimationFrame(() => refreshScrollTriggers());

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className="absolute right-0 top-0 bottom-0 w-px bg-forest/10"
        aria-hidden
      />
      <div
        ref={progressRef}
        className="absolute right-0 top-0 h-full w-px origin-top scale-y-0 bg-forest/30"
        aria-hidden
      />
      {children}
    </div>
  );
}
