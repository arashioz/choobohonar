import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, getRelatedPosts } from "@/data/posts";
import Container from "@/components/layout/Container";
import PostHero from "@/components/magazine/PostHero";
import PostBody from "@/components/magazine/PostBody";
import PostOutline from "@/components/magazine/PostOutline";
import PostPodcast from "@/components/magazine/PostPodcast";
import PostFAQ from "@/components/magazine/PostFAQ";
import RelatedPosts from "@/components/magazine/RelatedPosts";
import { getApiBase } from "@/lib/api-base";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    const article = await getCmsArticle(slug);
    if (!article) return { title: "مقاله یافت نشد | خانه چوب و هنر" };
    return { title: `${article.title} | مجله خانه چوب و هنر`, description: article.seo?.description || article.excerpt };
  }
  return {
    title: `${post.title} | مجله خانه چوب و هنر`,
    description: post.metaDescription ?? post.excerpt,
    openGraph: {
      title: `${post.title} | مجله خانه چوب و هنر`,
      description: post.metaDescription ?? post.excerpt,
      images: [post.coverImage],
      type: "article",
      locale: "fa_IR",
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    const article = await getCmsArticle(slug);
    if (!article) notFound();
    return <CmsArticlePage article={article} />;
  }

  const related = getRelatedPosts(post.slug, 3);

  return (
    <>
      <section className="bg-paper pt-32 pb-20 md:pt-40 md:pb-24">
        <Container>
          <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
            <Link href="/" className="transition-colors hover:text-forest">
              خانه
            </Link>
            <span>/</span>
            <Link href="/magazine" className="transition-colors hover:text-forest">
              مجله
            </Link>
            <span>/</span>
            <span className="text-forest">{post.title}</span>
          </nav>

          <PostHero post={post} />
          {post.outline && post.outline.length > 0 && <PostOutline items={post.outline} />}
          <PostBody post={post} />
          {post.podcast && <PostPodcast episode={post.podcast} />}
          {post.faq && post.faq.length > 0 && <PostFAQ items={post.faq} />}
        </Container>
      </section>

      <RelatedPosts posts={related} />
    </>
  );
}

type CmsArticle = { title: string; excerpt?: string; content?: string; images?: string[]; tags?: string[]; seo?: { description?: string }; data?: { author?: string; category?: string; readingTime?: string }; publishedAt?: string };

async function getCmsArticle(slug: string): Promise<CmsArticle | null> {
  try {
    const response = await fetch(`${getApiBase()}/public-cms/article/${encodeURIComponent(slug)}`, { cache: "no-store" });
    return response.ok ? response.json() : null;
  } catch { return null; }
}

function CmsArticlePage({ article }: { article: CmsArticle }) {
  const image = article.images?.[0];
  const date = article.publishedAt ? new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt)) : "";
  return <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32"><Container>
    <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55"><Link href="/">خانه</Link><span>/</span><Link href="/magazine">مجله</Link><span>/</span><span className="truncate text-forest">{article.title}</span></nav>
    <p className="eyebrow text-brick">{article.data?.category || "مقالات آموزشی"}</p><h1 className="mt-4 max-w-4xl text-balance text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tightest text-forest">{article.title}</h1>
    <p className="mt-6 text-sm text-forest/55">{article.data?.author || "تحریریه چوب و هنر"}{date ? ` · ${date}` : ""}{article.data?.readingTime ? ` · ${article.data.readingTime}` : ""}</p>
    {image && <div className="relative mt-10 aspect-[16/9] overflow-hidden bg-forest/5 md:mt-14"><img src={image} alt={article.title} className="h-full w-full object-cover" /></div>}
    {article.excerpt && <p className="mx-auto mt-12 max-w-3xl text-xl leading-relaxed text-forest/65">{article.excerpt}</p>}
    <article className="mx-auto mt-10 max-w-3xl whitespace-pre-wrap text-lg leading-[2] text-forest/75">{article.content}</article>
    {article.tags?.length ? <div className="mx-auto mt-12 flex max-w-3xl flex-wrap gap-2 border-t border-forest/10 pt-7">{article.tags.map((tag) => <span key={tag} className="rounded-full border border-forest/15 px-4 py-1.5 text-sm text-forest/55">{tag}</span>)}</div> : null}
  </Container></section>;
}
