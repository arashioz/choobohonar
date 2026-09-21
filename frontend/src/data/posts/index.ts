import { editorialPosts } from "./articles/editorial-series";
import { getPostCategories, getPost as findPost, getRelatedPosts as findRelatedPosts } from "./helpers";

export type {
  Post,
  PostBlock,
  FaqItem,
  PodcastEpisode,
  MagazineCategory,
} from "./types";
export { MAGAZINE_CATEGORIES } from "./types";
export { CATEGORY_DESCRIPTIONS } from "./helpers";

export const posts = editorialPosts;

/** Landing mix: 2 design styles, 2 home products, 1 decor. */
export const FEATURED_MAGAZINE_SLUGS = [
  "rug-buying-guide",
  "rug-care-guide",
  "coordinating-sofa-dining-and-materials",
  "small-living-room-sofa-layout",
  "sofa-selection-living-room-guide",
  "bedroom-set-selection-guide",
  "rug-selection-for-living-room-guide",
] as const;

export const postCategories = getPostCategories(posts);

export function getPost(slug: string) {
  return findPost(slug, posts);
}

export function getRelatedPosts(slug: string, count = 3) {
  return findRelatedPosts(slug, posts, count);
}
