"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { uploadMedia } from "@/lib/upload";
import ProductMaterialsPicker from "@/components/shop/ProductMaterialsPicker";
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
  finishes: string[];
  materialImageMappings: { attribute: string; value: string; image: string }[];
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
  attributes: { name: string; values: string[] }[];
  variants: { sku: string; options: { name: string; value: string }[]; price: string; compareAtPrice: string; stockQty: string; enabled: boolean }[];
  inStock: boolean;
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
    finishes: p?.finishes || [],
    materialImageMappings: p?.materialImageMappings || [],
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
    attributes: (p?.attributes || []).map((attribute) => ({ name: attribute.name, values: attribute.values.length ? attribute.values : [""] })),
    variants: (p?.variants || []).map((variant) => ({ sku: variant.sku || "", options: variant.options || [], price: variant.price != null ? formatPrice(String(variant.price)) : "", compareAtPrice: variant.compareAtPrice != null ? formatPrice(String(variant.compareAtPrice)) : "", stockQty: String(variant.stockQty ?? 0), enabled: variant.enabled !== false })),
    inStock: typeof p?.inStock === "boolean" ? p.inStock : (p?.variants?.length ? p.variants.some((variant) => variant.enabled !== false && (variant.stockQty || 0) > 0) : (p?.trackInventory ? (p.stockQty || 0) > 0 : true)),
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
  const [descriptionMode, setDescriptionMode] = useState<"preview" | "html">("preview");
  const [seriesOptions, setSeriesOptions] = useState<string[]>([]);

  useEffect(() => {
    shopApi.categories().then((rows) => setCategoryOptions(Array.from(new Set(rows.map((row) => row.category).filter(Boolean))))).catch(() => undefined);
    shopApi.series().then((rows) => setSeriesOptions(Array.from(new Set(rows.map((row) => row.series).filter(Boolean))))).catch(() => undefined);
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
      finishes: form.finishes,
      materialImageMappings: form.materialImageMappings.filter((item) => item.attribute.trim() && item.value.trim() && form.gallery.includes(item.image)),
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
      attributes: form.attributes.filter((attribute) => attribute.name.trim() && attribute.values.some((value) => value.trim())).map((attribute) => ({ name: attribute.name.trim(), values: attribute.values.map((value) => value.trim()).filter(Boolean), required: true })),
      variants: form.variants.map((variant) => ({ sku: variant.sku.trim() || undefined, options: variant.options.filter((option) => option.name.trim() && option.value.trim()), price: variant.price ? parsePrice(variant.price) : undefined, compareAtPrice: variant.compareAtPrice ? parsePrice(variant.compareAtPrice) : undefined, stockQty: Number(variant.stockQty) || 0, enabled: variant.enabled })),
      inStock: form.inStock,
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
            {form.room === "lighting" ? (
              <Field label="نوع آباژور">
                <select
                  className={fieldClass}
                  value={["آباژور ایستاده", "آباژور رومیزی"].includes(form.category) ? form.category : ""}
                  onChange={(e) => e.target.value && set("category", e.target.value)}
                >
                  <option value="">برای محصولات غیرآباژور انتخاب نکنید</option>
                  <option value="آباژور ایستاده">آباژور ایستاده</option>
                  <option value="آباژور رومیزی">آباژور رومیزی</option>
                </select>
              </Field>
            ) : null}
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
              <select
                className={fieldClass}
                value={form.series}
                onChange={(e) => set("series", e.target.value)}
              >
                <option value="">بدون کالکشن</option>
                {seriesOptions.map((series) => (
                  <option key={series} value={series}>
                    {series}
                  </option>
                ))}
                {form.series && !seriesOptions.includes(form.series) ? (
                  <option value={form.series}>{form.series}</option>
                ) : null}
              </select>
              <span className="mt-1 block text-[9px] text-forest/35">لیست از کالکشن‌های ثبت‌شده در بک‌اند خوانده می‌شود.</span>
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
            <div className="rounded-xl border border-forest/10 bg-[#faf8f5] p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-[10px] text-forest/45">توضیحات وردپرس شامل پاراگراف، لیست و جدول است.</p>
                <button
                  type="button"
                  onClick={() => setDescriptionMode((mode) => mode === "preview" ? "html" : "preview")}
                  className="shrink-0 rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-[10px] text-forest"
                >
                  {descriptionMode === "preview" ? "ویرایش HTML" : "پیش‌نمایش"}
                </button>
              </div>
              {descriptionMode === "html" ? (
                <textarea
                  className={`${fieldClass} min-h-72 font-mono text-xs leading-6`}
                  value={form.longDescription}
                  onChange={(e) => set("longDescription", e.target.value)}
                  dir="rtl"
                />
              ) : (
                <ProductDescriptionPreview html={form.longDescription} />
              )}
            </div>
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
            <ProductMaterialsPicker value={form.finishes} onChange={(finishes) => set("finishes", finishes)} />
            <div className="grid gap-4 sm:grid-cols-3"><Field label="عرض (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.width} onChange={(e) => set("width", e.target.value)} /></Field><Field label="عمق (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.depth} onChange={(e) => set("depth", e.target.value)} /></Field><Field label="ارتفاع (سانتی‌متر)"><input className={fieldClass} inputMode="decimal" value={form.height} onChange={(e) => set("height", e.target.value)} /></Field></div>
          </section>

          <ProductDetailsEditor label="مشخصات فنی" description="مثل جنس پایه، نوع پارچه یا ظرفیت." rows={form.specs} onChange={(specs) => set("specs", specs.map((item) => ({ label: item.label || "", value: item.value || "" })))} left="عنوان مشخصه" right="مقدار" />
          <VariantsEditor attributes={form.attributes} variants={form.variants} onAttributes={(attributes) => set("attributes", attributes)} onVariants={(variants) => set("variants", variants)} />
          <ProductDetailsEditor label="نقاط قوت محصول" description="ویژگی‌هایی که در صفحه محصول برجسته می‌شوند." rows={form.highlights} onChange={(highlights) => set("highlights", highlights.map((item) => ({ title: item.title || "", description: item.description || "" })))} left="عنوان" right="توضیح کوتاه" />

          <ProductMediaGallery images={form.gallery} uploading={uploading} uploadProgress={uploadProgress} onUpload={uploadImages} onChange={setGallery} />
          <MaterialGalleryImageMapper
            attributes={form.attributes}
            gallery={form.gallery}
            value={form.materialImageMappings}
            onChange={(materialImageMappings) => set("materialImageMappings", materialImageMappings)}
          />

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
                checked={form.inStock}
                onChange={(e) => set("inStock", e.target.checked)}
              />
              موجود در فروشگاه
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

function ProductDescriptionPreview({ html }: { html: string }) {
  const document = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
    *{box-sizing:border-box} body{margin:0;padding:16px;background:#fff;color:#294238;font-family:Tahoma,Arial,sans-serif;font-size:14px;line-height:2;text-align:right}
    p{margin:0 0 16px} ul,ol{margin:0 0 16px;padding-right:22px} table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px} td,th{border:1px solid #d8dfda;padding:10px;vertical-align:top} td p,th p{margin:0} th{background:#f3f6f3}
  </style></head><body>${html || "<p>هنوز توضیح کاملی ثبت نشده است.</p>"}</body></html>`;
  return <iframe title="پیش‌نمایش توضیح محصول" sandbox="" srcDoc={document} className="h-[420px] w-full rounded-lg border border-forest/10 bg-white" />;
}

type ProductDetailRow = { label?: string; value?: string; title?: string; description?: string };

function ProductDetailsEditor({ label, description, rows, onChange, left, right }: { label: string; description: string; rows: ProductDetailRow[]; onChange: (rows: ProductDetailRow[]) => void; left: string; right: string }) {
  const isHighlight = rows.some((row) => "title" in row) || label.includes("نقاط");
  const normalized = rows.length ? rows : [isHighlight ? { title: "", description: "" } : { label: "", value: "" }];
  return <section className="rounded-2xl border border-forest/10 bg-white/70 p-4"><div className="mb-4"><h2 className="text-sm font-medium text-forest">{label}</h2><p className="mt-1 text-[10px] text-forest/40">{description}</p></div><div className="space-y-2">{normalized.map((row, index) => <div key={index} className="grid grid-cols-[1fr_1.4fr_36px] gap-2"><input className={fieldClass} placeholder={left} value={isHighlight ? row.title || "" : row.label || ""} onChange={(e) => onChange(normalized.map((item, i) => i === index ? (isHighlight ? { title: e.target.value, description: item.description || "" } : { label: e.target.value, value: item.value || "" }) : item))} /><input className={fieldClass} placeholder={right} value={isHighlight ? row.description || "" : row.value || ""} onChange={(e) => onChange(normalized.map((item, i) => i === index ? (isHighlight ? { title: item.title || "", description: e.target.value } : { label: item.label || "", value: e.target.value }) : item))} /><button type="button" onClick={() => onChange(normalized.filter((_, i) => i !== index))} className="rounded-xl border border-forest/10 text-brick">×</button></div>)}</div><button type="button" onClick={() => onChange([...normalized, isHighlight ? { title: "", description: "" } : { label: "", value: "" }])} className="mt-3 text-[10px] font-medium text-brick">+ افزودن ردیف</button></section>;
}

function VariantsEditor({ attributes, variants, onAttributes, onVariants }: { attributes: { name: string; values: string[] }[]; variants: { sku: string; options: { name: string; value: string }[]; price: string; compareAtPrice: string; stockQty: string; enabled: boolean }[]; onAttributes: (value: { name: string; values: string[] }[]) => void; onVariants: (value: { sku: string; options: { name: string; value: string }[]; price: string; compareAtPrice: string; stockQty: string; enabled: boolean }[]) => void }) {
  const nextAttribute = () => onAttributes([...attributes, { name: "", values: [""] }]);
  const nextVariant = () => onVariants([...variants, { sku: "", options: attributes.filter((attribute) => attribute.name.trim()).map((attribute) => ({ name: attribute.name, value: attribute.values.find((value) => value.trim()) || "" })), price: "", compareAtPrice: "", stockQty: "0", enabled: true }]);

  function setAttributeName(index: number, name: string) {
    const previousName = attributes[index]?.name;
    onAttributes(attributes.map((item, i) => (i === index ? { ...item, name } : item)));
    if (previousName) {
      onVariants(variants.map((variant) => ({
        ...variant,
        options: variant.options.map((option) => (option.name === previousName ? { ...option, name } : option)),
      })));
    }
  }

  function setAttributeValue(attributeIndex: number, valueIndex: number, value: string) {
    onAttributes(attributes.map((item, i) => i === attributeIndex ? { ...item, values: item.values.map((entry, j) => (j === valueIndex ? value : entry)) } : item));
  }

  function addAttributeValue(attributeIndex: number) {
    onAttributes(attributes.map((item, i) => (i === attributeIndex ? { ...item, values: [...item.values, ""] } : item)));
  }

  function removeAttributeValue(attributeIndex: number, valueIndex: number) {
    onAttributes(attributes.map((item, i) => (i === attributeIndex ? { ...item, values: item.values.filter((_, j) => j !== valueIndex) } : item)));
  }

  function setVariantOption(variantIndex: number, attributeName: string, value: string) {
    onVariants(variants.map((item, i) => {
      if (i !== variantIndex) return item;
      const options = item.options.some((option) => option.name === attributeName)
        ? item.options.map((option) => (option.name === attributeName ? { ...option, value } : option))
        : [...item.options, { name: attributeName, value }];
      return { ...item, options };
    }));
  }

  return (
    <section className="rounded-2xl border border-forest/10 bg-white/70 p-4 space-y-5">
      <div>
        <h2 className="text-sm font-medium text-forest">ویژگی‌ها و متغیرها</h2>
        <p className="mt-1 text-[10px] leading-5 text-forest/40">هر ویژگی و هر متغیر یک ردیف جدا در لیست است. مقدارها را هم به‌صورت لیست اضافه کنید، نه با ویرگول.</p>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-forest/60">ویژگی‌ها</p>
        {(attributes.length ? attributes : []).map((attribute, index) => (
          <div key={index} className="rounded-xl border border-forest/10 p-3 space-y-2">
            <div className="flex gap-2">
              <input className={fieldClass} placeholder="نام ویژگی؛ مثلاً رنگ" value={attribute.name} onChange={(e) => setAttributeName(index, e.target.value)} />
              <button type="button" className="rounded-xl border border-forest/10 px-3 text-brick" onClick={() => onAttributes(attributes.filter((_, i) => i !== index))}>×</button>
            </div>
            <ul className="space-y-2">
              {(attribute.values.length ? attribute.values : [""]).map((value, valueIndex) => (
                <li key={valueIndex} className="flex gap-2">
                  <input className={fieldClass} placeholder={`مقدار ${valueIndex + 1}`} value={value} onChange={(e) => setAttributeValue(index, valueIndex, e.target.value)} />
                  <button type="button" className="rounded-xl border border-forest/10 px-3 text-brick" onClick={() => removeAttributeValue(index, valueIndex)}>×</button>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => addAttributeValue(index)} className="text-[10px] font-medium text-brick">+ افزودن مقدار</button>
          </div>
        ))}
        <button type="button" onClick={nextAttribute} className="text-[10px] font-medium text-brick">+ افزودن ویژگی</button>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium text-forest/60">متغیرها</p>
        {variants.map((variant, index) => (
          <div key={index} className="rounded-xl border border-forest/10 p-3 space-y-2">
            {attributes.filter((attribute) => attribute.name.trim()).map((attribute) => (
              <label key={attribute.name} className="block">
                <span className="mb-1 block text-[10px] text-forest/45">{attribute.name}</span>
                <select
                  className={fieldClass}
                  value={variant.options.find((option) => option.name === attribute.name)?.value || ""}
                  onChange={(e) => setVariantOption(index, attribute.name, e.target.value)}
                >
                  <option value="">انتخاب {attribute.name}</option>
                  {attribute.values.filter((value) => value.trim()).map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </label>
            ))}
            <div className="grid gap-2 sm:grid-cols-2">
              <input className={fieldClass} dir="ltr" placeholder="SKU (اختیاری)" value={variant.sku} onChange={(e) => onVariants(variants.map((item, i) => i === index ? { ...item, sku: e.target.value } : item))} />
              <input className={fieldClass} inputMode="numeric" placeholder="قیمت تومان" value={variant.price} onChange={(e) => onVariants(variants.map((item, i) => i === index ? { ...item, price: formatPrice(e.target.value) } : item))} />
              <input className={fieldClass} inputMode="numeric" placeholder="قیمت قبل از تخفیف" value={variant.compareAtPrice} onChange={(e) => onVariants(variants.map((item, i) => i === index ? { ...item, compareAtPrice: formatPrice(e.target.value) } : item))} />
              <input className={fieldClass} type="number" placeholder="موجودی" value={variant.stockQty} onChange={(e) => onVariants(variants.map((item, i) => i === index ? { ...item, stockQty: e.target.value } : item))} />
              <label className="flex items-center gap-2 text-xs text-forest">
                <input type="checkbox" checked={variant.enabled} onChange={(e) => onVariants(variants.map((item, i) => i === index ? { ...item, enabled: e.target.checked } : item))} />
                قابل فروش
              </label>
            </div>
            <button type="button" onClick={() => onVariants(variants.filter((_, i) => i !== index))} className="text-[10px] text-brick">حذف این متغیر</button>
          </div>
        ))}
        <button type="button" onClick={nextVariant} className="text-[10px] font-medium text-brick">+ افزودن متغیر</button>
      </div>
    </section>
  );
}

const MATERIAL_ATTRIBUTE = /چوب|متریال|پرداخت|فینیش|رویه|wood|material|finish|پارچه|fabric|کوسن|cushion/i;

function MaterialGalleryImageMapper({
  attributes,
  gallery,
  value,
  onChange,
}: {
  attributes: { name: string; values: string[] }[];
  gallery: string[];
  value: { attribute: string; value: string; image: string }[];
  onChange: (mappings: { attribute: string; value: string; image: string }[]) => void;
}) {
  const materialOptions = attributes.flatMap((attribute) =>
    MATERIAL_ATTRIBUTE.test(attribute.name)
      ? attribute.values.filter((item) => item.trim()).map((item) => ({ attribute: attribute.name, value: item }))
      : [],
  );

  function selectedImage(attribute: string, materialValue: string) {
    return value.find((item) => item.attribute === attribute && item.value === materialValue)?.image || "";
  }

  function setImage(attribute: string, materialValue: string, image: string) {
    const withoutCurrent = value.filter((item) => !(item.attribute === attribute && item.value === materialValue));
    onChange(image ? [...withoutCurrent, { attribute, value: materialValue, image }] : withoutCurrent);
  }

  return (
    <section className="rounded-2xl border border-forest/10 bg-white/70 p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-forest">تصویر محصول بر اساس متریال</h2>
        <p className="mt-1 text-[10px] leading-5 text-forest/40">
          برای هر چوب یا پارچه، یکی از عکس‌های همین گالری را انتخاب کنید. در صفحهٔ محصول با تغییر متریال، همان عکس به‌عنوان تصویر اصلی نشان داده می‌شود؛ این تنظیم قیمت را تغییر نمی‌دهد.
        </p>
      </div>
      {!materialOptions.length ? (
        <p className="text-[11px] text-forest/40">ابتدا در بخش «ویژگی‌ها» محورهایی مانند چوب، پارچه یا پارچه کوسن اضافه کنید.</p>
      ) : !gallery.length ? (
        <p className="text-[11px] text-forest/40">ابتدا حداقل یک تصویر در گالری محصول آپلود کنید.</p>
      ) : (
        <div className="space-y-5">
          {materialOptions.map((item) => {
            const current = selectedImage(item.attribute, item.value);
            return (
              <div key={`${item.attribute}-${item.value}`}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <p className="text-xs font-medium text-forest">{item.attribute}: <span className="font-normal text-forest/65">{item.value}</span></p>
                  {current ? <button type="button" onClick={() => setImage(item.attribute, item.value, "")} className="text-[10px] text-brick">حذف اتصال</button> : null}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {gallery.map((image, index) => {
                    const active = current === image;
                    return (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setImage(item.attribute, item.value, image)}
                        className={cn("relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-forest/5", active ? "border-brick ring-2 ring-brick/15" : "border-transparent hover:border-forest/25")}
                        title={`انتخاب تصویر ${index + 1}`}
                        aria-pressed={active}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element -- uploaded media can use an arbitrary URL */}
                        <img src={image} alt={`تصویر ${index + 1}`} className="h-full w-full object-cover" />
                        {active ? <span className="absolute inset-x-0 bottom-0 bg-brick/90 py-0.5 text-[9px] text-white">انتخاب‌شده</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
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
