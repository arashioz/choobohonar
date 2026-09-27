import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import ProjectCard from "@/components/projects/ProjectCard";
import type { Project } from "@/data/projects";
import { featuredProjectsFrom } from "@/lib/public-projects";

export default function ExperienceProjects({ projects }: { projects: Project[] }) {
  const featured = featuredProjectsFrom(projects, 1);
  const lead = featured[0] ?? projects[0];
  const cards = projects.filter((project) => project.slug !== lead?.slug).slice(0, 3);
  if (!lead) return null;

  return (
    <section>
      <FeaturedProjectsIntro showAllLink />
      <FeaturedProjectsScroll projects={[lead]} />
      {cards.length ? (
        <div className="bg-paper py-20 md:py-28">
          <Container>
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((project, index) => (
                <FadeUp key={project.slug} delay={index * 0.07}>
                  <ProjectCard project={project} />
                </FadeUp>
              ))}
            </div>
          </Container>
        </div>
      ) : null}
    </section>
  );
}
