"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cmsRequest, type CmsEntry } from "@/lib/cms";

const sections = [
  { kind: "product", path: "products", label: "محصولات", description: "قیمت، موجودی، تصاویر و مشخصات فنی", code: "PR" },
  { kind: "material", path: "materials", label: "متریال‌ها", description: "کتابخانه متریال، تامین و موجودی", code: "MT" },
  { kind: "project", path: "projects", label: "پروژه‌ها", description: "روایت، اطلاعات اجرا و گالری تصاویر", code: "PJ" },
  { kind: "collection", path: "collections", label: "کالکشن‌ها", description: "داستان مجموعه و اتصال محصولات", code: "CL" },
] as const;

export default function ManageOverview() {
  const [counts, setCounts] = useState<Record<string, { total: number; draft: number; published: number }>>({});
  useEffect(() => { Promise.all(sections.map(async (section) => { const result = await cmsRequest<{ items: CmsEntry[]; total: number }>(section.kind); return [section.kind, { total: result.total, draft: result.items.filter((item) => item.status === "draft").length, published: result.items.filter((item) => item.status === "published").length }] as const; })).then((items) => setCounts(Object.fromEntries(items))).catch(() => undefined); }, []);

  return <main className="min-h-screen bg-[#f6f3ee]"><div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 md:py-9 lg:px-10">
    <header className="border-b border-forest/10 pb-7"><div className="mb-3 flex items-center gap-2 text-[10px] text-forest/35"><Link href="/admin" className="hover:text-forest">نمای کلی</Link><span>/</span><span>مدیریت آثار</span></div><p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">CATALOG & SHOWCASE</p><h1 className="mt-2 text-2xl font-medium tracking-tightest text-forest sm:text-3xl">مدیریت آثار</h1><p className="mt-2 max-w-2xl text-xs leading-6 text-forest/45">داده‌های محصول، متریال و روایت‌های پروژه و کالکشن را از این مرکز مدیریت کنید.</p></header>

    <section className="mt-6 grid gap-4 md:grid-cols-2">{sections.map((section) => { const stat = counts[section.kind]; return <article key={section.kind} className="rounded-2xl border border-forest/10 bg-white/75 p-5 transition-shadow hover:shadow-[0_12px_35px_rgba(9,43,28,0.05)]"><div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eae5dd] text-[10px] font-medium text-forest/55" dir="ltr">{section.code}</span><div className="flex items-center gap-4 text-left"><div><span className="block text-lg font-medium text-forest">{stat ? stat.total.toLocaleString("fa-IR") : "—"}</span><span className="text-[8px] text-forest/30">کل</span></div><div><span className="block text-lg font-medium text-brick">{stat ? stat.draft.toLocaleString("fa-IR") : "—"}</span><span className="text-[8px] text-forest/30">پیش‌نویس</span></div></div></div><h2 className="mt-5 text-sm font-medium text-forest">{section.label}</h2><p className="mt-1.5 text-[10px] leading-5 text-forest/40">{section.description}</p><div className="mt-5 flex items-center gap-2 border-t border-forest/[0.07] pt-4"><Link href={`/admin/manage/${section.path}`} className="flex-1 rounded-xl border border-forest/10 px-3 py-2.5 text-center text-[10px] font-medium text-forest/60 hover:bg-[#faf8f5]">مشاهده و مدیریت</Link><Link href={`/admin/manage/${section.path}/new`} className="rounded-xl bg-forest px-3.5 py-2.5 text-[10px] font-medium text-paper">+ افزودن</Link></div></article>; })}</section>

    <aside className="mt-5 rounded-2xl border border-forest/10 bg-[#ebe6de] px-5 py-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-medium text-forest">مدل داده یکپارچه</p><p className="mt-1 text-[10px] leading-5 text-forest/40">هر رکورد تاریخچه تغییر، وضعیت انتشار، رسانه و اطلاعات SEO مستقل دارد.</p></div><Link href="/admin/articles" className="text-[10px] font-medium text-brick">رفتن به مدیریت مقالات ←</Link></div></aside>
  </div></main>;
}
