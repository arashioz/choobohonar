import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import type { Project } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import { INTERIOR_PAGE_DEFAULTS, type InteriorPageContent } from "@/lib/interior-page-content";

export default function InteriorProjectsBand({
  projects,
  copy = INTERIOR_PAGE_DEFAULTS.projects,
}: {
  projects: Project[];
  copy?: InteriorPageContent["projects"];
}) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">{copy.eyebrow}</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest/68 md:text-lg">{copy.body}</p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Link
              href={copy.linkHref}
              className="group inline-flex items-center gap-3 text-base text-forest transition-colors hover:text-brick md:text-lg"
            >
              {copy.linkLabel}
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>
      </Container>

      <div
        data-lenis-prevent
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 md:px-10 lg:px-16"
      >
        {projects.map((project) => (
          <div key={project.slug} className="w-[min(22rem,78vw)] shrink-0 snap-start lg:w-[28rem]">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </section>
  );
}
