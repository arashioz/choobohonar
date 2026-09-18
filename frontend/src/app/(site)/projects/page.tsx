import type { Metadata } from "next";
import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import ProjectsListGrid from "@/components/projects/ProjectsListGrid";
import { featuredProjectsFrom, fetchPublicProjects } from "@/lib/public-projects";

// The project index is database-backed, so newly published entries must be
// visible as soon as they are published from the admin panel.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "پروژه‌ها | خانه چوب و هنر",
  description:
    "نمونه‌کارهای اجراشده خانه چوب و هنر؛ فضاهای مسکونی و هتلری که با مبلمان سفارشی و طراحی داخلی شکل گرفته‌اند.",
};

export default async function ProjectsIndexPage() {
  const all = await fetchPublicProjects();
  const featured = featuredProjectsFrom(all, 2);
  const featuredSlugs = new Set(featured.map((project) => project.slug));
  const standard = all.filter((project) => !featuredSlugs.has(project.slug));

  return (
    <>
      <FeaturedProjectsIntro showAllLink={false} />
      <FeaturedProjectsScroll projects={featured} />
      <ProjectsListGrid projects={standard} />
    </>
  );
}
