import ImageWithProductMarkers from "@/components/projects/ImageWithProductMarkers";
import type { Project } from "@/data/projects";
import { cn, toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function ProjectStory({ project }: { project: Project }) {
  const sections = project.sections.filter((block) => block.image);
  if (!sections.length) return null;

  return (
    <section className="bg-forest py-24 text-paper md:py-32">
      <Container>
        <div className="flex flex-col gap-4 md:gap-6">
          <FadeUp as="p" className="eyebrow text-peach">
            روایت پروژه
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-light leading-[1.05] tracking-tightest"
          >
            از ایده تا اجرا
          </FadeUp>
        </div>

        <div className="mt-16 flex flex-col gap-16 md:gap-24">
          {sections.map((block, i) => {
            const reversed = i % 2 === 1;
            return (
              <FadeUp
                key={block.title}
                className={cn(
                  "grid grid-cols-1 items-center gap-8 md:gap-14",
                  block.image ? "lg:grid-cols-2" : "lg:grid-cols-1"
                )}
              >
                {block.image && (
                  <div className={cn("relative aspect-[4/3] w-full overflow-hidden bg-paper/5", reversed && "lg:order-2")}>
                    <ImageWithProductMarkers
                      src={block.image}
                      alt={block.title}
                      markers={block.markers}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className={cn(block.image ? "" : "max-w-3xl", reversed && "lg:order-1")}>
                  <p className="font-display text-lg text-peach">{toFa(`0${i + 1}`)}</p>
                  <h3 className="mt-3 text-2xl font-light tracking-tight text-paper md:text-3xl">{block.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-paper/70 md:text-lg">{block.body}</p>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
