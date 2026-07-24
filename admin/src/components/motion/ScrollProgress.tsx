"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion()) return;
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(bar, { transformOrigin: "right center", scaleX: 0 });
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: scrollTriggerConfig({
          trigger: "#brandbook-scroll-root",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        }),
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[2px] bg-forest/5"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full origin-right scale-x-0 bg-gradient-to-l from-peach via-peach-deep to-forest"
      />
    </div>
  );
}
