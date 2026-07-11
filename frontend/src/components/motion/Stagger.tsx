"use client";

import { useEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  refreshScrollTriggers,
  scrollTriggerConfig,
} from "@/lib/gsap";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  /** CSS selector for the children to stagger (relative to wrapper). */
  selector?: string;
  amount?: number;
  y?: number;
};

/** Reveals direct children (or `selector` matches) in a gentle stagger on enter. */
export default function Stagger({
  children,
  className,
  selector = ":scope > *",
  amount = 0.5,
  y = 40,
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    registerGsap();

    const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (!items.length) return;

    if (prefersReducedMotion()) {
      items.forEach(revealElement);
      return;
    }

    const cancelFailsafe = window.setTimeout(() => {
      items.forEach((item) => {
        if (parseFloat(getComputedStyle(item).opacity) === 0) revealElement(item);
      });
    }, 1800);

    let ctx: ReturnType<typeof gsap.context> | undefined;
    try {
      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: { amount },
            scrollTrigger: scrollTriggerConfig({
              trigger: el,
              start: "top 82%",
              once: true,
            }),
          }
        );
      }, el);

      requestAnimationFrame(() => refreshScrollTriggers());
    } catch {
      items.forEach(revealElement);
    }

    return () => {
      ctx?.revert();
      window.clearTimeout(cancelFailsafe);
    };
  }, [selector, amount, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
