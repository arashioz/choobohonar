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
import { afterIntro } from "@/lib/intro";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion-tokens";

type ClipRevealProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  delay?: number;
  y?: number;
};

/** Editorial clip-up used on the main Choobohonar storefront. */
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
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let fallbackId = 0;
    let observer: IntersectionObserver | undefined;

    const start = () => {
      if (prefersReducedMotion()) {
        revealElement(content);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;
          fallbackId = window.setTimeout(() => {
            if (isElementHidden(content)) revealElement(content);
          }, Math.max(900, (delay + motionTokens.duration.reveal) * 1000 + 200));
          observer?.disconnect();
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
      );
      observer.observe(root);

      registerGsap();
      ctx = gsap.context(() => {
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
    };

    const off = afterIntro(start);
    return () => {
      off();
      window.clearTimeout(fallbackId);
      observer?.disconnect();
      ctx?.revert();
    };
  }, [delay, y]);

  return (
    <div ref={rootRef} className={cn("overflow-hidden", className)}>
      <div ref={contentRef} className={cn("motion-clip", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
