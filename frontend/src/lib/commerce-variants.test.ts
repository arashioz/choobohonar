import assert from "node:assert/strict";
import test from "node:test";
import type { ShopProduct } from "../data/products";
import {
  debugVariantPriceFlow,
  getProductAttributeOptions,
  selectionForAttributeOption,
  selectionFromVariant,
  getHighestPricedVariant,
  variantMatchingSelection,
} from "./commerce";

function product(partial: Pick<ShopProduct, "slug" | "name" | "category" | "attributes" | "variants"> & Partial<Pick<ShopProduct, "room">>): ShopProduct {
  return {
    kind: "catalog",
    id: 1,
    room: "bedroom",
    shortDescription: "",
    image: "",
    gallery: [],
    categories: [],
    prices: { value: "207000000", regularValue: "207000000", saleValue: null, minValue: "150500000", maxValue: "207000000", currencyCode: "IRR", currencySymbol: "تومان", minorUnit: 0 },
    averageRating: "0",
    reviewCount: 0,
    isPurchasable: true,
    isInStock: true,
    hasOptions: true,
    shopUrl: "",
    ...partial,
  };
}

const alderBed = product({
  slug: "تخت-خواب-الدر",
  name: "تخت خواب آلدر",
  category: "تخت خواب",
  attributes: [
    {
      id: 2,
      name: "سایز",
      taxonomy: null,
      hasVariations: true,
      terms: ["180", "160", "140", "120"].map((value, index) => ({ id: index, name: value, slug: value, default: index === 0 })),
    },
  ],
  variants: [
    { id: "180", sku: "a", options: [{ name: "سایز", value: "180" }], price: 207000000, stockQty: 1, enabled: true },
    { id: "160", sku: "b", options: [{ name: "سایز", value: "160" }], price: 186100000, stockQty: 1, enabled: true },
    { id: "120", sku: "c", options: [{ name: "سایز", value: "120" }], price: 150500000, stockQty: 1, enabled: true },
  ],
});

test("drops size options that have no priced variant", () => {
  const sizes = getProductAttributeOptions(alderBed).find((attribute) => attribute.label === "سایز");
  assert.deepEqual(sizes?.options.map((option) => option.label), ["180", "160", "120"]);
});

test("changing bed size updates the matched variant price", () => {
  const attributes = getProductAttributeOptions(alderBed);
  const size = attributes.find((attribute) => attribute.label === "سایز");
  assert.ok(size);
  let selected = selectionFromVariant(attributes, getHighestPricedVariant(alderBed));
  const prices: number[] = [];
  for (const option of size.options) {
    selected = selectionForAttributeOption(alderBed, attributes, selected, size.id, option.id);
    const matched = variantMatchingSelection(alderBed, attributes, selected);
    prices.push(Number(matched?.price || 0));
  }
  assert.deepEqual(prices, [207000000, 186100000, 150500000]);
});

test("unpriced variant sizes are not selectable", () => {
  const tv = product({
    slug: "میز-تلویزیون-لیمبا",
    name: "میز تلویزیون لیمبا",
    category: "میزتلویزیون",
    attributes: [
      {
        id: 1,
        name: "سایز",
        taxonomy: null,
        hasVariations: true,
        terms: [
          { id: 0, name: "169", slug: "169", default: true },
          { id: 1, name: "208", slug: "208", default: false },
        ],
      },
    ],
    variants: [
      { id: "169", options: [{ name: "سایز", value: "169" }], price: undefined, stockQty: 0, enabled: true },
      { id: "208", options: [{ name: "سایز", value: "208" }], price: 233000000, stockQty: 0, enabled: true },
    ],
  });
  const sizes = getProductAttributeOptions(tv).find((attribute) => attribute.label === "سایز");
  assert.deepEqual(sizes?.options.map((option) => option.label), ["208"]);
});

test("alder bed debug flow has no stuck or unmatched sizes", () => {
  assert.deepEqual(debugVariantPriceFlow(alderBed), []);
});

