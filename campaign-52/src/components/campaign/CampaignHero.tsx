"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { campaign } from "@/data/campaign";
import { cn, toFa } from "@/lib/utils";
import { gsap, prefersReducedMotion, registerGsap, scrollTriggerConfig } from "@/lib/gsap";
import { lockIntro, unlockIntro, afterIntro, pinScrollTop } from "@/lib/intro";
import CelebrationBurst from "@/components/motion/CelebrationBurst";

const WHITE = {
  rest:
    "M0 80 C32 80 55 80 68 80 C82 80 90 80 100 80 C110 80 118 80 132 80 C145 80 168 80 200 80 L200 80 L0 80 Z",
  tension:
    "M0 80 C32 80 55 77 68 72 C82 66 90 64 100 64 C110 64 118 66 132 72 C145 77 168 80 200 80 L200 80 L0 80 Z",
  pull:
    "M0 80 C34 80 58 75 70 68 C84 58 92 55 100 55 C108 55 116 58 130 68 C142 75 166 80 200 80 L200 80 L0 80 Z",
} as const;

export default function CampaignHero() {
  const root = useRef<HTMLElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const mark52 = useRef<HTMLParagraphElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    lockIntro();
    const el = video.current;
    if (!el) return;
    // Native video URLs do not receive Next.js' basePath automatically.
    // Keep them below /landing so nginx forwards them to the landing app.
    const src = window.matchMedia("(min-width: 768px)").matches ? "/landing/videos/hero-desktop.mp4" : "/landing/videos/hero-mobile.mp4";
    if (el.getAttribute("data-src") !== src) {
      el.src = src;
      el.setAttribute("data-src", src);
      el.load();
    }
    el.pause();
    try {
      el.currentTime = 0;
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-hero-line]");
    const intro = el.querySelectorAll<HTMLElement>("[data-hero-intro]");
    const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
    const fabric = el.querySelector<SVGPathElement>("[data-hero-fabric]");
    const shade = el.querySelector<SVGPathElement>("[data-hero-shade]");
    let cancelled = false;
    let parallaxOff: () => void = () => undefined;

    const playVideo = () => {
      const mediaEl = video.current;
      if (!mediaEl || prefersReducedMotion() || document.hidden) return;
      pinScrollTop();
      void mediaEl.play().catch(() => undefined).finally(pinScrollTop);
    };

    const finish = () => {
      if (cancelled) return;
      setLoaderHidden(true);
      pinScrollTop();
      unlockIntro();
      playVideo();
    };

    const showStatic = () => {
      registerGsap();
      const digits = mark52.current?.querySelectorAll<HTMLElement>("[data-digit]") ?? [];
      gsap.set([intro, cue, ...Array.from(lines), ...Array.from(digits)], {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
        rotateX: 0,
        clearProps: "transform",
      });
      if (fabric) gsap.set(fabric, { attr: { d: WHITE.rest } });
      finish();
    };

    const failsafe = window.setTimeout(showStatic, 6200);
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
        gsap.set(lines, { yPercent: 110 });
        gsap.set(intro, { opacity: 0, y: 16 });
        gsap.set(cue, { opacity: 0 });
        gsap.set(mark52.current, { opacity: 1 });
        const digits = mark52.current?.querySelectorAll<HTMLElement>("[data-digit]") ?? [];
        gsap.set(digits, { yPercent: 130, opacity: 0, scale: 0.72, rotateX: 48 });

        const tl = gsap.timeline({
          onComplete: () => {
            window.clearTimeout(failsafe);
            finish();
          },
        });

        tl.to(digits, {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1.05,
          stagger: 0.1,
          ease: "power4.out",
          transformOrigin: "50% 88%",
          transformPerspective: 900,
          force3D: true,
        })
          .add(() => setBurst(true), 0.28)
          .to(mark52.current, { scale: 1.06, duration: 0.55, ease: "power2.inOut" }, "+=0.28")
          .to(mark52.current, { opacity: 0, y: -18, duration: 0.38, ease: "power2.in" }, "+=0.2")
          .to(loader.current, { yPercent: -100, duration: 0.92, ease: "power4.inOut" })
          .fromTo(media.current, { scale: 1.08 }, { scale: 1, duration: 1.7, ease: "power2.out" }, "<")
          .to(lines, { yPercent: 0, duration: 0.82, ease: "power4.out", stagger: 0.08 }, "-=0.55")
          .to(intro, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07 }, "-=0.42")
          .to(cue, { opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.35");

        if (fabric) {
          gsap.set(fabric, { attr: { d: WHITE.rest } });
          if (shade) gsap.set(shade, { attr: { d: WHITE.rest }, opacity: 0 });
          const pull = gsap.timeline({ repeat: -1, repeatDelay: 1.45, delay: 0.55 });
          pull
            .to(fabric, { attr: { d: WHITE.tension }, duration: 0.58, ease: "power2.in" }, 0)
            .to(shade, { attr: { d: WHITE.tension }, opacity: 0.18, duration: 0.58, ease: "power2.in" }, 0.04)
            .to(fabric, { attr: { d: WHITE.pull }, duration: 0.48, ease: "power3.out" }, 0.58)
            .to(shade, { attr: { d: WHITE.pull }, opacity: 0.28, duration: 0.48, ease: "power3.out" }, 0.62)
            .to(fabric, { attr: { d: WHITE.tension }, duration: 0.16, ease: "power4.in" })
            .to(shade, { attr: { d: WHITE.tension }, opacity: 0.12, duration: 0.16, ease: "power4.in" }, "<")
            .to(fabric, { attr: { d: WHITE.rest }, duration: 0.52, ease: "power2.out" })
            .to(shade, { attr: { d: WHITE.rest }, opacity: 0, duration: 0.42, ease: "power2.out" }, "<0.04");
        }
      }, el);
    } catch {
      showStatic();
    }

    parallaxOff = afterIntro(() => {
      if (cancelled || prefersReducedMotion() || !media.current) return;
      registerGsap();
      gsap.to(media.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: scrollTriggerConfig({ trigger: el, start: "top top", end: "bottom top", scrub: true }),
      });
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      parallaxOff();
      window.clearTimeout(failsafe);
    };
  }, []);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const sync = () => {
      if (document.hidden || prefersReducedMotion() || document.documentElement.classList.contains("is-intro")) {
        el.pause();
        return;
      }
      void el.play().catch(() => undefined);
    };
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] w-full overflow-hidden bg-forest [overflow-anchor:none]">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <Image src="/images/heritage.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 h-full max-h-full w-full max-w-full object-cover"
          webkit-playsinline="true"
        >
          <source src="/landing/videos/hero-desktop.mp4" type="video/mp4" media="(min-width: 768px)" />
          <source src="/landing/videos/hero-mobile.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/35" />
        <div className="commerce-grain absolute inset-0 opacity-40" />
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-0 max-w-container flex-col justify-end px-5 pb-[max(4.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-20 md:px-10 md:pb-24 lg:px-16">
        <p data-hero-intro className="eyebrow mb-5 text-peach">
          {campaign.rangeFa}
        </p>
        <h1 className="display-title max-w-4xl text-[clamp(2.1rem,5.6vw,5rem)] text-paper">
          <span className="block overflow-hidden py-[0.04em]">
            <span data-hero-line className="block will-change-transform">
              خانه چوب و هنر،
            </span>
          </span>
          <span className="block overflow-hidden py-[0.04em]">
            <span data-hero-line className="block will-change-transform">
              {toFa(52)}ساله شد
            </span>
          </span>
        </h1>
        <p data-hero-intro className="mt-6 max-w-xl text-lg font-light leading-8 text-paper/80 md:text-xl">
          {campaign.definition}
        </p>
      </div>

      <div
        data-hero-cue
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[4.5rem] overflow-hidden opacity-0 sm:h-20"
        aria-hidden
      >
        <svg className="h-full w-full" viewBox="0 0 200 80" preserveAspectRatio="none">
          <defs>
            <filter id="hero-cloth-soft" x="-8%" y="-20%" width="116%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
              <feOffset dy="1" result="off" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.22" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path data-hero-shade d={WHITE.rest} fill="#041510" opacity="0" />
          <path data-hero-fabric d={WHITE.rest} fill="#F4EFE8" filter="url(#hero-cloth-soft)" />
        </svg>
      </div>

      <div
        ref={loader}
        aria-hidden={loaderHidden}
        className={cn(
          "hero-loader absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-forest",
          loaderHidden && "pointer-events-none invisible -translate-y-full opacity-0",
        )}
      >
        <CelebrationBurst active={burst} />
        <div className="relative z-[3] flex flex-col items-center">
          <div className="overflow-hidden" style={{ perspective: 900 }}>
            <p
              ref={mark52}
              dir="ltr"
              className="flex items-baseline font-extralight leading-none text-peach"
              style={{ fontSize: "clamp(5.8rem, 28vw, 13rem)" }}
            >
              <span data-digit className="inline-block origin-bottom will-change-transform">
                {toFa(5)}
              </span>
              <span data-digit className="inline-block origin-bottom will-change-transform">
                {toFa(2)}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
