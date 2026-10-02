"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/upload";

export const DEFAULT_HOME_HERO = {
  desktopVideo: "/videos/anzhelik.mp4",
  mobileVideo: "/videos/hero-mobile.mp4",
} as const;

export type HomeHeroMedia = {
  desktopVideo: string;
  mobileVideo: string;
};

export type HomeShowcaseImage = {
  image: string;
  caption: string;
};

export const DEFAULT_HOME_SHOWCASE: HomeShowcaseImage[] = [
  { image: "/images/projects/aknoon-residence/07.jpg", caption: "اقامتگاه آکنون" },
  { image: "/images/projects/shenaj-villa/68.jpg", caption: "ویلای شناج" },
  { image: "/images/projects/armon-hotel/25.jpg", caption: "هتل آرمون" },
];

type Slot = keyof HomeHeroMedia;

const SLOTS: { id: Slot; title: string; hint: string }[] = [
  {
    id: "desktopVideo",
    title: "ویدیوی دسکتاپ",
    hint: "از عرض ۱۲۸۰ پیکسل به بالا پخش می‌شود.",
  },
  {
    id: "mobileVideo",
    title: "ویدیوی موبایل",
    hint: "در موبایل و تبلت پخش می‌شود.",
  },
];

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function readHomeShowcase(data: Record<string, unknown> | undefined): HomeShowcaseImage[] {
  const raw = Array.isArray(data?.showcase) ? data.showcase : [];
  return DEFAULT_HOME_SHOWCASE.map((fallback, index) => {
    const item = raw[index];
    const record = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      image: readString(record.image) || fallback.image,
      caption: readString(record.caption) || fallback.caption,
    };
  });
}

export function readHomeHero(data: Record<string, unknown> | undefined): HomeHeroMedia {
  const hero = data?.hero;
  const record = hero && typeof hero === "object" ? (hero as Record<string, unknown>) : {};
  return {
    desktopVideo: readString(record.desktopVideo) || DEFAULT_HOME_HERO.desktopVideo,
    mobileVideo: readString(record.mobileVideo) || DEFAULT_HOME_HERO.mobileVideo,
  };
}

/** Public site files such as /videos and /images are not in the admin app. Uploads stay on this origin. */
function previewSrc(src: string) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("/uploads/")) return src;
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://choobohonar.com").replace(/\/$/, "");
  return `${site}${src.startsWith("/") ? src : `/${src}`}`;
}

type Props = {
  hero: HomeHeroMedia;
  showcase: HomeShowcaseImage[];
  onChange: (hero: HomeHeroMedia) => void;
  onShowcaseChange: (showcase: HomeShowcaseImage[]) => void;
  onBusyChange?: (busy: boolean) => void;
  onProgress?: (percent: number) => void;
};

