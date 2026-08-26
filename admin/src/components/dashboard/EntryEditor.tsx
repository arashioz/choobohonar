"use client";

import Link from "next/link";
import { ChangeEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { cmsRequest, type CmsEntry, type CmsEntryInput, type CmsKind, type ResourcePath } from "@/lib/cms";

type EditorProps = { kind: CmsKind; resourcePath?: ResourcePath; entryId?: string };

const copy: Record<CmsKind, { title: string; singular: string }> = {
  product: { title: "محصولات", singular: "محصول" }, material: { title: "متریال‌ها", singular: "متریال" }, project: { title: "پروژه‌ها", singular: "پروژه" }, collection: { title: "کالکشن‌ها", singular: "کالکشن" }, article: { title: "مقالات", singular: "مقاله" },
};

const blankEntry: Omit<CmsEntryInput, "title"> & { title: string } = { title: "", slug: "", status: "draft", excerpt: "", description: "", content: "", images: [], seo: {}, data: {}, tags: [] };

function slugify(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]+/gu, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function EntryEditor({ kind, resourcePath, entryId }: EditorProps) {
  const router = useRouter();
  const labels = copy[kind];
  const isNew = !entryId;
  const basePath = kind === "article" ? "/admin/articles" : `/admin/manage/${resourcePath}`;
  const [entry, setEntry] = useState(blankEntry);
  const [currentId, setCurrentId] = useState(entryId || "");
  const [loading, setLoading] = useState(Boolean(entryId));
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(entryId));
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [relations, setRelations] = useState<{ materials: CmsEntry[]; collections: CmsEntry[] }>({ materials: [], collections: [] });
  const [articleTaxonomy, setArticleTaxonomy] = useState<{ categories: string[]; tags: string[] }>({ categories: [], tags: [] });

  useEffect(() => {
    if (!entryId) return;
    cmsRequest<CmsEntry>(`${kind}/${entryId}`).then((data) => {
      setEntry({ title: data.title, slug: data.slug, status: data.status, excerpt: data.excerpt || "", description: data.description || "", content: data.content || "", images: data.images || [], seo: data.seo || {}, data: data.data || {}, tags: data.tags || [] });
    }).catch((err) => setNotice({ tone: "error", text: err instanceof Error ? err.message : "اطلاعات دریافت نشد" })).finally(() => setLoading(false));
  }, [entryId, kind]);

  useEffect(() => {
    if (kind !== "product") return;
    Promise.all([cmsRequest<{ items: CmsEntry[] }>("material"), cmsRequest<{ items: CmsEntry[] }>("collection")])
      .then(([materials, collections]) => setRelations({ materials: materials.items, collections: collections.items }))
      .catch(() => undefined);
  }, [kind]);

  useEffect(() => {
    if (kind !== "article") return;
    cmsRequest<{ categories: string[]; tags: string[] }>("article/meta")
      .then(setArticleTaxonomy)
      .catch(() => undefined);
  }, [kind]);

  const data = entry.data || {};
  const seo = entry.seo || {};

  function setField<K extends keyof typeof entry>(key: K, value: (typeof entry)[K]) { setEntry((current) => ({ ...current, [key]: value })); setDirty(true); }
  function setData(key: string, value: unknown) { setEntry((current) => ({ ...current, data: { ...(current.data || {}), [key]: value } })); setDirty(true); }
  function setSeo(key: string, value: unknown) { setEntry((current) => ({ ...current, seo: { ...(current.seo || {}), [key]: value } })); setDirty(true); }
  function dataText(key: string) { return String(data[key] ?? ""); }

  async function save(mode: "draft" | "publish" = "draft") {
    if (!entry.title.trim()) { setNotice({ tone: "error", text: `نام ${labels.singular} الزامی است.` }); return; }
    setSaving(true); setNotice(null);
    try {
      const body = { ...entry, slug: entry.slug || slugify(entry.title), status: mode === "publish" ? "published" : entry.status || "draft" };
      let saved: CmsEntry;
      if (currentId) saved = await cmsRequest<CmsEntry>(`${kind}/${currentId}`, { method: "PATCH", body: JSON.stringify(body) });
      else saved = await cmsRequest<CmsEntry>(kind, { method: "POST", body: JSON.stringify(body) });
      if (mode === "publish" && saved.status !== "published") saved = await cmsRequest<CmsEntry>(`${kind}/${saved._id}/publish`, { method: "POST" });
      setCurrentId(saved._id);
      setEntry((current) => ({ ...current, slug: saved.slug, status: saved.status }));
      setDirty(false);
      setNotice({ tone: "ok", text: mode === "publish" ? "با موفقیت منتشر شد." : "تغییرات ذخیره شد." });
      if (isNew) router.replace(`${basePath}/${saved._id}`);
    } catch (err) { setNotice({ tone: "error", text: err instanceof Error ? err.message : "ذخیره انجام نشد" }); }
    finally { setSaving(false); }
  }

  async function archive() {
    if (!currentId) return;
    setSaving(true);
    try { const result = await cmsRequest<CmsEntry>(`${kind}/${currentId}/archive`, { method: "POST" }); setEntry((current) => ({ ...current, status: result.status })); setNotice({ tone: "ok", text: "به بایگانی منتقل شد." }); }
    catch (err) { setNotice({ tone: "error", text: err instanceof Error ? err.message : "بایگانی انجام نشد" }); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!currentId || !window.confirm(`«${entry.title}» حذف شود؟ این عمل قابل بازگشت نیست.`)) return;
    try { await cmsRequest(`${kind}/${currentId}`, { method: "DELETE" }); router.push(basePath); router.refresh(); }
    catch (err) { setNotice({ tone: "error", text: err instanceof Error ? err.message : "حذف انجام نشد" }); }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []); if (!files.length) return;
    setUploading(true); setNotice(null);
    try {
      const uploaded = await Promise.all(files.map(async (file) => { const form = new FormData(); form.append("file", file); const response = await fetch("/api/media", { method: "POST", body: form }); const text = await response.text(); let result: { url?: string; message?: string } = {}; try { result = JSON.parse(text) as typeof result; } catch { throw new Error(`آپلود ${file.name} ناموفق بود (پاسخ سرور: ${response.status})`); } if (!response.ok || !result.url) throw new Error(result.message || `آپلود ${file.name} ناموفق بود`); return result.url; }));
      setField("images", [...(entry.images || []), ...uploaded]);
    }
    catch (err) { setNotice({ tone: "error", text: err instanceof Error ? err.message : "آپلود انجام نشد" }); }
    finally { setUploading(false); event.target.value = ""; }
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee] text-sm text-forest/40">در حال دریافت اطلاعات…</div>;

  return (
    <main className="min-h-screen bg-[#f6f3ee] pb-24">
      <div className="sticky top-16 z-30 border-b border-forest/10 bg-[#f6f3ee]/95 backdrop-blur-xl md:top-0">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-3"><Link href={basePath} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-forest/10 text-forest/45 hover:bg-white">→</Link><div className="min-w-0"><p className="truncate text-xs font-medium text-forest">{isNew ? `افزودن ${labels.singular}` : entry.title || `ویرایش ${labels.singular}`}</p><div className="mt-1 flex items-center gap-2 text-[9px] text-forest/35"><span className={cn("h-1.5 w-1.5 rounded-full", entry.status === "published" ? "bg-[#54a879]" : entry.status === "archived" ? "bg-forest/30" : "bg-brick")}/><span>{entry.status === "published" ? "منتشرشده" : entry.status === "archived" ? "بایگانی" : "پیش‌نویس"}</span>{dirty && <><span>·</span><span>تغییرات ذخیره‌نشده</span></>}</div></div></div>
          <div className="flex items-center gap-2"><button type="button" onClick={() => save("draft")} disabled={saving} className="rounded-xl border border-forest/12 bg-white px-3.5 py-2.5 text-[11px] font-medium text-forest/65 hover:border-forest/25 disabled:opacity-50">ذخیره پیش‌نویس</button><button type="button" onClick={() => save("publish")} disabled={saving} className="rounded-xl bg-forest px-3.5 py-2.5 text-[11px] font-medium text-paper hover:bg-forest-700 disabled:opacity-50">{saving ? "در حال ذخیره…" : entry.status === "published" ? "به‌روزرسانی" : "انتشار"}</button></div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1380px] gap-5 px-5 py-7 sm:px-8 lg:grid-cols-12 lg:px-10">
        <div className="space-y-5 lg:col-span-8">
          {notice && <div className={cn("rounded-xl border px-4 py-3 text-xs", notice.tone === "ok" ? "border-sage bg-sage/20 text-forest" : "border-brick/15 bg-brick/[0.05] text-brick")}>{notice.text}</div>}
          <Panel title={`اطلاعات اصلی ${labels.singular}`} description="عنوان و محتوایی که در سایت دیده می‌شود.">
            <Field label={`عنوان ${labels.singular}`} required><input value={entry.title} onChange={(e) => { setField("title", e.target.value); if (!slugTouched) setEntry((current) => ({ ...current, slug: slugify(e.target.value) })); }} className={inputClass} placeholder={`عنوان ${labels.singular}`} /></Field>
            <Field label="اسلاگ URL" hint="آدرس یکتا؛ بهتر است کوتاه و انگلیسی باشد."><div className="flex overflow-hidden rounded-xl border border-forest/10 bg-white" dir="ltr"><span className="border-r border-forest/10 bg-forest/[0.03] px-3 py-3 text-xs text-forest/30">/</span><input value={entry.slug || ""} onChange={(e) => { setSlugTouched(true); setField("slug", slugify(e.target.value)); }} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-xs text-forest outline-none" placeholder="unique-slug" /></div></Field>
            <Field label="خلاصه کوتاه" hint="در کارت‌ها و نتایج جست‌وجو نمایش داده می‌شود."><textarea value={entry.excerpt || ""} onChange={(e) => setField("excerpt", e.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="خلاصه‌ای روشن و کوتاه…" /></Field>
            {kind !== "article" && <Field label="توضیحات کامل"><textarea value={entry.description || ""} onChange={(e) => setField("description", e.target.value)} className={`${inputClass} min-h-40 resize-y`} placeholder="داستان، ویژگی‌ها و توضیحات کامل…" /></Field>}
            {kind === "article" && <Field label="متن مقاله" hint="نسخه فعلی ویرایشگر متنی است؛ ساختار بلوکی در فاز بعد قابل افزودن است."><textarea value={entry.content || ""} onChange={(e) => setField("content", e.target.value)} className={`${inputClass} min-h-[420px] resize-y leading-8`} placeholder="متن کامل مقاله را بنویسید…" /></Field>}
          </Panel>

          <SpecificFields kind={kind} data={data} setData={setData} dataText={dataText} relations={relations} />

          {kind !== "article" && <Panel title="محتوای تکمیلی" description="جزئیات روایی یا فنی برای صفحه کامل."><Field label="محتوای تفصیلی"><textarea value={entry.content || ""} onChange={(e) => setField("content", e.target.value)} className={`${inputClass} min-h-56 resize-y leading-7`} placeholder="جزئیات بیشتر، شیوه نگهداری یا روایت تکمیلی…" /></Field><TagInput label="برچسب‌ها" hint="برای افزودن هر تگ Enter بزنید." value={entry.tags || []} onChange={(tags) => setField("tags", tags)} placeholder="مثلاً طراحی معاصر" /></Panel>}

          <Panel title="تنظیمات SEO" description="عنوان و توضیحات نتیجه جست‌وجو."><Field label="عنوان SEO"><input value={String(seo.title || "")} onChange={(e) => setSeo("title", e.target.value)} className={inputClass} placeholder={entry.title || "عنوان صفحه"} /></Field><Field label="توضیحات متا"><textarea value={String(seo.description || "")} onChange={(e) => setSeo("description", e.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="حدود ۱۵۰ تا ۱۶۰ کاراکتر" /></Field><Field label="کلمات کلیدی"><input value={Array.isArray(seo.keywords) ? seo.keywords.join("، ") : ""} onChange={(e) => setSeo("keywords", splitList(e.target.value))} className={inputClass} /></Field></Panel>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <Panel title="گالری رسانه" description="چند فایل را هم‌زمان انتخاب کنید؛ مورد اول تصویر اصلی است."><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-forest/20 bg-forest/[0.02] px-4 py-8 text-center transition-colors hover:border-forest/35 hover:bg-white"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-peach/35 text-lg text-brick">+</span><span className="mt-3 text-xs font-medium text-forest">{uploading ? "در حال آپلود فایل‌ها…" : "انتخاب چند تصویر یا ویدئو"}</span><span className="mt-1 text-[9px] text-forest/35">انتخاب هم‌زمان · حداکثر ۲۰۰ مگابایت برای هر فایل</span><input type="file" accept="image/*,video/*" multiple onChange={upload} disabled={uploading} className="hidden" /></label><MediaList images={entry.images || []} onChange={(images) => setField("images", images)} /></Panel>

          {kind === "article" && <Panel title="دسته‌بندی و انتشار"><Field label="نویسنده"><input value={dataText("author")} onChange={(e) => setData("author", e.target.value)} className={inputClass} placeholder="تحریریه چوب و هنر" /></Field><Field label="دسته‌بندی"><select value={dataText("category")} onChange={(e) => setData("category", e.target.value)} className={inputClass}><option value="">انتخاب دسته‌بندی</option>{articleTaxonomy.categories.map((category) => <option key={category} value={category}>{category}</option>)}</select><span className="mt-1 block text-[9px] text-forest/35">دسته‌ها از مقالات ثبت‌شده در دیتابیس خوانده می‌شوند.</span></Field><Field label="زمان مطالعه"><input value={dataText("readingTime")} onChange={(e) => setData("readingTime", e.target.value)} className={inputClass} placeholder="۶ دقیقه" /></Field><TagInput label="برچسب‌ها" value={entry.tags || []} onChange={(tags) => setField("tags", tags)} hint={articleTaxonomy.tags.length ? `برچسب‌های موجود: ${articleTaxonomy.tags.slice(0, 8).join("، ")}` : undefined} /></Panel>}

          {!isNew && <Panel title="مدیریت رکورد"><div className="space-y-2">{entry.status !== "archived" && <button type="button" onClick={archive} className="w-full rounded-xl border border-forest/10 px-3 py-2.5 text-[11px] text-forest/55 hover:bg-white">انتقال به بایگانی</button>}<button type="button" onClick={remove} className="w-full rounded-xl border border-brick/15 px-3 py-2.5 text-[11px] text-brick hover:bg-brick/[0.04]">حذف کامل</button></div></Panel>}
        </aside>
      </div>
    </main>
  );
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) { return <section className="rounded-2xl border border-forest/10 bg-white/75 p-5 shadow-[0_8px_30px_rgba(9,43,28,0.025)] sm:p-6"><div className="mb-5 border-b border-forest/[0.07] pb-4"><h2 className="text-sm font-medium text-forest">{title}</h2>{description && <p className="mt-1.5 text-[10px] leading-5 text-forest/38">{description}</p>}</div><div className="space-y-5">{children}</div></section>; }
function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: ReactNode }) { return <label className="block"><span className="mb-2 flex items-center gap-1 text-[11px] font-medium text-forest/60">{label}{required && <span className="text-brick">*</span>}</span>{children}{hint && <span className="mt-1.5 block text-[9px] leading-5 text-forest/32">{hint}</span>}</label>; }
const inputClass = "w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-xs text-forest placeholder:text-forest/25 transition-colors focus:border-forest/30 focus:bg-white focus:outline-none";
function splitList(value: string) { return value.split(/[،,]/).map((item) => item.trim()).filter(Boolean); }
type ProductVariant = { name: string; sku: string; price: number; inventory: number; attributes: string[] };

