"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  refreshScrollTriggers,
  registerGsap,
  scrollTriggerConfig,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useBrandbookPrint } from "@/components/brandbook/BrandbookPrintContext";

type PatternVariant = "forest" | "mono";
type PatternMask = "none" | "soft" | "right" | "left";
type PatternStrength = "quiet" | "soft" | "present";
type PatternMotion = "none" | "scroll" | "counter";
type PatternSurface = "light" | "dark";

type BrandPatternFieldProps = {
  variant?: PatternVariant;
  surface?: PatternSurface;
  mask?: PatternMask;
  strength?: PatternStrength;
  motion?: PatternMotion;
  sheen?: boolean;
  className?: string;
};

const variantClasses: Record<PatternVariant, string> = {
  forest: "brandbook-pattern-forest",
  mono: "brandbook-pattern-mono",
};

const maskClasses: Record<PatternMask, string> = {
  none: "",
  soft: "brandbook-pattern-mask-soft",
  right: "brandbook-pattern-mask-right",
  left: "brandbook-pattern-mask-left",
};

const strengthBySurface: Record<
  PatternSurface,
  Record<PatternStrength, string>
> = {
  light: {
    quiet: "opacity-[0.08]",
    soft: "opacity-[0.12]",
    present: "opacity-[0.18]",
  },
  dark: {
    quiet: "opacity-[0.22]",
    soft: "opacity-[0.34]",
    present: "opacity-[0.48]",
  },
};

export default function BrandPatternField({
  variant = "forest",
  surface = "dark",
  mask = "soft",
  strength = "soft",
  motion = "scroll",
  sheen = false,
  className,
}: BrandPatternFieldProps) {
  const isPrint = useBrandbookPrint();
  const resolvedMotion = isPrint ? "none" : motion;
  const resolvedSheen = isPrint ? false : sheen;
  const rootRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const motionLayer = motionRef.current;
    const sheenLayer = sheenRef.current;
    if (
      !root ||
      !motionLayer ||
      resolvedMotion === "none" ||
      prefersReducedMotion()
    ) {
      return;
    }

    registerGsap();
    const direction = resolvedMotion === "counter" ? -1 : 1;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        motionLayer,
        {
          xPercent: -2.5 * direction,
          yPercent: -1.75,
          scale: 1.02,
        },
        {
          xPercent: 2.5 * direction,
          yPercent: 1.75,
          scale: 1.06,
          ease: "none",
          scrollTrigger: scrollTriggerConfig({
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          }),
        },
      );

      if (resolvedSheen && sheenLayer) {
        gsap.fromTo(
          sheenLayer,
          {
            xPercent: -60 * direction,
            opacity: 0.02,
          },
          {
            xPercent: 60 * direction,
            opacity: surface === "dark" ? 0.2 : 0.08,
            ease: "none",
            scrollTrigger: scrollTriggerConfig({
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.25,
            }),
          },
        );
      }
    }, root);

    requestAnimationFrame(() => refreshScrollTriggers());
    return () => ctx.revert();
  }, [resolvedMotion, resolvedSheen, surface]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-pattern-motion={resolvedMotion}
      data-pattern-surface={surface}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        maskClasses[mask],
        strengthBySurface[surface][strength],
        className,
      )}
    >
      <div
        ref={motionRef}
        className={cn(
          "absolute",
          isPrint ? "inset-0" : "-inset-[8%] will-change-transform",
        )}
      >
        <div
          className={cn(
            "brandbook-pattern-layer brandbook-pattern-size-unified absolute -inset-[4%]",
            variantClasses[variant],
            variant === "mono" && surface === "light" && "brandbook-pattern-mono-light",
          )}
        />
      </div>

      {resolvedSheen && resolvedMotion !== "none" && (
        <div
          ref={sheenRef}
          className="brandbook-pattern-sheen absolute -inset-y-[20%] -left-1/3 w-2/3 will-change-transform"
        />
      )}
    </div>
  );
}
