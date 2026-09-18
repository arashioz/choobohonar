import { galleryItems } from "@/data/gallery";

export type TasteSpace = "home" | "villa" | "hospitality" | "detail";
export type TasteMaterial = "dark-wood" | "light-wood" | "fabric" | "metal";
export type TasteAtmosphere = "calm" | "layered" | "formal" | "nature";
export type TasteObject = "decor" | "lighting" | "carpet" | "furniture";

export type GalleryTasteAnswers = {
  space: TasteSpace;
  material: TasteMaterial;
  atmosphere: TasteAtmosphere;
  object: TasteObject;
};

export type TasteQuestionId = keyof GalleryTasteAnswers;

export const TASTE_OPTION_IDS: { [K in TasteQuestionId]: GalleryTasteAnswers[K][] } = {
  space: ["home", "villa", "hospitality", "detail"],
  material: ["dark-wood", "light-wood", "fabric", "metal"],
  atmosphere: ["calm", "layered", "formal", "nature"],
  object: ["decor", "lighting", "carpet", "furniture"],
};

export type TasteChoice<T extends string = string> = {
  id: T;
  label: string;
  src: string;
  alt: string;
};

function srcFor(id: string, fallback: string) {
  return galleryItems.find((item) => item.id === id)?.src || fallback;
}

export const tasteQuestions: {
  id: TasteQuestionId;
  prompt: string;
  options: TasteChoice[];
}[] = [
  {
    id: "space",
    prompt: "کدام فضا را بیشتر مال خودتان می‌دانید؟",
    options: [
      { id: "home", label: "نشیمن گرم خانگی", src: srcFor("proj-aknoon-living", "/images/aknoon-15.jpg"), alt: "نشیمن خانگی" },
      { id: "villa", label: "ویلا و طبیعت", src: srcFor("proj-shenaj-villa", "/images/aknoon-09.jpg"), alt: "ویلا" },
      { id: "hospitality", label: "فضای اقامتی", src: srcFor("proj-armon-lobby", "/images/aknoon-18.jpg"), alt: "لابی هتل" },
      { id: "detail", label: "جزئیات و دوخت", src: srcFor("proj-aknoon-detail", "/images/aknoon-16.jpg"), alt: "جزئیات ساخت" },
    ],
  },
  {
    id: "material",
    prompt: "کدام سطح را بیشتر دوست دارید؟",
    options: [
      { id: "dark-wood", label: "چوب تیره با رگه", src: srcFor("mat-wood-grain", "/images/aknoon-16.jpg"), alt: "چوب تیره" },
      { id: "light-wood", label: "چوب روشن مات", src: srcFor("proj-armon-lobby", "/images/aknoon-18.jpg"), alt: "چوب روشن" },
      { id: "fabric", label: "پارچه و رویه", src: srcFor("mat-fabric", "/images/aknoon-02.jpg"), alt: "پارچه" },
      { id: "metal", label: "فلز و اتصال", src: srcFor("mat-metal", "/images/aknoon-09.jpg"), alt: "فلز" },
    ],
  },
  {
    id: "atmosphere",
    prompt: "خانه‌تان بیشتر چه حسی داشته باشد؟",
    options: [
      { id: "calm", label: "آرام و خلوت", src: srcFor("col-solo-sofa", "/images/aknoon-02.jpg"), alt: "خطوط آرام" },
      { id: "layered", label: "پر از بافت و شیء", src: srcFor("exhibition-material-wall", "/images/aknoon-16.jpg"), alt: "بافت و متریال" },
      { id: "formal", label: "رسمی برای مهمان", src: srcFor("exhibition-hotel-suite", "/images/aknoon-18.jpg"), alt: "سوئیت رسمی" },
      { id: "nature", label: "نزدیک طبیعت", src: srcFor("proj-shenaj-terrace", "/images/aknoon-11.jpg"), alt: "تراس و طبیعت" },
    ],
  },
  {
    id: "object",
    prompt: "کدام را به خانه می‌آورید؟",
    options: [
      { id: "decor", label: "ساعت و دکور", src: srcFor("proj-aknoon-detail", "/images/aknoon-16.jpg"), alt: "دکور" },
      { id: "lighting", label: "آباژور و نور", src: srcFor("bts-finish-check", "/images/aknoon-09.jpg"), alt: "نور و پرداخت" },
      { id: "carpet", label: "فرش و گلیم", src: srcFor("mat-fabric", "/images/aknoon-02.jpg"), alt: "بافت فرش" },
      { id: "furniture", label: "فقط مبلمان بزرگ", src: srcFor("col-solo-dining", "/images/aknoon-15.jpg"), alt: "میز و مبلمان" },
    ],
  },
];
