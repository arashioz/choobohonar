import { commerceCategories } from "@/data/commerce";

export type HomeShowcaseShot = { image: string; caption: string };

export type HomeApproachStep = { title: string; body: string; image: string };

export type HomeWorkArea = { slug: string; label: string; description: string; image: string };

export type HomePageContent = {
  hero: {
    desktopVideo: string;
    mobileVideo: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
  };
  showcase: HomeShowcaseShot[];
  diversity: {
    eyebrow: string;
    titleLead: string;
    titleEmphasis: string;
    titleTail: string;
    body: string;
  };
  approach: {
    eyebrow: string;
    steps: HomeApproachStep[];
  };
  projects: {
    eyebrow: string;
    title: string;
    body: string;
    linkLabel: string;
    cardLinkLabel: string;
  };
  interlude: {
    eyebrow: string;
    lead: string;
    emphasis: string;
    tail: string;
  };
  workAreas: {
    eyebrow: string;
    items: HomeWorkArea[];
  };
  magazine: {
    title: string;
    linkLabel: string;
  };
  consultation: {
    eyebrow: string;
    title: string;
    body: string;
    nameLabel: string;
    phoneLabel: string;
    interestLabel: string;
    messageLabel: string;
    submitLabel: string;
    successTitle: string;
    successBody: string;
  };
  promo: {
    enabled: boolean;
    title: string;
    ctaLabel: string;
    href: string;
    alt: string;
    mobileImage: string;
    desktopImage: string;
  };
};

const LOCAL_MEDIA = ["/uploads/", "/images/", "/videos/", "/experience/"];

export const HOME_PAGE_DEFAULTS: HomePageContent = {
  hero: {
    desktopVideo: "/videos/anzhelik.mp4",
    mobileVideo: "/videos/hero-mobile.mp4",
    title: "سبک دلخواه من",
    ctaLabel: "فروشگاه",
    ctaHref: "/products",
  },
  showcase: [
    { image: "/images/projects/aknoon-residence/07.jpg", caption: "اقامتگاه آکنون" },
    { image: "/images/projects/shenaj-villa/68.jpg", caption: "ویلای شناج" },
    { image: "/images/projects/armon-hotel/25.jpg", caption: "هتل آرمون" },
  ],
  diversity: {
    eyebrow: "تنوع پروژه‌های ما",
    titleLead: "از نشیمن‌های گرم خانگی تا فضاهای اقامتی بزرگ — هر پروژه روایتی از",
    titleEmphasis: "چوب، نور و دستِ هنرمند",
    titleTail: "است.",
    body: "نزدیک به پنجاه سال است که خانه‌ها را با مبلمانی می‌سازیم که برای زندگی واقعی طراحی شده‌اند؛.",
  },
  approach: {
    eyebrow: "رویکرد ما",
    steps: [
      {
        title: "گفت‌وگو و درک فضا",
        body: "کار با شنیدن آغاز می‌شود؛ سبک زندگی، نور طبیعی و نسبت‌های فضا را می‌خوانیم تا طراحی از دل خانه شما بیرون بیاید.",
        image: "/images/projects/aknoon-residence/11.jpg",
      },
      {
        title: "طراحی و انتخاب متریال",
        body: "هر قطعه را با چوب، روکش و پرداختی متناسب با فضا طراحی می‌کنیم؛ نمونه‌های واقعی متریال در کنار نقشه‌ها بررسی می‌شوند.",
        image: "/images/projects/armon-hotel/24.jpg",
      },
      {
        title: "ساخت و نصب",
        body: "ساخت با اتصالات مهندسی‌شده و کنترل کیفیت چندمرحله‌ای انجام می‌شود و در نهایت در محل با دقت نصب و تحویل می‌گردد.",
        image: "/images/projects/shenaj-villa/46.jpg",
      },
    ],
  },
  projects: {
    eyebrow: "پروژه‌های منتخب",
    title: "فضاهایی که با چوب، نور و دست ساخته شده‌اند",
    body: "از آپارتمان‌های مسکونی تا هتل‌ها و ویلاهای اقامتی — هر پروژه روایتی است از زندگی واقعی در فضا، با مبلمان سفارشی و جزئیات اجرایی خانه چوب و هنر.",
    linkLabel: "مشاهده همه پروژه‌ها",
    cardLinkLabel: "مشاهده پروژه",
  },
  interlude: {
    eyebrow: "خانه چوب و هنر",
    lead: "هر فضا، فرصتی برای ساختن خانه‌ای است که با دقت",
    emphasis: "لمس می‌شود",
    tail: "— نه فقط دیده.",
  },
  workAreas: {
    eyebrow: "گروه‌های کالایی",
    items: commerceCategories.map((category) => ({
      slug: category.slug,
      label: category.label,
      description: category.description,
      image: category.image,
    })),
  },
  magazine: {
    title: "مجله",
    linkLabel: "مشاهده مجله",
  },
  consultation: {
    eyebrow: "مشاوره",
    title: "بیایید خانه‌ای که دوستش دارید را بسازیم.",
    body: "برای مشاوره فرم زیر را تکمیل کنید؛ یا برای ثبت سفارش طراحی داخلی، فرم هوشمند را شروع کنید تا سلیقه و جزئیات فنی فضای خود را با تیم معماری داخلی به اشتراک بگذارید.",
    nameLabel: "نام و نام خانوادگی",
    phoneLabel: "شماره تماس",
    interestLabel: "موضوع درخواست",
    messageLabel: "توضیحات",
    submitLabel: "ارسال درخواست",
    successTitle: "درخواست شما ثبت شد",
    successBody: "سپاس از اعتماد شما. به‌زودی برای هماهنگی جلسه‌ی مشاوره با شما تماس می‌گیریم.",
  },
  promo: {
    enabled: true,
    title: "تجربه نمایشگاه",
    ctaLabel: "ورود",
    href: "/Experience",
    alt: "نهمین نمایشگاه معماری تهران",
    mobileImage: "/experience/wall-mobile.jpg",
    desktopImage: "/experience/wall-desktop.jpg",
  },
};

