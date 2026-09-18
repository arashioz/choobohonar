import type { GalleryItem } from "../data/gallery";
import type { AnyProduct, ProductRoom } from "../data/products";
import {
  TASTE_OPTION_IDS,
  type GalleryTasteAnswers,
  type TasteObject,
  type TasteQuestionId,
} from "../data/gallery-taste";

export const GALLERY_TASTE_STORAGE_KEY = "choobohonar.gallery-taste.v1";
export const MAX_PRODUCT_INSERTS = 8;

export type GalleryTasteState =
  | { status: "skipped" }
  | { status: "complete"; answers: GalleryTasteAnswers };

const ACCESSORY_ROOMS: ProductRoom[] = ["decor", "lighting", "carpet"];

export function parseTasteAnswers(value: unknown): GalleryTasteAnswers | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const answers = {
    space: String(record.space || ""),
    material: String(record.material || ""),
    atmosphere: String(record.atmosphere || ""),
    object: String(record.object || ""),
  };
  const keys: TasteQuestionId[] = ["space", "material", "atmosphere", "object"];
  for (const key of keys) {
    if (!TASTE_OPTION_IDS[key].includes(answers[key] as never)) return null;
  }
  return answers as GalleryTasteAnswers;
}

export function isTasteState(value: unknown): value is GalleryTasteState {
  if (!value || typeof value !== "object") return false;
  const record = value as { status?: string; answers?: unknown };
  if (record.status === "skipped") return true;
  return record.status === "complete" && Boolean(parseTasteAnswers(record.answers));
}

export function readTasteState(): GalleryTasteState | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(GALLERY_TASTE_STORAGE_KEY) || "null");
    return isTasteState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function writeTasteState(state: GalleryTasteState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GALLERY_TASTE_STORAGE_KEY, JSON.stringify(state));
}

export function productToGalleryItem(product: Pick<AnyProduct, "slug" | "name" | "image" | "room" | "shortDescription">): GalleryItem {
  return {
    id: `shop-${product.slug}`,
    src: product.image,
    alt: product.name,
    caption: product.shortDescription || product.name,
    tag: "product",
    href: `/products/${product.slug}`,
    entityKind: "product",
    entitySlug: product.slug,
    productCategory: product.room,
    bento: "square",
  };
}

function haystack(item: GalleryItem) {
  return `${item.tag} ${item.caption} ${item.alt} ${item.productCategory || ""}`.toLowerCase();
}

function scoreEditorial(item: GalleryItem, answers: GalleryTasteAnswers) {
  const text = haystack(item);
  let score = 0;
  if (answers.space === "home" && (item.tag === "project" || /نشیمن|خان|آکنون/.test(text))) score += 4;
  if (answers.space === "villa" && /شناژ|شمال|تراس|طبیعت|ویلا/.test(text)) score += 5;
  if (answers.space === "hospitality" && /هتل|آرمون|آراز|اقامت|لابی|سوئیت/.test(text)) score += 5;
  if (answers.space === "detail" && (item.tag === "behind-scenes" || /جزئیات|دوخت|اتصال/.test(text))) score += 4;
  if (answers.material === "dark-wood" && (item.tag === "material" || /چوب|رگه|روکش/.test(text))) score += 3;
  if (answers.material === "light-wood" && /روشن|مات|چوب/.test(text)) score += 3;
  if (answers.material === "fabric" && /پارچه|رویه|بافت/.test(text)) score += 4;
  if (answers.material === "metal" && /فلز|اتصال/.test(text)) score += 4;
  if (answers.atmosphere === "calm" && item.tag === "collection") score += 4;
  if (answers.atmosphere === "layered" && (item.tag === "material" || item.tag === "exhibition")) score += 3;
  if (answers.atmosphere === "formal" && /هتل|سوئیت|رسمی|اقامت/.test(text)) score += 4;
  if (answers.atmosphere === "nature" && /شناژ|طبیعت|تراس|چوب/.test(text)) score += 4;
  return score;
}

function roomForObject(object: TasteObject): ProductRoom | null {
  if (object === "furniture") return null;
  return object;
}

function scoreProduct(item: GalleryItem, answers: GalleryTasteAnswers) {
  const room = item.productCategory as ProductRoom | undefined;
  let score = 1;
  const wanted = roomForObject(answers.object);
  if (wanted && room === wanted) score += 6;
  if (answers.object === "furniture" && room && !ACCESSORY_ROOMS.includes(room)) score += 5;
  if (answers.space === "home" && room === "living") score += 3;
  if (answers.space === "villa" && (room === "living" || room === "dining")) score += 2;
  if (answers.atmosphere === "layered" && room && ACCESSORY_ROOMS.includes(room)) score += 3;
  if (answers.atmosphere === "calm" && room === "living") score += 2;
  if (answers.material === "fabric" && (room === "living" || room === "carpet")) score += 2;
  return score;
}

export function allowedProductRooms(answers: GalleryTasteAnswers): ProductRoom[] | "all" {
  if (answers.object === "furniture") {
    return ["living", "bedroom", "dining", "bedding", "dishes"];
  }
  return "all";
}

export function mixGalleryFeed(
  editorial: GalleryItem[],
  products: GalleryItem[],
  answers: GalleryTasteAnswers,
) {
  const rooms = allowedProductRooms(answers);
  const shop = products.filter((item) => {
    if (item.tag !== "product") return false;
    if (rooms === "all") return true;
    return rooms.includes((item.productCategory || "") as ProductRoom);
  });

  const rankedEditorial = [...editorial].sort((left, right) => scoreEditorial(right, answers) - scoreEditorial(left, answers));
  const rankedShop = [...shop]
    .sort((left, right) => scoreProduct(right, answers) - scoreProduct(left, answers))
    .slice(0, MAX_PRODUCT_INSERTS);

  const mixed: GalleryItem[] = [];
  let shopIndex = 0;
  rankedEditorial.forEach((item, index) => {
    mixed.push(item);
    if ((index + 1) % 2 === 0 && shopIndex < rankedShop.length) {
      mixed.push(rankedShop[shopIndex]);
      shopIndex += 1;
    }
  });
  while (shopIndex < rankedShop.length) {
    mixed.push(rankedShop[shopIndex]);
    shopIndex += 1;
  }
  return mixed;
}
