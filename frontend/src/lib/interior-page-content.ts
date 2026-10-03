import {
  budgetOptions,
  consultationChannels,
  consultationOptions,
  interiorBenefits,
  interiorCustomizationPieces,
  interiorHero,
  interiorIntro,
  interiorProcessSteps,
  interiorStyles,
  moodboardImages,
  spaceTypeOptions,
  timelineOptions,
} from "@/data/interior-architecture";
import { canonicalMediaSrc } from "@/lib/home-page-content";

export const INTERIOR_PAGE_DEFAULTS = {
  metaTitle: "خدمات معماری داخلی | خانه چوب و هنر",
  metaDescription:
    "برای دریافت مشاوره چیدمان و خدمات طراحی داخلی، با کارشناسان معماری داخلی خانه چوب و هنر صحبت کنید. امکان مشاوره حضوری، تلفنی و آنلاین.",
  hero: {
    ...interiorHero,
    primaryCtaLabel: "شروع فرم سفارش طراحی",
    primaryCtaHref: "/interior-architecture-services/order",
    secondaryCtaLabel: "مشاهده پروژه‌ها",
    secondaryCtaHref: "/projects",
  },
  intro: {
    ...interiorIntro,
    support:
      "در انتخاب سایز و مدل مناسب مبلمان برای نشیمن خانه‌ی نو تردید دارید؟ به دنبال فرشی هستید که با دیگر وسایل خانه جور دربیاید؟ برای چیدن دفتر کار خود به نظر یک کارشناس حرفه‌ای احتیاج دارید؟ تیم معماری داخلی خانه چوب و هنر در کنار شماست.",
  },
  styles: interiorStyles,
  benefitsHeading: {
    eyebrow: "چرا خانه چوب و هنر",
    title: "تخصص ما در ترجمه‌ی سلیقه‌ی شما به فضا",
  },
  benefits: interiorBenefits,
  processHeading: {
    eyebrow: "فرآیند اجرا",
    title: "گام‌به‌گام در فرآیند اجرای پروژه",
  },
  processSteps: interiorProcessSteps,
  customizationHeading: {
    eyebrow: "سفارشی‌سازی",
    title: "قطعاتی که برای فضای شما ساخته می‌شوند",
    body: "مبلمان و عناصر چوبی هر پروژه با ابعاد، روکش و جزئیات همان فضا طراحی و در کارگاه ساخته می‌شوند — نه از روی کاتالوگ آماده.",
  },
  customizationPieces: interiorCustomizationPieces,
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
  consultationChannels,
  moodboardImages,
  spaceTypeOptions,
  budgetOptions,
  timelineOptions,
  consultationOptions,
};

export type InteriorPageContent = typeof INTERIOR_PAGE_DEFAULTS;

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function media(value: unknown, fallback: string) {
  return canonicalMediaSrc(value) || fallback;
}

