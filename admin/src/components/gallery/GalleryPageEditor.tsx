"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { cmsListItems, cmsRequest, type CmsEntry } from "@/lib/cms";
import { shopApi, type ShopProduct } from "@/lib/shop-api";
import { uploadMedia } from "@/lib/upload";

export type GalleryMediaKind =
  | "project"
  | "product"
  | "collection"
  | "material"
  | "event"
  | "exhibition"
  | "behind-scenes";

export type GalleryMediaItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: GalleryMediaKind;
  entityKind?: GalleryMediaKind;
  entitySlug?: string;
  productCategory?: string;
  href?: string;
  bento: "hero" | "tall" | "wide" | "square";
  relatedIds?: string[];
};

const KIND_OPTIONS: { id: GalleryMediaKind; label: string }[] = [
  { id: "project", label: "پروژه" },
  { id: "product", label: "محصول" },
  { id: "collection", label: "کالکشن" },
  { id: "material", label: "متریال" },
  { id: "behind-scenes", label: "پشت‌صحنه" },
  { id: "event", label: "رویداد" },
  { id: "exhibition", label: "نمایشگاه" },
];

const BENTO_OPTIONS = [
  { id: "square", label: "مربع" },
  { id: "wide", label: "عریض" },
  { id: "tall", label: "عمودی" },
  { id: "hero", label: "شاخص" },
] as const;

const MATERIAL_FAMILIES = [
  { slug: "wood", title: "چوب" },
  { slug: "fabric", title: "پارچه" },
  { slug: "veneer", title: "روکش" },
  { slug: "metal", title: "فلز" },
];

const inputClass =
  "w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-xs text-forest placeholder:text-forest/25 transition-colors focus:border-forest/30 focus:bg-white focus:outline-none";

function hrefFor(item: GalleryMediaItem): string | undefined {
  const slug = item.entitySlug?.trim();
  const kind = item.tag;
  if (kind === "project" && slug) return `/projects/${slug}`;
  if (kind === "product" && slug) return `/products/${slug}`;
  if (kind === "collection" && slug) return `/collection/${slug}`;
  if (kind === "material" && slug) return `/materials/${slug}`;
  if ((kind === "behind-scenes" || kind === "event" || kind === "exhibition") && slug) {
    return `/projects/${slug}`;
  }
  return item.href;
}

