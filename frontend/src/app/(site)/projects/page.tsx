import type { Metadata } from "next";
import { getFeaturedProjects, getStandardProjects } from "@/data/projects";
import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import ProjectsListGrid from "@/components/projects/ProjectsListGrid";
import { fetchPublicCmsEntries } from "@/lib/public-cms";
import type { Project } from "@/data/projects";

export const metadata: Metadata = {
  title: "پروژه‌ها | خانه چوب و هنر",
  description:
    "نمونه‌کارهای اجراشده خانه چوب و هنر؛ فضاهای مسکونی و هتلری که با مبلمان سفارشی و طراحی داخلی شکل گرفته‌اند.",
};

export default async function ProjectsIndexPage() {
  const migrated = await fetchPublicCmsEntries("project");
  const all = migrated.length ? migrated as unknown as Project[] : [...getFeaturedProjects(), ...getStandardProjects()];
  const featured = all.filter((project) => project.featured);
  const standard = all.filter((project) => !project.featured);

  return (
    <>
      <FeaturedProjectsIntro showAllLink={false} />
      <FeaturedProjectsScroll projects={featured} />
      <ProjectsListGrid projects={standard} />
    </>
  );
}
