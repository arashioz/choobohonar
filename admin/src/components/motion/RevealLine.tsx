"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealLineProps = {
  className?: string;
  origin?: "right" | "left" | "center";
};

const originMap = {
  right: "right center",
  left: "left center",
  center: "center center",
} as const;

export default function RevealLine({ className, origin = "right" }: RevealLineProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    gsap.set(el, { transformOrigin: originMap[origin], scaleX: 0 });
  }, [origin]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.to(el, {
        scaleX: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: scrollTriggerConfig({
          trigger: el,
          start: "top 92%",
          once: true,
        }),
      });
    });

    return () => ctx.revert();
  }, [origin]);

  return (
    <div
      ref={ref}
      className={cn("h-px w-full origin-right scale-x-0 bg-forest/15 will-change-transform", className)}
      aria-hidden
    />
  );
}
