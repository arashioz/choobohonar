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
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getProductEditorialContent } from "@/lib/product-editorial";
import { getApiBase } from "@/lib/api-base";
import { normalizeStorefrontProduct } from "@/lib/storefront-products";

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
  const backendProduct = await getAdminProduct(slug);
  if (backendProduct?.status === "published") {
    return { title: `${backendProduct.name} | قیمت، مشخصات و خرید | خانه چوب و هنر`, description: backendProduct.shortDescription || backendProduct.longDescription };
  }
  const product = getCatalogProduct(slug);
  if (!product) {
    const shopProduct = await getAdminProduct(slug);
    if (!shopProduct) return { title: "محصول یافت نشد | خانه چوب و هنر" };
    return { title: `${shopProduct.name} | قیمت، مشخصات و خرید | خانه چوب و هنر`, description: shopProduct.shortDescription || shopProduct.longDescription };
  }
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
  const backendProduct = await getAdminProduct(slug);
  if (backendProduct?.status === "published") {
    return <CommerceProductDetail product={normalizeStorefrontProduct(backendProduct)} />;
  }
  const product = getCatalogProduct(slug);
  if (!product) {
    const shopProduct = await getAdminProduct(slug);
    if (!shopProduct || shopProduct.status !== "published") notFound();
    return <AdminProductPage product={shopProduct} slug={slug} />;
  }

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

type AdminProduct = { _id?: string; slug?: string; name: string; category: string; room?: import("@/data/products").ProductRoom; shortDescription?: string; longDescription?: string; image?: string; gallery?: string[]; price?: number; compareAtPrice?: number; stockQty?: number; trackInventory?: boolean; specs?: { label: string; value: string }[]; highlights?: { title: string; description: string }[]; status: string };
async function getAdminProduct(slug: string): Promise<AdminProduct | null> {
  try {
    const response = await fetch(`${getApiBase()}/shop/products/slug/${encodeURIComponent(slug)}`, { cache: "no-store" });
    return response.ok ? response.json() : null;
  } catch { return null; }
}
function AdminProductPage({ product, slug }: { product: AdminProduct; slug: string }) {
  const images = product.gallery?.length ? product.gallery : product.image ? [product.image] : [];
  return <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32"><Container>
    <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55"><Link href="/">خانه</Link><span>/</span><Link href="/products">محصولات</Link><span>/</span><span className="text-forest">{product.name}</span></nav>
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><div className="space-y-3">{images.length ? images.map((image, index) => <div key={image} className="relative aspect-[4/5] overflow-hidden bg-forest/5"><img src={image} alt={`${product.name}${index ? ` ${index + 1}` : ""}`} className="h-full w-full object-cover" /></div>) : <div className="aspect-[4/5] bg-forest/5" />}</div>
      <div className="lg:sticky lg:top-28 lg:h-fit"><p className="eyebrow text-brick">{product.category}</p><h1 className="mt-4 text-4xl font-light tracking-tightest text-forest md:text-6xl">{product.name}</h1><p className="mt-6 text-lg leading-9 text-forest/65">{product.shortDescription}</p>{product.price ? <p className="mt-8 text-2xl text-forest">{product.price.toLocaleString("fa-IR")} تومان</p> : null}<p className="mt-3 text-sm text-forest/45">{product.trackInventory && product.stockQty === 0 ? "ناموجود" : "امکان ثبت سفارش آنلاین و هماهنگی با کارشناس فراهم است."}</p><div className="mt-8 flex flex-wrap gap-3">{!(product.trackInventory && product.stockQty === 0) ? <AddToCartButton slug={slug} name={product.name} image={product.image || ""} productId={product._id} unitPrice={product.price} label="افزودن به سبد خرید" /> : null}<Link href="/contact" className="inline-flex items-center rounded-xl border border-forest/20 px-6 py-3 text-sm text-forest">مشاوره خرید</Link></div></div></div>
    {product.longDescription && <article className="mx-auto mt-20 max-w-3xl whitespace-pre-wrap text-lg leading-[2] text-forest/75">{product.longDescription}</article>}
    {product.highlights?.length ? <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">{product.highlights.map((item) => <div key={item.title} className="border-t border-forest/15 pt-4"><h2 className="text-lg text-forest">{item.title}</h2><p className="mt-2 text-sm leading-7 text-forest/60">{item.description}</p></div>)}</div> : null}
    {product.specs?.length ? <dl className="mx-auto mt-16 max-w-3xl divide-y divide-forest/10 border-y border-forest/10">{product.specs.map((item) => <div key={item.label} className="grid grid-cols-2 py-4 text-sm"><dt className="text-forest/50">{item.label}</dt><dd className="text-forest">{item.value}</dd></div>)}</dl> : null}
  </Container></section>;
}
