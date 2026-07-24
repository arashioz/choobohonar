export type PostBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; caption?: string };

export type FaqItem = {
  question: string;
  answer: string;
};

export type PodcastEpisode = {
  title: string;
  description: string;
  duration: string;
  audioUrl?: string;
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: MagazineCategory;
  author: string;
  date: string;
  readingTime: string;
  coverImage: string;
  content: PostBlock[];
  tags?: string[];
  outline?: string[];
  faq?: FaqItem[];
  podcast?: PodcastEpisode;
  metaDescription?: string;
};

export const MAGAZINE_CATEGORIES = [
  "راهنمای انتخاب مبلمان",
  "نگهداری مبلمان",
  "معرفی متریال",
  "مقالات آموزشی",
  "سبک‌های طراحی داخلی",
  "مقالات تخصصی",
] as const;

export type MagazineCategory = (typeof MAGAZINE_CATEGORIES)[number];
