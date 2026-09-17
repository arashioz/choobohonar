"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";

type Customer = { id: string; name: string; phone: string; email?: string; city?: string; createdAt?: string };
type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  items: { name: string; qty: number; image?: string }[];
  amounts: { total: number };
  payment?: { status?: string };
  createdAt?: string;
};
type ProfilePayload = { customer: Customer; orders: Order[] };
type Mode = "login" | "register";

const statusLabel: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  preparing: "در حال آماده‌سازی",
  shipping: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/public/account${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "درخواست انجام نشد");
  return payload as T;
}

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({ name: "", phone: "", email: "", city: "", password: "" });

  async function loadProfile() {
    setLoading(true);
    try {
      const next = await request<ProfilePayload>("/me");
      setProfile(next);
      setCredentials({ name: next.customer.name, phone: next.customer.phone, email: next.customer.email || "", city: next.customer.city || "", password: "" });
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadProfile(); }, []);

  async function submitAuthentication(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const path = mode === "login" ? "/login" : "/register";
      const body = mode === "login"
        ? { phone: credentials.phone, password: credentials.password }
        : credentials;
      await request<{ customer: Customer }>(path, { method: "POST", body: JSON.stringify(body) });
      await loadProfile();
      setMessage(mode === "login" ? "خوش آمدید." : "حساب کاربری شما ساخته شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود انجام نشد");
    } finally { setSaving(false); }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      const customer = await request<Customer>("/me", { method: "PATCH", body: JSON.stringify({ name: credentials.name, email: credentials.email, city: credentials.city }) });
      setProfile((current) => current ? { ...current, customer } : current);
      setMessage("اطلاعات پروفایل ذخیره شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره اطلاعات ناموفق بود");
    } finally { setSaving(false); }
  }

  async function logout() {
    await request<{ ok: true }>("/logout", { method: "POST" }).catch(() => undefined);
    setProfile(null); setMessage("از حساب کاربری خارج شدید."); setCredentials({ name: "", phone: "", email: "", city: "", password: "" });
  }

  return <section className="min-h-[88svh] bg-paper pb-24 pt-32 md:pt-40"><Container>
    <header className="border-b border-forest/10 pb-9"><p className="eyebrow text-brick">MY ACCOUNT</p><h1 className="mt-5 text-[clamp(3rem,7vw,6rem)] font-extralight leading-[0.88] tracking-tightest text-forest">حساب کاربری</h1><p className="mt-5 max-w-xl text-base leading-8 text-forest/60">اطلاعات شخصی و تاریخچه سفارش‌های خانه چوب و هنر.</p></header>
    {message ? <p className="mt-6 rounded-xl bg-sage/25 px-4 py-3 text-sm text-forest">{message}</p> : null}
    {error ? <p className="mt-6 rounded-xl bg-brick/[0.08] px-4 py-3 text-sm text-brick">{error}</p> : null}
    {loading ? <div className="h-72 animate-pulse bg-forest/[0.04]" /> : profile ? <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)]">
      <form onSubmit={saveProfile} className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="text-xl font-light text-forest">اطلاعات شما</h2><p className="mt-2 text-xs text-forest/50">شماره موبایل، شناسه حساب شماست.</p></div><button type="button" onClick={() => void logout()} className="text-xs text-brick underline">خروج</button></div><div className="mt-7 grid gap-5"><ProfileField label="نام و نام خانوادگی" value={credentials.name} onChange={(value) => setCredentials((current) => ({ ...current, name: value }))} /><ProfileField label="شماره موبایل" value={credentials.phone} disabled onChange={() => undefined} dir="ltr" /><ProfileField label="ایمیل" value={credentials.email} onChange={(value) => setCredentials((current) => ({ ...current, email: value }))} dir="ltr" /><ProfileField label="شهر" value={credentials.city} onChange={(value) => setCredentials((current) => ({ ...current, city: value }))} /><button disabled={saving} className="mt-2 min-h-12 rounded-full bg-forest px-6 text-sm text-paper disabled:opacity-50">{saving ? "در حال ذخیره…" : "ذخیره اطلاعات"}</button></div></form>
      <section><div className="flex items-end justify-between gap-4 border-b border-forest/10 pb-5"><div><h2 className="text-2xl font-light text-forest">سفارش‌های من</h2><p className="mt-2 text-xs text-forest/50">{profile.orders.length.toLocaleString("fa-IR")} سفارش ثبت‌شده</p></div><Link href="/products" className="text-sm text-brick">مشاهده محصولات ←</Link></div>{profile.orders.length ? <div className="divide-y divide-forest/10">{profile.orders.map((order) => <article key={order._id} className="py-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-medium text-forest" dir="ltr">{order.orderNumber}</p><p className="mt-1 text-xs text-forest/50">{order.createdAt ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(order.createdAt)) : ""}</p></div><span className="rounded-full bg-forest/[0.06] px-3 py-1.5 text-xs text-forest">{statusLabel[order.status] || order.status}</span></div><p className="mt-4 text-sm leading-7 text-forest/65">{order.items.map((item) => `${item.name} × ${item.qty.toLocaleString("fa-IR")}`).join("، ")}</p><p className="mt-3 text-sm text-forest">{Number(order.amounts.total || 0).toLocaleString("fa-IR")} تومان</p></article>)}</div> : <div className="mt-8 rounded-2xl border border-dashed border-forest/15 p-8 text-center"><p className="text-sm text-forest/55">هنوز سفارشی با این شماره ثبت نشده است.</p><Link href="/products" className="mt-4 inline-block text-sm text-brick">شروع خرید ←</Link></div>}</section>
    </div> : <div className="mx-auto mt-12 max-w-lg rounded-2xl border border-forest/10 bg-white p-6 sm:p-8"><div className="flex border-b border-forest/10"><button type="button" onClick={() => setMode("login")} className={`flex-1 pb-3 text-sm ${mode === "login" ? "border-b-2 border-forest text-forest" : "text-forest/45"}`}>ورود</button><button type="button" onClick={() => setMode("register")} className={`flex-1 pb-3 text-sm ${mode === "register" ? "border-b-2 border-forest text-forest" : "text-forest/45"}`}>ساخت حساب</button></div><form onSubmit={submitAuthentication} className="mt-7 space-y-5">{mode === "register" ? <><ProfileField label="نام و نام خانوادگی" value={credentials.name} onChange={(value) => setCredentials((current) => ({ ...current, name: value }))} /><ProfileField label="ایمیل (اختیاری)" value={credentials.email} onChange={(value) => setCredentials((current) => ({ ...current, email: value }))} dir="ltr" /><ProfileField label="شهر (اختیاری)" value={credentials.city} onChange={(value) => setCredentials((current) => ({ ...current, city: value }))} /></> : null}<ProfileField label="شماره موبایل" value={credentials.phone} onChange={(value) => setCredentials((current) => ({ ...current, phone: value }))} dir="ltr" /><ProfileField label="رمز عبور" value={credentials.password} onChange={(value) => setCredentials((current) => ({ ...current, password: value }))} type="password" dir="ltr" /><button disabled={saving} className="w-full min-h-12 rounded-full bg-forest px-6 text-sm text-paper disabled:opacity-50">{saving ? "در حال انجام…" : mode === "login" ? "ورود به حساب" : "ساخت حساب کاربری"}</button></form></div>}
  </Container></section>;
}

function ProfileField({ label, value, onChange, type = "text", disabled = false, dir }: { label: string; value: string; onChange: (value: string) => void; type?: string; disabled?: boolean; dir?: "ltr" | "rtl" }) {
  return <label className="block"><span className="mb-2 block text-xs text-forest/60">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} type={type} disabled={disabled} dir={dir} className="h-12 w-full rounded-xl border border-forest/15 bg-[#faf8f5] px-3 text-sm text-forest outline-none focus:border-forest/40 disabled:cursor-not-allowed disabled:text-forest/45" /></label>;
}
