"use client";

import { useEffect, useState } from "react";

type Settings = { googleSearchConsoleVerification: string; googleAnalyticsMeasurementId: string };
const inputClass = "mt-2 w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-sm text-forest outline-none focus:border-forest/35 focus:bg-white";

export default function SeoSettings() {
  const [form, setForm] = useState<Settings>({ googleSearchConsoleVerification: "", googleAnalyticsMeasurementId: "" });
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState("");
  useEffect(() => { fetch("/api/settings").then(async (r) => { const data = await r.json(); if (!r.ok) throw new Error(data.message); setForm(data); }).catch((e) => setNotice(e.message || "دریافت تنظیمات ناموفق بود")).finally(() => setLoading(false)); }, []);
  async function save(event: React.FormEvent) { event.preventDefault(); setSaving(true); setNotice(""); try { const r = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); const data = await r.json(); if (!r.ok) throw new Error(data.message); setForm(data); setNotice("تنظیمات ذخیره شد و کد تأیید در سایت فعال است."); } catch (e) { setNotice(e instanceof Error ? e.message : "ذخیره ناموفق بود"); } finally { setSaving(false); } }
  return <main className="min-h-screen bg-[#f6f3ee]"><div className="mx-auto max-w-3xl px-5 py-8 sm:px-8"><p className="text-[10px] font-medium tracking-[.18em] text-brick" dir="ltr">SEO SETTINGS</p><h1 className="mt-2 text-3xl font-medium text-forest">تنظیمات گوگل و سئو</h1><p className="mt-2 text-sm leading-7 text-forest/50">مالکیت سایت را در Google Search Console تأیید کنید. پس از ذخیره، متاتگ به‌صورت خودکار در head سایت قرار می‌گیرد.</p>
    <form onSubmit={save} className="mt-7 space-y-5 rounded-2xl border border-forest/10 bg-white/75 p-5 sm:p-7"><label className="block text-sm font-medium text-forest/70">کد تأیید Google Search Console<input className={inputClass} dir="ltr" value={form.googleSearchConsoleVerification || ""} onChange={(e) => setForm({ ...form, googleSearchConsoleVerification: e.target.value })} placeholder="کد content یا کل meta tag گوگل" /></label><p className="-mt-3 text-[11px] leading-6 text-forest/40">در Search Console روش HTML tag را انتخاب کنید؛ مقدار content یا کل تگ را اینجا Paste کنید، سپس در گوگل روی Verify بزنید.</p>
      <label className="block text-sm font-medium text-forest/70">Google Analytics Measurement ID <span className="font-normal text-forest/35">(اختیاری)</span><input className={inputClass} dir="ltr" value={form.googleAnalyticsMeasurementId || ""} onChange={(e) => setForm({ ...form, googleAnalyticsMeasurementId: e.target.value })} placeholder="G-XXXXXXXXXX" /></label>
      {notice && <p className="rounded-xl bg-sage/20 px-4 py-3 text-xs text-forest">{notice}</p>}<button disabled={loading || saving} className="rounded-xl bg-forest px-5 py-3 text-sm font-medium text-paper disabled:opacity-50">{saving ? "در حال ذخیره…" : "ذخیره تنظیمات"}</button>
    </form></div></main>;
}