function text(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function flag(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** Store and render uploads as a same-origin path nginx can serve. */
export function canonicalMediaSrc(value: unknown): string {
  if (typeof value !== "string") return "";
  const src = value.trim();
  if (!src) return "";
  if (LOCAL_MEDIA.some((root) => src.startsWith(root))) return src.split("#")[0];
  const bare = src.replace(/^\/+/, "");
  if (LOCAL_MEDIA.some((root) => bare.startsWith(root.slice(1)))) return `/${bare.split("#")[0]}`;
  if (/^https?:\/\//i.test(src)) {
    try {
      const url = new URL(src);
      const local = LOCAL_MEDIA.some((root) => url.pathname.startsWith(root));
      if (local) return `${url.pathname}${url.search}`;
      return src;
    } catch {
      return "";
    }
  }
  return "";
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

function pageRecord(page: unknown) {
  const root = record(page);
  return { ...record(root.data), ...root };
}

export function readHomePageContent(page: unknown): HomePageContent {
  const data = pageRecord(page);
  const hero = record(data.hero);
  const diversity = record(data.diversity);
  const approach = record(data.approach);
  const projects = record(data.projects);
  const interlude = record(data.interlude);
  const workAreas = record(data.workAreas);
  const magazine = record(data.magazine);
  const consultation = record(data.consultation);
  const promo = record(data.promo);
  const savedShots = Array.isArray(data.showcase) ? data.showcase : [];
  const savedSteps = Array.isArray(approach.steps) ? approach.steps : [];
  const savedAreas = Array.isArray(workAreas.items) ? workAreas.items : [];

  return {
    hero: {
      desktopVideo: media(hero.desktopVideo, HOME_PAGE_DEFAULTS.hero.desktopVideo),
      mobileVideo: media(hero.mobileVideo, HOME_PAGE_DEFAULTS.hero.mobileVideo),
      title: text(hero.title, HOME_PAGE_DEFAULTS.hero.title),
      ctaLabel: text(hero.ctaLabel, HOME_PAGE_DEFAULTS.hero.ctaLabel),
      ctaHref: href(hero.ctaHref, HOME_PAGE_DEFAULTS.hero.ctaHref),
    },
    showcase: HOME_PAGE_DEFAULTS.showcase.map((fallback, index) => {
      const item = record(savedShots[index]);
      return {
        image: media(item.image, fallback.image),
        caption: text(item.caption, fallback.caption),
      };
    }),
    diversity: {
      eyebrow: text(diversity.eyebrow, HOME_PAGE_DEFAULTS.diversity.eyebrow),
      titleLead: text(diversity.titleLead, HOME_PAGE_DEFAULTS.diversity.titleLead),
      titleEmphasis: text(diversity.titleEmphasis, HOME_PAGE_DEFAULTS.diversity.titleEmphasis),
      titleTail: text(diversity.titleTail, HOME_PAGE_DEFAULTS.diversity.titleTail),
      body: text(diversity.body, HOME_PAGE_DEFAULTS.diversity.body),
    },
    approach: {
      eyebrow: text(approach.eyebrow, HOME_PAGE_DEFAULTS.approach.eyebrow),
      steps: HOME_PAGE_DEFAULTS.approach.steps.map((fallback, index) => {
        const item = record(savedSteps[index]);
        return {
          title: text(item.title, fallback.title),
          body: text(item.body, fallback.body),
          image: media(item.image, fallback.image),
        };
      }),
    },
    projects: {
      eyebrow: text(projects.eyebrow, HOME_PAGE_DEFAULTS.projects.eyebrow),
      title: text(projects.title, HOME_PAGE_DEFAULTS.projects.title),
      body: text(projects.body, HOME_PAGE_DEFAULTS.projects.body),
      linkLabel: text(projects.linkLabel, HOME_PAGE_DEFAULTS.projects.linkLabel),
      cardLinkLabel: text(projects.cardLinkLabel, HOME_PAGE_DEFAULTS.projects.cardLinkLabel),
    },
    interlude: {
      eyebrow: text(interlude.eyebrow, HOME_PAGE_DEFAULTS.interlude.eyebrow),
      lead: text(interlude.lead, HOME_PAGE_DEFAULTS.interlude.lead),
      emphasis: text(interlude.emphasis, HOME_PAGE_DEFAULTS.interlude.emphasis),
      tail: text(interlude.tail, HOME_PAGE_DEFAULTS.interlude.tail),
    },
    workAreas: {
      eyebrow: text(workAreas.eyebrow, HOME_PAGE_DEFAULTS.workAreas.eyebrow),
      items: HOME_PAGE_DEFAULTS.workAreas.items.map((fallback) => {
        const item = savedAreas.map(record).find((entry) => entry.slug === fallback.slug) || {};
        return {
          slug: fallback.slug,
          label: text(item.label, fallback.label),
          description: text(item.description, fallback.description),
          image: media(item.image, fallback.image),
        };
      }),
    },
    magazine: {
      title: text(magazine.title, HOME_PAGE_DEFAULTS.magazine.title),
      linkLabel: text(magazine.linkLabel, HOME_PAGE_DEFAULTS.magazine.linkLabel),
    },
    consultation: {
      eyebrow: text(consultation.eyebrow, HOME_PAGE_DEFAULTS.consultation.eyebrow),
      title: text(consultation.title, HOME_PAGE_DEFAULTS.consultation.title),
      body: text(consultation.body, HOME_PAGE_DEFAULTS.consultation.body),
      nameLabel: text(consultation.nameLabel, HOME_PAGE_DEFAULTS.consultation.nameLabel),
      phoneLabel: text(consultation.phoneLabel, HOME_PAGE_DEFAULTS.consultation.phoneLabel),
      interestLabel: text(consultation.interestLabel, HOME_PAGE_DEFAULTS.consultation.interestLabel),
      messageLabel: text(consultation.messageLabel, HOME_PAGE_DEFAULTS.consultation.messageLabel),
      submitLabel: text(consultation.submitLabel, HOME_PAGE_DEFAULTS.consultation.submitLabel),
      successTitle: text(consultation.successTitle, HOME_PAGE_DEFAULTS.consultation.successTitle),
      successBody: text(consultation.successBody, HOME_PAGE_DEFAULTS.consultation.successBody),
    },
    promo: {
      enabled: flag(promo.enabled, HOME_PAGE_DEFAULTS.promo.enabled),
      title: text(promo.title, HOME_PAGE_DEFAULTS.promo.title),
      ctaLabel: text(promo.ctaLabel, HOME_PAGE_DEFAULTS.promo.ctaLabel),
      href: href(promo.href, HOME_PAGE_DEFAULTS.promo.href),
      alt: text(promo.alt, HOME_PAGE_DEFAULTS.promo.alt),
      mobileImage: media(promo.mobileImage, HOME_PAGE_DEFAULTS.promo.mobileImage),
      desktopImage: media(promo.desktopImage, HOME_PAGE_DEFAULTS.promo.desktopImage),
    },
  };
}
