import { ROOM_LABELS, type ShopProduct, type ShopRoom } from "@/lib/shop-api";

export type CatalogChoice = {
  id: string;
  room: ShopRoom;
  category: string;
  section: ShopRoom;
  group: string;
  label: string;
  note?: string;
};

const tablewareNote = "در فروشگاه هم در غذاخوری و هم در دکور دیده می‌شود.";

/** Same merchandising order as the storefront chips. `category` is the value stored on the product. */
export const catalogChoices: CatalogChoice[] = [
  { id: "living-sofa", room: "living", category: "کاناپه", section: "living", group: "کاناپه", label: "کاناپه" },
  { id: "living-armchair", room: "living", category: "مبل تک نفره", section: "living", group: "مبل تک نفره", label: "مبل تک نفره" },
  { id: "living-modular", room: "living", category: "مبل ال", section: "living", group: "مبل ال", label: "مبل ال" },
  { id: "living-outdoor-chair", room: "living", category: "مبل تک نفره فضای باز", section: "living", group: "مبلمان فضای باز", label: "مبل تک نفره فضای باز" },
  { id: "living-sunbed", room: "living", category: "تخت آفتاب", section: "living", group: "مبلمان فضای باز", label: "تخت آفتاب" },
  { id: "living-bench", room: "living", category: "نیمکت", section: "living", group: "مبلمان فضای باز", label: "نیمکت" },
  { id: "living-rocker", room: "living", category: "صندلی راک", section: "living", group: "صندلی", label: "صندلی راک" },
  { id: "living-side", room: "living", category: "کنار مبلی", section: "living", group: "میز", label: "کنار مبلی" },
  { id: "living-coffee", room: "living", category: "جلو مبلی", section: "living", group: "میز", label: "جلو مبلی" },
  { id: "living-coffee-alt", room: "living", category: "میز جلو مبلی", section: "living", group: "میز", label: "میز جلو مبلی" },
  { id: "living-tv", room: "living", category: "میزتلویزیون", section: "living", group: "میز", label: "میز تلویزیون" },
  { id: "living-memory", room: "living", category: "میز خاطره", section: "living", group: "میز", label: "میز خاطره" },
  { id: "living-buffet", room: "living", category: "بوفه", section: "living", group: "کمد کنسول", label: "بوفه" },
  { id: "living-console", room: "living", category: "کنسول", section: "living", group: "کمد کنسول", label: "کنسول" },
  { id: "living-bar", room: "living", category: "کمد بار", section: "living", group: "کمد کنسول", label: "کمد بار" },

  { id: "bed-bed", room: "bedroom", category: "تخت خواب", section: "bedroom", group: "تخت خواب", label: "تخت خواب" },
  { id: "bed-nightstand", room: "bedroom", category: "پاتختی", section: "bedroom", group: "پاتختی", label: "پاتختی" },
  { id: "bed-drawer", room: "bedroom", category: "دراور", section: "bedroom", group: "دراور", label: "دراور" },
  { id: "bed-loveseat", room: "bedroom", category: "لاوست", section: "bedroom", group: "لاوست", label: "لاوست" },
  { id: "bed-vanity-drawer", room: "bedroom", category: "میزآرایش", section: "bedroom", group: "میز آرایش", label: "دراور میز آرایش" },
  { id: "bed-vanity-chair", room: "bedroom", category: "صندلی میزآرایش", section: "bedroom", group: "میز آرایش", label: "صندلی میز آرایش" },
  { id: "bed-vanity-mirror", room: "bedroom", category: "آینه", section: "bedroom", group: "میز آرایش", label: "قاب آینه میز آرایش" },

  { id: "din-table", room: "dining", category: "میز غذاخوری", section: "dining", group: "میز غذاخوری", label: "میز غذاخوری" },
  { id: "din-chair", room: "dining", category: "صندلی غذاخوری", section: "dining", group: "صندلی غذاخوری", label: "صندلی غذاخوری" },
  { id: "din-stool", room: "dining", category: "صندلی کانتر", section: "dining", group: "صندلی کانتر", label: "صندلی کانتر" },
  { id: "din-dishes", room: "decor", category: "ظروف", section: "dining", group: "ظروف", label: "ظروف", note: tablewareNote },
  { id: "din-runner", room: "decor", category: "رانر", section: "dining", group: "رانر", label: "رانر", note: tablewareNote },
  { id: "din-napkin", room: "decor", category: "دستمال سفره", section: "dining", group: "دستمال سفره", label: "دستمال سفره", note: tablewareNote },

  { id: "bedd-mattress", room: "bedding", category: "تشک", section: "bedding", group: "تشک", label: "تشک" },
  { id: "bedd-spread", room: "bedding", category: "سرویس روتختی", section: "bedding", group: "سرویس روتختی", label: "سرویس روتختی" },
  { id: "bedd-linen", room: "bedding", category: "سرویس ملحفه", section: "bedding", group: "سرویس ملحفه", label: "سرویس ملحفه" },
  { id: "bedd-blanket", room: "bedding", category: "پتو", section: "bedding", group: "پتو", label: "پتو" },
  { id: "bedd-pillow", room: "bedding", category: "بالش", section: "bedding", group: "بالش", label: "بالش" },
  { id: "bedd-quilt", room: "bedding", category: "لحاف", section: "bedding", group: "لحاف", label: "لحاف" },
  { id: "bedd-protector", room: "bedding", category: "محافظ تشک", section: "bedding", group: "محافظ تشک", label: "محافظ تشک" },

  { id: "carpet-rug", room: "carpet", category: "فرش و گلیم", section: "carpet", group: "فرش و گلیم", label: "فرش و گلیم" },

  { id: "light-floor", room: "lighting", category: "آباژور ایستاده", section: "lighting", group: "آباژور", label: "آباژور ایستاده" },
  { id: "light-table", room: "lighting", category: "آباژور رومیزی", section: "lighting", group: "آباژور", label: "آباژور رومیزی" },
  { id: "light-pendant", room: "lighting", category: "آویز", section: "lighting", group: "آویز", label: "آویز" },
  { id: "light-chandelier", room: "lighting", category: "لوستر", section: "lighting", group: "لوستر", label: "لوستر" },
  { id: "light-wall", room: "lighting", category: "دیوارکوب", section: "lighting", group: "دیوارکوب", label: "دیوارکوب" },

  { id: "decor-clock", room: "decor", category: "ساعت", section: "decor", group: "ساعت", label: "ساعت" },
  { id: "decor-throw", room: "decor", category: "شال مبل", section: "decor", group: "شال مبل", label: "شال مبل" },
  { id: "decor-cushion", room: "decor", category: "کوسن", section: "decor", group: "کوسن", label: "کوسن" },
  { id: "decor-panel", room: "decor", category: "تابلو دکوراتیو", section: "decor", group: "تابلو دکوراتیو", label: "تابلو دکوراتیو" },
  { id: "decor-mirror", room: "decor", category: "آینه", section: "decor", group: "آینه", label: "آینه" },
  { id: "decor-candle", room: "decor", category: "شمع دکوراتیو", section: "decor", group: "شمع", label: "شمع" },
  { id: "decor-object", room: "decor", category: "دکوراتیو", section: "decor", group: "دکوراتیو", label: "دکوراتیو" },
  { id: "decor-vase", room: "decor", category: "گلدان", section: "decor", group: "گلدان", label: "گلدان" },
  { id: "decor-stick", room: "decor", category: "شمعدان", section: "decor", group: "شمعدان", label: "شمعدان" },
  { id: "decor-incense", room: "decor", category: "جا عودی", section: "decor", group: "جا عودی", label: "جا عودی" },
];

