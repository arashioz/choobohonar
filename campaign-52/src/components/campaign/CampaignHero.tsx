"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { landingPublicPath } from "@/lib/brand-assets";
import CelebrationBurst from "@/components/motion/CelebrationBurst";

const WHITE = {
  rest:
    "M0 80 C32 80 55 80 68 80 C82 80 90 80 100 80 C110 80 118 80 132 80 C145 80 168 80 200 80 L200 80 L0 80 Z",
  tension:
    "M0 80 C32 80 55 77 68 72 C82 66 90 64 100 64 C110 64 118 66 132 72 C145 77 168 80 200 80 L200 80 L0 80 Z",
  pull:
    "M0 80 C34 80 58 75 70 68 C84 58 92 55 100 55 C108 55 116 58 130 68 C142 75 166 80 200 80 L200 80 L0 80 Z",
} as const;

function whenReady(img: HTMLImageElement | null, onReady: () => void) {
  if (!img) {
    onReady();
    return () => undefined;
  }
  if (img.complete && img.naturalWidth > 0) {
    onReady();
    return () => undefined;
  }
  const done = () => onReady();
  img.addEventListener("load", done, { once: true });
  img.addEventListener("error", done, { once: true });
  return () => {
    img.removeEventListener("load", done);
    img.removeEventListener("error", done);
  };
}

export default function CampaignHero() {
  const root = useRef<HTMLElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLImageElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const loaderImg = useRef<HTMLImageElement>(null);
  const [loaderGone, setLoaderGone] = useState(false);
  const [heroRequested, setHeroRequested] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => whenReady(loaderImg.current, () => setHeroRequested(true)), []);

  useEffect(() => {
    if (!heroReady) return;
    const el = root.current;
    if (!el) return;
    const cue = el.querySelector<HTMLElement>("[data-hero-cue]");
    const fabric = el.querySelector<SVGPathElement>("[data-hero-fabric]");
    const shade = el.querySelector<SVGPathElement>("[data-hero-shade]");
    let cancelled = false;
    let ctx: ReturnType<typeof gsap.context> | undefined;
    let started = false;

    const finish = () => {
      if (cancelled) return;
      setLoaderGone(true);
    };

    const showStatic = () => {
      registerGsap();
      gsap.set([cue, mark.current, media.current], { opacity: 1, y: 0, scale: 1, yPercent: 0 });
      if (fabric) gsap.set(fabric, { attr: { d: WHITE.rest } });
      finish();
    };

    const play = () => {
      if (cancelled || started) return;
      started = true;
      if (prefersReducedMotion()) {
        showStatic();
        return;
      }

      registerGsap();
      gsap.ticker.lagSmoothing(0);
      ctx = gsap.context(() => {
        gsap.set(cue, { opacity: 0 });
        gsap.set(mark.current, { opacity: 0, y: 16 });
        gsap.set(media.current, { opacity: 1, scale: 1.03 });

        const tl = gsap.timeline({
          defaults: { ease: "power2.out", force3D: true },
          onComplete: finish,
        });

        tl.to(mark.current, { opacity: 1, y: 0, duration: 0.9 })
          .to(mark.current, { opacity: 0, y: -12, duration: 0.55, ease: "power2.in" }, "+=1.15")
          .to(loader.current, { yPercent: -100, duration: 0.86, ease: "power3.inOut" }, "-=0.08")
          .to(media.current, { scale: 1, duration: 1.35, ease: "power2.out" }, "<")
          .to(cue, { opacity: 1, duration: 0.6 }, "-=0.4");

        if (fabric) {
          gsap.set(fabric, { attr: { d: WHITE.rest } });
          if (shade) gsap.set(shade, { attr: { d: WHITE.rest }, opacity: 0 });
          const pull = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay: 0.4 });
          pull
            .to(fabric, { attr: { d: WHITE.tension }, duration: 0.7, ease: "power1.inOut" }, 0)
            .to(shade, { attr: { d: WHITE.tension }, opacity: 0.14, duration: 0.7, ease: "power1.inOut" }, 0)
            .to(fabric, { attr: { d: WHITE.pull }, duration: 0.55, ease: "power2.out" })
            .to(shade, { attr: { d: WHITE.pull }, opacity: 0.22, duration: 0.55, ease: "power2.out" }, "<")
            .to(fabric, { attr: { d: WHITE.rest }, duration: 0.7, ease: "power2.inOut" })
            .to(shade, { attr: { d: WHITE.rest }, opacity: 0, duration: 0.55, ease: "power2.out" }, "<0.08");
        }
      }, el);
    };

    const failsafe = window.setTimeout(showStatic, 7200);
    play();

    return () => {
      cancelled = true;
      ctx?.revert();
      window.clearTimeout(failsafe);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [heroReady]);

  return (
    <section ref={root} id="top" className="relative h-[100svh] w-full overflow-hidden bg-forest [overflow-anchor:none]">
      <div ref={media} className="absolute inset-0 will-change-transform">
        {heroRequested ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={landingPublicPath("/brand/downloads/hero-poster.webp")}
            alt=""
            decoding="async"
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
            onLoad={() => setHeroReady(true)}
            onError={() => setHeroReady(true)}
          />
        ) : null}
      </div>

      <div
        data-hero-cue
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 overflow-hidden opacity-0 sm:h-16"
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
        aria-hidden={loaderGone}
        className={cn(
          "hero-loader absolute inset-0 z-30 isolate overflow-hidden bg-forest",
          loaderGone && "pointer-events-none invisible",
        )}
      >
        <div className="hero-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={(node) => {
              mark.current = node;
              loaderImg.current = node;
            }}
            src={landingPublicPath("/brand/downloads/loader-52.webp")}
            alt=""
            width={2000}
            height={1756}
            decoding="async"
            className="relative z-0 hero-mark will-change-transform"
          />
        </div>
        <CelebrationBurst delay={240} />
      </div>
    </section>
  );
}
