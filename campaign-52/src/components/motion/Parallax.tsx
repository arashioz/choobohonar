"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { afterIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  speed?: number;
};

export default function Parallax({ children, className, speed = 64 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: ReturnType<typeof gsap.context> | undefined;

    const off = afterIntro(() => {
      if (prefersReducedMotion()) return;
      registerGsap();
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          { y: -speed },
          {
            y: speed,
            ease: "none",
            scrollTrigger: scrollTriggerConfig({
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }),
          },
        );
      });
    });

    return () => {
      off();
      ctx?.revert();
    };
  }, [speed]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}
