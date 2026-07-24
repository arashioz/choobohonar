"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import FormField from "@/components/contact/shared/FormField";
import FormChipGroup from "@/components/contact/shared/FormChipGroup";
import FormProgress from "@/components/contact/shared/FormProgress";
import FormSuccess from "@/components/contact/shared/FormSuccess";
import {
  birthYears,
  cooperationSteps,
  cooperationTypes,
  iranProvinces,
  persianMonths,
  skillLevels,
  type CooperationStepId,
} from "@/data/contact-forms";
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
  emergencyPhone: string;
  email: string;
  gender: string;
  maritalStatus: string;
  militaryStatus: string;
  currentJob: string;
  requestedJob: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  province: string;
  city: string;
  residenceArea: string;
  degree: string;
  fieldOfStudy: string;
  university: string;
  gpa: string;
  trainingCourses: string;
  insuranceHistory: string;
  skills: string;
  englishLevel: string;
  computerLevel: string;
  computerSkills: string;
  cooperationType: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  mobile: "",
  emergencyPhone: "",
  email: "",
  gender: "",
  maritalStatus: "",
  militaryStatus: "",
  currentJob: "",
  requestedJob: "",
  birthDay: "",
  birthMonth: "",
  birthYear: "",
  province: "",
  city: "",
  residenceArea: "",
  degree: "",
  fieldOfStudy: "",
  university: "",
  gpa: "",
  trainingCourses: "",
  insuranceHistory: "",
  skills: "",
  englishLevel: "",
  computerLevel: "",
  computerSkills: "",
  cooperationType: "",
};

const birthDays = Array.from({ length: 31 }, (_, i) => String(i + 1));

