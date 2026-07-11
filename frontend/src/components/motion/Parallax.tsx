"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Total vertical travel in px across the scroll range. Positive = slower. */
  speed?: number;
};

export default function Parallax({ children, className, speed = 80 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: -speed },
        {
          y: speed,
          ease: "none",
          scrollTrigger: scrollTriggerConfig({
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }),
        }
      );
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
