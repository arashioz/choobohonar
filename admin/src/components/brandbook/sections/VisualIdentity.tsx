"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  primaryBrandColors,
  secondaryBrandColors,
  typography,
  brandCollateral,
} from "@/data/brandbook";
import BrandbookCard from "@/components/brandbook/layout/BrandbookCard";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import { scrollToTarget } from "@/lib/lenis-control";
import {
  CloseIcon,
  CopyIcon,
  DownloadIcon,
  ExpandIcon,
} from "@/components/brandbook/icons";

type ColorValue = {
  nameFa: string;
  nameEn: string;
  hex: string;
  rgb: string;
  cmyk: string;
  usage: string;
  dominance: number;
};

type LogoAsset = {
  id: string;
  titleFa: string;
  titleEn: string;
  black: string;
  white: string;
  download: string;
  shape: "wide" | "mark";
};

const logoAssets: LogoAsset[] = [
  {
    id: "fa",
    titleFa: "قفل لوگوی فارسی",
    titleEn: "Persian Lockup",
    black: "/brand/downloads/choobohonar-lockup-persian-black.svg",
    white: "/brand/downloads/choobohonar-lockup-persian-white.svg",
    download: "/brand/downloads/choobohonar-lockup-persian-black.svg",
    shape: "wide",
  },
  {
    id: "en",
    titleFa: "قفل لوگوی انگلیسی",
    titleEn: "English Lockup",
    black: "/brand/downloads/choobohonar-lockup-english-black.svg",
    white: "/brand/downloads/choobohonar-lockup-english-white.svg",
    download: "/brand/downloads/choobohonar-lockup-english-black.svg",
    shape: "wide",
  },
  {
    id: "mark",
    titleFa: "تک‌نشانه",
    titleEn: "Monogram",
    black: "/brand/downloads/choobohonar-monogram-black.svg",
    white: "/brand/downloads/choobohonar-monogram-white.svg",
    download: "/brand/downloads/choobohonar-monogram-black.svg",
    shape: "mark",
  },
];

const stageBackgrounds = [
  { id: "paper", label: "کاغذ", value: "#F4EFE8", dark: false },
  { id: "white", label: "سفید", value: "#FFFFFF", dark: false },
  { id: "forest", label: "سبز برند", value: "#092B1C", dark: true },
  { id: "peach", label: "هلویی", value: "#FBBEA6", dark: false },
];

const guidelineCards = [
  {
    id: "construction",
    number: "01",
    titleFa: "هندسه نشانه",
    titleEn: "Logo Construction",
    description: "شبکه‌ی مربعی و خطوط راهنما، منطق ساخت فرم پایه را تعریف می‌کنند.",
    src: "/brand/guideline/assets/logo-basic-form.png",
  },
  {
    id: "clearspace",
    number: "02",
    titleFa: "فضای امن",
    titleEn: "Clear Space",
    description: "حداقل فضای آزاد پیرامون لوگو برابر ارتفاع تک‌نشانه در قفل لوگو است.",
    src: "/brand/guideline/assets/clear-space-horizontal.png",
  },
  {
    id: "layout",
    number: "03",
    titleFa: "چیدمان‌های مجاز",
    titleEn: "Approved Layouts",
    description: "نسخه‌های افقی و عمودی باید بدون تغییر نسبت و با فضای تنفس استفاده شوند.",
    src: "/brand/guideline/assets/logo-approved-layouts.png",
    previewClassName: "h-36 sm:h-40 max-w-none w-full",
  },
];

const visualSections = [
  { id: "logo-system", label: "لوگو", labelEn: "Logo" },
  { id: "logo-rules", label: "قواعد", labelEn: "Rules" },
  { id: "color-system", label: "رنگ", labelEn: "Color" },
  { id: "type-system", label: "تایپوگرافی", labelEn: "Type" },
  { id: "brand-collateral", label: "دارایی‌ها", labelEn: "Collateral" },
];

function ChapterHeading({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <FadeUp>
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <span className="eyebrow text-brick">{eyebrow}</span>
          <h2 className="mt-4 text-[clamp(2.7rem,6vw,6rem)] font-light leading-[0.96] tracking-tightest text-forest">
            {title}
          </h2>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <p className="text-sm leading-8 text-forest/60 sm:text-base">{description}</p>
          {aside}
        </div>
      </div>
    </FadeUp>
  );
}

