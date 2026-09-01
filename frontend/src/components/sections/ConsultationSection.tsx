"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { consultationSubjects } from "@/data/contact-forms";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import { FORM_ENABLED } from "@/lib/form-utils";
import { submitLead } from "@/lib/leads-api";

type FieldType = "text" | "tel" | "select" | "textarea";
type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  full?: boolean;
};

const baseFields: Field[] = [
  { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { name: "phone", label: "شماره تماس", type: "tel", required: true },
  {
    name: "interest",
    label: "موضوع درخواست",
    type: "select",
    required: true,
    options: [...consultationSubjects],
  },
  { name: "message", label: "توضیحات", type: "textarea", full: true },
];

type Values = Record<string, string>;
type Errors = Record<string, string>;

export default function ConsultationSection() {
  const [subjects, setSubjects] = useState<string[]>([...consultationSubjects]);
  const fields = useMemo(() => baseFields.map((field) => field.name === "interest" ? { ...field, options: subjects } : field), [subjects]);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchPublicCmsPage<{ consultationSubjects?: string[] }>("contact-forms")
      .then((page) => {
        const values = page?.items?.consultationSubjects;
        if (Array.isArray(values) && values.length) setSubjects(values);
      })
      .catch(() => undefined);
  }, []);

  const setValue = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    for (const f of fields) {
      const val = (values[f.name] ?? "").trim();
      if (f.required && !val) next[f.name] = "این فیلد الزامی است";
      if (f.type === "tel" && val && !/^[0-9\u06F0-\u06F9+\-\s]{7,}$/.test(val)) next[f.name] = "شماره تماس معتبر نیست";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!FORM_ENABLED) return;
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitLead({
        type: "consultation",
        source: "homepage",
        name: values.name.trim(),
        phone: values.phone.trim(),
        data: {
          interest: values.interest,
          message: values.message?.trim() || "",
        },
      });
      setSubmitted(true);
    } catch {
      setSubmitError("ارسال درخواست با خطا مواجه شد. کمی بعد دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="consultation" className="bg-peach py-28 text-forest md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeUp as="p" className="eyebrow text-brick">
              مشاوره
            </FadeUp>
            <FadeUp
              as="h2"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tightest"
            >
              بیایید خانه‌ای که دوستش دارید را بسازیم.
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-6 max-w-md text-lg leading-relaxed text-forest/70">
              برای مشاوره فرم زیر را تکمیل کنید؛ یا برای ثبت سفارش طراحی داخلی، فرم هوشمند را
              شروع کنید تا سلیقه و جزئیات فنی فضای خود را با تیم معماری داخلی به اشتراک بگذارید.
            </FadeUp>
            <FadeUp delay={0.14} className="mt-10 flex flex-wrap gap-4">
              <Button href="/interior-architecture-services/order" variant="primary" showArrow>
                شروع فرم سفارش طراحی
              </Button>
              <Button href="/interior-architecture-services" variant="secondary">
                بیشتر درباره خدمات
              </Button>
            </FadeUp>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            {submitted ? (
              <FadeUp className="flex min-h-[20rem] flex-col items-start justify-center">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-peach">✓</div>
                <h3 className="text-3xl font-light tracking-tightest">درخواست شما ثبت شد</h3>
                <p className="mt-3 max-w-md text-forest/70">
                  سپاس از اعتماد شما. به‌زودی برای هماهنگی جلسه‌ی مشاوره با شما تماس می‌گیریم.
                </p>
              </FadeUp>
            ) : (
              <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.name} className={cn("flex flex-col", f.full && "md:col-span-2")}>
                    <label htmlFor={f.name} className="mb-2 text-sm text-forest/70">
                      {f.label}
                      {f.required && <span className="text-brick"> *</span>}
                    </label>

                    {f.type === "textarea" ? (
                      <textarea id={f.name} rows={4} value={values[f.name] ?? ""} onChange={(e) => setValue(f.name, e.target.value)} className={fieldClass(!!errors[f.name])} />
                    ) : f.type === "select" ? (
                      <select id={f.name} value={values[f.name] ?? ""} onChange={(e) => setValue(f.name, e.target.value)} className={fieldClass(!!errors[f.name])}>
                        <option value="">انتخاب کنید</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={f.name}
                        type={f.type}
                        dir={f.type === "tel" ? "ltr" : "rtl"}
                        value={values[f.name] ?? ""}
                        onChange={(e) => setValue(f.name, e.target.value)}
                        className={cn(fieldClass(!!errors[f.name]), f.type === "tel" && "text-right")}
                      />
                    )}

                    {errors[f.name] && <span className="mt-1.5 text-xs text-brick">{errors[f.name]}</span>}
                  </div>
                ))}

                <div className="md:col-span-2">
                  {FORM_ENABLED ? (
                    <div className="flex flex-col gap-3">
                      <Button as="button" type="submit" variant="primary" showArrow>
                        {submitting ? "در حال ارسال…" : "ارسال درخواست"}
                      </Button>
                      {submitError ? <p className="text-sm text-brick">{submitError}</p> : null}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <span className="pointer-events-none inline-block opacity-50" aria-disabled="true">
                        <Button as="button" type="submit" variant="primary" showArrow>
                          ارسال درخواست
                        </Button>
                      </span>
                      <p className="text-sm text-forest/70">ارسال فرم موقتاً غیرفعال است و به‌زودی فعال می‌شود.</p>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "w-full border-b bg-transparent py-3 text-forest placeholder:text-forest/55 transition-colors focus:outline-none",
    hasError ? "border-brick" : "border-forest/25 focus:border-forest"
  );
}
