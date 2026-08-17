"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) { setError(data.message || "ورود ناموفق بود"); return; }
      router.replace(nextPath.startsWith("/") ? nextPath : "/admin");
      router.refresh();
    } catch { setError("ارتباط با سرور برقرار نشد"); }
    finally { setLoading(false); }
  }

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[minmax(0,1.12fr)_minmax(440px,.88fr)]">
      <section className="relative hidden min-h-screen overflow-hidden bg-forest p-12 text-paper lg:flex lg:flex-col xl:p-16" aria-label="معرفی پنل مدیریت">
        <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-35" aria-hidden />
        <div className="pointer-events-none absolute -left-48 top-1/4 h-[520px] w-[520px] rounded-full bg-teal/30 blur-[100px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-peach/15 blur-[90px]" aria-hidden />
        <header className="relative flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-paper/10"><Image src="/brand/monogram-white.svg" alt="نشان چوب و هنر" width={27} height={32} priority /></span><div><p className="text-sm font-semibold">خانه چوب و هنر</p><p className="mt-0.5 text-[10px] tracking-[0.12em] text-paper/40" dir="ltr">CHOOB O HONAR</p></div></div>
          <span className="rounded-full border border-paper/15 px-3 py-1.5 text-[10px] text-paper/45">سامانه داخلی</span>
        </header>

        <div className="relative my-auto max-w-xl py-16">
          <p className="text-[10px] font-medium tracking-[0.24em] text-peach" dir="ltr">THE BRAND HOUSE</p>
          <h1 className="mt-5 text-5xl font-extralight leading-[1.25] tracking-tightest xl:text-[62px]">همه‌چیز، در امتداد<br />یک هویت واحد.</h1>
          <p className="mt-6 max-w-md text-sm leading-8 text-paper/50">فضایی برای نگهداری برندبوک، ساخت محتوای تازه و مدیریت آثاری که داستان چوب و هنر را روایت می‌کنند.</p>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-3">
            {[{ n: "۰۱", t: "برندبوک" }, { n: "۰۲", t: "محتوا" }, { n: "۰۳", t: "مدیریت آثار" }].map((item) => <div key={item.n} className="rounded-2xl border border-paper/10 bg-paper/[0.045] p-4 backdrop-blur-sm"><span className="text-[10px] text-peach/70">{item.n}</span><p className="mt-5 text-xs text-paper/65">{item.t}</p></div>)}
          </div>
        </div>

        <footer className="relative flex items-center gap-3 text-[10px] text-paper/30"><span className="h-px w-10 bg-peach/40"/><span>فضای مدیریت برند · نسخه ۱.۰</span></footer>
      </section>

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-10 lg:px-12">
        <div className="pointer-events-none absolute inset-0 dashboard-noise opacity-70" aria-hidden />
        <div className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-peach/35 blur-[100px] lg:hidden" aria-hidden />
        <div className="relative w-full max-w-[410px]">
          <div className="mb-12 flex items-center gap-3 lg:hidden"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-forest"><Image src="/brand/monogram-white.svg" alt="نشان چوب و هنر" width={24} height={28} priority /></span><div><p className="text-sm font-semibold text-forest">خانه چوب و هنر</p><p className="mt-0.5 text-[10px] text-forest/40">فضای مدیریت برند</p></div></div>

          <div className="mb-8">
            <p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">WELCOME BACK</p>
            <h2 className="mt-3 text-3xl font-light tracking-tightest text-forest sm:text-[38px]">ورود به پنل</h2>
            <p className="mt-2 text-sm leading-7 text-forest/45">برای ادامه، اطلاعات حساب مدیریت را وارد کنید.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block" htmlFor="login-username"><span className="mb-2 block text-[11px] font-medium text-forest/60">نام کاربری</span><div className="relative"><svg className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/35" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg><input id="login-username" name="username" type="text" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="نام کاربری شما" required className={fieldClass} dir="ltr" /></div></label>

            <label className="block" htmlFor="login-password"><span className="mb-2 block text-[11px] font-medium text-forest/60">رمز عبور</span><div className="relative"><svg className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/35" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="رمز عبور شما" required className={`${fieldClass} pl-12`} dir="ltr" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[10px] text-forest/40 hover:bg-forest/5 hover:text-forest" aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}>{showPassword ? "پنهان" : "نمایش"}</button></div></label>

            {error && <p role="alert" className="rounded-xl border border-brick/15 bg-brick/[0.06] px-4 py-3 text-xs text-brick">{error}</p>}

            <button type="submit" disabled={loading} className={cn("group flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 text-sm font-medium text-paper shadow-lg shadow-forest/10 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-wait disabled:opacity-60", loading && "translate-y-0")}><span>{loading ? "در حال ورود…" : "ورود به فضای مدیریت"}</span>{!loading && <span className="text-peach transition-transform group-hover:-translate-x-1">←</span>}</button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-[10px] text-forest/30"><span className="h-px flex-1 bg-forest/10"/><span>دسترسی فقط برای اعضای مجاز</span><span className="h-px flex-1 bg-forest/10"/></div>
        </div>
      </section>
    </main>
  );
}

const fieldClass = cn("w-full rounded-xl border border-forest/10 bg-white/65 py-3.5 pl-4 pr-11 text-sm text-forest placeholder:text-forest/25 shadow-sm shadow-forest/[0.025]", "transition-all focus:border-forest/35 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest/[0.04]");