function newId() {
  return `gallery-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

type Props = {
  items: GalleryMediaItem[];
  onChange: (items: GalleryMediaItem[]) => void;
  onBusyChange?: (busy: boolean) => void;
};

function isVideoSrc(src: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src) || src.includes("/video");
}

export default function GalleryPageEditor({ items, onChange, onBusyChange }: Props) {
  const [projects, setProjects] = useState<CmsEntry[]>([]);
  const [collections, setCollections] = useState<CmsEntry[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [uploading, setUploading] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [notice, setNotice] = useState<string | null>(null);

  function setBusy(busy: boolean) {
    setUploading(busy);
    onBusyChange?.(busy);
  }

  useEffect(() => {
    Promise.all([
      cmsRequest<{ items?: CmsEntry[] } | CmsEntry[]>("project").then(cmsListItems).catch(() => [] as CmsEntry[]),
      cmsRequest<{ items?: CmsEntry[] } | CmsEntry[]>("collection").then(cmsListItems).catch(() => [] as CmsEntry[]),
      shopApi.list({ status: "published", limit: 1000 }).then((result) => result.items).catch(() => [] as ShopProduct[]),
    ]).then(([nextProjects, nextCollections, nextProducts]) => {
      setProjects(nextProjects.filter((item) => item.status !== "archived"));
      setCollections(nextCollections.filter((item) => item.status !== "archived"));
      setProducts(nextProducts);
    });
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (product.category) counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "fa"));
  }, [products]);

  function update(id: string, patch: Partial<GalleryMediaItem>) {
    onChange(
      items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, ...patch };
        if (patch.tag) next.entityKind = patch.tag;
        next.href = hrefFor(next);
        return next;
      }),
    );
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    setBusy(true);
    setUploadProgress(0);
    setNotice(null);
    try {
      const totalBytes = Math.max(files.reduce((sum, file) => sum + file.size, 0), 1);
      let completed = 0;
      const created: GalleryMediaItem[] = [];
      for (const file of files) {
        const url = await uploadMedia(file, ({ loaded }) => {
          setUploadProgress(Math.min(100, Math.round(((completed + loaded) / totalBytes) * 100)));
        });
        created.push({
          id: newId(),
          src: url,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          caption: "",
          tag: "project",
          entityKind: "project",
          bento: "square",
        });
        completed += file.size;
        setUploadProgress(Math.min(100, Math.round((completed / totalBytes) * 100)));
      }
      onChange([...created, ...items]);
      setOpenId(created[0]?.id ?? openId);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "آپلود انجام نشد");
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  async function replaceImage(id: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setReplacingId(id);
    setBusy(true);
    setUploadProgress(0);
    setNotice(null);
    try {
      const url = await uploadMedia(file, ({ percent }) => setUploadProgress(percent));
      update(id, { src: url });
      setNotice("تصویر عوض شد. برای نمایش در سایت «به‌روزرسانی» را بزنید.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "تعویض تصویر انجام نشد");
    } finally {
      setReplacingId(null);
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <section className="rounded-2xl border border-forest/10 bg-white/75 p-5 shadow-[0_8px_30px_rgba(9,43,28,0.025)] sm:p-6">
      <div className="mb-5 border-b border-forest/[0.07] pb-4">
        <h2 className="text-sm font-medium text-forest">رسانه‌های گالری</h2>
        <p className="mt-1.5 text-[10px] leading-5 text-forest/38">
          هر رسانه را به یک پروژه، محصول، کالکشن یا متریال وصل کنید تا در سایت با کلیک به همان صفحه برود و پیشنهادهای مرتبط از همان موجودیت ساخته شوند.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-forest/[0.02] px-4 py-8 text-center transition-colors hover:border-forest/35 hover:bg-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach/35 text-lg text-brick">+</span>
        <span className="mt-3 text-xs font-medium text-forest">
          {uploading ? `در حال آپلود… ${uploadProgress}٪` : "افزودن تصویر یا ویدیو"}
        </span>
        <span className="mt-1 text-[9px] text-forest/35">بعد از آپلود، نوع رسانه و اتصال به دیتابیس را مشخص کنید</span>
        <input type="file" accept="image/*,video/*" multiple onChange={upload} disabled={uploading} className="hidden" />
      </label>
      {uploading ? (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-forest/10">
            <div className="h-full rounded-full bg-brick transition-[width]" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : null}
      {notice ? (
        <p className={`mt-3 text-xs ${notice.includes("عوض شد") ? "text-forest" : "text-brick"}`}>
          {notice}
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const open = openId === item.id;
          const kind = item.tag;
          const categoryProducts = item.productCategory
            ? products.filter((product) => product.category === item.productCategory)
            : products;
          return (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex w-full items-center gap-3 px-3 py-3 text-right"
              >
                <span
                  className="h-14 w-14 shrink-0 rounded-xl bg-[#e8e2d9] bg-cover bg-center"
                  style={{ backgroundImage: item.src ? `url(${item.src})` : undefined }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-forest">{item.alt || "بدون عنوان"}</span>
                  <span className="mt-1 block text-[10px] text-forest/40">
                    {KIND_OPTIONS.find((option) => option.id === kind)?.label || kind}
                    {item.entitySlug ? ` · ${item.entitySlug}` : " · اتصال مشخص نشده"}
                  </span>
                </span>
                <span className="text-[10px] text-forest/30">{(index + 1).toLocaleString("fa-IR")}</span>
              </button>

              {open ? (
                <div className="space-y-4 border-t border-forest/10 bg-white px-4 py-4">
                  <div>
                    <span className="mb-2 block text-[11px] font-medium text-forest/60">تصویر / ویدیو</span>
                    <div className="overflow-hidden rounded-2xl border border-forest/10 bg-[#faf8f5]">
                      {item.src ? (
                        isVideoSrc(item.src) ? (
                          <video src={item.src} controls className="max-h-64 w-full bg-forest/10 object-contain" />
                        ) : (
                          <span className="block min-h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.src})`, height: "16rem" }} />
                        )
                      ) : (
                        <div className="flex h-40 items-center justify-center text-[11px] text-forest/35">هنوز فایلی انتخاب نشده</div>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <label className="inline-flex cursor-pointer items-center rounded-xl border border-forest/12 bg-white px-3.5 py-2.5 text-[11px] font-medium text-forest hover:border-forest/25">
                        {replacingId === item.id ? `آپلود ${uploadProgress}٪` : "تعویض فایل"}
                        <input
                          type="file"
                          accept="image/*,video/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={(event) => void replaceImage(item.id, event)}
                        />
                      </label>
                      <input
                        value={item.src}
                        onChange={(event) => update(item.id, { src: event.target.value.trim() })}
                        className={`${inputClass} min-w-0 flex-1`}
                        placeholder="یا آدرس فایل را وارد کنید"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-medium text-forest/60">عنوان نمایشی</span>
                    <input value={item.alt} onChange={(event) => update(item.id, { alt: event.target.value })} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[11px] font-medium text-forest/60">توضیح کوتاه</span>
                    <textarea value={item.caption} onChange={(event) => update(item.id, { caption: event.target.value })} className={`${inputClass} min-h-20 resize-y`} />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">جنس رسانه</span>
                      <select
                        value={kind}
                        onChange={(event) =>
                          update(item.id, {
                            tag: event.target.value as GalleryMediaKind,
                            entityKind: event.target.value as GalleryMediaKind,
                            entitySlug: "",
                            productCategory: "",
                            href: "",
                          })
                        }
                        className={inputClass}
                      >
                        {KIND_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">نمایش در شبکه</span>
                      <select value={item.bento} onChange={(event) => update(item.id, { bento: event.target.value as GalleryMediaItem["bento"] })} className={inputClass}>
                        {BENTO_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {kind === "product" ? (
                    <>
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-medium text-forest/60">دسته‌بندی محصول</span>
                        <select
                          value={item.productCategory || ""}
                          onChange={(event) => update(item.id, { productCategory: event.target.value, entitySlug: "" })}
                          className={inputClass}
                        >
                          <option value="">ابتدا دسته را انتخاب کنید</option>
                          {categories.map(([category, count]) => (
                            <option key={category} value={category}>
                              {category} ({count.toLocaleString("fa-IR")})
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-2 block text-[11px] font-medium text-forest/60">نام محصول</span>
                        <select
                          value={item.entitySlug || ""}
                          onChange={(event) => {
                            const product = products.find((entry) => entry.slug === event.target.value);
                            update(item.id, {
                              entitySlug: event.target.value,
                              alt: item.alt || product?.name || "",
                              productCategory: product?.category || item.productCategory,
                            });
                          }}
                          className={inputClass}
                          disabled={!item.productCategory}
                        >
                          <option value="">{item.productCategory ? "انتخاب محصول" : "اول دسته را مشخص کنید"}</option>
                          {categoryProducts.map((product) => (
                            <option key={product._id} value={product.slug}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    </>
                  ) : null}

                  {kind === "project" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">انتخاب پروژه از دیتابیس</span>
                      <select
                        value={item.entitySlug || ""}
                        onChange={(event) => {
                          const project = projects.find((entry) => entry.slug === event.target.value);
                          update(item.id, { entitySlug: event.target.value, alt: item.alt || project?.title || "" });
                        }}
                        className={inputClass}
                      >
                        <option value="">انتخاب پروژه</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project.slug}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {kind === "collection" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">انتخاب کالکشن</span>
                      <select
                        value={item.entitySlug || ""}
                        onChange={(event) => {
                          const collection = collections.find((entry) => entry.slug === event.target.value);
                          update(item.id, { entitySlug: event.target.value, alt: item.alt || collection?.title || "" });
                        }}
                        className={inputClass}
                      >
                        <option value="">انتخاب کالکشن</option>
                        {collections.map((collection) => (
                          <option key={collection._id} value={collection.slug}>
                            {collection.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {kind === "material" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">خانواده متریال</span>
                      <select value={item.entitySlug || ""} onChange={(event) => update(item.id, { entitySlug: event.target.value })} className={inputClass}>
                        <option value="">انتخاب متریال</option>
                        {MATERIAL_FAMILIES.map((material) => (
                          <option key={material.slug} value={material.slug}>
                            {material.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {kind === "behind-scenes" || kind === "event" || kind === "exhibition" ? (
                    <label className="block">
                      <span className="mb-2 block text-[11px] font-medium text-forest/60">اتصال اختیاری به پروژه</span>
                      <select
                        value={item.entitySlug || ""}
                        onChange={(event) =>
                          update(item.id, {
                            entitySlug: event.target.value,
                            href: event.target.value ? `/projects/${event.target.value}` : "",
                          })
                        }
                        className={inputClass}
                      >
                        <option value="">بدون اتصال مستقیم</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project.slug}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : null}

                  {hrefFor(item) ? (
                    <p className="text-[10px] text-forest/40" dir="ltr">
                      لینک سایت: {hrefFor(item)}
                    </p>
                  ) : (
                    <p className="text-[10px] text-brick/70">تا وقتی اتصال دیتابیس مشخص نشود، بازدیدکننده لینکی برای ورود به صفحه مرتبط نمی‌بیند.</p>
                  )}

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onChange(items.filter((entry) => entry.id !== item.id))}
                      className="rounded-xl border border-brick/15 px-3 py-2 text-[10px] text-brick"
                    >
                      حذف رسانه
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
        {!items.length ? <p className="py-10 text-center text-xs text-forest/40">هنوز رسانه‌ای ثبت نشده. از دکمه بالا تصویر اضافه کنید.</p> : null}
      </div>
    </section>
  );
}

export function asGalleryMediaItems(value: unknown): GalleryMediaItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((raw, index) => {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as Record<string, unknown>;
      const src = String(item.src || item.image || "");
      if (!src) return null;
      const tag = KIND_OPTIONS.some((option) => option.id === item.tag) ? (item.tag as GalleryMediaKind) : "project";
      const next: GalleryMediaItem = {
        id: String(item.id || newId() + index),
        src,
        alt: String(item.alt || ""),
        caption: String(item.caption || ""),
        tag,
        entityKind: (item.entityKind as GalleryMediaKind) || tag,
        entitySlug: item.entitySlug ? String(item.entitySlug) : undefined,
        productCategory: item.productCategory ? String(item.productCategory) : undefined,
        href: item.href ? String(item.href) : undefined,
        bento: (["hero", "tall", "wide", "square"].includes(String(item.bento)) ? item.bento : "square") as GalleryMediaItem["bento"],
        relatedIds: Array.isArray(item.relatedIds) ? item.relatedIds.map(String) : [],
      };
      if (!next.entitySlug && next.href) {
        const match = next.href.match(/^\/(projects|products|collection|materials)\/([^/?#]+)/);
        if (match) next.entitySlug = decodeURIComponent(match[2]);
      }
      next.href = hrefFor(next);
      return next;
    })
    .filter((item): item is GalleryMediaItem => Boolean(item));
}
