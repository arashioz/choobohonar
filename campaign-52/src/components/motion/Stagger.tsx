"use client";

import { useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  refreshScrollTriggers,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  amount?: number;
  y?: number;
};

export default function Stagger({
  children,
  className,
  selector = ":scope > *",
  amount = 0.32,
  y = 24,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let fallbackId = 0;
    let observer: IntersectionObserver | undefined;

    const start = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (!items.length) return;

      if (prefersReducedMotion()) {
        items.forEach(revealElement);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          fallbackId = window.setTimeout(() => {
            items.forEach((item) => {
              if (parseFloat(getComputedStyle(item).opacity) === 0) revealElement(item);
            });
          }, 850);
          observer?.disconnect();
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      observer.observe(el);

      registerGsap();
      ctx = gsap.context(() => {
        gsap.set(items, { opacity: 0, y });
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.68,
          ease: "power3.out",
          stagger: { amount },
          scrollTrigger: scrollTriggerConfig({
            trigger: el,
            start: "top 82%",
            once: true,
          }),
        });
      }, el);
      requestAnimationFrame(() => refreshScrollTriggers());
    };

    const off = afterIntro(start);
    return () => {
      off();
      ctx?.revert();
      window.clearTimeout(fallbackId);
      observer?.disconnect();
    };
  }, [selector, amount, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
