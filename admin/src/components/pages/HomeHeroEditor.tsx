"use client";

import { useState, type ReactNode } from "react";
import { uploadMedia } from "@/lib/upload";

type Hero = {
  desktopVideo: string;
  mobileVideo: string;
  previousDesktopVideo: string;
  previousMobileVideo: string;
  title: string;
  ctaLabel: string;
  ctaHref: string;
};

type Shot = { image: string; caption: string; previousImage: string };
type Step = { title: string; body: string; image: string; previousImage: string };
type WorkArea = { slug: string; label: string; description: string; image: string; previousImage: string };

type Diversity = {
  eyebrow: string;
  titleLead: string;
  titleEmphasis: string;
  titleTail: string;
  body: string;
};

type ProjectsCopy = {
  eyebrow: string;
  title: string;
  body: string;
  linkLabel: string;
  cardLinkLabel: string;
};

type Interlude = { eyebrow: string; lead: string; emphasis: string; tail: string };

type Consultation = {
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

type Promo = {
  title: string;
  ctaLabel: string;
  href: string;
  alt: string;
  mobileImage: string;
  desktopImage: string;
  previousMobileImage: string;
  previousDesktopImage: string;
};

type HomePage = {
  hero: Hero;
  showcase: Shot[];
  diversity: Diversity;
  approach: { eyebrow: string; steps: Step[] };
  projects: ProjectsCopy;
  interlude: Interlude;
  workAreas: { eyebrow: string; items: WorkArea[] };
  magazine: { title: string; linkLabel: string };
  consultation: Consultation;
  promo: Promo;
};

const DEFAULTS: HomePage = {
  hero: {
    desktopVideo: "/videos/anzhelik.mp4",
    mobileVideo: "/videos/hero-mobile.mp4",
    previousDesktopVideo: "",
    previousMobileVideo: "",
    title: "سبک دلخواه من",
    ctaLabel: "فروشگاه",
    ctaHref: "/products",
  },
  showcase: [
    { image: "/images/projects/aknoon-residence/07.jpg", caption: "اقامتگاه آکنون", previousImage: "" },
    { image: "/images/projects/shenaj-villa/68.jpg", caption: "ویلای شناج", previousImage: "" },
    { image: "/images/projects/armon-hotel/25.jpg", caption: "هتل آرمون", previousImage: "" },
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
        previousImage: "",
      },
      {
        title: "طراحی و انتخاب متریال",
        body: "هر قطعه را با چوب، روکش و پرداختی متناسب با فضا طراحی می‌کنیم؛ نمونه‌های واقعی متریال در کنار نقشه‌ها بررسی می‌شوند.",
        image: "/images/projects/armon-hotel/24.jpg",
        previousImage: "",
      },
      {
        title: "ساخت و نصب",
        body: "ساخت با اتصالات مهندسی‌شده و کنترل کیفیت چندمرحله‌ای انجام می‌شود و در نهایت در محل با دقت نصب و تحویل می‌گردد.",
        image: "/images/projects/shenaj-villa/46.jpg",
        previousImage: "",
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
    items: [
      { slug: "livingroom", label: "نشیمن", description: "مبلمان و میزهایی برای مکث، گفتگو و زندگی روزمره.", image: "https://choobohonar.com/wp-content/uploads/2026/01/مبل-چدار-خانه-چوب-و-هنر-1.jpg", previousImage: "" },
      { slug: "bedroom", label: "اتاق خواب", description: "فضایی شخصی برای آرامش، نظم و شروع دوباره.", image: "https://choobohonar.com/wp-content/uploads/2023/07/تخت-خواب-آکومه-خانه-چوب-و-هنر-1.jpg", previousImage: "" },
      { slug: "diningroom", label: "غذاخوری", description: "میزبان لحظه‌هایی که دور یک میز شکل می‌گیرند.", image: "https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg", previousImage: "" },
      { slug: "bedding", label: "کالای خواب", description: "لایه‌های نرم، تنفس‌پذیر و هماهنگ برای خواب بهتر.", image: "https://choobohonar.com/wp-content/uploads/2026/02/سرویس-روتختی-گلدن-رودز-53-خانه-چوب-و-هنر-1.jpg", previousImage: "" },
      { slug: "carpet", label: "فرش و گلیم", description: "بافت‌هایی که فضا را یکپارچه و گرم می‌کنند.", image: "https://choobohonar.com/wp-content/uploads/2025/07/فرش-زاب-کرم-1.jpg", previousImage: "" },
      { slug: "lighting", label: "روشنایی", description: "نورهایی برای تعریف حال‌وهوای هر گوشه از خانه.", image: "https://choobohonar.com/wp-content/uploads/2026/07/آباژور-گالن-1.jpg", previousImage: "" },
      { slug: "decor", label: "دکور", description: "اشیایی کوچک با تأثیری ماندگار بر شخصیت فضا.", image: "https://choobohonar.com/wp-content/uploads/2023/05/دراور-آلدر-خانه-چوب-و-هنر-2.jpg", previousImage: "" },
    ],
  },
  magazine: { title: "مجله", linkLabel: "مشاهده مجله" },
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
    title: "تجربه نمایشگاه",
    ctaLabel: "ورود",
    href: "/Experience",
    alt: "نهمین نمایشگاه معماری تهران",
    mobileImage: "/experience/wall-mobile.jpg",
    desktopImage: "/experience/wall-desktop.jpg",
    previousMobileImage: "",
    previousDesktopImage: "",
  },
};