const sectionOrder: ShopRoom[] = ["living", "bedroom", "dining", "bedding", "carpet", "lighting", "decor"];

export function catalogChoiceById(id: string) {
  return catalogChoices.find((choice) => choice.id === id);
}

export function catalogChoiceForProduct(product: Pick<ShopProduct, "room" | "category">) {
  const category = product.category?.trim() || "";
  return catalogChoices.find((choice) => choice.room === product.room && choice.category === category);
}

export function catalogChoiceLabel(choice: CatalogChoice) {
  return choice.group === choice.label ? choice.label : `${choice.group} / ${choice.label}`;
}

export function catalogGroups() {
  const groups: { key: string; section: ShopRoom; sectionLabel: string; group: string; choices: CatalogChoice[] }[] = [];
  for (const choice of catalogChoices) {
    const key = `${choice.section}:${choice.group}`;
    const existing = groups.find((group) => group.key === key);
    if (existing) existing.choices.push(choice);
    else groups.push({
      key,
      section: choice.section,
      sectionLabel: choice.section === "decor" ? "دکور" : ROOM_LABELS[choice.section],
      group: choice.group,
      choices: [choice],
    });
  }
  return groups;
}

export function catalogSections() {
  return sectionOrder
    .map((section) => ({
      id: section,
      label: section === "decor" ? "دکور" : ROOM_LABELS[section],
      choices: catalogChoices.filter((choice) => choice.section === section),
    }))
    .filter((section) => section.choices.length);
}

export type CatalogProductGroup = {
  room: string;
  roomLabel: string;
  categories: { category: string; items: ShopProduct[] }[];
  count: number;
};

export function groupProductsByCatalog(products: ShopProduct[]): CatalogProductGroup[] {
  const buckets = new Map<string, { order: number; room: ShopRoom; title: string; items: ShopProduct[] }>();
  const extras = new Map<string, ShopProduct[]>();

  products.forEach((product) => {
    const choice = catalogChoiceForProduct(product);
    if (!choice) {
      const room = product.room || "other";
      if (!extras.has(room)) extras.set(room, []);
      extras.get(room)!.push(product);
      return;
    }
    const key = `${choice.section}:${choice.group}:${choice.label}`;
    if (!buckets.has(key)) {
      buckets.set(key, {
        order: catalogChoices.indexOf(choice),
        room: choice.section,
        title: catalogChoiceLabel(choice),
        items: [],
      });
    }
    buckets.get(key)!.items.push(product);
  });

  const grouped: CatalogProductGroup[] = sectionOrder.flatMap((section) => {
    const rows = [...buckets.values()]
      .filter((bucket) => bucket.room === section)
      .sort((a, b) => a.order - b.order);
    const leftover = extras.get(section) || [];
    if (!rows.length && !leftover.length) return [];
    const categories = rows.map((row) => ({
      category: row.title,
      items: row.items.sort((a, b) => a.name.localeCompare(b.name, "fa")),
    }));
    if (leftover.length) {
      categories.push({
        category: "خارج از چیدمان",
        items: leftover.sort((a, b) => a.name.localeCompare(b.name, "fa")),
      });
    }
    return [{
      room: section,
      roomLabel: section === "decor" ? "دکور" : ROOM_LABELS[section],
      categories,
      count: categories.reduce((total, category) => total + category.items.length, 0),
    }];
  });
  for (const room of [...extras.keys()].filter((item) => !sectionOrder.includes(item as ShopRoom)).sort()) {
    const items = extras.get(room)!;
    grouped.push({
      room,
      roomLabel: ROOM_LABELS[room as ShopRoom] || room,
      categories: [{
        category: "خارج از چیدمان",
        items: items.sort((a, b) => a.name.localeCompare(b.name, "fa")),
      }],
      count: items.length,
    });
  }
  return grouped;
}
