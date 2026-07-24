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

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "مقاله یافت نشد | خانه چوب و هنر" };
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

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();

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
