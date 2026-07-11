"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FieldType = "text" | "tel" | "select" | "textarea";
type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  full?: boolean;
};

const fields: Field[] = [
  { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { name: "phone", label: "شماره تماس", type: "tel", required: true },
  {
    name: "interest",
    label: "حوزه مورد علاقه",
    type: "select",
    required: true,
    options: ["مبلمان نشیمن", "سرویس خواب", "دکوراتیو", "میز غذاخوری", "طراحی داخلی"],
  },
  { name: "message", label: "توضیحات", type: "textarea", full: true },
];

// فرم فعلاً غیرفعال است؛ تا اتصال بک‌اند (MongoDB از طریق /api/lead) ارسال واقعی انجام نمی‌شود.
const FORM_ENABLED: boolean = false;

type Values = Record<string, string>;
type Errors = Record<string, string>;

export default function ConsultationSection() {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO(mongo): پس از آماده‌شدن /api/lead → saveLead()، گاردِ زیر را بردار و داده‌ها را به آن POST کن.
    if (!FORM_ENABLED) return;
    if (!validate()) return;
    setSubmitted(true);
  };

  return (
    <section id="consultation" className="bg-peach py-28 text-forest md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <FadeUp as="p" className="eyebrow text-brick">
              مشاوره رایگان
            </FadeUp>
            <FadeUp
              as="h2"
              delay={0.05}
              className="mt-6 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-light leading-[1.02] tracking-tightest"
            >
              بیایید خانه‌ای که دوستش دارید را بسازیم.
            </FadeUp>
            <FadeUp as="p" delay={0.1} className="mt-6 max-w-md text-lg leading-relaxed text-forest/70">
              برای مشاوره رایگان فرم زیر را تکمیل کنید؛ یا برای ثبت سفارش طراحی داخلی، فرم هوشمند را
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
                    <Button as="button" type="submit" variant="primary" showArrow>
                      ارسال درخواست
                    </Button>
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
