import type { ProductRoom, ShopProduct } from "@/data/products";
import { shopProducts } from "@/data/products";

export type CommerceSubcategory = {
  slug: string;
  label: string;
};

export type CommerceCategory = {
  slug: string;
  label: string;
  eyebrow: string;
  description: string;
  story: string;
  image: string;
  room?: ProductRoom;
  taxonomySlug?: string;
  children: CommerceSubcategory[];
};

export const commerceCategories: CommerceCategory[] = [
  {
    slug: "livingroom",
    label: "نشیمن",
    eyebrow: "Living / 01",
    description: "مبلمان و میزهایی برای مکث، گفتگو و زندگی روزمره.",
    story: "از کاناپه‌های عمیق تا میزهای کم‌ارتفاع؛ هر قطعه برای ساختن یک مرکز آرام در خانه انتخاب شده است.",
    image: "https://choobohonar.com/wp-content/uploads/2026/01/مبل-چدار-خانه-چوب-و-هنر-1.jpg",
    room: "living",
    children: [
      { slug: "sofa", label: "کاناپه" },
      { slug: "armchair", label: "مبل تک نفره" },
      { slug: "modular-sofa", label: "مبل ال" },
      { slug: "table", label: "میز" },
      { slug: "consoles", label: "کمد و کنسول" },
      { slug: "outdoor-furniture", label: "فضای باز" },
    ],
  },
  {
    slug: "bedroom",
    label: "اتاق خواب",
    eyebrow: "Bedroom / 02",
    description: "فضایی شخصی برای آرامش، نظم و شروع دوباره.",
    story: "سرویس‌های خواب، پاتختی و دراور با تناسبات آرام و جزئیات دقیق چوب ساخته می‌شوند.",
    image: "https://choobohonar.com/wp-content/uploads/2023/07/تخت-خواب-آکومه-خانه-چوب-و-هنر-1.jpg",
    room: "bedroom",
    children: [
      { slug: "bed", label: "تخت خواب" },
      { slug: "nightstand", label: "پاتختی" },
      { slug: "makeup-table", label: "میز آرایش" },
      { slug: "drawer", label: "دراور" },
      { slug: "mirror", label: "آینه" },
      { slug: "loveseat", label: "لاوست" },
    ],
  },
  {
    slug: "diningroom",
    label: "غذاخوری",
    eyebrow: "Dining / 03",
    description: "میزبان لحظه‌هایی که دور یک میز شکل می‌گیرند.",
    story: "میز و صندلی غذاخوری با سازه‌های ماندگار و سطح‌هایی آماده برای استفاده هرروزه طراحی شده‌اند.",
    image: "https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg",
    room: "dining",
    children: [
      { slug: "dining-table", label: "میز غذاخوری" },
      { slug: "diningchairs", label: "صندلی غذاخوری" },
      { slug: "bar-stools", label: "صندلی کانتر" },
    ],
  },
  {
    slug: "bedding",
    label: "کالای خواب",
    eyebrow: "Bedding / 04",
    description: "لایه‌های نرم، تنفس‌پذیر و هماهنگ برای خواب بهتر.",
    story: "منسوجات خواب با تمرکز بر لمس، دوام و هماهنگی رنگی با فضای اتاق انتخاب شده‌اند.",
    image: "https://choobohonar.com/wp-content/uploads/2026/02/سرویس-روتختی-گلدن-رودز-53-خانه-چوب-و-هنر-1.jpg",
    room: "bedding",
    children: [
      { slug: "bedspreads", label: "سرویس روتختی" },
      { slug: "linen-set", label: "سرویس ملحفه" },
      { slug: "blanket", label: "پتو" },
      { slug: "pillow", label: "بالش" },
      { slug: "mattress", label: "تشک" },
    ],
  },
  {
    slug: "carpet",
    label: "فرش",
    eyebrow: "Carpet / 05",
    description: "بافت‌هایی که فضا را یکپارچه و گرم می‌کنند.",
    story: "فرش، لایه‌ای میان معماری و زندگی است؛ بافت، مقیاس و رنگ آن ریتم فضا را کامل می‌کند.",
    image: "https://choobohonar.com/wp-content/uploads/2025/07/فرش-زاب-کرم-1.jpg",
    room: "carpet",
    children: [
      { slug: "handmade", label: "دستبافت" },
      { slug: "machine", label: "ماشینی" },
    ],
  },
  {
    slug: "kilim",
    label: "گلیم",
    eyebrow: "Kilim / 06",
    description: "بافته‌هایی سبک و پررنگ برای گرما و شخصیت‌دادن به فضا.",
    story: "گلیم با بافت تخت و نقش‌های متمایز، لایه‌ای انعطاف‌پذیر و زنده برای نشیمن و اتاق خواب است.",
    image: "https://choobohonar.com/wp-content/uploads/2025/07/فرش-زاب-کرم-1.jpg",
    taxonomySlug: "rug",
    children: [],
  },
  {
    slug: "lighting",
    label: "روشنایی",
    eyebrow: "Lighting / 07",
    description: "نورهایی برای تعریف حال‌وهوای هر گوشه از خانه.",
    story: "روشنایی فقط یک شیء نیست؛ کیفیت سایه، تمرکز و گرمای بصری فضای خانه را تنظیم می‌کند.",
    image: "https://choobohonar.com/wp-content/uploads/2026/07/آباژور-گالن-1.jpg",
    room: "lighting",
    children: [
      { slug: "table-lampshade", label: "آباژور رومیزی" },
      { slug: "floor-lampshade", label: "آباژور ایستاده" },
      { slug: "pendant", label: "آویز" },
      { slug: "chandelier", label: "لوستر" },
    ],
  },
  {
    slug: "decor",
    label: "دکور",
    eyebrow: "Objects / 08",
    description: "اشیایی کوچک با تأثیری ماندگار بر شخصیت فضا.",
    story: "از آینه و گلدان تا شمع و ظروف؛ جزئیاتی که روایت خانه را شخصی و کامل می‌کنند.",
    image: "https://choobohonar.com/wp-content/uploads/2023/05/دراور-آلدر-خانه-چوب-و-هنر-2.jpg",
    room: "decor",
    taxonomySlug: "decor",
    children: [
      { slug: "mirror", label: "آینه" },
      { slug: "vase", label: "گلدان" },
      { slug: "dishes", label: "ظروف" },
      { slug: "candle", label: "شمع" },
      { slug: "cushion", label: "کوسن" },
      { slug: "decorative", label: "دکوراتیو" },
    ],
  },
];

