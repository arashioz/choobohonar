export type MaterialId = "wood" | "fabric" | "veneer" | "metal";

export type WoodFinish = {
  id: string;
  label: string;
  hex: string;
};

export type Material = {
  id: MaterialId;
  label: string;
  eyebrow: string;
  shortDescription: string;
  longDescription: string;
  image: string;
  highlights: { title: string; description: string }[];
};

/** Wood finish swatches (پرداخت چوب) — belong under materials, not collections. */
export const woodFinishes: WoodFinish[] = [
  { id: "walnut", label: "گردو", hex: "#5A3830" },
  { id: "mahogany", label: "ماهاگونی", hex: "#7B3A2A" },
  { id: "natural", label: "نچرال", hex: "#C9A37A" },
  { id: "hazelnut", label: "فندقی", hex: "#A9784E" },
  { id: "beige", label: "بژ روشن", hex: "#D8C4A8" },
];

export const materials: Material[] = [
  {
    id: "wood",
    label: "چوب",
    eyebrow: "متریال اصلی",
    shortDescription: "چوب سخت خشک‌شده در کوره، با رگه‌ی طبیعی و پرداخت‌های مات.",
    longDescription:
      "چوب ستون هویت خانه چوب و هنر است. از اسکلت و قاب تا سطوح نمایان، چوب سخت خشک‌شده در کوره با کنترل رطوبت انتخاب می‌شود تا دوام، ثبات ابعادی و زیبایی رگه‌ها در کنار هم بمانند. پرداخت‌های مات کم‌بازتاب، عمق رنگ را حفظ می‌کنند و حضور آرام متریال را در فضا تقویت می‌کنند.",
    image: "/images/aknoon-16.jpg",
    highlights: [
      {
        title: "خشک‌کردن در کوره",
        description: "رطوبت چوب تا محدوده استاندارد کنترل می‌شود تا از تابیدگی و ترک در طول زمان جلوگیری شود.",
      },
      {
        title: "پرداخت چندلایه",
        description: "سنباده، بتونه و پوشش‌های پایه‌آب یا پلی‌اورتان مات، رگه را زنده نگه می‌دارند و مقاومت روزمره می‌سازند.",
      },
      {
        title: "طیف پرداخت",
        description: "از گردو و ماهاگونی تا نچرال و فندقی — هر پرداخت شخصیت متفاوتی به همان سازه می‌دهد.",
      },
    ],
  },
  {
    id: "fabric",
    label: "پارچه",
    eyebrow: "رویه و بافت",
    shortDescription: "پارچه‌های ممتاز برای رویه مبلمان؛ قابل انتخاب بر اساس لمس، دوام و پالت فضا.",
    longDescription:
      "پارچه لایه لمس‌پذیر مبلمان است؛ جایی که راحتی روزانه با زیبایی بصری گره می‌خورد. طیف پارچه‌ها از بافت‌های نرم خانگی تا رویه‌های مقاوم‌تر برای فضاهای پرتردد انتخاب می‌شوند و در شوروم کنار نمونه‌های واقعی چوب و روکش بررسی می‌گردند.",
    image: "/images/aknoon-02.jpg",
    highlights: [
      {
        title: "انتخاب بر اساس فضا",
        description: "برای نشیمن خانگی، مهمان‌پذیر یا اقامتی، دوام سایشی و نگهداری رویه را با هم می‌سنجیم.",
      },
      {
        title: "هماهنگی با چوب",
        description: "رنگ و بافت پارچه در کنار پرداخت چوب و جزئیات فلزی هماهنگ می‌شود تا مجموعه یکدست بماند.",
      },
      {
        title: "نمونه‌گیری در شوروم",
        description: "پیش از سفارش، نمونه‌های واقعی پارچه زیر نور طبیعی و مصنوعی فضا بررسی می‌شوند.",
      },
    ],
  },
  {
    id: "veneer",
    label: "روکش",
    eyebrow: "سطح و رگه",
    shortDescription: "روکش‌های اصیل چوب طبیعی برای سطوح بزرگ با رگه‌ای یکدست و ماندگار.",
    longDescription:
      "روکش اصیل چوب امکان اجرای سطوح وسیع با رگه‌ای هماهنگ را می‌دهد؛ بدنه‌ها و پنل‌ها روی هسته‌ی پایدار روکش می‌شوند و لبه‌ها با دقت نوارکاری و پرداخت می‌گردند. نتیجه، سطحی است که گرمای چوب را دارد و در مقیاس مبلمان و معماری داخلی یکپارچه می‌ماند.",
    image: "/images/aknoon-18.jpg",
    highlights: [
      {
        title: "روکش طبیعی",
        description: "از گونه‌هایی مثل گردو برای عمق رنگ و رگه‌ی مشخص استفاده می‌شود.",
      },
      {
        title: "هسته پایدار",
        description: "ام‌دی‌اف یا پنل‌های مهندسی‌شده بستر صاف و ثابتی برای روکش‌گیری فراهم می‌کنند.",
      },
      {
        title: "لبه‌کاری دستی",
        description: "نوارکاری و پرداخت لبه‌ها کیفیت سطح را در جزئیات نزدیک کامل می‌کند.",
      },
    ],
  },
  {
    id: "metal",
    label: "فلز",
    eyebrow: "اتصالات و جزئیات",
    shortDescription: "جزئیات و اتصالات فلزی برای استحکام سازه و تأکید بصری ظریف.",
    longDescription:
      "فلز در مبلمان خانه چوب و هنر نقش سازه‌ای و تزئینی دارد؛ از اتصالات تقویت‌کننده گرفته تا پایه‌ها و یراق‌آلات. پرداخت فلز با پالت چوب و پارچه هماهنگ می‌شود تا جزئیات، محکم و در عین حال آرام در ترکیب کلی فضا بنشینند.",
    image: "/images/aknoon-09.jpg",
    highlights: [
      {
        title: "اتصالات مهندسی‌شده",
        description: "فلز جایی به کار می‌رود که دوام سازه و دقت اتصال اهمیت دارد.",
      },
      {
        title: "جزئیات بصری",
        description: "پایه‌ها، دستگیره‌ها و خطوط فلزی می‌توانند ریتم بصری مجموعه را تعریف کنند.",
      },
      {
        title: "هماهنگی پرداخت",
        description: "رنگ و بافت فلز با چوب و روکش هماهنگ می‌شود تا تضاد یا همگرایی عمدی ایجاد شود.",
      },
    ],
  },
];

export function getMaterial(id: string): Material | undefined {
  return materials.find((material) => material.id === id);
}

export function getWoodFinish(id: string): WoodFinish | undefined {
  return woodFinishes.find((finish) => finish.id === id);
}