function SectionHeading({
  number,
  title,
  titleEn,
  description,
}: {
  number: string;
  title: string;
  titleEn: string;
  description: string;
}) {
  return (
    <FadeUp>
      <div className="mb-8 grid gap-4 border-t border-forest/10 pt-7 sm:mb-10 sm:grid-cols-[4.5rem_1fr]">
        <span className="font-display text-xs text-brick" dir="ltr">
          {number}
        </span>
        <div className="grid gap-3 md:grid-cols-2 md:items-start">
          <div>
            <h3 className="text-2xl font-light tracking-tightest text-forest sm:text-3xl">{title}</h3>
            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-forest/35" dir="ltr">
              {titleEn}
            </p>
          </div>
          <p className="max-w-xl text-sm leading-7 text-forest/55">{description}</p>
        </div>
      </div>
    </FadeUp>
  );
}

function LogoStage() {
  const [activeId, setActiveId] = useState("fa");
  const [backgroundId, setBackgroundId] = useState("paper");
  const active = logoAssets.find((item) => item.id === activeId) ?? logoAssets[0];
  const background =
    stageBackgrounds.find((item) => item.id === backgroundId) ?? stageBackgrounds[0];

  return (
    <div className="mb-16">
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {logoAssets.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-xs transition-all duration-300",
              active.id === item.id
                ? "border-forest bg-forest text-paper"
                : "border-forest/10 bg-white/40 text-forest/60 hover:border-forest/25",
            )}
          >
            {item.titleFa}
          </button>
        ))}
      </div>

      <FadeUp>
        <div
          className="group relative min-h-[21rem] overflow-hidden rounded-[1.5rem] border border-forest/10 transition-colors duration-500 sm:min-h-[30rem] sm:rounded-[2rem]"
          style={{ backgroundColor: background.value }}
        >
          <div className="pointer-events-none absolute inset-0 brandbook-logo-grid opacity-[0.22]" aria-hidden />
          <span
            className={cn(
              "absolute left-4 top-4 z-10 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] backdrop-blur-md sm:left-6 sm:top-6",
              background.dark
                ? "border-paper/15 bg-paper/10 text-paper/55"
                : "border-forest/10 bg-white/45 text-forest/45",
            )}
            dir="ltr"
          >
            {active.titleEn}
          </span>

          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[34%] w-[68%] -translate-x-1/2 -translate-y-1/2 sm:h-[38%] sm:w-[62%]",
              active.shape === "mark" && "h-[42%] w-[38%] sm:h-[45%] sm:w-[30%]",
            )}
          >
            <Image
              key={`${active.id}-${background.id}`}
              src={background.dark ? active.white : active.black}
              alt={active.titleFa}
              fill
              sizes="(max-width: 768px) 80vw, 60vw"
              className="object-contain transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]"
            />
          </div>

          <div
            className={cn(
              "absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-4",
              background.dark
                ? "border-paper/10 bg-forest/50 text-paper"
                : "border-forest/10 bg-paper/75 text-forest",
            )}
          >
            <div className="flex items-center gap-2">
              <span className="hidden text-[10px] opacity-45 sm:inline">پس‌زمینه</span>
              {stageBackgrounds.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBackgroundId(item.id)}
                  aria-label={`پس‌زمینه ${item.label}`}
                  title={item.label}
                  className={cn(
                    "h-7 w-7 rounded-full border-2 shadow-sm transition-transform hover:scale-110",
                    background.id === item.id
                      ? "border-peach ring-2 ring-peach/25"
                      : "border-black/10",
                  )}
                  style={{ backgroundColor: item.value }}
                />
              ))}
            </div>

            <a
              href={active.download}
              download
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors",
                background.dark
                  ? "bg-paper text-forest hover:bg-peach"
                  : "bg-forest text-paper hover:bg-forest/90",
              )}
            >
              <DownloadIcon size={16} />
              دانلود SVG
            </a>
          </div>
        </div>
      </FadeUp>

      <FadeUp>
        <div className="mt-4 grid gap-3 rounded-[1.35rem] border border-forest/10 bg-white/45 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
          <div>
            <p className="text-sm font-medium text-forest">پک کامل لوگو و شعار</p>
            <p className="mt-1 text-xs leading-6 text-forest/45">
              شامل نسخه‌های فارسی و انگلیسی، تک‌نشانه، شعارها و فایل‌های اصلی Adobe Illustrator
            </p>
          </div>
          <a
            href="/brand/downloads/choobohonar-brand-assets.zip"
            download
            className="inline-flex items-center justify-center gap-2 rounded-full border border-forest/15 px-5 py-3 text-xs font-medium text-forest transition-all hover:border-forest hover:bg-forest hover:text-paper"
          >
            <DownloadIcon />
            دانلود پک کامل
            <span className="text-[9px] opacity-45" dir="ltr">ZIP</span>
          </a>
        </div>
      </FadeUp>
    </div>
  );
}