function previousMedia(value: unknown) {
  return typeof value === "string" ? value : "";
}

function replaceImage<T extends { image: string; previousImage: string }>(item: T, url: string): T {
  if (!url || item.image === url) return item;
  return { ...item, previousImage: item.image, image: url };
}

function undoImage<T extends { image: string; previousImage: string }>(item: T): T {
  if (!item.previousImage || item.previousImage === item.image) return item;
  return { ...item, image: item.previousImage, previousImage: "" };
}

const inputClass = "mt-1 w-full rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-forest/30";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/** Keep uploads on the public /uploads path, even if the API returns a full host. */
export function storedMediaPath(url: string) {
  const value = url.trim();
  if (!value) return value;
  if (value.startsWith("/uploads/") || value.startsWith("/images/") || value.startsWith("/videos/") || value.startsWith("/experience/")) return value.split("#")[0];
  if (/^(uploads|images|videos|experience)\//.test(value)) return `/${value.split("#")[0]}`;
  try {
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);
      if (["/uploads/", "/images/", "/videos/", "/experience/"].some((root) => parsed.pathname.startsWith(root))) {
        return `${parsed.pathname}${parsed.search}`;
      }
    }
  } catch {
    return value;
  }
  return value;
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

/** Apply only the fields the admin just changed, so an in-flight upload is not overwritten. */
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

