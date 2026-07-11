"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scheduleRevealFailsafe, scrollTriggerConfig } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  as?: "a" | "button";
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

const variantBase: Record<ButtonVariant, string> = {
  // Calm filled forest; peach is the moving accent on hover.
  primary: "bg-forest",
  // Outline that fills with forest on hover.
  secondary: "border border-forest/25",
};

const fillColor: Record<ButtonVariant, string> = {
  primary: "bg-peach",
  secondary: "bg-forest",
};

// Label colour lives on the content span (a DESCENDANT of the `group` button) so
// that `group-hover:` actually fires. On the button element itself it never would
// — which is why the label used to stay dark on the dark fill (invisible on hover).
const labelColor: Record<ButtonVariant, string> = {
  primary: "text-paper group-hover:text-forest",
  secondary: "text-forest group-hover:text-paper",
};

export default function Button({
  variant = "primary",
  as = "a",
  href,
  type = "button",
  className,
  children,
  showArrow = false,
  target,
  rel,
  onClick,
}: ButtonProps) {
  const rootRef = useRef<HTMLElement>(null);
  const sweepRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const content = contentRef.current;
    const arrow = arrowRef.current;
    const sweep = sweepRef.current;

    // Failsafe reveal (no GSAP) — the control bakes `opacity-0`, so if GSAP
    // fails to load/throws we must not leave the button permanently invisible.
    const reveal = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
      if (content) {
        content.style.opacity = "1";
        content.style.transform = "none";
      }
      if (arrow) arrow.style.opacity = "1";
    };

    if (prefersReducedMotion()) {
      reveal();
      return;
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;
    const cancelFailsafe = scheduleRevealFailsafe(el);

    try {
      registerGsap();
      ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig({
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none none",
        }),
      });

      // Subtle rise + settle for the whole control.
      tl.fromTo(
        el,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Peach wipe sweeps across (start edge -> end edge) then clears,
      // leaving the resting state. RTL-aware: starts from the right.
      if (sweep) {
        tl.fromTo(
          sweep,
          { scaleX: 0, transformOrigin: "right center" },
          { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
          "-=0.7"
        )
          .set(sweep, { transformOrigin: "left center" })
          .to(sweep, { scaleX: 0, duration: 0.55, ease: "power3.inOut" });
      }

      // Label slides into place; arrow reveals last.
      if (content) {
        tl.fromTo(
          content,
          { opacity: 0, x: 12 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
          "-=0.85"
        );
      }
      if (arrow) {
        tl.fromTo(
          arrow,
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "back.out(2)" },
          "-=0.35"
        );
      }
      }, el);
    } catch {
      reveal();
    }

    return () => {
      ctx?.revert();
      cancelFailsafe();
    };
  }, []);

  const classes = cn(
    "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-xl px-7 py-4 text-sm font-medium opacity-0",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
    variantBase[variant],
    className
  );

  const inner = (
    <>
      {/* Hover peach/forest wipe — fills from the start edge (right in RTL). */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-right scale-x-0 transition-transform duration-500 ease-out-expo group-hover:scale-x-100",
          fillColor[variant]
        )}
      />
      {/* One-shot scroll-in sweep (decorative, GSAP-driven). */}
      <span ref={sweepRef} aria-hidden className="absolute inset-0 origin-right scale-x-0 bg-peach/80" />
      <span
        ref={contentRef}
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-colors duration-500 ease-out-expo",
          labelColor[variant]
        )}
      >
        {children}
        {showArrow && (
          <span
            ref={arrowRef}
            aria-hidden
            className="inline-block transition-transform duration-300 ease-out-expo group-hover:-translate-x-1"
          >
            ←
          </span>
        )}
      </span>
    </>
  );

  if (as === "button") {
    return (
      <button ref={rootRef as React.RefObject<HTMLButtonElement>} type={type} onClick={onClick} className={classes}>
        {inner}
      </button>
    );
  }

  return (
    <a
      ref={rootRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={classes}
    >
      {inner}
    </a>
  );
}
