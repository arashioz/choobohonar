import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { materials, woodFinishes } from "@/data/materials";
import { getAllCatalogProducts } from "@/data/products";
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
    "/materials",
    "/projects",
    "/gallery",
    "/magazine",
    "/contact",
    "/contact/cooperation",
    "/contact/representation",
    "/contact/consultation",
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

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${BASE}/collection/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const materialRoutes: MetadataRoute.Sitemap = materials.map((m) => ({
    url: `${BASE}/materials/${m.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const finishRoutes: MetadataRoute.Sitemap = woodFinishes.map((f) => ({
    url: `${BASE}/materials/wood/${f.id}`,
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

  return [
    ...staticRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...materialRoutes,
    ...finishRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
