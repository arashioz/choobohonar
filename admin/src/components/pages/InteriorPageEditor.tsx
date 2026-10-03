"use client";

import { useState, type ReactNode } from "react";
import { uploadMedia } from "@/lib/upload";
import { storedMediaPath } from "@/components/pages/HomeHeroEditor";

type ImageSlot = { image: string; previousImage: string };
type Style = ImageSlot & { id: string; label: string; description: string };
type Piece = ImageSlot & { id: string; eyebrow: string; title: string; description: string; href: string };
type Mood = { id: string; src: string; previousSrc: string; alt: string; tags: string };
type Copy = { title: string; body: string };
type Heading = { eyebrow: string; title: string };

type InteriorPage = {
  metaTitle: string;
  metaDescription: string;
  hero: ImageSlot & {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  intro: Heading & { body: string; support: string };
  styles: Style[];
  benefitsHeading: Heading;
  benefits: Copy[];
  processHeading: Heading;
  processSteps: (Copy & { n: number })[];
  customizationHeading: Heading & { body: string };
  customizationPieces: Piece[];
  projects: Heading & { body: string; linkLabel: string; linkHref: string };
  consultation: Heading & { body: string; ctaLabel: string; ctaHref: string };
  consultationChannels: Copy[];
  moodboardImages: Mood[];
  spaceTypeOptions: string[];
  budgetOptions: string[];
  timelineOptions: string[];
  consultationOptions: string[];
};

const DEFAULTS: InteriorPage = {
  metaTitle: "خدمات معماری داخلی | خانه چوب و هنر",
  metaDescription: "برای دریافت مشاوره چیدمان و خدمات طراحی داخلی، با کارشناسان معماری داخلی خانه چوب و هنر صحبت کنید. امکان مشاوره حضوری، تلفنی و آنلاین.",
  hero: {
    eyebrow: "خدمات معماری داخلی",
    title: "خدمات طراحی داخلی و مشاوره‌ی چیدمان",
    subtitle: "با کارشناسان معماری داخلی ما صحبت کنید",
    description: "در «خانه چوب و هنر» یک تیم متخصص در کنار شماست. برای چیدن فضایی که همه‌ی جزئیاتش با نیازهای شما سازگار باشد، از خدمات مشاوره، طراحی و اجرای تیم معماری داخلی ما استفاده کنید.",
    image: "/images/projects/aknoon-residence/04.jpg",
    previousImage: "",
    primaryCtaLabel: "شروع فرم سفارش طراحی",
    primaryCtaHref: "/interior-architecture-services/order",
    secondaryCtaLabel: "مشاهده پروژه‌ها",
    secondaryCtaHref: "/projects",
  },
  intro: {
    eyebrow: "از طراحی تا اجرا",
    title: "پروژه‌های بزرگ و کوچک",
    body: "گام اول یک چیدمان موفق، درک نیازهاست و ما در خانه چوب و هنر آماده گفت‌وگو با شما هستیم. با شنیدن انتظار شما از فضایی که در اختیار دارید و حال‌وهوایی که دوست دارید تداعی کند، طراحی پروژه در مسیری که ویژه‌ی شماست آغاز می‌شود.",
    support: "در انتخاب سایز و مدل مناسب مبلمان برای نشیمن خانه‌ی نو تردید دارید؟ به دنبال فرشی هستید که با دیگر وسایل خانه جور دربیاید؟ برای چیدن دفتر کار خود به نظر یک کارشناس حرفه‌ای احتیاج دارید؟ تیم معماری داخلی خانه چوب و هنر در کنار شماست.",
  },
  styles: [
    { id: "minimal", label: "مینیمال", description: "خطوط ساده، فضای باز و آرامش بصری", image: "/images/projects/aknoon-residence/11.jpg", previousImage: "" },
    { id: "modern", label: "مدرن معاصر", description: "فرم‌های تمیز با جزئیات دقیق", image: "/images/projects/armon-hotel/12.jpg", previousImage: "" },
    { id: "classic", label: "کلاسیک", description: "تعادل، جزئیات چوبی و حس ماندگار", image: "/images/projects/shenaj-villa/68.jpg", previousImage: "" },
    { id: "rustic", label: "روستیک", description: "بافت طبیعی چوب و گرمای خانه‌ای", image: "/images/projects/shenaj-villa/46.jpg", previousImage: "" },
    { id: "warm", label: "گرم و طبیعی", description: "نور ملایم، پارچه‌های نرم و رنگ‌های خاکی", image: "/images/projects/araz-suite/05.jpg", previousImage: "" },
    { id: "luxury", label: "لوکس", description: "جزئیات ظریف، متریال ممتاز و فضای متمایز", image: "/images/projects/aknoon-residence/09.jpg", previousImage: "" },
  ],
  benefitsHeading: { eyebrow: "چرا خانه چوب و هنر", title: "تخصص ما در ترجمه‌ی سلیقه‌ی شما به فضا" },
  benefits: [
    { title: "تنوع، کیفیت و نوآوری", body: "از رنگ و جنس پارچه روکش مبلمان گرفته تا تنوعی از فرش و اکسسوری‌های کاربردی و دکوراتیو برای هر سلیقه." },
    { title: "طراحی شخصی‌سازی‌شده", body: "طراحی چیدمان بر اساس نقشه‌ی فضای شما، از یک آپارتمان کوچک گرفته تا ویلایی چندین‌خوابه." },
    { title: "مودبورد مخصوص شما", body: "ما سلیقه و نیاز شما را به زبان رنگ و مبلمان و دکوراسیون ترجمه می‌کنیم؛ راهنمایی ماندگار برای چیدمان خانه." },
    { title: "خلق فضایی یکتا", body: "خلق فضایی بی‌مانند برای شما، با دانش کامل نسبت به ترندهای جهان طراحی و دکوراسیون و با استفاده از تجربه‌ی سالیان." },
  ],
  processHeading: { eyebrow: "فرآیند اجرا", title: "گام‌به‌گام در فرآیند اجرای پروژه" },
  processSteps: [
    { n: 1, title: "قرار ملاقات", body: "با کارشناسان معماری داخلی ما تماس بگیرید و بر اساس نیاز، برای یک ملاقات حضوری، آنلاین یا جلسه‌ی تلفنی زمانی هماهنگ کنید." },
    { n: 2, title: "آماده‌سازی", body: "برای کمک به کارشناسان ما عکس‌هایی با کیفیت از فضای مورد نظر خود تهیه کنید. اندازه‌های فضا را بگیرید و از بایدها و نبایدهای مدنظرتان لیستی تهیه کنید." },
    { n: 3, title: "جلسه با کارشناس", body: "کارشناس معماری داخلی ما راهکارهای موجود و پیشنهادهایش برای فضای موردنظرتان را مطرح می‌کند." },
    { n: 4, title: "ثبت سفارش", body: "پس از مشخص شدن مسیر طراحی و اجرای چیدمان فضای شما، سفارشتان را ثبت کنید و با خیالی آسوده از مسیر چیدمان فضای خود لذت ببرید." },
  ],
  customizationHeading: {
    eyebrow: "سفارشی‌سازی",
    title: "قطعاتی که برای فضای شما ساخته می‌شوند",
    body: "مبلمان و عناصر چوبی هر پروژه با ابعاد، روکش و جزئیات همان فضا طراحی و در کارگاه ساخته می‌شوند — نه از روی کاتالوگ آماده.",
  },
  customizationPieces: [
    { id: "custom-living", eyebrow: "نشیمن", title: "مبلمان سفارشی نشیمن", description: "کاناپه، میز و کنسول با ابعاد پلان و روکش هماهنگ با معماری خانه.", image: "/images/projects/aknoon-residence/04.jpg", previousImage: "", href: "/projects/aknoon-residence" },
    { id: "custom-dining", eyebrow: "غذاخوری", title: "میز و صندلی پروژه‌ای", description: "غذاخوری با تناسب فضای ویلا و جزئیات چوب هم‌خانواده با بقیه فضا.", image: "/images/projects/shenaj-villa/68.jpg", previousImage: "", href: "/projects/shenaj-villa" },
    { id: "custom-hospitality", eyebrow: "هتل و اقامت", title: "لابی و فضاهای عمومی", description: "ساخت سفارشی برای لابی و سوئیت؛ دوام بالا با زبان بصری برند فضا.", image: "/images/projects/armon-hotel/01.jpg", previousImage: "", href: "/projects/armon-hotel" },
    { id: "custom-bedroom", eyebrow: "اتاق خواب", title: "سرویس خواب سفارشی", description: "تخت و پاتختی با مقیاس اتاق و پرداخت هماهنگ با پالت پروژه.", image: "/images/projects/araz-suite/12.jpg", previousImage: "", href: "/projects/araz-suite" },
  ],
  projects: {
    eyebrow: "نمونه‌کارها",
    title: "پروژه‌هایی که با طراحی داخلی شکل گرفته‌اند",
    body: "از آپارتمان‌های مسکونی تا هتل‌ها و ویلاها — هر پروژه روایت واقعی از همکاری تیم معماری داخلی و کارگاه ساخت خانه چوب و هنر است.",
    linkLabel: "مشاهده همه پروژه‌ها",
    linkHref: "/projects",
  },
  consultation: {
    eyebrow: "شروع همکاری",
    title: "چیدمان فضای محبوبت را به ما بسپار",
    body: "برای ثبت سفارش طراحی داخلی، فرم هوشمند را تکمیل کنید تا سلیقه و نیازهای فنی شما را بهتر بشناسیم؛ یا مستقیماً با کارشناسان ما در تماس باشید.",
    ctaLabel: "شروع فرم سفارش",
    ctaHref: "/interior-architecture-services/order",
  },
  consultationChannels: [
    { title: "مشاوره حضوری", body: "برای ثبت سفارش انجام پروژه‌های طراحی داخلی یک قرار ملاقات حضوری درخواست کنید." },
    { title: "مشاوره مجازی", body: "برای ثبت سفارش و آگاهی از امکانات ما یک جلسه‌ی ویدیویی آنلاین داشته باشید." },
    { title: "مشاوره تلفنی", body: "با کارشناسان معماری داخلی ما تماس بگیرید و در کوتاه‌ترین زمان راهنمایی دریافت کنید." },
  ],
  moodboardImages: [
    { id: "mb-01", src: "/images/projects/aknoon-residence/04.jpg", previousSrc: "", alt: "اقامتگاه آکنون — نشیمن", tags: "warm, modern, luxury" },
    { id: "mb-02", src: "/images/projects/aknoon-residence/05.jpg", previousSrc: "", alt: "اقامتگاه آکنون — جزئیات", tags: "minimal, modern" },
    { id: "mb-03", src: "/images/projects/shenaj-villa/68.jpg", previousSrc: "", alt: "ویلای شناج — پذیرایی", tags: "warm, classic, luxury" },
    { id: "mb-04", src: "/images/projects/shenaj-villa/56.jpg", previousSrc: "", alt: "ویلای شناج — نشیمن", tags: "warm, minimal" },
    { id: "mb-05", src: "/images/projects/armon-hotel/01.jpg", previousSrc: "", alt: "هتل آرمون — لابی", tags: "luxury, modern" },
    { id: "mb-06", src: "/images/projects/armon-hotel/24.jpg", previousSrc: "", alt: "هتل آرمون — فضای عمومی", tags: "modern, classic" },
    { id: "mb-07", src: "/images/projects/araz-suite/01.jpg", previousSrc: "", alt: "هتل آراز — پذیرش", tags: "modern, warm" },
    { id: "mb-08", src: "/images/projects/araz-suite/12.jpg", previousSrc: "", alt: "هتل آراز — اتاق", tags: "warm, minimal" },
    { id: "mb-09", src: "/images/projects/shenaj-villa/46.jpg", previousSrc: "", alt: "ویلای شناج — تراس", tags: "rustic, warm" },
    { id: "mb-10", src: "/images/projects/aknoon-residence/09.jpg", previousSrc: "", alt: "اقامتگاه آکنون — اتاق خواب", tags: "luxury, classic" },
    { id: "mb-11", src: "/images/projects/shenaj-villa/33.jpg", previousSrc: "", alt: "ویلای شناج — آشپزخانه", tags: "modern, warm" },
    { id: "mb-12", src: "/images/projects/armon-hotel/48.jpg", previousSrc: "", alt: "هتل آرمون — اتاق", tags: "luxury, modern" },
  ],
  spaceTypeOptions: ["آپارتمان", "ویلا", "دفتر کار", "هتل / اقامتگاه", "فضای تجاری", "سایر"],
  budgetOptions: ["زیر ۵۰۰ میلیون", "۵۰۰ تا ۱ میلیارد", "۱ تا ۲ میلیارد", "۲ تا ۵ میلیارد", "بالای ۵ میلیارد", "هنوز مشخص نیست"],
  timelineOptions: ["کمتر از ۱ ماه", "۱ تا ۳ ماه", "۳ تا ۶ ماه", "۶ تا ۱۲ ماه", "انعطاف‌پذیر"],
  consultationOptions: ["حضوری در شوروم", "جلسه آنلاین", "مشاوره تلفنی"],
};

const inputClass = "mt-1 w-full rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-forest/30";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function matchById(list: unknown[], id: string, index: number) {
  const records = list.map(asRecord);
  const matched = records.find((entry) => entry.id === id);
  if (matched) return matched;
  const atIndex = records[index];
  if (!atIndex || atIndex.id === id || atIndex.id == null || atIndex.id === "") return atIndex || {};
  return {};
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function previousMedia(value: unknown) {
  return typeof value === "string" ? value : "";
}

function tagText(value: unknown, fallback: string) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join(", ");
  return typeof value === "string" ? value : fallback;
}

function replaceImage<T extends ImageSlot>(item: T, url: string): T {
  return { ...item, image: url, previousImage: item.image === url ? item.previousImage : item.image };
}

function undoImage<T extends ImageSlot>(item: T): T {
  if (!item.previousImage || item.previousImage === item.image) return item;
  return { ...item, image: item.previousImage, previousImage: "" };
}

function mergeSectionEdit(base: unknown, edited: unknown, latest: unknown): unknown {
  if (Array.isArray(edited) && Array.isArray(latest)) {
    const baseList = Array.isArray(base) ? base : [];
    return edited.map((item, index) => mergeSectionEdit(baseList[index], item, latest[index] ?? item));
  }
  if (
    edited && base && latest &&
    typeof edited === "object" && typeof base === "object" && typeof latest === "object" &&
    !Array.isArray(edited) && !Array.isArray(base) && !Array.isArray(latest)
  ) {
    const next = { ...(latest as Record<string, unknown>) };
    const editedRecord = edited as Record<string, unknown>;
    const baseRecord = base as Record<string, unknown>;
    for (const key of Object.keys(editedRecord)) {
      if (JSON.stringify(editedRecord[key]) !== JSON.stringify(baseRecord[key])) {
        next[key] = mergeSectionEdit(baseRecord[key], editedRecord[key], (latest as Record<string, unknown>)[key]);
      }
    }
    return next;
  }
  return edited;
}

function readInteriorPage(data: Record<string, unknown> | undefined): InteriorPage {
  const items = asRecord(data?.items);
  const hero = asRecord(items.hero);
  const intro = asRecord(items.intro);
  const benefitsHeading = asRecord(items.benefitsHeading);
  const processHeading = asRecord(items.processHeading);
  const customizationHeading = asRecord(items.customizationHeading);
  const projects = asRecord(items.projects);
  const consultation = asRecord(items.consultation);
  const styles = Array.isArray(items.styles) ? items.styles : [];
  const benefits = Array.isArray(items.benefits) ? items.benefits : [];
  const steps = Array.isArray(items.processSteps) ? items.processSteps : [];
  const pieces = Array.isArray(items.customizationPieces) ? items.customizationPieces : [];
  const channels = Array.isArray(items.consultationChannels) ? items.consultationChannels : [];
  const moodboard = Array.isArray(items.moodboardImages) ? items.moodboardImages : [];
  const list = (key: "spaceTypeOptions" | "budgetOptions" | "timelineOptions" | "consultationOptions") => {
    const saved = Array.isArray(items[key]) ? items[key] : [];
    return DEFAULTS[key].map((fallback, index) => text(saved[index], fallback));
  };

  return {
    metaTitle: text(items.metaTitle, DEFAULTS.metaTitle),
    metaDescription: text(items.metaDescription, DEFAULTS.metaDescription),
    hero: {
      eyebrow: text(hero.eyebrow, DEFAULTS.hero.eyebrow),
      title: text(hero.title, DEFAULTS.hero.title),
      subtitle: text(hero.subtitle, DEFAULTS.hero.subtitle),
      description: text(hero.description, DEFAULTS.hero.description),
      image: text(hero.image, DEFAULTS.hero.image),
      previousImage: previousMedia(hero.previousImage),
      primaryCtaLabel: text(hero.primaryCtaLabel, DEFAULTS.hero.primaryCtaLabel),
      primaryCtaHref: text(hero.primaryCtaHref, DEFAULTS.hero.primaryCtaHref),
      secondaryCtaLabel: text(hero.secondaryCtaLabel, DEFAULTS.hero.secondaryCtaLabel),
      secondaryCtaHref: text(hero.secondaryCtaHref, DEFAULTS.hero.secondaryCtaHref),
    },
    intro: {
      eyebrow: text(intro.eyebrow, DEFAULTS.intro.eyebrow),
      title: text(intro.title, DEFAULTS.intro.title),
      body: text(intro.body, DEFAULTS.intro.body),
      support: text(intro.support, DEFAULTS.intro.support),
    },
    styles: DEFAULTS.styles.map((fallback, index) => {
      const item = matchById(styles, fallback.id, index);
      return {
        id: fallback.id,
        label: text(item.label, fallback.label),
        description: text(item.description, fallback.description),
        image: text(item.image, fallback.image),
        previousImage: previousMedia(item.previousImage),
      };
    }),
    benefitsHeading: {
      eyebrow: text(benefitsHeading.eyebrow, DEFAULTS.benefitsHeading.eyebrow),
      title: text(benefitsHeading.title, DEFAULTS.benefitsHeading.title),
    },
    benefits: DEFAULTS.benefits.map((fallback, index) => {
      const item = asRecord(benefits[index]);
      return { title: text(item.title, fallback.title), body: text(item.body, fallback.body) };
    }),
    processHeading: {
      eyebrow: text(processHeading.eyebrow, DEFAULTS.processHeading.eyebrow),
      title: text(processHeading.title, DEFAULTS.processHeading.title),
    },
    processSteps: DEFAULTS.processSteps.map((fallback, index) => {
      const item = asRecord(steps[index]);
      return { n: fallback.n, title: text(item.title, fallback.title), body: text(item.body, fallback.body) };
    }),
    customizationHeading: {
      eyebrow: text(customizationHeading.eyebrow, DEFAULTS.customizationHeading.eyebrow),
      title: text(customizationHeading.title, DEFAULTS.customizationHeading.title),
      body: text(customizationHeading.body, DEFAULTS.customizationHeading.body),
    },
    customizationPieces: DEFAULTS.customizationPieces.map((fallback, index) => {
      const item = matchById(pieces, fallback.id, index);
      return {
        id: fallback.id,
        eyebrow: text(item.eyebrow, fallback.eyebrow),
        title: text(item.title, fallback.title),
        description: text(item.description, fallback.description),
        image: text(item.image, fallback.image),
        previousImage: previousMedia(item.previousImage),
        href: text(item.href, fallback.href),
      };
    }),
    projects: {
      eyebrow: text(projects.eyebrow, DEFAULTS.projects.eyebrow),
      title: text(projects.title, DEFAULTS.projects.title),
      body: text(projects.body, DEFAULTS.projects.body),
      linkLabel: text(projects.linkLabel, DEFAULTS.projects.linkLabel),
      linkHref: text(projects.linkHref, DEFAULTS.projects.linkHref),
    },
    consultation: {
      eyebrow: text(consultation.eyebrow, DEFAULTS.consultation.eyebrow),
      title: text(consultation.title, DEFAULTS.consultation.title),
      body: text(consultation.body, DEFAULTS.consultation.body),
      ctaLabel: text(consultation.ctaLabel, DEFAULTS.consultation.ctaLabel),
      ctaHref: text(consultation.ctaHref, DEFAULTS.consultation.ctaHref),
    },
    consultationChannels: DEFAULTS.consultationChannels.map((fallback, index) => {
      const item = asRecord(channels[index]);
      return { title: text(item.title, fallback.title), body: text(item.body, fallback.body) };
    }),
    moodboardImages: DEFAULTS.moodboardImages.map((fallback, index) => {
      const item = matchById(moodboard, fallback.id, index);
      return {
        id: fallback.id,
        src: text(item.src, fallback.src),
        previousSrc: previousMedia(item.previousSrc),
        alt: text(item.alt, fallback.alt),
        tags: tagText(item.tags, fallback.tags),
      };
    }),
    spaceTypeOptions: list("spaceTypeOptions"),
    budgetOptions: list("budgetOptions"),
    timelineOptions: list("timelineOptions"),
    consultationOptions: list("consultationOptions"),
  };
}

function storedItems(page: InteriorPage) {
  return {
    ...page,
    moodboardImages: page.moodboardImages.map((item) => ({
      ...item,
      tags: item.tags.split(/[,،]/).map((tag) => tag.trim()).filter(Boolean),
    })),
  };
}

function previewSrc(src: string) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("/uploads/")) return src;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://choobohonar.com").replace(/\/$/, "");
  return `${site}${src.startsWith("/") ? src : `/${src}`}`;
}

