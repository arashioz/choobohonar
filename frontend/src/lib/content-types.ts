export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; caption?: string; alt?: string };

export type InternalLink = {
  label: string;
  url: string;
  anchor?: string;
  rel?: "dofollow" | "nofollow";
};

export type GalleryImage = {
  url: string;
  alt?: string;
  caption?: string;
};

export interface ContentJobResult {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  readingTime?: string;
  coverImage?: string;
  body?: string;
  content?: ContentBlock[];
  outline?: string[];
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  tags?: string[];
  internalLinks?: InternalLink[];
  gallery?: GalleryImage[];
  imagePrompt?: string;
  imageUrl?: string;
  marketingCopy?: string;
  canonicalUrl?: string;
}

export const ARTICLE_CATEGORIES = [
  "راهنمای انتخاب مبلمان",
  "نگهداری مبلمان",
  "معرفی متریال",
  "مقالات آموزشی",
  "سبک‌های طراحی داخلی",
  "مقالات تخصصی",
] as const;

export function emptyResult(): ContentJobResult {
  return {
    title: "",
    slug: "",
    excerpt: "",
    category: "",
    author: "تیم خانه چوب و هنر",
    readingTime: "",
    coverImage: "",
    body: "",
    content: [],
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    tags: [],
    internalLinks: [],
    gallery: [],
    marketingCopy: "",
    canonicalUrl: "",
  };
}

export function resultFromJob(result?: ContentJobResult | null): ContentJobResult {
  if (!result) return emptyResult();
  return {
    ...emptyResult(),
    ...result,
    content: result.content ? [...result.content] : [],
    keywords: result.keywords ? [...result.keywords] : [],
    tags: result.tags ? [...result.tags] : [],
    internalLinks: result.internalLinks ? result.internalLinks.map((l) => ({ ...l })) : [],
    gallery: result.gallery ? result.gallery.map((g) => ({ ...g })) : [],
    outline: result.outline ? [...result.outline] : [],
  };
}

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "")
    .slice(0, 80);
}

export function estimateReadingTime(blocks: ContentBlock[]): string {
  const text = blocks.map((b) => ("text" in b ? b.text : "")).join(" ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 180));
  return `${minutes} دقیقه`;
}

export function bodyToBlocks(body?: string): ContentBlock[] {
  if (!body) return [];
  return body.split(/\n\n+/).filter(Boolean).map((text) => ({ type: "paragraph" as const, text }));
}

export function blocksToBody(blocks: ContentBlock[]): string {
  return blocks
    .filter((b) => b.type === "paragraph" || b.type === "heading")
    .map((b) => b.text)
    .join("\n\n");
}
