import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPost, getRelatedPosts } from "@/data/posts";
import Container from "@/components/layout/Container";
import PostHero from "@/components/magazine/PostHero";
import PostBody from "@/components/magazine/PostBody";
import RelatedPosts from "@/components/magazine/RelatedPosts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: "مقاله یافت نشد | خانه چوب و هنر" };
  return {
    title: `${post.title} | مجله خانه چوب و هنر`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | مجله خانه چوب و هنر`,
      description: post.excerpt,
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
          <PostBody post={post} />
        </Container>
      </section>

      <RelatedPosts posts={related} />
    </>
  );
}
