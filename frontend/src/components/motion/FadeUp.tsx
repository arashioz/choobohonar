"use client";

import { useEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  revealIfInViewport,
  scheduleRevealFailsafe,
  refreshScrollTriggers,
  scrollTriggerConfig,
  isElementHidden,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
};

export default function FadeUp({
  children,
  className,
  delay = 0,
  y = 40,
  duration = 1,
  as = "div",
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      revealElement(el);
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancelFailsafe = scheduleRevealFailsafe(el, 1800);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isElementHidden(el)) {
            revealElement(el);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    io.observe(el);

    try {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: scrollTriggerConfig({
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            }),
          }
        );
      });

      requestAnimationFrame(() => {
        refreshScrollTriggers();
        revealIfInViewport(el, 0.92);
      });
      window.setTimeout(() => revealIfInViewport(el, 0.92), 400);
    } catch {
      revealElement(el);
    }

    return () => {
      ctx?.revert();
      cancelFailsafe();
      io.disconnect();
    };
  }, [delay, y, duration]);

  return (
    <Tag ref={ref} className={cn("motion-reveal", className)}>
      {children}
    </Tag>
  );
}