test("Folia headboard type pairs wood with walnut and fabric with Capri 2", () => {
  const folia = product({
    slug: "تخت-خواب-فولیا",
    name: "تخت خواب فولیا",
    category: "تخت خواب",
    attributes: [
      {
        id: 2,
        name: "سایز",
        taxonomy: null,
        hasVariations: true,
        terms: ["180", "160", "140"].map((value, index) => ({ id: index, name: value, slug: value, default: index === 0 })),
      },
      {
        id: 4,
        name: "نوع سرتخت",
        taxonomy: null,
        hasVariations: true,
        terms: [
          { id: 0, name: "پارچه", slug: "پارچه", default: false },
          { id: 1, name: "چوب", slug: "چوب", default: true },
        ],
      },
      {
        id: 5,
        name: "سرتخت",
        taxonomy: null,
        hasVariations: false,
        terms: [
          { id: 0, name: "کاپری دو", slug: "کاپری-دو", default: false },
          { id: 1, name: "گردویی", slug: "گردویی", default: false },
        ],
      },
    ],
    variants: [
      { id: "w180", sku: "a", options: [{ name: "سایز", value: "180" }, { name: "نوع سرتخت", value: "چوب" }], price: 217000000, stockQty: 1, enabled: true },
      { id: "f180", sku: "b", options: [{ name: "سایز", value: "180" }, { name: "نوع سرتخت", value: "پارچه" }], price: 205600000, stockQty: 1, enabled: true },
    ],
  });
  const attributes = getProductAttributeOptions(folia);
  const type = attributes.find((attribute) => attribute.label === "نوع سرتخت");
  const material = attributes.find((attribute) => attribute.label === "سرتخت");
  assert.ok(type && material);
  let selected = selectionFromVariant(attributes, getHighestPricedVariant(folia));
  assert.equal(type.options.find((option) => option.id === selected[type.id])?.label, "چوب");
  assert.equal(material.options.find((option) => option.id === selected[material.id])?.label, "گردویی");

  selected = selectionForAttributeOption(folia, attributes, selected, type.id, type.options.find((option) => option.label === "پارچه")!.id);
  assert.equal(type.options.find((option) => option.id === selected[type.id])?.label, "پارچه");
  assert.equal(material.options.find((option) => option.id === selected[material.id])?.label, "کاپری دو");
  assert.equal(type.role, "purchase");
  assert.equal(material.role, "linked");
});

test("sofa fabric is display even when it is not a priced SKU", () => {
  const sofa = product({
    slug: "کاناپه-آلدر",
    name: "کاناپه آلدر",
    category: "کاناپه",
    room: "living",
    attributes: [
      {
        id: 1,
        name: "ظرفیت",
        taxonomy: null,
        hasVariations: true,
        terms: [
          { id: 0, name: "سه نفره", slug: "3", default: true },
          { id: 1, name: "دو نفره", slug: "2", default: false },
        ],
      },
      {
        id: 2,
        name: "پارچه",
        taxonomy: null,
        hasVariations: false,
        terms: [{ id: 0, name: "کاپری دو", slug: "capri", default: true }],
      },
      {
        id: 3,
        name: "چوب",
        taxonomy: null,
        hasVariations: false,
        terms: [{ id: 0, name: "گردویی", slug: "walnut", default: true }],
      },
    ],
    variants: [
      { id: "3", sku: "a", options: [{ name: "ظرفیت", value: "سه نفره" }], price: 100, stockQty: 1, enabled: true },
      { id: "2", sku: "b", options: [{ name: "ظرفیت", value: "دو نفره" }], price: 80, stockQty: 1, enabled: true },
    ],
  });
  const attributes = getProductAttributeOptions(sofa);
  const fabric = attributes.find((attribute) => attribute.label === "پارچه");
  const wood = attributes.find((attribute) => attribute.label === "چوب");
  const seat = attributes.find((attribute) => attribute.label === "ظرفیت");
  assert.equal(fabric?.role, "display");
  assert.equal(wood?.role, "display");
  assert.equal(seat?.role, "purchase");
  assert.deepEqual(fabric?.options.map((option) => option.label), ["کاپری دو"]);
});
