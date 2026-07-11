import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, getRelatedProjects } from "@/data/projects";
import Container from "@/components/layout/Container";
import ProjectHero from "@/components/projects/ProjectHero";
import ProjectStats from "@/components/projects/ProjectStats";
import ProjectStory from "@/components/projects/ProjectStory";
import ProjectNarrative from "@/components/projects/ProjectNarrative";
import ProjectGallery from "@/components/projects/ProjectGallery";
import ProjectInteriorCta from "@/components/projects/ProjectInteriorCta";
import ProjectProducts from "@/components/projects/ProjectProducts";
import RelatedProjects from "@/components/projects/RelatedProjects";

export function generateStaticParams() { return projects.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProject(params.slug);
  if (!project) return { title: "پروژه یافت نشد | خانه چوب و هنر" };
  return { title: `${project.title} | خانه چوب و هنر`, description: project.summary, openGraph: { title: `${project.title} | خانه چوب و هنر`, description: project.summary, images: [project.image], type: "website", locale: "fa_IR" } };
}
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();
  const related = getRelatedProjects(project.slug, 3);
  return (
    <>
      <section className="bg-paper pt-32 pb-4 md:pt-40">
        <Container>
          <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
            <Link href="/" className="transition-colors hover:text-forest">خانه</Link>
            <span>/</span>
            <Link href="/projects" className="transition-colors hover:text-forest">پروژه‌ها</Link>
            <span>/</span>
            <span className="text-forest">{project.title}</span>
          </nav>
        </Container>
        <ProjectHero project={project} />
      </section>
      <ProjectStats project={project} />
      <ProjectProducts project={project} />
      <ProjectStory project={project} />
      <ProjectNarrative project={project} />
      <ProjectGallery project={project} />
      <ProjectInteriorCta />
      <RelatedProjects projects={related} />
    </>
  );
}
