import type { Project } from "@/data/projects";
import { getProjectProductSlugs } from "@/lib/project-images";
import { fetchStorefrontProductsBySlugs } from "@/lib/storefront-products";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import CommerceProductCard from "@/components/commerce/CommerceProductCard";

export default async function ProjectProducts({ project }: { project: Project }) {
  const slugs = getProjectProductSlugs(project);
  const products = await fetchStorefrontProductsBySlugs(slugs);

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
            <li key={product.slug}>
              <CommerceProductCard product={product} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
