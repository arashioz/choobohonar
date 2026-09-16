import type { ProductRoom, ShopProduct } from "@/data/products";
import { toFa } from "@/lib/utils";

export type DeliveryLeadKind = "manufactured" | "accessory" | "bedding";

export type DeliveryLeadTime = {
  kind: DeliveryLeadKind;
  days: number;
  unit: "calendar" | "business";
  label: string;
  detail: string;
};

const ACCESSORY_ROOMS = new Set<ProductRoom>(["lighting", "carpet", "dishes", "decor"]);

const BEDDING_SLUGS = new Set([
  "bedding",
  "mattress",
  "bedspreads",
  "linen-set",
  "blanket",
  "pillow",
]);

const ACCESSORY_SLUGS = new Set(["accessory"]);

const BEDDING_CATEGORY =
  /تشک|روتختی|ملحفه|بالش|پتو|لحاف|کالای\s*خواب|محافظ\s*تشک/;

function categoryTerms(product: Pick<ShopProduct, "category" | "categories">) {
  return [
    product.category,
    ...(product.categories ?? []).flatMap((item) => [item.slug, item.name]),
  ]
    .filter(Boolean)
    .map((value) => value.trim());
}

function isBeddingProduct(product: Pick<ShopProduct, "room" | "category" | "categories">) {
  if (product.room === "bedding") return true;
  return categoryTerms(product).some(
    (term) => BEDDING_SLUGS.has(term) || BEDDING_CATEGORY.test(term),
  );
}

function isAccessoryProduct(product: Pick<ShopProduct, "room" | "category" | "categories">) {
  if (ACCESSORY_ROOMS.has(product.room)) return true;
  return categoryTerms(product).some(
    (term) => ACCESSORY_SLUGS.has(term) || term === "اکسسوری",
  );
}

export function getProductDeliveryLeadTime(
  product: Pick<ShopProduct, "room" | "category" | "categories">,
): DeliveryLeadTime {
  if (isBeddingProduct(product)) {
    return {
      kind: "bedding",
      days: 10,
      unit: "business",
      label: `${toFa(10)} روز کاری`,
      detail: "کالای خواب و تشک",
    };
  }

  if (isAccessoryProduct(product)) {
    return {
      kind: "accessory",
      days: 3,
      unit: "business",
      label: `${toFa(3)} روز کاری`,
      detail: "اکسسوری",
    };
  }

  return {
    kind: "manufactured",
    days: 35,
    unit: "calendar",
    label: `${toFa(35)} روز تقویمی`,
    detail: "محصولات تولیدی",
  };
}
