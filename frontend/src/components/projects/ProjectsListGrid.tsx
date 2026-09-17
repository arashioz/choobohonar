"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/data/projects";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsListGrid({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState("همه");
  const categories = useMemo(() => ["همه", ...Array.from(new Set(projects.map((project) => project.category).filter(Boolean)))], [projects]);
  const visibleProjects = activeCategory === "همه" ? projects : projects.filter((project) => project.category === activeCategory);
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
          {categories.length > 2 ? <div className="flex flex-wrap gap-2" aria-label="دسته‌بندی پروژه‌ها">{categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`rounded-full border px-4 py-2 text-xs transition-colors ${activeCategory === category ? "border-forest bg-forest text-paper" : "border-forest/15 text-forest/65 hover:border-forest/40"}`}>{category}</button>)}</div> : null}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <ProjectCard project={p} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
