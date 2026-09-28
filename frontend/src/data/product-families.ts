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
    types: [{ slug: "armchair", label: "مبل تک نفره" }],
  },
  {
    slug: "modular-sofa",
    label: "مبل ال",
    types: [{ slug: "modular-sofa", label: "مبل ال" }],
  },
  {
    slug: "outdoor-furniture",
    label: "مبل و صندلی فضای باز",
    types: [
      { slug: "outdoor-furniture", label: "مبل و صندلی فضای باز" },
      { slug: "مبل-تک-نفره", label: "مبل تک نفره فضای باز" },
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
    slug: "lampshade",
    label: "آباژور",
    types: [
      { slug: "floor-lampshade", label: "آباژور ایستاده" },
      { slug: "table-lampshade", label: "آباژور رومیزی" },
    ],
  },
  {
    slug: "pendant",
    label: "آویز",
    types: [{ slug: "pendant", label: "آویز" }],
  },
  {
    slug: "chandelier",
    label: "لوستر",
    types: [{ slug: "chandelier", label: "لوستر" }],
  },
  {
    slug: "wall-light",
    label: "دیوارکوب",
    types: [{ slug: "wall-light", label: "دیوارکوب" }],
  },
  {
    slug: "vase",
    label: "گلدان",
    types: [{ slug: "vase", label: "گلدان" }],
  },
  {
    slug: "candle",
    label: "شمع",
    types: [
      { slug: "candle", label: "شمع" },
      { slug: "candlestick", label: "شمعدان" },
    ],
  },
  {
    slug: "decorative",
    label: "دکوراتیو",
    types: [
      { slug: "decorative", label: "دکوراتیو" },
      { slug: "mirror", label: "آینه" },
      { slug: "clock", label: "ساعت" },
      { slug: "panel", label: "تابلو دکوراتیو" },
      { slug: "cushion", label: "کوسن" },
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

function registerFamilyAlias(alias: string, familySlug: string) {
  const family = productFamilies.find((item) => item.slug === familySlug);
  if (!alias || !family || typeToFamily.has(alias)) return;
  typeToFamily.set(alias, family);
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
registerTypeAlias("آباژور-ایستاده", "floor-lampshade");
registerTypeAlias("آباژور ایستاده", "floor-lampshade");
registerTypeAlias("floor-lamp", "floor-lampshade");
registerTypeAlias("آباژور-رومیزی", "table-lampshade");
registerTypeAlias("آباژور رومیزی", "table-lampshade");
registerTypeAlias("table-lamp", "table-lampshade");
registerTypeAlias("آویز روشنایی", "pendant");
registerTypeAlias("اویز-روشنایی", "pendant");
registerTypeAlias("اویز", "pendant");
registerTypeAlias("شمع دکوراتیو", "candle");
registerFamilyAlias("آباژور", "lampshade");
registerFamilyAlias("lampshade", "lampshade");

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
  candle: ["شمع دکوراتیو"],
  candlestick: ["شمعدان"],
  vase: ["گلدان"],
  decorative: ["دکوراتیو"],
  coffeetable: ["جلومبلی", "جلو مبلی", "میز جلومبلی"],
  sidetable: ["کنارمبلی", "کنار مبلی", "میز کنارمبلی"],
  "tv-stand": ["میزتلویزیون", "میز تلویزیون"],
  "makeup-table": ["میزآرایش", "میز آرایش"],
  "dressing-table-chair": ["صندلی میزآرایش", "صندلی میز آرایش"],
  diningchairs: ["صندلی غذاخوری", "صندلی ناهارخوری"],
};

function inferFromName(product: ShopProduct) {
  const text = haystack(product);
  let best: { family: ProductFamily; type: ProductFamilyType; length: number } | undefined;
  for (const entry of namedTypes) {
    const labels = [entry.type.label, ...(typeAliases[entry.type.slug] ?? [])];
    for (const label of labels) {
      const normalized = label.toLocaleLowerCase("fa");
      if (!normalized || !text.includes(normalized)) continue;
      if (!best || normalized.length > best.length) best = { ...entry, length: normalized.length };
    }
  }
  if (best) return { family: best.family, type: best.type };
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

function enabledPurchaseValues(product: ShopProduct, attributeName: string) {
  const values = new Set<string>();
  for (const variant of product.variants ?? []) {
    if (variant.enabled === false || !(Number(variant.price) > 0)) continue;
    for (const option of variant.options ?? []) {
      if (option.name?.trim() === attributeName && option.value?.trim()) values.add(option.value.trim());
    }
  }
  return [...values];
}

/** آباژورهایی که نوعِ قابل‌خرید دارند، در فیلتر رومیزی و ایستاده همان نوع را می‌گیرند. */
export function lampshadeTypeSlugs(product: ShopProduct) {
  const text = `${product.category ?? ""} ${product.name}`;
  if (!/آباژور/.test(text)) return [];
  const values = enabledPurchaseValues(product, "نوع");
  const slugs: string[] = [];
  if (values.includes("ایستاده")) slugs.push("floor-lampshade");
  if (values.includes("رومیزی")) slugs.push("table-lampshade");
  if (slugs.length) return slugs;
  const typed = mostSpecificType(typesFromProduct(product)) ?? inferFromName(product)?.type;
  if (typed?.slug === "floor-lampshade" || typed?.slug === "table-lampshade") return [typed.slug];
  return [];
}

export function productMatchesType(product: ShopProduct, typeSlug: string) {
  const canonical = typeBySlug.get(typeSlug)?.slug ?? typeSlug;
  if (canonical === "floor-lampshade" || canonical === "table-lampshade") {
    const slugs = lampshadeTypeSlugs(product);
    if (slugs.length) return slugs.includes(canonical);
  }
  return getProductType(product)?.slug === canonical;
}

/** Decor landing chips, in the order of the category menu. */
const decorCatalogFamilies: ProductFamily[] = [
  { slug: "decor-clock", label: "ساعت", types: [{ slug: "decor-clock", label: "ساعت" }] },
  {
    slug: "decor-textile",
    label: "منسوجات",
    types: [
      { slug: "decor-throw", label: "شال مبل" },
      { slug: "decor-cushion", label: "کوسن" },
      { slug: "decor-runner", label: "رانر" },
      { slug: "decor-napkin", label: "دستمال سفره" },
    ],
  },
  { slug: "decor-panel", label: "تابلو دکوراتیو", types: [{ slug: "decor-panel", label: "تابلو دکوراتیو" }] },
  { slug: "decor-mirror", label: "آینه", types: [{ slug: "decor-mirror", label: "آینه" }] },
  { slug: "decor-candle", label: "شمع", types: [{ slug: "decor-candle", label: "شمع" }] },
  { slug: "decor-object", label: "دکوراتیو", types: [{ slug: "decor-object", label: "دکوراتیو" }] },
  { slug: "decor-dishes", label: "ظروف پذیرایی", types: [{ slug: "decor-dishes", label: "ظروف پذیرایی" }] },
  { slug: "decor-vase", label: "گلدان", types: [{ slug: "decor-vase", label: "گلدان" }] },
  { slug: "decor-candlestick", label: "شمعدان", types: [{ slug: "decor-candlestick", label: "شمعدان" }] },
  { slug: "decor-incense", label: "جا عودی", types: [{ slug: "decor-incense", label: "جا عودی" }] },
];

const decorChipSlugByMenu: Record<string, string> = {
  vase: "decor-vase",
  dishes: "decor-dishes",
  candle: "decor-candle",
  candlestick: "decor-candlestick",
  cushion: "decor-cushion",
  throw: "decor-throw",
  runner: "decor-runner",
  napkin: "decor-napkin",
  textiles: "decor-textile",
  decorative: "decor-object",
  mirror: "decor-mirror",
};

function decorFamily(slug: string) {
  return decorCatalogFamilies.find((family) => family.slug === slug);
}

function decorType(slug: string) {
  return decorCatalogFamilies.flatMap((family) => family.types).find((type) => type.slug === slug);
}

/** Category stored on the product, mapped to a decor chip and its filter type. */
const decorCategoryMap: Record<string, [string, string]> = {
  "جا عودی": ["decor-incense", "decor-incense"],
  "شال مبل": ["decor-textile", "decor-throw"],
  ساعت: ["decor-clock", "decor-clock"],
  "تابلو دکوراتیو": ["decor-panel", "decor-panel"],
  آینه: ["decor-mirror", "decor-mirror"],
  کوسن: ["decor-textile", "decor-cushion"],
  شمعدان: ["decor-candlestick", "decor-candlestick"],
  "شمع دکوراتیو": ["decor-candle", "decor-candle"],
  شمع: ["decor-candle", "decor-candle"],
  گلدان: ["decor-vase", "decor-vase"],
  ظروف: ["decor-dishes", "decor-dishes"],
  "ظروف پذیرایی": ["decor-dishes", "decor-dishes"],
  رانر: ["decor-textile", "decor-runner"],
  "دستمال سفره": ["decor-textile", "decor-napkin"],
  دکوراتیو: ["decor-object", "decor-object"],
};

function packDecor(familySlug: string, typeSlug: string): Classified | undefined {
  const family = decorFamily(familySlug);
  const type = decorType(typeSlug);
  return family && type ? { family, type } : undefined;
}

export function classifyDecorProduct(product: ShopProduct): Classified | undefined {
  const category = (product.category || "").trim();
  const name = product.name || "";
  // Textile pieces stay in منسوجات even when an older record still says دکوراتیو.
  if (category === "شال مبل" || name.startsWith("شال")) return packDecor("decor-textile", "decor-throw");
  if (category === "کوسن" || name.includes("کوسن")) return packDecor("decor-textile", "decor-cushion");
  if (category === "رانر" || name.startsWith("رانر")) return packDecor("decor-textile", "decor-runner");
  if (category === "دستمال سفره" || name.startsWith("دستمال")) return packDecor("decor-textile", "decor-napkin");
  // Decorative mirrors filed under the generic دکوراتیو category still belong in آینه.
  if ((category === "دکوراتیو" || category === "آینه") && /آینه/.test(name) && !/قاب\s*آینه/.test(name)) {
    return packDecor("decor-mirror", "decor-mirror");
  }
  const mapped = decorCategoryMap[category];
  if (mapped) return packDecor(mapped[0], mapped[1]);
  if (category) return undefined;
  if (/عود/.test(name)) return packDecor("decor-incense", "decor-incense");
  if (name.startsWith("ساعت")) return packDecor("decor-clock", "decor-clock");
  if (name.includes("تابلو")) return packDecor("decor-panel", "decor-panel");
  if (name.includes("آینه")) return packDecor("decor-mirror", "decor-mirror");
  if (/شمعدان|جاشمعی/.test(name)) return packDecor("decor-candlestick", "decor-candlestick");
  if (name.includes("شمع")) return packDecor("decor-candle", "decor-candle");
  if (name.includes("گلدان")) return packDecor("decor-vase", "decor-vase");
  if (name.includes("ظروف")) return packDecor("decor-dishes", "decor-dishes");
  return undefined;
}

export function getDecorCatalogFamily(product: ShopProduct): ProductFamily | undefined {
  return classifyDecorProduct(product)?.family;
}

export function productMatchesDecorFamily(product: ShopProduct, familySlug: string) {
  const hit = classifyDecorProduct(product);
  if (!hit) return false;
  const slug = decorChipSlugByMenu[familySlug] ?? familySlug;
  return hit.family.slug === slug || hit.type.slug === slug;
}

export function productMatchesDecorType(product: ShopProduct, typeSlug: string) {
  const slug = decorChipSlugByMenu[typeSlug] ?? typeSlug;
  return classifyDecorProduct(product)?.type.slug === slug;
}

export function getDecorFamiliesInProducts(products: ShopProduct[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    const family = getDecorCatalogFamily(product);
    if (!family) continue;
    counts.set(family.slug, (counts.get(family.slug) ?? 0) + 1);
  }
  return decorCatalogFamilies
    .map((family) => ({ family, count: counts.get(family.slug) ?? 0 }))
    .filter((item) => item.count > 0);
}

export function getDecorTypesInProducts(products: ShopProduct[], familySlug?: string) {
  const requested = decorChipSlugByMenu[familySlug || ""] ?? familySlug;
  if (requested !== "decor-textile") return [];
  const textile = decorFamily("decor-textile");
  if (!textile) return [];
  const scoped = products.filter((product) => classifyDecorProduct(product)?.family.slug === "decor-textile");
  return textile.types
    .map((type) => ({
      type,
      count: scoped.filter((product) => classifyDecorProduct(product)?.type.slug === type.slug).length,
    }))
    .filter((item) => item.count > 0);
}

type Classified = { family: ProductFamily; type: ProductFamilyType };

const bedroomFamilies: ProductFamily[] = [
  { slug: "bed", label: "تخت خواب", types: [{ slug: "bed", label: "تخت خواب" }] },
  { slug: "nightstand", label: "پاتختی", types: [{ slug: "nightstand", label: "پاتختی" }] },
  { slug: "drawer", label: "دراور", types: [{ slug: "drawer", label: "دراور" }] },
  { slug: "loveseat", label: "لاوست", types: [{ slug: "loveseat", label: "لاوست" }] },
  {
    slug: "vanity",
    label: "میز آرایش",
    types: [
      { slug: "vanity-drawer", label: "دراور میز آرایش" },
      { slug: "vanity-chair", label: "صندلی میز آرایش" },
      { slug: "vanity-mirror", label: "قاب آینه میز آرایش" },
    ],
  },
];

function bedroomFamily(slug: string) {
  return bedroomFamilies.find((family) => family.slug === slug);
}

function bedroomType(slug: string) {
  return bedroomFamilies.flatMap((family) => family.types).find((type) => type.slug === slug);
}

const bedroomCategoryMap: Record<string, [string, string]> = {
  "تخت خواب": ["bed", "bed"],
  تختخواب: ["bed", "bed"],
  پاتختی: ["nightstand", "nightstand"],
  دراور: ["drawer", "drawer"],
  لاوست: ["loveseat", "loveseat"],
  میزآرایش: ["vanity", "vanity-drawer"],
  "میز آرایش": ["vanity", "vanity-drawer"],
  "دراور میز آرایش": ["vanity", "vanity-drawer"],
  "صندلی میزآرایش": ["vanity", "vanity-chair"],
  "صندلی میز آرایش": ["vanity", "vanity-chair"],
  آینه: ["vanity", "vanity-mirror"],
  "قاب آینه میز آرایش": ["vanity", "vanity-mirror"],
};

export function classifyBedroomProduct(product: ShopProduct): Classified | undefined {
  const raw = (product.category || "").trim();
  const pack = (familySlug: string, typeSlug: string): Classified | undefined => {
    const family = bedroomFamily(familySlug);
    const type = bedroomType(typeSlug);
    return family && type ? { family, type } : undefined;
  };
  const mapped = bedroomCategoryMap[raw] || bedroomCategoryMap[raw.replace(/\s+/g, "")];
  if (mapped) return pack(mapped[0], mapped[1]);
  if (raw) return undefined;
  const name = product.name || "";
  const compact = name.replace(/\s+/g, "");
  if (compact.includes("دراورمیز")) return pack("vanity", "vanity-drawer");
  if (compact.includes("صندلیمیز")) return pack("vanity", "vanity-chair");
  if (name.includes("قاب آینه")) return pack("vanity", "vanity-mirror");
  if (name.startsWith("دراور")) return pack("drawer", "drawer");
  if (name.startsWith("تخت")) return pack("bed", "bed");
  if (name.startsWith("پاتختی")) return pack("nightstand", "nightstand");
  if (name.startsWith("لاوست")) return pack("loveseat", "loveseat");
  return undefined;
}

export function productMatchesBedroomFamily(product: ShopProduct, familySlug: string) {
  const hit = classifyBedroomProduct(product);
  if (!hit) return false;
  if (familySlug === "makeup-table" || familySlug === "vanity") return hit.family.slug === "vanity";
  if (familySlug === "chair") return hit.type.slug === "vanity-chair";
  if (familySlug === "mirror") return hit.type.slug === "vanity-mirror";
  return hit.family.slug === familySlug;
}

export function productMatchesBedroomType(product: ShopProduct, typeSlug: string) {
  return classifyBedroomProduct(product)?.type.slug === typeSlug;
}

export function getBedroomFamiliesInProducts(products: ShopProduct[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    const family = classifyBedroomProduct(product)?.family;
    if (!family) continue;
    counts.set(family.slug, (counts.get(family.slug) ?? 0) + 1);
  }
  return bedroomFamilies
    .map((family) => ({ family, count: counts.get(family.slug) ?? 0 }))
    .filter((item) => item.count > 0);
}

export function getBedroomTypesInProducts(products: ShopProduct[], familySlug?: string) {
  const vanity = bedroomFamily("vanity");
  const requested = familySlug === "makeup-table" ? "vanity" : familySlug;
  if (!vanity || (requested && requested !== "vanity" && requested !== "all")) return [];
  const scoped = products.filter((product) => classifyBedroomProduct(product)?.family.slug === "vanity");
  return vanity.types
    .map((type) => ({
      type,
      count: scoped.filter((product) => classifyBedroomProduct(product)?.type.slug === type.slug).length,
    }))
    .filter((item) => item.count > 0);
}

const beddingFamilies: ProductFamily[] = [
  { slug: "mattress", label: "تشک", types: [{ slug: "mattress", label: "تشک" }] },
  { slug: "bedspreads", label: "سرویس روتختی", types: [{ slug: "bedspreads", label: "سرویس روتختی" }] },
  { slug: "linen-set", label: "سرویس ملحفه", types: [{ slug: "linen-set", label: "سرویس ملحفه" }] },
  { slug: "blanket", label: "پتو", types: [{ slug: "blanket", label: "پتو" }] },
  { slug: "pillow", label: "بالش", types: [{ slug: "pillow", label: "بالش" }] },
  { slug: "quilt", label: "لحاف", types: [{ slug: "quilt", label: "لحاف" }] },
  { slug: "mattress-protector", label: "محافظ تشک", types: [{ slug: "mattress-protector", label: "محافظ تشک" }] },
];

const beddingCategoryMap: Record<string, string> = {
  "محافظ تشک": "mattress-protector",
  تشک: "mattress",
  "سرویس روتختی": "bedspreads",
  "سرویس ملحفه": "linen-set",
  پتو: "blanket",
  بالش: "pillow",
  لحاف: "quilt",
};

export function classifyBeddingProduct(product: ShopProduct): ProductFamily | undefined {
  const category = (product.category || "").trim();
  const mapped = beddingCategoryMap[category];
  if (mapped) return beddingFamilies.find((family) => family.slug === mapped);
  if (category) return undefined;
  const name = product.name || "";
  if (name.includes("محافظ تشک")) return beddingFamilies.find((family) => family.slug === "mattress-protector");
  if (name.startsWith("تشک")) return beddingFamilies.find((family) => family.slug === "mattress");
  if (name.includes("روتختی")) return beddingFamilies.find((family) => family.slug === "bedspreads");
  if (name.includes("ملحفه")) return beddingFamilies.find((family) => family.slug === "linen-set");
  if (name.startsWith("پتو")) return beddingFamilies.find((family) => family.slug === "blanket");
  if (name.startsWith("بالش")) return beddingFamilies.find((family) => family.slug === "pillow");
  if (name.includes("لحاف")) return beddingFamilies.find((family) => family.slug === "quilt");
  return undefined;
}

export function productMatchesBeddingFamily(product: ShopProduct, familySlug: string) {
  return classifyBeddingProduct(product)?.slug === familySlug;
}

export function getBeddingFamiliesInProducts(products: ShopProduct[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    const family = classifyBeddingProduct(product);
    if (!family) continue;
    counts.set(family.slug, (counts.get(family.slug) ?? 0) + 1);
  }
  return beddingFamilies
    .map((family) => ({ family, count: counts.get(family.slug) ?? 0 }))
    .filter((item) => item.count > 0);
}

const diningFamilies: ProductFamily[] = [
  { slug: "dining-table", label: "میز غذاخوری", types: [{ slug: "dining-table", label: "میز غذاخوری" }] },
  { slug: "dining-chair", label: "صندلی غذاخوری", types: [{ slug: "dining-chair", label: "صندلی غذاخوری" }] },
  { slug: "bar-stool", label: "صندلی کانتر", types: [{ slug: "bar-stool", label: "صندلی کانتر" }] },
  { slug: "dining-dishes", label: "ظروف", types: [{ slug: "dining-dishes", label: "ظروف" }] },
  { slug: "dining-runner", label: "رانر", types: [{ slug: "dining-runner", label: "رانر" }] },
  { slug: "dining-napkin", label: "دستمال سفره", types: [{ slug: "dining-napkin", label: "دستمال سفره" }] },
];

const diningSlugAliases: Record<string, string> = {
  table: "dining-table",
  "dining-table": "dining-table",
  chair: "dining-chair",
  diningchairs: "dining-chair",
  "dining-chair": "dining-chair",
  "bar-stools": "bar-stool",
  "bar-stool": "bar-stool",
  dishes: "dining-dishes",
  "dining-dishes": "dining-dishes",
  runner: "dining-runner",
  napkin: "dining-napkin",
};

export function isDiningTableware(product: ShopProduct) {
  const category = (product.category || "").trim();
  return category === "ظروف" || category === "رانر" || category === "دستمال سفره";
}

const diningCategoryMap: Record<string, string> = {
  "صندلی کانتر": "bar-stool",
  "صندلی غذاخوری": "dining-chair",
  "میز غذاخوری": "dining-table",
  ظروف: "dining-dishes",
  رانر: "dining-runner",
  "دستمال سفره": "dining-napkin",
};

export function classifyDiningProduct(product: ShopProduct): ProductFamily | undefined {
  const category = (product.category || "").trim();
  const pick = (slug: string) => diningFamilies.find((family) => family.slug === slug);
  const mapped = diningCategoryMap[category];
  if (mapped) return pick(mapped);
  if (category) return undefined;
  const name = product.name || "";
  if (name.includes("صندلی کانتر")) return pick("bar-stool");
  if (name.includes("صندلی غذاخوری") || name.startsWith("صندلی")) return pick("dining-chair");
  if (name.includes("میز غذاخوری")) return pick("dining-table");
  if (name.startsWith("رانر")) return pick("dining-runner");
  if (name.includes("دستمال")) return pick("dining-napkin");
  return undefined;
}

export function productMatchesDiningFamily(product: ShopProduct, familySlug: string) {
  const slug = diningSlugAliases[familySlug] ?? familySlug;
  return classifyDiningProduct(product)?.slug === slug;
}

export function getDiningFamiliesInProducts(products: ShopProduct[]) {
  const counts = new Map<string, number>();
  for (const product of products) {
    const family = classifyDiningProduct(product);
    if (!family) continue;
    counts.set(family.slug, (counts.get(family.slug) ?? 0) + 1);
  }
  return diningFamilies
    .map((family) => ({ family, count: counts.get(family.slug) ?? 0 }))
    .filter((item) => item.count > 0);
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
    const lampTypes = lampshadeTypeSlugs(product)
      .map((slug) => typeBySlug.get(slug))
      .filter((type): type is ProductFamilyType => Boolean(type));
    const types = lampTypes.length ? lampTypes : [getProductType(product)].filter((type): type is ProductFamilyType => Boolean(type));
    for (const type of types) {
      const current = counts.get(type.slug);
      counts.set(type.slug, { type, count: (current?.count ?? 0) + 1 });
    }
  }
  const order = familySlug && familySlug !== "all"
    ? productFamilies.find((family) => family.slug === familySlug)?.types.map((type) => type.slug) ?? []
    : productFamilies.flatMap((family) => family.types.map((type) => type.slug));
  return order
    .map((slug) => counts.get(slug))
    .filter((item): item is { type: ProductFamilyType; count: number } => Boolean(item));
}
