"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { useCart } from "@/components/commerce/cart/CartProvider";
import { formatMoney } from "@/lib/commerce";
import { cn, toFa } from "@/lib/utils";
import { required, validateEmail, validatePhone } from "@/lib/form-utils";

type Step = 1 | 2 | 3;
type PaymentMethod = "coordination" | "online";

type CheckoutData = {
  fullName: string;
  phone: string;
  email: string;
  createAccount: boolean;
  password: string;
  confirmPassword: string;
  province: string;
  city: string;
  postalCode: string;
  address: string;
  deliveryNote: string;
  paymentMethod: PaymentMethod;
  acceptedTerms: boolean;
};

const initialData: CheckoutData = {
  fullName: "",
  phone: "",
  email: "",
  createAccount: false,
  password: "",
  confirmPassword: "",
  province: "",
  city: "",
  postalCode: "",
  address: "",
  deliveryNote: "",
  paymentMethod: "coordination",
  acceptedTerms: false,
};

const provinces = [
  "تهران",
  "البرز",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "گیلان",
  "مازندران",
  "خوزستان",
  "سایر استان‌ها",
];

export default function CheckoutFlow() {
  const { items, itemCount, subtotal, hydrated, clearCart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<CheckoutData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ number: string; total: number } | null>(null);
  const currency = items.find((item) => item.currencySymbol)?.currencySymbol || "تومان";

  const update = <Key extends keyof CheckoutData>(key: Key, value: CheckoutData[Key]) => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validateCustomer = () => {
    const next: Record<string, string> = {};
    if (!required(data.fullName)) next.fullName = "نام و نام خانوادگی را وارد کنید.";
    if (!validatePhone(data.phone)) next.phone = "شماره موبایل معتبر وارد کنید.";
    if (!validateEmail(data.email)) next.email = "ایمیل معتبر وارد کنید.";
    if (data.createAccount && data.password.length < 8) next.password = "رمز عبور باید حداقل ۸ کاراکتر باشد.";
    if (data.createAccount && data.confirmPassword !== data.password) next.confirmPassword = "تکرار رمز عبور یکسان نیست.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateAddress = () => {
    const next: Record<string, string> = {};
    if (!required(data.province)) next.province = "استان را انتخاب کنید.";
    if (!required(data.city)) next.city = "شهر را وارد کنید.";
    if (!required(data.address) || data.address.trim().length < 10) next.address = "نشانی کامل تحویل را وارد کنید.";
    if (!/^[0-9۰-۹]{10}$/.test(data.postalCode.replace(/\s/g, ""))) next.postalCode = "کد پستی باید ۱۰ رقم باشد.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    const valid = step === 1 ? validateCustomer() : validateAddress();
    if (!valid) return;
    setStep((step + 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setErrors({});
    setStep((step - 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const finishOrder = async () => {
    if (!data.acceptedTerms) {
      setErrors({ acceptedTerms: "برای ثبت سفارش، شرایط خرید را تأیید کنید." });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    const orderNumber = `CH-${String(Date.now()).slice(-7)}`;
    const orderSnapshot = {
      number: orderNumber,
      total: subtotal,
      itemCount,
      createdAt: new Date().toISOString(),
      mode: "frontend-preview",
    };
    window.localStorage.setItem("choobohonar:last-order-preview", JSON.stringify(orderSnapshot));
    setCompletedOrder({ number: orderNumber, total: subtotal });
    clearCart();
    setSubmitting(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!hydrated) {
    return <div className="min-h-[80svh] bg-paper pt-36" aria-busy="true" />;
  }

  if (completedOrder) {
    return (
      <section className="flex min-h-[88svh] items-center bg-forest pb-24 pt-36 text-paper">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-peach/50 bg-peach text-3xl text-forest">✓</span>
            <p className="eyebrow mt-9 text-peach">Order Preview Complete</p>
            <h1 className="mt-6 text-[clamp(3.4rem,8vw,7.5rem)] font-extralight leading-[0.86] tracking-tightest">
              سفارش شما آماده ثبت نهایی‌ست
            </h1>
            <p className="mx-auto mt-7 max-w-xl text-base leading-8 text-paper/65">
              کد پیش‌نمایش سفارش <span dir="ltr" className="font-medium text-peach">{completedOrder.number}</span> ایجاد شد. پس از اتصال API بک‌اند، همین مرحله سفارش را در سیستم ثبت و به درگاه پرداخت هدایت می‌کند.
            </p>
            <div className="mx-auto mt-8 flex max-w-md items-center justify-between border-y border-paper/15 py-5 text-sm">
              <span className="text-paper/50">مبلغ محصولات</span>
              <span>{formatMoney(completedOrder.total, currency)}</span>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="inline-flex min-h-14 items-center justify-center rounded-full bg-peach px-8 text-sm font-medium text-forest transition-colors hover:bg-paper">
                بازگشت به فروشگاه
              </Link>
              <Link href="/contact/consultation" className="inline-flex min-h-14 items-center justify-center rounded-full border border-paper/25 px-8 text-sm text-paper transition-colors hover:border-paper">
                گفت‌وگو با کارشناس
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  if (!items.length) {
    return (
      <section className="flex min-h-[80svh] items-center bg-paper pb-24 pt-36">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-brick">Checkout</p>
            <h1 className="mt-5 text-5xl font-extralight text-forest md:text-7xl">محصولی برای تکمیل خرید نیست</h1>
            <Link href="/products" className="mt-9 inline-flex min-h-14 items-center rounded-full bg-forest px-8 text-sm font-medium text-paper">
              انتخاب محصول
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-[88svh] bg-paper pb-28 pt-32 md:pb-36 md:pt-40">
      <Container>
        <header className="grid gap-8 border-b border-forest/10 pb-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow text-brick">Secure Checkout / Preview</p>
            <h1 className="mt-5 text-[clamp(3.2rem,7vw,6.7rem)] font-extralight leading-none tracking-tightest text-forest">
              تکمیل خرید
            </h1>
          </div>
          <ol className="grid grid-cols-3 gap-2" aria-label="مراحل تکمیل خرید">
            <StepIndicator number={1} label="اطلاعات شما" current={step} />
            <StepIndicator number={2} label="تحویل" current={step} />
            <StepIndicator number={3} label="بازبینی" current={step} />
          </ol>
        </header>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start xl:gap-24">
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              if (step < 3) goNext();
              else void finishOrder();
            }}
          >
            {step === 1 ? (
              <div>
                <SectionHeading index="01" title="اطلاعات تماس و حساب کاربری" description="اطلاعاتی که برای هماهنگی سفارش، زمان تحویل و پیگیری خرید استفاده می‌شود." />
                <div className="mt-10 grid gap-x-7 gap-y-8 md:grid-cols-2">
                  <Field label="نام و نام خانوادگی" error={errors.fullName} className="md:col-span-2">
                    <input value={data.fullName} onChange={(e) => update("fullName", e.target.value)} autoComplete="name" className={inputClass(errors.fullName)} placeholder="مثلاً سارا احمدی" />
                  </Field>
                  <Field label="شماره موبایل" error={errors.phone}>
                    <input value={data.phone} onChange={(e) => update("phone", e.target.value)} inputMode="tel" autoComplete="tel" dir="ltr" className={inputClass(errors.phone)} placeholder="0912 000 0000" />
                  </Field>
                  <Field label="ایمیل" error={errors.email}>
                    <input value={data.email} onChange={(e) => update("email", e.target.value)} type="email" autoComplete="email" dir="ltr" className={inputClass(errors.email)} placeholder="name@example.com" />
                  </Field>
                </div>

                <label className="mt-10 flex cursor-pointer items-start gap-4 border-y border-forest/10 py-6">
                  <input type="checkbox" checked={data.createAccount} onChange={(e) => update("createAccount", e.target.checked)} className="mt-1 h-4 w-4 accent-forest" />
                  <span>
                    <span className="block text-sm font-medium text-forest">ساخت حساب کاربری با همین اطلاعات</span>
                    <span className="mt-1 block text-xs leading-6 text-forest/50">برای مشاهده سفارش‌ها، ذخیره نشانی و خرید سریع‌تر در دفعات بعد.</span>
                  </span>
                </label>

                {data.createAccount ? (
                  <div className="mt-7 grid gap-7 md:grid-cols-2">
                    <Field label="رمز عبور حساب" error={errors.password}>
                      <input value={data.password} onChange={(e) => update("password", e.target.value)} type="password" autoComplete="new-password" dir="ltr" className={inputClass(errors.password)} placeholder="حداقل ۸ کاراکتر" />
                    </Field>
                    <Field label="تکرار رمز عبور" error={errors.confirmPassword}>
                      <input value={data.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} type="password" autoComplete="new-password" dir="ltr" className={inputClass(errors.confirmPassword)} placeholder="رمز عبور را دوباره وارد کنید" />
                    </Field>
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <SectionHeading index="02" title="نشانی و شیوه تحویل" description="تیم ارسال تخصصی بر اساس شهر، طبقه و ابعاد محصول، هماهنگی نهایی را انجام می‌دهد." />
                <div className="mt-10 grid gap-x-7 gap-y-8 md:grid-cols-2">
                  <Field label="استان" error={errors.province}>
                    <select value={data.province} onChange={(e) => update("province", e.target.value)} className={inputClass(errors.province)}>
                      <option value="">انتخاب استان</option>
                      {provinces.map((province) => <option key={province} value={province}>{province}</option>)}
                    </select>
                  </Field>
                  <Field label="شهر" error={errors.city}>
                    <input value={data.city} onChange={(e) => update("city", e.target.value)} autoComplete="address-level2" className={inputClass(errors.city)} placeholder="نام شهر" />
                  </Field>
                  <Field label="نشانی کامل" error={errors.address} className="md:col-span-2">
                    <textarea value={data.address} onChange={(e) => update("address", e.target.value)} autoComplete="street-address" rows={4} className={cn(inputClass(errors.address), "resize-none leading-7")} placeholder="خیابان، کوچه، پلاک، واحد و طبقه" />
                  </Field>
                  <Field label="کد پستی" error={errors.postalCode}>
                    <input value={data.postalCode} onChange={(e) => update("postalCode", e.target.value)} inputMode="numeric" autoComplete="postal-code" dir="ltr" maxLength={10} className={inputClass(errors.postalCode)} placeholder="۱۰ رقم بدون خط تیره" />
                  </Field>
                  <Field label="توضیحات تحویل — اختیاری">
                    <input value={data.deliveryNote} onChange={(e) => update("deliveryNote", e.target.value)} className={inputClass()} placeholder="محدودیت آسانسور یا ساعت مناسب" />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <SectionHeading index="03" title="بازبینی و روش پرداخت" description="پیش از ثبت، اطلاعات تماس، نشانی و محصولات انتخاب‌شده را یک‌بار مرور کنید." />

                <div className="mt-10 grid gap-px bg-forest/10 md:grid-cols-2">
                  <ReviewBlock title="اطلاعات مشتری" onEdit={() => setStep(1)}>
                    <p>{data.fullName}</p>
                    <p dir="ltr" className="text-right">{data.phone}</p>
                    <p dir="ltr" className="break-all text-right">{data.email}</p>
                    {data.createAccount ? <p className="mt-2 text-brick">حساب کاربری ساخته می‌شود</p> : null}
                  </ReviewBlock>
                  <ReviewBlock title="نشانی تحویل" onEdit={() => setStep(2)}>
                    <p>{data.province}، {data.city}</p>
                    <p>{data.address}</p>
                    <p>کد پستی: <span dir="ltr">{data.postalCode}</span></p>
                  </ReviewBlock>
                </div>

                <fieldset className="mt-10">
                  <legend className="text-sm font-medium text-forest">روش پرداخت</legend>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <PaymentOption
                      checked={data.paymentMethod === "coordination"}
                      onChange={() => update("paymentMethod", "coordination")}
                      title="ثبت سفارش و هماهنگی پرداخت"
                      description="مناسب محصولات سفارشی؛ کارشناس زمان ساخت و مبلغ نهایی را تأیید می‌کند."
                    />
                    <PaymentOption
                      checked={data.paymentMethod === "online"}
                      onChange={() => update("paymentMethod", "online")}
                      title="پرداخت آنلاین"
                      description="رابط کاربری آماده است و پس از اتصال API به درگاه هدایت می‌شود."
                      badge="در انتظار بک‌اند"
                    />
                  </div>
                </fieldset>

                <label className={cn("mt-8 flex cursor-pointer items-start gap-4 border p-5", errors.acceptedTerms ? "border-brick bg-brick/5" : "border-forest/15")}>
                  <input type="checkbox" checked={data.acceptedTerms} onChange={(e) => update("acceptedTerms", e.target.checked)} className="mt-1 h-4 w-4 accent-forest" />
                  <span className="text-sm leading-7 text-forest/65">
                    مشخصات محصولات، نشانی تحویل و شرایط هماهنگی ساخت و ارسال را بررسی کرده‌ام.
                    {errors.acceptedTerms ? <span className="block text-xs text-brick">{errors.acceptedTerms}</span> : null}
                  </span>
                </label>
              </div>
            ) : null}

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-forest/10 pt-7">
              {step > 1 ? (
                <button type="button" onClick={goBack} className="inline-flex min-h-12 items-center gap-2 px-2 text-sm text-forest/55 transition-colors hover:text-forest">→ مرحله قبل</button>
              ) : <span />}
              <button
                type="submit"
                disabled={submitting || (step === 3 && data.paymentMethod === "online")}
                className="inline-flex min-h-14 min-w-48 items-center justify-center gap-3 rounded-full bg-forest px-8 text-sm font-medium text-paper transition-all hover:bg-brick disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? "در حال ثبت..." : step === 1 ? "ادامه به نشانی" : step === 2 ? "بازبینی سفارش" : data.paymentMethod === "online" ? "در انتظار اتصال درگاه" : "ثبت پیش‌سفارش"}
                {!submitting ? <span>←</span> : null}
              </button>
            </div>
          </form>

          <aside className="lg:sticky lg:top-28">
            <div className="border border-forest/10 bg-white/45 p-6 md:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-forest/10 pb-5">
                <h2 className="text-lg font-medium text-forest">خلاصه سفارش</h2>
                <Link href="/cart" className="text-xs text-brick hover:text-forest">ویرایش سبد</Link>
              </div>
              <div className="no-scrollbar max-h-[24rem] divide-y divide-forest/10 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.key} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-forest/5">
                      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      <span className="absolute left-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest px-1 text-[10px] text-paper">{toFa(item.quantity)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-forest">{item.name}</p>
                      <p className="mt-1 truncate text-xs text-forest/45">{item.options.map((option) => option.value).join("، ") || item.category}</p>
                      <p className="mt-3 text-xs text-forest/70">{item.unitPrice !== null ? formatMoney(item.unitPrice * item.quantity, item.currencySymbol) : "استعلام قیمت"}</p>
                    </div>
                  </div>
                ))}
              </div>
              <dl className="border-t border-forest/10 pt-5 text-sm">
                <div className="flex justify-between gap-4 text-forest/50"><dt>ارسال تخصصی</dt><dd>پس از بررسی نشانی</dd></div>
                <div className="mt-5 flex items-end justify-between gap-4 border-t border-forest/10 pt-5"><dt className="text-forest/55">جمع محصولات</dt><dd className="text-xl font-light text-forest">{formatMoney(subtotal, currency)}</dd></div>
              </dl>
            </div>
            <div className="mt-4 bg-peach/30 p-5 text-xs leading-6 text-forest/60">
              <span className="font-medium text-brick">نسخه پیش‌نمایش فرانت:</span> اطلاعات این فرم به سرویس خارجی ارسال نمی‌شود. قرارداد ثبت سفارش برای اتصال بک‌اند آماده خواهد شد.
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}

function StepIndicator({ number, label, current }: { number: Step; label: string; current: Step }) {
  const active = current === number;
  const done = current > number;
  return (
    <li className={cn("min-w-24 border-t pt-3 text-xs transition-colors", active ? "border-brick text-forest" : done ? "border-forest text-forest" : "border-forest/15 text-forest/35")}>
      <span className="block font-display text-base">{done ? "✓" : `0${toFa(number)}`}</span>
      <span className="mt-1 block">{label}</span>
    </li>
  );
}

function SectionHeading({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-[4rem_1fr]">
      <span className="font-display text-xl text-brick">{index}</span>
      <div>
        <h2 className="text-3xl font-light tracking-tight text-forest md:text-4xl">{title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-forest/55">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-medium text-forest/65">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-brick">{error}</span> : null}
    </label>
  );
}

function inputClass(error?: string) {
  return cn(
    "min-h-12 w-full border-b bg-transparent py-3 text-sm text-forest outline-none transition-colors placeholder:text-forest/30",
    error ? "border-brick" : "border-forest/20 focus:border-forest",
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div className="bg-paper p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-forest">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs text-brick hover:text-forest">ویرایش</button>
      </div>
      <div className="mt-4 space-y-1 text-sm leading-7 text-forest/55">{children}</div>
    </div>
  );
}

function PaymentOption({ checked, onChange, title, description, badge }: { checked: boolean; onChange: () => void; title: string; description: string; badge?: string }) {
  return (
    <label className={cn("relative cursor-pointer border p-5 transition-colors", checked ? "border-forest bg-forest text-paper" : "border-forest/15 text-forest hover:border-forest/35")}>
      <input type="radio" name="payment" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex items-start justify-between gap-4">
        <span>
          <span className="block text-sm font-medium">{title}</span>
          <span className={cn("mt-2 block text-xs leading-6", checked ? "text-paper/60" : "text-forest/50")}>{description}</span>
        </span>
        <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border", checked ? "border-peach" : "border-forest/25")}>
          {checked ? <span className="h-2 w-2 rounded-full bg-peach" /> : null}
        </span>
      </span>
      {badge ? <span className={cn("mt-4 inline-flex rounded-full px-3 py-1 text-[10px]", checked ? "bg-paper/10 text-peach" : "bg-forest/5 text-forest/45")}>{badge}</span> : null}
    </label>
  );
}
