import type { Project } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";

export default function ProjectStats({ project }: { project: Project }) {
  return (
    <section className="bg-paper py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <FadeUp as="p" className="eyebrow text-brick">
              نگاه نزدیک
            </FadeUp>
            <FadeUp
              as="h2"
              delay={0.05}
              className="mt-4 text-balance text-[clamp(1.75rem,3.5vw,2.75rem)] font-light leading-[1.1] tracking-tightest text-forest"
            >
              داستان پروژه
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-5 max-w-md text-base leading-relaxed text-forest/65 md:text-lg">
              {project.description}
            </FadeUp>
          </div>

          <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-forest/10 sm:grid-cols-3">
            {project.stats.map((stat) => (
              <div key={stat.label} className="bg-paper p-5 md:p-6">
                <p className="text-sm text-forest/65">{stat.label}</p>
                <p className="mt-2 text-lg font-light tracking-tight text-forest md:text-xl">{stat.value}</p>
              </div>
            ))}
          </Stagger>
        </div>

        <FadeUp delay={0.1} className="mt-12 border-t border-forest/10 pt-8">
          <p className="eyebrow text-forest/65">خدمات انجام‌شده</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {project.scope.map((item) => (
              <span
                key={item}
                className="rounded-full border border-forest/15 px-4 py-2 text-sm text-forest/70"
              >
                {item}
              </span>
            ))}
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
