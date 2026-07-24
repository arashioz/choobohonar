"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export default function Parallax({ children, className, speed = 40 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(el, { y: 0 });
      gsap.to(el, {
        y: speed,
        ease: "none",
        scrollTrigger: scrollTriggerConfig({
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        }),
      });
    });

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