export type ResolvedCommerceCategory = {
  root: CommerceCategory;
  active: CommerceSubcategory | null;
  path: string[];
};

export function resolveCommerceCategory(path: string[]): ResolvedCommerceCategory | undefined {
  const [rootSlug, childSlug] = path;
  const root = commerceCategories.find((category) => category.slug === rootSlug);
  if (!root) return undefined;
  if (!childSlug) return { root, active: null, path: [rootSlug] };
  const active = root.children.find((category) => category.slug === childSlug);
  if (!active) return undefined;
  return { root, active, path: [rootSlug, childSlug] };
}

export function getCommerceCategoryProducts(category: ResolvedCommerceCategory): ShopProduct[] {
  if (category.active) {
    const exact = shopProducts.filter((product) =>
      product.categories.some((term) => term.slug === category.active?.slug) &&
      (!category.root.room || product.room === category.root.room),
    );
    if (exact.length) return exact;
  }

  if (category.root.taxonomySlug) {
    return shopProducts.filter((product) =>
      product.categories.some((term) => term.slug === category.root.taxonomySlug),
    );
  }

  return category.root.room
    ? shopProducts.filter((product) => product.room === category.root.room)
    : [];
}

export function getFeaturedCommerceProducts(count = 8): ShopProduct[] {
  const selected: ShopProduct[] = [];
  const used = new Set<string>();

  for (const root of commerceCategories) {
    const categoryProducts = getCommerceCategoryProducts({ root, active: null, path: [root.slug] });
    const product =
      categoryProducts.find((item) => item.image && item.isInStock && Number(item.prices?.value ?? 0) > 0) ??
      categoryProducts.find((item) => item.image);

    if (product && !used.has(product.slug)) {
      selected.push(product);
      used.add(product.slug);
    }
  }

  if (selected.length < count) {
    for (const product of shopProducts) {
      if (!product.image || used.has(product.slug)) continue;
      selected.push(product);
      used.add(product.slug);
      if (selected.length === count) break;
    }
  }

  return selected.slice(0, count);
}