function SpecificFields({ kind, data, setData, dataText, relations }: { kind: CmsKind; data: Record<string, unknown>; setData: (key: string, value: unknown) => void; dataText: (key: string) => string; relations: { materials: CmsEntry[]; collections: CmsEntry[] } }) {
  if (kind === "product") {
    const categories = arrayValue(data.categories, data.category);
    return <>
      <Panel title="طبقه‌بندی محصول" description="هر محصول می‌تواند هم‌زمان در چند دسته، متریال و کالکشن قرار بگیرد.">
        <TagInput label="دسته‌بندی‌ها" value={categories} onChange={(values) => { setData("categories", values); setData("category", values[0] || ""); }} placeholder="مثلاً میز ناهارخوری" />
        <ReferencePicker label="متریال‌های ثبت‌شده" value={arrayValue(data.materialRefs)} options={relations.materials} onChange={(values) => setData("materialRefs", values)} placeholder="انتخاب از کتابخانه متریال" />
        <TagInput label="توضیحات متریال و ترکیب ساخت" value={arrayValue(data.materials)} onChange={(values) => setData("materials", values)} placeholder="مثلاً چوب گردو" />
        <TagInput label="رنگ‌ها و پرداخت‌ها" value={arrayValue(data.colors)} onChange={(values) => setData("colors", values)} placeholder="مثلاً گردویی مات" />
        <ReferencePicker label="کالکشن‌های مرتبط" value={arrayValue(data.collectionRefs)} options={relations.collections} onChange={(values) => setData("collectionRefs", values)} placeholder="انتخاب کالکشن" />
      </Panel>

      <Panel title="فروش و موجودی" description="قیمت پایه، کنترل موجودی و سیاست سفارش.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="کد محصول (SKU)"><input value={dataText("sku")} onChange={(e) => setData("sku", e.target.value)} className={inputClass} dir="ltr" /></Field>
          <Field label="وضعیت سفارش"><select value={dataText("availability") || "in_stock"} onChange={(e) => setData("availability", e.target.value)} className={inputClass}><option value="in_stock">موجود و آماده سفارش</option><option value="made_to_order">ساخت سفارشی</option><option value="preorder">پیش‌فروش</option><option value="out_of_stock">ناموجود</option></select></Field>
          <Field label="قیمت پایه (تومان)"><input type="number" min="0" value={dataText("price")} onChange={(e) => setData("price", Number(e.target.value))} className={inputClass} /></Field>
          <Field label="قیمت قبل از تخفیف"><input type="number" min="0" value={dataText("comparePrice")} onChange={(e) => setData("comparePrice", Number(e.target.value))} className={inputClass} /></Field>
          <Field label="موجودی کل"><input type="number" min="0" value={dataText("inventory")} onChange={(e) => setData("inventory", Number(e.target.value))} className={inputClass} /></Field>
          <Field label="هشدار کمبود موجودی"><input type="number" min="0" value={dataText("lowStockThreshold")} onChange={(e) => setData("lowStockThreshold", Number(e.target.value))} className={inputClass} placeholder="مثلاً ۲" /></Field>
          <Field label="زمان تحویل"><input value={dataText("leadTime")} onChange={(e) => setData("leadTime", e.target.value)} className={inputClass} placeholder="۳ تا ۵ هفته" /></Field>
          <Field label="گارانتی"><input value={dataText("warranty")} onChange={(e) => setData("warranty", e.target.value)} className={inputClass} /></Field>
        </div>
        <label className="flex items-center justify-between rounded-xl border border-forest/10 bg-[#faf8f5] px-4 py-3"><span><span className="block text-[11px] font-medium text-forest">مدیریت موجودی فعال</span><span className="mt-1 block text-[9px] text-forest/35">موجودی محصول و گونه‌های آن کنترل شود.</span></span><input type="checkbox" checked={data.manageStock !== false} onChange={(e) => setData("manageStock", e.target.checked)} className="h-4 w-4 accent-forest" /></label>
      </Panel>

      <Panel title="گونه‌های محصول" description="برای هر رنگ، سایز یا پرداخت می‌توانید SKU، قیمت و موجودی مستقل ثبت کنید.">
        <VariantEditor value={Array.isArray(data.variants) ? data.variants as ProductVariant[] : []} onChange={(variants) => setData("variants", variants)} />
      </Panel>

      <Panel title="مشخصات فنی" description="ابعاد، وزن و ویژگی‌های قابل نمایش در صفحه محصول.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4"><NumberField label="عرض (cm)" value={nestedNumber(data, "dimensions", "width")} onChange={(value) => setData("dimensions", { ...asRecord(data.dimensions), width: value })}/><NumberField label="عمق (cm)" value={nestedNumber(data, "dimensions", "depth")} onChange={(value) => setData("dimensions", { ...asRecord(data.dimensions), depth: value })}/><NumberField label="ارتفاع (cm)" value={nestedNumber(data, "dimensions", "height")} onChange={(value) => setData("dimensions", { ...asRecord(data.dimensions), height: value })}/><NumberField label="وزن (kg)" value={Number(data.weight || 0)} onChange={(value) => setData("weight", value)}/></div>
        <KeyValueEditor label="جدول مشخصات" value={Array.isArray(data.specs) ? data.specs as { label: string; value: string }[] : []} onChange={(rows) => setData("specs", rows)} />
      </Panel>
    </>;
  }
  if (kind === "material") return <>
    <Panel title="هویت و طبقه‌بندی متریال" description="یک متریال می‌تواند چند نوع، رنگ، پرداخت و کاربرد داشته باشد.">
      <div className="grid gap-4 sm:grid-cols-2"><Field label="کد متریال"><input value={dataText("code")} onChange={(e) => setData("code", e.target.value)} className={inputClass} dir="ltr" /></Field><Field label="واحد اندازه‌گیری"><input value={dataText("unit")} onChange={(e) => setData("unit", e.target.value)} className={inputClass} placeholder="متر مربع، کیلوگرم، عدد" /></Field></div>
      <TagInput label="انواع متریال" value={arrayValue(data.materialTypes, data.materialType)} onChange={(values) => { setData("materialTypes", values); setData("materialType", values[0] || ""); }} placeholder="مثلاً چوب طبیعی" />
      <TagInput label="رنگ‌ها" value={arrayValue(data.colors, data.color)} onChange={(values) => { setData("colors", values); setData("color", values[0] || ""); }} placeholder="مثلاً قهوه‌ای گرم" />
      <TagInput label="پرداخت‌ها" value={arrayValue(data.finishes, data.finish)} onChange={(values) => { setData("finishes", values); setData("finish", values[0] || ""); }} placeholder="مثلاً روغن مات" />
      <TagInput label="کاربردهای پیشنهادی" value={arrayValue(data.applications)} onChange={(values) => setData("applications", values)} placeholder="مثلاً صفحه میز" />
    </Panel>

    <Panel title="تامین و موجودی" description="اطلاعات خرید و کنترل موجودی متریال.">
      <TagInput label="تامین‌کننده‌ها" value={arrayValue(data.suppliers, data.supplier)} onChange={(values) => { setData("suppliers", values); setData("supplier", values[0] || ""); }} placeholder="نام تامین‌کننده" />
      <div className="grid gap-4 sm:grid-cols-2"><Field label="قیمت واحد (تومان)"><input type="number" min="0" value={dataText("price")} onChange={(e) => setData("price", Number(e.target.value))} className={inputClass} /></Field><Field label="موجودی"><input type="number" min="0" value={dataText("inventory")} onChange={(e) => setData("inventory", Number(e.target.value))} className={inputClass} /></Field><Field label="حداقل موجودی"><input type="number" min="0" value={dataText("minimumStock")} onChange={(e) => setData("minimumStock", Number(e.target.value))} className={inputClass} /></Field><Field label="زمان تامین"><input value={dataText("procurementLeadTime")} onChange={(e) => setData("procurementLeadTime", e.target.value)} className={inputClass} placeholder="مثلاً ۱۰ روز کاری" /></Field></div>
    </Panel>

    <Panel title="ویژگی‌ها و استانداردها" description="داده‌های فنی برای انتخاب و مقایسه متریال.">
      <TagInput label="گواهی‌ها و استانداردها" value={arrayValue(data.certifications)} onChange={(values) => setData("certifications", values)} placeholder="مثلاً FSC" />
      <KeyValueEditor label="ویژگی‌های فنی" value={Array.isArray(data.specs) ? data.specs as { label: string; value: string }[] : []} onChange={(rows) => setData("specs", rows)} />
      <Field label="نحوه نگهداری"><textarea value={dataText("care")} onChange={(e) => setData("care", e.target.value)} className={`${inputClass} min-h-24`} /></Field>
    </Panel>
  </>;
  if (kind === "project") return <Panel title="مشخصات پروژه" description="اطلاعات اجرایی و اعتباری پروژه."><div className="grid gap-4 sm:grid-cols-2"><Field label="کارفرما"><input value={dataText("client")} onChange={(e) => setData("client", e.target.value)} className={inputClass} /></Field><Field label="موقعیت"><input value={dataText("location")} onChange={(e) => setData("location", e.target.value)} className={inputClass} /></Field><Field label="سال اجرا"><input value={dataText("year")} onChange={(e) => setData("year", e.target.value)} className={inputClass} /></Field><Field label="مساحت (متر مربع)"><input type="number" min="0" value={dataText("area")} onChange={(e) => setData("area", Number(e.target.value))} className={inputClass} /></Field></div><TagInput label="خدمات انجام‌شده" value={arrayValue(data.services)} onChange={(values) => setData("services", values)} placeholder="مثلاً طراحی داخلی" /><TagInput label="محصولات استفاده‌شده" value={arrayValue(data.products)} onChange={(values) => setData("products", values)} placeholder="نام یا اسلاگ محصول" /></Panel>;
  if (kind === "collection") return <Panel title="ساختار کالکشن" description="هویت مجموعه و محصولاتی که به آن تعلق دارند."><div className="grid gap-4 sm:grid-cols-2"><Field label="نام انگلیسی"><input value={dataText("nameEn")} onChange={(e) => setData("nameEn", e.target.value)} className={inputClass} dir="ltr" /></Field><Field label="فصل / سال"><input value={dataText("season")} onChange={(e) => setData("season", e.target.value)} className={inputClass} placeholder="پاییز ۱۴۰۵" /></Field></div><TagInput label="محصولات کالکشن" hint="نام یا اسلاگ هر محصول را اضافه کنید." value={arrayValue(data.productIds)} onChange={(values) => setData("productIds", values)} placeholder="مثلاً sarv-table" /><label className="flex items-center justify-between rounded-xl border border-forest/10 bg-[#faf8f5] px-4 py-3"><span><span className="block text-[11px] font-medium text-forest">کالکشن ویژه</span><span className="mt-1 block text-[9px] text-forest/35">در بخش‌های شاخص سایت نمایش داده شود.</span></span><input type="checkbox" checked={Boolean(data.featured)} onChange={(e) => setData("featured", e.target.checked)} className="h-4 w-4 accent-forest" /></label></Panel>;
  return null;
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><input type="number" min="0" value={value || ""} onChange={(e) => onChange(Number(e.target.value))} className={inputClass} /></Field>; }
function asRecord(value: unknown): Record<string, unknown> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; }
function nestedNumber(data: Record<string, unknown>, parent: string, key: string) { return Number(asRecord(data[parent])[key] || 0); }
function arrayValue(value: unknown, fallback?: unknown): string[] { if (Array.isArray(value)) return value.map(String).filter(Boolean); return fallback ? [String(fallback)] : []; }

