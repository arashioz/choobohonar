"use client";

import { useMemo, useState } from "react";
import ImageWithProductMarkers from "@/components/projects/ImageWithProductMarkers";
import type { Project } from "@/data/projects";
import { resolveProjectImage } from "@/lib/project-images";
import { cn, toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import Button from "@/components/ui/Button";

const cellClasses = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-5",
  "md:col-span-7",
  "md:col-span-6",
  "md:col-span-6",
];

const aspectClasses = [
  "aspect-[16/10]",
  "aspect-[4/5]",
  "aspect-[4/5]",
  "aspect-[16/10]",
  "aspect-[3/2]",
  "aspect-[3/2]",
];

const PAGE_SIZE = 24;

export default function ProjectGallery({ project }: { project: Project }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const items = useMemo(
    () => project.gallery.map((item) => resolveProjectImage(item)),
    [project.gallery]
  );

  if (!items.length) return null;

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-4 md:gap-6">
          <FadeUp as="p" className="eyebrow text-brick">
            گالری تصاویر
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="max-w-2xl text-balance text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            نگاهی دیگر
          </FadeUp>
          <FadeUp as="p" delay={0.08} className="text-sm text-forest/55">
            {toFa(items.length)} تصویر از پروژه
          </FadeUp>
        </div>

        <Stagger
          selector="figure"
          className="mt-12 grid grid-cols-1 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-12"
        >
          {visible.map((image, i) => (
            <figure key={`${image.src}-${i}`} className={cn("group flex flex-col", cellClasses[i % cellClasses.length])}>
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-forest/5",
                  aspectClasses[i % aspectClasses.length]
                )}
              >
                <ImageWithProductMarkers
                  src={image.src}
                  alt={image.alt ?? `${project.title} - تصویر ${toFa(i + 1)}`}
                  markers={image.markers}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  imageClassName="transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
                />
              </div>
            </figure>
          ))}
        </Stagger>

        {hasMore ? (
          <div className="mt-12 flex justify-center">
            <Button
              as="button"
              type="button"
              variant="secondary"
              onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, items.length))}
            >
              نمایش {toFa(Math.min(PAGE_SIZE, items.length - visibleCount))} تصویر دیگر
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
