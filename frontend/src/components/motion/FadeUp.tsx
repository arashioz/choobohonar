"use client";

import { useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
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
  as?: keyof React.JSX.IntrinsicElements;
};

export default function FadeUp({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 0.68,
  as = "div",
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as React.ElementType;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      revealElement(el);
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    let fallbackId = 0;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          window.clearTimeout(fallbackId);
          fallbackId = window.setTimeout(() => {
            if (isElementHidden(el)) revealElement(el);
          }, Math.max(550, (delay + duration) * 1000 + 160));
          io.unobserve(el);
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
      });
    } catch {
      revealElement(el);
    }

    return () => {
      ctx?.revert();
      window.clearTimeout(fallbackId);
      io.disconnect();
    };
  }, [delay, y, duration]);

  return (
    <Tag ref={ref} className={cn("motion-reveal", className)}>
      {children}
    </Tag>
  );
}
