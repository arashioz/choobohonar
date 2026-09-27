"use client";

import { useState } from "react";
import Link from "next/link";
import BrandMark from "@/components/brand/BrandMark";
import CooperationForm from "@/components/contact/CooperationForm";
import { FORM_ENABLED, fieldClass, validatePhone } from "@/lib/form-utils";
import { submitLead } from "@/lib/leads-api";
import { cn } from "@/lib/utils";

const ADDRESS = "شهرک صنعتی پرند، میدان کارگر، بلوار خزر جنوبی، خیابان پونه، پلاک ۵";
const PHONE = "021-54169";
const LINKEDIN = "https://www.linkedin.com/company/choobohonar";
const INSTAGRAM = "https://instagram.com/choobohonar";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 9.5H3.7V20h2.8V9.5ZM5.1 4.2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.3 20h-2.8v-5.6c0-1.6-.6-2.6-2-2.6-1.1 0-1.7.7-2 1.4-.1.2-.1.6-.1.9V20h-2.8s.04-9.3 0-10.5h2.8v1.7c.4-.6 1.1-1.5 2.8-1.5 2 0 3.6 1.3 3.6 4.2V20Z" />
    </svg>
  );
}

export default function ExperienceFooter() {
  const [kind, setKind] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const onKind = (value: string) => {
    setKind(value);
    setErrors({});
    setSubmitError("");
    setSubmitted(false);
  };

  const onSubmitInfo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!FORM_ENABLED || submitting) return;
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "نام را کامل بنویسید";
    if (!phone.trim()) next.phone = "این فیلد الزامی است";
    else if (!validatePhone(phone.trim())) next.phone = "شماره تماس معتبر نیست";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitLead({
        type: "contact",
        source: "experience",
        name: name.trim(),
        phone: phone.trim(),
        data: { interest: "ثبت اطلاعات", message: message.trim() },
      });
      setSubmitted(true);
    } catch {
      setSubmitError("ارسال درخواست با خطا مواجه شد. کمی بعد دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-forest text-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
        <div>
          <Link href="/" aria-label="خانه چوب و هنر">
            <BrandMark invert size="footer" className="h-14 w-64" />
          </Link>
          <div className="mt-8 flex items-center gap-3">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
              aria-label="اینستاگرام"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-peach hover:text-peach"
            >
              <InstagramIcon />
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noreferrer"
              aria-label="لینکدین"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 transition-colors hover:border-peach hover:text-peach"
            >
              <LinkedInIcon />
            </a>
          </div>
          <dl className="mt-10 space-y-5 text-sm leading-7 text-paper/75">
            <div>
              <dt className="text-peach">ارتباط با ما</dt>
              <dd>
                <a href="tel:02154169" className="transition-colors hover:text-peach" dir="ltr">
                  {PHONE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-peach">آدرس</dt>
              <dd>{ADDRESS}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-paper px-6 py-8 text-forest md:px-8">
          <p className="eyebrow text-brick">فرم ثبت اطلاعات</p>
          <h2 className="mt-3 text-3xl font-light tracking-tightest">
            {kind === "cooperation" ? "درخواست همکاری" : "ثبت اطلاعات"}
          </h2>
          <label className="mt-8 flex flex-col text-sm text-forest/70">
            نوع درخواست
            <select value={kind} onChange={(e) => onKind(e.target.value)} className={fieldClass(false)}>
              <option value="">انتخاب کنید</option>
              <option value="info">ثبت اطلاعات</option>
              <option value="cooperation">درخواست همکاری</option>
            </select>
          </label>

          {kind === "cooperation" ? (
            <div className="mt-8">
              <CooperationForm />
            </div>
          ) : null}

          {kind === "info" && submitted ? (
            <p className="mt-6 text-forest/70">اطلاعات شما ثبت شد. همکاران خانه چوب و هنر به‌زودی با شما تماس می‌گیرند.</p>
          ) : null}

          {kind === "info" && !submitted ? (
            <form onSubmit={onSubmitInfo} noValidate className="mt-6 grid gap-5">
              <label className="flex flex-col text-sm text-forest/70">
                نام و نام خانوادگی
                <input value={name} onChange={(e) => setName(e.target.value)} className={fieldClass(Boolean(errors.name))} />
                {errors.name ? <span className="mt-1 text-xs text-brick">{errors.name}</span> : null}
              </label>
              <label className="flex flex-col text-sm text-forest/70">
                شماره تماس
                <input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" className={cn(fieldClass(Boolean(errors.phone)), "text-right")} />
                {errors.phone ? <span className="mt-1 text-xs text-brick">{errors.phone}</span> : null}
              </label>
              <label className="flex flex-col text-sm text-forest/70">
                توضیحات
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={fieldClass(false)} />
              </label>
              <button
                type="submit"
                disabled={!FORM_ENABLED || submitting}
                className="mt-2 inline-flex w-fit rounded-full bg-forest px-6 py-3 text-xs tracking-[0.18em] text-paper disabled:opacity-50"
              >
                {submitting ? "در حال ارسال…" : "ارسال درخواست"}
              </button>
              {submitError ? <p className="text-sm text-brick">{submitError}</p> : null}
            </form>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