function GuidelineRules() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = guidelineCards.find((item) => item.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  return (
    <>
      <Stagger className="mb-16 grid gap-4 md:grid-cols-3" amount={0.4}>
        {guidelineCards.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-[1.35rem] border border-forest/10 bg-white/55 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(9,43,28,0.1)]"
          >
            <button
              type="button"
              onClick={() => setActiveId(item.id)}
              className="relative block w-full overflow-hidden bg-paper px-4 py-5 text-right sm:px-5"
              aria-label={`نمایش بزرگ ${item.titleFa}`}
            >
              <div
                className={cn(
                  "relative mx-auto w-full",
                  "previewClassName" in item && item.previewClassName
                    ? item.previewClassName
                    : item.id === "construction"
                      ? "aspect-square max-w-[9.5rem] sm:max-w-[10.5rem]"
                      : "aspect-[4/3] max-w-none",
                )}
              >
                <Image
                  src={item.src}
                  alt={item.titleFa}
                  fill
                  sizes="(max-width: 768px) 280px, 320px"
                  className="object-contain object-center p-1"
                />
              </div>
              <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-forest/10 bg-paper/85 text-forest/55 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <ExpandIcon size={15} />
              </span>
            </button>
            <div className="border-t border-forest/[0.07] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-medium text-forest">{item.titleFa}</h4>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                    {item.titleEn}
                  </p>
                </div>
                <span className="font-display text-[10px] text-brick" dir="ltr">
                  {item.number}
                </span>
              </div>
              <p className="mt-4 text-xs leading-6 text-forest/50">{item.description}</p>
            </div>
          </article>
        ))}
      </Stagger>

      {active && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-forest/92 p-3 backdrop-blur-xl sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={active.titleFa}
          onClick={() => setActiveId(null)}
        >
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-paper"
            aria-label="بستن تصویر"
          >
            <CloseIcon size={18} />
          </button>
          <div
            className="relative h-[82dvh] w-full max-w-6xl overflow-hidden rounded-[1.5rem] bg-paper"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-4 sm:inset-8">
              <Image
                src={active.src}
                alt={active.titleFa}
                fill
                priority
                sizes="100vw"
                className="object-contain object-center"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ColorCard({
  color,
  onCopy,
  compact = false,
}: {
  color: ColorValue;
  onCopy: (value: string, label: string) => void;
  compact?: boolean;
}) {
  const isDark = ["#092B1C", "#5A3830", "#478486", "#000000"].includes(color.hex);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[1.25rem] border border-forest/10 bg-white/55 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(9,43,28,0.1)]",
        !compact && "sm:min-h-[24rem]",
      )}
    >
      <button
        type="button"
        onClick={() => onCopy(color.hex, color.nameFa)}
        className={cn(
          "relative block w-full text-right",
          compact ? "h-32 sm:h-36" : "h-44 sm:h-52",
        )}
        style={{ backgroundColor: color.hex }}
        aria-label={`کپی کد ${color.nameFa}`}
      >
        <span
          className={cn(
            "absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] backdrop-blur-md transition-transform group-hover:scale-105",
            isDark ? "bg-white/12 text-white/75" : "bg-forest/10 text-forest/65",
          )}
          dir="ltr"
        >
          <CopyIcon size={14} />
          {color.hex}
        </span>
        {color.dominance > 0 && (
          <span
            className={cn(
              "absolute bottom-3 right-3 font-display text-3xl font-light",
              isDark ? "text-white/75" : "text-forest/65",
            )}
            dir="ltr"
          >
            {color.dominance}%
          </span>
        )}
      </button>
      <div className="p-4 sm:p-5">
        <h4 className="text-base font-medium text-forest">{color.nameFa}</h4>
        <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-forest/38" dir="ltr">
          {color.nameEn}
        </p>
        {!compact && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2 text-[10px]">
              <button
                type="button"
                onClick={() => onCopy(`rgb(${color.rgb})`, `${color.nameFa} RGB`)}
                className="rounded-xl bg-forest/[0.045] px-3 py-2 text-right text-forest/55 transition-colors hover:bg-forest/10"
              >
                <span className="block text-[8px] uppercase tracking-wider text-forest/32" dir="ltr">RGB</span>
                <span className="mt-1 block" dir="ltr">{color.rgb}</span>
              </button>
              <button
                type="button"
                onClick={() => onCopy(`cmyk(${color.cmyk})`, `${color.nameFa} CMYK`)}
                className="rounded-xl bg-forest/[0.045] px-3 py-2 text-right text-forest/55 transition-colors hover:bg-forest/10"
              >
                <span className="block text-[8px] uppercase tracking-wider text-forest/32" dir="ltr">CMYK</span>
                <span className="mt-1 block" dir="ltr">{color.cmyk}</span>
              </button>
            </div>
            <p className="mt-4 text-[11px] leading-6 text-forest/45">{color.usage}</p>
          </>
        )}
      </div>
    </article>
  );
}

