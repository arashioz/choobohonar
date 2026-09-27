"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  isElementHidden,
  prefersReducedMotion,
  registerGsap,
  revealElement,
  scrollTriggerConfig,
  shouldSkipScrollMotion,
} from "@/lib/gsap";
import { motionTokens } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

type LeafMotionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Catalog leaves: desktop keeps the editorial clip reveal.
 * Phones skip ScrollTrigger and clip-path — those stall on address-bar resize
 * and leave cards invisible while the user is already scrolling.
 */
export default function LeafMotion({ children, className, delay = 0 }: LeafMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (prefersReducedMotion()) {
      revealElement(root);
      return;
    }

    let fallbackId = 0;

    if (shouldSkipScrollMotion()) {
      const duration = 0.42;
      gsap.set(root, { opacity: 0, y: 14 });

      const finish = () => {
        gsap.to(root, {
          opacity: 1,
          y: 0,
          duration,
          ease: "power2.out",
          overwrite: true,
        });
        window.clearTimeout(fallbackId);
        fallbackId = window.setTimeout(() => {
          if (isElementHidden(root)) revealElement(root);
        }, duration * 1000 + 280);
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          finish();
          observer.disconnect();
        },
        { rootMargin: "0px 0px 18% 0px", threshold: 0.12 },
      );
      observer.observe(root);

      return () => {
        window.clearTimeout(fallbackId);
        observer.disconnect();
        gsap.killTweensOf(root);
      };
    }

    registerGsap();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        fallbackId = window.setTimeout(() => {
          if (isElementHidden(root)) revealElement(root);
        }, Math.max(900, (delay + motionTokens.duration.reveal) * 1000 + 200));
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(root);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { opacity: 0, y: motionTokens.reveal.distance, clipPath: "inset(0 0 100% 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: motionTokens.duration.reveal,
          delay,
          ease: motionTokens.ease.editorial,
          scrollTrigger: scrollTriggerConfig({
            trigger: root,
            start: motionTokens.reveal.start,
            once: true,
          }),
        },
      );
    }, root);

    return () => {
      window.clearTimeout(fallbackId);
      observer.disconnect();
      ctx.revert();
    };
  }, [delay]);

  return (
    <div ref={rootRef} className={cn("motion-reveal", className)}>
      {children}
    </div>
  );
}
