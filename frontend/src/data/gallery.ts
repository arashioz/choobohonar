import { getProjectImages } from "@/data/project-image-manifest";
import { materials } from "@/data/materials";
import { collections } from "@/data/collections";

export type GalleryTag =
  | "project"
  | "event"
  | "exhibition"
  | "behind-scenes"
  | "collection"
  | "material";

export type GalleryFilter = GalleryTag | "all";

/** Bento span hints for the CSS grid. */
export type GalleryBentoSize = "hero" | "tall" | "wide" | "square";

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  /** One-line caption shown under / beside the image. */
  caption: string;
  tag: GalleryTag;
  /** Optional deep-link to a related site page. */
  href?: string;
  /** Related gallery entry ids for the lightbox rail. */
  relatedIds: string[];
  bento: GalleryBentoSize;
};

export const tagLabels: Record<GalleryTag, string> = {
  project: "پروژه",
  event: "رویداد",
  exhibition: "نمایشگاه",
  "behind-scenes": "پشت‌صحنه",
  collection: "کالکشن",
  material: "متریال",
};

export const galleryFilters: { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "project", label: "پروژه" },
  { id: "event", label: "رویداد" },
  { id: "exhibition", label: "نمایشگاه" },
  { id: "behind-scenes", label: "پشت‌صحنه" },
  { id: "collection", label: "کالکشن" },
  { id: "material", label: "متریال" },
];

const aknoon = getProjectImages("aknoon-residence");
const armon = getProjectImages("armon-hotel");
const araz = getProjectImages("araz-suite");
const shenaj = getProjectImages("shenaj-villa");

/**
 * Curated editorial gallery — mix of projects, events, exhibitions,
 * behind-the-scenes, collections, and materials (not a product dump).
 */
