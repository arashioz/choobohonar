export type WorkArea = {
  id: string;
  label: string;
  en: string;
  description: string;
  image: string;
};

export const workAreas: WorkArea[] = [
  { id: "living", label: "مبلمان نشیمن", en: "Living", description: "مبل، میز جلو مبلی و میز کنار مبلی", image: "/images/projects/aknoon-residence/02.jpg" },
  { id: "bedroom", label: "سرویس خواب", en: "Bedroom", description: "سرویس خواب و کالای خواب", image: "/images/projects/aknoon-residence/15.jpg" },
  { id: "storage", label: "دکوراتیو", en: "Storage", description: "بوفه، کنسول، ویترین و کتابخانه", image: "/images/projects/shenaj-villa/68.jpg" },
  { id: "dining", label: "میز غذاخوری", en: "Dining", description: "میز ناهارخوری و صندلی", image: "/images/projects/araz-suite/08.jpg" },
  { id: "lighting", label: "روشنایی", en: "Lighting", description: "روشنایی دکوراتیو و نورپردازی", image: "/images/projects/armon-hotel/30.jpg" },
  { id: "accessories", label: "اکسسوری", en: "Accessories", description: "اکسسوری و جزئیات تکمیلی خانه", image: "/images/projects/aknoon-residence/09.jpg" },
];
