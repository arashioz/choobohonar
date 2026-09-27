"use client";

import { useEffect, useState } from "react";
import { shopApi, type ShopCampaignBanner } from "@/lib/shop-api";
import { uploadMedia } from "@/lib/upload";

export default function CampaignBannersPanel({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<ShopCampaignBanner[]>([]);
  const [selected, setSelected] = useState("");
  const [cardImage, setCardImage] = useState("");
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
    setCardImage(item.cardImage || "");
    setMessage("");
    setError("");
  }

  async function save() {
    if (!selected) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const saved = await shopApi.campaignBanners.update(selected, { cardImage });
      setItems((current) => current.map((item) => (item.slug === saved.slug ? { ...item, ...saved } : item)));
      setMessage("تصویر دسته ذخیره شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "ذخیره تصویر ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File) {
    setBusy(true);
    setError("");
    try {
      setCardImage(await uploadMedia(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "آپلود تصویر ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  const current = items.find((item) => item.slug === selected);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/40 p-4 sm:items-center">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-paper shadow-xl">
        <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
          <div>
            <p className="text-[10px] tracking-[0.16em] text-brick" dir="ltr">CATEGORY CARDS</p>
            <h2 className="mt-1 text-lg font-medium text-forest">تصویر دسته‌ها</h2>
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
            <p className="text-xs leading-6 text-forest/45">فقط عکس کارت {current?.label || "دسته"} در صفحه محصولات. هیرو و بنر داخل فهرست از دکمه کنار این بخش عوض می‌شوند.</p>
            {cardImage ? <img src={cardImage} alt="" className="h-48 w-full rounded-xl object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-forest/15 text-xs text-forest/40">هنوز تصویر جدا ندارد؛ عکس پیش‌فرض سایت نشان داده می‌شود</div>}
            <label className="inline-flex cursor-pointer rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs text-forest/70">
              انتخاب تصویر دسته
              <input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onFile(file); event.currentTarget.value = ""; }} />
            </label>
            {error ? <p className="text-xs text-brick">{error}</p> : null}
            {message ? <p className="text-xs text-emerald-700">{message}</p> : null}
            <button type="submit" disabled={busy || !selected} className="rounded-xl bg-forest px-4 py-2.5 text-xs text-paper disabled:opacity-50">{busy ? "در حال ذخیره…" : "ذخیره تصویر دسته"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