export const galleryItems: GalleryItem[] = [
  // ── Projects ──────────────────────────────────────────────────────────────
  {
    id: "proj-aknoon-living",
    src: aknoon[3] ?? "/images/aknoon-15.jpg",
    alt: "نشیمن اقامتگاه آکنون",
    caption: "نشیمن آکنون با مبلمان سفارشی و پالت چوب گرم.",
    tag: "project",
    href: "/projects/aknoon-residence",
    relatedIds: ["proj-aknoon-detail", "bts-aknoon-install", "mat-wood-grain"],
    bento: "hero",
  },
  {
    id: "proj-aknoon-detail",
    src: aknoon[8] ?? "/images/aknoon-16.jpg",
    alt: "جزئیات چوب اقامتگاه آکنون",
    caption: "جزئیات روکش و اتصال در فضای خصوصی اقامتگاه.",
    tag: "project",
    href: "/projects/aknoon-residence",
    relatedIds: ["proj-aknoon-living", "mat-veneer", "bts-finish-check"],
    bento: "tall",
  },
  {
    id: "proj-shenaj-villa",
    src: shenaj[4] ?? "/images/aknoon-09.jpg",
    alt: "ویلای شناژ",
    caption: "ارتباط فضا با منظره در ویلای شناژ شمال.",
    tag: "project",
    href: "/projects/shenaj-villa",
    relatedIds: ["proj-shenaj-terrace", "bts-shenaj-site", "mat-wood-grain"],
    bento: "wide",
  },
  {
    id: "proj-shenaj-terrace",
    src: shenaj[12] ?? "/images/aknoon-11.jpg",
    alt: "تراس ویلای شناژ",
    caption: "تراس و مبلمان بیرونی هماهنگ با معماری ویلا.",
    tag: "project",
    href: "/projects/shenaj-villa",
    relatedIds: ["proj-shenaj-villa", "event-showroom-tour"],
    bento: "square",
  },
  {
    id: "proj-armon-lobby",
    src: armon[23] ?? "/images/aknoon-18.jpg",
    alt: "لابی هتل آرمون",
    caption: "لابی هتل آرمون با متریال مقاوم و پالت چوب روشن.",
    tag: "project",
    href: "/projects/armon-hotel",
    relatedIds: ["proj-armon-suite", "bts-armon-assembly", "exhibition-hotel-suite"],
    bento: "tall",
  },
  {
    id: "proj-armon-suite",
    src: armon[40] ?? "/images/aknoon-21.jpg",
    alt: "سوئیت هتل آرمون",
    caption: "سوئیت اقامتی با مبلمان یکپارچه و نور کنترل‌شده.",
    tag: "project",
    href: "/projects/armon-hotel",
    relatedIds: ["proj-armon-lobby", "proj-araz", "mat-fabric"],
    bento: "square",
  },
  {
    id: "proj-araz",
    src: araz[5] ?? "/images/aknoon-22.jpg",
    alt: "سوئیت آراز",
    caption: "سوئیت آراز؛ مقیاس کوچک‌تر با همان زبان متریال.",
    tag: "project",
    href: "/projects/araz-suite",
    relatedIds: ["proj-armon-suite", "mat-metal", "bts-finish-check"],
    bento: "wide",
  },

  // ── Events ────────────────────────────────────────────────────────────────
  {
    id: "event-showroom-tour",
    src: aknoon[14] ?? "/images/aknoon-07.jpg",
    alt: "بازدید شوروم",
    caption: "بازدید گروهی از شوروم و گفت‌وگو درباره نمونه‌های متریال.",
    tag: "event",
    href: "/contact",
    relatedIds: ["event-design-talk", "exhibition-material-wall", "bts-workshop"],
    bento: "square",
  },
  {
    id: "event-design-talk",
    src: armon[60] ?? "/images/aknoon-05.jpg",
    alt: "نشست طراحی",
    caption: "نشست کوتاه درباره انتخاب متریال برای فضاهای اقامتی.",
    tag: "event",
    relatedIds: ["event-showroom-tour", "exhibition-hotel-suite", "bts-workshop"],
    bento: "wide",
  },
  {
    id: "event-client-review",
    src: shenaj[22] ?? "/images/aknoon-12.jpg",
    alt: "بازبینی پروژه با کارفرما",
    caption: "بازبینی نهایی چیدمان و پرداخت‌ها پیش از تحویل.",
    tag: "event",
    relatedIds: ["proj-shenaj-villa", "bts-shenaj-site", "mat-wood-grain"],
    bento: "square",
  },

  // ── Exhibitions ───────────────────────────────────────────────────────────
  {
    id: "exhibition-material-wall",
    src: aknoon[18] ?? "/images/aknoon-16.jpg",
    alt: "دیوار نمونه متریال",
    caption: "دیوار نمونه‌های چوب، روکش و پارچه در نمایشگاه داخلی.",
    tag: "exhibition",
    href: "/materials",
    relatedIds: ["mat-wood-grain", "mat-fabric", "mat-veneer", "exhibition-hotel-suite"],
    bento: "hero",
  },
  {
    id: "exhibition-hotel-suite",
    src: armon[75] ?? "/images/aknoon-24.jpg",
    alt: "نمایش سوئیت هتلی",
    caption: "چیدمان نمایشی سوئیت برای بازدیدکنندگان صنعت هتلداری.",
    tag: "exhibition",
    relatedIds: ["proj-armon-lobby", "event-design-talk", "mat-fabric"],
    bento: "tall",
  },
  {
    id: "exhibition-solo-set",
    src: collections[0]?.image ?? "/images/aknoon-02.jpg",
    alt: "نمایش کالکشن سولو",
    caption: "چیدمان کالکشن سولو در فضای نمایشگاهی شوروم.",
    tag: "exhibition",
    href: "/collection/solo",
    relatedIds: ["col-solo-sofa", "col-solo-dining", "event-showroom-tour"],
    bento: "square",
  },

  // ── Behind the scenes ─────────────────────────────────────────────────────
  {
    id: "bts-workshop",
    src: aknoon[22] ?? "/images/aknoon-18.jpg",
    alt: "کارگاه ساخت",
    caption: "ساخت اسکلت و آماده‌سازی پنل‌ها در کارگاه.",
    tag: "behind-scenes",
    relatedIds: ["bts-finish-check", "bts-aknoon-install", "mat-wood-grain"],
    bento: "tall",
  },
  {
    id: "bts-finish-check",
    src: aknoon[27] ?? "/images/aknoon-09.jpg",
    alt: "کنترل کیفیت پرداخت",
    caption: "کنترل کیفیت پرداخت مات و یکنواختی رنگ سطح.",
    tag: "behind-scenes",
    href: "/materials/wood",
    relatedIds: ["bts-workshop", "mat-wood-grain", "mat-veneer"],
    bento: "square",
  },
  {
    id: "bts-aknoon-install",
    src: aknoon[31] ?? "/images/aknoon-11.jpg",
    alt: "نصب در محل آکنون",
    caption: "نصب و تنظیم نهایی مبلمان در محل اقامتگاه آکنون.",
    tag: "behind-scenes",
    href: "/projects/aknoon-residence",
    relatedIds: ["proj-aknoon-living", "bts-workshop", "event-client-review"],
    bento: "wide",
  },
  {
    id: "bts-armon-assembly",
    src: armon[90] ?? "/images/aknoon-27.jpg",
    alt: "مونتاژ مبلمان هتل",
    caption: "مونتاژ قطعات بزرگ برای فضاهای عمومی هتل.",
    tag: "behind-scenes",
    href: "/projects/armon-hotel",
    relatedIds: ["proj-armon-lobby", "bts-workshop", "mat-metal"],
    bento: "square",
  },
  {
    id: "bts-shenaj-site",
    src: shenaj[30] ?? "/images/aknoon-29.jpg",
    alt: "بازدید کارگاهی ویلا",
    caption: "هماهنگی اجرا با نور و رطوبت اقلیم شمال در سایت.",
    tag: "behind-scenes",
    href: "/projects/shenaj-villa",
    relatedIds: ["proj-shenaj-villa", "bts-finish-check", "mat-veneer"],
    bento: "tall",
  },

  // ── Collections ───────────────────────────────────────────────────────────
  {
    id: "col-solo-sofa",
    src: collections[0]?.image ?? "/images/aknoon-02.jpg",
    alt: "کالکشن سولو",
    caption: "خطوط آرام کالکشن سولو برای نشیمن معاصر.",
    tag: "collection",
    href: "/collection/solo",
    relatedIds: ["col-solo-dining", "exhibition-solo-set", "mat-fabric"],
    bento: "wide",
  },
  {
    id: "col-solo-dining",
    src: "https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg",
    alt: "میز غذاخوری سولو",
    caption: "میز و صندلی غذاخوری سولو در یک زبان طراحی.",
    tag: "collection",
    href: "/collection/solo",
    relatedIds: ["col-solo-sofa", "exhibition-solo-set", "mat-wood-grain"],
    bento: "square",
  },

  // ── Materials ─────────────────────────────────────────────────────────────
  {
    id: "mat-wood-grain",
    src: materials.find((m) => m.id === "wood")?.image ?? "/images/aknoon-16.jpg",
    alt: "متریال چوب",
    caption: "رگه طبیعی چوب سخت پس از پرداخت مات.",
    tag: "material",
    href: "/materials/wood",
    relatedIds: ["mat-veneer", "bts-finish-check", "exhibition-material-wall"],
    bento: "square",
  },
  {
    id: "mat-fabric",
    src: materials.find((m) => m.id === "fabric")?.image ?? "/images/aknoon-02.jpg",
    alt: "متریال پارچه",
    caption: "نمونه پارچه رویه در کنار پالت چوب شوروم.",
    tag: "material",
    href: "/materials/fabric",
    relatedIds: ["mat-wood-grain", "col-solo-sofa", "exhibition-material-wall"],
    bento: "tall",
  },
  {
    id: "mat-veneer",
    src: materials.find((m) => m.id === "veneer")?.image ?? "/images/aknoon-18.jpg",
    alt: "متریال روکش",
    caption: "روکش اصیل برای سطوح وسیع با رگه‌ای یکدست.",
    tag: "material",
    href: "/materials/veneer",
    relatedIds: ["mat-wood-grain", "bts-finish-check", "proj-aknoon-detail"],
    bento: "square",
  },
  {
    id: "mat-metal",
    src: materials.find((m) => m.id === "metal")?.image ?? "/images/aknoon-09.jpg",
    alt: "متریال فلز",
    caption: "جزئیات فلزی برای اتصال و تأکید بصری ظریف.",
    tag: "material",
    href: "/materials/metal",
    relatedIds: ["mat-wood-grain", "bts-armon-assembly", "proj-araz"],
    bento: "wide",
  },
];

const byId = new Map(galleryItems.map((item) => [item.id, item]));

export function getGalleryItem(id: string): GalleryItem | undefined {
  return byId.get(id);
}

export function getRelatedGalleryItems(item: GalleryItem): GalleryItem[] {
  return item.relatedIds.map((id) => byId.get(id)).filter((x): x is GalleryItem => Boolean(x));
}

export function filterGalleryItems(items: GalleryItem[], filter: GalleryFilter): GalleryItem[] {
  if (filter === "all") return items;
  return items.filter((item) => item.tag === filter);
}

export function getGalleryItems(): GalleryItem[] {
  return galleryItems;
}
