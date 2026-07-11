"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { toFa } from "@/lib/utils";

const steps = [
  {
    n: 1,
    title: "گفت‌وگو و درک فضا",
    body: "کار با شنیدن آغاز می‌شود؛ سبک زندگی، نور طبیعی و نسبت‌های فضا را می‌خوانیم تا طراحی از دل خانه شما بیرون بیاید.",
    image: "/images/projects/aknoon-residence/11.jpg",
  },
  {
    n: 2,
    title: "طراحی و انتخاب متریال",
    body: "هر قطعه را با چوب، روکش و پرداختی متناسب با فضا طراحی می‌کنیم؛ نمونه‌های واقعی متریال در کنار نقشه‌ها بررسی می‌شوند.",
    image: "/images/projects/armon-hotel/24.jpg",
  },
  {
    n: 3,
    title: "ساخت و نصب",
    body: "ساخت با اتصالات مهندسی‌شده و کنترل کیفیت چندمرحله‌ای انجام می‌شود و در نهایت در محل با دقت نصب و تحویل می‌گردد.",
    image: "/images/projects/shenaj-villa/46.jpg",
  },
];

// Timeline rhythm (in abstract units the scrub maps onto the pinned scroll range).
const HOLD = 0.6; // each step rests here so it's clearly readable
const TRANS = 1.1; // cross-step transition

export default function ApproachSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    registerGsap();

    const bgs = gsap.utils.toArray<HTMLElement>("[data-approach-bg]", el);
    const texts = gsap.utils.toArray<HTMLElement>("[data-approach-text]", el);
    const progress = el.querySelector<HTMLElement>("[data-approach-progress]");

    // Reduced motion: show the first step, no scroll-driven animation.
    if (prefersReducedMotion()) {
      bgs.forEach((bg, i) => gsap.set(bg, { autoAlpha: i === 0 ? 1 : 0, scale: 1 }));
      texts.forEach((t, i) => gsap.set(t, { autoAlpha: i === 0 ? 1 : 0, yPercent: 0 }));
      return;
    }

    const ctx = gsap.context(() => {
      // Initial state: first step settled, the rest staged below and softly zoomed in.
      bgs.forEach((bg, i) => gsap.set(bg, { autoAlpha: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.08 }));
      texts.forEach((t, i) => gsap.set(t, { autoAlpha: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 100 }));
      if (progress) gsap.set(progress, { scaleX: 0, transformOrigin: "right center" });

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: scrollTriggerConfig({
          trigger: el,
          start: "top top",
          end: "+=" + steps.length * 110 + "%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }),
      });

      // Open on step 1 for a beat…
      tl.to({}, { duration: HOLD });

      // …then conveyor each next step in, resting on each one.
      for (let i = 1; i < steps.length; i++) {
        const label = "step" + i;
        tl.addLabel(label)
          .to(bgs[i - 1], { autoAlpha: 0, duration: TRANS, ease: "power1.inOut" }, label)
          .to(bgs[i], { autoAlpha: 1, scale: 1, duration: TRANS, ease: "power2.out" }, label)
          .to(texts[i - 1], { yPercent: -100, autoAlpha: 0, duration: TRANS }, label)
          .to(texts[i], { yPercent: 0, autoAlpha: 1, duration: TRANS }, label)
          // rest on the freshly-arrived step (the final one of these keeps step 3 on
          // screen before the section unpins — this is what was missing before).
          .to({}, { duration: HOLD });
      }

      // Peach progress rail tracks scroll across the whole sequence.
      if (progress) tl.to(progress, { scaleX: 1, ease: "none", duration: tl.duration() }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section id="approach" ref={root} className="relative h-[100svh] overflow-hidden bg-forest text-paper">
      {/* Background layer — one photo per step under the same dominant forest-green wash. */}
      <div className="absolute inset-0">
        {steps.map((step) => (
          <div key={step.n} data-approach-bg className="absolute inset-0 will-change-[transform,opacity]">
            <Image src={step.image} alt="" fill sizes="100vw" className="object-cover" priority={step.n === 1} />
            <div className="absolute inset-0 bg-forest/80" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/75" />
          </div>
        ))}
      </div>

      {/* Content layer — static eyebrow + a vertical conveyor of step copy. */}
      <div className="relative z-10 mx-auto flex h-full max-w-container flex-col px-6 pt-28 md:px-10 lg:px-16">
        <p className="eyebrow shrink-0 text-peach">رویکرد ما</p>

        <div className="relative mt-10 flex-1 overflow-hidden md:mt-14">
          {steps.map((step) => (
            <div
              key={step.n}
              data-approach-text
              className="absolute inset-0 flex flex-col justify-center pb-[6vh] will-change-[transform,opacity]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-8 lg:gap-10">
                <span className="font-sans text-[clamp(4rem,12vw,11rem)] font-light leading-[0.8] text-peach">
                  {toFa(step.n)}
                </span>
                <div className="max-w-xl border-r-0 md:border-r md:border-peach/25 md:pr-8 lg:pr-10">
                  <h3 className="text-balance text-[clamp(2rem,5vw,4rem)] font-light leading-[1.05] tracking-tightest">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-paper/80">{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creative, on-brand touch: a peach progress rail that fills as you scroll the steps. */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-paper/15">
        <div data-approach-progress className="h-full origin-right scale-x-0 bg-peach" />
      </div>
    </section>
  );
}
