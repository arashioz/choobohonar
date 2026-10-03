import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import type { HomePageContent } from "@/lib/home-page-content";
import { featuredProjectsFrom, fetchPublicProjects } from "@/lib/public-projects";

export default async function FeaturedProjectsSection({ copy }: { copy?: HomePageContent["projects"] } = {}) {
  const featured = featuredProjectsFrom(await fetchPublicProjects(), 2);

  return (
    <section id="projects">
      <FeaturedProjectsIntro copy={copy} />
      <FeaturedProjectsScroll projects={featured} linkLabel={copy?.cardLinkLabel} />
    </section>
  );
}
