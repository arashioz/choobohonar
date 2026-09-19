import type { ProductRoom } from "@/data/products";
import type { ProductStory } from "@/components/commerce/ProductStoriesRail";
import { fetchPublicCmsEntries } from "@/lib/public-cms";

export type StorefrontStory = ProductStory & {
  rooms: ProductRoom[];
  categorySlugs: string[];
};

const ROOM_ALIASES: Record<string, ProductRoom> = {
  living: "living",
  livingroom: "living",
  نشیمن: "living",
  bedroom: "bedroom",
  "اتاق خواب": "bedroom",
  dining: "dining",
  diningroom: "dining",
  غذاخوری: "dining",
  bedding: "bedding",
  "کالای خواب": "bedding",
  carpet: "carpet",
  "فرش و گلیم": "carpet",
  lighting: "lighting",
  روشنایی: "lighting",
  decor: "decor",
  دکور: "decor",
  dishes: "dishes",
  ظروف: "dishes",
};

function asStringList(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function roomsFromText(values: string[]) {
  const rooms = new Set<ProductRoom>();
  for (const value of values) {
    const room = ROOM_ALIASES[value.trim().toLowerCase()] || ROOM_ALIASES[value.trim()];
    if (room) rooms.add(room);
  }
  return [...rooms];
}

export async function fetchProductStories(): Promise<StorefrontStory[]> {
  const entries = await fetchPublicCmsEntries("story");
  const stories = entries.map((story) => {
    const video = typeof story.data?.video === "string" ? story.data.video : "";
    const tokens = [
      typeof story.data?.label === "string" ? story.data.label : "",
      ...asStringList(story.data?.rooms),
      ...asStringList(story.data?.categories),
      ...asStringList(story.tags),
    ].filter(Boolean);
    return {
      label: typeof story.data?.label === "string" ? story.data.label : "Product Stories",
      title: story.title,
      video,
      rooms: roomsFromText(tokens),
      categorySlugs: asStringList(story.data?.categorySlugs),
    };
  }).filter((story) => Boolean(story.video));

  if (stories.length) return stories;

  return [{
    label: "Product Stories",
    title: "نزدیک‌تر از همیشه",
    video: encodeURI("/030509_KC&H Clip 1.3.m4v"),
    rooms: [],
    categorySlugs: [],
  }];
}

export function storiesForCategory(
  stories: StorefrontStory[],
  room?: ProductRoom,
  categorySlug?: string,
) {
  if (!room && !categorySlug) return stories;
  const matched = stories.filter((story) => {
    const roomMatch = !room || !story.rooms.length || story.rooms.includes(room);
    const categoryMatch = !categorySlug || !story.categorySlugs.length || story.categorySlugs.includes(categorySlug);
    return roomMatch && categoryMatch;
  });
  return matched.length ? matched : stories.filter((story) => !story.rooms.length && !story.categorySlugs.length);
}
