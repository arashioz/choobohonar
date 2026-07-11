import ImageWithProductMarkers from "@/components/projects/ImageWithProductMarkers";
import type { Project } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Parallax from "@/components/motion/Parallax";

export default function ProjectHero({ project }: { project: Project }) {
  return (
    <div>
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <FadeUp as="p" className="eyebrow text-brick">
              {project.category}
            </FadeUp>
            <FadeUp
              as="h1"
              delay={0.05}
              className="mt-4 text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
            >
              {project.title}
            </FadeUp>
          </div>
          <FadeUp as="p" delay={0.12} className="max-w-md text-lg leading-relaxed text-forest/60">
            {project.summary}
          </FadeUp>
        </div>

        <FadeUp
          delay={0.15}
          className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-forest/10 pt-6 text-sm text-forest/55"
        >
          <span className="text-forest">{project.location}</span>
          <span className="h-1 w-1 rounded-full bg-forest/25" />
          <span>{project.area}</span>
          <span className="h-1 w-1 rounded-full bg-forest/25" />
          <span>سال {project.year}</span>
        </FadeUp>
      </Container>

      <div className="mt-12 md:mt-16">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-forest/5 md:aspect-[16/8]">
          <Parallax speed={60} className="absolute inset-0">
            <ImageWithProductMarkers
              src={project.image}
              alt={project.title}
              markers={project.heroMarkers}
              fill
              priority
              sizes="100vw"
              imageClassName="scale-110"
            />
          </Parallax>
        </div>
      </div>
    </div>
  );
}
