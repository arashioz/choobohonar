import {
  getFeaturedProjects,
  getStandardProjects,
  projectFromCms,
  type Project,
} from "@/data/projects";
import { fetchPublicCmsEntries } from "@/lib/public-cms";

/** The single storefront source for project lists, with legacy data only as a fallback. */
export async function fetchPublicProjects(): Promise<Project[]> {
  const entries = await fetchPublicCmsEntries("project");
  return entries.length
    ? entries.map(projectFromCms)
    : [...getFeaturedProjects(), ...getStandardProjects()];
}

export function featuredProjectsFrom(projects: Project[], count?: number): Project[] {
  const featured = projects.filter((project) => project.featured);
  const result = featured.length ? featured : projects;
  return count === undefined ? result : result.slice(0, count);
}
