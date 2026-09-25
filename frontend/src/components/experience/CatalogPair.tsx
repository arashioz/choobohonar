import ClipReveal from "@/components/motion/ClipReveal";
import Container from "@/components/layout/Container";

export type CatalogLeaf = {
  title: string;
  edition: string;
  image: string;
  file: string;
  alt: string;
};

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
            <figure key={catalog.edition}>
              <ClipReveal delay={index * 0.14}>
                <a href={catalog.file} download className="block bg-paper/5">
                  <img
                    src={catalog.image}
                    alt={catalog.alt}
                    className="aspect-[3/4] w-full object-cover object-top"
                  />
                </a>
              </ClipReveal>
              <figcaption className="mt-5 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className={dark ? "truncate text-xs tracking-[0.18em] text-paper/45" : "truncate text-xs tracking-[0.18em] text-forest/45"} dir="ltr">
                    {catalog.edition}
                  </p>
                  <p className="mt-2 text-2xl font-light">{catalog.title}</p>
                </div>
                <a
                  href={catalog.file}
                  download
                  className={dark ? "shrink-0 text-sm text-peach" : "shrink-0 text-sm text-brick"}
                >
                  دانلود
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
