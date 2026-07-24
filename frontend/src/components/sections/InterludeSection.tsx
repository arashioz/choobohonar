"use client";

import { useEffect, useRef } from "react";
import Container from "@/components/layout/Container";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  revealElement,
  isElementHidden,
  scrollTriggerConfig,
} from "@/lib/gsap";

export default function InterludeSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const lineTop = root.querySelector<HTMLElement>("[data-interlude-line='top']");
    const lineBottom = root.querySelector<HTMLElement>("[data-interlude-line='bottom']");
    const mark = root.querySelector<HTMLElement>("[data-interlude-mark]");
    const eyebrow = root.querySelector<HTMLElement>("[data-interlude-eyebrow]");
    const words = root.querySelectorAll<HTMLElement>("[data-interlude-word]");
    const accent = root.querySelector<HTMLElement>("[data-interlude-accent]");

    if (prefersReducedMotion()) {
      [lineTop, lineBottom, mark, eyebrow, accent, ...words].forEach((el) => {
        if (el) revealElement(el);
      });
      return;
    }

    registerGsap();
    const animated = [lineTop, lineBottom, mark, eyebrow, accent, ...Array.from(words)].filter(
      (el): el is HTMLElement => Boolean(el)
    );
    const failsafeId = window.setTimeout(() => {
      animated.forEach((el) => {
        if (isElementHidden(el)) revealElement(el);
      });
    }, 2500);

    const ctx = gsap.context(() => {
      gsap.set([lineTop, lineBottom], { scaleX: 0, opacity: 1 });
      gsap.set(mark, { scale: 0, opacity: 0 });
      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(words, { opacity: 0, y: 22 });
      gsap.set(accent, { opacity: 0, scaleX: 0, transformOrigin: "right center" });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: scrollTriggerConfig({
          trigger: root,
          start: "top 78%",
          toggleActions: "play none none none",
        }),
      });

      tl.to(lineTop, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0)
        .to(lineBottom, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.08)
        .to(mark, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, 0.2)
        .to(eyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0.28)
        .to(
          words,
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.045, ease: "power3.out" },
          0.38
        )
        .to(accent, { opacity: 1, scaleX: 1, duration: 0.55, ease: "power2.inOut" }, "-=0.35");
    }, root);

    return () => {
      ctx.revert();
      window.clearTimeout(failsafeId);
    };
  }, []);

  const lead = "هر فضا، فرصتی برای ساختن خانه‌ای است که با دقت";
  const emphasis = "لمس می‌شود";
  const tail = "— نه فقط دیده.";

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-paper py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(154,49,16,0.05),transparent_58%),radial-gradient(ellipse_at_80%_100%,rgba(9,43,28,0.04),transparent_42%)]" />

      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span
            data-interlude-line="top"
            aria-hidden
            className="mb-8 h-px w-16 origin-center bg-forest/20 md:mb-10 md:w-24"
          />

          <span
            data-interlude-mark
            aria-hidden
            className="mb-5 flex h-1.5 w-1.5 rounded-full bg-brick md:mb-6"
          />

          <p data-interlude-eyebrow className="eyebrow text-brick">
            خانه چوب و هنر
          </p>

          <p className="mt-5 text-balance text-[clamp(1.45rem,3.4vw,2.35rem)] font-light leading-[1.35] tracking-tight text-forest md:mt-6">
            {lead.split(" ").map((word, i) => (
              <span key={`l-${i}`} data-interlude-word className="inline-block whitespace-pre">
                {word}{" "}
              </span>
            ))}
            <span className="relative inline-block whitespace-nowrap text-brick">
              {emphasis.split(" ").map((word, i) => (
                <span key={`e-${i}`} data-interlude-word className="inline-block whitespace-pre">
                  {word}{" "}
                </span>
              ))}
              <span
                data-interlude-accent
                aria-hidden
                className="absolute inset-x-0 -bottom-1 h-px origin-right bg-brick/45"
              />
            </span>
            {tail.split(" ").map((word, i) => (
              <span key={`t-${i}`} data-interlude-word className="inline-block whitespace-pre">
                {word}{" "}
              </span>
            ))}
          </p>

          <span
            data-interlude-line="bottom"
            aria-hidden
            className="mt-8 h-px w-16 origin-center bg-forest/20 md:mt-10 md:w-24"
          />
        </div>
      </Container>
    </section>
  );
}
