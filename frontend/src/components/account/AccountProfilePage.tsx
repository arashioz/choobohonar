"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { formatMoney } from "@/lib/commerce";
import { cn, toFa } from "@/lib/utils";
import { isUploadedMedia } from "@/lib/media";
import GalleryTasteEditor from "@/components/account/GalleryTasteEditor";
import { clearTasteState } from "@/lib/gallery-taste";

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  createdAt?: string;
  galleryTaste?: Record<string, string> | null;
};

type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  kind?: "online" | "proforma";
  items: { name: string; qty: number; image?: string }[];
  amounts: { total: number };
  payment?: { status?: string };
  createdAt?: string;
  proformaId?: string;
  invoiceId?: string;
};

type ProfilePayload = { customer: Customer; orders: Order[] };
type CommerceTab = "online" | "proforma";

const statusLabel: Record<string, string> = {
  pending: "در انتظار بررسی",
  confirmed: "تأیید شده",
  paid: "پرداخت شده",
  preparing: "در حال آماده‌سازی",
  shipping: "ارسال شده",
  delivered: "تحویل شده",
  cancelled: "لغو شده",
};

const isLocal = process.env.NODE_ENV === "development";

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
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [commerceTab, setCommerceTab] = useState<CommerceTab>("online");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    password: "",
  });
  const loadGeneration = useRef(0);

  async function loadProfile() {
    const generation = ++loadGeneration.current;
    setLoading(true);
    try {
      const next = await request<ProfilePayload>("/me");
      if (generation !== loadGeneration.current) return;
      applyProfile(next);
    } catch {
      if (generation !== loadGeneration.current) return;
      setProfile(null);
    } finally {
      if (generation === loadGeneration.current) setLoading(false);
    }
  }

  function applyProfile(next: ProfilePayload) {
    setProfile(next);
    setCredentials({
      name: next.customer.name,
      phone: next.customer.phone,
      email: next.customer.email || "",
      city: next.customer.city || "",
      password: "",
    });
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  const onlineOrders = useMemo(
    () => (profile?.orders || []).filter((order) => order.kind === "online"),
    [profile],
  );
  const proformas = useMemo(
    () => (profile?.orders || []).filter((order) => order.kind !== "online"),
    [profile],
  );
  const visibleOrders = commerceTab === "online" ? onlineOrders : proformas;

  async function submitAuthentication(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      if (!otpRequested) {
        await request<{ ok: true }>("/otp/request", {
          method: "POST",
          body: JSON.stringify({ phone: credentials.phone }),
        });
        setOtpRequested(true);
        setMessage("کد ورود برای شماره شما ارسال شد.");
      } else {
        await request<{ customer: Customer }>("/otp/verify", {
          method: "POST",
          body: JSON.stringify({ phone: credentials.phone, code: otpCode }),
        });
        await loadProfile();
        setMessage("خوش آمدید.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const customer = await request<Customer>("/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: credentials.name,
          email: credentials.email,
          city: credentials.city,
        }),
      });
      setProfile((current) => (current ? { ...current, customer } : current));
      setMessage("اطلاعات پروفایل ذخیره شد.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره اطلاعات ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    loadGeneration.current += 1;
    setProfile(null);
    setLoading(false);
    setMessage("از حساب کاربری خارج شدید.");
    setError("");
    setCredentials({ name: "", phone: "", email: "", city: "", password: "" });
    setOtpRequested(false);
    setOtpCode("");
    await request<{ ok: true }>("/logout", { method: "POST" }).catch(() => undefined);
    clearTasteState();
  }

  async function localTestLogin() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await request<{ customer: Customer }>("/dev-login", { method: "POST" });
      const next = await request<ProfilePayload>("/me");
      applyProfile(next);
      setMessage("با حساب آزمایشی bezivafaei وارد شدید.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ورود آزمایشی انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="min-h-[88svh] bg-paper pb-24 pt-36">
        <Container>
          <div className="h-16 w-64 animate-pulse bg-forest/5" />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="h-80 animate-pulse bg-forest/5" />
            <div className="h-80 animate-pulse bg-forest/5" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-[88svh] bg-paper pb-28 pt-32 md:pb-36 md:pt-40">
      <Container>
        <header className="grid gap-6 border-b border-forest/10 pb-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow text-brick">My Account</p>
            <h1 className="mt-5 text-[clamp(3.2rem,7vw,7rem)] font-extralight leading-[0.86] tracking-tightest text-forest">
              {profile ? `سلام، ${profile.customer.name}` : "حساب کاربری"}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-forest/55">
              {profile
                ? "اطلاعات شخصی، سفارش‌های آنلاین و پیش‌فاکتورهای شما در یک جا."
                : "برای پیگیری سفارش‌ها، پیش‌فاکتورها و ذخیره نشانی، وارد حساب شوید یا حساب بسازید."}
            </p>
          </div>
          {profile ? (
            <button type="button" onClick={() => void logout()} className="text-sm text-forest/50 underline decoration-forest/20 underline-offset-4 hover:text-brick">
              خروج از حساب
            </button>
          ) : null}
        </header>

        {message ? <p className="mt-6 border border-sage/40 bg-sage/20 px-4 py-3 text-sm text-forest">{message}</p> : null}
        {error ? <p className="mt-6 border border-brick/20 bg-brick/[0.06] px-4 py-3 text-sm text-brick">{error}</p> : null}

        {profile ? (
          <>
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start xl:gap-20">
            <aside className="space-y-8">
              <form onSubmit={saveProfile} className="border border-forest/10 bg-white/50 p-6 md:p-8">
                <h2 className="text-2xl font-light tracking-tight text-forest">اطلاعات شما</h2>
                <p className="mt-2 text-xs leading-6 text-forest/50">شماره موبایل شناسه حساب است و تغییر نمی‌کند.</p>
                <div className="mt-8 grid gap-6">
                  <ProfileField label="نام و نام خانوادگی" value={credentials.name} onChange={(value) => setCredentials((current) => ({ ...current, name: value }))} />
                  <ProfileField label="شماره موبایل" value={credentials.phone} disabled onChange={() => undefined} dir="ltr" />
                  <ProfileField label="ایمیل — اختیاری" value={credentials.email} onChange={(value) => setCredentials((current) => ({ ...current, email: value }))} dir="ltr" />
                  <ProfileField label="شهر" value={credentials.city} onChange={(value) => setCredentials((current) => ({ ...current, city: value }))} />
                  <button disabled={saving} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm text-paper transition-colors hover:bg-brick disabled:opacity-50">
                    {saving ? "در حال ذخیره…" : "ذخیره اطلاعات"}
                  </button>
                </div>
              </form>

            </aside>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-forest/10 pb-6">
                <div>
                  <h2 className="text-3xl font-light tracking-tight text-forest md:text-4xl">تاریخچه خرید</h2>
                </div>
                <div className="flex gap-2">
                  <TabChip active={commerceTab === "online"} onClick={() => setCommerceTab("online")} label={`سفارشات آنلاین (${toFa(onlineOrders.length)})`} />
                  <TabChip active={commerceTab === "proforma"} onClick={() => setCommerceTab("proforma")} label={`پیش‌فاکتورها (${toFa(proformas.length)})`} />
                </div>
              </div>

              {visibleOrders.length ? (
                <div className="divide-y divide-forest/10">
                  {visibleOrders.map((order) => (
                    <article key={order._id} className="grid gap-5 py-8 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
                      <div className="relative hidden aspect-square overflow-hidden bg-forest/[0.045] sm:block">
                        {order.items[0]?.image ? (
                          <Image src={order.items[0].image} alt="" fill unoptimized={isUploadedMedia(order.items[0].image)} sizes="88px" className="object-cover" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-forest/30">CH</span>
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-forest" dir="ltr">{order.orderNumber}</p>
                            <p className="mt-1 text-xs text-forest/45">
                              {order.createdAt ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(order.createdAt)) : ""}
                            </p>
                          </div>
                          <span className="rounded-full bg-forest/[0.06] px-3 py-1.5 text-xs text-forest">
                            {statusLabel[order.status] || order.status}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-forest/65">
                          {order.items.map((item) => `${item.name} × ${toFa(item.qty)}`).join("، ")}
                        </p>
                        <p className="mt-3 text-sm text-forest">{formatMoney(order.amounts.total || 0, "تومان")}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-10 border border-dashed border-forest/15 px-6 py-16 text-center">
                  <p className="text-2xl font-light text-forest">
                    {commerceTab === "online" ? "سفارش آنلاینی ثبت نشده است" : "پیش‌فاکتوری ثبت نشده است"}
                  </p>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-forest/50">
                    {commerceTab === "online"
                      ? "پس از فعال شدن پرداخت آنلاین، سفارش‌های پرداخت‌شده اینجا دیده می‌شوند."
                      : "از سبد خرید می‌توانید پیش‌فاکتور ثبت کنید تا کارشناس مبلغ و زمان ساخت را هماهنگ کند."}
                  </p>
                  <Link href="/products" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full border border-forest/20 px-6 text-sm text-forest hover:bg-forest hover:text-paper">
                    ورود به محصولات ←
                  </Link>
                </div>
              )}

              <div className="mt-14 border-t border-forest/10 pt-10">
                <h2 className="text-2xl font-light tracking-tight text-forest">دسترسی سریع</h2>
                <div className="mt-6 divide-y divide-forest/10 border-y border-forest/10">
                  <QuickLink href="/gallery" label="گالری شخصی" note="فید بر اساس سلیقه شما" />
                  <QuickLink href="/products" label="فروشگاه محصولات" note="ادامه انتخاب برای خانه" />
                  <QuickLink href="/cart" label="سبد خرید" note="مرور اقلام ذخیره‌شده" />
                  <QuickLink href="/checkout" label="ثبت پیش‌فاکتور" note="هماهنگی ساخت و پرداخت" />
                  <QuickLink href="/contact/consultation" label="مشاوره حضوری" note="هماهنگی با کارشناس" />
                </div>
              </div>
            </div>
          </div>
          <GalleryTasteEditor
            initial={profile.customer.galleryTaste}
            onSaved={(answers) => {
              setProfile((current) =>
                current
                  ? { ...current, customer: { ...current.customer, galleryTaste: answers } }
                  : current,
              );
            }}
            save={async (answers) => {
              const customer = await request<Customer>("/me", {
                method: "PATCH",
                body: JSON.stringify({ galleryTaste: answers }),
              });
              setProfile((current) => (current ? { ...current, customer } : current));
            }}
          />
          </>
        ) : (
          <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <form onSubmit={submitAuthentication} className="max-w-xl">
              <div className="border-b border-forest/10 pb-4">
                <p className="text-sm text-forest">ورود یا ساخت حساب با پیامک</p>
                <p className="mt-2 text-xs leading-6 text-forest/45">شماره موبایل شما شناسه حساب است. برای ورود، یک کد یک‌بارمصرف ارسال می‌کنیم.</p>
              </div>
              <div className="mt-10 grid gap-7">
                <ProfileField label="شماره موبایل" value={credentials.phone} onChange={(value) => setCredentials((current) => ({ ...current, phone: value }))} disabled={otpRequested} dir="ltr" />
                {otpRequested ? <ProfileField label="کد ۶ رقمی پیامک‌شده" value={otpCode} onChange={setOtpCode} dir="ltr" /> : null}
                <button disabled={saving} className="inline-flex min-h-14 items-center justify-center rounded-full bg-forest px-8 text-sm font-medium text-paper transition-colors hover:bg-brick disabled:opacity-50">
                  {saving ? "در حال انجام…" : otpRequested ? "تأیید و ورود به حساب" : "ارسال کد ورود"}
                </button>
                {otpRequested ? <button type="button" onClick={() => { setOtpRequested(false); setOtpCode(""); setMessage(""); }} className="text-sm text-forest/50 underline decoration-forest/20 underline-offset-4 hover:text-forest">تغییر شماره موبایل</button> : null}
                {isLocal ? (
                  <button type="button" disabled={saving} onClick={() => void localTestLogin()} className="text-sm text-forest/50 underline decoration-forest/20 underline-offset-4 hover:text-forest">
                    ورود آزمایشی bezivafaei
                  </button>
                ) : null}
              </div>
            </form>
            <aside className="border-r border-forest/10 pr-6">
              <p className="eyebrow text-brick">Why an account</p>
              <h2 className="mt-4 text-3xl font-light tracking-tight text-forest">یک خانه، یک پرونده</h2>
              <p className="mt-5 text-sm leading-7 text-forest/55">
                سفارش‌های آنلاین، پیش‌فاکتورهای سفارشی و نشانی تحویل کنار هم می‌مانند تا هماهنگی ساخت و ارسال دقیق‌تر شود.
              </p>
            </aside>
          </div>
        )}
      </Container>
    </section>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  dir,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-forest/65">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        disabled={disabled}
        dir={dir}
        className={cn(
          "min-h-12 w-full border-b bg-transparent py-3 text-sm text-forest outline-none transition-colors placeholder:text-forest/30",
          disabled ? "border-forest/10 text-forest/45" : "border-forest/20 focus:border-forest",
        )}
      />
    </label>
  );
}

function TabChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-full px-4 py-2 text-xs transition-colors", active ? "bg-forest text-paper" : "border border-forest/15 text-forest/55 hover:border-forest/35")}
    >
      {label}
    </button>
  );
}

function QuickLink({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between gap-4 py-4">
      <span>
        <span className="block text-sm text-forest">{label}</span>
        <span className="mt-1 block text-xs text-forest/40">{note}</span>
      </span>
      <span className="text-forest/25 transition-transform group-hover:-translate-x-1">←</span>
    </Link>
  );
}
