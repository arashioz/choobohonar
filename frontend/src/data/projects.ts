import { getProjectImages } from "@/data/project-image-manifest";

export type ProjectStat = { label: string; value: string };

/** Percentage-based position on a project image (0–100). */
export type ProductMarker = {
  id: string;
  productSlug: string;
  x: number;
  y: number;
};

export type AnnotatedImage = {
  src: string;
  alt?: string;
  markers?: ProductMarker[];
};

export type ProjectImage = string | AnnotatedImage;

export type ProjectSection = {
  title: string;
  body: string;
  image?: string;
  markers?: ProductMarker[];
};

export type ProjectNarrative = {
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  products?: { productSlug: string; body: string }[];
};

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
  heroMarkers?: ProductMarker[];
  location: string;
  area: string;
  client?: string;
  duration: string;
  scope: string[];
  summary: string;
  description: string;
  gallery: ProjectImage[];
  stats: ProjectStat[];
  sections: ProjectSection[];
  narrative?: ProjectNarrative;
  featured?: boolean;
  featuredImages?: string[];
};

const aknoon = getProjectImages("aknoon-residence");
const armon = getProjectImages("armon-hotel");
const araz = getProjectImages("araz-suite");
const shenaj = getProjectImages("shenaj-villa");

export const projects: Project[] = [
  {
    slug: "aknoon-residence",
    title: "اقامتگاه آکنون",
    category: "مسکونی",
    year: "۱۴۰۳",
    featured: true,
    featuredImages: [aknoon[3], aknoon[8]],
    image: aknoon[3],
    heroMarkers: [
      { id: "aknoon-hero-sofa", productSlug: "alder-sofa", x: 38, y: 58 },
      { id: "aknoon-hero-table", productSlug: "meranti-table", x: 62, y: 72 },
    ],
    location: "تهران، زعفرانیه",
    area: "۳۲۰ مترمربع",
    client: "خانواده‌ی مهرآیین",
    duration: "۱۱ ماه",
    scope: ["طراحی داخلی", "ساخت مبلمان سفارشی", "روکش‌کاری چوب", "نورپردازی معماری"],
    summary:
      "بازآفرینی یک آپارتمان خانوادگی با زبان چوب گرم و خطوط آرام؛ فضایی که آرامش و دوام را در کنار هم می‌نشاند.",
    description:
      "اقامتگاه آکنون با هدف تبدیل یک واحد مسکونی استاندارد به خانه‌ای شخصی و ماندگار طراحی شد. تیم خانه چوب و هنر از چوب سخت خشک‌شده در کوره، روکش‌های اصیل گردو و پرداخت‌های مات کم‌بازتاب استفاده کرد تا گرمای متریال در سراسر فضا یکدست بماند.",
    gallery: [...aknoon],
    stats: [
      { label: "متراژ", value: "۳۲۰ مترمربع" },
      { label: "موقعیت", value: "تهران، زعفرانیه" },
      { label: "سال اجرا", value: "۱۴۰۳" },
      { label: "مدت اجرا", value: "۱۱ ماه" },
      { label: "کارفرما", value: "خانواده‌ی مهرآیین" },
      { label: "دسته", value: "مسکونی" },
    ],
    sections: [
      {
        title: "چالش پروژه",
        body: "فضای اولیه با تقسیم‌بندی فشرده و نورگیری ناکافی، حس بسته‌بودن داشت. کارفرما خانه‌ای می‌خواست که هم برای زندگی روزمره آرام باشد و هم میزبانی از جمع‌های خانوادگی را به‌راحتی بپذیرد.",
        image: aknoon[4],
        markers: [{ id: "aknoon-s01-sofa", productSlug: "alder-sofa", x: 40, y: 60 }],
      },
      {
        title: "رویکرد طراحی",
        body: "دیوارهای غیرسازه‌ای حذف شدند تا نشیمن، ناهارخوری و آشپزخانه در یک پیوستار بصری قرار بگیرند. پنل‌های چوبی یکپارچه و نورپردازی غیرمستقیم، بافت رگه‌ی چوب را شب‌ها هم زنده نگه داشت.",
        image: aknoon[8],
        markers: [
          { id: "aknoon-s02-bed", productSlug: "maple-bed-set", x: 50, y: 45 },
          { id: "aknoon-s02-table", productSlug: "meranti-table", x: 72, y: 68 },
        ],
      },
    ],
    narrative: {
      title: "جزئیاتی که فضا را کامل می‌کنند",
      paragraphs: [
        "خانه‌ای یکپارچه و نورگیر که در آن هر سطح چوبی با اتصالات دقیق و پرداخت دستی اجرا شده است.",
        "در اقامتگاه آکنون، انتخاب مبلمان تنها یک تصمیم تزئینی نبود؛ هر قطعه باید با زبان چوبی فضا و ریتم زندگی خانواده هماهنگ می‌شد.",
      ],
      products: [
        {
          productSlug: "alder-sofa",
          body: "برای نشیمن خانوادگی، مبل الدر با اسکلت چوبی مستحکم و خطوط آرام انتخاب شد.",
        },
        {
          productSlug: "maple-bed-set",
          body: "سرویس میپل با پرداخت گردو، گرمای چوب را در اتاق خواب حفظ می‌کند.",
        },
        {
          productSlug: "meranti-table",
          body: "میز مرانتی پیوستار نشیمن و آشپزخانه را بدون شلوغ کردن فضا ممکن کرد.",
        },
        {
          productSlug: "celtis-buffet",
          body: "بوفه سلتیس در راهروی ورودی، اولین برخورد بصری با هویت چوبی خانه را شکل می‌دهد.",
        },
      ],
    },
  },
  {
    slug: "armon-hotel",
    title: "هتل آرمون",
    category: "هتل و اقامتی",
    year: "۱۴۰۲",
    featured: false,
    featuredImages: [armon[0], armon[24]],
    image: armon[0],
    heroMarkers: [
      { id: "armon-hero-buffet", productSlug: "celtis-buffet", x: 34, y: 52 },
      { id: "armon-hero-sofa", productSlug: "alder-sofa", x: 58, y: 64 },
    ],
    location: "اصفهان، خیابان چهارباغ",
    area: "۱۸۰۰ مترمربع",
    client: "گروه هتل‌های آرمون",
    duration: "۱۸ ماه",
    scope: ["طراحی لابی و پذیرش", "مبلمان سری اتاق‌ها", "مشبک‌کاری چوبی", "اجرای رستوران"],
    summary: "هویت‌بخشی چوبی به یک هتل شهری؛ از لابی پرتردد تا اتاق‌هایی که آرامش سفر را به مهمان برمی‌گردانند.",
    description:
      "هتل آرمون به فضایی نیاز داشت که در کنار دوام بالا برای محیط پرتردد تجاری، حس مهمان‌نوازی گرم ایرانی را منتقل کند. خانه چوب و هنر مسئول طراحی و ساخت مبلمان لابی، پیشخوان پذیرش، مشبک‌کاری‌های تزئینی و مبلمان استاندارد اتاق‌ها بود.",
    gallery: [...armon],
    stats: [
      { label: "متراژ", value: "۱۸۰۰ مترمربع" },
      { label: "موقعیت", value: "اصفهان، چهارباغ" },
      { label: "سال اجرا", value: "۱۴۰۲" },
      { label: "مدت اجرا", value: "۱۸ ماه" },
      { label: "کارفرما", value: "گروه هتل‌های آرمون" },
      { label: "تعداد اتاق", value: "۶۴ واحد" },
    ],
    sections: [
      {
        title: "چالش پروژه",
        body: "هتل شهری با ترافیک بالای مهمان به متریالی نیاز داشت که هم زیبا بماند و هم در برابر سایش روزانه دوام بیاورد.",
        image: armon[12],
        markers: [{ id: "armon-s01-sofa", productSlug: "alder-sofa", x: 44, y: 58 }],
      },
      {
        title: "رویکرد طراحی",
        body: "زبان طراحی حول مشبک‌کاری‌های چوبی الهام‌گرفته از معماری اصفهان شکل گرفت. مبلمان اتاق‌ها به‌صورت ماژولار طراحی شد تا اجرای انبوه با کیفیت یکنواخت ممکن شود.",
        image: armon[48],
        markers: [
          { id: "armon-s02-bed", productSlug: "maple-bed-set", x: 48, y: 44 },
          { id: "armon-s02-table", productSlug: "meranti-table", x: 70, y: 68 },
        ],
      },
      {
        title: "نتیجه",
        body: "لابی‌ای که از همان ورود حس اقامتگاهی اصیل را منتقل می‌کند و اتاق‌هایی با مبلمان مقاوم و آرام.",
        image: armon[90],
        markers: [{ id: "armon-s03-buffet", productSlug: "celtis-buffet", x: 38, y: 60 }],
      },
    ],
    narrative: {
      title: "متریال و مبلمان در مقیاس هتل",
      paragraphs: [
        "هتل آرمون توانست هویت بصری منسجمی در تمام طبقات حفظ کند؛ از لابی تا اتاق‌های مهمان.",
        "هر محصول باید هم با زبان طراحی برند هماهنگ می‌شد و هم استانداردهای دوام محیط پرتردد را پاس می‌کرد.",
      ],
      products: [
        {
          productSlug: "alder-sofa",
          body: "مبل الدر در لابی و فضاهای عمومی، نشستن راحت مهمانان را بدون به‌هم‌ریختن خطوط معماری ممکن کرد.",
        },
        {
          productSlug: "maple-bed-set",
          body: "سرویس میپل در اتاق‌های مهمان با پرداخت یکنواخت، تجربه‌ی اقامت را در تمام واحدها یکسان نگه داشت.",
        },
        {
          productSlug: "celtis-buffet",
          body: "بوفه سلتیس در پیشخوان پذیرش، اولین تماس بصری مهمان با هویت چوبی هتل را شکل می‌دهد.",
        },
        {
          productSlug: "meranti-table",
          body: "میز مرانتی در رستوران و فضاهای نشیمن لابی، پیوستگی چیدمان را در مقیاس بزرگ حفظ کرد.",
        },
      ],
    },
  },
  {
    slug: "araz-suite",
    title: "هتل آراز",
    category: "هتل و اقامتی",
    year: "۱۴۰۲",
    featured: false,
    featuredImages: [araz[0], araz[12]],
    image: araz[0],
    heroMarkers: [
      { id: "araz-hero-sofa", productSlug: "alder-sofa", x: 40, y: 58 },
      { id: "araz-hero-table", productSlug: "meranti-table", x: 64, y: 70 },
    ],
    location: "تبریز، ائل‌گلی",
    area: "۱۴۰۰ مترمربع",
    client: "مجموعه‌ی اقامتی آراز",
    duration: "۱۰ ماه",
    scope: ["طراحی لابی و رستوران", "مبلمان اتاق‌ها", "کابینت و کمد سفارشی", "پرداخت سطوح چوبی"],
    summary: "هتل اقامتی با چوب گرم و چیدمان یکپارچه؛ فضایی آرام برای مهمانان در مقیاس اجرای کامل.",
    description:
      "پروژه‌ی هتل آراز شامل طراحی داخلی و ساخت مبلمان برای فضاهای عمومی، اتاق‌ها و رستوران بود. تیم خانه چوب و هنر با انتخاب متریال مقاوم و پالت چوب روشن، فضایی یکدست و ماندگار برای مجموعه‌ی اقامتی آراز خلق کرد.",
    gallery: [...araz],
    stats: [
      { label: "متراژ", value: "۱۴۰۰ مترمربع" },
      { label: "موقعیت", value: "تبریز، ائل‌گلی" },
      { label: "سال اجرا", value: "۱۴۰۲" },
      { label: "مدت اجرا", value: "۱۰ ماه" },
      { label: "کارفرما", value: "مجموعه‌ی آراز" },
      { label: "دسته", value: "هتل و اقامتی" },
    ],
    sections: [
      {
        title: "چالش پروژه",
        body: "هماهنگی فضاهای عمومی پرتردد با اتاق‌های اقامتی و نیاز به متریالی با دوام بالا، اصلی‌ترین چالش پروژه بود.",
        image: araz[3],
        markers: [{ id: "araz-s01-buffet", productSlug: "celtis-buffet", x: 36, y: 54 }],
      },
      {
        title: "رویکرد طراحی",
        body: "چوب در سطوح تماس، مبلمان و جزئیات تزئینی به‌صورت یکپارچه اجرا شد تا هویت بصری هتل در تمام فضاها حفظ شود.",
        image: araz[10],
        markers: [
          { id: "araz-s02-sofa", productSlug: "alder-sofa", x: 46, y: 62 },
          { id: "araz-s02-table", productSlug: "meranti-table", x: 68, y: 72 },
        ],
      },
      {
        title: "نتیجه",
        body: "فضایی گرم و منسجم که از لابی تا اتاق‌ها، تجربه‌ی اقامت را یکدست می‌کند.",
        image: araz[20],
        markers: [{ id: "araz-s03-bed", productSlug: "maple-bed-set", x: 50, y: 46 }],
      },
    ],
    narrative: {
      title: "جزئیاتی که هویت هتل را یکپارچه می‌کنند",
      paragraphs: [
        "هتل آراز با پالت چوب روشن و چیدمان منظم، فضایی آرام برای مهمانان در مقیاس اجرای کامل خلق کرد.",
        "در این پروژه، هر قطعه مبلمان باید هم با فضاهای عمومی پرتردد سازگار می‌بود و هم در اتاق‌های اقامتی حس یکنواختی ایجاد می‌کرد.",
      ],
      products: [
        {
          productSlug: "alder-sofa",
          body: "مبل الدر در لابی و رستوران، نشستن گروهی مهمانان را بدون شلوغ کردن فضا ممکن کرد.",
        },
        {
          productSlug: "meranti-table",
          body: "میز مرانتی پیوند فضاهای نشیمن و غذاخوری را در یک خط بصری یکپارچه نگه داشت.",
        },
        {
          productSlug: "maple-bed-set",
          body: "سرویس میپل در اتاق‌ها، گرمای چوب را در تمام واحدهای اقامتی به‌صورت یکسان منتقل می‌کند.",
        },
        {
          productSlug: "celtis-buffet",
          body: "بوفه سلتیس در لابی، نقطه‌ی تمرکز چیدمان ورودی و اولین برخورد با هویت چوبی هتل است.",
        },
      ],
    },
  },
  {
    slug: "shenaj-villa",
    title: "ویلای شناج",
    category: "ویلایی",
    year: "۱۴۰۱",
    featured: true,
    featuredImages: [shenaj[67], shenaj[45]],
    image: shenaj[67],
    heroMarkers: [
      { id: "shenaj-hero-sofa", productSlug: "alder-sofa", x: 38, y: 56 },
      { id: "shenaj-hero-table", productSlug: "meranti-table", x: 62, y: 70 },
    ],
    location: "مازندران، نوشهر",
    area: "۴۸۰ مترمربع",
    client: "خانواده‌ی شناج",
    duration: "۱۴ ماه",
    scope: [
      "طراحی داخلی ویلا",
      "پذیرایی و نشیمن",
      "اتاق‌های خواب",
      "آشپزخانه و تراس",
      "ساخت مبلمان سفارشی",
    ],
    summary: "ویلایی در شمال ایران که در آن چوب، مرز میان فضای داخل و طبیعت اطراف را محو می‌کند.",
    description:
      "ویلای شناج در دل طبیعت شمال طراحی شد تا گفت‌وگوی پیوسته‌ای میان فضای داخلی و چشم‌انداز اطراف برقرار کند. پروژه شامل پذیرایی، نشیمن، اتاق‌های خواب، آشپزخانه، فضای کار، تراس و مشاعات بود و هر بخش با مبلمان و پوشش چوبی سفارشی اجرا شد.",
    gallery: [...shenaj],
    stats: [
      { label: "متراژ", value: "۴۸۰ مترمربع" },
      { label: "موقعیت", value: "مازندران، نوشهر" },
      { label: "سال اجرا", value: "۱۴۰۱" },
      { label: "مدت اجرا", value: "۱۴ ماه" },
      { label: "کارفرما", value: "خانواده‌ی شناج" },
      { label: "تعداد فضا", value: "۸ زون" },
    ],
    sections: [
      {
        title: "چالش پروژه",
        body: "اقلیم مرطوب شمال و نیاز به حداکثر ارتباط بصری با منظره‌ی اطراف، انتخاب متریال مقاوم و چیدمان یکپارچه در تمام فضاها را ضروری کرد.",
        image: shenaj[0],
        markers: [{ id: "shenaj-s01-sofa", productSlug: "alder-sofa", x: 42, y: 58 }],
      },
      {
        title: "رویکرد طراحی",
        body: "هر فضا — از پذیرایی و نشیمن تا اتاق خواب و آشپزخانه — با زبان چوبی یکسان و جزئیات سفارشی طراحی شد. تراس و مشاعات نیز در همین خط بصری اجرا شدند.",
        image: shenaj[55],
        markers: [
          { id: "shenaj-s02-bed", productSlug: "maple-bed-set", x: 52, y: 44 },
          { id: "shenaj-s02-table", productSlug: "meranti-table", x: 70, y: 66 },
        ],
      },
      {
        title: "نتیجه",
        body: "ویلایی که در آن نشستن داخل خانه، تجربه‌ای نزدیک به بودن در دل طبیعت است؛ با گالری کاملی از تصاویر اجراشده در تمام فضاها.",
        image: shenaj[45],
        markers: [{ id: "shenaj-s03-buffet", productSlug: "celtis-buffet", x: 40, y: 62 }],
      },
    ],
    narrative: {
      title: "فضاهای ویلای شناج",
      paragraphs: [
        "پذیرایی و نشیمن قلب خانه‌اند؛ جایی که خانواده و مهمان در کنار چوب گرم و نور طبیعی گرد هم می‌آیند.",
        "اتاق‌های خواب، آشپزخانه، فضای کار و تراس هر کدام با جزئیات اختصاصی اجرا شدند تا ویلا در تمام ساعات شبانه‌روز یکدست و کاربردی بماند.",
      ],
      products: [
        {
          productSlug: "alder-sofa",
          body: "مبل الدر در پذیرایی و نشیمن، نقطه‌ی تمرکز چیدمان و جایی برای گردهمایی خانواده در کنار منظره‌ی شمال است.",
        },
        {
          productSlug: "maple-bed-set",
          body: "سرویس میپل در اتاق‌های خواب، آرامش چوب گرم را در فضایی که به طبیعت اطراف باز است حفظ می‌کند.",
        },
        {
          productSlug: "meranti-table",
          body: "میز مرانتی پیوند نشیمن و آشپزخانه را بدون قطع دید به منظره ممکن کرد.",
        },
        {
          productSlug: "celtis-buffet",
          body: "بوفه سلتیس در راهروی ورودی، اولین برخورد بصری با هویت چوبی ویلا را شکل می‌دهد.",
        },
      ],
    },
  },
];

export const diversityImages = [
  { image: aknoon[6], caption: "اقامتگاه آکنون — نشیمن" },
  { image: shenaj[67], caption: "ویلای شناج — پذیرایی" },
  { image: armon[24], caption: "هتل آرمون — لابی" },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 3): Project[] {
  const current = projects.find((p) => p.slug === slug);
  if (!current) return projects.slice(0, count);
  const sameCategory = projects.filter((p) => p.slug !== slug && p.category === current.category);
  const others = projects.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getStandardProjects(): Project[] {
  return projects.filter((p) => !p.featured);
}

export function getProjectFeaturedImages(project: Project): string[] {
  const pool: string[] = [];

  const add = (src?: string) => {
    if (src && !pool.includes(src)) pool.push(src);
  };

  project.featuredImages?.forEach(add);
  add(project.image);
  for (const item of project.gallery) {
    add(typeof item === "string" ? item : item.src);
    if (pool.length >= 2) break;
  }

  if (pool.length === 1) {
    const extra = project.sections.find((s) => s.image && s.image !== pool[0]);
    add(extra?.image);
  }

  return pool.slice(0, 2);
}
