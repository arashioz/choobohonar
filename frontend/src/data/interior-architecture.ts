export type InteriorStyle = {
  id: string;
  label: string;
  description: string;
  image: string;
};

export type MoodboardImage = {
  id: string;
  src: string;
  alt: string;
  tags: string[];
};

export type InteriorProcessStep = {
  n: number;
  title: string;
  body: string;
};

export type InteriorBenefit = {
  title: string;
  body: string;
};

export const interiorHero = {
  eyebrow: "خدمات معماری داخلی",
  title: "خدمات طراحی داخلی و مشاوره‌ی چیدمان",
  subtitle: "با کارشناسان معماری داخلی ما صحبت کنید",
  description:
    "در «خانه چوب و هنر» یک تیم متخصص در کنار شماست. برای چیدن فضایی که همه‌ی جزئیاتش با نیازهای شما سازگار باشد، از خدمات مشاوره، طراحی و اجرای تیم معماری داخلی ما استفاده کنید.",
  image: "/images/projects/aknoon-residence/04.jpg",
};

export const interiorIntro = {
  eyebrow: "از طراحی تا اجرا",
  title: "پروژه‌های بزرگ و کوچک",
  body: "گام اول یک چیدمان موفق، درک نیازهاست و ما در خانه چوب و هنر آماده گفت‌وگو با شما هستیم. با شنیدن انتظار شما از فضایی که در اختیار دارید و حال‌وهوایی که دوست دارید تداعی کند، طراحی پروژه در مسیری که ویژه‌ی شماست آغاز می‌شود.",
};

export const interiorBenefits: InteriorBenefit[] = [
  {
    title: "تنوع، کیفیت و نوآوری",
    body: "از رنگ و جنس پارچه روکش مبلمان گرفته تا تنوعی از فرش و اکسسوری‌های کاربردی و دکوراتیو برای هر سلیقه.",
  },
  {
    title: "طراحی شخصی‌سازی‌شده",
    body: "طراحی چیدمان بر اساس نقشه‌ی فضای شما، از یک آپارتمان کوچک گرفته تا ویلایی چندین‌خوابه.",
  },
  {
    title: "مودبورد مخصوص شما",
    body: "ما سلیقه و نیاز شما را به زبان رنگ و مبلمان و دکوراسیون ترجمه می‌کنیم؛ راهنمایی ماندگار برای چیدمان خانه.",
  },
  {
    title: "خلق فضایی یکتا",
    body: "خلق فضایی بی‌مانند برای شما، با دانش کامل نسبت به ترندهای جهان طراحی و دکوراسیون و با استفاده از تجربه‌ی سالیان.",
  },
];

export const interiorProcessSteps: InteriorProcessStep[] = [
  {
    n: 1,
    title: "قرار ملاقات",
    body: "با کارشناسان معماری داخلی ما تماس بگیرید و بر اساس نیاز، برای یک ملاقات حضوری، آنلاین یا جلسه‌ی تلفنی زمانی هماهنگ کنید.",
  },
  {
    n: 2,
    title: "آماده‌سازی",
    body: "برای کمک به کارشناسان ما عکس‌هایی با کیفیت از فضای مورد نظر خود تهیه کنید. اندازه‌های فضا را بگیرید و از بایدها و نبایدهای مدنظرتان لیستی تهیه کنید.",
  },
  {
    n: 3,
    title: "جلسه با کارشناس",
    body: "کارشناس معماری داخلی ما راهکارهای موجود و پیشنهادهایش برای فضای موردنظرتان را مطرح می‌کند.",
  },
  {
    n: 4,
    title: "ثبت سفارش",
    body: "پس از مشخص شدن مسیر طراحی و اجرای چیدمان فضای شما، سفارشتان را ثبت کنید و با خیالی آسوده از مسیر چیدمان فضای خود لذت ببرید.",
  },
];

export const consultationChannels = [
  {
    title: "مشاوره حضوری",
    body: "برای ثبت سفارش انجام پروژه‌های طراحی داخلی یک قرار ملاقات حضوری درخواست کنید.",
  },
  {
    title: "مشاوره مجازی",
    body: "برای ثبت سفارش و آگاهی از امکانات ما یک جلسه‌ی ویدیویی آنلاین داشته باشید.",
  },
  {
    title: "مشاوره تلفنی",
    body: "با کارشناسان معماری داخلی ما تماس بگیرید و در کوتاه‌ترین زمان راهنمایی دریافت کنید.",
  },
];

