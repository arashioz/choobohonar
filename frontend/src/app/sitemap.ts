import type { MetadataRoute } from "next";
import { getAllCatalogProducts, finishes } from "@/data/products";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";

const BASE = "https://choobohonar.com";

// Note: post/product `date` fields are stored as Persian-digit strings, so we
// intentionally omit `lastModified` rather than emit invalid dates.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/collection",
    "/projects",
    "/gallery",
    "/magazine",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllCatalogProducts().map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const finishRoutes: MetadataRoute.Sitemap = finishes.map((f) => ({
    url: `${BASE}/collection/${f.id}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((pr) => ({
    url: `${BASE}/projects/${pr.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((po) => ({
    url: `${BASE}/magazine/${po.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...finishRoutes, ...projectRoutes, ...postRoutes];
}
