import type { ShopProduct } from "@/data/products";

export type ProductFamilyType = {
  slug: string;
  label: string;
};

export type ProductFamily = {
  slug: string;
  label: string;
  types: ProductFamilyType[];
};

const ROOM_OR_META_SLUGS = new Set([
  "livingroom",
  "bedroom",
  "diningroom",
  "bedding",
  "carpet",
  "lighting",
  "decor",
  "dishes",
  "product",
  "accessory",
]);

/** Mid-level groups from the live WordPress menu: tag first, then types. */
export const productFamilies: ProductFamily[] = [
  {
    slug: "sofa",
    label: "کاناپه",
    types: [{ slug: "sofa", label: "کاناپه" }],
  },
  {
    slug: "armchair",
    label: "مبل تک نفره",
    types: [
      { slug: "armchair", label: "مبل تک نفره" },
      { slug: "مبل-تک-نفره", label: "مبل تک نفره فضای باز" },
    ],
  },
  {
    slug: "modular-sofa",
    label: "مبل ال",
    types: [{ slug: "modular-sofa", label: "مبل ال" }],
  },
  {
    slug: "outdoor-furniture",
    label: "مبلمان فضای باز",
    types: [
      { slug: "outdoor-furniture", label: "مبلمان فضای باز" },
      { slug: "تخت-آفتاب", label: "تخت آفتاب" },
      { slug: "نیمکت", label: "نیمکت" },
    ],
  },
  {
    slug: "chair",
    label: "صندلی",
    types: [
      { slug: "chair", label: "صندلی" },
      { slug: "diningchairs", label: "صندلی غذاخوری" },
      { slug: "bar-stools", label: "صندلی کانتر" },
      { slug: "dressing-table-chair", label: "صندلی میزآرایش" },
      { slug: "rocking-chair", label: "صندلی راک" },
    ],
  },
  {
    slug: "table",
    label: "میز",
    types: [
      { slug: "table", label: "میز" },
      { slug: "coffeetable", label: "جلو مبلی" },
      { slug: "میز-جلو-مبلی", label: "میز جلو مبلی" },
      { slug: "sidetable", label: "کنار مبلی" },
      { slug: "tv-stand", label: "میز تلویزیون" },
      { slug: "desk", label: "میز تحریر" },
      { slug: "memory-table", label: "میز خاطره" },
      { slug: "makeup-table", label: "میز آرایش" },
      { slug: "dining-table", label: "میز غذاخوری" },
    ],
  },
  {
    slug: "consoles",
    label: "کمد کنسول",
    types: [
      { slug: "consoles", label: "کمد کنسول" },
      { slug: "bar", label: "کمد بار" },
      { slug: "buffet", label: "بوفه" },
      { slug: "console", label: "کنسول" },
    ],
  },
  {
    slug: "bed",
    label: "تخت خواب",
    types: [{ slug: "bed", label: "تخت خواب" }],
  },
  {
    slug: "nightstand",
    label: "پاتختی",
    types: [{ slug: "nightstand", label: "پاتختی" }],
  },
  {
    slug: "drawer",
    label: "دراور",
    types: [{ slug: "drawer", label: "دراور" }],
  },
  {
    slug: "mirror",
    label: "آینه",
    types: [{ slug: "mirror", label: "آینه" }],
  },
  {
    slug: "loveseat",
    label: "لاوست",
    types: [{ slug: "loveseat", label: "لاوست" }],
  },
  {
    slug: "bedding",
    label: "کالای خواب",
    types: [
      { slug: "mattress", label: "تشک" },
      { slug: "bedspreads", label: "سرویس روتختی" },
      { slug: "linen-set", label: "سرویس ملحفه" },
      { slug: "blanket", label: "پتو" },
      { slug: "pillow", label: "بالش" },
    ],
  },
  {
    slug: "lighting",
    label: "روشنایی",
    types: [
      { slug: "floor-lampshade", label: "آباژور ایستاده" },
      { slug: "table-lampshade", label: "آباژور رومیزی" },
      { slug: "pendant", label: "آویز" },
      { slug: "chandelier", label: "لوستر" },
    ],
  },
  {
    slug: "decor",
    label: "دکور",
    types: [
      { slug: "vase", label: "گلدان" },
      { slug: "candlestick", label: "شمعدان" },
      { slug: "candle", label: "شمع" },
      { slug: "clock", label: "ساعت" },
      { slug: "panel", label: "تابلو دکوراتیو" },
      { slug: "cushion", label: "کوسن" },
      { slug: "decorative", label: "دکوراتیو" },
    ],
  },
  {
    slug: "dishes",
    label: "ظروف",
    types: [{ slug: "dishes", label: "ظروف" }],
  },
  {
    slug: "carpet",
    label: "فرش و گلیم",
    types: [
      { slug: "carpet", label: "فرش" },
      { slug: "rug", label: "گلیم" },
      { slug: "machine", label: "فرش ماشینی" },
    ],
  },
];

const typeToFamily = new Map<string, ProductFamily>();
const typeBySlug = new Map<string, ProductFamilyType>();

function registerTypeAlias(alias: string, canonicalSlug: string) {
  const family = typeToFamily.get(canonicalSlug);
  const type = typeBySlug.get(canonicalSlug);
  if (!alias || !family || !type || typeToFamily.has(alias)) return;
  typeToFamily.set(alias, family);
  typeBySlug.set(alias, type);
}

for (const family of productFamilies) {
  for (const type of family.types) {
    typeToFamily.set(type.slug, family);
    typeBySlug.set(type.slug, type);
    registerTypeAlias(type.label, type.slug);
    registerTypeAlias(type.label.replace(/\s+/g, ""), type.slug);
  }
}

