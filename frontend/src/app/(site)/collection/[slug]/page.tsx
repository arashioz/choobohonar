import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collections,
  getCollection,
  getCollectionProducts,
} from "@/data/collections";
import { isShopProduct } from "@/data/products";
import { getProductShopUrl } from "@/lib/shop";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = getCollection(params.slug);
  if (!collection) return { title: "کالکشن یافت نشد | خانه چوب و هنر" };
  return {
    title: `${collection.name} | خانه چوب و هنر`,
    description: collection.shortDescription,
  };
}

export default function CollectionDetailPage({ params }: { params: { slug: string } }) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();
  const matchingProducts = getCollectionProducts(collection.slug);

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <Link href="/collection" className="transition-colors hover:text-forest">
            کالکشن
          </Link>
          <span>/</span>
          <span className="text-forest">{collection.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 border-b border-forest/10 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <FadeUp as="p" className="eyebrow text-brick">
              {collection.eyebrow}
            </FadeUp>
            <FadeUp
              as="h1"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest"
            >
              {collection.name}
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-2 font-display text-xl text-forest/45">
              {collection.nameEn}
            </FadeUp>
            <FadeUp as="p" delay={0.15} className="mt-6 max-w-2xl text-lg leading-relaxed text-forest/65">
              {collection.longDescription}
            </FadeUp>
          </div>
          <FadeUp delay={0.1} className="relative aspect-[4/3] w-full overflow-hidden bg-forest/5">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </FadeUp>
        </div>

        <div className="mt-14 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-light tracking-tight text-forest">محصولات این کالکشن</h2>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-forest transition-colors hover:text-brick"
          >
            مشاهده همه محصولات
            <span>←</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {matchingProducts.map((product, index) => (
            <FadeUp key={product.slug} delay={Math.min(index * 0.06, 0.36)}>
              <article className="group block">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-light tracking-tight text-forest">{product.name}</h3>
                    <span className="text-sm text-forest/65">{product.category}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-forest/60">{product.shortDescription}</p>
                </Link>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-brick transition-colors hover:text-forest"
                  >
                    معرفی محصول
                    <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                  </Link>
                  {isShopProduct(product) || product.shopUrl ? (
                    <a
                      href={getProductShopUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-forest/55 transition-colors hover:text-forest"
                    >
                      خرید
                    </a>
                  ) : null}
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-4">
          <Button as="a" href="/collection" variant="secondary">
            همه کالکشن‌ها
          </Button>
          <Button as="a" href="/materials" variant="secondary" showArrow>
            متریال‌ها
          </Button>
        </div>
      </Container>
    </section>
  );
}
