"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsListItems, cmsRequest, type CmsEntry } from "@/lib/cms";

const labels: Record<string, string> = { nav: "ناوبری و هویت برند", interior: "معماری داخلی", "contact-forms": "فرم‌های تماس", stores: "شعب و نمایندگی‌ها", gallery: "گالری", "work-areas": "حوزه‌های کاری" };

export default function PagesWorkspace() {
  const [items, setItems] = useState<CmsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cmsRequest<{ items: CmsEntry[] }>("page?limit=100")
      .then((result) => setItems(cmsListItems(result)))
      .catch((err) => setError(err instanceof Error ? err.message : "دریافت صفحات انجام نشد"))
      .finally(() => setLoading(false));
  }, []);

  return <main className="min-h-screen bg-[#f6f3ee]"><div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
    <header className="flex flex-col gap-4 border-b border-forest/10 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">SITE CMS</p><h1 className="mt-2 text-2xl font-medium tracking-tightest text-forest sm:text-3xl">صفحات و تنظیمات محتوا</h1><p className="mt-2 text-xs leading-6 text-forest/45">ناوبری، برند، معماری داخلی و فرم‌های ثابت از همین رکوردهای CMS مدیریت می‌شوند.</p></div><Link href="/admin/pages/new" className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper">+ صفحه جدید</Link></header>
    {error && <p className="mt-5 rounded-xl border border-brick/15 bg-brick/[0.05] px-4 py-3 text-xs text-brick">{error}</p>}
    <section className="mt-6 overflow-hidden rounded-2xl border border-forest/10 bg-white/75"><div className="divide-y divide-forest/[0.07]">{loading ? <p className="px-5 py-14 text-center text-xs text-forest/35">در حال دریافت صفحات…</p> : items.map((item) => <Link key={item._id} href={`/admin/pages/${item._id}`} className="flex items-center gap-4 px-5 py-5 transition-colors hover:bg-peach/[0.04]"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-peach/30 text-xs font-medium text-brick">{item.slug.slice(0, 2).toUpperCase()}</span><span className="min-w-0 flex-1"><span className="block text-sm font-medium text-forest">{labels[item.slug] || item.title}</span><span className="mt-1 block text-[10px] text-forest/35" dir="ltr">/{item.slug}</span></span><span className="rounded-full bg-sage/25 px-2.5 py-1.5 text-[9px] text-forest">{item.status === "published" ? "منتشرشده" : "پیش‌نویس"}</span><span className="text-forest/25">←</span></Link>)}{!loading && !items.length && <p className="px-5 py-14 text-center text-xs text-forest/35">صفحه‌ای ثبت نشده است.</p>}</div></section>
  </div></main>;
}
