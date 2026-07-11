import Image from "next/image";
import type { Post } from "@/data/posts";
import FadeUp from "@/components/motion/FadeUp";

export default function PostBody({ post }: { post: Post }) {
  return (
    <div className="mx-auto mt-14 max-w-3xl md:mt-20">
      <div className="flex flex-col gap-8">
        {post.content.map((block, i) => {
          switch (block.type) {
            case "heading":
              return (
                <FadeUp
                  key={i}
                  as="h2"
                  className="mt-4 text-2xl font-light tracking-tight text-forest md:text-3xl"
                >
                  {block.text}
                </FadeUp>
              );
            case "quote":
              return (
                <FadeUp key={i} as="blockquote" className="border-r-2 border-brick pr-6">
                  <p className="text-xl font-light leading-relaxed text-forest md:text-2xl">
                    «{block.text}»
                  </p>
                  {block.cite && (
                    <cite className="mt-3 block text-sm not-italic text-forest/65">
                      — {block.cite}
                    </cite>
                  )}
                </FadeUp>
              );
            case "image":
              return (
                <FadeUp key={i} as="figure" className="my-2">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-forest/5">
                    <Image
                      src={block.src}
                      alt={block.caption ?? post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="mt-3 text-sm text-forest/65">{block.caption}</figcaption>
                  )}
                </FadeUp>
              );
            default:
              return (
                <FadeUp key={i} as="p" className="text-lg leading-relaxed text-forest/75">
                  {block.text}
                </FadeUp>
              );
          }
        })}
      </div>

      {post.tags && post.tags.length > 0 && (
        <FadeUp className="mt-14 flex flex-wrap gap-3 border-t border-forest/10 pt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-forest/15 px-4 py-1.5 text-sm text-forest/55"
            >
              {tag}
            </span>
          ))}
        </FadeUp>
      )}
    </div>
  );
}
