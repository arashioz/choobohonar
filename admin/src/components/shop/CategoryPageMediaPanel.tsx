"use client";

import { useEffect, useState } from "react";
import { shopApi, type ShopCampaignBanner } from "@/lib/shop-api";
import { uploadMedia } from "@/lib/upload";

const HERO_DEFAULTS: Record<string, { eyebrow: string; title: string; text: string }> = {
  livingroom: { eyebrow: "Living / 01", title: "نشیمن", text: "از کاناپه‌های عمیق تا میزهای کم‌ارتفاع؛ هر قطعه برای ساختن یک مرکز آرام در خانه انتخاب شده است." },
  bedroom: { eyebrow: "Bedroom / 02", title: "اتاق خواب", text: "سرویس‌های خواب، پاتختی و دراور با تناسبات آرام و جزئیات دقیق چوب ساخته می‌شوند." },
  diningroom: { eyebrow: "Dining / 03", title: "غذاخوری", text: "میز و صندلی غذاخوری با سازه‌های ماندگار و سطح‌هایی آماده برای استفاده هرروزه طراحی شده‌اند." },
  bedding: { eyebrow: "Bedding / 04", title: "کالای خواب", text: "منسوجات خواب با تمرکز بر لمس، دوام و هماهنگی رنگی با فضای اتاق انتخاب شده‌اند." },
  carpet: { eyebrow: "Carpet / 05", title: "فرش و گلیم", text: "فرش، لایه‌ای میان معماری و زندگی است؛ بافت، مقیاس و رنگ آن ریتم فضا را کامل می‌کند." },
  lighting: { eyebrow: "Lighting / 06", title: "روشنایی", text: "روشنایی فقط یک شیء نیست؛ کیفیت سایه، تمرکز و گرمای بصری فضای خانه را تنظیم می‌کند." },
  decor: { eyebrow: "Objects / 07", title: "دکور", text: "از آینه و گلدان تا شمع و ظروف؛ جزئیاتی که روایت خانه را شخصی و کامل می‌کنند." },
};

const overlayField = "w-full bg-transparent text-paper placeholder:text-paper/45 focus:outline-none";

