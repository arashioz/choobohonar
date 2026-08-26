"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/upload";
import {
  ROOM_LABELS,
  shopApi,
  type ShopProduct,
  type ShopRoom,
  type ShopProductStatus,
} from "@/lib/shop-api";

const ROOMS = Object.keys(ROOM_LABELS) as ShopRoom[];

type FormState = {
  slug: string;
  name: string;
  category: string;
  room: ShopRoom;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery: string[];
  finishes: string;
  shopUrl: string;
  status: ShopProductStatus;
  featured: boolean;
  suggested: boolean;
  suggestionNote: string;
  series: string;
  price: string;
  compareAtPrice: string;
  stockQty: string;
  trackInventory: boolean;
  width: string;
  depth: string;
  height: string;
  specs: { label: string; value: string }[];
  highlights: { title: string; description: string }[];
};

function fromProduct(p?: ShopProduct): FormState {
  return {
    slug: p?.slug || "",
    name: p?.name || "",
    category: p?.category || "",
    room: p?.room || "living",
    shortDescription: p?.shortDescription || "",
    longDescription: p?.longDescription || "",
    image: p?.image || "",
    gallery: p?.gallery?.length ? p.gallery : (p?.image ? [p.image] : []),
    finishes: p?.finishes?.join("، ") || "",
    shopUrl: p?.shopUrl || "",
    status: p?.status || "published",
    featured: p?.featured || false,
    suggested: p?.suggested || false,
    suggestionNote: p?.suggestionNote || "",
    series: p?.series || "",
    price: p?.price != null ? formatPrice(String(p.price)) : "",
    compareAtPrice: p?.compareAtPrice != null ? formatPrice(String(p.compareAtPrice)) : "",
    stockQty: p?.stockQty != null ? String(p.stockQty) : "0",
    trackInventory: p?.trackInventory || false,
    width: p?.dimensions?.width != null ? String(p.dimensions.width) : "",
    depth: p?.dimensions?.depth != null ? String(p.dimensions.depth) : "",
    height: p?.dimensions?.height != null ? String(p.dimensions.height) : "",
    specs: p?.specs || [],
    highlights: p?.highlights || [],
  };
}

const fieldClass =
  "w-full rounded-xl border border-forest/10 bg-white px-3.5 py-2.5 text-sm text-forest outline-none placeholder:text-forest/30 focus:border-forest/30";