function TagInput({ label, value, onChange, placeholder = "یک مقدار بنویسید", hint }: { label: string; value: string[]; onChange: (value: string[]) => void; placeholder?: string; hint?: string }) {
  const [draft, setDraft] = useState("");
  function add() { const additions = splitList(draft); if (!additions.length) return; onChange([...new Set([...value, ...additions])]); setDraft(""); }
  return <div><span className="mb-2 block text-[11px] font-medium text-forest/60">{label}</span><div className="rounded-xl border border-forest/10 bg-[#faf8f5] p-2 focus-within:border-forest/30 focus-within:bg-white"><div className="flex flex-wrap gap-1.5">{value.map((item) => <span key={item} className="inline-flex items-center gap-1.5 rounded-lg bg-forest/[0.07] px-2.5 py-1.5 text-[10px] text-forest"><span>{item}</span><button type="button" onClick={() => onChange(value.filter((current) => current !== item))} className="text-forest/30 hover:text-brick" aria-label={`حذف ${item}`}>×</button></span>)}<input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1)); }} onBlur={add} className="min-w-[150px] flex-1 bg-transparent px-1.5 py-1.5 text-xs text-forest outline-none placeholder:text-forest/25" placeholder={value.length ? "مورد دیگر…" : placeholder} /></div></div>{hint && <span className="mt-1.5 block text-[9px] leading-5 text-forest/32">{hint}</span>}</div>;
}

