import type { Project } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import ProjectNarrativeProducts from "@/components/projects/ProjectNarrativeProducts";

export default function ProjectNarrative({ project }: { project: Project }) {
  if (!project.narrative?.paragraphs.length) return null;

  const { eyebrow, title, paragraphs, products } = project.narrative;

  return (
    <section className="border-y border-forest/10 bg-paper py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl">
          <FadeUp as="p" className="eyebrow text-brick">
            {eyebrow ?? "\u062c\u0632\u0626\u06cc\u0627\u062a \u0628\u06cc\u0634\u062a\u0631"}
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="mt-4 text-balance text-[clamp(1.75rem,4vw,3rem)] font-light leading-[1.05] tracking-tightest text-forest"
          >
            {title}
          </FadeUp>

          <div className="mt-10 flex flex-col gap-6 md:mt-12 md:gap-8">
            {paragraphs.map((paragraph, i) => (
              <FadeUp
                key={i}
                delay={0.08 + i * 0.04}
                as="p"
                className="text-base leading-[1.85] text-forest/70 md:text-lg md:leading-[1.9]"
              >
                {paragraph}
              </FadeUp>
            ))}
          </div>

          {products && products.length > 0 && <ProjectNarrativeProducts products={products} />}
        </div>
      </Container>
    </section>
  );
}
