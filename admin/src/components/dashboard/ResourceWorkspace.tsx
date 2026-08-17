"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { cmsListItems, cmsRequest, formatMoney, resourceToKind, type CmsEntry, type CmsStatus, type ResourcePath } from "@/lib/cms";

const copy: Record<ResourcePath, { title: string; singular: string; eyebrow: string; description: string; categoryKey: string; categoryLabel: string }> = {
  products: { title: "محصولات", singular: "محصول", eyebrow: "PRODUCT CATALOG", description: "قیمت، موجودی، تصاویر، مشخصات فنی و وضعیت انتشار محصولات.", categoryKey: "category", categoryLabel: "دسته‌بندی" },
  materials: { title: "متریال‌ها", singular: "متریال", eyebrow: "MATERIAL LIBRARY", description: "کتابخانه متریال، کد، تامین‌کننده، موجودی و ویژگی‌های فنی.", categoryKey: "materialType", categoryLabel: "نوع متریال" },
  projects: { title: "پروژه‌ها", singular: "پروژه", eyebrow: "PROJECTS", description: "اطلاعات کامل پروژه‌ها، خدمات، تصاویر و روایت اجرا.", categoryKey: "location", categoryLabel: "موقعیت" },
  collections: { title: "کالکشن‌ها", singular: "کالکشن", eyebrow: "COLLECTIONS", description: "ساخت مجموعه، اتصال محصولات و مدیریت داستان و تصویر کالکشن.", categoryKey: "season", categoryLabel: "فصل / موضوع" },
};

const statusCopy: Record<CmsStatus, string> = { draft: "پیش‌نویس", published: "منتشرشده", archived: "بایگانی" };

