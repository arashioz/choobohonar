"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { contactInquirySubjects } from "@/data/contact-forms";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import { cn } from "@/lib/utils";
import { FORM_ENABLED } from "@/lib/form-utils";
import { submitLead } from "@/lib/leads-api";

type FieldType = "text" | "tel" | "select" | "textarea";
type Field = { name: string; label: string; type: FieldType; required?: boolean; options?: string[]; full?: boolean };

const baseFields: Field[] = [
  { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { name: "phone", label: "شماره تماس", type: "tel", required: true },
  {
    name: "interest",
    label: "موضوع درخواست",
    type: "select",
    required: true,
    options: [...contactInquirySubjects],
  },
  { name: "message", label: "توضیحات", type: "textarea", full: true },
];

type Values = Record<string, string>;
type Errors = Record<string, string>;

function interestFromIntent(intent: string | null) {
  if (intent === "quote") return "ثبت سفارش";
  if (intent === "services") return "خدمات مشاوره معماری داخلی";
  return "";
}

export default function ContactLeadForm() {
  const [subjects, setSubjects] = useState<string[]>([...contactInquirySubjects]);
  const searchParams = useSearchParams();
  const fields = useMemo(() => baseFields.map((field) => field.name === "interest" ? { ...field, options: subjects } : field), [subjects]);
  const defaultInterest = useMemo(
    () => interestFromIntent(searchParams.get("intent")),
    [searchParams],
  );

  const [values, setValues] = useState<Values>({ interest: defaultInterest });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchPublicCmsPage<{ contactInquirySubjects?: string[] }>("contact-forms")
      .then((page) => {
        const values = page?.items?.contactInquirySubjects;
        if (Array.isArray(values) && values.length) setSubjects(values);
      })
      .catch(() => undefined);
  }, []);

  const setValue = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Errors = {};
    for (const field of fields) {
      const value = (values[field.name] ?? "").trim();
      if (field.required && !value) next[field.name] = "این فیلد الزامی است";
      if (field.type === "tel" && value && !/^[0-9\u06F0-\u06F9+\-\s]{7,}$/.test(value)) next[field.name] = "شماره تماس معتبر نیست";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!FORM_ENABLED) return;
    if (!validate() || submitting) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      await submitLead({
        type: "contact",
        source: "contact",
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

  if (submitted) {
    return (
      <div className="flex min-h-[18rem] flex-col items-start justify-center border border-forest/10 bg-forest/[0.02] px-6 py-10 md:px-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-peach">✓</div>
        <h2 className="text-3xl font-light tracking-tightest text-forest">درخواست شما ثبت شد</h2>
        <p className="mt-3 max-w-lg text-forest/70">سپاس از اعتماد شما. کارشناسان خانه چوب و هنر به‌زودی برای ادامه‌ی هماهنگی با شما تماس می‌گیرند.</p>
      </div>
    );
  }

  return (
    <div className="border border-forest/10 bg-forest/[0.02] px-6 py-10 md:px-10 md:py-12">
      <div className="max-w-xl">
        <p className="eyebrow text-brick">فرم تماس</p>
        <h2 className="mt-4 text-3xl font-light tracking-tightest text-forest md:text-4xl">پیام خود را بفرستید</h2>
        <p className="mt-4 text-forest/70">
          نام، تلفن و موضوع درخواست را بنویسید؛ کارشناسان خانه چوب و هنر در کوتاه‌ترین زمان با شما تماس می‌گیرند.
        </p>
      </div>
      <form onSubmit={onSubmit} noValidate className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn("flex flex-col", field.full && "md:col-span-2")}>
            <label htmlFor={field.name} className="mb-2 text-sm text-forest/70">
              {field.label}
              {field.required ? <span className="text-brick"> *</span> : null}
            </label>
            {field.type === "textarea" ? (
              <textarea id={field.name} rows={5} value={values[field.name] ?? ""} onChange={(e) => setValue(field.name, e.target.value)} className={fieldClass(Boolean(errors[field.name]))} />
            ) : field.type === "select" ? (
              <select id={field.name} value={values[field.name] ?? ""} onChange={(e) => setValue(field.name, e.target.value)} className={fieldClass(Boolean(errors[field.name]))}>
                <option value="">انتخاب کنید</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                dir={field.type === "tel" ? "ltr" : "rtl"}
                value={values[field.name] ?? ""}
                onChange={(e) => setValue(field.name, e.target.value)}
                className={cn(fieldClass(Boolean(errors[field.name])), field.type === "tel" && "text-right")}
              />
            )}
            {errors[field.name] ? <span className="mt-1.5 text-xs text-brick">{errors[field.name]}</span> : null}
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
              <p className="text-sm text-forest/60">ارسال فرم موقتاً غیرفعال است و به‌زودی فعال می‌شود.</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return cn(
    "w-full border-b bg-transparent py-3 text-forest placeholder:text-forest/55 transition-colors focus:outline-none",
    hasError ? "border-brick" : "border-forest/25 focus:border-forest",
  );
}
