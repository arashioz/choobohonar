"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsListItems, cmsRequest, type CmsEntry } from "@/lib/cms";

type Summary = Record<
  "article" | "product" | "material" | "project" | "collection" | "story",
  { total: number; published: number; draft: number; items: CmsEntry[] }
>;
const empty = { total: 0, published: 0, draft: 0, items: [] };

const shortcuts = [
  { href: "/admin/shop", title: "فروشگاه", note: "قیمت، سفارش، فاکتور", tone: "forest" },
  { href: "/admin/manage/products", title: "محصولات", note: "کاتالوگ و موجودی", tone: "cream" },
  { href: "/admin/customers", title: "مشتریان", note: "CRM و پرونده‌ها", tone: "sage" },
  { href: "/admin/leads", title: "درخواست‌ها", note: "فرم‌ها و بریف‌ها", tone: "peach" },
  { href: "/admin/manage/projects", title: "پروژه‌ها", note: "گالری و روایت اجرا", tone: "forest" },
  { href: "/admin/manage/materials", title: "متریال‌ها", note: "کتابخانه مواد", tone: "cream" },
  { href: "/admin/articles", title: "مقالات", note: "تحریریه و انتشار", tone: "sage" },
  { href: "/admin/pages", title: "صفحات سایت", note: "ناوبری و فرم‌ها", tone: "peach" },
  { href: "/admin/seo", title: "سئو", note: "ایندکس و کیورد", tone: "cream" },
  { href: "/admin/manage/stories", title: "ویدیوها", note: "روایت محصول", tone: "sage" },
  { href: "/admin/content", title: "چوب‌نویس", note: "دستیار محتوا", tone: "peach" },
  { href: "/admin/settings", title: "تنظیمات", note: "سرچ‌کنسول و سئو", tone: "forest" },
] as const;

const tones = {
  forest: {
    card: "border-forest/15 bg-forest text-paper hover:bg-[#0c3322]",
    note: "text-paper/50",
    arrow: "text-peach",
  },
  peach: {
    card: "border-peach/50 bg-peach/30 text-forest hover:bg-peach/45",
    note: "text-forest/50",
    arrow: "text-brick",
  },
  sage: {
    card: "border-[#54a879]/20 bg-[#dce8df] text-forest hover:bg-[#d2e0d6]",
    note: "text-forest/50",
    arrow: "text-forest/45",
  },
  cream: {
    card: "border-forest/10 bg-[#faf8f5] text-forest hover:bg-white",
    note: "text-forest/45",
    arrow: "text-forest/30",
  },
} as const;