export const interiorStyles: InteriorStyle[] = [
  {
    id: "minimal",
    label: "مینیمال",
    description: "خطوط ساده، فضای باز و آرامش بصری",
    image: "/images/projects/aknoon-residence/11.jpg",
  },
  {
    id: "modern",
    label: "مدرن معاصر",
    description: "فرم‌های تمیز با جزئیات دقیق",
    image: "/images/projects/armon-hotel/12.jpg",
  },
  {
    id: "classic",
    label: "کلاسیک",
    description: "تعادل، جزئیات چوبی و حس ماندگار",
    image: "/images/projects/shenaj-villa/68.jpg",
  },
  {
    id: "rustic",
    label: "روستیک",
    description: "بافت طبیعی چوب و گرمای خانه‌ای",
    image: "/images/projects/shenaj-villa/46.jpg",
  },
  {
    id: "warm",
    label: "گرم و طبیعی",
    description: "نور ملایم، پارچه‌های نرم و رنگ‌های خاکی",
    image: "/images/projects/araz-suite/05.jpg",
  },
  {
    id: "luxury",
    label: "لوکس",
    description: "جزئیات ظریف، متریال ممتاز و فضای متمایز",
    image: "/images/projects/aknoon-residence/09.jpg",
  },
];

export const moodboardImages: MoodboardImage[] = [
  { id: "mb-01", src: "/images/projects/aknoon-residence/04.jpg", alt: "اقامتگاه آکنون — نشیمن", tags: ["warm", "modern", "luxury"] },
  { id: "mb-02", src: "/images/projects/aknoon-residence/05.jpg", alt: "اقامتگاه آکنون — جزئیات", tags: ["minimal", "modern"] },
  { id: "mb-03", src: "/images/projects/shenaj-villa/68.jpg", alt: "ویلای شناج — پذیرایی", tags: ["warm", "classic", "luxury"] },
  { id: "mb-04", src: "/images/projects/shenaj-villa/56.jpg", alt: "ویلای شناج — نشیمن", tags: ["warm", "minimal"] },
  { id: "mb-05", src: "/images/projects/armon-hotel/01.jpg", alt: "هتل آرمون — لابی", tags: ["luxury", "modern"] },
  { id: "mb-06", src: "/images/projects/armon-hotel/24.jpg", alt: "هتل آرمون — فضای عمومی", tags: ["modern", "classic"] },
  { id: "mb-07", src: "/images/projects/araz-suite/01.jpg", alt: "هتل آراز — پذیرش", tags: ["modern", "warm"] },
  { id: "mb-08", src: "/images/projects/araz-suite/12.jpg", alt: "هتل آراز — اتاق", tags: ["warm", "minimal"] },
  { id: "mb-09", src: "/images/projects/shenaj-villa/46.jpg", alt: "ویلای شناج — تراس", tags: ["rustic", "warm"] },
  { id: "mb-10", src: "/images/projects/aknoon-residence/09.jpg", alt: "اقامتگاه آکنون — اتاق خواب", tags: ["luxury", "classic"] },
  { id: "mb-11", src: "/images/projects/shenaj-villa/33.jpg", alt: "ویلای شناج — آشپزخانه", tags: ["modern", "warm"] },
  { id: "mb-12", src: "/images/projects/armon-hotel/48.jpg", alt: "هتل آرمون — اتاق", tags: ["luxury", "modern"] },
];

export const spaceTypeOptions = ["آپارتمان", "ویلا", "دفتر کار", "هتل / اقامتگاه", "فضای تجاری", "سایر"];
export const budgetOptions = ["زیر ۵۰۰ میلیون", "۵۰۰ تا ۱ میلیارد", "۱ تا ۲ میلیارد", "۲ تا ۵ میلیارد", "بالای ۵ میلیارد", "هنوز مشخص نیست"];
export const timelineOptions = ["کمتر از ۱ ماه", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "۶ تا ۱۲ ماه", "انعطاف‌پذیر"];
export const consultationOptions = ["حضوری در شوروم", "جلسه آنلاین", "مشاوره تلفنی"];

function scoreImage(image: MoodboardImage, selectedStyles: string[]) {
  if (!selectedStyles.length) return 0;
  return image.tags.filter((tag) => selectedStyles.includes(tag)).length;
}

function shuffle<T>(items: T[]) {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function pickMoodboardRound(selectedStyles: string[], excludeIds: string[], count = 3): MoodboardImage[] {
  const pool = moodboardImages.filter((item) => !excludeIds.includes(item.id));
  const ranked = [...pool].sort((a, b) => scoreImage(b, selectedStyles) - scoreImage(a, selectedStyles));
  const preferred = ranked.filter((item) => scoreImage(item, selectedStyles) > 0);
  const fallback = ranked.filter((item) => scoreImage(item, selectedStyles) === 0);
  const mixed = [...shuffle(preferred), ...shuffle(fallback)];
  return mixed.slice(0, count);
}

export type InteriorBriefPayload = {
  styles: string[];
  moodboardRound1?: string;
  moodboardRound2?: string;
  location: string;
  area: string;
  spaceType: string;
  roomCount: string;
  budget: string;
  timeline: string;
  consultation: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
};
