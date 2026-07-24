"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import { ChevronLeftIcon, CloseIcon } from "@/components/brandbook/icons";

type ImageryCategory = "all" | "space" | "detail";

type ImageryItem = {
  src: string;
  alt: string;
  project: string;
  projectEn: string;
  category: Exclude<ImageryCategory, "all">;
  note: string;
  className?: string;
  focal?: string;
};

const imagery: ImageryItem[] = [
  {
    src: "/brand/imagery/shenaj-living.webp",
    alt: "فضای نشیمن روشن با مبلمان خانه چوب و هنر",
    project: "پروژه شناژ",
    projectEn: "Shenaj Residence",
    category: "space",
    note: "نور طبیعی، سکون و جریان زندگی",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/brand/imagery/aknoon-chair.webp",
    alt: "جزئیات صندلی چرمی و چوبی",
    project: "اکنون",
    projectEn: "Aknoon Collection",
    category: "detail",
    note: "بافت صادق متریال",
    focal: "center 64%",
  },
  {
    src: "/brand/imagery/araz-suite.webp",
    alt: "سوئیت هتل آراز با ترکیب چوب و پارچه",
    project: "هتل آراز",
    projectEn: "Araz Hotel",
    category: "space",
    note: "گرما در مقیاس معماری",
  },
  {
    src: "/brand/imagery/aknoon-library.webp",
    alt: "کتابخانه و میز چوبی در فضای تیره",
    project: "اکنون",
    projectEn: "Aknoon Collection",
    category: "space",
    note: "عمق، حافظه و شخصیت",
  },
  {
    src: "/brand/imagery/shenaj-workspace.webp",
    alt: "اتاق کار مینیمال با میز و کتابخانه چوبی",
    project: "پروژه شناژ",
    projectEn: "Shenaj Residence",
    category: "space",
    note: "کارکرد آرام و بی‌ادعا",
  },
  {
    src: "/brand/imagery/aknoon-detail.webp",
    alt: "نمای نزدیک میز مشکی و اتصال ظریف آن",
    project: "اکنون",
    projectEn: "Aknoon Collection",
    category: "detail",
    note: "جزئیاتی که کیفیت را تعریف می‌کنند",
  },
  {
    src: "/brand/imagery/araz-table.webp",
    alt: "میز غذاخوری هتل آراز کنار پنجره",
    project: "هتل آراز",
    projectEn: "Araz Hotel",
    category: "detail",
    note: "محصول در متن زندگی",
  },
  {
    src: "/brand/imagery/araz-room.webp",
    alt: "فضای اتاق روشن در هتل آراز",
    project: "هتل آراز",
    projectEn: "Araz Hotel",
    category: "space",
    note: "تعادل، نور و تنفس",
  },
  {
    src: "/brand/imagery/aknoon-craft.webp",
    alt: "مجموعه ساعت‌ها و میز چوبی در فضای اکنون",
    project: "اکنون",
    projectEn: "Aknoon Collection",
    category: "detail",
    note: "روایت اشیا و گذر زمان",
    className: "md:col-span-2",
  },
  {
    src: "/brand/imagery/shenaj-dining.webp",
    alt: "میز غذاخوری چوبی در پروژه شناژ",
    project: "پروژه شناژ",
    projectEn: "Shenaj Residence",
    category: "space",
    note: "خانه، صحنه‌ی خاطره‌های روزمره",
  },
  {
    src: "/brand/imagery/araz-bedroom.webp",
    alt: "اتاق هتل آراز با منظره طبیعی",
    project: "هتل آراز",
    projectEn: "Araz Hotel",
    category: "space",
    note: "آرامش در امتداد منظره",
  },
];

const filters: { id: ImageryCategory; label: string; labelEn: string }[] = [
  { id: "all", label: "همه تصاویر", labelEn: "All" },
  { id: "space", label: "فضا و زندگی", labelEn: "Spaces" },
  { id: "detail", label: "متریال و جزئیات", labelEn: "Details" },
];

