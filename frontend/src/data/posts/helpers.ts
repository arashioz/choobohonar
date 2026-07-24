import type { FaqItem, PodcastEpisode, Post, PostBlock } from "./types";
import { MAGAZINE_CATEGORIES } from "./types";

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function blocksToText(blocks: PostBlock[]): string {
  return blocks
    .map((b) => ("text" in b ? b.text : ""))
    .filter(Boolean)
    .join(" ");
}

export function estimateReadingTime(
  content: PostBlock[],
  faq?: FaqItem[],
  podcast?: PodcastEpisode,
): string {
  const faqText = faq?.map((f) => `${f.question} ${f.answer}`).join(" ") ?? "";
  const allText = [blocksToText(content), faqText, podcast?.description ?? ""].join(" ");
  const words = countWords(allText);
  const minutes = Math.max(5, Math.ceil(words / 180));
  return `${minutes} دقیقه`;
}

export function buildPost(
  post: Omit<Post, "readingTime"> & { readingTime?: string },
): Post {
  return {
    ...post,
    readingTime:
      post.readingTime ??
      estimateReadingTime(post.content, post.faq, post.podcast),
  };
}

export function getPostCategories(posts: Post[]): string[] {
  return ["همه", ...MAGAZINE_CATEGORIES.filter((cat) => posts.some((p) => p.category === cat))];
}

export function getPost(slug: string, posts: Post[]): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, posts: Post[], count = 3): Post[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, count);
  const sameCategory = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const others = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "راهنمای انتخاب مبلمان":
    "معیارهای انتخاب مبل، سرویس خواب و میزنا؛ از ابعاد فضا تا متریال و دوام.",
  "نگهداری مبلمان":
    "مراقبت از چوب، پارچه و پرداخت در طول سال؛ عادت‌های ساده برای ماندگاری بیشتر.",
  "معرفی متریال":
    "چوب، روکش، پارچه و فلز؛ شناخت متریال‌هایی که ساخت خانه چوب و هنر بر آن‌ها استوار است.",
  "مقالات آموزشی":
    "اصول نجاری، اندازه‌گیری فضا و مبانی طراحی؛ دانشی که انتخاب و چیدمان را دقیق‌تر می‌کند.",
  "سبک‌های طراحی داخلی":
    "مینیمال، روستیک و چیدمان فضاهای کوچک؛ الهام معمارانه برای خانه‌ای منسجم.",
  "مقالات تخصصی":
    "پشت صحنه ساخت، علم رطوبت و چوب، و نگاه عمیق‌تر به فرآیند و متریال.",
};