function ReferencePicker({ label, value, options, onChange, placeholder }: { label: string; value: string[]; options: CmsEntry[]; onChange: (value: string[]) => void; placeholder: string }) {
  const selected = value.map((id) => options.find((option) => option._id === id)).filter(Boolean) as CmsEntry[];
  return <div><span className="mb-2 block text-[11px] font-medium text-forest/60">{label}</span><select value="" onChange={(e) => { if (e.target.value && !value.includes(e.target.value)) onChange([...value, e.target.value]); }} className={inputClass}><option value="">{placeholder}</option>{options.filter((option) => !value.includes(option._id)).map((option) => <option key={option._id} value={option._id}>{option.title}</option>)}</select>{selected.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{selected.map((item) => <span key={item._id} className="inline-flex items-center gap-1.5 rounded-lg bg-sage/25 px-2.5 py-1.5 text-[10px] text-forest"><span>{item.title}</span><button type="button" onClick={() => onChange(value.filter((id) => id !== item._id))} className="text-forest/30 hover:text-brick">×</button></span>)}</div>}{!options.length && <span className="mt-1.5 block text-[9px] text-forest/30">هنوز موردی در این کتابخانه ثبت نشده است.</span>}</div>;
}

function VariantEditor({ value, onChange }: { value: ProductVariant[]; onChange: (value: ProductVariant[]) => void }) {
  function update(index: number, patch: Partial<ProductVariant>) { onChange(value.map((item, current) => current === index ? { ...item, ...patch } : item)); }
  return <div className="space-y-3">{value.map((variant, index) => <div key={index} className="rounded-xl border border-forest/10 bg-[#faf8f5] p-3"><div className="mb-3 flex items-center justify-between"><span className="text-[10px] font-medium text-forest/50">گونه {(index + 1).toLocaleString("fa-IR")}</span><button type="button" onClick={() => onChange(value.filter((_, current) => current !== index))} className="text-[10px] text-brick">حذف</button></div><div className="grid gap-3 sm:grid-cols-2"><Field label="نام گونه"><input value={variant.name} onChange={(e) => update(index, { name: e.target.value })} className={inputClass} placeholder="گردویی / ۱۸۰ سانتی" /></Field><Field label="SKU"><input value={variant.sku} onChange={(e) => update(index, { sku: e.target.value })} className={inputClass} dir="ltr" /></Field><Field label="قیمت"><input type="number" min="0" value={variant.price || ""} onChange={(e) => update(index, { price: Number(e.target.value) })} className={inputClass} /></Field><Field label="موجودی"><input type="number" min="0" value={variant.inventory || ""} onChange={(e) => update(index, { inventory: Number(e.target.value) })} className={inputClass} /></Field></div><div className="mt-3"><TagInput label="ویژگی‌های این گونه" value={variant.attributes || []} onChange={(attributes) => update(index, { attributes })} placeholder="مثلاً رنگ گردویی" /></div></div>)}<button type="button" onClick={() => onChange([...value, { name: "", sku: "", price: 0, inventory: 0, attributes: [] }])} className="w-full rounded-xl border border-dashed border-forest/20 px-4 py-3 text-[10px] font-medium text-forest/55 hover:border-forest/35 hover:bg-white">+ افزودن گونه محصول</button></div>;
}

