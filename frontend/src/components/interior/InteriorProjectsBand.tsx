import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import type { Project } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export default function InteriorProjectsBand({ projects }: { projects: Project[] }) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">نمونه‌کارها</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              پروژه‌هایی که با طراحی داخلی شکل گرفته‌اند
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-forest/68 md:text-lg">
              از آپارتمان‌های مسکونی تا هتل‌ها و ویلاها — هر پروژه روایت واقعی از همکاری تیم معماری داخلی و کارگاه
              ساخت خانه چوب و هنر است.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 text-base text-forest transition-colors hover:text-brick md:text-lg"
            >
              مشاهده همه پروژه‌ها
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
