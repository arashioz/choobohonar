"use client";

import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import { getFeaturedProjects } from "@/data/projects";

export default function FeaturedProjectsSection() {
  const featured = getFeaturedProjects();

  return (
    <section id="projects">
      <FeaturedProjectsIntro />
      <FeaturedProjectsScroll projects={featured} />
    </section>
  );
}