export default function ResourceWorkspace({ kind }: { kind: ResourcePath }) {
  const labels = copy[kind];
  const apiKind = resourceToKind[kind];
  const [items, setItems] = useState<CmsEntry[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | CmsStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (filter !== "all") params.set("status", filter);
      const result = await cmsRequest<{ items: CmsEntry[] }>(`${apiKind}?${params}`);
      setItems(cmsListItems(result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "دریافت اطلاعات انجام نشد");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiKind, filter, query]);

  useEffect(() => {
    const timeout = window.setTimeout(load, 250);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const counts = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return {
      published: list.filter((item) => item.status === "published").length,
      draft: list.filter((item) => item.status === "draft").length,
    };
  }, [items]);

  async function togglePublish(item: CmsEntry) {
    try {
      await cmsRequest(`${apiKind}/${item._id}/${item.status === "published" ? "archive" : "publish"}`, { method: "POST" });
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "تغییر وضعیت انجام نشد"); }
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
        <header className="flex flex-col gap-5 border-b border-forest/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] text-forest/40"><Link href="/admin/manage" className="hover:text-forest">مدیریت آثار</Link><span>/</span><span>{labels.title}</span></div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">{labels.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-medium tracking-tightest text-forest sm:text-3xl">{labels.title}</h1>
            <p className="mt-2 text-xs leading-6 text-forest/45">{labels.description}</p>
          </div>
          <Link href={`/admin/manage/${kind}/new`} className="inline-flex w-fit items-center gap-2 rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper shadow-sm transition-colors hover:bg-forest-700"><span className="text-base text-peach">+</span>افزودن {labels.singular}</Link>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-forest/10 bg-white/70 p-4"><span className="text-xl font-medium text-forest">{items.length.toLocaleString("fa-IR")}</span><p className="mt-1 text-[10px] text-forest/40">کل موارد این نما</p></div>
          <div className="rounded-2xl border border-forest/10 bg-white/70 p-4"><span className="text-xl font-medium text-forest">{counts.published.toLocaleString("fa-IR")}</span><p className="mt-1 text-[10px] text-forest/40">منتشرشده</p></div>
          <div className="rounded-2xl border border-forest/10 bg-white/70 p-4"><span className="text-xl font-medium text-brick">{counts.draft.toLocaleString("fa-IR")}</span><p className="mt-1 text-[10px] text-forest/40">نیازمند تکمیل</p></div>
        </section>

        <section className="mt-4 overflow-hidden rounded-2xl border border-forest/10 bg-white/75 shadow-[0_10px_35px_rgba(9,43,28,0.035)]">
          <div className="flex flex-col gap-3 border-b border-forest/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative block sm:w-80"><svg className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`جست‌وجو در ${labels.title}...`} className="w-full rounded-xl border border-forest/10 bg-[#f8f6f2] py-2.5 pl-3 pr-9 text-xs text-forest placeholder:text-forest/25 focus:border-forest/30 focus:outline-none" /></label>
            <div className="flex overflow-x-auto rounded-xl bg-forest/[0.04] p-1">{(["all", "published", "draft", "archived"] as const).map((value) => <button key={value} type="button" onClick={() => setFilter(value)} className={cn("whitespace-nowrap rounded-lg px-3 py-2 text-[10px] transition-colors", filter === value ? "bg-white text-forest shadow-sm" : "text-forest/40 hover:text-forest")} >{value === "all" ? "همه" : statusCopy[value]}</button>)}</div>
          </div>

          {error && <div className="m-4 rounded-xl border border-brick/15 bg-brick/[0.05] px-4 py-3 text-xs text-brick">{error}<button type="button" onClick={load} className="mr-3 underline">تلاش دوباره</button></div>}

          <div className="hidden grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)_130px_120px_90px] gap-4 border-b border-forest/[0.06] bg-forest/[0.018] px-5 py-3 text-[10px] text-forest/35 md:grid"><span>عنوان</span><span>{labels.categoryLabel}</span><span>{kind === "products" ? "قیمت / موجودی" : "آخرین تغییر"}</span><span>وضعیت</span><span></span></div>
          <div className="divide-y divide-forest/[0.07]">
            {loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="grid animate-pulse gap-4 px-5 py-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)_130px_120px_90px]"><span className="h-10 rounded-xl bg-forest/[0.05]"/><span className="h-5 rounded bg-forest/[0.04]"/><span className="h-5 rounded bg-forest/[0.04]"/></div>) : items.map((item) => {
              const data = item.data || {};
              return <div key={item._id} className="group grid gap-3 px-5 py-4 transition-colors hover:bg-peach/[0.045] md:grid-cols-[minmax(0,1.4fr)_minmax(0,.8fr)_130px_120px_90px] md:items-center md:gap-4">
                <Link href={`/admin/manage/${kind}/${item._id}`} className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#ebe5dc] text-xs text-forest/45" style={item.images?.[0] ? { backgroundImage: `url(${item.images[0]})`, backgroundSize: "cover", backgroundPosition: "center", color: "transparent" } : undefined}>◇</span><span className="min-w-0"><span className="block truncate text-xs font-medium text-forest">{item.title}</span><span className="mt-1 block truncate text-[10px] text-forest/32" dir="ltr">/{item.slug}</span></span></Link>
                <span className="pr-[52px] text-[11px] text-forest/45 md:pr-0">{String(data[labels.categoryKey] || "—")}</span>
                <span className="pr-[52px] text-[10px] text-forest/38 md:pr-0">{kind === "products" ? <>{formatMoney(data.price)}<small className="mt-1 block text-[9px] text-forest/30">موجودی: {Number(data.inventory || 0).toLocaleString("fa-IR")}</small></> : new Date(item.updatedAt).toLocaleDateString("fa-IR")}</span>
                <button type="button" onClick={() => togglePublish(item)} className={cn("mr-[52px] w-fit rounded-full px-2.5 py-1.5 text-[9px] transition-opacity hover:opacity-75 md:mr-0", item.status === "published" ? "bg-sage/35 text-forest" : item.status === "archived" ? "bg-forest/10 text-forest/50" : "bg-peach/40 text-brick")}>{statusCopy[item.status]}</button>
                <Link href={`/admin/manage/${kind}/${item._id}`} className="mr-[52px] inline-flex w-fit items-center gap-1 text-[10px] font-medium text-brick md:mr-0">ویرایش <span>←</span></Link>
              </div>;
            })}
            {!loading && items.length === 0 && <div className="px-6 py-16 text-center"><p className="text-sm text-forest/50">موردی پیدا نشد</p><Link href={`/admin/manage/${kind}/new`} className="mt-3 inline-block text-xs font-medium text-brick">اولین {labels.singular} را بسازید</Link></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