export default function HomeHeroEditor({ hero, showcase, onChange, onShowcaseChange, onBusyChange, onProgress }: Props) {
  const [slot, setSlot] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  async function replace(target: Slot, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      setError("فقط فایل ویدیو قابل آپلود است.");
      return;
    }
    setSlot(target);
    setProgress(0);
    setError("");
    onBusyChange?.(true);
    try {
      const url = await uploadMedia(file, ({ percent }) => {
        setProgress(percent);
        onProgress?.(percent);
      });
      onChange({ ...hero, [target]: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود ویدیو انجام نشد");
    } finally {
      setSlot(null);
      setProgress(0);
      onBusyChange?.(false);
    }
  }

  return (
    <section className="rounded-2xl border border-forest/10 bg-white/80 p-5 sm:p-6">
      <p className="text-[10px] tracking-[0.18em] text-brick" dir="ltr">HOME HERO</p>
      <h2 className="mt-2 text-lg font-medium text-forest">ویدیوی هیرو صفحه خانه</h2>
      <p className="mt-2 max-w-2xl text-xs leading-6 text-forest/50">
        این ویدیو پس‌زمینه بخش بالای صفحه خانه است. بعد از آپلود، «به‌روزرسانی» را بزنید تا روی سایت جایگزین شود.
      </p>
      {error ? <p className="mt-4 rounded-xl border border-brick/15 bg-brick/[0.05] px-4 py-3 text-xs text-brick">{error}</p> : null}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {SLOTS.map((item) => {
          const src = hero[item.id];
          const busy = slot === item.id;
          return (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
              <video
                key={src}
                src={previewSrc(src)}
                muted
                playsInline
                controls
                preload="metadata"
                className="aspect-video w-full bg-forest object-cover"
              />
              <div className="space-y-3 p-4">
                <div>
                  <p className="text-sm font-medium text-forest">{item.title}</p>
                  <p className="mt-1 text-[11px] leading-5 text-forest/45">{item.hint}</p>
                  <p className="mt-2 truncate text-[10px] text-forest/35" dir="ltr">{src}</p>
                </div>
                <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-forest/20 bg-white px-3 py-3 text-xs text-forest/70 hover:border-forest/35">
                  {busy ? `در حال آپلود… ${progress}٪` : "آپلود ویدیوی جدید"}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="sr-only"
                    disabled={Boolean(slot)}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      void replace(item.id, file);
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {src !== DEFAULT_HOME_HERO[item.id] ? (
                  <button
                    type="button"
                    onClick={() => onChange({ ...hero, [item.id]: DEFAULT_HOME_HERO[item.id] })}
                    className="text-[11px] text-forest/45 underline-offset-2 hover:underline"
                  >
                    بازگشت به ویدیوی پیش‌فرض
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 border-t border-forest/10 pt-6">
        <h2 className="text-lg font-medium text-forest">سه عکس بالای صفحه</h2>
        <p className="mt-2 max-w-2xl text-xs leading-6 text-forest/50">
          این عکس‌ها در بخش «تنوع پروژه‌های ما» دیده می‌شوند. بعد از جایگزینی، «به‌روزرسانی» را بزنید.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {showcase.map((item, index) => {
            const busy = slot === `image-${index}`;
            return (
              <div key={DEFAULT_HOME_SHOWCASE[index].caption} className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
                <img src={previewSrc(item.image)} alt={item.caption} className="aspect-[4/5] w-full object-cover" />
                <div className="space-y-3 p-4">
                  <label className="block text-[11px] text-forest/45">
                    عنوان
                    <input
                      value={item.caption}
                      onChange={(event) => {
                        const next = showcase.map((shot, shotIndex) =>
                          shotIndex === index ? { ...shot, caption: event.target.value } : shot,
                        );
                        onShowcaseChange(next);
                      }}
                      className="mt-1 w-full rounded-xl border border-forest/10 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-forest/30"
                    />
                  </label>
                  <p className="truncate text-[10px] text-forest/35" dir="ltr">{item.image}</p>
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-forest/20 bg-white px-3 py-3 text-xs text-forest/70 hover:border-forest/35">
                    {busy ? `در حال آپلود… ${progress}٪` : "آپلود عکس جدید"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={Boolean(slot)}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        void replaceImage(index, file);
                        event.currentTarget.value = "";
                      }}
                    />
                  </label>
                  {item.image !== DEFAULT_HOME_SHOWCASE[index].image ? (
                    <button
                      type="button"
                      onClick={() => {
                        const next = showcase.map((shot, shotIndex) =>
                          shotIndex === index ? { ...shot, image: DEFAULT_HOME_SHOWCASE[index].image } : shot,
                        );
                        onShowcaseChange(next);
                      }}
                      className="text-[11px] text-forest/45 underline-offset-2 hover:underline"
                    >
                      بازگشت به عکس پیش‌فرض
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );

  async function replaceImage(index: number, file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("فقط فایل تصویر قابل آپلود است.");
      return;
    }
    setSlot(`image-${index}`);
    setProgress(0);
    setError("");
    onBusyChange?.(true);
    try {
      const url = await uploadMedia(file, ({ percent }) => {
        setProgress(percent);
        onProgress?.(percent);
      });
      onShowcaseChange(showcase.map((shot, shotIndex) => (shotIndex === index ? { ...shot, image: url } : shot)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود عکس انجام نشد");
    } finally {
      setSlot(null);
      setProgress(0);
      onBusyChange?.(false);
    }
  }
}
