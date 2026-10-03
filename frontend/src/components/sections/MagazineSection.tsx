import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import PostCard from "@/components/magazine/PostCard";
import { HOME_PAGE_DEFAULTS } from "@/lib/home-page-content";
import { loadMagazineCatalog } from "@/lib/magazine-catalog";

export default async function MagazineSection({
  title = HOME_PAGE_DEFAULTS.magazine.title,
  linkLabel = HOME_PAGE_DEFAULTS.magazine.linkLabel,
}: {
  title?: string;
  linkLabel?: string;
} = {}) {
  const { posts } = await loadMagazineCatalog();
  const latest = posts.slice(0, 3);

  return (
    <section id="magazine" className="bg-paper py-28 md:py-40">
      <Container>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp
            as="h2"
            className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
          >
            {title}
          </FadeUp>
          <FadeUp delay={0.1}>
            <Link
              href="/magazine"
              className="group inline-flex items-center gap-3 text-lg text-forest transition-colors hover:text-brick"
            >
              {linkLabel}
              <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-2">←</span>
            </Link>
          </FadeUp>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {latest.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <PostCard post={p} />
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
