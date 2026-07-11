"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { getProjectFeaturedImages } from "@/data/projects";
import { gsap, registerGsap, prefersReducedMotion, refreshScrollTriggers, scrollTriggerConfig } from "@/lib/gsap";

const SCROLL = {
  image1: 100,
  image2: 135,
  info: 52,
  /** Extra scroll fraction held on the info panel before the next project. */
  hold: 0.14,
} as const;

function ProjectInfoPanel({ project }: { project: Project }) {
  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-[14svh] z-10 h-[14svh] bg-gradient-to-b from-transparent via-forest/55 to-forest"
      />
      <div className="relative flex min-h-[38svh] w-full flex-col justify-between bg-gradient-to-t from-forest-900 via-forest to-forest/95 px-6 py-8 md:flex-row md:items-end md:px-10 md:py-10 lg:px-16">
      <div className="max-w-2xl">
        <h2 className="text-balance text-[clamp(2rem,5vw,3.75rem)] font-light leading-[0.95] tracking-tight text-paper">
          {project.title}
        </h2>
        <p className="mt-4 max-w-lg text-pretty text-sm leading-relaxed text-paper/65 md:text-base">
          {project.summary}
        </p>
        <Link
          href={`/projects/${project.slug}`}
          className="mt-6 inline-flex rounded-full border border-paper/40 px-6 py-2.5 text-xs font-medium tracking-[0.22em] text-paper transition-colors hover:bg-paper hover:text-forest"
        >
          {"\u0645\u0634\u0627\u0647\u062f\u0647 \u067e\u0631\u0648\u0698\u0647"}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-1 text-end md:mt-0 md:gap-2">
        <p className="text-[0.65rem] font-medium tracking-[0.28em] text-peach/80">{project.category}</p>
        <p className="text-[0.65rem] tracking-[0.22em] text-paper/45">{project.location}</p>
        <p className="text-[0.65rem] tracking-[0.22em] text-paper/45">{project.year}</p>
      </div>
      </div>
    </div>
  );
}

function FeaturedProjectBlock({ project, index }: { project: Project; index: number }) {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollImages = getProjectFeaturedImages(project);
  const scrollImagesKey = scrollImages.join("|");
  const backgroundImage = project.image || scrollImages[0];

  const bumpLayout = useCallback(() => {
    refreshScrollTriggers();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!root || !viewport || !track || scrollImages.length === 0) return;

    registerGsap();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const travel = () => Math.max(0, track.scrollHeight - window.innerHeight);

      const tl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig({
          trigger: root,
          start: "top top",
          end: () => "+=" + travel() * (1 + SCROLL.hold),
          scrub: 1.1,
          pin: viewport,
          anticipatePin: 1,
        }),
      });

      tl.to(track, { y: () => -travel(), ease: "none", duration: 1 });
      tl.to({}, { duration: SCROLL.hold });
    }, root);

    const t = window.setTimeout(refreshScrollTriggers, 100);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, [project.slug, scrollImagesKey, scrollImages.length]);

  if (!scrollImages.length || !backgroundImage) return null;

  return (
    <article ref={rootRef} aria-label={project.title} className="relative">
      <div ref={viewportRef} className="relative h-[100svh] w-full overflow-hidden bg-forest">
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="relative h-full w-full">
            <Image
              src={backgroundImage}
              alt={project.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              onLoad={bumpLayout}
            />
          </div>
          <div className="absolute inset-0 bg-forest/25" />
          <div className="absolute inset-x-0 bottom-0 h-[62vh] bg-gradient-to-t from-forest via-forest/80 to-transparent" />
        </div>

        <div ref={trackRef} className="relative z-10 w-full">
          {scrollImages.map((src, i) => (
            <div
              key={`${project.slug}-scroll-${i}`}
              className="relative w-full overflow-hidden"
              style={{ height: `${i === 0 ? SCROLL.image1 : SCROLL.image2}svh` }}
            >
              <div className="absolute bottom-0 left-1/2 h-[62svh] w-[78vw] max-w-5xl -translate-x-1/2">
                <div className="relative h-full w-full overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                  <Image
                    src={src}
                    alt={`${project.title} ${i + 1}`}
                    fill
                    priority={index === 0 && i === 0}
                    sizes="(max-width: 768px) 78vw, 64rem"
                    className="object-cover"
                    onLoad={bumpLayout}
                  />
                </div>
              </div>
            </div>
          ))}

          <div style={{ height: `${SCROLL.info}svh` }} className="flex items-end">
            <ProjectInfoPanel project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjectsScroll({ projects }: { projects: Project[] }) {
  const featured = projects.slice(0, 3);

  useEffect(() => {
    if (!featured.length) return;
    registerGsap();
    const t1 = window.setTimeout(refreshScrollTriggers, 200);
    const t2 = window.setTimeout(refreshScrollTriggers, 800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [featured.length]);

  if (!featured.length) return null;

  return (
    <div className="relative">
      {featured.map((project, index) => (
        <FeaturedProjectBlock key={project.slug} project={project} index={index} />
      ))}
    </div>
  );
}
