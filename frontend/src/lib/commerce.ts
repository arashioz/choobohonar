import type { ShopProduct } from "@/data/products";
import { toFa } from "@/lib/utils";

const CLASSIFICATION_ATTRIBUTE =
  /^(دسته|دسته بندی|دسته‌بندی|category|type|نوع|نوع کالا|گروه|گروه کالا|کالکشن|collection)$/i;
const PRODUCT_TYPE_ATTRIBUTE =
  /^(کاناپه|مبل|ساعت|آباژور|میز|غذاخوری|میز غذاخوری|میز ناهارخوری|تخت|سرویس خواب|فرش|گلیم|لوستر|آینه|بوفه|کنسول|صندلی)$/i;
const PURCHASE_ATTRIBUTE =
  /سایز|اندازه|طول|عرض|ارتفاع|عمق|ابعاد|رنگ|پرداخت|فینیش|چوب|رویه|پارچه|size|length|width|height|depth|color|finish|material/i;

export function isLengthAttribute(name: string) {
  return /^(طول|length)$/i.test(name.trim());
}

const SEAT_VALUE = /^(یک|دو|سه|چهار|پنج|شش|هفت|هشت|نه|ده|یازده|دوازده|\d+)\s*(نفره|seat|seater)$/i;

export function isSeatAttribute(name: string, values: string[] = []) {
  const label = name.trim();
  if (/^(ظرفیت|نفره|seats?|seater)$/i.test(label)) return true;
  return values.some((value) => SEAT_VALUE.test(value.trim()));
}

export function purchaseAttributeLabel(name: string, values: string[] = []) {
  return isSeatAttribute(name, values) ? "ظرفیت" : name.trim();
}

export function isPurchaseAttribute(name: string, values: string[] = []) {
  const label = name.trim();
  if (!label || isLengthAttribute(label)) return false;
  if (isSeatAttribute(label, values)) return true;
  if (CLASSIFICATION_ATTRIBUTE.test(label) || PRODUCT_TYPE_ATTRIBUTE.test(label)) return false;
  return PURCHASE_ATTRIBUTE.test(label);
}

export function isCollectionAttribute(name: string, taxonomy?: string | null) {
  return taxonomy === "pa_collection" || /^کالکشن$/i.test(name.trim());
}

type ProductVariant = NonNullable<ShopProduct["variants"]>[number];

function enabledVariants(product: ShopProduct) {
  return (product.variants || []).filter((variant) => variant.enabled !== false);
}

function variantPrice(variant: ProductVariant) {
  const price = Number(variant.price);
  return Number.isFinite(price) && price > 0 ? price : 0;
}

export function getHighestPricedVariant(product: ShopProduct) {
  return enabledVariants(product).reduce<ProductVariant | undefined>((highest, variant) => {
    if (!highest || variantPrice(variant) > variantPrice(highest)) return variant;
    return highest;
  }, undefined);
}

export function getOptionPrice(product: ShopProduct, attributeName: string, optionLabel: string) {
  const prices = enabledVariants(product)
    .filter((variant) => variant.options.some((option) => option.name === attributeName && option.value === optionLabel))
    .map(variantPrice)
    .filter((price) => price > 0);
  return prices.length ? Math.max(...prices) : 0;
}

export type PurchaseAttribute = {
  id: string;
  label: string;
  options: { id: string; label: string; default: boolean; price: number }[];
};

function sortOptionsByPrice<T extends { price: number }>(options: T[]) {
  return [...options].sort((left, right) => right.price - left.price);
}

function sortOptionsForDisplay(attribute: PurchaseAttribute) {
  if (isSizeAttribute(attribute.label) || isLengthAttribute(attribute.label)) {
    return [...attribute.options].sort((left, right) => optionMagnitude(right.label) - optionMagnitude(left.label));
  }
  return sortOptionsByPrice(attribute.options);
}

const SEAT_WORDS: Record<string, number> = {
  یک: 1,
  دو: 2,
  سه: 3,
  چهار: 4,
  پنج: 5,
  شش: 6,
  هفت: 7,
  هشت: 8,
  نه: 9,
  ده: 10,
  یازده: 11,
  دوازده: 12,
};

function latinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function optionMagnitude(label: string) {
  const text = latinDigits(label);
  const seatWord = text.match(/یک|دو|سه|چهار|پنج|شش|هفت|هشت|نه|ده|یازده|دوازده/);
  if (seatWord) return SEAT_WORDS[seatWord[0]] ?? 0;
  const numbers = text.match(/\d+/g)?.map(Number).filter((value) => Number.isFinite(value)) ?? [];
  if (!numbers.length) return 0;
  return numbers.length === 1 ? numbers[0] : (numbers[0] + numbers[1]) / 2;
}

function isSizeAttribute(label: string) {
  return /^(سایز|اندازه|size|ظرفیت)$/i.test(label.trim()) || isSeatAttribute(label);
}

function pairOptionsByMagnitude(from: PurchaseAttribute, to: PurchaseAttribute) {
  const source = [...from.options].sort((left, right) => optionMagnitude(left.label) - optionMagnitude(right.label));
  const target = [...to.options].sort((left, right) => optionMagnitude(left.label) - optionMagnitude(right.label));
  const pairs = new Map<string, string>();
  if (!source.length || !target.length) return pairs;
  source.forEach((option, index) => {
    const progress = source.length === 1 ? 0 : index / (source.length - 1);
    const targetIndex = Math.round(progress * (target.length - 1));
    pairs.set(option.id, target[targetIndex].id);
  });
  return pairs;
}

