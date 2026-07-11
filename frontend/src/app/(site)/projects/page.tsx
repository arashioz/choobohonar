import type { Metadata } from "next";
import { getFeaturedProjects, getStandardProjects } from "@/data/projects";
import FeaturedProjectsIntro from "@/components/projects/FeaturedProjectsIntro";
import FeaturedProjectsScroll from "@/components/projects/FeaturedProjectsScroll";
import ProjectsListGrid from "@/components/projects/ProjectsListGrid";

export const metadata: Metadata = {
  title: "پروژه‌ها | خانه چوب و هنر",
  description:
    "نمونه‌کارهای اجراشده خانه چوب و هنر؛ فضاهای مسکونی و هتلری که با مبلمان سفارشی و طراحی داخلی شکل گرفته‌اند.",
};

export default function ProjectsIndexPage() {
  const featured = getFeaturedProjects();
  const standard = getStandardProjects();

  return (
    <>
      <FeaturedProjectsIntro showAllLink={false} />
      <FeaturedProjectsScroll projects={featured} />
      <ProjectsListGrid projects={standard} />
    </>
  );
}
