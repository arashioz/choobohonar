import { getMaterial, materials } from "@/data/materials";
import {
  fetchPublicCmsEntries,
  fetchPublicCmsEntry,
  type PublicCmsEntry,
} from "@/lib/public-cms";

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

export async function fetchPublicMaterials(): Promise<PublicMaterial[]> {
  const entries = await fetchPublicCmsEntries("material");
  if (entries.length) return entries.map(normalizePublicMaterial);
  return materials.map((material) => fallbackMaterial(material.id)!).filter(Boolean);
}

export async function fetchPublicMaterial(slug: string): Promise<PublicMaterial | null> {
  const entry = await fetchPublicCmsEntry("material", slug);
  return entry ? normalizePublicMaterial(entry) : fallbackMaterial(slug);
}
