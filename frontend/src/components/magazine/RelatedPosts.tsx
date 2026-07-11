import Link from "next/link";
import type { Post } from "@/data/posts";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import PostCard from "@/components/magazine/PostCard";

export default function RelatedPosts({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;

  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h2"
            className="text-balance text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            مقالات مرتبط
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/magazine"
              className="group inline-flex items-center gap-3 text-lg text-forest transition-colors hover:text-brick"
            >
              همه مقالات
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-3">
          {posts.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.08}>
              <PostCard post={p} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
