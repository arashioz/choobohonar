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

export function featuredProjectsFrom(projects: Project[], count = 2): Project[] {
  const featured = projects.filter((project) => project.featured);
  const ranked = featured.length
    ? [...featured].sort((a, b) => {
        const aTime = Date.parse(a.featuredAt || "") || 0;
        const bTime = Date.parse(b.featuredAt || "") || 0;
        return bTime - aTime;
      })
    : projects;
  return ranked.slice(0, count);
}
