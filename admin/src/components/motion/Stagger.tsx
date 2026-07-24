"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  refreshScrollTriggers,
  scrollTriggerConfig,
  markRevealed,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type StaggerFrom = "up" | "right";

type StaggerProps = {
  children: React.ReactNode;
  className?: string;
  selector?: string;
  amount?: number;
  y?: number;
  from?: StaggerFrom;
  start?: string;
};

export default function Stagger({
  children,
  className,
  selector = ":scope > *",
  amount = 0.5,
  y = 28,
  from = "up",
  start = "top 88%",
}: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const hiddenState =
    from === "right"
      ? { opacity: 0, x: y, y: 0, scale: 1 }
      : { opacity: 0, y, x: 0, scale: 1 };
  const visibleState = { opacity: 1, x: 0, y: 0, scale: 1 };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (items.length) gsap.set(items, hiddenState);
  }, [selector, y, from]);

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
    }, 2800);

    let ctx: ReturnType<typeof gsap.context> | undefined;

    try {
      ctx = gsap.context(() => {
        gsap.fromTo(
          items,
          hiddenState,
          {
            ...visibleState,
            duration: 0.85,
            ease: "power3.out",
            stagger: { amount },
            scrollTrigger: scrollTriggerConfig({
              trigger: el,
              start,
              once: true,
            }),
            onComplete: () => items.forEach(markRevealed),
          },
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
  }, [selector, amount, y, from, start]);

  return (
    <div ref={ref} className={cn("motion-stagger", className)}>
      {children}
    </div>
  );
}
