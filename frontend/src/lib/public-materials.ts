import { getMaterial, LAUNCHED_MATERIAL_FAMILIES, materials } from "@/data/materials";
import {
  getMaterialCommerceItem,
  getMaterialCommerceItems,
  type MaterialCommerceItem,
} from "@/data/material-products";
import {
  fetchPublicCmsEntries,
  fetchPublicCmsEntry,
  type PublicCmsEntry,
} from "@/lib/public-cms";
import { fetchMaterialSwatches, type MaterialSwatch } from "@/lib/storefront-products";

const FAMILY_IDS = new Set(["wood", "fabric", "veneer", "metal"]);

export type PublicMaterial = {
  id: string;
  label: string;
  eyebrow: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  colorHex: string;
  highlights: { title: string; description: string }[];
  materialTypes: string[];
  colors: string[];
  finishes: string[];
  applications: string[];
  specs: { label: string; value: string }[];
  care: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringList(...values: unknown[]): string[] {
  for (const value of values) {
    if (Array.isArray(value)) {
      const list = value.map(String).map((item) => item.trim()).filter(Boolean);
      if (list.length) return list;
    }
    if (typeof value === "string" && value.trim()) return [value.trim()];
  }
  return [];
}

function structuredList(value: unknown): { title: string; description: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asRecord(item))
    .map((item) => ({
      title: String(item.title || item.label || "").trim(),
      description: String(item.description || item.value || "").trim(),
    }))
    .filter((item) => item.title || item.description);
}

function specsList(value: unknown): { label: string; value: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => asRecord(item))
    .map((item) => ({
      label: String(item.label || item.title || "").trim(),
      value: String(item.value || item.description || "").trim(),
    }))
    .filter((item) => item.label || item.value);
}

function validColor(value: unknown): string {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : "#8b6b52";
}

function fallbackMaterial(id: string): PublicMaterial | null {
  const material = getMaterial(id);
  if (!material) return null;
  return {
    id: material.id,
    label: material.label,
    eyebrow: material.eyebrow,
    shortDescription: material.shortDescription,
    longDescription: material.longDescription,
    image: material.image,
    colorHex: "#8b6b52",
    highlights: material.highlights,
    materialTypes: [],
    colors: [],
    finishes: [],
    applications: [],
    specs: [],
    care: "",
  };
}

export function normalizePublicMaterial(entry: PublicCmsEntry): PublicMaterial {
  const data = asRecord(entry.data);
  const materialTypes = stringList(data.materialTypes, data.materialType, data.eyebrow);
  const colors = stringList(data.colors, data.color);
  const finishes = stringList(data.finishes, data.finish);
  const fallback = fallbackMaterial(entry.slug);
  const image =
    entry.images?.find(Boolean) ||
    (typeof data.image === "string" ? data.image : "") ||
    fallback?.image ||
    "";
  const label = String(entry.title || data.label || fallback?.label || "متریال").trim();
  const shortDescription = String(
    entry.excerpt || data.shortDescription || fallback?.shortDescription || "",
  ).trim();
  const longDescription = String(
    entry.description || data.longDescription || shortDescription || fallback?.longDescription || "",
  ).trim();

  return {
    id: entry.slug,
    label,
    eyebrow: String(data.eyebrow || materialTypes[0] || fallback?.eyebrow || "کتابخانه متریال").trim(),
    shortDescription,
    longDescription,
    image,
    colorHex: validColor(data.colorHex),
    highlights: structuredList(data.highlights).length
      ? structuredList(data.highlights)
      : fallback?.highlights || [],
    materialTypes,
    colors,
    finishes,
    applications: stringList(data.applications),
    specs: specsList(data.specs),
    care: String(data.care || "").trim(),
  };
}

export function commerceItemFromSwatch(swatch: MaterialSwatch): MaterialCommerceItem {
  const family = (["wood", "fabric", "veneer", "metal"].includes(swatch.family)
    ? swatch.family
    : "wood") as MaterialCommerceItem["categoryId"];
  return {
    slug: swatch.slug,
    categoryId: family,
    name: swatch.name,
    code: swatch.code || "",
    subtitle: swatch.excerpt || swatch.color || "پرداخت استفاده‌شده روی محصولات",
    description:
      swatch.excerpt ||
      `پرداخت ${swatch.name} از متریال‌هایی است که روی محصولات خانه چوب و هنر استفاده شده است.`,
    color: swatch.hex || "#8B6B52",
    accent: swatch.hex || "#C4A882",
    applicationImage: swatch.image || "/images/aknoon-16.jpg",
    priceLabel: "قابل انتخاب روی محصول",
    unit: "پرداخت چوب",
    commerceMode: "sample",
    specs: [
      { label: "کد", value: swatch.code || "—" },
      { label: "خانواده", value: family === "wood" ? "چوب" : family },
      { label: "رنگ", value: swatch.color || swatch.name },
    ],
    uses: ["مبلمان چوبی", "سرویس خواب", "میز و صندلی"],
    care: "گردگیری خشک و دور از رطوبت مستقیم؛ نمونه نهایی ممکن است به دلیل ماهیت طبیعی چوب تفاوت جزئی رنگ داشته باشد.",
  };
}

export async function fetchMaterialCatalog(family?: string): Promise<MaterialCommerceItem[]> {
  const swatches = await fetchMaterialSwatches();
  const items = swatches
    .filter((item) => !FAMILY_IDS.has(item.slug))
    .filter((item) => !family || item.family === family || !item.family)
    .map(commerceItemFromSwatch);
  if (items.length) return items;
  return family ? getMaterialCommerceItems(family) : getMaterialCommerceItems("wood");
}

export async function fetchMaterialCatalogItem(family: string, slug: string) {
  const items = await fetchMaterialCatalog(family);
  const decoded = decodeURIComponent(safeSlug(slug));
  const compact = decoded.replace(/[\s-]+/g, "").toLowerCase();
  return (
    items.find((item) => {
      const keys = [item.slug, item.name, item.code, item.code.toLowerCase()];
      return keys.some((key) => {
        if (!key) return false;
        return key === slug || key === decoded || key.replace(/[\s-]+/g, "").toLowerCase() === compact;
      });
    }) || getMaterialCommerceItem(family, decoded)
  );
}

function safeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function fetchPublicMaterials(): Promise<PublicMaterial[]> {
  const entries = await fetchPublicCmsEntries("material");
  const families = entries
    .map(normalizePublicMaterial)
    .filter((material) => FAMILY_IDS.has(material.id));
  if (families.length) return families;
  return materials.map((material) => fallbackMaterial(material.id)!).filter(Boolean);
}

export async function fetchPublicMaterialFamilies(): Promise<PublicMaterial[]> {
  const all = await fetchPublicMaterials();
  const byId = new Map(all.map((material) => [material.id, material]));
  return LAUNCHED_MATERIAL_FAMILIES.map((id) => byId.get(id) || fallbackMaterial(id)).filter(
    (material): material is PublicMaterial => Boolean(material),
  );
}

export async function fetchPublicMaterial(slug: string): Promise<PublicMaterial | null> {
  const entry = await fetchPublicCmsEntry("material", slug);
  return entry ? normalizePublicMaterial(entry) : fallbackMaterial(slug);
}
