import { getAllCatalogProducts, type AnyProduct } from "@/data/products";

export type ProductCollection = {
  slug: string;
  name: string;
  nameEn: string;
  eyebrow: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  /** Match shop/editorial products whose name or slug contains any of these tokens. */
  matchTokens: string[];
  /** Explicit product slugs to always include (optional). */
  productSlugs?: string[];
};

export const collections: ProductCollection[] = [
  {
    slug: "solo",
    name: "کالکشن سولو",
    nameEn: "Solo",
    eyebrow: "مجموعه محصولات",
    shortDescription: "خطوط آرام و فرم‌های مینیمال برای نشیمن و غذاخوری یکپارچه.",
    longDescription:
      "کالکشن سولو مجموعه‌ای هماهنگ از مبلمان نشیمن و غذاخوری است؛ از مبل تک‌نفره و کاناپه تا میز جلو مبلی، ترولی، میز و صندلی غذاخوری. زبان طراحی ساده و معاصر است تا فضاهای شهری و خانه‌های روشن با یک پالت منسجم شکل بگیرند.",
    image: "https://choobohonar.com/wp-content/uploads/2025/11/کاناپه-سولو-خانه-چوب-و-هنر-1.jpg",
    matchTokens: ["سولو", "solo"],
    productSlugs: [
      "مبل-تک-نفره-سولو",
      "کاناپه-دو-نفره-سولو",
      "پاف-سولو",
      "میز-جلو-مبلی-سولو",
      "ترولی-سولو",
      "میز-غذاخوری-سولو",
      "صندلی-غذاخوری-سولو",
    ],
  },
];

export function getCollection(slug: string): ProductCollection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

function matchesCollection(product: AnyProduct, collection: ProductCollection): boolean {
  if (collection.productSlugs?.includes(product.slug)) return true;
  const haystack = `${product.slug} ${product.name}`.toLowerCase();
  return collection.matchTokens.some((token) => haystack.includes(token.toLowerCase()));
}

export function getCollectionProducts(slug: string): AnyProduct[] {
  const collection = getCollection(slug);
  if (!collection) return [];
  return getAllCatalogProducts().filter((product) => matchesCollection(product, collection));
}

export function getCollectionProductCount(slug: string): number {
  return getCollectionProducts(slug).length;
}
