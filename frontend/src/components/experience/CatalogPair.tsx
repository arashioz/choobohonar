import type { ReactNode } from "react";
import Link from "next/link";
import LeafMotion from "@/components/experience/LeafMotion";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export type CatalogLeaf = {
  title: string;
  edition: string;
  image: string;
  alt: string;
  file?: string;
  href?: string;
  frame?: string;
};

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M12 4v11" />
      <path d="m7 11 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function ViewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <path d="M19 12H7" />
      <path d="m11 8-4 4 4 4" />
    </svg>
  );
}

export default function CatalogPair({
  catalogs,
  kicker,
  title,
  tone = "forest",
  aside,
}: {
  catalogs: CatalogLeaf[];
  kicker: string;
  title: string;
  tone?: "forest" | "paper";
  aside?: ReactNode;
}) {
  const dark = tone === "forest";

  return (
    <section className={dark ? "bg-forest py-14 text-paper md:py-28" : "bg-paper py-14 text-forest md:py-28"}>
      <Container>
        <p className={dark ? "eyebrow text-peach" : "eyebrow text-brick"}>{kicker}</p>
        <h2 className="mt-4 max-w-xl text-balance text-[clamp(1.85rem,7vw,4rem)] font-extralight leading-[1.15] tracking-tightest md:mt-5">
          {title}
        </h2>
        <div className="mt-8 grid items-stretch gap-x-4 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:mt-14 md:gap-y-12 lg:grid-cols-3 lg:gap-8">
          {catalogs.map((catalog, index) => {
            const href = catalog.file ?? catalog.href;
            if (!href) return null;
            const downloadable = Boolean(catalog.file);
            const cardClass =
              "group relative block touch-manipulation overflow-hidden bg-paper/5 active:opacity-90";

            const card = (
              <>
                  <img
                    src={catalog.image}
                    alt={catalog.alt}
                    className={cn(
                      "aspect-[3/4] w-full object-cover [@media(hover:hover)_and_(pointer:fine)]:transition-transform [@media(hover:hover)_and_(pointer:fine)]:duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]",
                      catalog.frame ?? "object-top",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper sm:p-5">
                    <p className="text-xl font-light leading-tight sm:text-2xl">{catalog.title}</p>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-paper lg:backdrop-blur-md transition-colors [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-white/25">
                      {downloadable ? <DownloadIcon /> : <ViewIcon />}
                      <span className="sr-only">{downloadable ? `دانلود ${catalog.title}` : `مشاهده ${catalog.title}`}</span>
                    </span>
                  </div>
                </>
            );

            return (
              <LeafMotion key={catalog.edition} delay={index * 0.14}>
                {downloadable ? (
                  <a href={href} download className={cardClass}>
                    {card}
                  </a>
                ) : (
                  <Link href={href} className={cardClass}>
                    {card}
                  </Link>
                )}
              </LeafMotion>
            );
          })}
          {aside ? (
            <LeafMotion delay={0.2} className="h-full sm:col-span-2 lg:col-span-2">
              {aside}
            </LeafMotion>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
