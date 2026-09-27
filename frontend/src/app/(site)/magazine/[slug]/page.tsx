import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRelatedPosts } from "@/data/posts/helpers";
import Container from "@/components/layout/Container";
import PostHero from "@/components/magazine/PostHero";
import PostBody from "@/components/magazine/PostBody";
import PostOutline from "@/components/magazine/PostOutline";
import PostPodcast from "@/components/magazine/PostPodcast";
import PostFAQ from "@/components/magazine/PostFAQ";
import RelatedPosts from "@/components/magazine/RelatedPosts";
import { loadMagazineCatalog } from "@/lib/magazine-catalog";
import { safelyDecodeSlug } from "@/lib/public-cms";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

async function findPost(slug: string) {
  const decoded = safelyDecodeSlug(slug);
  const { posts } = await loadMagazineCatalog();
  const post = posts.find((item) => item.slug === decoded || item.slug === slug);
  return { post, posts };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await findPost(slug);
  if (!post) return { title: "مقاله یافت نشد | خانه چوب و هنر" };
  const description = post.metaDescription ?? post.excerpt;
  return {
    title: `${post.title} | مجله خانه چوب و هنر`,
    description,
    openGraph: {
      title: `${post.title} | مجله خانه چوب و هنر`,
      description,
      images: post.coverImage ? [post.coverImage] : undefined,
      type: "article",
      locale: "fa_IR",
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, posts } = await findPost(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, posts, 3);

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
