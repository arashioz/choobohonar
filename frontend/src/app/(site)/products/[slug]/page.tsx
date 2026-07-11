import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  featuredProducts,
  getAllCatalogProducts,
  getCatalogProduct,
  getRelatedCatalogProducts,
  isShopProduct,
} from "@/data/products";
import Container from "@/components/layout/Container";
import ProductHero from "@/components/products/ProductHero";
import ShopProductIntro from "@/components/products/ShopProductIntro";
import ProductHighlights from "@/components/products/ProductHighlights";
import TechnicalContent from "@/components/products/TechnicalContent";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviews from "@/components/products/ProductReviews";
import ProductFaq from "@/components/products/ProductFaq";

export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-generating 500+ paths in dev breaks the static-paths worker (stale vendor chunks).
  if (process.env.NODE_ENV === "development") {
    return featuredProducts.map((p) => ({ slug: p.slug }));
  }
  return getAllCatalogProducts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getCatalogProduct(params.slug);
  if (!product) return { title: "محصول یافت نشد | خانه چوب و هنر" };
  return {
    title: `${product.name} | خانه چوب و هنر`,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} | خانه چوب و هنر`,
      description: product.shortDescription,
      images: [product.image],
      type: "website",
      locale: "fa_IR",
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getCatalogProduct(params.slug);
  if (!product) notFound();

  if (isShopProduct(product)) {
    const related = getRelatedCatalogProducts(product.slug, 3);

    return (
      <>
        <section className="bg-paper pt-32 pb-20 md:pt-40 md:pb-24">
          <Container>
            <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
              <Link href="/" className="transition-colors hover:text-forest">
                خانه
              </Link>
              <span>/</span>
              <Link href="/products" className="transition-colors hover:text-forest">
                محصولات
              </Link>
              <span>/</span>
              <span className="text-forest">{product.name}</span>
            </nav>

            <ShopProductIntro product={product} />
          </Container>
        </section>

        <RelatedProducts products={related} />
      </>
    );
  }

  const related = getRelatedCatalogProducts(product.slug, 3);

  return (
    <>
      <section className="bg-paper pt-32 pb-20 md:pt-40 md:pb-24">
        <Container>
          <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
            <Link href="/" className="transition-colors hover:text-forest">
              خانه
            </Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-forest">
              محصولات
            </Link>
            <span>/</span>
            <span className="text-forest">{product.name}</span>
          </nav>

          <ProductHero product={product} />

          <div className="mt-20 md:mt-28">
            <ProductHighlights product={product} />
          </div>
        </Container>
      </section>

      <TechnicalContent product={product} />
      <RelatedProducts products={related} />
      <ProductReviews product={product} />
      <ProductFaq product={product} />
    </>
  );
}