function ColorSystem({
  onCopy,
}: {
  onCopy: (value: string, label: string) => void;
}) {
  return (
    <div className="mb-16">
      <Stagger className="grid gap-4 md:grid-cols-2" amount={0.35}>
        {primaryBrandColors.map((color) => (
          <ColorCard key={color.hex} color={color} onCopy={onCopy} />
        ))}
      </Stagger>

      <FadeUp>
        <div className="my-5 overflow-hidden rounded-[1.35rem] border border-forest/10 bg-white/45 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-forest">نسبت حضور رنگ</p>
              <p className="mt-1 text-xs text-forest/45">تعادل پیشنهادی در سطح یک صفحه یا کمپین</p>
            </div>
            <p className="font-display text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
              80 / 20 Principle
            </p>
          </div>
          <div className="flex h-20 overflow-hidden rounded-xl sm:h-28">
            <button
              type="button"
              onClick={() => onCopy("#092B1C", "سبز جنگلی")}
              className="group relative flex basis-4/5 items-end bg-forest p-3 text-right text-paper transition-[flex-basis] duration-700 hover:basis-[84%] sm:p-4"
            >
              <span className="font-display text-2xl font-light sm:text-4xl" dir="ltr">80%</span>
              <span className="mr-2 text-[10px] text-paper/45">سبز جنگلی</span>
            </button>
            <button
              type="button"
              onClick={() => onCopy("#FBBEA6", "هلویی")}
              className="flex basis-1/5 items-end justify-end bg-peach p-3 text-forest transition-[flex-basis] duration-700 hover:basis-[24%] sm:p-4"
            >
              <span className="font-display text-2xl font-light sm:text-4xl" dir="ltr">20%</span>
            </button>
          </div>
        </div>
      </FadeUp>

      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" amount={0.5}>
        {secondaryBrandColors.map((color) => (
          <ColorCard key={color.hex} color={color} onCopy={onCopy} compact />
        ))}
      </Stagger>
    </div>
  );
}

