import { cache } from "react";
import { posts, FEATURED_MAGAZINE_SLUGS } from "@/data/posts";
import type { Post } from "@/data/posts/types";
import { getApiBase } from "@/lib/api-base";
import { assembleMagazinePosts, parseMagazineSource, type MagazineSource } from "@/lib/magazine-cms";

function featuredFirst(items: Post[]) {
  const bySlug = new Map(items.map((post) => [post.slug, post]));
  const pinned = FEATURED_MAGAZINE_SLUGS.map((slug) => bySlug.get(slug)).filter((post): post is Post => Boolean(post));
  const pinnedSlugs = new Set(pinned.map((post) => post.slug));
  return [...pinned, ...items.filter((post) => !pinnedSlugs.has(post.slug))];
}

/** Published magazine, shared by the article page, homepage, and sitemap. */
export const loadMagazineCatalog = cache(async function loadMagazineCatalog(): Promise<{ source: MagazineSource; posts: Post[] }> {
  const api = getApiBase();
  const [settingsResult, articlesResult, slugsResult] = await Promise.all([
    fetch(`${api}/settings/public`, { cache: "no-store" }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
    fetch(`${api}/public-cms/article`, { cache: "no-store" }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
    fetch(`${api}/public-cms/article?view=slugs`, { cache: "no-store" }).then((response) => (response.ok ? response.json() : null)).catch(() => null),
  ]);
  const source = parseMagazineSource(
    settingsResult && typeof settingsResult === "object" ? (settingsResult as { magazineSource?: unknown }).magazineSource : undefined,
  );
  const knownSlugs = slugsResult && typeof slugsResult === "object" && Array.isArray((slugsResult as { slugs?: unknown }).slugs)
    ? (slugsResult as { slugs: unknown[] }).slugs.map(String)
    : null;
  if (!Array.isArray(articlesResult)) {
    return { source, posts: source === "cms" ? [] : featuredFirst(posts) };
  }
  return { source, posts: assembleMagazinePosts({ source, cmsItems: articlesResult, knownSlugs }) };
});
