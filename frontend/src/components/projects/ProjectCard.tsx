import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

type ProjectCardProps = {
  project: Project;
  tone?: "light" | "dark";
};

/**
 * The one canonical project card. Every project listing delegates its visual
 * identity and core fields to this component so a card change is site-wide.
 */
export default function ProjectCard({ project, tone = "light" }: ProjectCardProps) {
  const dark = tone === "dark";
  return (
    <Link href={`/projects/${project.slug}`} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="media-hover object-cover"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className={`line-clamp-2 text-xl font-light tracking-tight transition-colors group-hover:text-brick group-focus-visible:text-brick ${dark ? "text-paper" : "text-forest"}`}>
          {project.title}
        </h3>
        <span className={`shrink-0 text-sm ${dark ? "text-paper/50" : "text-forest/65"}`}>{project.category}</span>
      </div>
      <p className={`mt-1 line-clamp-3 text-sm leading-relaxed ${dark ? "text-paper/60" : "text-forest/60"}`}>{project.summary}</p>
      <span className={`mt-4 inline-flex items-center gap-2 text-sm transition-colors group-hover:text-forest ${dark ? "text-peach" : "text-brick"}`}>
        مشاهده پروژه <span className="arrow-drift">←</span>
      </span>
    </Link>
  );
}