export default function DashboardOverview() {
  const [summary, setSummary] = useState<Summary>({
    article: empty,
    product: empty,
    material: empty,
    project: empty,
    collection: empty,
    story: empty,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(
      (["article", "product", "material", "project", "collection", "story"] as const).map(async (kind) => {
        const result = await cmsRequest<{ items: CmsEntry[]; total: number }>(kind);
        const items = cmsListItems(result);
        return [
          kind,
          {
            total: typeof result.total === "number" ? result.total : items.length,
            published: items.filter((item) => item.status === "published").length,
            draft: items.filter((item) => item.status === "draft").length,
            items,
          },
        ] as const;
      }),
    )
      .then((entries) => setSummary(Object.fromEntries(entries) as Summary))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const recent = Object.values(summary)
    .flatMap((group) => group.items)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);
  const totalPublished = Object.values(summary).reduce((sum, item) => sum + item.published, 0);
  const totalDraft = Object.values(summary).reduce((sum, item) => sum + item.draft, 0);

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-forest/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] text-forest/35">
              <span className="h-1.5 w-1.5 rounded-full bg-[#54a879]" />
              <span>سامانه فعال است</span>
            </div>
            <h1 className="text-2xl font-medium tracking-tightest text-forest sm:text-3xl">نمای کلی</h1>
            <p className="mt-2 text-xs text-forest/45">دسترسی سریع به کارهای روزمره پنل.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/articles/new" className="rounded-xl border border-forest/12 bg-white px-4 py-3 text-xs text-forest/60">
              مقاله جدید
            </Link>
            <Link href="/admin/manage/products/new" className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper">
              <span className="ml-2 text-peach">+</span>محصول جدید
            </Link>
          </div>
        </header>

        <section className="mt-6">
          <h2 className="text-sm font-medium text-forest">دسترسی سریع</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {shortcuts.map((item) => {
              const tone = tones[item.tone];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex min-h-[8.5rem] flex-col justify-between rounded-2xl border px-5 py-5 transition-colors ${tone.card}`}
                >
                  <div>
                    <h3 className="text-base font-medium tracking-tight">{item.title}</h3>
                    <p className={`mt-2 text-[11px] leading-5 ${tone.note}`}>{item.note}</p>
                  </div>
                  <span className={`mt-6 text-sm transition-transform group-hover:-translate-x-1 ${tone.arrow}`}>←</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Metric label="منتشرشده" value={totalPublished} loading={loading} />
          <Metric label="پیش‌نویس" value={totalDraft} loading={loading} tone="brick" />
          <Metric label="محصول" value={summary.product.total} loading={loading} />
          <Metric label="پروژه" value={summary.project.total} loading={loading} />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <section className="rounded-2xl border border-forest/10 bg-white/75 p-5 sm:p-6 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-forest/[0.07] pb-4">
              <h2 className="text-sm font-medium text-forest">آخرین تغییرات</h2>
              <Link href="/admin/manage" className="text-[10px] font-medium text-brick">
                مدیریت آثار ←
              </Link>
            </div>
            <div className="divide-y divide-forest/[0.07]">
              {loading ? <p className="py-10 text-center text-[10px] text-forest/30">در حال دریافت…</p> : null}
              {!loading
                ? recent.map((item) => (
                    <Link key={item._id} href={entryHref(item)} className="flex items-center gap-3 py-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ece7df] text-[9px] text-forest/45">
                        {kindLabel(item.kind).slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[11px] font-medium text-forest">{item.title}</span>
                        <span className="mt-1 block text-[9px] text-forest/32">
                          {kindLabel(item.kind)} · {new Date(item.updatedAt).toLocaleDateString("fa-IR")}
                        </span>
                      </span>
                      <span className="text-forest/20">←</span>
                    </Link>
                  ))
                : null}
              {!loading && recent.length === 0 ? (
                <p className="py-10 text-center text-[10px] text-forest/30">هنوز فعالیتی ثبت نشده است.</p>
              ) : null}
            </div>
          </section>

          <aside className="space-y-3 lg:col-span-4">
            <Link
              href="/admin/shop"
              className="block rounded-2xl bg-forest p-5 text-paper transition-colors hover:bg-forest-700"
            >
              <p className="text-[10px] tracking-[0.14em] text-peach" dir="ltr">SHOP</p>
              <h2 className="mt-2 text-lg font-medium">سفارش و پیش‌فاکتور</h2>
              <p className="mt-2 text-[11px] leading-5 text-paper/50">ورود مستقیم به فروشگاه عملیاتی.</p>
            </Link>
            <Link
              href="/admin/brandbook"
              className="block rounded-2xl border border-forest/10 bg-white/75 p-5 text-forest hover:bg-white"
            >
              <h2 className="text-sm font-medium">برندبوک دیجیتال</h2>
              <p className="mt-1 text-[11px] text-forest/40">هویت، لحن و استاندارد طراحی.</p>
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  loading,
  tone = "forest",
}: {
  label: string;
  value: number;
  loading: boolean;
  tone?: "forest" | "brick";
}) {
  return (
    <div className="rounded-2xl border border-forest/10 bg-white/70 px-4 py-4">
      <span className={`text-xl font-medium ${tone === "brick" ? "text-brick" : "text-forest"}`}>
        {loading ? "—" : value.toLocaleString("fa-IR")}
      </span>
      <p className="mt-1.5 text-[9px] leading-4 text-forest/38">{label}</p>
    </div>
  );
}

function kindLabel(kind: CmsEntry["kind"]) {
  return (
    ({ article: "مقاله", product: "محصول", material: "متریال", project: "پروژه", collection: "کالکشن", story: "ویدیو", page: "صفحه" } as const)[
      kind
    ] || "محتوا"
  );
}

function entryHref(item: CmsEntry) {
  if (item.kind === "article") return `/admin/articles/${item._id}`;
  const path = (
    { product: "products", material: "materials", project: "projects", collection: "collections", story: "stories" } as const
  )[item.kind as "product" | "material" | "project" | "collection" | "story"];
  return path ? `/admin/manage/${path}/${item._id}` : "/admin";
}
