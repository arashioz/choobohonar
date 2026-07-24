import type { ProductRoom } from "@/data/products";

export type ProductCategoryItem = {
  id: string;
  label: string;
  room: ProductRoom;
};

/** Top-level rooms — aligned with choobohonar.com product-category tree. */
export const productRooms: {
  id: ProductRoom;
  label: string;
  description: string;
  wpSlug: string;
  /** Override when WooCommerce path differs from wpSlug (e.g. decor/dishes). */
  shopPath?: string;
}[] = [
  { id: "living", label: "نشیمن", description: "مبل، میز و مبلمان نشیمن", wpSlug: "livingroom" },
  { id: "bedroom", label: "اتاق خواب", description: "تخت، میز آرایش و کمد", wpSlug: "bedroom" },
  { id: "bedding", label: "کالای خواب", description: "تشک، روتختی و ملحفه", wpSlug: "bedding" },
  { id: "dining", label: "غذاخوری", description: "میز و صندلی غذاخوری", wpSlug: "diningroom" },
  { id: "decor", label: "دکوراتیو", description: "بوفه، کنسول، آینه و اکسسوری", wpSlug: "decor" },
  { id: "carpet", label: "فرش و قالی", description: "فرش و زیرانداز", wpSlug: "carpet" },
  { id: "lighting", label: "روشنایی", description: "آباژور و آویز", wpSlug: "lighting" },
  { id: "dishes", label: "ظروف", description: "ظروف سرو و پذیرایی", wpSlug: "dishes", shopPath: "decor/dishes" },
];

/** Sub-categories shown in nav and product filters (from live site menu). */
export const productCategories: ProductCategoryItem[] = [
  // نشیمن
  { id: "sofa", label: "کاناپه", room: "living" },
  { id: "single-sofa", label: "مبل تک نفره", room: "living" },
  { id: "sectional", label: "مبل ال", room: "living" },
  { id: "outdoor", label: "مبلمان فضای باز", room: "living" },
  { id: "chair", label: "صندلی", room: "living" },
  { id: "table", label: "میز", room: "living" },
  { id: "coffee-table", label: "جلو مبلی", room: "living" },
  { id: "side-table", label: "کنار مبلی", room: "living" },
  { id: "tv-table", label: "میز تلویزیون", room: "living" },
  { id: "desk", label: "میز تحریر", room: "living" },
  { id: "console-cabinet", label: "کمد کنسول", room: "living" },
  { id: "bar-cabinet", label: "کمد بار", room: "living" },
  { id: "buffet", label: "بوفه", room: "living" },
  { id: "console", label: "کنسول", room: "living" },
  { id: "vitrine", label: "ویترین", room: "living" },
  // اتاق خواب
  { id: "bed", label: "تخت خواب", room: "bedroom" },
  { id: "nightstand", label: "پاتختی", room: "bedroom" },
  { id: "vanity", label: "میزآرایش", room: "bedroom" },
  { id: "vanity-chair", label: "صندلی میزآرایش", room: "bedroom" },
  { id: "drawer", label: "دراور", room: "bedroom" },
  { id: "mirror", label: "آینه", room: "bedroom" },
  { id: "vanity-sink", label: "لاوست", room: "bedroom" },
  { id: "bedroom-accessories", label: "کالای خواب", room: "bedroom" },
  // کالای خواب
  { id: "mattress", label: "تشک", room: "bedding" },
  { id: "duvet-set", label: "سرویس روتختی", room: "bedding" },
  { id: "sheet-set", label: "سرویس ملحفه", room: "bedding" },
  { id: "blanket", label: "پتو", room: "bedding" },
  { id: "pillow", label: "بالش", room: "bedding" },
  // غذاخوری
  { id: "dining-table", label: "میز غذاخوری", room: "dining" },
  { id: "dining-chair", label: "صندلی غذاخوری", room: "dining" },
  // دکوراتیو
  { id: "accessories", label: "اکسسوری", room: "decor" },
  { id: "decor", label: "دکور", room: "decor" },
  { id: "runner", label: "رانر", room: "decor" },
  { id: "napkin", label: "دستمال سفره", room: "decor" },
  // روشنایی
  { id: "table-lamp", label: "آباژور رومیزی", room: "lighting" },
  { id: "floor-lamp", label: "آباژور ایستاده", room: "lighting" },
  { id: "pendant", label: "آویز", room: "lighting" },
];

export const roomLabels = Object.fromEntries(productRooms.map((r) => [r.id, r.label])) as Record<
  ProductRoom,
  string
>;

export function getCategoriesByRoom(room: ProductRoom): ProductCategoryItem[] {
  return productCategories.filter((c) => c.room === room);
}

export function getRoomLabel(room: ProductRoom): string {
  return roomLabels[room] ?? room;
}

export function buildProductsFilterHref(room?: ProductRoom, categoryLabel?: string): string {
  const params = new URLSearchParams();
  if (room) params.set("room", room);
  if (categoryLabel) params.set("category", categoryLabel);
  const q = params.toString();
  return q ? `/products?${q}` : "/products";
}