export default function ImageryGallery() {
  const [filter, setFilter] = useState<ImageryCategory>("all");
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  const visible = useMemo(
    () => imagery.filter((item) => filter === "all" || item.category === filter),
    [filter],
  );
  const activeIndex = activeSrc
    ? visible.findIndex((item) => item.src === activeSrc)
    : -1;
  const activeItem = activeIndex >= 0 ? visible[activeIndex] : null;

  const showAt = useCallback(
    (index: number) => {
      const normalized = (index + visible.length) % visible.length;
      setActiveSrc(visible[normalized].src);
    },
    [visible],
  );

  useEffect(() => {
    if (!activeItem) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveSrc(null);
      if (event.key === "ArrowLeft") showAt(activeIndex + 1);
      if (event.key === "ArrowRight") showAt(activeIndex - 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, activeItem, showAt]);

  return (
    <section
      id="imagery"
      className="relative overflow-hidden bg-forest py-20 text-paper sm:py-24 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-25" aria-hidden />
      <div className="pointer-events-none absolute -left-28 top-1/4 h-96 w-96 rounded-full bg-peach/10 blur-[120px]" aria-hidden />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <div className="mb-12 grid gap-8 md:grid-cols-12 md:items-end lg:mb-16">
            <div className="md:col-span-7">
              <span className="eyebrow text-peach">۶.۵ — Imagery</span>
              <h2 className="mt-4 text-[clamp(2.4rem,6vw,5.5rem)] font-light leading-[0.95] tracking-tightest">
                تصویر باید
                <br />
                <span className="text-peach">حس زندگی را منتقل کند.</span>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-sm leading-8 text-paper/58 sm:text-base">
                عکاسی خانه چوب و هنر، محصول را جدا از زندگی نمایش نمی‌دهد. نور طبیعی،
                حضور انسان، صداقت متریال و جزئیات ساخت، چهار ستون زبان تصویری برند هستند.
              </p>
              <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-paper/35" dir="ltr">
                <span>Natural light</span>
                <span className="h-px w-8 bg-peach/40" />
                <span>Honest material</span>
              </div>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <div className="mb-7 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-xs transition-all duration-300",
                  filter === item.id
                    ? "border-peach bg-peach text-forest"
                    : "border-paper/15 text-paper/55 hover:border-paper/35 hover:text-paper",
                )}
              >
                {item.label}
                <span className="mr-2 text-[9px] opacity-55" dir="ltr">
                  {item.labelEn}
                </span>
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="grid auto-rows-[12rem] grid-cols-2 gap-2.5 sm:auto-rows-[15rem] sm:gap-3 md:auto-rows-[18rem] md:grid-cols-4 lg:auto-rows-[22rem]">
          {visible.map((item, index) => (
            <FadeUp
              key={item.src}
              variant="scale"
              y={24}
              delay={Math.min(index * 0.025, 0.16)}
              className={cn(
                "group relative min-h-0 overflow-hidden rounded-[1.1rem] border border-paper/10 bg-paper/5 sm:rounded-[1.4rem]",
                item.className,
                filter !== "all" && index === 0 && "md:col-span-2 md:row-span-2",
              )}
            >
              <button
                type="button"
                className="absolute inset-0 z-10 w-full text-right"
                onClick={() => setActiveSrc(item.src)}
                aria-label={`نمایش بزرگ ${item.alt}`}
              >
                <span className="sr-only">{item.alt}</span>
              </button>
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition duration-700 ease-out-expo group-hover:scale-[1.035]"
                style={{ objectPosition: item.focal }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/85 via-forest/5 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3.5 sm:p-5">
                <p className="text-xs font-medium sm:text-sm">{item.project}</p>
                <div className="mt-1 flex items-end justify-between gap-2">
                  <p className="line-clamp-1 text-[10px] text-paper/50 sm:text-xs">
                    {item.note}
                  </p>
                  <span className="hidden font-display text-[9px] uppercase tracking-[0.12em] text-peach/70 sm:block" dir="ltr">
                    {item.projectEn}
                  </span>
                </div>
              </div>
              <span className="pointer-events-none absolute left-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-paper/20 bg-forest/25 text-xs text-paper/70 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                ↗
              </span>
            </FadeUp>
          ))}
        </div>

        <FadeUp>
          <div className="mt-12 grid gap-4 border-t border-paper/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["نور", "ترجیح نور طبیعی و سایه‌های نرم", "Light"],
              ["متریال", "نمایش بافت واقعی چوب و پارچه", "Material"],
              ["زندگی", "محصول در متن استفاده و تجربه", "Life"],
              ["کادربندی", "فضای تنفس و پرهیز از شلوغی", "Framing"],
            ].map(([title, text, en], index) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-paper/[0.08] p-4">
                <span className="font-display text-[10px] text-peach" dir="ltr">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="mt-1 text-xs leading-6 text-paper/45">{text}</p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-paper/25" dir="ltr">
                    {en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>

      {activeItem && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#061d13]/95 p-3 backdrop-blur-xl sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`نمایش تصویر ${activeItem.project}`}
          onClick={() => setActiveSrc(null)}
        >
          <button
            type="button"
            onClick={() => setActiveSrc(null)}
            className="absolute left-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-paper backdrop-blur-md sm:left-6 sm:top-6"
            aria-label="بستن تصویر"
          >
            <CloseIcon size={18} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showAt(activeIndex - 1);
            }}
            className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-paper backdrop-blur-md sm:right-6"
            aria-label="تصویر قبلی"
          >
            <ChevronLeftIcon size={18} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showAt(activeIndex + 1);
            }}
            className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-paper/15 bg-paper/10 text-paper backdrop-blur-md sm:left-6"
            aria-label="تصویر بعدی"
          >
            <ChevronLeftIcon size={18} className="rotate-180" />
          </button>

          <div
            className="relative h-[76dvh] w-full max-w-6xl overflow-hidden rounded-[1.5rem]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeItem.src}
              alt={activeItem.alt}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest/90 to-transparent px-5 pb-5 pt-20 sm:px-8 sm:pb-7">
              <p className="text-base font-medium text-paper sm:text-lg">{activeItem.project}</p>
              <p className="mt-1 text-xs text-paper/55 sm:text-sm">{activeItem.note}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
