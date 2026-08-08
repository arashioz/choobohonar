import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { getProduct } from "@/data/products";
import { getProjectProductSlugs } from "@/lib/project-images";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function ProjectProducts({ project }: { project: Project }) {
  const slugs = getProjectProductSlugs(project);
  const products = slugs.map((slug) => getProduct(slug)).filter(Boolean);

  if (!products.length) return null;

  return (
    <section className="border-t border-forest/10 bg-paper py-16 md:py-20">
      <Container>
        <FadeUp as="p" className="eyebrow text-brick">
          محصولات این پروژه
        </FadeUp>
        <FadeUp
          as="h2"
          delay={0.05}
          className="mt-4 max-w-2xl text-balance text-[clamp(1.75rem,4vw,3rem)] font-light leading-[0.95] tracking-tightest text-forest"
        >
          قطعاتی که در این فضا به کار رفته‌اند
        </FadeUp>

        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <li key={product!.slug}>
              <Link
                href={`/products/${product!.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-paper transition-colors hover:border-forest/25"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-forest/5">
                  <Image
                    src={product!.image}
                    alt={product!.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-display text-sm text-brick">{product!.series}</p>
                  <p className="mt-1 text-base font-light text-forest">{product!.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-forest/60">
                    {product!.shortDescription}
                  </p>
                  <span className="mt-auto pt-4 text-xs tracking-wide text-forest/50 transition-colors group-hover:text-brick">
                    مشاهده و خرید
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
