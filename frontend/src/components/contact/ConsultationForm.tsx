"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FormField from "@/components/contact/shared/FormField";
import FormChipGroup from "@/components/contact/shared/FormChipGroup";
import FormSuccess from "@/components/contact/shared/FormSuccess";
import { consultationTypes } from "@/data/contact-forms";
import {
  FORM_ENABLED,
  required,
  validateEmail,
  validatePhone,
} from "@/lib/form-utils";

type FormState = {
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  phone: "",
  email: "",
  type: "",
  message: "",
};

export default function ConsultationForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (name: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!required(values.name)) next.name = "نام الزامی است";
    if (!validatePhone(values.phone)) next.phone = "شماره تماس معتبر نیست";
    if (values.email && !validateEmail(values.email)) next.email = "ایمیل معتبر نیست";
    if (!values.type) next.type = "نوع مشاوره را انتخاب کنید";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    if (!FORM_ENABLED) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <FormSuccess
        title="درخواست مشاوره ثبت شد"
        description="سپاس از اعتماد شما. کارشناسان خانه چوب و هنر به‌زودی برای هماهنگی جلسه مشاوره با شما تماس می‌گیرند."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <FormField label="نام و نام خانوادگی" name="name" required value={values.name} onChange={(v) => setField("name", v)} error={errors.name} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="شماره تماس" name="phone" type="tel" required value={values.phone} onChange={(v) => setField("phone", v)} error={errors.phone} />
        <FormField label="ایمیل" name="email" type="email" value={values.email} onChange={(v) => setField("email", v)} error={errors.email} />
      </div>

      <FormChipGroup
        label="نوع مشاوره"
        name="type"
        required
        value={values.type}
        onChange={(v) => setField("type", v)}
        options={[...consultationTypes]}
        error={errors.type}
        columns={3}
      />

      {values.type === "معماری داخلی" && (
        <div className="border-r-2 border-brick/60 pr-4">
          <p className="text-sm leading-relaxed text-forest/65">
            برای پروژه‌های معماری داخلی با جزئیات بیشتر، از فرم تخصصی طراحی استفاده کنید.
          </p>
          <Link href="/interior-architecture-services/order" className="mt-2 inline-flex text-sm text-brick transition-colors hover:text-forest">
            فرم سفارش طراحی داخلی ←
          </Link>
        </div>
      )}

      <FormField
        as="textarea"
        label="توضیحات"
        name="message"
        value={values.message}
        onChange={(v) => setField("message", v)}
        rows={5}
        placeholder="فضا، نیازها یا سوالات خود را بنویسید"
      />

      <div className="border-t border-forest/10 pt-6">
        {FORM_ENABLED ? (
          <Button as="button" type="submit" variant="primary" showArrow>
            ارسال درخواست
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
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
  );
}
