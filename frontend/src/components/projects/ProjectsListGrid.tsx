import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function ProjectsListGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section className="bg-paper py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-4 md:mb-16 md:gap-6">
          <FadeUp as="p" className="eyebrow text-brick">
            {"\u0633\u0627\u06cc\u0631 \u067e\u0631\u0648\u0698\u0647\u200c\u0647\u0627"}
          </FadeUp>
          <FadeUp
            as="h2"
            delay={0.05}
            className="max-w-2xl text-balance text-[clamp(2rem,5vw,3.5rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            {"\u0647\u0645\u0647 \u067e\u0631\u0648\u0698\u0647\u200c\u0647\u0627"}
          </FadeUp>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <Link href={`/projects/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-light tracking-tight text-forest">{p.title}</h3>
                  <span className="text-sm text-forest/65">{p.category}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-forest/60">{p.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                  {"\u0645\u0634\u0627\u0647\u062f\u0647 \u067e\u0631\u0648\u0698\u0647"}
                  <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">
                    {"\u2190"}
                  </span>
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
