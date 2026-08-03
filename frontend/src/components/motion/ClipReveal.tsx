"use client";

import { useLayoutEffect, useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  revealElement,
  isElementHidden,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion-tokens";

type ClipRevealProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
  y?: number;
};

/** Editorial reveal used by commerce hero media and oversized headings. */
export default function ClipReveal({
  children,
  className,
  contentClassName,
  delay = 0,
  y = motionTokens.reveal.distance,
}: ClipRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    if (prefersReducedMotion()) {
      revealElement(content);
      return;
    }

    let fallbackId = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        fallbackId = window.setTimeout(() => {
          if (isElementHidden(content)) revealElement(content);
        }, Math.max(900, (delay + motionTokens.duration.reveal) * 1000 + 200));
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    observer.observe(root);

    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        { opacity: 0, y, clipPath: "inset(0 0 100% 0)" },
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
  }, [delay, y]);

  return (
    <div ref={rootRef} className={cn("overflow-hidden", className)}>
      <div ref={contentRef} className={cn("motion-reveal", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
