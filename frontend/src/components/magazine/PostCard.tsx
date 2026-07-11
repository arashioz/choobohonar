import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/magazine/${post.slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-4 flex items-center gap-3 text-sm text-forest/65">
        <span className="text-brick">{post.category}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="mt-2 text-xl font-light leading-snug tracking-tight text-forest transition-colors group-hover:text-brick">
        {post.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-forest/60">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-3 text-xs text-forest/65">
        <span>{post.author}</span>
        <span>·</span>
        <span>{post.date}</span>
      </div>
    </Link>
  );
}
