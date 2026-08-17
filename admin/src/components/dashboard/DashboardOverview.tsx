"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsListItems, cmsRequest, type CmsEntry } from "@/lib/cms";

type Summary = Record<"article" | "product" | "material" | "project" | "collection", { total: number; published: number; draft: number; items: CmsEntry[] }>;
const empty = { total: 0, published: 0, draft: 0, items: [] };

export default function DashboardOverview() {
  const [summary, setSummary] = useState<Summary>({ article: empty, product: empty, material: empty, project: empty, collection: empty });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all((["article", "product", "material", "project", "collection"] as const).map(async (kind) => {
      const result = await cmsRequest<{ items: CmsEntry[]; total: number }>(kind);
      const items = cmsListItems(result);
      return [kind, {
        total: typeof result.total === "number" ? result.total : items.length,
        published: items.filter((item) => item.status === "published").length,
        draft: items.filter((item) => item.status === "draft").length,
        items,
      }] as const;
    })).then((entries) => setSummary(Object.fromEntries(entries) as Summary)).catch(() => undefined).finally(() => setLoading(false));
  }, []);

  const recent = Object.values(summary).flatMap((group) => group.items).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const totalPublished = Object.values(summary).reduce((sum, item) => sum + item.published, 0);
  const totalDraft = Object.values(summary).reduce((sum, item) => sum + item.draft, 0);

  return <main className="min-h-screen bg-[#f6f3ee]"><div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
    <header className="flex flex-col gap-5 border-b border-forest/10 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><div className="mb-2 flex items-center gap-2 text-[10px] text-forest/35"><span className="h-1.5 w-1.5 rounded-full bg-[#54a879]"/><span>سامانه فعال است</span></div><h1 className="text-2xl font-medium tracking-tightest text-forest sm:text-3xl">نمای کلی</h1><p className="mt-2 text-xs text-forest/45">خلاصه وضعیت محتوا، کاتالوگ و فعالیت‌های اخیر.</p></div><div className="flex items-center gap-2"><Link href="/admin/articles/new" className="rounded-xl border border-forest/12 bg-white px-4 py-3 text-xs text-forest/60">مقاله جدید</Link><Link href="/admin/manage/products/new" className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper"><span className="ml-2 text-peach">+</span>محصول جدید</Link></div></header>

    <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="کل محتوای منتشرشده" value={totalPublished} loading={loading}/><Metric label="پیش‌نویس‌های نیازمند تکمیل" value={totalDraft} loading={loading} tone="brick"/><Metric label="محصول و متریال" value={summary.product.total + summary.material.total} loading={loading}/><Metric label="پروژه و کالکشن" value={summary.project.total + summary.collection.total} loading={loading}/></section>

    <div className="mt-5 grid gap-5 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-8">
        <section className="rounded-2xl border border-forest/10 bg-white/75 p-5 sm:p-6"><div className="flex items-center justify-between border-b border-forest/[0.07] pb-4"><div><h2 className="text-sm font-medium text-forest">محتوا و تحریریه</h2><p className="mt-1 text-[10px] text-forest/35">مدیریت مقاله مستقل از ابزار تولید محتوا</p></div><Link href="/admin/articles" className="text-[10px] font-medium text-brick">مشاهده مقالات ←</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><ActionCard href="/admin/articles" number={summary.article.total} eyebrow="EDITORIAL CMS" title="مقالات" description="ایجاد، تکمیل، ویرایش و انتشار کلاسیک" icon="A"/><ActionCard href="/admin/content" eyebrow="AI WORKSPACE" title="چوب‌نویس" description="دستیار چندمنظوره برای ایده، مقاله و متن محصول" icon="✦" accent/></div></section>

        <section className="rounded-2xl border border-forest/10 bg-white/75 p-5 sm:p-6"><div className="flex items-center justify-between border-b border-forest/[0.07] pb-4"><div><h2 className="text-sm font-medium text-forest">کاتالوگ و آثار</h2><p className="mt-1 text-[10px] text-forest/35">داده‌های واقعی فروش، تولید و نمایش سایت</p></div><Link href="/admin/manage" className="text-[10px] font-medium text-brick">مرکز مدیریت ←</Link></div><div className="mt-2 divide-y divide-forest/[0.07]"><CatalogRow href="/admin/manage/products" label="محصولات" description="قیمت، موجودی و مشخصات" value={summary.product.total}/><CatalogRow href="/admin/manage/materials" label="متریال‌ها" description="کتابخانه و موجودی مواد" value={summary.material.total}/><CatalogRow href="/admin/manage/projects" label="پروژه‌ها" description="اطلاعات و گالری اجرا" value={summary.project.total}/><CatalogRow href="/admin/manage/collections" label="کالکشن‌ها" description="مجموعه و اتصال محصولات" value={summary.collection.total}/></div></section>
      </div>

      <aside className="space-y-5 lg:col-span-4">
        <Link href="/admin/brandbook" className="group block overflow-hidden rounded-2xl bg-forest p-5 text-paper shadow-sm"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-paper/10 text-peach">B</span><span className="text-paper/35 transition-transform group-hover:-translate-x-1">←</span></div><p className="mt-10 text-[9px] tracking-[0.16em] text-peach" dir="ltr">DIGITAL BRANDBOOK</p><h2 className="mt-2 text-lg font-medium">برندبوک دیجیتال</h2><p className="mt-2 text-[10px] leading-5 text-paper/45">مرجع هویت، لحن و استانداردهای طراحی برند.</p></Link>

        <section className="rounded-2xl border border-forest/10 bg-white/75 p-5"><div className="flex items-center justify-between border-b border-forest/[0.07] pb-4"><h2 className="text-sm font-medium text-forest">آخرین تغییرات</h2><span className="text-[9px] text-forest/30">زنده</span></div><div className="divide-y divide-forest/[0.07]">{loading ? <p className="py-10 text-center text-[10px] text-forest/30">در حال دریافت…</p> : recent.map((item) => <Link key={item._id} href={entryHref(item)} className="flex items-center gap-3 py-3.5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ece7df] text-[9px] text-forest/45">{kindLabel(item.kind).slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-medium text-forest">{item.title}</span><span className="mt-1 block text-[9px] text-forest/32">{kindLabel(item.kind)} · {new Date(item.updatedAt).toLocaleDateString("fa-IR")}</span></span></Link>)}{!loading && recent.length === 0 && <p className="py-10 text-center text-[10px] text-forest/30">هنوز فعالیتی ثبت نشده است.</p>}</div></section>
      </aside>
    </div>
  </div></main>;
}

function Metric({ label, value, loading, tone = "forest" }: { label: string; value: number; loading: boolean; tone?: "forest" | "brick" }) { return <div className="rounded-2xl border border-forest/10 bg-white/70 px-4 py-4"><span className={`text-xl font-medium ${tone === "brick" ? "text-brick" : "text-forest"}`}>{loading ? "—" : value.toLocaleString("fa-IR")}</span><p className="mt-1.5 text-[9px] leading-4 text-forest/38">{label}</p></div>; }
function ActionCard({ href, eyebrow, title, description, icon, number, accent }: { href: string; eyebrow: string; title: string; description: string; icon: string; number?: number; accent?: boolean }) { return <Link href={href} className={`group rounded-2xl border p-4 transition-colors ${accent ? "border-peach/60 bg-peach/20 hover:bg-peach/30" : "border-forest/10 bg-[#faf8f5] hover:bg-white"}`}><div className="flex items-center justify-between"><span className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs ${accent ? "bg-peach text-forest" : "bg-forest text-peach"}`}>{icon}</span>{number !== undefined && <span className="text-lg font-medium text-forest">{number.toLocaleString("fa-IR")}</span>}</div><p className="mt-5 text-[9px] tracking-[0.13em] text-brick" dir="ltr">{eyebrow}</p><h3 className="mt-1.5 text-sm font-medium text-forest">{title}</h3><p className="mt-1.5 text-[10px] leading-5 text-forest/40">{description}</p></Link>; }
function CatalogRow({ href, label, description, value }: { href: string; label: string; description: string; value: number }) { return <Link href={href} className="group flex items-center gap-3 py-3.5"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ece7df] text-[10px] text-forest/45">◇</span><span className="min-w-0 flex-1"><span className="block text-[11px] font-medium text-forest">{label}</span><span className="mt-0.5 block text-[9px] text-forest/35">{description}</span></span><span className="text-xs font-medium text-forest/50">{value.toLocaleString("fa-IR")}</span><span className="text-forest/20 transition-transform group-hover:-translate-x-1">←</span></Link>; }
function kindLabel(kind: CmsEntry["kind"]) { return ({ article: "مقاله", product: "محصول", material: "متریال", project: "پروژه", collection: "کالکشن" })[kind]; }
function entryHref(item: CmsEntry) { if (item.kind === "article") return `/admin/articles/${item._id}`; const path = ({ product: "products", material: "materials", project: "projects", collection: "collections" } as const)[item.kind]; return `/admin/manage/${path}/${item._id}`; }