function TypographySystem() {
  const [sample, setSample] = useState("خانه، جایی‌ست که زندگی در آن معنا پیدا می‌کند.");
  const [size, setSize] = useState(48);
  const [weight, setWeight] = useState(400);

  const typeStyles = useMemo(
    () => ({
      fontSize: `clamp(1.75rem, ${Math.max(size / 14, 2)}vw, ${size}px)`,
      fontWeight: weight,
    }),
    [size, weight],
  );

  return (
    <div className="pb-8">
      <div className="grid gap-4 lg:grid-cols-3 lg:items-stretch">
        {typography.fonts.map((font, index) => (
          <FadeUp key={font.nameEn} delay={index * 0.04} className="h-full">
            <article className="flex h-[26rem] flex-col rounded-[1.35rem] border border-forest/10 bg-white/55 p-5 sm:h-[28rem] sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-2xl font-light tracking-tightest text-forest">{font.nameFa}</h4>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-forest/35" dir="ltr">
                    {font.nameEn}
                  </p>
                </div>
                <span className="font-display text-[10px] text-brick" dir="ltr">0{index + 1}</span>
              </div>
              <p
                className={cn(
                  "mt-8 line-clamp-3 text-[clamp(1.55rem,3vw,2.4rem)] leading-[1.35] tracking-tightest text-forest",
                  index === 2 && "font-display",
                )}
                dir={index === 2 ? "ltr" : "rtl"}
              >
                {font.sample}
              </p>
              <p className="mt-6 text-xs leading-6 text-forest/50">{font.role}</p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                {font.weights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-forest/10 px-2.5 py-1 text-[9px] text-forest/45"
                    dir="ltr"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          </FadeUp>
        ))}
      </div>

      <FadeUp>
        <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-forest/10 bg-white/55">
          <div className="grid gap-4 border-b border-forest/[0.07] p-4 sm:p-5 md:grid-cols-[1fr_auto_auto] md:items-center">
            <div>
              <label htmlFor="type-sample" className="mb-2 block text-[10px] text-forest/40">
                متن آزمایشی
              </label>
              <input
                id="type-sample"
                type="text"
                value={sample}
                onChange={(event) => setSample(event.target.value)}
                className="w-full border-b border-forest/15 bg-transparent pb-2 text-sm text-forest outline-none transition-colors focus:border-forest"
              />
            </div>
            <label className="text-[10px] text-forest/40">
              اندازه
              <span className="mr-2 font-display text-forest" dir="ltr">{size}px</span>
              <input
                type="range"
                min="28"
                max="88"
                value={size}
                onChange={(event) => setSize(Number(event.target.value))}
                className="mt-2 block w-full accent-forest md:w-36"
              />
            </label>
            <label className="text-[10px] text-forest/40">
              وزن
              <select
                value={weight}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="mt-2 block rounded-full border border-forest/10 bg-paper px-3 py-2 text-xs text-forest outline-none"
              >
                {[300, 400, 500, 600, 700, 900].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex min-h-[17rem] items-center justify-center p-6 sm:min-h-[23rem] sm:p-10">
            <p className="max-w-5xl text-center leading-[1.45] tracking-tightest text-forest transition-all duration-300" style={typeStyles}>
              {sample || "متن خود را وارد کنید"}
            </p>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

function CollateralLightbox({
  active,
  onClose,
}: {
  active: { src: string; title: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onClose]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-forest/92 p-3 backdrop-blur-xl sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-paper"
        aria-label="بستن تصویر"
      >
        <CloseIcon size={18} />
      </button>
      <div
        className="relative h-[82dvh] w-full max-w-6xl overflow-hidden rounded-[1.5rem] bg-paper"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="absolute inset-4 sm:inset-8">
          <Image
            src={active.src}
            alt={active.title}
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>
      </div>
    </div>
  );
}

function CollateralPreview({
  src,
  alt,
  className,
  onExpand,
}: {
  src: string;
  alt: string;
  className?: string;
  onExpand: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onExpand}
      className={cn(
        "group relative block w-full overflow-hidden rounded-[1.25rem] border border-forest/10 bg-paper text-right",
        className,
      )}
      aria-label={`نمایش بزرگ ${alt}`}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-4 sm:p-6" />
      </div>
      <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-forest/10 bg-paper/85 text-forest/55 opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
        <ExpandIcon size={15} />
      </span>
    </button>
  );
}

function BrandCollateralSystem() {
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);
  const { pattern, shoppingBags, envelope, productTags } = brandCollateral;

  return (
    <div className="pb-8">
      <FadeUp>
        <p className="mb-10 max-w-3xl text-sm leading-7 text-forest/60">{brandCollateral.intro}</p>
      </FadeUp>

      <div id="brand-pattern" className="mb-16 scroll-mt-12">
        <FadeUp>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-xl font-medium text-forest">{pattern.titleFa}</h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                {pattern.titleEn}
              </p>
            </div>
            <span className="font-display text-[10px] text-brick" dir="ltr">Pattern</span>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-forest/55">{pattern.description}</p>
        </FadeUp>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <FadeUp>
            <BrandbookCard lift="sm" className="overflow-hidden p-2">
              <CollateralPreview
                src={pattern.displayImage}
                alt={pattern.titleFa}
                onExpand={() => setLightbox({ src: pattern.displayImage, title: pattern.titleFa })}
                className="border-0"
              />
            </BrandbookCard>
          </FadeUp>
          <div className="grid gap-4">
            <FadeUp delay={0.05}>
              <BrandbookCard lift="sm" className="p-2">
                <CollateralPreview
                  src={pattern.tileImage}
                  alt="تکرار پترن"
                  className="border-0"
                  onExpand={() => setLightbox({ src: pattern.tileImage, title: "تکرار پترن" })}
                />
                <p className="px-4 pb-4 text-[11px] text-forest/45">نمای تکرار یکنواخت</p>
              </BrandbookCard>
            </FadeUp>
            <FadeUp delay={0.08}>
              <BrandbookCard lift="sm" className="p-2">
                <CollateralPreview
                  src={pattern.applicationImage}
                  alt="کاربرد پترن روی پاکت"
                  className="border-0"
                  onExpand={() =>
                    setLightbox({ src: pattern.applicationImage, title: "کاربرد پترن — داخل پاکت" })
                  }
                />
                <p className="px-4 pb-4 text-[11px] text-forest/45">کاربرد روی داخل پاکت</p>
              </BrandbookCard>
            </FadeUp>
          </div>
        </div>

        <FadeUp>
          <ul className="mt-6 space-y-2 rounded-[1.25rem] border border-forest/10 bg-white/45 p-5">
            {pattern.rules.map((rule) => (
              <li key={rule} className="flex items-start gap-3 text-xs leading-6 text-forest/60">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-peach" />
                {rule}
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      <div id="brand-bags" className="mb-16 scroll-mt-12">
        <FadeUp>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-xl font-medium text-forest">{shoppingBags.titleFa}</h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                {shoppingBags.titleEn}
              </p>
            </div>
            <span className="font-display text-[10px] text-brick" dir="ltr">Bags</span>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-forest/55">{shoppingBags.description}</p>
        </FadeUp>

        <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" amount={0.35}>
          {shoppingBags.variants.map((bag) => (
            <BrandbookCard key={bag.id} lift="sm" className="overflow-hidden p-2">
              <CollateralPreview
                src={bag.image}
                alt={bag.titleFa}
                className="border-0"
                onExpand={() => setLightbox({ src: bag.image, title: bag.titleFa })}
              />
              <div className="border-t border-forest/[0.07] px-4 py-4">
                <h5 className="text-sm font-medium text-forest">{bag.titleFa}</h5>
                <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-forest/35" dir="ltr">
                  {bag.titleEn}
                </p>
              </div>
            </BrandbookCard>
          ))}
        </Stagger>
      </div>

      <div id="brand-envelope" className="mb-16 scroll-mt-12">
        <FadeUp>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-xl font-medium text-forest">{envelope.titleFa}</h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                {envelope.titleEn}
              </p>
            </div>
            <span className="font-display text-[10px] text-brick" dir="ltr">Envelope</span>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-forest/55">{envelope.description}</p>
        </FadeUp>

        <div className="grid gap-4 lg:grid-cols-2">
          {[envelope.outside, envelope.inside].map((side, index) => (
            <FadeUp key={side.titleEn} delay={index * 0.05}>
              <BrandbookCard lift="sm" className="overflow-hidden p-2">
                <CollateralPreview
                  src={side.image}
                  alt={side.titleFa}
                  className="border-0"
                  onExpand={() => setLightbox({ src: side.image, title: side.titleFa })}
                />
                <div className="border-t border-forest/[0.07] px-4 py-4">
                  <h5 className="text-sm font-medium text-forest">{side.titleFa}</h5>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.13em] text-forest/35" dir="ltr">
                    {side.titleEn}
                  </p>
                </div>
              </BrandbookCard>
            </FadeUp>
          ))}
        </div>
      </div>

      <div id="brand-product-tags" className="scroll-mt-12">
        <FadeUp>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-xl font-medium text-forest">{productTags.titleFa}</h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                {productTags.titleEn}
              </p>
            </div>
            <span className="font-display text-[10px] text-brick" dir="ltr">Tags</span>
          </div>
          <p className="mb-6 max-w-2xl text-sm leading-7 text-forest/55">{productTags.description}</p>
        </FadeUp>

        <FadeUp>
          <BrandbookCard lift="sm" className="mx-auto max-w-3xl overflow-hidden p-2">
            <CollateralPreview
              src={productTags.image}
              alt={productTags.titleFa}
              className="border-0"
              onExpand={() => setLightbox({ src: productTags.image, title: productTags.titleFa })}
            />
          </BrandbookCard>
        </FadeUp>
      </div>

      <CollateralLightbox active={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}

function CopyToast({ visible, label }: { visible: boolean; label: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed bottom-24 left-1/2 z-[105] -translate-x-1/2 rounded-full bg-forest px-5 py-3 text-xs text-paper shadow-2xl transition-all duration-300 md:bottom-7",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
      role="status"
      aria-live="polite"
    >
      {label} کپی شد
    </div>
  );
}

export default function VisualIdentity() {
  const [toast, setToast] = useState({ visible: false, label: "" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Browsers may block clipboard on non-secure local contexts. The visual
      // confirmation is still useful and the value remains visible.
    }
    setToast({ visible: true, label });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 1700);
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <section
      id="visual-identity"
      className="relative overflow-hidden bg-paper py-20 text-forest sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-35" aria-hidden />
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <ChapterHeading
          eyebrow="فصل ششم — Visual Identity"
          title={
            <>
              یک زبان بصری
              <br />
              <span className="text-brick">آرام، دقیق و ماندگار.</span>
            </>
          }
          description="هویت بصری خانه چوب و هنر بر پایه‌ی صداقت فرم، گرمای متریال و فضای تنفس شکل گرفته است. هر کاربرد باید حس اعتماد و کیفیتی بی‌صدا را منتقل کند."
          aside={
            <div className="mt-6 flex flex-wrap gap-2">
              {visualSections.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToTarget(item.id)}
                  className="rounded-full border border-forest/10 px-3 py-2 text-[10px] text-forest/50 transition-colors hover:border-forest hover:text-forest"
                >
                  {item.label}
                  <span className="mr-1.5 opacity-45" dir="ltr">{item.labelEn}</span>
                </button>
              ))}
            </div>
          }
        />

        <div className="mb-12 mt-12 h-px bg-forest/10 sm:mb-20 sm:mt-24" />

        <div id="logo-system" className="scroll-mt-12">
          <SectionHeading
            number="06.1"
            title="سیستم لوگو"
            titleEn="Logo Suite"
            description="نسخه مناسب را بر اساس زبان، رنگ زمینه و فضای در دسترس انتخاب کنید. نسبت، فرم حروف و فاصله‌های داخلی نباید تغییر کنند."
          />
          <LogoStage />
        </div>

        <div id="logo-rules" className="scroll-mt-12">
          <SectionHeading
            number="06.2"
            title="قواعد کاربرد"
            titleEn="Usage Principles"
            description="مرجع‌های فنی برندبوک در یک ساختار کنترل‌شده و قابل بزرگ‌نمایی ارائه شده‌اند تا جزئیات بدون برهم‌زدن ریتم صفحه در دسترس باشند."
          />
          <GuidelineRules />
        </div>

        <div id="color-system" className="scroll-mt-12">
          <SectionHeading
            number="06.3"
            title="سیستم رنگ"
            titleEn="Color System"
            description="سبز جنگلی بستر اصلی و هلویی منبع گرماست. رنگ‌های مکمل تنها برای تأکیدهای محدود و ایجاد ریتم استفاده می‌شوند."
          />
          <ColorSystem onCopy={handleCopy} />
        </div>

        <div id="type-system" className="scroll-mt-12">
          <SectionHeading
            number="06.4"
            title="سیستم تایپوگرافی"
            titleEn="Typography"
            description="تایپوگرافی باید خوانا، آرام و دارای سلسله‌مراتب روشن باشد. ابزار آزمایش زنده برای بررسی وزن و مقیاس در همان صفحه در دسترس است."
          />
          <TypographySystem />
        </div>

        <div id="brand-collateral" className="scroll-mt-12">
          <SectionHeading
            number="06.5"
            title="دارایی‌های کاربردی"
            titleEn="Brand Collateral"
            description="پترن، ساک خرید و پاکت نامه از راهنمای بصری — برای چاپ، بسته‌بندی و فضای فیزیکی برند."
          />
          <BrandCollateralSystem />
        </div>
      </div>

      <CopyToast visible={toast.visible} label={toast.label} />
    </section>
  );
}
