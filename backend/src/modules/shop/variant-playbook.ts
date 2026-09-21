/** Category playbooks for storefront variants. Keep in sync with frontend/src/lib/variant-playbook.ts */

export type AttributeRole = "purchase" | "display" | "linked" | "ignore";
export type AttributeUi = "pills" | "readonly" | "swatch";
export type PlaybookFamily =
  | "sofa"
  | "bed"
  | "dining-table"
  | "dining-chair"
  | "cabinet"
  | "coffee-table"
  | "bedding"
  | "carpet"
  | "lighting"
  | "decor"
  | "default";

export type AttributeKind =
  | "seat"
  | "mechanism"
  | "size"
  | "length"
  | "headboard-type"
  | "headboard-material"
  | "wood"
  | "fabric"
  | "cushion"
  | "color"
  | "height"
  | "form"
  | "chair-type"
  | "clock-type"
  | "collection"
  | "classification"
  | "other";

export type ProductHint = {
  category?: string;
  room?: string;
  name?: string;
  onPricedVariant?: boolean;
};

const CLASSIFICATION =
  /^(دسته|دسته بندی|دسته‌بندی|category|type|نوع|نوع کالا|گروه|گروه کالا|کالکشن|collection)$/i;
const PRODUCT_TYPE =
  /^(کاناپه|مبل|ساعت|آباژور|میز|غذاخوری|میز غذاخوری|میز ناهارخوری|تخت|سرویس خواب|فرش|گلیم|لوستر|آینه|بوفه|کنسول|صندلی)$/i;

const SEAT_VALUE = /^(یک|دو|سه|چهار|پنج|شش|هفت|هشت|نه|ده|یازده|دوازده|\d+)\s*(نفره|seat|seater)$/i;
const MECHANISM_VALUE = /مکانیزم/;

const FAMILY_PLAN: Record<PlaybookFamily, Partial<Record<AttributeKind, Exclude<AttributeRole, "ignore">>>> = {
  sofa: { seat: "purchase", mechanism: "purchase", wood: "display", fabric: "display", cushion: "display" },
  bed: {
    size: "purchase",
    "headboard-type": "purchase",
    "headboard-material": "linked",
    wood: "display",
  },
  "dining-table": { seat: "purchase", size: "purchase", wood: "display" },
  "dining-chair": { "chair-type": "purchase", wood: "display", fabric: "display" },
  cabinet: { size: "purchase", wood: "display" },
  "coffee-table": { size: "purchase", form: "purchase", wood: "display" },
  bedding: { size: "purchase", color: "display" },
  carpet: { size: "purchase", color: "display" },
  lighting: { size: "purchase", height: "purchase", color: "display", wood: "display" },
  decor: { color: "purchase", "clock-type": "purchase", wood: "display" },
  default: {
    seat: "purchase",
    mechanism: "purchase",
    size: "purchase",
    "headboard-type": "purchase",
    "headboard-material": "linked",
    wood: "display",
    fabric: "display",
    cushion: "display",
  },
};

