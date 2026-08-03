import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/data/posts/types";
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
            case "link":
              return (
                <FadeUp key={i} as="aside" className="border-r-2 border-brick/70 bg-forest/[0.03] px-6 py-5">
                  <Link href={block.href} className="group inline-flex flex-col gap-1 text-forest transition-colors hover:text-brick">
                    <span className="text-base font-medium">{block.label}</span>
                    {block.description && <span className="text-sm leading-relaxed text-forest/65">{block.description}</span>}
                    <span className="mt-1 text-sm text-brick">مشاهده بیشتر ←</span>
                  </Link>
                </FadeUp>
              );
            case "cta":
              return (
                <FadeUp key={i} as="aside" className="rounded-sm bg-forest px-7 py-8 text-paper md:px-10">
                  <p className="text-lg font-light leading-relaxed">{block.description}</p>
                  <Link href={block.href} className="mt-5 inline-flex border-b border-paper/50 pb-1 text-base transition-colors hover:border-paper hover:text-paper/80">
                    {block.label} ←
                  </Link>
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
