import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import { featuredProjectsFrom, fetchPublicProjects } from "@/lib/public-projects";

export default async function FeaturedProjectsSection() {
  const featured = featuredProjectsFrom(await fetchPublicProjects(), 2);

  return (
    <section id="projects">
      <FeaturedProjectsIntro />
      <FeaturedProjectsScroll projects={featured} />
    </section>
  );
}