export default function CategoryPageMediaPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<ShopCampaignBanner[]>([]);
  const [selected, setSelected] = useState("");
  const [mode, setMode] = useState<"hero" | "banner">("hero");
  const [heroImage, setHeroImage] = useState("");
  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroText, setHeroText] = useState("");
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    shopApi.campaignBanners
      .list()
      .then((rows) => {
        setItems(rows);
        if (rows[0]) select(rows[0]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "دریافت دسته‌ها ناموفق بود"));
  }, []);

  function select(item: ShopCampaignBanner) {
    setSelected(item.slug);
    setHeroImage(item.heroImage || "");
    setHeroEyebrow(item.heroEyebrow || "");
    setHeroTitle(item.heroTitle || "");
    setHeroText(item.heroText || "");
    setImage(item.image || "");
    setTitle(item.title || "");
    setSubtitle(item.subtitle || "");
    setMessage("");
    setError("");
  }

  async function save() {
    if (!selected) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const saved = await shopApi.campaignBanners.update(
        selected,
        mode === "hero"
          ? { heroImage, heroEyebrow, heroTitle, heroText }
          : { image, title, subtitle },
      );
      setItems((current) => current.map((item) => (item.slug === saved.slug ? { ...item, ...saved } : item)));
      setMessage(mode === "hero" ? "هیرو ذخیره شد" : "بنر ذخیره شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      const url = await uploadMedia(file);
      if (mode === "hero") setHeroImage(url);
      else setImage(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود تصویر ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  const current = items.find((item) => item.slug === selected);
  const defaults = HERO_DEFAULTS[selected] || { eyebrow: "", title: current?.label || "", text: "" };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-4 sm:items-center">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-paper shadow-xl">
        <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-brick" dir="ltr">CATEGORY PAGE</p>
            <h2 className="mt-1 text-lg font-medium text-forest">هیرو و بنر دسته</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-forest/50">بستن</button>
        </header>
        <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[14rem_minmax(0,1fr)]">
          <nav className="overflow-y-auto border-b border-forest/10 lg:border-b-0 lg:border-l">
            {items.map((item) => (
              <button key={item.slug} type="button" onClick={() => select(item)} className={`block w-full px-4 py-3 text-right text-sm ${selected === item.slug ? "bg-forest text-paper" : "text-forest/70 hover:bg-forest/5"}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <form className="space-y-4 overflow-y-auto p-5" onSubmit={(event) => { event.preventDefault(); void save(); }}>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setMode("hero")} className={`rounded-xl px-3 py-2 text-xs ${mode === "hero" ? "bg-forest text-paper" : "border border-forest/10 bg-white text-forest/70"}`}>هیرو اصلی</button>
              <button type="button" onClick={() => setMode("banner")} className={`rounded-xl px-3 py-2 text-xs ${mode === "banner" ? "bg-forest text-paper" : "border border-forest/10 bg-white text-forest/70"}`}>بنر داخل فهرست</button>
            </div>
            <p className="text-xs leading-6 text-forest/45">
              {mode === "hero"
                ? `متن را مستقیم روی هیروی ${current?.label || "دسته"} بنویسید. خالی بماند، متن پیش‌فرض سایت می‌ماند.`
                : `این بنر بین کارت‌های محصول ${current?.label || "دسته"} قرار می‌گیرد و از هیرو جدا است.`}
            </p>

            {mode === "hero" ? (
              <div className="relative min-h-[22rem] overflow-hidden rounded-2xl bg-forest text-paper">
                {heroImage ? <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,29,19,0.28)_0%,rgba(6,29,19,0.2)_30%,rgba(6,29,19,0.88)_100%)]" />
                <div className="relative z-10 grid min-h-[22rem] items-end gap-6 p-6 md:grid-cols-[1fr_16rem]">
                  <div>
                    <input value={heroEyebrow} onChange={(e) => setHeroEyebrow(e.target.value)} placeholder={defaults.eyebrow} className={`${overlayField} text-[11px] tracking-[0.16em] text-peach placeholder:text-peach/50`} dir="ltr" />
                    <textarea value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder={defaults.title} rows={2} className={`${overlayField} mt-3 resize-none text-4xl font-extralight leading-none md:text-5xl`} />
                  </div>
                  <textarea value={heroText} onChange={(e) => setHeroText(e.target.value)} placeholder={defaults.text} rows={5} className={`${overlayField} resize-none border-r border-paper/25 pr-4 text-sm leading-7`} />
                </div>
              </div>
            ) : (
              <div className="relative min-h-[18rem] overflow-hidden rounded-2xl bg-forest text-paper">
                {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
                <div className="absolute inset-0 bg-gradient-to-l from-forest/90 via-forest/45 to-transparent" />
                <div className="relative z-10 flex min-h-[18rem] max-w-md flex-col justify-end p-6">
                  <textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={2} className={`${overlayField} resize-none text-4xl font-extralight leading-none`} />
                  <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={3} className={`${overlayField} mt-3 resize-none text-sm leading-7 text-paper/80`} />
                </div>
              </div>
            )}

            <label className="inline-flex cursor-pointer rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs text-forest/70">
              {mode === "hero" ? "انتخاب تصویر هیرو" : "انتخاب تصویر بنر"}
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFile(file); event.currentTarget.value = ""; }} />
            </label>
            {error ? <p className="text-xs text-brick">{error}</p> : null}
            {message ? <p className="text-xs text-emerald-700">{message}</p> : null}
            <button type="submit" disabled={busy || !selected} className="rounded-xl bg-forest px-4 py-2.5 text-xs text-paper disabled:opacity-50">
              {busy ? "در حال ذخیره…" : mode === "hero" ? "ذخیره هیرو" : "ذخیره بنر"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