export default function ShopProductForm({
  initial,
}: {
  initial?: ShopProduct;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);
  const [form, setForm] = useState<FormState>(() => fromProduct(initial));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    shopApi.categories().then((rows) => setCategoryOptions(Array.from(new Set(rows.map((row) => row.category).filter(Boolean))))).catch(() => undefined);
  }, []);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uploading) {
      setError("تا پایان آپلود تصاویر، ذخیره محصول امکان‌پذیر نیست.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      room: form.room,
      shortDescription: form.shortDescription.trim(),
      longDescription: form.longDescription.trim(),
      image: form.gallery[0] || form.image.trim(),
      gallery: form.gallery.length ? form.gallery : (form.image.trim() ? [form.image.trim()] : []),
      shopUrl: form.shopUrl.trim() || undefined,
      finishes: form.finishes.split(/[،,]/).map((item) => item.trim()).filter(Boolean),
      status: form.status,
      featured: form.featured,
      suggested: form.suggested,
      suggestionNote: form.suggestionNote.trim() || undefined,
      series: form.series.trim() || undefined,
      price: form.price ? parsePrice(form.price) : undefined,
      compareAtPrice: form.compareAtPrice ? parsePrice(form.compareAtPrice) : undefined,
      stockQty: form.stockQty ? Number(form.stockQty) : 0,
      trackInventory: form.trackInventory,
      dimensions: compactDimensions(form),
      specs: form.specs.filter((item) => item.label.trim() && item.value.trim()),
      highlights: form.highlights.filter((item) => item.title.trim() && item.description.trim()),
    };

    try {
      if (isEdit && initial) {
        await shopApi.update(initial._id, payload);
        router.push(`/admin/shop/products/${initial._id}`);
        router.refresh();
      } else {
        const created = await shopApi.create(payload);
        router.push(`/admin/shop/products/${created._id}`);
      }
    } catch (err) {
      console.error("[admin/shop/product] save", err);
      setError(err instanceof Error ? err.message : "ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);
    setError("");
    try {
      const totalBytes = Math.max(files.reduce((total, file) => total + file.size, 0), 1);
      let completedBytes = 0;
      for (const file of files) {
        const url = await uploadMedia(file, ({ loaded }) => {
          const percent = totalBytes ? ((completedBytes + loaded) / totalBytes) * 100 : 0;
          setUploadProgress(Math.min(100, Math.round(percent)));
        });
        setForm((previous) => ({ ...previous, image: previous.image || url, gallery: [...previous.gallery, url] }));
        completedBytes += file.size;
        setUploadProgress(Math.min(100, Math.round((completedBytes / totalBytes) * 100)));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "آپلود تصاویر ناموفق بود");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function setGallery(gallery: string[]) {
    setForm((previous) => ({ ...previous, gallery, image: gallery[0] || previous.image }));
  }

  async function onDelete() {
    if (!initial?._id) return;
    if (!confirm(`حذف «${initial.name}»؟ این عمل برگشت‌پذیر نیست.`)) return;
    setSaving(true);
    try {
      await shopApi.remove(initial._id);
      router.push("/admin/shop");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف ناموفق بود");
      setSaving(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />

      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <Link href="/admin/shop" className="text-xs text-forest/45 hover:text-forest">
              ← بازگشت به فروشگاه
            </Link>
            <h1 className="mt-1 text-2xl font-light tracking-tightest text-forest">
              {isEdit ? "ویرایش محصول" : "محصول جدید"}
            </h1>
          </div>
          {isEdit ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={saving || uploading}
              className="rounded-xl border border-brick/20 px-3 py-2 text-xs text-brick hover:bg-peach/20 disabled:opacity-50"
            >
              حذف
            </button>
          ) : null}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="نام محصول" required>
              <input
                className={fieldClass}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </Field>
            <Field label="اسلاگ" required>
              <input
                className={fieldClass}
                dir="ltr"
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                required
              />
            </Field>
            <Field label="دسته" required>
              <input list="shop-category-options"
                className={fieldClass}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
              />
              <datalist id="shop-category-options">{categoryOptions.map((category) => <option key={category} value={category} />)}</datalist>
              <span className="mt-1 block text-[9px] text-forest/35">دسته‌بندی‌ها از محصولات موجود در دیتابیس پیشنهاد می‌شوند.</span>
            </Field>
            <Field label="فضا / اتاق">
              <select
                className={fieldClass}
                value={form.room}
                onChange={(e) => set("room", e.target.value as ShopRoom)}
              >
                {ROOMS.map((r) => (
                  <option key={r} value={r}>
                    {ROOM_LABELS[r]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="وضعیت">
              <select
                className={fieldClass}
                value={form.status}
                onChange={(e) => set("status", e.target.value as ShopProductStatus)}
              >
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیو</option>
              </select>
            </Field>
            <Field label="سری / کالکشن">
              <input
                className={fieldClass}
                value={form.series}
                onChange={(e) => set("series", e.target.value)}
              />
            </Field>
          </div>

          <Field label="توضیح کوتاه">
            <textarea
              className={fieldClass}
              rows={2}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
            />
          </Field>

          <Field label="توضیح کامل">
            <textarea
              className={fieldClass}
              rows={5}
              value={form.longDescription}
              onChange={(e) => set("longDescription", e.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="آدرس تصویر اصلی (اختیاری)">
              <input
                className={fieldClass}
                dir="ltr"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://…"
              />
            </Field>
            <Field label="لینک فروشگاه / خرید">
              <input
                className={fieldClass}
                dir="ltr"
                value={form.shopUrl}
                onChange={(e) => set("shopUrl", e.target.value)}
                placeholder="https://choobohonar.com/product/…"
              />
            </Field>
            <Field label="قیمت (تومان)">
              <input
                className={fieldClass}
                dir="ltr"
                type="text"
                inputMode="numeric"
                value={form.price}
                onChange={(e) => set("price", formatPrice(e.target.value))}
                placeholder="48,500,000"
              />
            </Field>
            <Field label="قیمت قبل از تخفیف (تومان)">
              <input className={fieldClass} dir="ltr" type="text" inputMode="numeric" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", formatPrice(e.target.value))} placeholder="52,000,000" />
            </Field>
            <Field label="موجودی">
              <input
                className={fieldClass}
                dir="ltr"
                type="number"
                value={form.stockQty}
                onChange={(e) => set("stockQty", e.target.value)}
              />
            </Field>
          </div>

          <section className="rounded-2xl border border-forest/10 bg-white/70 p-4 space-y-4">
            <div><h2 className="text-sm font-medium text-forest">جزئیات محصول</h2><p className="mt-1 text-[10px] text-forest/40">فینیش، متریال و ابعاد برای نمایش دقیق‌تر در صفحه محصول.</p></div>
            <Field label="متریال، رنگ و فینیش"><input className={fieldClass} value={form.finishes} onChange={(e) => set("finishes", e.target.value)} placeholder="چوب گردو، روغن مات، پارچه کرم" /><span className="mt-1 block text-[9px] text-forest/35">هر مورد را با ویرگول جدا کنید.</span></Field>
            <div className="grid gap-4 sm:grid-cols-3"><Field label="عرض (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.width} onChange={(e) => set("width", e.target.value)} /></Field><Field label="عمق (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.depth} onChange={(e) => set("depth", e.target.value)} /></Field><Field label="ارتفاع (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.height} onChange={(e) => set("height", e.target.value)} /></Field></div>
          </section>

          <ProductDetailsEditor label="مشخصات فنی" description="مثل جنس پایه، نوع پارچه یا ظرفیت." rows={form.specs} onChange={(specs) => set("specs", specs.map((item) => ({ label: item.label || "", value: item.value || "" })))} left="عنوان مشخصه" right="مقدار" />
          <ProductDetailsEditor label="نقاط قوت محصول" description="ویژگی‌هایی که در صفحه محصول برجسته می‌شوند." rows={form.highlights} onChange={(highlights) => set("highlights", highlights.map((item) => ({ title: item.title || "", description: item.description || "" })))} left="عنوان" right="توضیح کوتاه" />

          <ProductMediaGallery images={form.gallery} uploading={uploading} uploadProgress={uploadProgress} onUpload={uploadImages} onChange={setGallery} />

          <div className="rounded-2xl border border-forest/10 bg-white/70 p-4 space-y-3">
            <p className="text-xs font-medium text-forest/55">ویترین و پیشنهاد</p>
            <label className="flex items-center gap-2 text-sm text-forest">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              محصول ویترینی (Featured)
            </label>
            <label className="flex items-center gap-2 text-sm text-forest">
              <input
                type="checkbox"
                checked={form.suggested}
                onChange={(e) => set("suggested", e.target.checked)}
              />
              پیشنهاد فروشگاهی
            </label>
            <label className="flex items-center gap-2 text-sm text-forest">
              <input
                type="checkbox"
                checked={form.trackInventory}
                onChange={(e) => set("trackInventory", e.target.checked)}
              />
              پیگیری موجودی
            </label>
            <Field label="یادداشت پیشنهاد">
              <textarea
                className={fieldClass}
                rows={2}
                value={form.suggestionNote}
                onChange={(e) => set("suggestionNote", e.target.value)}
                placeholder="مثلاً: مناسب کمپین نوروزی / جایگزین پرطرفدار…"
              />
            </Field>
          </div>

          {error ? (
            <p className="rounded-xl border border-brick/20 bg-peach/20 px-3 py-2 text-sm text-brick">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className={cn(
                "rounded-xl bg-forest px-5 py-2.5 text-sm font-medium text-peach",
                "transition-colors hover:bg-forest-700 disabled:opacity-60",
              )}
            >
              {uploading ? `آپلود ${uploadProgress}٪` : saving ? "در حال ذخیره…" : isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
            </button>
            <Link
              href="/admin/shop"
              className="rounded-xl border border-forest/10 px-5 py-2.5 text-sm text-forest/60 hover:text-forest"
            >
              انصراف
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}

function parsePrice(value: string) { return Number(value.replace(/[^0-9]/g, "")); }
function formatPrice(value: string) { const digits = value.replace(/[^0-9]/g, ""); return digits ? Number(digits).toLocaleString("en-US") : ""; }
function compactDimensions(form: FormState) { const dimensions = { width: Number(form.width) || undefined, depth: Number(form.depth) || undefined, height: Number(form.height) || undefined }; return Object.values(dimensions).some(Boolean) ? dimensions : undefined; }

type ProductDetailRow = { label?: string; value?: string; title?: string; description?: string };

function ProductDetailsEditor({ label, description, rows, onChange, left, right }: { label: string; description: string; rows: ProductDetailRow[]; onChange: (rows: ProductDetailRow[]) => void; left: string; right: string }) {
  const isHighlight = rows.some((row) => "title" in row) || label.includes("نقاط");
  const normalized = rows.length ? rows : [isHighlight ? { title: "", description: "" } : { label: "", value: "" }];
  return <section className="rounded-2xl border border-forest/10 bg-white/70 p-4"><div className="mb-4"><h2 className="text-sm font-medium text-forest">{label}</h2><p className="mt-1 text-[10px] text-forest/40">{description}</p></div><div className="space-y-2">{normalized.map((row, index) => <div key={index} className="grid grid-cols-[1fr_1.4fr_36px] gap-2"><input className={fieldClass} placeholder={left} value={isHighlight ? row.title || "" : row.label || ""} onChange={(e) => onChange(normalized.map((item, i) => i === index ? (isHighlight ? { title: e.target.value, description: item.description || "" } : { label: e.target.value, value: item.value || "" }) : item))} /><input className={fieldClass} placeholder={right} value={isHighlight ? row.description || "" : row.value || ""} onChange={(e) => onChange(normalized.map((item, i) => i === index ? (isHighlight ? { title: item.title || "", description: e.target.value } : { label: item.label || "", value: e.target.value }) : item))} /><button type="button" onClick={() => onChange(normalized.filter((_, i) => i !== index))} className="rounded-xl border border-forest/10 text-brick">×</button></div>)}</div><button type="button" onClick={() => onChange([...normalized, isHighlight ? { title: "", description: "" } : { label: "", value: "" }])} className="mt-3 text-[10px] font-medium text-brick">+ افزودن ردیف</button></section>;
}

function ProductMediaGallery({ images, uploading, uploadProgress, onUpload, onChange }: { images: string[]; uploading: boolean; uploadProgress: number; onUpload: (event: ChangeEvent<HTMLInputElement>) => void; onChange: (images: string[]) => void }) {
  const [url, setUrl] = useState("");
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }
  function addUrl() {
    const value = url.trim();
    if (!value) return;
    onChange([...images, value]);
    setUrl("");
  }
  return <section className="rounded-2xl border border-forest/10 bg-white/70 p-4 sm:p-5">
    <div className="mb-4"><h2 className="text-sm font-medium text-forest">تصاویر محصول</h2><p className="mt-1 text-[10px] leading-5 text-forest/40">تصویر اول، تصویر اصلی محصول است. می‌توانید ترتیب تصاویر را تغییر دهید.</p></div>
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-forest/20 bg-forest/[0.02] px-4 py-6 text-center hover:border-forest/40 hover:bg-white">
      <span className="text-lg text-brick">+</span><span className="mt-1 text-xs font-medium text-forest">{uploading ? `در حال آپلود… ${uploadProgress}٪` : "انتخاب تصویر"}</span><span className="mt-1 text-[9px] text-forest/35">JPG، PNG، WebP یا AVIF · حداکثر ۲۰۰ مگابایت</span>
      <input className="hidden" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple disabled={uploading} onChange={onUpload} />
    </label>
    {uploading ? <div className="mt-3" role="status" aria-live="polite"><div className="h-2 overflow-hidden rounded-full bg-forest/10"><div className="h-full rounded-full bg-brick transition-[width] duration-200" style={{ width: `${uploadProgress}%` }} /></div><p className="mt-1 text-[10px] text-forest/45">{uploadProgress}٪ تکمیل شده؛ تا پایان آپلود دکمه ذخیره غیرفعال است.</p></div> : null}
    <div className="mt-3 space-y-2">{images.map((image, index) => <div key={`${image}-${index}`} className="rounded-xl border border-forest/10 bg-[#faf8f5] p-2">
      <div className="flex items-start gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element -- uploaded media can use an arbitrary external URL */}
      <img src={image} alt="" className="h-14 w-14 rounded-lg object-cover bg-forest/5" />
      <div className="min-w-0 flex-1"><a href={image} target="_blank" rel="noopener noreferrer" className="block break-all text-[9px] leading-4 text-brick underline-offset-2 hover:underline" dir="ltr">{image}</a><span className="mt-1 block text-[9px] text-forest/35">لینک تصویر ذخیره‌شده</span></div>
      <div className="flex items-center gap-1"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="rounded px-2 py-1 text-forest/45 disabled:opacity-20" title="انتقال به قبل">↑</button><button type="button" disabled={index === images.length - 1} onClick={() => move(index, 1)} className="rounded px-2 py-1 text-forest/45 disabled:opacity-20" title="انتقال به بعد">↓</button><button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} className="rounded px-2 py-1 text-brick" title="حذف">×</button></div>
      </div>
    </div>)}</div>
    <div className="mt-3 flex gap-2"><input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addUrl(); } }} className={fieldClass} placeholder="یا آدرس تصویر را وارد کنید" dir="ltr" /><button type="button" onClick={addUrl} className="shrink-0 rounded-xl border border-forest/10 px-3 text-xs text-forest/60">افزودن</button></div>
  </section>;
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-forest/55">
        {label}
        {required ? <span className="text-brick"> *</span> : null}
      </span>
      {children}
    </label>
  );
}
