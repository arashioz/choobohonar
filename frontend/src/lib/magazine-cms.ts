import { posts, FEATURED_MAGAZINE_SLUGS } from "@/data/posts";
import type { FaqItem, PodcastEpisode, Post, PostBlock } from "@/data/posts/types";
import { estimateReadingTime } from "@/data/posts/helpers";

export type MagazineSource = "static" | "cms" | "both";

const BLOCK_TYPES = new Set(["paragraph", "heading", "quote", "image", "link", "cta"]);

function compactText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isVideo(source: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(source);
}

export function parseMagazineSource(value: unknown): MagazineSource {
  return value === "static" || value === "cms" || value === "both" ? value : "both";
}

function asBlocks(value: unknown): PostBlock[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const blocks: PostBlock[] = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null;
    const block = raw as Record<string, unknown>;
    if (typeof block.type !== "string" || !BLOCK_TYPES.has(block.type)) return null;
    if (block.type === "image") {
      if (typeof block.src !== "string" || !block.src) return null;
      blocks.push({ type: "image", src: block.src, caption: typeof block.caption === "string" ? block.caption : undefined });
      continue;
    }
    if (block.type === "link" || block.type === "cta") {
      if (typeof block.href !== "string" || typeof block.label !== "string") return null;
      if (block.type === "cta" && typeof block.description !== "string") return null;
      blocks.push(block.type === "cta"
        ? { type: "cta", href: block.href, label: block.label, description: String(block.description) }
        : { type: "link", href: block.href, label: block.label, description: typeof block.description === "string" ? block.description : undefined });
      continue;
    }
    if (typeof block.text !== "string") return null;
    if (block.type === "quote") blocks.push({ type: "quote", text: block.text, cite: typeof block.cite === "string" ? block.cite : undefined });
    else if (block.type === "heading") blocks.push({ type: "heading", text: block.text });
    else blocks.push({ type: "paragraph", text: block.text });
  }
  return blocks;
}

function blocksPlainText(blocks: PostBlock[]) {
  return compactText(blocks.map((block) => ("text" in block ? block.text : "")).filter(Boolean).join(" "));
}

function textToBlocks(content: string): PostBlock[] {
  return content
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("## ")) return { type: "heading" as const, text: chunk.slice(3).trim() };
      if (chunk.startsWith("> ")) return { type: "quote" as const, text: chunk.slice(2).trim() };
      return { type: "paragraph" as const, text: chunk };
    });
}

function asStringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];
}

function asFaq(value: unknown): FaqItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (typeof row.question !== "string" || typeof row.answer !== "string") return [];
    return [{ question: row.question, answer: row.answer }];
  });
}

function asPodcast(value: unknown): PodcastEpisode | undefined {
  if (!value || typeof value !== "object") return undefined;
  const row = value as Record<string, unknown>;
  if (typeof row.title !== "string" || typeof row.description !== "string" || typeof row.duration !== "string") return undefined;
  return {
    title: row.title,
    description: row.description,
    duration: row.duration,
    audioUrl: typeof row.audioUrl === "string" ? row.audioUrl : undefined,
  };
}

function formatPublished(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return "تازه منتشر شده";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "تازه منتشر شده";
  return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(date);
}

/** Map one published CMS article onto the magazine post shape the site already renders. */
export function cmsArticleToPost(raw: unknown): Post | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  const title = typeof item.title === "string" ? item.title.trim() : "";
  if (!slug || !title) return null;

  const data = item.data && typeof item.data === "object" ? item.data as Record<string, unknown> : {};
  const storedBlocks = asBlocks(data.blocks);
  const plain = typeof item.content === "string" ? item.content : "";
  const rich = Boolean(storedBlocks && compactText(plain) === blocksPlainText(storedBlocks));
  const content = rich && storedBlocks ? storedBlocks : textToBlocks(plain);
  const images = Array.isArray(item.images)
    ? item.images.filter((image): image is string => typeof image === "string" && image.length > 0 && !isVideo(image))
    : [];
  const used = new Set(content.flatMap((block) => (block.type === "image" ? [block.src] : [])));
  const extras = images.slice(1).filter((src) => !used.has(src)).map((src) => ({ type: "image" as const, src }));
  const faq = rich ? asFaq(data.faq) : [];
  const podcast = rich ? asPodcast(data.podcast) : undefined;
  const body = [...content, ...extras];
  const displayDate = typeof data.displayDate === "string" ? data.displayDate.trim() : "";
  const seo = item.seo && typeof item.seo === "object" ? item.seo as Record<string, unknown> : {};

  return {
    slug,
    title,
    excerpt: typeof item.excerpt === "string" ? item.excerpt : "",
    category: typeof data.category === "string" && data.category.trim() ? data.category : "مقالات آموزشی",
    author: typeof data.author === "string" && data.author.trim() ? data.author : "تحریریه خانه چوب و هنر",
    date: displayDate || formatPublished(item.publishedAt),
    readingTime: typeof data.readingTime === "string" && data.readingTime.trim()
      ? data.readingTime
      : estimateReadingTime(body, faq, podcast),
    coverImage: images[0] || "",
    content: body,
    tags: asStringList(item.tags),
    outline: rich ? asStringList(data.outline) : undefined,
    faq: faq.length ? faq : undefined,
    podcast,
    metaDescription: typeof seo.description === "string" ? seo.description : undefined,
  };
}

/** Keep headings, links and FAQ while the saved text still matches the original article. Edited text replaces that structure. */
function keepStructuredBody(post: Post): Post {
  const original = posts.find((item) => item.slug === post.slug);
  if (!original) return post;
  const savedText = compactText(post.content.map((block) => ("text" in block ? block.text : "")).filter(Boolean).join(" "));
  if (savedText !== blocksPlainText(original.content)) return post;
  const used = new Set(original.content.flatMap((block) => (block.type === "image" ? [block.src] : [])));
  const extras = post.content.filter((block): block is Extract<PostBlock, { type: "image" }> => block.type === "image" && !used.has(block.src) && block.src !== post.coverImage);
  return {
    ...post,
    content: [...original.content, ...extras],
    outline: post.outline?.length ? post.outline : original.outline,
    faq: post.faq?.length ? post.faq : original.faq,
    podcast: post.podcast ?? original.podcast,
    coverImage: post.coverImage || original.coverImage,
  };
}

function featuredFirst(items: Post[]) {
  const bySlug = new Map(items.map((post) => [post.slug, post]));
  const pinned = FEATURED_MAGAZINE_SLUGS.map((slug) => bySlug.get(slug)).filter((post): post is Post => Boolean(post));
  const pinnedSlugs = new Set(pinned.map((post) => post.slug));
  return [...pinned, ...items.filter((post) => !pinnedSlugs.has(post.slug))];
}

/**
 * Published CMS articles are the storefront.
 * Static files fill gaps only for slugs that have never been saved in the CMS.
 */
export function assembleMagazinePosts(input: {
  source: MagazineSource;
  cmsItems: unknown;
  knownSlugs: string[] | null;
}): Post[] {
  const cmsPosts = Array.isArray(input.cmsItems)
    ? input.cmsItems.map(cmsArticleToPost).filter((post): post is Post => Boolean(post)).map(keepStructuredBody)
    : [];
  if (input.source === "static") return featuredFirst(posts);
  if (input.source === "cms") return cmsPosts;
  const known = new Set(input.knownSlugs ?? cmsPosts.map((post) => post.slug));
  const extras = posts.filter((post) => !known.has(post.slug));
  return [...cmsPosts, ...extras];
}
