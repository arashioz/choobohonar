"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
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
  shopUrl: string;
  status: ShopProductStatus;
  featured: boolean;
  suggested: boolean;
  suggestionNote: string;
  series: string;
  price: string;
  stockQty: string;
  trackInventory: boolean;
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
    shopUrl: p?.shopUrl || "",
    status: p?.status || "published",
    featured: p?.featured || false,
    suggested: p?.suggested || false,
    suggestionNote: p?.suggestionNote || "",
    series: p?.series || "",
    price: p?.price != null ? String(p.price) : "",
    stockQty: p?.stockQty != null ? String(p.stockQty) : "0",
    trackInventory: p?.trackInventory || false,
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
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category.trim(),
      room: form.room,
      shortDescription: form.shortDescription.trim(),
      longDescription: form.longDescription.trim(),
      image: form.image.trim(),
      gallery: form.image.trim() ? [form.image.trim()] : [],
      shopUrl: form.shopUrl.trim() || undefined,
      status: form.status,
      featured: form.featured,
      suggested: form.suggested,
      suggestionNote: form.suggestionNote.trim() || undefined,
      series: form.series.trim() || undefined,
      price: form.price ? Number(form.price) : undefined,
      stockQty: form.stockQty ? Number(form.stockQty) : 0,
      trackInventory: form.trackInventory,
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
              disabled={saving}
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
              <input
                className={fieldClass}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                required
              />
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
            <Field label="آدرس تصویر">
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
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
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
              disabled={saving}
              className={cn(
                "rounded-xl bg-forest px-5 py-2.5 text-sm font-medium text-peach",
                "transition-colors hover:bg-forest-700 disabled:opacity-60",
              )}
            >
              {saving ? "در حال ذخیره…" : isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
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
