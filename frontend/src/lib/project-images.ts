import type { AnnotatedImage, Project, ProjectImage } from "@/data/projects";

export function resolveProjectImage(image: ProjectImage): AnnotatedImage {
  return typeof image === "string" ? { src: image } : image;
}

export function getProjectProductSlugs(project: Project): string[] {
  if (Array.isArray(project.productSlugs)) {
    return [...new Set(project.productSlugs.map(String).map((s) => s.trim()).filter(Boolean))];
  }
  return [];
}
