import type { AnnotatedImage, Project, ProjectImage } from "@/data/projects";

export function resolveProjectImage(image: ProjectImage): AnnotatedImage {
  return typeof image === "string" ? { src: image } : image;
}

export function getProjectProductSlugs(project: Project): string[] {
  const slugs = new Set<string>();

  project.heroMarkers?.forEach((m) => slugs.add(m.productSlug));
  project.gallery.forEach((img) => resolveProjectImage(img).markers?.forEach((m) => slugs.add(m.productSlug)));
  project.sections.forEach((section) => section.markers?.forEach((m) => slugs.add(m.productSlug)));
  project.narrative?.products?.forEach((p) => slugs.add(p.productSlug));

  return Array.from(slugs);
}
