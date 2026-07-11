"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { diversityImages } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Parallax from "@/components/motion/Parallax";
import { registerGsap, gsap, prefersReducedMotion, scrollTriggerConfig } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export default function DiversitySection() {
  return (
    <section className="relative overflow-hidden bg-paper py-28 md:py-40">
      <Container className="relative">
        <div className="relative z-10 max-w-3xl">
          <FadeUp as="p" className="eyebrow text-brick">
            تنوع پروژه‌های ما
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="mt-6 text-balance text-[clamp(2rem,5vw,4.25rem)] font-light leading-[1.05] tracking-tightest text-forest"
          >
            از نشیمن‌های گرم خانگی تا فضاهای اقامتی بزرگ — هر پروژه روایتی از{" "}
            <span className="text-brick">چوب، نور و دستِ هنرمند</span> است.
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="mt-8 max-w-xl text-lg leading-relaxed text-forest/70">
            نزدیک به پنجاه سال است که خانه‌ها را با مبلمانی می‌سازیم که برای زندگی واقعی طراحی شده‌اند؛ متین، ماندگار و انسانی.
          </FadeUp>
        </div>

        <div className="pointer-events-none relative mt-20 hidden h-[52rem] md:block">
          <ScatterImage
            src={diversityImages[0].image}
            caption={diversityImages[0].caption}
            className="absolute left-[1%] top-4 w-[34%]"
            aspect="aspect-[3/4.4]"
            speed={95}
            settle={1.06}
            sizes="34vw"
          />
          <ScatterImage
            src={diversityImages[1].image}
            caption={diversityImages[1].caption}
            className="absolute left-[41%] top-[24rem] w-[23%]"
            aspect="aspect-[4/3]"
            speed={35}
            settle={1.05}
            sizes="23vw"
          />
          <ScatterImage
            src={diversityImages[2].image}
            caption={diversityImages[2].caption}
            className="absolute right-[2%] top-32 w-[29%]"
            aspect="aspect-square"
            speed={130}
            settle={1.07}
            sizes="29vw"
          />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:hidden">
          <ScatterImage
            src={diversityImages[0].image}
            caption={diversityImages[0].caption}
            className="w-full"
            aspect="aspect-[3/4]"
            mobile
          />
          <ScatterImage
            src={diversityImages[1].image}
            caption={diversityImages[1].caption}
            className="w-full"
            aspect="aspect-[4/3]"
            mobile
          />
          <ScatterImage
            src={diversityImages[2].image}
            caption={diversityImages[2].caption}
            className="w-full"
            aspect="aspect-square"
            mobile
          />
        </div>
      </Container>
    </section>
  );
}

function ScatterImage({
  src,
  caption,
  className,
  aspect = "aspect-[3/4]",
  speed = 60,
  settle = 1.05,
  sizes = "(max-width: 768px) 100vw, 30vw",
  mobile = false,
}: {
  src: string;
  caption: string;
  className?: string;
  aspect?: string;
  speed?: number;
  settle?: number;
  sizes?: string;
  mobile?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    registerGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { scaleX: 1, scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0.94, scaleY: 0.86 },
        {
          scaleX: settle,
          scaleY: settle,
          duration: 0.9,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: scrollTriggerConfig({
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          }),
        }
      );
    });

    return () => ctx.revert();
  }, [settle]);

  const inner = (
    <figure className="pointer-events-auto group relative overflow-hidden">
      <div ref={frameRef} className={cn("relative w-full overflow-hidden will-change-transform", aspect)}>
        <Image
          src={src}
          alt={caption}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.02]"
        />
      </div>
      <figcaption className="mt-3 translate-y-1 text-sm text-forest/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-forest/70">
        {caption}
      </figcaption>
    </figure>
  );

  if (mobile) return <div className={className}>{inner}</div>;

  return (
    <Parallax speed={speed} className={className}>
      {inner}
    </Parallax>
  );
}
