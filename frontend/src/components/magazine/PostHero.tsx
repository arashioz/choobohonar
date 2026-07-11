import Image from "next/image";
import type { Post } from "@/data/posts";
import FadeUp from "@/components/motion/FadeUp";

export default function PostHero({ post }: { post: Post }) {
  return (
    <div>
      <FadeUp as="p" className="eyebrow text-brick">
        {post.category}
      </FadeUp>
      <FadeUp
        as="h1"
        delay={0.05}
        className="mt-4 max-w-4xl text-balance text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tightest text-forest"
      >
        {post.title}
      </FadeUp>
      <FadeUp delay={0.1} className="mt-6 flex flex-wrap items-center gap-3 text-sm text-forest/55">
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.date}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </FadeUp>

      <FadeUp delay={0.12} className="relative mt-10 aspect-[16/9] w-full overflow-hidden bg-forest/5 md:mt-14">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
        />
      </FadeUp>
    </div>
  );
}