export default function CooperationForm() {
  const [step, setStep] = useState<CooperationStepId>("personal");
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const stepIndex = cooperationSteps.findIndex((s) => s.id === step);

  const setField = (name: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (current: CooperationStepId) => {
    const next: Record<string, string> = {};
    if (current === "personal") {
      if (!required(values.firstName)) next.firstName = "نام الزامی است";
      if (!required(values.lastName)) next.lastName = "نام خانوادگی الزامی است";
      if (!validatePhone(values.mobile)) next.mobile = "شماره همراه معتبر نیست";
      if (!validatePhone(values.emergencyPhone)) next.emergencyPhone = "تلفن ضروری معتبر نیست";
      if (!validateEmail(values.email)) next.email = "ایمیل معتبر نیست";
      if (!values.gender) next.gender = "جنسیت را انتخاب کنید";
      if (!values.maritalStatus) next.maritalStatus = "وضعیت تأهل را انتخاب کنید";
      if (!required(values.militaryStatus)) next.militaryStatus = "وضعیت نظام وظیفه الزامی است";
      if (!required(values.currentJob)) next.currentJob = "این فیلد الزامی است";
      if (!required(values.requestedJob)) next.requestedJob = "این فیلد الزامی است";
      if (!values.birthDay || !values.birthMonth || !values.birthYear) next.birthDay = "تاریخ تولد را کامل کنید";
      if (!required(values.province)) next.province = "استان الزامی است";
      if (!required(values.city)) next.city = "شهر الزامی است";
      if (!required(values.residenceArea)) next.residenceArea = "محدوده سکونت الزامی است";
    }
    if (current === "skills") {
      if (!required(values.skills)) next.skills = "مهارت‌ها را بنویسید";
      if (!values.englishLevel) next.englishLevel = "سطح زبان انگلیسی را انتخاب کنید";
      if (!values.computerLevel) next.computerLevel = "سطح آشنایی با کامپیوتر را انتخاب کنید";
      if (!required(values.computerSkills)) next.computerSkills = "مهارت‌های کامپیوتری را بنویسید";
    }
    if (current === "terms") {
      if (!values.cooperationType) next.cooperationType = "نوع همکاری را انتخاب کنید";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    const order = cooperationSteps.map((s) => s.id);
    const idx = order.indexOf(step);
    if (idx < order.length - 1) setStep(order[idx + 1]);
  };

  const goPrev = () => {
    const order = cooperationSteps.map((s) => s.id);
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep("terms")) return;
    if (!FORM_ENABLED) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <FormSuccess
        title="درخواست همکاری ثبت شد"
        description="سپاس از علاقه شما. واحد منابع انسانی درخواست را بررسی می‌کند و در صورت تطابق، برای ادامه فرآیند با شما تماس می‌گیرد."
      />
    );
  }

  return (
    <>
      <FormProgress steps={[...cooperationSteps]} currentIndex={stepIndex} className="mb-8" />

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {step === "personal" && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="نام" name="firstName" required value={values.firstName} onChange={(v) => setField("firstName", v)} error={errors.firstName} />
              <FormField label="نام خانوادگی" name="lastName" required value={values.lastName} onChange={(v) => setField("lastName", v)} error={errors.lastName} />
              <FormField label="تلفن همراه" name="mobile" type="tel" required value={values.mobile} onChange={(v) => setField("mobile", v)} error={errors.mobile} />
              <FormField label="تلفن ضروری" name="emergencyPhone" type="tel" required value={values.emergencyPhone} onChange={(v) => setField("emergencyPhone", v)} error={errors.emergencyPhone} hint="جهت تماس در صورت عدم پاسخگویی تلفن همراه" />
            </div>
            <FormField label="ایمیل" name="email" type="email" required value={values.email} onChange={(v) => setField("email", v)} error={errors.email} />
            <FormChipGroup label="جنسیت" name="gender" required value={values.gender} onChange={(v) => setField("gender", v)} options={["زن", "مرد"]} error={errors.gender} columns={2} />
            <FormChipGroup label="وضعیت تأهل" name="maritalStatus" required value={values.maritalStatus} onChange={(v) => setField("maritalStatus", v)} options={["مجرد", "متأهل"]} error={errors.maritalStatus} columns={2} />
            <FormField label="وضعیت نظام وظیفه" name="militaryStatus" required value={values.militaryStatus} onChange={(v) => setField("militaryStatus", v)} error={errors.militaryStatus} />
            <FormField label="شغل یا فعالیت فعلی" name="currentJob" required value={values.currentJob} onChange={(v) => setField("currentJob", v)} error={errors.currentJob} />
            <FormField label="زمینه و شغل درخواستی" name="requestedJob" required value={values.requestedJob} onChange={(v) => setField("requestedJob", v)} error={errors.requestedJob} />
            <div>
              <p className="mb-2 text-sm text-forest/70">
                تاریخ تولد <span className="text-brick">*</span>
              </p>
              <div className="grid grid-cols-3 gap-4">
                <FormField as="select" label="روز" name="birthDay" required value={values.birthDay} onChange={(v) => setField("birthDay", v)} options={birthDays.map((d) => ({ value: d, label: d }))} placeholder="روز" error={errors.birthDay} />
                <FormField as="select" label="ماه" name="birthMonth" required value={values.birthMonth} onChange={(v) => setField("birthMonth", v)} options={persianMonths.map((m) => ({ value: m, label: m }))} placeholder="ماه" />
                <FormField as="select" label="سال" name="birthYear" required value={values.birthYear} onChange={(v) => setField("birthYear", v)} options={birthYears.map((y) => ({ value: y, label: y }))} placeholder="سال" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField as="select" label="استان" name="province" required value={values.province} onChange={(v) => setField("province", v)} options={iranProvinces.map((p) => ({ value: p, label: p }))} placeholder="انتخاب استان" error={errors.province} />
              <FormField label="شهر" name="city" required value={values.city} onChange={(v) => setField("city", v)} error={errors.city} />
            </div>
            <FormField label="محدوده سکونت" name="residenceArea" required value={values.residenceArea} onChange={(v) => setField("residenceArea", v)} error={errors.residenceArea} />
          </>
        )}

        {step === "education" && (
          <>
            <FormField label="مدرک تحصیلی" name="degree" value={values.degree} onChange={(v) => setField("degree", v)} />
            <FormField label="رشته تحصیلی" name="fieldOfStudy" value={values.fieldOfStudy} onChange={(v) => setField("fieldOfStudy", v)} />
            <FormField label="نام دانشگاه" name="university" value={values.university} onChange={(v) => setField("university", v)} />
            <FormField label="معدل" name="gpa" value={values.gpa} onChange={(v) => setField("gpa", v)} />
          </>
        )}

        {step === "training" && (
          <>
            <FormField as="textarea" label="دوره‌های آموزشی" name="trainingCourses" value={values.trainingCourses} onChange={(v) => setField("trainingCourses", v)} placeholder="نام دوره، موسسه و سال را بنویسید" rows={5} />
            <FormField as="textarea" label="سابقه پرداخت بیمه" name="insuranceHistory" value={values.insuranceHistory} onChange={(v) => setField("insuranceHistory", v)} rows={4} />
          </>
        )}

        {step === "skills" && (
          <>
            <FormField as="textarea" label="مهارت‌ها و توانایی‌ها" name="skills" required value={values.skills} onChange={(v) => setField("skills", v)} error={errors.skills} rows={4} />
            <FormChipGroup label="آشنایی با زبان انگلیسی" name="englishLevel" required value={values.englishLevel} onChange={(v) => setField("englishLevel", v)} options={[...skillLevels]} error={errors.englishLevel} columns={5} />
            <FormChipGroup label="آشنایی با کامپیوتر" name="computerLevel" required value={values.computerLevel} onChange={(v) => setField("computerLevel", v)} options={[...skillLevels]} error={errors.computerLevel} columns={5} />
            <FormField as="textarea" label="مهارت‌های کامپیوتری" name="computerSkills" required value={values.computerSkills} onChange={(v) => setField("computerSkills", v)} error={errors.computerSkills} rows={3} placeholder="نرم‌افزارها و ابزارهایی که با آن‌ها کار می‌کنید" />
          </>
        )}

        {step === "terms" && (
          <>
            <FormChipGroup label="نوع همکاری" name="cooperationType" required value={values.cooperationType} onChange={(v) => setField("cooperationType", v)} options={[...cooperationTypes]} error={errors.cooperationType} columns={4} />
            <div>
              <p className="mb-2 text-sm text-forest/70">فایل رزومه</p>
              <label className="flex cursor-pointer items-center justify-between gap-4 border border-dashed border-forest/20 px-4 py-3 text-sm transition-colors hover:border-forest/35">
                <span className="text-forest/55">PDF یا Word — حداکثر ۵ مگابایت</span>
                <span className="shrink-0 text-xs text-brick">انتخاب فایل</span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" disabled={!FORM_ENABLED} />
              </label>
            </div>
          </>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-forest/10 pt-6">
          {stepIndex > 0 ? (
            <Button as="button" type="button" variant="secondary" onClick={goPrev}>
              قبلی
            </Button>
          ) : null}

          {step !== "terms" ? (
            <Button as="button" type="button" variant="primary" showArrow onClick={goNext}>
              بعدی
            </Button>
          ) : FORM_ENABLED ? (
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
    </>
  );
}
