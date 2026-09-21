import type { MetadataRoute } from "next";
import { collections, fetchApiCollections } from "@/data/collections";
import { commerceCategories } from "@/data/commerce";
import { getAllCatalogProducts } from "@/data/products";
import { projects } from "@/data/projects";
import { posts } from "@/data/posts";
import { fetchMaterialCatalog, fetchPublicMaterials } from "@/lib/public-materials";

const BASE = "https://choobohonar.com";

// Note: post/product `date` fields are stored as Persian-digit strings, so we
// intentionally omit `lastModified` rather than emit invalid dates.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/collection",
    "/materials",
    "/projects",
    "/interior-architecture-services",
    "/interior-architecture-services/order",
    "/gallery",
    "/magazine",
    "/stores",
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

  const productCategoryRoutes: MetadataRoute.Sitemap = commerceCategories.flatMap((category) => [
    {
      url: `${BASE}/products/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    ...category.children.map((child) => ({
      url: `${BASE}/products/category/${category.slug}/${child.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ]);

  const apiCollections = await fetchApiCollections();
  const collectionSlugs = [...new Set([...collections.map((collection) => collection.slug), ...apiCollections.map((collection) => collection.slug)])];
  const collectionRoutes: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url: `${BASE}/collection/${slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const publicMaterials = await fetchPublicMaterials();
  const catalogMaterials = await fetchMaterialCatalog();
  const materialRoutes: MetadataRoute.Sitemap = publicMaterials.map((m) => ({
    url: `${BASE}/materials/${m.id}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const materialItemRoutes: MetadataRoute.Sitemap = catalogMaterials.map((item) => ({
    url: `${BASE}/materials/${item.categoryId}/${item.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
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
    ...productCategoryRoutes,
    ...collectionRoutes,
    ...materialRoutes,
    ...materialItemRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