export function normalizePlaybookToken(value: string) {
  return value
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isLengthAttribute(name: string) {
  return /^(طول|length)$/i.test(name.trim());
}

export function isSeatAttribute(name: string, values: string[] = []) {
  const label = name.trim();
  if (/^(ظرفیت|نفره|seats?|seater)$/i.test(label)) return true;
  return values.some((value) => SEAT_VALUE.test(value.trim()));
}

export function isMechanismAttribute(name: string, values: string[] = []) {
  const label = name.trim();
  if (values.some((value) => MECHANISM_VALUE.test(value.trim()))) return true;
  return /^(مکانیزم|canape)$/i.test(label);
}

export function isHeadboardTypeAttribute(name: string, values: string[] = []) {
  const label = name.trim();
  if (/^(سرتخت|headbord|headboard)$/i.test(label)) return false;
  if (/نوع\s*سرتخت|headboard\s*type|headboardtype/i.test(label)) return true;
  return values.length >= 2 && values.every((value) => /^(چوب|پارچه|wood|fabric)$/i.test(value.trim()));
}

export function isHeadboardMaterialAttribute(name: string) {
  const label = name.trim();
  if (/نوع\s*سرتخت|headboard\s*type|headboardtype/i.test(label)) return false;
  return /^(سرتخت|headbord|headboard)$/i.test(label);
}

export function isWoodAttribute(name: string, values: string[] = []) {
  if (isHeadboardTypeAttribute(name, values) || isHeadboardMaterialAttribute(name)) return false;
  return /^(چوب|متریال|پرداخت|فینیش|رویه|wood|material|finish)$/i.test(name.trim());
}

export function isFabricAttribute(name: string) {
  return /^(پارچه|رویه پارچه|fabric)$/i.test(name.trim());
}

export function isCushionAttribute(name: string) {
  return /کوسن|cushion/i.test(name.trim());
}

export function resolvePlaybookFamily(hint: ProductHint = {}): PlaybookFamily {
  const hay = normalizePlaybookToken([hint.category, hint.name].filter(Boolean).join(" "));
  if (/تخت/.test(hay) && !/روتخت|ملحفه|تشک/.test(hay)) return "bed";
  if (/کاناپه|مبل ال|مبل تک|sofa/.test(hay)) return "sofa";
  if (/صندلی غذا|صندلی ناهار/.test(hay)) return "dining-chair";
  if (/میز غذا|میز ناهار/.test(hay)) return "dining-table";
  if (/تلویزیون|بوفه|کمد بار|ویترین|بار.?ایستاده/.test(hay)) return "cabinet";
  if (/جلو مبلی|عسلی/.test(hay)) return "coffee-table";
  if (/فرش|گلیم/.test(hay) || hint.room === "carpet") return "carpet";
  if (/تشک|روتخت|ملحفه|پتو|بالش/.test(hay) || hint.room === "bedding") return "bedding";
  if (/آباژور|آویز|لوستر|چراغ/.test(hay) || hint.room === "lighting") return "lighting";
  if (hint.room === "decor" || /دکور|ساعت|آینه/.test(hay)) return "decor";
  return "default";
}

export function attributeKind(name: string, values: string[] = []): AttributeKind {
  const label = name.trim();
  if (/^کالکشن$/i.test(label)) return "collection";
  if (CLASSIFICATION.test(label)) return "classification";
  if (isLengthAttribute(label)) return "length";
  if (isHeadboardTypeAttribute(label, values)) return "headboard-type";
  if (isHeadboardMaterialAttribute(label)) return "headboard-material";
  if (isSeatAttribute(label, values)) return "seat";
  if (isMechanismAttribute(label, values)) return "mechanism";
  if (isWoodAttribute(label, values)) return "wood";
  if (isFabricAttribute(label)) return "fabric";
  if (isCushionAttribute(label)) return "cushion";
  if (/^(سایز|اندازه|size)$/i.test(label)) return "size";
  if (/^(رنگ|color)$/i.test(label)) return "color";
  if (/^(ارتفاع|height)$/i.test(label)) return "height";
  if (/^(فرم|شکل|form)$/i.test(label)) return "form";
  if (/نوع\s*صندلی|chair\s*type/i.test(label)) return "chair-type";
  if (/نوع\s*ساعت|clock/i.test(label)) return "clock-type";
  // WooCommerce sometimes names the capacity axis after the product itself,
  // e.g. «کاناپه: دو نفره / سه نفره». It is a purchase axis, not a category.
  if (PRODUCT_TYPE.test(label)) return "classification";
  return "other";
}

export function classifyAttribute(name: string, values: string[] = [], hint: ProductHint = {}) {
  const kind = attributeKind(name, values);
  const family = resolvePlaybookFamily(hint);

  if (kind === "collection" || kind === "classification") {
    return { role: "ignore" as const, ui: "readonly" as const, kind, family };
  }

  if (kind === "headboard-material") {
    return { role: "linked" as const, ui: "readonly" as const, kind, family };
  }

  if (hint.onPricedVariant) {
    return { role: "purchase" as const, ui: "pills" as const, kind, family };
  }

  const planned = FAMILY_PLAN[family][kind] || FAMILY_PLAN.default[kind];
  if (planned) {
    return { role: planned, ui: uiFor(planned, kind, values), kind, family };
  }

  if (kind === "length") {
    return { role: "ignore" as const, ui: "readonly" as const, kind, family };
  }

  if (values.some((value) => value.trim())) {
    return { role: "display" as const, ui: uiFor("display", kind, values), kind, family };
  }

  return { role: "ignore" as const, ui: "readonly" as const, kind, family };
}

function uiFor(role: Exclude<AttributeRole, "ignore">, kind: AttributeKind, values: string[]): AttributeUi {
  if (role === "linked") return "readonly";
  if (role === "purchase") return "pills";
  if (kind === "wood") return "swatch";
  return values.filter((value) => value.trim()).length > 1 ? "pills" : "readonly";
}

export function pricedVariantAttributeNames(
  variants: { enabled?: boolean; price?: number; options?: { name?: string }[] }[] = [],
) {
  const names = new Set<string>();
  for (const variant of variants) {
    if (variant.enabled === false) continue;
    const price = Number(variant.price);
    if (!(Number.isFinite(price) && price > 0)) continue;
    for (const option of variant.options || []) {
      if (option.name) names.add(normalizePlaybookToken(option.name));
    }
  }
  return names;
}

type PresentableProduct = {
  category?: string;
  room?: string;
  name?: string;
  attributes?: { name: string; values: string[]; required?: boolean; role?: AttributeRole; ui?: AttributeUi }[];
  variants?: { enabled?: boolean; price?: number; options?: { name?: string; value?: string }[] }[];
};

export function presentShopProduct<T extends PresentableProduct>(product: T): T {
  const pricedNames = pricedVariantAttributeNames(product.variants);
  const hint = { category: product.category, room: product.room, name: product.name };
  const attributes = (product.attributes || []).map((attribute) => {
    const classified = classifyAttribute(attribute.name, attribute.values || [], {
      ...hint,
      onPricedVariant: pricedNames.has(normalizePlaybookToken(attribute.name)),
    });
    return {
      ...attribute,
      role: classified.role,
      ui: classified.ui,
    };
  });
  return { ...product, attributes };
}
