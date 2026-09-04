import type { ShopProduct } from "@/data/products";
import { toFa } from "@/lib/utils";

export function formatCatalogPrice(product: Pick<ShopProduct, "prices">): string {
  const price = product.prices;
  if (!price?.value) return "استعلام قیمت";

  const min = Number(price.minValue ?? price.value);
  const max = Number(price.maxValue ?? price.value);
  if (!Number.isFinite(min) || min <= 0) return "استعلام قیمت";
  const formatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });
  const suffix = price.currencySymbol || "تومان";

  if (Number.isFinite(min) && Number.isFinite(max) && max > min) {
    return `از ${formatter.format(min)} ${suffix}`;
  }

  return `${formatter.format(Number(price.value))} ${suffix}`;
}

export function getCollectionName(product: ShopProduct): string | null {
  const attribute = product.attributes.find(
    (item) => item.taxonomy === "pa_collection" || item.name === "کالکشن",
  );
  return attribute?.terms[0]?.name ?? null;
}

export function getProductAttributeOptions(product: ShopProduct) {
  return product.attributes
    .filter((attribute) => attribute.terms.length > 0 && attribute.taxonomy !== "pa_collection" && attribute.name !== "کالکشن")
    .map((attribute) => ({
      id: attribute.taxonomy || String(attribute.id),
      label: attribute.name,
      options: attribute.terms.map((term) => ({
        id: term.slug,
        label: term.name,
        default: term.default,
      })),
    }));
}

export function formatProductCount(value: number): string {
  return `${toFa(value)} محصول`;
}

export function formatMoney(value: number, currencySymbol = "تومان"): string {
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 }).format(value)} ${currencySymbol}`;
}
