"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/contact/shared/FormField";
import FormChipGroup from "@/components/contact/shared/FormChipGroup";
import FormSuccess from "@/components/contact/shared/FormSuccess";
import { iranProvinces, ownershipTypes } from "@/data/contact-forms";
import {
  FORM_ENABLED,
  required,
  validateEmail,
  validatePhone,
} from "@/lib/form-utils";

type FormState = {
  firstName: string;
  lastName: string;
  mobile: string;
  landline: string;
  email: string;
  address: string;
  province: string;
  city: string;
  ownership: string;
  area: string;
  notes: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  mobile: "",
  landline: "",
  email: "",
  address: "",
  province: "",
  city: "",
  ownership: "",
  area: "",
  notes: "",
};

export default function RepresentationForm() {
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const setField = (name: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!required(values.firstName)) next.firstName = "نام الزامی است";
    if (!required(values.lastName)) next.lastName = "نام خانوادگی الزامی است";
    if (!validatePhone(values.mobile)) next.mobile = "شماره همراه معتبر نیست";
    if (!validatePhone(values.landline)) next.landline = "تلفن ثابت معتبر نیست";
    if (!validateEmail(values.email)) next.email = "ایمیل معتبر نیست";
    if (!required(values.address)) next.address = "آدرس الزامی است";
    if (!required(values.province)) next.province = "استان را انتخاب کنید";
    if (!required(values.city)) next.city = "شهر الزامی است";
    if (!values.ownership) next.ownership = "نوع مالکیت را انتخاب کنید";
    if (!required(values.area)) next.area = "متراژ الزامی است";
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
        title="درخواست نمایندگی ثبت شد"
        description="درخواست شما برای بررسی به تیم توسعه فروش ارسال شد. پس از ارزیابی اولیه، برای هماهنگی جلسه با شما تماس می‌گیریم."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="نام" name="firstName" required value={values.firstName} onChange={(v) => setField("firstName", v)} error={errors.firstName} />
        <FormField label="نام خانوادگی" name="lastName" required value={values.lastName} onChange={(v) => setField("lastName", v)} error={errors.lastName} />
        <FormField label="تلفن همراه" name="mobile" type="tel" required value={values.mobile} onChange={(v) => setField("mobile", v)} error={errors.mobile} />
        <FormField label="تلفن ثابت" name="landline" type="tel" required value={values.landline} onChange={(v) => setField("landline", v)} error={errors.landline} />
      </div>

      <FormField label="ایمیل" name="email" type="email" required value={values.email} onChange={(v) => setField("email", v)} error={errors.email} placeholder="email@gmail.com" />
      <FormField label="آدرس" name="address" required value={values.address} onChange={(v) => setField("address", v)} error={errors.address} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField as="select" label="استان" name="province" required value={values.province} onChange={(v) => setField("province", v)} options={iranProvinces.map((p) => ({ value: p, label: p }))} placeholder="انتخاب استان" error={errors.province} />
        <FormField label="شهر" name="city" required value={values.city} onChange={(v) => setField("city", v)} error={errors.city} />
      </div>

      <FormChipGroup label="نوع مالکیت" name="ownership" required value={values.ownership} onChange={(v) => setField("ownership", v)} options={[...ownershipTypes]} error={errors.ownership} columns={2} />
      <FormField label="متراژ (متر مربع)" name="area" type="number" required value={values.area} onChange={(v) => setField("area", v)} error={errors.area} dir="ltr" />
      <FormField as="textarea" label="توضیحات" name="notes" value={values.notes} onChange={(v) => setField("notes", v)} rows={4} placeholder="توضیح کوتاه درباره فضا، موقعیت و تجربه فروش" />

      <label className="flex cursor-pointer items-center justify-between gap-4 border border-dashed border-forest/20 px-4 py-3 text-sm transition-colors hover:border-forest/35">
        <span className="text-forest/55">تصویر فضا یا مدارک (اختیاری)</span>
        <span className="shrink-0 text-xs text-brick">انتخاب فایل</span>
        <input type="file" accept="image/*,.pdf" className="sr-only" disabled={!FORM_ENABLED} />
      </label>

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
