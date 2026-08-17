import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts/types";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/magazine/${post.slug}`} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="media-hover object-cover"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-forest/65">
        <span className="text-brick">{post.category}</span>
        <span>·</span>
        <span>{post.readingTime}</span>
        {post.podcast && (
          <>
            <span>·</span>
            <span className="text-forest/45">نسخه صوتی</span>
          </>
        )}
      </div>
      <h3 className="mt-2 text-xl font-light leading-snug tracking-tight text-forest transition-colors group-hover:text-brick group-focus-visible:text-brick">
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