export function readHomePage(data: Record<string, unknown> | undefined): HomePage {
  const source = data || {};
  const hero = asRecord(source.hero);
  const diversity = asRecord(source.diversity);
  const approach = asRecord(source.approach);
  const projects = asRecord(source.projects);
  const interlude = asRecord(source.interlude);
  const workAreas = asRecord(source.workAreas);
  const magazine = asRecord(source.magazine);
  const consultation = asRecord(source.consultation);
  const promo = asRecord(source.promo);
  const shots = Array.isArray(source.showcase) ? source.showcase : [];
  const steps = Array.isArray(approach.steps) ? approach.steps : [];
  const areas = Array.isArray(workAreas.items) ? workAreas.items : [];

  return {
    hero: {
      desktopVideo: text(hero.desktopVideo, DEFAULTS.hero.desktopVideo),
      mobileVideo: text(hero.mobileVideo, DEFAULTS.hero.mobileVideo),
      previousDesktopVideo: previousMedia(hero.previousDesktopVideo),
      previousMobileVideo: previousMedia(hero.previousMobileVideo),
      title: text(hero.title, DEFAULTS.hero.title),
      ctaLabel: text(hero.ctaLabel, DEFAULTS.hero.ctaLabel),
      ctaHref: text(hero.ctaHref, DEFAULTS.hero.ctaHref),
    },
    showcase: DEFAULTS.showcase.map((fallback, index) => {
      const item = asRecord(shots[index]);
      return { image: text(item.image, fallback.image), caption: text(item.caption, fallback.caption), previousImage: previousMedia(item.previousImage) };
    }),
    diversity: {
      eyebrow: text(diversity.eyebrow, DEFAULTS.diversity.eyebrow),
      titleLead: text(diversity.titleLead, DEFAULTS.diversity.titleLead),
      titleEmphasis: text(diversity.titleEmphasis, DEFAULTS.diversity.titleEmphasis),
      titleTail: text(diversity.titleTail, DEFAULTS.diversity.titleTail),
      body: text(diversity.body, DEFAULTS.diversity.body),
    },
    approach: {
      eyebrow: text(approach.eyebrow, DEFAULTS.approach.eyebrow),
      steps: DEFAULTS.approach.steps.map((fallback, index) => {
        const item = asRecord(steps[index]);
        return {
          title: text(item.title, fallback.title),
          body: text(item.body, fallback.body),
          image: text(item.image, fallback.image),
          previousImage: previousMedia(item.previousImage),
        };
      }),
    },
    projects: {
      eyebrow: text(projects.eyebrow, DEFAULTS.projects.eyebrow),
      title: text(projects.title, DEFAULTS.projects.title),
      body: text(projects.body, DEFAULTS.projects.body),
      linkLabel: text(projects.linkLabel, DEFAULTS.projects.linkLabel),
      cardLinkLabel: text(projects.cardLinkLabel, DEFAULTS.projects.cardLinkLabel),
    },
    interlude: {
      eyebrow: text(interlude.eyebrow, DEFAULTS.interlude.eyebrow),
      lead: text(interlude.lead, DEFAULTS.interlude.lead),
      emphasis: text(interlude.emphasis, DEFAULTS.interlude.emphasis),
      tail: text(interlude.tail, DEFAULTS.interlude.tail),
    },
    workAreas: {
      eyebrow: text(workAreas.eyebrow, DEFAULTS.workAreas.eyebrow),
      items: DEFAULTS.workAreas.items.map((fallback) => {
        const item = areas.map(asRecord).find((entry) => entry.slug === fallback.slug) || {};
        return {
          slug: fallback.slug,
          label: text(item.label, fallback.label),
          description: text(item.description, fallback.description),
          image: text(item.image, fallback.image),
          previousImage: previousMedia(item.previousImage),
        };
      }),
    },
    magazine: {
      title: text(magazine.title, DEFAULTS.magazine.title),
      linkLabel: text(magazine.linkLabel, DEFAULTS.magazine.linkLabel),
    },
    consultation: {
      eyebrow: text(consultation.eyebrow, DEFAULTS.consultation.eyebrow),
      title: text(consultation.title, DEFAULTS.consultation.title),
      body: text(consultation.body, DEFAULTS.consultation.body),
      nameLabel: text(consultation.nameLabel, DEFAULTS.consultation.nameLabel),
      phoneLabel: text(consultation.phoneLabel, DEFAULTS.consultation.phoneLabel),
      interestLabel: text(consultation.interestLabel, DEFAULTS.consultation.interestLabel),
      messageLabel: text(consultation.messageLabel, DEFAULTS.consultation.messageLabel),
      submitLabel: text(consultation.submitLabel, DEFAULTS.consultation.submitLabel),
      successTitle: text(consultation.successTitle, DEFAULTS.consultation.successTitle),
      successBody: text(consultation.successBody, DEFAULTS.consultation.successBody),
    },
    promo: {
      title: text(promo.title, DEFAULTS.promo.title),
      ctaLabel: text(promo.ctaLabel, DEFAULTS.promo.ctaLabel),
      href: text(promo.href, DEFAULTS.promo.href),
      alt: text(promo.alt, DEFAULTS.promo.alt),
      mobileImage: text(promo.mobileImage, DEFAULTS.promo.mobileImage),
      desktopImage: text(promo.desktopImage, DEFAULTS.promo.desktopImage),
      previousMobileImage: previousMedia(promo.previousMobileImage),
      previousDesktopImage: previousMedia(promo.previousDesktopImage),
    },
  };
}

