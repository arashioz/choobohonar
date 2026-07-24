"use client";

import { useEffect, useRef } from "react";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type BrandbookHeroMotionProps = {
  children: React.ReactNode;
  className?: string;
};

export default function BrandbookHeroMotion({ children, className }: BrandbookHeroMotionProps) {
  const root = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const glow = glowRef.current;
    if (!el) return;

    const logo = el.querySelector<HTMLElement>("[data-hero-logo]");
    const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
    const soft = el.querySelectorAll<HTMLElement>("[data-hero-soft]");
    const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
    let cancelled = false;

    const showStatic = () => {
      if (cancelled) return;
      registerGsap();
      const targets = [logo, cue, ...Array.from(lines), ...Array.from(soft)].filter(Boolean) as HTMLElement[];
      targets.forEach((node) => {
        node.dataset.revealed = "true";
      });
      gsap.set(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: "transform",
      });
    };

    const failsafe = window.setTimeout(showStatic, 2200);

    if (prefersReducedMotion()) {
      showStatic();
      return () => {
        cancelled = true;
        window.clearTimeout(failsafe);
      };
    }

    let ctx: ReturnType<typeof gsap.context> | undefined;

    try {
      registerGsap();
      ctx = gsap.context(() => {
        gsap.set(logo, { opacity: 0, scale: 0.88, y: 16 });
        gsap.set(lines, { opacity: 0, y: 48 });
        gsap.set(soft, { opacity: 0, y: 24 });
        gsap.set(cue, { opacity: 0, y: 12 });

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.to(logo, { opacity: 1, scale: 1, y: 0, duration: 1.1, onComplete: () => logo?.setAttribute("data-revealed", "true") })
          .to(lines, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
            onComplete: () => lines.forEach((line) => line.setAttribute("data-revealed", "true")),
          }, "-=0.55")
          .to(soft, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.08,
            onComplete: () => soft.forEach((node) => node.setAttribute("data-revealed", "true")),
          }, "-=0.65")
          .to(cue, { opacity: 1, y: 0, duration: 0.7, onComplete: () => cue?.setAttribute("data-revealed", "true") }, "-=0.35");

        if (cue) {
          gsap.to(cue, {
            y: 8,
            duration: 1.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 1.2,
          });
        }

        if (glow) {
          gsap.set(glow, { y: 0, opacity: 0.35 });
          gsap.to(glow, {
            y: 24,
            opacity: 0.5,
            ease: "none",
            scrollTrigger: scrollTriggerConfig({
              trigger: el,
              start: "top top",
              end: "bottom top",
              scrub: 0.75,
            }),
          });
        }
      }, el);
    } catch {
      showStatic();
    }

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      className={cn(
        "relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-forest px-8 text-center",
        className,
      )}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-40 will-change-transform"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(251,190,166,0.12) 0%, transparent 70%)",
        }}
      />
      {children}
    </section>
  );
}
