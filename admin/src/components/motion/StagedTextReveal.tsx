"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  scrollTriggerConfig,
  refreshScrollTriggers,
  ScrollTrigger,
} from "@/lib/gsap";

type StagedTextRevealProps = {
  lines: string[];
  signature?: string;
  tagline?: string;
  taglineEn?: string;
  className?: string;
};

export default function StagedTextReveal({
  lines,
  signature,
  tagline,
  taglineEn,
  className,
}: StagedTextRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const signatureRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(linesRef.current.filter(Boolean), { opacity: 0, y: 10 });
      if (linesRef.current[0]) gsap.set(linesRef.current[0], { opacity: 1, y: 0 });
      if (signatureRef.current) gsap.set(signatureRef.current, { opacity: 0, y: 16 });

      ScrollTrigger.create({
        ...scrollTriggerConfig({
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.55,
          onUpdate: (self) => {
            const progress = Math.min(Math.max(self.progress, 0), 1);
            const floatIndex = progress * lines.length;
            const current = Math.min(Math.floor(floatIndex), lines.length - 1);
            const blend = floatIndex - current;

            linesRef.current.forEach((lineEl, index) => {
              if (!lineEl) return;

              let opacity = 0;
              let y = 10;

              if (index === current) {
                opacity = 1 - blend;
                y = blend * 6;
              } else if (index === current + 1) {
                opacity = blend;
                y = (1 - blend) * 6;
              }

              gsap.set(lineEl, { opacity, y: y * -1 });
            });

            if (signatureRef.current) {
              const sigProgress = Math.min(Math.max((progress - 0.86) / 0.14, 0), 1);
              gsap.set(signatureRef.current, {
                opacity: sigProgress,
                y: (1 - sigProgress) * 12,
              });
            }

            if (current !== lastIndexRef.current) {
              lastIndexRef.current = current;
              setActiveIndex(current);
            }
          },
        }),
      });
    }, root);

    requestAnimationFrame(() => refreshScrollTriggers());

    return () => ctx.revert();
  }, [lines.length]);

  if (prefersReducedMotion()) {
    return (
      <div className={cn("w-full bg-forest", className)}>
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center sm:px-10 lg:py-24">
          <div className="flex flex-col gap-6">
            {lines.map((line) => (
              <p
                key={line}
                className="text-xl font-light leading-relaxed text-paper/90 sm:text-2xl"
              >
                {line}
              </p>
            ))}
          </div>
          {(signature || tagline) && (
            <div className="mt-12 flex flex-col items-center gap-3">
              {signature && (
                <p className="text-3xl font-bold tracking-tightest text-paper sm:text-4xl">
                  {signature}
                </p>
              )}
              {tagline && (
                <p className="text-lg font-light text-paper/70">{tagline}</p>
              )}
              {taglineEn && (
                <p className="text-sm font-medium tracking-wide text-paper/40 font-mono">
                  {taglineEn}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const scrollHeight = `${Math.max(lines.length * 42, 180)}vh`;

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full", className)}
      style={{ height: scrollHeight }}
    >
      <div className="sticky top-0 flex min-h-[100dvh] w-full items-center justify-center bg-forest">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-6 text-center sm:px-10 lg:px-16">
          <div className="relative flex min-h-[8rem] w-full items-center justify-center sm:min-h-[10rem]">
            {lines.map((line, index) => (
              <p
                key={line}
                ref={(node) => {
                  linesRef.current[index] = node;
                }}
                data-manifesto-line
                className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2 text-xl font-light leading-relaxed text-paper will-change-transform sm:text-2xl lg:text-[1.65rem] lg:leading-[1.7]"
                style={{ opacity: index === 0 ? 1 : 0 }}
              >
                {line}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {lines.map((line, index) => (
              <span
                key={line}
                className={cn(
                  "h-1 rounded-full transition-[width,background-color] duration-300 ease-out",
                  index === activeIndex
                    ? "w-8 bg-peach"
                    : index < activeIndex
                      ? "w-2 bg-peach/50"
                      : "w-2 bg-paper/20",
                )}
              />
            ))}
          </div>

          <p className="mt-6 text-[11px] tracking-[0.18em] text-paper/35">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(lines.length).padStart(2, "0")}
          </p>

          <div
            ref={signatureRef}
            className="mt-12 flex flex-col items-center gap-3 will-change-transform"
            style={{ opacity: 0 }}
          >
            <div className="mb-2 h-px w-20 bg-peach" />
            {signature && (
              <p className="text-3xl font-bold tracking-tightest text-paper sm:text-4xl">
                {signature}
              </p>
            )}
            {tagline && (
              <p className="text-lg font-light text-paper/70">{tagline}</p>
            )}
            {taglineEn && (
              <p className="text-sm font-medium tracking-wide text-paper/40 font-mono">
                {taglineEn}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
