"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  scheduleRevealFailsafe,
  refreshScrollTriggers,
  scrollTriggerConfig,
  markRevealed,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

type FadeUpVariant = "up" | "right" | "left" | "scale" | "fade";

type FadeUpProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  y?: number;
  duration?: number;
  variant?: FadeUpVariant;
  as?: keyof React.JSX.IntrinsicElements;
} & Omit<React.HTMLAttributes<HTMLElement>, "style">;

function getFadeFrom(variant: FadeUpVariant, offset: number) {
  switch (variant) {
    case "right":
      return { opacity: 0, x: offset, y: 0, scale: 1 };
    case "left":
      return { opacity: 0, x: -offset, y: 0, scale: 1 };
    case "scale":
      return { opacity: 0, y: offset * 0.45, scale: 0.97, x: 0 };
    case "fade":
      return { opacity: 0, x: 0, y: 0, scale: 1 };
    case "up":
    default:
      return { opacity: 0, y: offset, x: 0, scale: 1 };
  }
}

function getFadeTo(variant: FadeUpVariant) {
  if (variant === "scale") {
    return { opacity: 1, y: 0, scale: 1, x: 0 };
  }
  if (variant === "right" || variant === "left") {
    return { opacity: 1, x: 0, y: 0, scale: 1 };
  }
  return { opacity: 1, y: 0, x: 0, scale: 1 };
}

export default function FadeUp({
  children,
  className,
  style,
  delay = 0,
  y = 32,
  duration = 0.95,
  variant = "up",
  as = "div",
  ...props
}: FadeUpProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as React.ElementType;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    registerGsap();
    gsap.set(el, getFadeFrom(variant, y));
  }, [variant, y]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      revealElement(el);
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancelFailsafe = scheduleRevealFailsafe(el, 2800);

    try {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.fromTo(
          el,
          getFadeFrom(variant, y),
          {
            ...getFadeTo(variant),
            duration,
            delay,
            ease: "power3.out",
            scrollTrigger: scrollTriggerConfig({
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
              once: true,
            }),
            onComplete: () => markRevealed(el),
          },
        );
      });

      requestAnimationFrame(() => refreshScrollTriggers());
    } catch {
      revealElement(el);
    }

    return () => {
      ctx?.revert();
      cancelFailsafe();
    };
  }, [delay, y, duration, variant]);

  return (
    <Tag ref={ref} className={cn("motion-reveal", className)} style={style} {...props}>
      {children}
    </Tag>
  );
}
