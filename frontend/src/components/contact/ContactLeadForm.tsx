"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FieldType = "text" | "tel" | "select" | "textarea";
type Field = { name: string; label: string; type: FieldType; required?: boolean; options?: string[]; full?: boolean };

const inquiryOptions = ["استعلام قیمت", "مشاوره خرید", "خدمات معماری داخلی", "بازدید شوروم", "همکاری با نمایندگی"];
const fields: Field[] = [
  { name: "name", label: "نام و نام خانوادگی", type: "text", required: true },
  { name: "phone", label: "شماره تماس", type: "tel", required: true },
  { name: "interest", label: "نوع درخواست", type: "select", required: true, options: inquiryOptions },
  { name: "message", label: "توضیحات", type: "textarea", full: true },
];

// فرم فعلاً غیرفعال است؛ تا اتصال بک‌اند (MongoDB از طریق /api/lead) ارسال واقعی انجام نمی‌شود.
const FORM_ENABLED: boolean = false;

type Values = Record<string, string>;
type Errors = Record<string, string>;

export default function ContactLeadForm() {
  const searchParams = useSearchParams();
  const defaultInterest = useMemo(() => {
    const intent = searchParams.get("intent");
    if (intent === "quote") return "استعلام قیمت";
    if (intent === "services") return "خدمات معماری داخلی";
    return "";
  }, [searchParams]);

  const [values, setValues] = useState<Values>({ interest: defaultInterest });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

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

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO(mongo): پس از آماده‌شدن /api/lead → saveLead()، گاردِ زیر را بردار و داده‌ها را به آن POST کن.
    if (!FORM_ENABLED) return;
    if (!validate()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[24rem] flex-col items-start justify-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-peach">✓</div>
        <h2 className="text-3xl font-light tracking-tightest text-forest">درخواست شما ثبت شد</h2>
        <p className="mt-3 max-w-lg text-forest/70">سپاس از اعتماد شما. کارشناسان خانه چوب و هنر به‌زودی برای ادامه‌ی هماهنگی با شما تماس می‌گیرند.</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-xl">
        <p className="eyebrow text-brick">فرم تماس</p>
        <h2 className="mt-4 text-3xl font-light tracking-tightest text-forest md:text-4xl">نوع درخواست خود را مشخص کنید.</h2>
        <p className="mt-4 text-forest/70">نوع درخواست‌تان را انتخاب کنید و توضیح کوتاهی بنویسید؛ کارشناسان خانه چوب و هنر در کوتاه‌ترین زمان با شما تماس می‌گیرند.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className={cn("flex flex-col", field.full && "md:col-span-2")}>
            <label htmlFor={field.name} className="mb-2 text-sm text-forest/70">{field.label}{field.required ? <span className="text-brick"> *</span> : null}</label>
            {field.type === "textarea" ? (
              <textarea id={field.name} rows={5} value={values[field.name] ?? ""} onChange={(e) => setValue(field.name, e.target.value)} className={fieldClass(Boolean(errors[field.name]))} />
            ) : field.type === "select" ? (
              <select id={field.name} value={values[field.name] ?? ""} onChange={(e) => setValue(field.name, e.target.value)} className={fieldClass(Boolean(errors[field.name]))}>
                <option value="">انتخاب کنید</option>
                {field.options?.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ) : (
              <input id={field.name} type={field.type} dir={field.type === "tel" ? "ltr" : "rtl"} value={values[field.name] ?? ""} onChange={(e) => setValue(field.name, e.target.value)} className={cn(fieldClass(Boolean(errors[field.name])), field.type === "tel" && "text-right")} />
            )}
            {errors[field.name] ? <span className="mt-1.5 text-xs text-brick">{errors[field.name]}</span> : null}
          </div>
        ))}
        <div className="md:col-span-2">
          {FORM_ENABLED ? (
            <Button as="button" type="submit" variant="primary" showArrow>ارسال درخواست</Button>
          ) : (
            <div className="flex flex-col gap-3">
              <span className="pointer-events-none inline-block opacity-50" aria-disabled="true">
                <Button as="button" type="submit" variant="primary" showArrow>ارسال درخواست</Button>
              </span>
              <p className="text-sm text-forest/60">ارسال فرم موقتاً غیرفعال است و به‌زودی فعال می‌شود.</p>
            </div>
          )}
        </div>
      </form>
    </>
  );
}

function fieldClass(hasError: boolean) {
  return cn("w-full border-b bg-transparent py-3 text-forest placeholder:text-forest/55 transition-colors focus:outline-none", hasError ? "border-brick" : "border-forest/25 focus:border-forest");
}