type Patch = (data: Record<string, unknown>) => Record<string, unknown>;

type Props = {
  data: Record<string, unknown>;
  onPatch: (recipe: Patch) => void;
  onBusyChange?: (busy: boolean) => void;
  onProgress?: (percent: number) => void;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[11px] text-forest/45">{label}{children}</label>;
}

function Block({ kicker, title, hint, children }: { kicker: string; title: string; hint: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-forest/10 bg-white/80 p-5 sm:p-6">
      <p className="text-[10px] tracking-[0.18em] text-brick" dir="ltr">{kicker}</p>
      <h2 className="mt-2 text-lg font-medium text-forest">{title}</h2>
      <p className="mt-2 max-w-2xl text-xs leading-6 text-forest/50">{hint}</p>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function MediaCard({ title, src, busy, locked, progress, onFile, onUndo, onReset }: { title: string; src: string; busy: boolean; locked: boolean; progress: number; onFile: (file: File | undefined) => void; onUndo?: () => void; onReset?: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
      <>
        {/* eslint-disable-next-line @next/next/no-img-element -- uploaded /uploads files are outside the admin image optimizer */}
        <img src={previewSrc(src)} alt={title} className="aspect-[4/3] w-full object-cover" />
      </>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-sm font-medium text-forest">{title}</p>
          <p className="mt-2 truncate text-[10px] text-forest/35" dir="ltr">{src}</p>
        </div>
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-forest/20 bg-white px-3 py-3 text-xs text-forest/70 hover:border-forest/35">
          {busy ? `در حال آپلود… ${progress}٪` : "آپلود عکس جدید"}
          <input type="file" accept="image/*" className="sr-only" disabled={locked} onChange={(event) => { onFile(event.target.files?.[0]); event.currentTarget.value = ""; }} />
        </label>
        {onUndo ? <button type="button" onClick={onUndo} disabled={locked} className="text-[11px] text-forest underline-offset-2 hover:underline disabled:opacity-40">بازگشت به حالت قبلی</button> : null}
        {onReset ? <button type="button" onClick={onReset} disabled={locked} className="text-[11px] text-forest/45 underline-offset-2 hover:underline disabled:opacity-40">بازگشت به عکس پیش‌فرض</button> : null}
      </div>
    </div>
  );
}

export default function InteriorPageEditor({ data, onPatch, onBusyChange, onProgress }: Props) {
  const page = readInteriorPage(data);
  const [slot, setSlot] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function write(patch: Partial<InteriorPage>) {
    onPatch((current) => {
      const latest = readInteriorPage(current);
      const next = { ...latest };
      for (const key of Object.keys(patch) as (keyof InteriorPage)[]) {
        next[key] = mergeSectionEdit(page[key], patch[key], latest[key]) as never;
      }
      return { ...current, items: storedItems(next) };
    });
  }

  async function upload(target: string, file: File | undefined, apply: (current: InteriorPage, url: string) => Partial<InteriorPage>) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویر قابل آپلود است.");
      return;
    }
    setSlot(target);
    setProgress(0);
    setError("");
    onBusyChange?.(true);
    try {
      const url = storedMediaPath(await uploadMedia(file, ({ percent }) => {
        setProgress(percent);
        onProgress?.(percent);
      }));
      onPatch((current) => {
        const latest = readInteriorPage(current);
        const applied = { ...latest, ...apply(latest, url) };
        return { ...current, items: storedItems(applied) };
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود انجام نشد");
    } finally {
      setSlot(null);
      setProgress(0);
      onBusyChange?.(false);
    }
  }

  return (
    <div className="space-y-5">
      {error ? <p className="rounded-xl border border-brick/15 bg-brick/[0.05] px-4 py-3 text-xs text-brick">{error}</p> : null}

      <Block kicker="SEO" title="عنوان صفحه" hint="عنوان تب مرورگر و توضیح نتیجه جست‌وجو. بعد از تغییر، «به‌روزرسانی» را بزنید.">
        <Field label="عنوان"><input value={page.metaTitle} onChange={(event) => write({ metaTitle: event.target.value })} className={inputClass} /></Field>
        <Field label="توضیحات"><textarea value={page.metaDescription} onChange={(event) => write({ metaDescription: event.target.value })} className={`${inputClass} min-h-24`} /></Field>
      </Block>

      <Block kicker="HERO" title="تصویر و معرفی" hint="عکس پس‌زمینه، تیترها و دو دکمه بالای صفحه.">
        <Field label="عنوان کوچک"><input value={page.hero.eyebrow} onChange={(event) => write({ hero: { ...page.hero, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><textarea value={page.hero.title} onChange={(event) => write({ hero: { ...page.hero, title: event.target.value } })} className={`${inputClass} min-h-20`} /></Field>
        <Field label="زیرتیتر"><input value={page.hero.subtitle} onChange={(event) => write({ hero: { ...page.hero, subtitle: event.target.value } })} className={inputClass} /></Field>
        <Field label="توضیح"><textarea value={page.hero.description} onChange={(event) => write({ hero: { ...page.hero, description: event.target.value } })} className={`${inputClass} min-h-28`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="متن دکمه اصلی"><input value={page.hero.primaryCtaLabel} onChange={(event) => write({ hero: { ...page.hero, primaryCtaLabel: event.target.value } })} className={inputClass} /></Field>
          <Field label="لینک دکمه اصلی"><input dir="ltr" value={page.hero.primaryCtaHref} onChange={(event) => write({ hero: { ...page.hero, primaryCtaHref: event.target.value } })} className={inputClass} /></Field>
          <Field label="متن دکمه دوم"><input value={page.hero.secondaryCtaLabel} onChange={(event) => write({ hero: { ...page.hero, secondaryCtaLabel: event.target.value } })} className={inputClass} /></Field>
          <Field label="لینک دکمه دوم"><input dir="ltr" value={page.hero.secondaryCtaHref} onChange={(event) => write({ hero: { ...page.hero, secondaryCtaHref: event.target.value } })} className={inputClass} /></Field>
        </div>
        <MediaCard title="عکس هیرو" src={page.hero.image} busy={slot === "hero"} locked={Boolean(slot)} progress={progress} onFile={(file) => upload("hero", file, (current, url) => ({ hero: replaceImage(current.hero, url) }))} onUndo={page.hero.previousImage ? () => write({ hero: undoImage(page.hero) }) : undefined} onReset={page.hero.image === DEFAULTS.hero.image ? undefined : () => write({ hero: { ...page.hero, image: DEFAULTS.hero.image } })} />
      </Block>

      <Block kicker="INTRO" title="از طراحی تا اجرا" hint="متن معرفی و اسلاید سبک‌ها. همین سبک‌ها در فرم سفارش هم دیده می‌شوند.">
        <Field label="عنوان کوچک"><input value={page.intro.eyebrow} onChange={(event) => write({ intro: { ...page.intro, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><input value={page.intro.title} onChange={(event) => write({ intro: { ...page.intro, title: event.target.value } })} className={inputClass} /></Field>
        <Field label="متن اصلی"><textarea value={page.intro.body} onChange={(event) => write({ intro: { ...page.intro, body: event.target.value } })} className={`${inputClass} min-h-28`} /></Field>
        <Field label="متن کناری"><textarea value={page.intro.support} onChange={(event) => write({ intro: { ...page.intro, support: event.target.value } })} className={`${inputClass} min-h-28`} /></Field>
        <div className="grid gap-4 lg:grid-cols-2">
          {page.styles.map((style, index) => (
            <div key={style.id} className="space-y-3 rounded-2xl border border-forest/10 p-4">
              <Field label="نام سبک"><input value={style.label} onChange={(event) => write({ styles: page.styles.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={style.description} onChange={(event) => write({ styles: page.styles.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} className={`${inputClass} min-h-20`} /></Field>
              <MediaCard title="عکس سبک" src={style.image} busy={slot === style.id} locked={Boolean(slot)} progress={progress} onFile={(file) => upload(style.id, file, (current, url) => ({ styles: current.styles.map((item, itemIndex) => itemIndex === index ? replaceImage(item, url) : item) }))} onUndo={style.previousImage ? () => write({ styles: page.styles.map((item, itemIndex) => itemIndex === index ? undoImage(item) : item) }) : undefined} onReset={style.image === DEFAULTS.styles[index].image ? undefined : () => write({ styles: page.styles.map((item, itemIndex) => itemIndex === index ? { ...item, image: DEFAULTS.styles[index].image } : item) })} />
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="BENEFITS" title="چرا خانه چوب و هنر" hint="عنوان بخش و چهار کارت مزیت.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان کوچک"><input value={page.benefitsHeading.eyebrow} onChange={(event) => write({ benefitsHeading: { ...page.benefitsHeading, eyebrow: event.target.value } })} className={inputClass} /></Field>
          <Field label="تیتر"><input value={page.benefitsHeading.title} onChange={(event) => write({ benefitsHeading: { ...page.benefitsHeading, title: event.target.value } })} className={inputClass} /></Field>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {page.benefits.map((item, index) => (
            <div key={DEFAULTS.benefits[index].title} className="space-y-3">
              <Field label={`عنوان ${index + 1}`}><input value={item.title} onChange={(event) => write({ benefits: page.benefits.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={item.body} onChange={(event) => write({ benefits: page.benefits.map((entry, entryIndex) => entryIndex === index ? { ...entry, body: event.target.value } : entry) })} className={`${inputClass} min-h-24`} /></Field>
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="PROCESS" title="فرآیند اجرا" hint="عنوان بخش و چهار گام.">
        <Field label="عنوان کوچک"><input value={page.processHeading.eyebrow} onChange={(event) => write({ processHeading: { ...page.processHeading, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><input value={page.processHeading.title} onChange={(event) => write({ processHeading: { ...page.processHeading, title: event.target.value } })} className={inputClass} /></Field>
        <div className="grid gap-4 lg:grid-cols-2">
          {page.processSteps.map((step, index) => (
            <div key={step.n} className="space-y-3">
              <Field label={`عنوان گام ${index + 1}`}><input value={step.title} onChange={(event) => write({ processSteps: page.processSteps.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={step.body} onChange={(event) => write({ processSteps: page.processSteps.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) })} className={`${inputClass} min-h-24`} /></Field>
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="CUSTOM" title="سفارشی‌سازی" hint="متن بخش و چهار قطعه، هر کدام با عکس و لینک.">
        <Field label="عنوان کوچک"><input value={page.customizationHeading.eyebrow} onChange={(event) => write({ customizationHeading: { ...page.customizationHeading, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><input value={page.customizationHeading.title} onChange={(event) => write({ customizationHeading: { ...page.customizationHeading, title: event.target.value } })} className={inputClass} /></Field>
        <Field label="توضیح"><textarea value={page.customizationHeading.body} onChange={(event) => write({ customizationHeading: { ...page.customizationHeading, body: event.target.value } })} className={`${inputClass} min-h-24`} /></Field>
        <div className="grid gap-4 lg:grid-cols-2">
          {page.customizationPieces.map((piece, index) => (
            <div key={piece.id} className="space-y-3 rounded-2xl border border-forest/10 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="برچسب"><input value={piece.eyebrow} onChange={(event) => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? { ...item, eyebrow: event.target.value } : item) })} className={inputClass} /></Field>
                <Field label="لینک"><input dir="ltr" value={piece.href} onChange={(event) => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? { ...item, href: event.target.value } : item) })} className={inputClass} /></Field>
              </div>
              <Field label="عنوان"><input value={piece.title} onChange={(event) => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={piece.description} onChange={(event) => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} className={`${inputClass} min-h-20`} /></Field>
              <MediaCard title="عکس قطعه" src={piece.image} busy={slot === piece.id} locked={Boolean(slot)} progress={progress} onFile={(file) => upload(piece.id, file, (current, url) => ({ customizationPieces: current.customizationPieces.map((item, itemIndex) => itemIndex === index ? replaceImage(item, url) : item) }))} onUndo={piece.previousImage ? () => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? undoImage(item) : item) }) : undefined} onReset={piece.image === DEFAULTS.customizationPieces[index].image ? undefined : () => write({ customizationPieces: page.customizationPieces.map((item, itemIndex) => itemIndex === index ? { ...item, image: DEFAULTS.customizationPieces[index].image } : item) })} />
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="PROJECTS" title="نمونه‌کارها" hint="متن این نوار. خود پروژه‌ها و عکس‌هایشان از مدیریت آثار می‌آید.">
        <Field label="عنوان کوچک"><input value={page.projects.eyebrow} onChange={(event) => write({ projects: { ...page.projects, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><input value={page.projects.title} onChange={(event) => write({ projects: { ...page.projects, title: event.target.value } })} className={inputClass} /></Field>
        <Field label="توضیح"><textarea value={page.projects.body} onChange={(event) => write({ projects: { ...page.projects, body: event.target.value } })} className={`${inputClass} min-h-24`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="متن لینک"><input value={page.projects.linkLabel} onChange={(event) => write({ projects: { ...page.projects, linkLabel: event.target.value } })} className={inputClass} /></Field>
          <Field label="آدرس لینک"><input dir="ltr" value={page.projects.linkHref} onChange={(event) => write({ projects: { ...page.projects, linkHref: event.target.value } })} className={inputClass} /></Field>
        </div>
      </Block>

      <Block kicker="CONSULTATION" title="شروع همکاری" hint="متن دعوت و سه راه مشاوره.">
        <Field label="عنوان کوچک"><input value={page.consultation.eyebrow} onChange={(event) => write({ consultation: { ...page.consultation, eyebrow: event.target.value } })} className={inputClass} /></Field>
        <Field label="تیتر"><input value={page.consultation.title} onChange={(event) => write({ consultation: { ...page.consultation, title: event.target.value } })} className={inputClass} /></Field>
        <Field label="توضیح"><textarea value={page.consultation.body} onChange={(event) => write({ consultation: { ...page.consultation, body: event.target.value } })} className={`${inputClass} min-h-24`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="متن دکمه"><input value={page.consultation.ctaLabel} onChange={(event) => write({ consultation: { ...page.consultation, ctaLabel: event.target.value } })} className={inputClass} /></Field>
          <Field label="لینک دکمه"><input dir="ltr" value={page.consultation.ctaHref} onChange={(event) => write({ consultation: { ...page.consultation, ctaHref: event.target.value } })} className={inputClass} /></Field>
        </div>
        {page.consultationChannels.map((channel, index) => (
          <div key={DEFAULTS.consultationChannels[index].title} className="grid gap-4 sm:grid-cols-2">
            <Field label={`عنوان راه ${index + 1}`}><input value={channel.title} onChange={(event) => write({ consultationChannels: page.consultationChannels.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className={inputClass} /></Field>
            <Field label="توضیح"><textarea value={channel.body} onChange={(event) => write({ consultationChannels: page.consultationChannels.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) })} className={`${inputClass} min-h-20`} /></Field>
          </div>
        ))}
      </Block>

      <Block kicker="ORDER FORM" title="فرم سفارش" hint="گزینه‌های فرم و عکس‌های مودبورد. برچسب عکس را با شناسه سبک‌ها بنویسید: minimal, modern, classic, rustic, warm, luxury.">
        <OptionList label="نوع فضا" values={page.spaceTypeOptions} onChange={(spaceTypeOptions) => write({ spaceTypeOptions })} />
        <OptionList label="بودجه" values={page.budgetOptions} onChange={(budgetOptions) => write({ budgetOptions })} />
        <OptionList label="زمان‌بندی" values={page.timelineOptions} onChange={(timelineOptions) => write({ timelineOptions })} />
        <OptionList label="نوع مشاوره" values={page.consultationOptions} onChange={(consultationOptions) => write({ consultationOptions })} />
        <div className="grid gap-4 lg:grid-cols-3">
          {page.moodboardImages.map((image, index) => (
            <div key={image.id} className="space-y-3">
              <Field label="متن جایگزین"><input value={image.alt} onChange={(event) => write({ moodboardImages: page.moodboardImages.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item) })} className={inputClass} /></Field>
              <Field label="برچسب سبک‌ها"><input dir="ltr" value={image.tags} onChange={(event) => write({ moodboardImages: page.moodboardImages.map((item, itemIndex) => itemIndex === index ? { ...item, tags: event.target.value } : item) })} className={inputClass} /></Field>
              <MediaCard title={`مودبورد ${index + 1}`} src={image.src} busy={slot === image.id} locked={Boolean(slot)} progress={progress} onFile={(file) => upload(image.id, file, (current, url) => ({ moodboardImages: current.moodboardImages.map((item, itemIndex) => itemIndex === index ? { ...item, src: url, previousSrc: item.src === url ? item.previousSrc : item.src } : item) }))} onUndo={image.previousSrc ? () => write({ moodboardImages: page.moodboardImages.map((item, itemIndex) => itemIndex === index ? { ...item, src: item.previousSrc, previousSrc: "" } : item) }) : undefined} onReset={image.src === DEFAULTS.moodboardImages[index].src ? undefined : () => write({ moodboardImages: page.moodboardImages.map((item, itemIndex) => itemIndex === index ? { ...item, src: DEFAULTS.moodboardImages[index].src } : item) })} />
            </div>
          ))}
        </div>
      </Block>
    </div>
  );
}

function OptionList({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-forest">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {values.map((value, index) => (
          <input key={`${label}-${index}`} value={value} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} className={inputClass} />
        ))}
      </div>
    </div>
  );
}
