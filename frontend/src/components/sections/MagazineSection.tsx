import Link from "next/link";
import { posts } from "@/data/posts";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import PostCard from "@/components/magazine/PostCard";
import type { Post } from "@/data/posts";
import { getApiBase } from "@/lib/api-base";

type MagazineSource = "static" | "cms" | "both";

type CmsArticleRecord = {
  slug?: unknown;
  title?: unknown;
  excerpt?: unknown;
  publishedAt?: string | null;
  images?: unknown[];
  tags?: unknown;
  data?: Record<string, unknown>;
  seo?: { description?: unknown };
};

async function getLatestPosts(): Promise<Post[]> {
  let source: MagazineSource = "both";
  try {
    const [settingsResponse, cmsResponse] = await Promise.all([
      fetch(`${getApiBase()}/settings/public`, { cache: "no-store" }),
      fetch(`${getApiBase()}/public-cms/article`, { cache: "no-store" }),
    ]);
    const settings = settingsResponse.ok ? await settingsResponse.json() : null;
    if (settings?.magazineSource === "static" || settings?.magazineSource === "cms" || settings?.magazineSource === "both") source = settings.magazineSource;
    const items = cmsResponse.ok ? await cmsResponse.json() : [];
    const cmsPosts: Post[] = Array.isArray(items) ? items.map((rawItem) => {
      const item = rawItem as CmsArticleRecord;
      return {
        slug: String(item.slug), title: String(item.title), excerpt: String(item.excerpt || ""),
        category: String(item.data?.category || "مقالات آموزشی") as Post["category"], author: String(item.data?.author || "تحریریه چوب و هنر"),
        date: item.publishedAt ? new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(item.publishedAt)) : "تازه منتشر شده",
        readingTime: String(item.data?.readingTime || "چند دقیقه"), coverImage: String(item.images?.[0] || posts[0]?.coverImage || ""), content: [],
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [], metaDescription: typeof item.seo?.description === "string" ? item.seo.description : undefined,
      };
    }) : [];
    const staticPosts = source === "cms" ? [] : posts;
    if (source === "static") return staticPosts.slice(0, 3);
    if (source === "cms") return cmsPosts.slice(0, 3);
    const cmsSlugs = new Set(cmsPosts.map((post) => post.slug));
    return [...cmsPosts, ...posts.filter((post) => !cmsSlugs.has(post.slug))].slice(0, 3);
  } catch {
    return source === "cms" ? [] : posts.slice(0, 3);
  }
}

export default async function MagazineSection() {
  const latest = await getLatestPosts();

  return (
    <section id="magazine" className="bg-paper py-28 md:py-40">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h2"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            مجله
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/magazine"
              className="group inline-flex items-center gap-3 text-lg text-forest transition-colors hover:text-brick"
            >
              مشاهده مجله
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {latest.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <PostCard post={p} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