/** Public site files such as /videos and /images are not in the admin app. Uploads stay on this origin. */
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
  return (
    <label className="block text-[11px] text-forest/45">
      {label}
      {children}
    </label>
  );
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

export default function HomePageEditor({ data, onPatch, onBusyChange, onProgress }: Props) {
  const page = readHomePage(data);
  const [slot, setSlot] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function write<K extends keyof HomePage>(key: K, value: HomePage[K]) {
    onPatch((current) => {
      const latest = readHomePage(current);
      return { ...current, [key]: mergeSectionEdit(page[key], value, latest[key]) as HomePage[K] };
    });
  }

  async function upload(target: string, file: File | undefined, kind: "image" | "video", apply: (current: HomePage, url: string) => Partial<HomePage>) {
    if (!file) return;
    const valid = kind === "video" ? file.type.startsWith("video/") : file.type.startsWith("image/");
    if (!valid) {
      setError(kind === "video" ? "فقط فایل ویدیو قابل آپلود است." : "فقط فایل تصویر قابل آپلود است.");
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
      onPatch((current) => ({ ...current, ...apply(readHomePage(current), url) }));
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

      <Block kicker="HOME HERO" title="هیرو صفحه خانه" hint="ویدیو، عنوان و دکمهٔ بالای صفحه. بعد از تغییر، «به‌روزرسانی» را بزنید تا روی سایت دیده شود.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان"><input value={page.hero.title} onChange={(event) => write("hero", { ...page.hero, title: event.target.value })} className={inputClass} /></Field>
          <Field label="متن دکمه"><input value={page.hero.ctaLabel} onChange={(event) => write("hero", { ...page.hero, ctaLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="لینک دکمه"><input dir="ltr" value={page.hero.ctaHref} onChange={(event) => write("hero", { ...page.hero, ctaHref: event.target.value })} className={inputClass} /></Field>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {([
            ["desktopVideo", "ویدیوی دسکتاپ", "از عرض ۱۲۸۰ پیکسل به بالا پخش می‌شود."],
            ["mobileVideo", "ویدیوی موبایل", "در موبایل و تبلت پخش می‌شود."],
          ] as const).map(([id, title, hint]) => (
            <MediaCard
              key={id}
              title={title}
              hint={hint}
              src={page.hero[id]}
              kind="video"
              busy={slot === id}
              locked={Boolean(slot)}
              progress={progress}
              onFile={(file) => upload(id, file, "video", (current, url) => {
                const previousKey = id === "desktopVideo" ? "previousDesktopVideo" : "previousMobileVideo";
                return { hero: { ...current.hero, [id]: url, [previousKey]: current.hero[id] === url ? current.hero[previousKey] : current.hero[id] } };
              })}
              onUndo={page.hero[id === "desktopVideo" ? "previousDesktopVideo" : "previousMobileVideo"] ? () => write("hero", {
                ...page.hero,
                [id]: page.hero[id === "desktopVideo" ? "previousDesktopVideo" : "previousMobileVideo"],
                [id === "desktopVideo" ? "previousDesktopVideo" : "previousMobileVideo"]: "",
              }) : undefined}
              onReset={page.hero[id] === DEFAULTS.hero[id] ? undefined : () => write("hero", { ...page.hero, [id]: DEFAULTS.hero[id] })}
            />
          ))}
        </div>
      </Block>

      <Block kicker="SHOWCASE" title="تنوع پروژه‌ها" hint="متن این بخش و سه عکس آن. عکس جدید با آدرس /uploads/ ذخیره می‌شود و جای عکس قبلی را می‌گیرد.">
        <Field label="عنوان کوچک"><input value={page.diversity.eyebrow} onChange={(event) => write("diversity", { ...page.diversity, eyebrow: event.target.value })} className={inputClass} /></Field>
        <Field label="شروع تیتر"><textarea value={page.diversity.titleLead} onChange={(event) => write("diversity", { ...page.diversity, titleLead: event.target.value })} className={`${inputClass} min-h-20`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عبارت برجسته"><input value={page.diversity.titleEmphasis} onChange={(event) => write("diversity", { ...page.diversity, titleEmphasis: event.target.value })} className={inputClass} /></Field>
          <Field label="ادامه تیتر"><input value={page.diversity.titleTail} onChange={(event) => write("diversity", { ...page.diversity, titleTail: event.target.value })} className={inputClass} /></Field>
        </div>
        <Field label="توضیح"><textarea value={page.diversity.body} onChange={(event) => write("diversity", { ...page.diversity, body: event.target.value })} className={`${inputClass} min-h-24`} /></Field>
        <div className="grid gap-4 lg:grid-cols-3">
          {page.showcase.map((item, index) => (
            <MediaCard
              key={DEFAULTS.showcase[index].caption}
              title={`عکس ${index + 1}`}
              src={item.image}
              kind="image"
              busy={slot === `showcase-${index}`}
              locked={Boolean(slot)}
              progress={progress}
              caption={item.caption}
              onCaption={(caption) => write("showcase", page.showcase.map((shot, shotIndex) => shotIndex === index ? { ...shot, caption } : shot))}
              onFile={(file) => upload(`showcase-${index}`, file, "image", (current, url) => ({
                showcase: current.showcase.map((shot, shotIndex) => shotIndex === index ? replaceImage(shot, url) : shot),
              }))}
              onUndo={item.previousImage ? () => write("showcase", page.showcase.map((shot, shotIndex) => shotIndex === index ? undoImage(shot) : shot)) : undefined}
              onReset={item.image === DEFAULTS.showcase[index].image ? undefined : () => write("showcase", page.showcase.map((shot, shotIndex) => shotIndex === index ? { ...shot, image: DEFAULTS.showcase[index].image } : shot))}
            />
          ))}
        </div>
      </Block>

      <Block kicker="APPROACH" title="رویکرد ما" hint="سه گام اسکرول‌شونده، با عنوان، توضیح و عکس پس‌زمینه.">
        <Field label="عنوان کوچک"><input value={page.approach.eyebrow} onChange={(event) => write("approach", { ...page.approach, eyebrow: event.target.value })} className={inputClass} /></Field>
        <div className="grid gap-4 lg:grid-cols-3">
          {page.approach.steps.map((step, index) => (
            <div key={DEFAULTS.approach.steps[index].title} className="space-y-3">
              <Field label={`عنوان گام ${index + 1}`}><input value={step.title} onChange={(event) => write("approach", { ...page.approach, steps: page.approach.steps.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={step.body} onChange={(event) => write("approach", { ...page.approach, steps: page.approach.steps.map((item, itemIndex) => itemIndex === index ? { ...item, body: event.target.value } : item) })} className={`${inputClass} min-h-28`} /></Field>
              <MediaCard
                title="عکس پس‌زمینه"
                src={step.image}
                kind="image"
                busy={slot === `approach-${index}`}
                locked={Boolean(slot)}
                progress={progress}
                onFile={(file) => upload(`approach-${index}`, file, "image", (current, url) => ({
                  approach: { ...current.approach, steps: current.approach.steps.map((item, itemIndex) => itemIndex === index ? replaceImage(item, url) : item) },
                }))}
                onUndo={step.previousImage ? () => write("approach", { ...page.approach, steps: page.approach.steps.map((item, itemIndex) => itemIndex === index ? undoImage(item) : item) }) : undefined}
                onReset={step.image === DEFAULTS.approach.steps[index].image ? undefined : () => write("approach", { ...page.approach, steps: page.approach.steps.map((item, itemIndex) => itemIndex === index ? { ...item, image: DEFAULTS.approach.steps[index].image } : item) })}
              />
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="PROJECTS" title="پروژه‌های منتخب" hint="متن معرفی همین بخش. عنوان، خلاصه و عکس هر پروژه از مدیریت آثار خوانده می‌شود.">
        <Field label="عنوان کوچک"><input value={page.projects.eyebrow} onChange={(event) => write("projects", { ...page.projects, eyebrow: event.target.value })} className={inputClass} /></Field>
        <Field label="تیتر"><textarea value={page.projects.title} onChange={(event) => write("projects", { ...page.projects, title: event.target.value })} className={`${inputClass} min-h-20`} /></Field>
        <Field label="توضیح"><textarea value={page.projects.body} onChange={(event) => write("projects", { ...page.projects, body: event.target.value })} className={`${inputClass} min-h-28`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="متن لینک همه پروژه‌ها"><input value={page.projects.linkLabel} onChange={(event) => write("projects", { ...page.projects, linkLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="متن دکمه هر پروژه"><input value={page.projects.cardLinkLabel} onChange={(event) => write("projects", { ...page.projects, cardLinkLabel: event.target.value })} className={inputClass} /></Field>
        </div>
      </Block>

      <Block kicker="INTERLUDE" title="جمله میانی" hint="عبارت کوتاه بین پروژه‌ها و گروه‌های کالایی. بخش برجسته با رنگ آجری دیده می‌شود.">
        <Field label="عنوان کوچک"><input value={page.interlude.eyebrow} onChange={(event) => write("interlude", { ...page.interlude, eyebrow: event.target.value })} className={inputClass} /></Field>
        <Field label="شروع جمله"><textarea value={page.interlude.lead} onChange={(event) => write("interlude", { ...page.interlude, lead: event.target.value })} className={`${inputClass} min-h-20`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عبارت برجسته"><input value={page.interlude.emphasis} onChange={(event) => write("interlude", { ...page.interlude, emphasis: event.target.value })} className={inputClass} /></Field>
          <Field label="ادامه جمله"><input value={page.interlude.tail} onChange={(event) => write("interlude", { ...page.interlude, tail: event.target.value })} className={inputClass} /></Field>
        </div>
      </Block>

      <Block kicker="WORK AREAS" title="گروه‌های کالایی" hint="نام، توضیح و عکس پس‌زمینه فقط روی صفحه خانه عوض می‌شود. دسته‌بندی فروشگاه جدا می‌ماند.">
        <Field label="عنوان کوچک"><input value={page.workAreas.eyebrow} onChange={(event) => write("workAreas", { ...page.workAreas, eyebrow: event.target.value })} className={inputClass} /></Field>
        <div className="grid gap-4 lg:grid-cols-2">
          {page.workAreas.items.map((item, index) => (
            <div key={item.slug} className="space-y-3 rounded-2xl border border-forest/10 bg-[#faf8f5] p-4">
              <Field label="نام گروه"><input value={item.label} onChange={(event) => write("workAreas", { ...page.workAreas, items: page.workAreas.items.map((area, areaIndex) => areaIndex === index ? { ...area, label: event.target.value } : area) })} className={inputClass} /></Field>
              <Field label="توضیح"><textarea value={item.description} onChange={(event) => write("workAreas", { ...page.workAreas, items: page.workAreas.items.map((area, areaIndex) => areaIndex === index ? { ...area, description: event.target.value } : area) })} className={`${inputClass} min-h-20`} /></Field>
              <MediaCard
                title="عکس پس‌زمینه"
                src={item.image}
                kind="image"
                busy={slot === `area-${item.slug}`}
                locked={Boolean(slot)}
                progress={progress}
                onFile={(file) => upload(`area-${item.slug}`, file, "image", (current, url) => ({
                  workAreas: { ...current.workAreas, items: current.workAreas.items.map((area) => area.slug === item.slug ? replaceImage(area, url) : area) },
                }))}
                onUndo={item.previousImage ? () => write("workAreas", { ...page.workAreas, items: page.workAreas.items.map((area) => area.slug === item.slug ? undoImage(area) : area) }) : undefined}
                onReset={item.image === DEFAULTS.workAreas.items[index].image ? undefined : () => write("workAreas", { ...page.workAreas, items: page.workAreas.items.map((area, areaIndex) => areaIndex === index ? { ...area, image: DEFAULTS.workAreas.items[index].image } : area) })}
              />
            </div>
          ))}
        </div>
      </Block>

      <Block kicker="MAGAZINE" title="مجله" hint="عنوان بخش و متن لینک. خود مقاله‌ها از بخش مقالات مدیریت می‌شوند.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان"><input value={page.magazine.title} onChange={(event) => write("magazine", { ...page.magazine, title: event.target.value })} className={inputClass} /></Field>
          <Field label="متن لینک"><input value={page.magazine.linkLabel} onChange={(event) => write("magazine", { ...page.magazine, linkLabel: event.target.value })} className={inputClass} /></Field>
        </div>
      </Block>

      <Block kicker="CONSULTATION" title="مشاوره" hint="متن معرفی، برچسب فیلدها و پیام بعد از ثبت. موضوع‌های فهرست از صفحه فرم‌ها می‌آید.">
        <Field label="عنوان کوچک"><input value={page.consultation.eyebrow} onChange={(event) => write("consultation", { ...page.consultation, eyebrow: event.target.value })} className={inputClass} /></Field>
        <Field label="تیتر"><textarea value={page.consultation.title} onChange={(event) => write("consultation", { ...page.consultation, title: event.target.value })} className={`${inputClass} min-h-20`} /></Field>
        <Field label="توضیح"><textarea value={page.consultation.body} onChange={(event) => write("consultation", { ...page.consultation, body: event.target.value })} className={`${inputClass} min-h-28`} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="برچسب نام"><input value={page.consultation.nameLabel} onChange={(event) => write("consultation", { ...page.consultation, nameLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="برچسب تماس"><input value={page.consultation.phoneLabel} onChange={(event) => write("consultation", { ...page.consultation, phoneLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="برچسب موضوع"><input value={page.consultation.interestLabel} onChange={(event) => write("consultation", { ...page.consultation, interestLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="برچسب توضیحات"><input value={page.consultation.messageLabel} onChange={(event) => write("consultation", { ...page.consultation, messageLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="متن دکمه"><input value={page.consultation.submitLabel} onChange={(event) => write("consultation", { ...page.consultation, submitLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="عنوان پیام موفقیت"><input value={page.consultation.successTitle} onChange={(event) => write("consultation", { ...page.consultation, successTitle: event.target.value })} className={inputClass} /></Field>
        </div>
        <Field label="متن پیام موفقیت"><textarea value={page.consultation.successBody} onChange={(event) => write("consultation", { ...page.consultation, successBody: event.target.value })} className={`${inputClass} min-h-20`} /></Field>
      </Block>

      <Block kicker="PROMO" title="پاپ‌آپ نمایشگاه" hint="تصویر و متن پنجره‌ای که با اسکرول صفحه خانه باز می‌شود.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="عنوان"><input value={page.promo.title} onChange={(event) => write("promo", { ...page.promo, title: event.target.value })} className={inputClass} /></Field>
          <Field label="متن دکمه"><input value={page.promo.ctaLabel} onChange={(event) => write("promo", { ...page.promo, ctaLabel: event.target.value })} className={inputClass} /></Field>
          <Field label="لینک"><input dir="ltr" value={page.promo.href} onChange={(event) => write("promo", { ...page.promo, href: event.target.value })} className={inputClass} /></Field>
          <Field label="متن جایگزین تصویر"><input value={page.promo.alt} onChange={(event) => write("promo", { ...page.promo, alt: event.target.value })} className={inputClass} /></Field>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <MediaCard title="تصویر موبایل" src={page.promo.mobileImage} kind="image" busy={slot === "promo-mobile"} locked={Boolean(slot)} progress={progress} onFile={(file) => upload("promo-mobile", file, "image", (current, url) => ({ promo: { ...current.promo, mobileImage: url, previousMobileImage: current.promo.mobileImage === url ? current.promo.previousMobileImage : current.promo.mobileImage } }))} onUndo={page.promo.previousMobileImage ? () => write("promo", { ...page.promo, mobileImage: page.promo.previousMobileImage, previousMobileImage: "" }) : undefined} onReset={page.promo.mobileImage === DEFAULTS.promo.mobileImage ? undefined : () => write("promo", { ...page.promo, mobileImage: DEFAULTS.promo.mobileImage })} />
          <MediaCard title="تصویر دسکتاپ" src={page.promo.desktopImage} kind="image" busy={slot === "promo-desktop"} locked={Boolean(slot)} progress={progress} onFile={(file) => upload("promo-desktop", file, "image", (current, url) => ({ promo: { ...current.promo, desktopImage: url, previousDesktopImage: current.promo.desktopImage === url ? current.promo.previousDesktopImage : current.promo.desktopImage } }))} onUndo={page.promo.previousDesktopImage ? () => write("promo", { ...page.promo, desktopImage: page.promo.previousDesktopImage, previousDesktopImage: "" }) : undefined} onReset={page.promo.desktopImage === DEFAULTS.promo.desktopImage ? undefined : () => write("promo", { ...page.promo, desktopImage: DEFAULTS.promo.desktopImage })} />
        </div>
      </Block>
    </div>
  );
}

function MediaCard({
  title,
  hint,
  src,
  kind,
  busy,
  locked = false,
  progress,
  caption,
  onCaption,
  onFile,
  onUndo,
  onReset,
}: {
  title: string;
  hint?: string;
  src: string;
  kind: "image" | "video";
  busy: boolean;
  locked?: boolean;
  progress: number;
  caption?: string;
  onCaption?: (value: string) => void;
  onFile: (file: File | undefined) => void;
  onUndo?: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
      {kind === "video" ? (
        <video key={src} src={previewSrc(src)} muted playsInline controls preload="metadata" className="aspect-video w-full bg-forest object-cover" />
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded /uploads files are outside the admin image optimizer */}
          <img src={previewSrc(src)} alt={caption || title} className="aspect-[4/5] w-full object-cover" />
        </>
      )}
      <div className="space-y-3 p-4">
        <div>
          <p className="text-sm font-medium text-forest">{title}</p>
          {hint ? <p className="mt-1 text-[11px] leading-5 text-forest/45">{hint}</p> : null}
          <p className="mt-2 truncate text-[10px] text-forest/35" dir="ltr">{src}</p>
        </div>
        {onCaption ? (
          <Field label="عنوان">
            <input value={caption || ""} onChange={(event) => onCaption(event.target.value)} className={inputClass} />
          </Field>
        ) : null}
        <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-forest/20 bg-white px-3 py-3 text-xs text-forest/70 hover:border-forest/35">
          {busy ? `در حال آپلود… ${progress}٪` : kind === "video" ? "آپلود ویدیوی جدید" : "آپلود عکس جدید"}
          <input
            type="file"
            accept={kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*"}
            className="sr-only"
            disabled={locked}
            onChange={(event) => {
              const file = event.target.files?.[0];
              onFile(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
        {onUndo ? (
          <button type="button" onClick={onUndo} disabled={locked} className="text-[11px] text-forest underline-offset-2 hover:underline disabled:opacity-40">
            بازگشت به حالت قبلی
          </button>
        ) : null}
        {onReset ? (
          <button type="button" onClick={onReset} disabled={locked} className="text-[11px] text-forest/45 underline-offset-2 hover:underline disabled:opacity-40">
            بازگشت به {kind === "video" ? "ویدیوی" : "عکس"} پیش‌فرض
          </button>
        ) : null}
      </div>
    </div>
  );
}
