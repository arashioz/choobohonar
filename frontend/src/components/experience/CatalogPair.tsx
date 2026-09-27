import ClipReveal from "@/components/motion/ClipReveal";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";

export type CatalogLeaf = {
  title: string;
  edition: string;
  image: string;
  file: string;
  alt: string;
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

export default function CatalogPair({
  catalogs,
  kicker,
  title,
  tone = "forest",
}: {
  catalogs: CatalogLeaf[];
  kicker: string;
  title: string;
  tone?: "forest" | "paper";
}) {
  const dark = tone === "forest";

  return (
    <section className={dark ? "bg-forest py-20 text-paper md:py-28" : "bg-paper py-20 text-forest md:py-28"}>
      <Container>
        <p className={dark ? "eyebrow text-peach" : "eyebrow text-brick"}>{kicker}</p>
        <h2 className="mt-5 max-w-xl text-[clamp(2.2rem,4vw,4rem)] font-extralight leading-none tracking-tightest">
          {title}
        </h2>
        <div className="mt-14 grid items-start gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {catalogs.map((catalog, index) => (
            <ClipReveal key={catalog.edition} delay={index * 0.14}>
              <a href={catalog.file} download className="group relative block overflow-hidden bg-paper/5">
                <img
                  src={catalog.image}
                  alt={catalog.alt}
                  className={cn(
                    "aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]",
                    catalog.frame ?? "object-top",
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-paper">
                  <p className="text-2xl font-light leading-tight">{catalog.title}</p>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/35 bg-white/15 text-paper backdrop-blur-md transition-colors group-hover:bg-white/25">
                    <DownloadIcon />
                    <span className="sr-only">دانلود {catalog.title}</span>
                  </span>
                </div>
              </a>
            </ClipReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
