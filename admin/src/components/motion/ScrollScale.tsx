"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  scrollTriggerConfig,
  refreshScrollTriggers,
  markRevealed,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ScrollScaleProps = {
  children: React.ReactNode;
  className?: string;
  from?: number;
  y?: number;
};

export default function ScrollScale({
  children,
  className,
  from = 0.97,
  y = 20,
}: ScrollScaleProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    gsap.set(el, { opacity: 0, scale: from, y, x: 0 });
  }, [from, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      registerGsap();
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      markRevealed(el);
      return;
    }

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: from, y, x: 0 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          x: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: scrollTriggerConfig({
            trigger: el,
            start: "top 90%",
            once: true,
          }),
          onComplete: () => markRevealed(el),
        },
      );
    }, el);

    requestAnimationFrame(() => refreshScrollTriggers());

    return () => ctx.revert();
  }, [from, y]);

  return (
    <div ref={ref} className={cn("motion-reveal will-change-transform", className)}>
      {children}
    </div>
  );
}
