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
import ProductHighlights from "@/components/products/ProductHighlights";
import TechnicalContent from "@/components/products/TechnicalContent";
import RelatedProducts from "@/components/products/RelatedProducts";
import ProductReviews from "@/components/products/ProductReviews";
import ProductFaq from "@/components/products/ProductFaq";
import CommerceProductDetail from "@/components/commerce/CommerceProductDetail";
import CommerceProductEditorial from "@/components/commerce/CommerceProductEditorial";
import { getProductEditorialContent } from "@/lib/product-editorial";

export const dynamicParams = true;

export function generateStaticParams() {
  // Pre-generating 500+ paths in dev breaks the static-paths worker (stale vendor chunks).
  if (process.env.NODE_ENV === "development") {
    return featuredProducts.map((p) => ({ slug: p.slug }));
  }
  return getAllCatalogProducts().map((p) => ({ slug: p.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) return { title: "محصول یافت نشد | خانه چوب و هنر" };
  const description = isShopProduct(product)
    ? getProductEditorialContent(product).seoDescription
    : product.shortDescription;
  return {
    title: `${product.name} | قیمت، مشخصات و خرید | خانه چوب و هنر`,
    description,
    alternates: { canonical: `/products/${encodeURIComponent(product.slug)}` },
    openGraph: {
      title: `${product.name} | خانه چوب و هنر`,
      description,
      images: [product.image],
      type: "website",
      locale: "fa_IR",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getCatalogProduct(slug);
  if (!product) notFound();

  if (isShopProduct(product)) {
    const related = getRelatedCatalogProducts(product.slug, 3);
    const editorial = getProductEditorialContent(product);
    const canonicalUrl = `https://choobohonar.com/products/${encodeURIComponent(product.slug)}`;
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.gallery.length ? product.gallery : [product.image],
      description: editorial.seoDescription,
      sku: String(product.id),
      brand: { "@type": "Brand", name: "خانه چوب و هنر" },
      category: product.category,
      url: canonicalUrl,
      additionalProperty: product.attributes.slice(0, 8).map((attribute) => ({
        "@type": "PropertyValue",
        name: attribute.name,
        value: attribute.terms.map((term) => term.name).join("، "),
      })),
      aggregateRating: product.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviewCount,
          }
        : undefined,
      offers: product.prices?.value
        ? {
            "@type": "Offer",
            priceCurrency: product.prices.currencyCode,
            price: product.prices.value,
            availability: product.isInStock
              ? "https://schema.org/InStock"
              : "https://schema.org/PreOrder",
            url: canonicalUrl,
          }
        : undefined,
    };
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: editorial.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <CommerceProductDetail product={product} />
        <CommerceProductEditorial product={product} />
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