function href(value: unknown, fallback: string) {
  const next = text(value, "");
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  if (/^https?:\/\//i.test(next)) return next;
  return fallback;
}

function rows(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function strings(value: unknown, fallback: string[]) {
  const saved = rows(value);
  return fallback.map((item, index) => text(saved[index], item));
}

function tags(value: unknown, fallback: string[]) {
  const source = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;
  if (!source) return fallback;
  const next = source.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
  return next.length ? next : fallback;
}

function contentRecord(page: unknown) {
  const root = record(page);
  const nested = record(root.items);
  if (Object.keys(nested).length) return nested;
  const stored = record(record(root.data).items);
  if (Object.keys(stored).length) return stored;
  return root;
}

function byId(list: Record<string, unknown>[], id: string, index: number) {
  const matched = list.find((item) => item.id === id);
  if (matched) return matched;
  const atIndex = list[index];
  if (!atIndex || atIndex.id === id || atIndex.id == null || atIndex.id === "") return atIndex || {};
  return {};
}

export function readInteriorPageContent(page: unknown): InteriorPageContent {
  const data = contentRecord(page);
  const hero = record(data.hero);
  const intro = record(data.intro);
  const benefitsHeading = record(data.benefitsHeading);
  const processHeading = record(data.processHeading);
  const customizationHeading = record(data.customizationHeading);
  const projects = record(data.projects);
  const consultation = record(data.consultation);
  const savedStyles = rows(data.styles).map(record);
  const savedBenefits = rows(data.benefits);
  const savedSteps = rows(data.processSteps);
  const savedPieces = rows(data.customizationPieces).map(record);
  const savedChannels = rows(data.consultationChannels);
  const savedMoodboard = rows(data.moodboardImages).map(record);

  return {
    metaTitle: text(data.metaTitle, INTERIOR_PAGE_DEFAULTS.metaTitle),
    metaDescription: text(data.metaDescription, INTERIOR_PAGE_DEFAULTS.metaDescription),
    hero: {
      eyebrow: text(hero.eyebrow, INTERIOR_PAGE_DEFAULTS.hero.eyebrow),
      title: text(hero.title, INTERIOR_PAGE_DEFAULTS.hero.title),
      subtitle: text(hero.subtitle, INTERIOR_PAGE_DEFAULTS.hero.subtitle),
      description: text(hero.description, INTERIOR_PAGE_DEFAULTS.hero.description),
      image: media(hero.image, INTERIOR_PAGE_DEFAULTS.hero.image),
      primaryCtaLabel: text(hero.primaryCtaLabel, INTERIOR_PAGE_DEFAULTS.hero.primaryCtaLabel),
      primaryCtaHref: href(hero.primaryCtaHref, INTERIOR_PAGE_DEFAULTS.hero.primaryCtaHref),
      secondaryCtaLabel: text(hero.secondaryCtaLabel, INTERIOR_PAGE_DEFAULTS.hero.secondaryCtaLabel),
      secondaryCtaHref: href(hero.secondaryCtaHref, INTERIOR_PAGE_DEFAULTS.hero.secondaryCtaHref),
    },
    intro: {
      eyebrow: text(intro.eyebrow, INTERIOR_PAGE_DEFAULTS.intro.eyebrow),
      title: text(intro.title, INTERIOR_PAGE_DEFAULTS.intro.title),
      body: text(intro.body, INTERIOR_PAGE_DEFAULTS.intro.body),
      support: text(intro.support, INTERIOR_PAGE_DEFAULTS.intro.support),
    },
    styles: INTERIOR_PAGE_DEFAULTS.styles.map((fallback, index) => {
      const item = byId(savedStyles, fallback.id, index);
      return {
        id: fallback.id,
        label: text(item.label, fallback.label),
        description: text(item.description, fallback.description),
        image: media(item.image, fallback.image),
      };
    }),
    benefitsHeading: {
      eyebrow: text(benefitsHeading.eyebrow, INTERIOR_PAGE_DEFAULTS.benefitsHeading.eyebrow),
      title: text(benefitsHeading.title, INTERIOR_PAGE_DEFAULTS.benefitsHeading.title),
    },
    benefits: INTERIOR_PAGE_DEFAULTS.benefits.map((fallback, index) => {
      const item = record(savedBenefits[index]);
      return {
        title: text(item.title, fallback.title),
        body: text(item.body, fallback.body),
      };
    }),
    processHeading: {
      eyebrow: text(processHeading.eyebrow, INTERIOR_PAGE_DEFAULTS.processHeading.eyebrow),
      title: text(processHeading.title, INTERIOR_PAGE_DEFAULTS.processHeading.title),
    },
    processSteps: INTERIOR_PAGE_DEFAULTS.processSteps.map((fallback, index) => {
      const item = record(savedSteps[index]);
      const n = Number(item.n);
      return {
        n: Number.isFinite(n) && n > 0 ? n : fallback.n,
        title: text(item.title, fallback.title),
        body: text(item.body, fallback.body),
      };
    }),
    customizationHeading: {
      eyebrow: text(customizationHeading.eyebrow, INTERIOR_PAGE_DEFAULTS.customizationHeading.eyebrow),
      title: text(customizationHeading.title, INTERIOR_PAGE_DEFAULTS.customizationHeading.title),
      body: text(customizationHeading.body, INTERIOR_PAGE_DEFAULTS.customizationHeading.body),
    },
    customizationPieces: INTERIOR_PAGE_DEFAULTS.customizationPieces.map((fallback, index) => {
      const item = byId(savedPieces, fallback.id, index);
      return {
        id: fallback.id,
        eyebrow: text(item.eyebrow, fallback.eyebrow),
        title: text(item.title, fallback.title),
        description: text(item.description, fallback.description),
        image: media(item.image, fallback.image),
        href: href(item.href, fallback.href),
      };
    }),
    projects: {
      eyebrow: text(projects.eyebrow, INTERIOR_PAGE_DEFAULTS.projects.eyebrow),
      title: text(projects.title, INTERIOR_PAGE_DEFAULTS.projects.title),
      body: text(projects.body, INTERIOR_PAGE_DEFAULTS.projects.body),
      linkLabel: text(projects.linkLabel, INTERIOR_PAGE_DEFAULTS.projects.linkLabel),
      linkHref: href(projects.linkHref, INTERIOR_PAGE_DEFAULTS.projects.linkHref),
    },
    consultation: {
      eyebrow: text(consultation.eyebrow, INTERIOR_PAGE_DEFAULTS.consultation.eyebrow),
      title: text(consultation.title, INTERIOR_PAGE_DEFAULTS.consultation.title),
      body: text(consultation.body, INTERIOR_PAGE_DEFAULTS.consultation.body),
      ctaLabel: text(consultation.ctaLabel, INTERIOR_PAGE_DEFAULTS.consultation.ctaLabel),
      ctaHref: href(consultation.ctaHref, INTERIOR_PAGE_DEFAULTS.consultation.ctaHref),
    },
    consultationChannels: INTERIOR_PAGE_DEFAULTS.consultationChannels.map((fallback, index) => {
      const item = record(savedChannels[index]);
      return {
        title: text(item.title, fallback.title),
        body: text(item.body, fallback.body),
      };
    }),
    moodboardImages: INTERIOR_PAGE_DEFAULTS.moodboardImages.map((fallback, index) => {
      const item = byId(savedMoodboard, fallback.id, index);
      return {
        id: fallback.id,
        src: media(item.src, fallback.src),
        alt: text(item.alt, fallback.alt),
        tags: tags(item.tags, fallback.tags),
      };
    }),
    spaceTypeOptions: strings(data.spaceTypeOptions, INTERIOR_PAGE_DEFAULTS.spaceTypeOptions),
    budgetOptions: strings(data.budgetOptions, INTERIOR_PAGE_DEFAULTS.budgetOptions),
    timelineOptions: strings(data.timelineOptions, INTERIOR_PAGE_DEFAULTS.timelineOptions),
    consultationOptions: strings(data.consultationOptions, INTERIOR_PAGE_DEFAULTS.consultationOptions),
  };
}