function applyLinkedDimensions(
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
  changedId?: string,
) {
  const size = attributes.find((attribute) => isSizeAttribute(attribute.label));
  const length = attributes.find((attribute) => isLengthAttribute(attribute.label));
  if (!size || !length) return selected;

  const next = { ...selected };
  if (!changedId || changedId === size.id) {
    const paired = pairOptionsByMagnitude(size, length).get(next[size.id]);
    if (paired) next[length.id] = paired;
  }
  if (changedId === length.id) {
    const paired = pairOptionsByMagnitude(length, size).get(next[length.id]);
    if (paired) next[size.id] = paired;
  }
  return next;
}

export function getCatalogHighestPrice(product: Pick<ShopProduct, "prices" | "variants">): number {
  const fromVariants = enabledVariants(product as ShopProduct).map(variantPrice).filter((value) => value > 0);
  const listed = [product.prices?.maxValue, product.prices?.value, product.prices?.regularValue]
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0);
  return Math.max(0, ...listed, ...fromVariants);
}

export function formatCatalogPrice(product: Pick<ShopProduct, "prices" | "variants">): string {
  const amount = getCatalogHighestPrice(product);
  if (!amount) return "استعلام قیمت";
  return formatMoney(amount, product.prices?.currencySymbol || "تومان");
}

export function getCollectionName(product: ShopProduct): string | null {
  const attribute = product.attributes.find(
    (item) => item.taxonomy === "pa_collection" || item.name === "کالکشن",
  );
  return attribute?.terms[0]?.name ?? null;
}

export function getProductAttributeOptions(product: ShopProduct): PurchaseAttribute[] {
  const attributes = product.attributes
    .filter((attribute) => attribute.terms.length > 0 && isPurchaseAttribute(attribute.name, attribute.terms.map((term) => term.name)))
    .map((attribute) => ({
      id: attribute.taxonomy || String(attribute.id),
      label: attribute.name,
      options: attribute.terms.map((term) => ({
        id: term.slug,
        label: term.name,
        default: term.default,
        price: getOptionPrice(product, attribute.name, term.name),
      })),
    }));

  for (const variant of enabledVariants(product)) {
    for (const option of variant.options) {
      const siblingValues = variant.options.filter((entry) => entry.name === option.name).map((entry) => entry.value);
      if (!isPurchaseAttribute(option.name, siblingValues) || !option.value) continue;
      let attribute = attributes.find((item) => item.label === option.name);
      if (!attribute) {
        attribute = { id: option.name, label: option.name, options: [] };
        attributes.push(attribute);
      }
      if (!attribute.options.some((item) => item.label === option.value || item.id === option.value)) {
        attribute.options.push({
          id: option.value,
          label: option.value,
          default: false,
          price: variantPrice(variant),
        });
      }
    }
  }

  return attributes.map((attribute) => ({
    ...attribute,
    options: sortOptionsForDisplay(attribute),
  }));
}

export function getCraftAttributes(product: ShopProduct) {
  const seen = new Set<string>();
  return product.attributes.filter((attribute) => {
    if (CLASSIFICATION_ATTRIBUTE.test(attribute.name.trim()) && !isCollectionAttribute(attribute.name, attribute.taxonomy)) {
      return false;
    }
    if (PRODUCT_TYPE_ATTRIBUTE.test(attribute.name.trim())) return false;
    const key = isCollectionAttribute(attribute.name, attribute.taxonomy) ? "collection" : attribute.name.trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

export function selectionFromVariant(attributes: PurchaseAttribute[], variant?: ProductVariant) {
  const selected: Record<string, string> = {};
  for (const attribute of attributes) {
    const match = variant?.options.find((option) => option.name === attribute.label);
    selected[attribute.id] =
      attribute.options.find((option) => option.label === match?.value)?.id
      || "";
  }
  for (const attribute of attributes) {
    if (!selected[attribute.id]) selected[attribute.id] = attribute.options[0]?.id || "";
  }
  return applyLinkedDimensions(attributes, selected);
}

export function variantMatchingSelection(
  product: ShopProduct,
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
) {
  return enabledVariants(product).find((variant) =>
    variant.options.every((option) => {
      const attribute = attributes.find((item) => item.label === option.name);
      if (!attribute) return true;
      return attribute.options.find((item) => item.id === selected[attribute.id])?.label === option.value;
    }),
  );
}

export function selectionForAttributeOption(
  product: ShopProduct,
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
  attributeId: string,
  optionId: string,
) {
  const attribute = attributes.find((item) => item.id === attributeId);
  const option = attribute?.options.find((item) => item.id === optionId);
  if (!attribute || !option) return { ...selected, [attributeId]: optionId };

  const candidates = enabledVariants(product).filter((variant) =>
    variant.options.some((entry) => entry.name === attribute.label && entry.value === option.label),
  );
  if (!candidates.length) {
    return applyLinkedDimensions(attributes, { ...selected, [attributeId]: optionId }, attributeId);
  }

  const others = attributes.filter((item) => item.id !== attributeId);
  const ranked = [...candidates].sort((left, right) => {
    const score = (variant: ProductVariant) =>
      others.reduce((total, item) => {
        const currentLabel = item.options.find((entry) => entry.id === selected[item.id])?.label;
        const matches = variant.options.some((entry) => entry.name === item.label && entry.value === currentLabel);
        return total + (matches ? 1 : 0);
      }, 0);
    return score(right) - score(left) || variantPrice(right) - variantPrice(left);
  });

  return applyLinkedDimensions(
    attributes,
    { ...selectionFromVariant(attributes, ranked[0]), [attributeId]: optionId },
    attributeId,
  );
}

export function formatProductCount(value: number): string {
  return `${toFa(value)} محصول`;
}

export function formatMoney(value: number, currencySymbol = "تومان"): string {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} ${currencySymbol}`;
}
