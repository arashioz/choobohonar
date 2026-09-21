import type { ShopProduct } from "@/data/products";
import { toFa } from "@/lib/utils";
import {
  classifyAttribute,
  isHeadboardMaterialAttribute,
  isHeadboardTypeAttribute,
  isLengthAttribute,
  isMechanismAttribute,
  isSeatAttribute,
  pricedVariantAttributeNames,
  purchaseAttributeLabel,
  type AttributeRole,
  type AttributeUi,
} from "@/lib/variant-playbook";

export {
  isHeadboardMaterialAttribute,
  isHeadboardTypeAttribute,
  isLengthAttribute,
  isMechanismAttribute,
  isSeatAttribute,
  purchaseAttributeLabel,
};

const CLASSIFICATION_ATTRIBUTE =
  /^(دسته|دسته بندی|دسته‌بندی|category|type|نوع|نوع کالا|گروه|گروه کالا|کالکشن|collection)$/i;
const PRODUCT_TYPE_ATTRIBUTE =
  /^(کاناپه|مبل|ساعت|آباژور|میز|غذاخوری|میز غذاخوری|میز ناهارخوری|تخت|سرویس خواب|فرش|گلیم|لوستر|آینه|بوفه|کنسول|صندلی)$/i;

export function isPurchaseAttribute(
  name: string,
  values: string[] = [],
  product?: Pick<ShopProduct, "category" | "room" | "name">,
  onPricedVariant = false,
) {
  return (
    classifyAttribute(name, values, {
      category: product?.category,
      room: product?.room,
      name: product?.name,
      onPricedVariant,
    }).role === "purchase"
  );
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

function pricedVariants(product: ShopProduct) {
  const priced = enabledVariants(product).filter((variant) => variantPrice(variant) > 0);
  return priced.length ? priced : enabledVariants(product);
}

function optionValuesEqual(left?: string, right?: string) {
  if (!left || !right) return false;
  const a = normalizeToken(left);
  const b = normalizeToken(right);
  return Boolean(a) && a === b;
}

function normalizeToken(value: string) {
  return latinDigits(value)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function variantHasOption(variant: ProductVariant, attributeName: string, optionLabel: string) {
  return variant.options.some(
    (option) => optionValuesEqual(option.name, attributeName) && optionValuesEqual(option.value, optionLabel),
  );
}

function isPrimaryPurchaseAttribute(attribute: PurchaseAttribute) {
  return attribute.role === "purchase";
}

export function getHighestPricedVariant(product: ShopProduct) {
  return pricedVariants(product).reduce<ProductVariant | undefined>((highest, variant) => {
    if (!highest || variantPrice(variant) > variantPrice(highest)) return variant;
    return highest;
  }, undefined);
}

export function getOptionPrice(product: ShopProduct, attributeName: string, optionLabel: string) {
  const prices = pricedVariants(product)
    .filter((variant) => variantHasOption(variant, attributeName, optionLabel))
    .map(variantPrice)
    .filter((price) => price > 0);
  return prices.length ? Math.max(...prices) : 0;
}

export type PurchaseAttribute = {
  id: string;
  label: string;
  role: AttributeRole;
  ui: AttributeUi;
  options: { id: string; label: string; default: boolean; price: number }[];
};

function sortOptionsForDisplay(attribute: PurchaseAttribute) {
  const options = [...attribute.options];
  const magnitudes = options.map((option) => optionMagnitude(option.label));
  const hasMagnitudeScale = magnitudes.filter((value) => value > 0).length >= 2;
  const hasPriceScale = new Set(options.map((option) => option.price).filter((price) => price > 0)).size >= 2;

  return options.sort((left, right) => {
    const leftMagnitude = optionMagnitude(left.label);
    const rightMagnitude = optionMagnitude(right.label);
    if (hasMagnitudeScale && leftMagnitude !== rightMagnitude) return rightMagnitude - leftMagnitude;
    if (hasPriceScale && left.price !== right.price) return right.price - left.price;
    if (leftMagnitude !== rightMagnitude) return rightMagnitude - leftMagnitude;
    return right.price - left.price;
  });
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

function isWoodHeadboardType(label: string) {
  return /چوب|wood/i.test(label);
}

function isFabricHeadboardType(label: string) {
  return /پارچه|fabric/i.test(label);
}

function pairHeadboardMaterialOption(typeLabel: string | undefined, material: PurchaseAttribute) {
  if (!typeLabel) return undefined;
  const woodMaterial = (option: PurchaseAttribute["options"][number]) => /گردو|walnut|^چوب$|wood/i.test(option.label);
  const fabricMaterial = (option: PurchaseAttribute["options"][number]) => /کاپری|capri|پارچه|fabric/i.test(option.label);
  if (isWoodHeadboardType(typeLabel)) return material.options.find(woodMaterial) || material.options.find((option) => !fabricMaterial(option));
  if (isFabricHeadboardType(typeLabel)) return material.options.find(fabricMaterial) || material.options.find((option) => !woodMaterial(option));
  return undefined;
}

export function headboardMaterialLabel(value: string) {
  if (/گردو|walnut|^چوب$|wood/i.test(value)) return "رنگ";
  return "پارچه";
}

function applyLinkedHeadboard(
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
  changedId?: string,
) {
  const type = attributes.find((attribute) => isHeadboardTypeAttribute(attribute.label, attribute.options.map((option) => option.label)));
  const material = attributes.find((attribute) => isHeadboardMaterialAttribute(attribute.label));
  if (!type || !material) return selected;
  if (changedId && changedId !== type.id && changedId !== material.id) return selected;

  const next = { ...selected };
  const typeLabel = type.options.find((option) => option.id === next[type.id])?.label;
  const paired = pairHeadboardMaterialOption(typeLabel, material);
  if (paired) next[material.id] = paired.id;
  return next;
}

function applyLinkedDimensions(
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
  changedId?: string,
) {
  const linked = applyLinkedHeadboard(attributes, selected, changedId);
  const size = attributes.find((attribute) => isSizeAttribute(attribute.label));
  const length = attributes.find((attribute) => isLengthAttribute(attribute.label));
  if (!size || !length) return linked;

  const next = { ...linked };
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

function optionHasPricedVariant(product: ShopProduct, attributeName: string, optionLabel: string) {
  return pricedVariants(product).some(
    (variant) => variantHasOption(variant, attributeName, optionLabel) && variantPrice(variant) > 0,
  );
}

function productHint(product: ShopProduct) {
  return { category: product.category, room: product.room, name: product.name };
}

function classifyProductAttribute(product: ShopProduct, name: string, values: string[], onPricedVariant: boolean) {
  return classifyAttribute(name, values, { ...productHint(product), onPricedVariant });
}

export function getProductAttributeOptions(product: ShopProduct): PurchaseAttribute[] {
  const pricedNames = pricedVariantAttributeNames(product.variants);
  const attributes: PurchaseAttribute[] = [];

  for (const attribute of product.attributes) {
    const values = attribute.terms.map((term) => term.name);
    if (!values.length) continue;
    const classified = classifyProductAttribute(
      product,
      attribute.name,
      values,
      pricedNames.has(normalizeToken(attribute.name)),
    );
    if (classified.role === "ignore") continue;
    attributes.push({
      id: attribute.taxonomy || String(attribute.id),
      label: attribute.name,
      role: classified.role,
      ui: classified.ui,
      options: attribute.terms.map((term) => ({
        id: term.slug,
        label: term.name,
        default: term.default,
        price: getOptionPrice(product, attribute.name, term.name),
      })),
    });
  }

  for (const variant of pricedVariants(product)) {
    for (const option of variant.options) {
      const siblingValues = variant.options.filter((entry) => entry.name === option.name).map((entry) => entry.value);
      if (!option.value) continue;
      const classified = classifyProductAttribute(product, option.name, siblingValues, true);
      if (classified.role === "ignore") continue;
      let attribute = attributes.find((item) => item.label === option.name);
      if (!attribute) {
        attribute = { id: option.name, label: option.name, role: "purchase", ui: "pills", options: [] };
        attributes.push(attribute);
      } else {
        attribute.role = "purchase";
        attribute.ui = "pills";
      }
      if (!attribute.options.some((item) => optionValuesEqual(item.label, option.value) || optionValuesEqual(item.id, option.value))) {
        attribute.options.push({
          id: option.value,
          label: option.value,
          default: false,
          price: variantPrice(variant),
        });
      }
    }
  }

  return attributes
    .map((attribute) => ({
      ...attribute,
      options: sortOptionsForDisplay({
        ...attribute,
        options: attribute.options.filter((option) => {
          if (attribute.role !== "purchase") return true;
          return optionHasPricedVariant(product, attribute.label, option.label);
        }),
      }),
    }))
    .filter((attribute) => attribute.options.length > 0)
    .sort((left, right) => purchaseAttributePriority(left) - purchaseAttributePriority(right));
}

function purchaseAttributePriority(attribute: PurchaseAttribute) {
  const values = attribute.options.map((option) => option.label);
  if (isSeatAttribute(attribute.label, values)) return 0;
  if (isMechanismAttribute(attribute.label, values)) return 1;
  if (isSizeAttribute(attribute.label)) return 2;
  if (isHeadboardTypeAttribute(attribute.label, values)) return 3;
  if (isHeadboardMaterialAttribute(attribute.label)) return 4;
  if (attribute.role === "purchase") return 5;
  if (attribute.role === "linked") return 6;
  return 7;
}

export function isOptionCompatibleWithSelection(
  product: ShopProduct,
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
  attributeId: string,
  optionId: string,
) {
  const attribute = attributes.find((item) => item.id === attributeId);
  if (!attribute || attribute.role !== "purchase") return true;
  const variants = enabledVariants(product);
  if (!variants.length) return true;
  const appearsOnVariants = variants.some((variant) =>
    variant.options.some((option) => optionValuesEqual(option.name, attribute.label)),
  );
  if (!appearsOnVariants) return true;
  const next = { ...selected, [attributeId]: optionId };
  return Boolean(variantMatchingSelection(product, attributes, next));
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
    const match = variant?.options.find((option) => optionValuesEqual(option.name, attribute.label));
    selected[attribute.id] =
      attribute.options.find((option) => optionValuesEqual(option.label, match?.value))?.id
      || "";
  }
  for (const attribute of attributes) {
    if (!selected[attribute.id]) selected[attribute.id] = attribute.options[0]?.id || "";
  }
  return applyLinkedDimensions(attributes, selected);
}

function selectedLabelFor(attribute: PurchaseAttribute | undefined, selected: Record<string, string>) {
  if (!attribute) return undefined;
  return attribute.options.find((item) => item.id === selected[attribute.id])?.label;
}

function variantMatchScore(
  variant: ProductVariant,
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
) {
  const options = variant.options.filter((option) => option.value?.trim());
  if (!options.length) return 0;

  let score = 0;
  for (const option of options) {
    const attribute = attributes.find((item) => optionValuesEqual(item.label, option.name));
    if (!attribute) continue;
    const current = selectedLabelFor(attribute, selected);
    if (!current) continue;
    if (optionValuesEqual(current, option.value)) {
      score += isPrimaryPurchaseAttribute(attribute) ? 10 : 1;
      continue;
    }
    if (isPrimaryPurchaseAttribute(attribute)) return null;
  }
  return score;
}

export function variantMatchingSelection(
  product: ShopProduct,
  attributes: PurchaseAttribute[],
  selected: Record<string, string>,
) {
  const ranked = pricedVariants(product)
    .filter((variant) => variant.options.some((option) => option.value?.trim()) || pricedVariants(product).every((item) => !item.options.some((option) => option.value?.trim())))
    .map((variant) => ({ variant, score: variantMatchScore(variant, attributes, selected) }))
    .filter((entry): entry is { variant: ProductVariant; score: number } => entry.score !== null)
    .sort((left, right) => right.score - left.score || variantPrice(right.variant) - variantPrice(left.variant));

  const bestScore = ranked[0]?.score ?? -1;
  const top = ranked.filter((entry) => entry.score === bestScore);
  if (top.length <= 1) return top[0]?.variant;

  const primary = attributes.filter(isPrimaryPurchaseAttribute);
  const primaryMatch = top.find((entry) =>
    primary.every((attribute) => {
      const current = selectedLabelFor(attribute, selected);
      if (!current) return true;
      const onVariant = entry.variant.options.some((option) => optionValuesEqual(option.name, attribute.label));
      if (!onVariant) return true;
      return variantHasOption(entry.variant, attribute.label, current);
    }),
  );
  return primaryMatch?.variant || top[0]?.variant;
}

export function formatSelectedCatalogPrice(
  product: Pick<ShopProduct, "prices" | "variants">,
  variant?: ProductVariant,
) {
  const amount = variant ? variantPrice(variant) : 0;
  if (amount) return formatMoney(amount, product.prices?.currencySymbol || "تومان");
  return formatCatalogPrice(product);
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
  if (attribute.role !== "purchase") {
    return applyLinkedDimensions(attributes, { ...selected, [attributeId]: optionId }, attributeId);
  }

  const candidates = pricedVariants(product).filter((variant) =>
    variantHasOption(variant, attribute.label, option.label),
  );
  if (!candidates.length) {
    return applyLinkedDimensions(attributes, { ...selected, [attributeId]: optionId }, attributeId);
  }

  const others = attributes.filter((item) => item.id !== attributeId && item.role === "purchase");
  const ranked = [...candidates].sort((left, right) => {
    const score = (variant: ProductVariant) =>
      others.reduce((total, item) => {
        const currentLabel = item.options.find((entry) => entry.id === selected[item.id])?.label;
        const matches = variantHasOption(variant, item.label, currentLabel || "");
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

export type VariantPriceIssue = {
  slug: string;
  name: string;
  category: string;
  kind: "unmatched-selection" | "price-stuck";
  detail: string;
};

export function debugVariantPriceFlow(product: ShopProduct): VariantPriceIssue[] {
  const issues: VariantPriceIssue[] = [];
  const attributes = getProductAttributeOptions(product).filter((attribute) => attribute.role === "purchase");
  const priced = pricedVariants(product).filter((variant) => variantPrice(variant) > 0);
  const allAttributes = getProductAttributeOptions(product);
  let selected = selectionFromVariant(allAttributes, getHighestPricedVariant(product));

  for (const attribute of attributes) {
    const seenPrices = new Set<number>();
    for (const option of attribute.options) {
      selected = selectionForAttributeOption(product, allAttributes, selected, attribute.id, option.id);
      const matched = variantMatchingSelection(product, allAttributes, selected);
      const amount = matched ? variantPrice(matched) : 0;
      if (!amount) {
        issues.push({
          slug: product.slug,
          name: product.name,
          category: product.category,
          kind: "unmatched-selection",
          detail: `${attribute.label}=${option.label}`,
        });
        continue;
      }
      seenPrices.add(amount);
    }

    const variantPrices = new Set(
      priced
        .filter((variant) => variant.options.some((option) => optionValuesEqual(option.name, attribute.label)))
        .map(variantPrice)
        .filter((price) => price > 0),
    );
    if (isPrimaryPurchaseAttribute(attribute) && variantPrices.size >= 2 && seenPrices.size < 2) {
      issues.push({
        slug: product.slug,
        name: product.name,
        category: product.category,
        kind: "price-stuck",
        detail: attribute.label,
      });
    }
  }

  return issues;
}