function KeyValueEditor({ label, value, onChange }: { label: string; value: { label: string; value: string }[]; onChange: (rows: { label: string; value: string }[]) => void }) { const rows = useMemo(() => value.length ? value : [{ label: "", value: "" }], [value]); return <div><span className="mb-2 block text-[11px] font-medium text-forest/60">{label}</span><div className="space-y-2">{rows.map((row, index) => <div key={index} className="grid grid-cols-[1fr_1.4fr_34px] gap-2"><input value={row.label} onChange={(e) => onChange(rows.map((item, i) => i === index ? { ...item, label: e.target.value } : item))} className={inputClass} placeholder="عنوان"/><input value={row.value} onChange={(e) => onChange(rows.map((item, i) => i === index ? { ...item, value: e.target.value } : item))} className={inputClass} placeholder="مقدار"/><button type="button" onClick={() => onChange(rows.filter((_, i) => i !== index))} className="rounded-xl border border-forest/10 text-forest/35 hover:text-brick">×</button></div>)}</div><button type="button" onClick={() => onChange([...rows, { label: "", value: "" }])} className="mt-2 text-[10px] font-medium text-brick">+ افزودن ردیف</button></div>; }
function MediaList({ images, onChange }: { images: string[]; onChange: (images: string[]) => void }) {
  const [url, setUrl] = useState("");
  function move(index: number, direction: -1 | 1) { const target = index + direction; if (target < 0 || target >= images.length) return; const next = [...images]; [next[index], next[target]] = [next[target], next[index]]; onChange(next); }
  return <div className="mt-4 space-y-2">{images.map((image, index) => <div key={`${image}-${index}`} className="flex items-center gap-2 rounded-xl border border-forest/10 bg-[#faf8f5] p-2"><span className="relative h-12 w-12 shrink-0 rounded-lg bg-[#e8e2d9]" style={{ backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}>{index === 0 && <span className="absolute -right-1 -top-1 rounded-md bg-forest px-1.5 py-0.5 text-[7px] text-paper">اصلی</span>}</span><span className="min-w-0 flex-1 truncate text-[8px] text-forest/35" dir="ltr">{image}</span><div className="flex items-center"><button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="flex h-7 w-6 items-center justify-center text-forest/30 disabled:opacity-20" title="انتقال به بالا">↑</button><button type="button" disabled={index === images.length - 1} onClick={() => move(index, 1)} className="flex h-7 w-6 items-center justify-center text-forest/30 disabled:opacity-20" title="انتقال به پایین">↓</button><button type="button" onClick={() => onChange(images.filter((_, i) => i !== index))} className="flex h-7 w-7 items-center justify-center rounded-lg text-forest/30 hover:bg-brick/[0.05] hover:text-brick" title="حذف">×</button></div></div>)}<div className="flex gap-2 pt-1"><input value={url} onChange={(e) => setUrl(e.target.value)} className={`${inputClass} min-w-0`} placeholder="یا آدرس تصویر را وارد کنید" dir="ltr"/><button type="button" onClick={() => { if (url.trim()) { onChange([...images, url.trim()]); setUrl(""); } }} className="shrink-0 rounded-xl border border-forest/10 px-3 text-[10px] text-forest/55">افزودن</button></div></div>;
}
