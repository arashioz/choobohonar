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

export const postCategories = getPostCategories(posts);

export function getPost(slug: string) {
  return findPost(slug, posts);
}

export function getRelatedPosts(slug: string, count = 3) {
  return findRelatedPosts(slug, posts, count);
}
