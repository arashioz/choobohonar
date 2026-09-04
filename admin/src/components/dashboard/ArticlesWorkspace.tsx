"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cmsListItems, cmsRequest, type CmsEntry, type CmsStatus } from "@/lib/cms";
import { cn } from "@/lib/utils";

const statusCopy: Record<CmsStatus, string> = { draft: "پیش‌نویس", published: "منتشرشده", archived: "بایگانی" };

export default function ArticlesWorkspace() {
  const [items, setItems] = useState<CmsEntry[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | CmsStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const params = new URLSearchParams(); if (query.trim()) params.set("q", query.trim()); if (status !== "all") params.set("status", status);
    try {
      const result = await cmsRequest<{ items: CmsEntry[] }>(`article?${params}`);
      setItems(cmsListItems(result));
    }
    catch (err) { setError(err instanceof Error ? err.message : "دریافت مقالات انجام نشد"); setItems([]); }
    finally { setLoading(false); }
  }, [query, status]);

  useEffect(() => { const timeout = window.setTimeout(load, 250); return () => window.clearTimeout(timeout); }, [load]);
  const stats = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return {
      published: list.filter((item) => item.status === "published").length,
      draft: list.filter((item) => item.status === "draft").length,
      words: list.reduce((sum, item) => sum + (item.content || "").split(/\s+/).filter(Boolean).length, 0),
    };
  }, [items]);

  async function publish(item: CmsEntry) { try { await cmsRequest(`article/${item._id}/publish`, { method: "POST" }); await load(); } catch (err) { setError(err instanceof Error ? err.message : "انتشار انجام نشد"); } }
  async function seedArticles() { try { await cmsRequest("article/seed", { method: "POST" }); await load(); } catch (err) { setError(err instanceof Error ? err.message : "بازیابی مقالات انجام نشد"); } }

  return <main className="min-h-screen bg-[#f6f3ee]"><div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
    <header className="flex flex-col gap-5 border-b border-forest/10 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">EDITORIAL CMS</p><h1 className="mt-2 text-2xl font-medium tracking-tightest text-forest sm:text-3xl">مقالات</h1><p className="mt-2 text-xs leading-6 text-forest/45">ایجاد، تکمیل، بازبینی و انتشار مقاله‌های مجله چوب و هنر.</p></div><div className="flex items-center gap-2"><Link href="/admin/content" className="rounded-xl border border-forest/12 bg-white px-4 py-3 text-xs text-forest/60 hover:border-forest/25">کمک گرفتن از چوب‌نویس</Link><Link href="/admin/articles/new" className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper"><span className="ml-2 text-peach">+</span>مقاله جدید</Link></div></header>

    <section className="mt-6 grid gap-3 sm:grid-cols-3"><Stat value={stats.published} label="مقاله منتشرشده"/><Stat value={stats.draft} label="پیش‌نویس در حال تکمیل" tone="brick"/><Stat value={stats.words} label="کلمه در این نما"/></section>

    <section className="mt-4 overflow-hidden rounded-2xl border border-forest/10 bg-white/75 shadow-[0_10px_35px_rgba(9,43,28,0.035)]"><div className="flex flex-col gap-3 border-b border-forest/[0.08] p-4 sm:flex-row sm:items-center sm:justify-between"><label className="relative sm:w-80"><span className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/30">⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full rounded-xl border border-forest/10 bg-[#f8f6f2] py-2.5 pl-3 pr-9 text-xs outline-none focus:border-forest/30" placeholder="جست‌وجو در عنوان، اسلاگ یا برچسب…"/></label><div className="flex rounded-xl bg-forest/[0.04] p-1">{(["all", "published", "draft", "archived"] as const).map((value) => <button key={value} onClick={() => setStatus(value)} className={cn("rounded-lg px-3 py-2 text-[10px]", status === value ? "bg-white text-forest shadow-sm" : "text-forest/40")}>{value === "all" ? "همه" : statusCopy[value]}</button>)}</div></div>
      {error && <p className="m-4 rounded-xl border border-brick/15 bg-brick/[0.05] px-4 py-3 text-xs text-brick">{error}</p>}
      <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,.7fr)_110px_110px_120px] gap-4 border-b border-forest/[0.06] px-5 py-3 text-[10px] text-forest/35 md:grid"><span>مقاله</span><span>دسته‌بندی</span><span>نویسنده</span><span>وضعیت</span><span>عملیات</span></div>
      <div className="divide-y divide-forest/[0.07]">{loading ? <p className="px-5 py-14 text-center text-xs text-forest/35">در حال دریافت مقالات…</p> : items.map((item) => { const data = item.data || {}; return <article key={item._id} className="grid gap-3 px-5 py-4 hover:bg-peach/[0.04] md:grid-cols-[minmax(0,1.6fr)_minmax(0,.7fr)_110px_110px_120px] md:items-center md:gap-4"><Link href={`/admin/articles/${item._id}`} className="min-w-0"><h2 className="truncate text-xs font-medium text-forest">{item.title}</h2><p className="mt-1 line-clamp-1 text-[10px] text-forest/35">{item.excerpt || "بدون خلاصه"}</p><p className="mt-1.5 text-[9px] text-forest/25" dir="ltr">/{item.slug}</p></Link><span className="text-[10px] text-forest/45">{String(data.category || "بدون دسته‌بندی")}</span><span className="text-[10px] text-forest/38">{String(data.author || "تحریریه")}</span><span className={cn("w-fit rounded-full px-2.5 py-1.5 text-[9px]", item.status === "published" ? "bg-sage/35 text-forest" : item.status === "archived" ? "bg-forest/10 text-forest/50" : "bg-peach/40 text-brick")}>{statusCopy[item.status]}</span><div className="flex items-center gap-3"><Link href={`/admin/articles/${item._id}`} className="text-[10px] font-medium text-brick">ویرایش</Link>{item.status === "draft" && <button type="button" onClick={() => publish(item)} className="text-[10px] font-medium text-forest/55">انتشار</button>}</div></article>; })}{!loading && items.length === 0 && <div className="px-5 py-16 text-center"><p className="text-sm text-forest/45">مقاله‌ای پیدا نشد</p><Link href="/admin/articles/new" className="mt-3 inline-block text-xs font-medium text-brick">ساخت مقاله جدید</Link></div>}</div>
    </section>
  </div></main>;
}

function Stat({ value, label, tone = "forest" }: { value: number; label: string; tone?: "forest" | "brick" }) { return <div className="rounded-2xl border border-forest/10 bg-white/70 p-4"><span className={cn("text-xl font-medium", tone === "brick" ? "text-brick" : "text-forest")}>{value.toLocaleString("fa-IR")}</span><p className="mt-1 text-[10px] text-forest/40">{label}</p></div>; }