typeToFamily.set("diningchair", typeToFamily.get("diningchairs")!);
typeBySlug.set("diningchair", typeBySlug.get("diningchairs")!);
registerTypeAlias("میز-تلویزیون", "tv-stand");
registerTypeAlias("tvtable", "tv-stand");
registerTypeAlias("tv_stand", "tv-stand");

export function isMetaCategorySlug(slug: string) {
  return ROOM_OR_META_SLUGS.has(slug);
}

export function getProductTypeTerms(product: ShopProduct) {
  return product.categories.filter((term) => !isMetaCategorySlug(term.slug));
}

const namedTypes = productFamilies
  .flatMap((family) => family.types.map((type) => ({ family, type })))
  .sort((left, right) => right.type.label.length - left.type.label.length);

function haystack(product: ShopProduct) {
  const terms = product.categories.map((term) => `${term.name} ${term.slug}`).join(" ");
  return `${product.name} ${product.category} ${terms}`.toLocaleLowerCase("fa");
}

const typeAliases: Record<string, string[]> = {
  coffeetable: ["جلومبلی", "جلو مبلی", "میز جلومبلی"],
  sidetable: ["کنارمبلی", "کنار مبلی", "میز کنارمبلی"],
  "tv-stand": ["میزتلویزیون", "میز تلویزیون"],
  "makeup-table": ["میزآرایش", "میز آرایش"],
  "dressing-table-chair": ["صندلی میزآرایش", "صندلی میز آرایش"],
  diningchairs: ["صندلی غذاخوری", "صندلی ناهارخوری"],
};

function inferFromName(product: ShopProduct) {
  const text = haystack(product);
  const byType = namedTypes.find(({ type }) => {
    const labels = [type.label, ...(typeAliases[type.slug] ?? [])].map((label) => label.toLocaleLowerCase("fa"));
    return labels.some((label) => text.includes(label));
  });
  if (byType) return byType;
  return namedTypes.find(({ family }) => text.includes(family.label.toLocaleLowerCase("fa")));
}

function typeFromTerm(term: { slug: string; name: string }) {
  return typeBySlug.get(term.slug) || typeBySlug.get(term.name) || typeBySlug.get(term.name.replace(/\s+/g, ""));
}

function typesFromProduct(product: ShopProduct) {
  const types: ProductFamilyType[] = [];
  const seen = new Set<string>();
  for (const term of getProductTypeTerms(product)) {
    const type = typeFromTerm(term);
    if (!type || seen.has(type.slug)) continue;
    seen.add(type.slug);
    types.push(type);
  }
  return types;
}

function mostSpecificType(types: ProductFamilyType[]) {
  if (!types.length) return undefined;
  return [...types].sort((left, right) => {
    const leftRoot = typeToFamily.get(left.slug)?.slug === left.slug ? 1 : 0;
    const rightRoot = typeToFamily.get(right.slug)?.slug === right.slug ? 1 : 0;
    return leftRoot - rightRoot || right.label.length - left.label.length;
  })[0];
}

export function getProductFamily(product: ShopProduct): ProductFamily | undefined {
  for (const type of typesFromProduct(product)) {
    const family = typeToFamily.get(type.slug);
    if (family) return family;
  }
  for (const term of getProductTypeTerms(product)) {
    const family = typeToFamily.get(term.slug) || typeToFamily.get(term.name);
    if (family) return family;
  }
  return inferFromName(product)?.family;
}

export function getProductType(product: ShopProduct): ProductFamilyType | undefined {
  const specific = mostSpecificType(typesFromProduct(product));
  if (specific) return specific;
  const inferred = inferFromName(product)?.type;
  if (inferred) return inferred;
  const fallback = getProductTypeTerms(product)[0];
  return fallback ? { slug: fallback.slug, label: fallback.name } : undefined;
}

export function productMatchesFamily(product: ShopProduct, familySlug: string) {
  return getProductFamily(product)?.slug === familySlug;
}

export function productMatchesType(product: ShopProduct, typeSlug: string) {
  const canonical = typeBySlug.get(typeSlug)?.slug ?? typeSlug;
  return getProductType(product)?.slug === canonical;
}

export function getFamiliesInProducts(products: ShopProduct[]) {
  const counts = new Map<string, { family: ProductFamily; count: number }>();
  for (const product of products) {
    const family = getProductFamily(product);
    if (!family) continue;
    const current = counts.get(family.slug);
    counts.set(family.slug, { family, count: (current?.count ?? 0) + 1 });
  }
  return productFamilies
    .map((family) => counts.get(family.slug))
    .filter((item): item is { family: ProductFamily; count: number } => Boolean(item));
}

export function getTypesInProducts(products: ShopProduct[], familySlug?: string) {
  const scoped = familySlug && familySlug !== "all"
    ? products.filter((product) => productMatchesFamily(product, familySlug))
    : products;
  const counts = new Map<string, { type: ProductFamilyType; count: number }>();
  for (const product of scoped) {
    const type = getProductType(product);
    if (!type) continue;
    const current = counts.get(type.slug);
    counts.set(type.slug, { type, count: (current?.count ?? 0) + 1 });
  }
  const order = familySlug && familySlug !== "all"
    ? productFamilies.find((family) => family.slug === familySlug)?.types.map((type) => type.slug) ?? []
    : productFamilies.flatMap((family) => family.types.map((type) => type.slug));
  return order
    .map((slug) => counts.get(slug))
    .filter((item): item is { type: ProductFamilyType; count: number } => Boolean(item));
}
