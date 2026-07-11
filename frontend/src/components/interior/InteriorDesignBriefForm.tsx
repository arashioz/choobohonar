"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/layout/Container";
import {
  budgetOptions,
  consultationOptions,
  interiorStyles,
  pickMoodboardRound,
  spaceTypeOptions,
  timelineOptions,
  type InteriorBriefPayload,
  type MoodboardImage,
} from "@/data/interior-architecture";
import { cn, toFa } from "@/lib/utils";

const FORM_ENABLED = false;

type StepId = "styles" | "round1" | "round2" | "details" | "contact" | "success";

const steps: { id: StepId; label: string }[] = [
  { id: "styles", label: "سبک" },
  { id: "round1", label: "انتخاب بصری ۱" },
  { id: "round2", label: "انتخاب بصری ۲" },
  { id: "details", label: "جزئیات فنی" },
  { id: "contact", label: "تماس" },
];

type FormState = {
  styles: string[];
  moodboardRound1: string;
  moodboardRound2: string;
  location: string;
  area: string;
  spaceType: string;
  roomCount: string;
  budget: string;
  timeline: string;
  consultation: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
};

const initialState: FormState = {
  styles: [],
  moodboardRound1: "",
  moodboardRound2: "",
  location: "",
  area: "",
  spaceType: "",
  roomCount: "",
  budget: "",
  timeline: "",
  consultation: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
};

function fieldClass(hasError: boolean) {
  return cn(
    "w-full border-b bg-transparent py-3 text-forest placeholder:text-forest/55 transition-colors focus:outline-none",
    hasError ? "border-brick" : "border-forest/25 focus:border-forest"
  );
}

export default function InteriorDesignBriefForm() {
  const [step, setStep] = useState<StepId>("styles");
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [round1Images, setRound1Images] = useState<MoodboardImage[]>([]);
  const [round2Images, setRound2Images] = useState<MoodboardImage[]>([]);

  const stepIndex = steps.findIndex((item) => item.id === step);

  useEffect(() => {
    if (step === "round1" && !round1Images.length) {
      setRound1Images(pickMoodboardRound(values.styles, []));
    }
  }, [step, round1Images.length, values.styles]);

  useEffect(() => {
    if (step === "round2" && !round2Images.length) {
      setRound2Images(pickMoodboardRound(values.styles, [values.moodboardRound1].filter(Boolean)));
    }
  }, [step, round2Images.length, values.moodboardRound1, values.styles]);

  const progress = useMemo(() => {
    if (step === "success") return 100;
    return Math.round(((stepIndex + 1) / steps.length) * 100);
  }, [step, stepIndex]);

  const setField = (name: keyof FormState, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleStyle = (id: string) => {
    setValues((prev) => {
      const exists = prev.styles.includes(id);
      const styles = exists ? prev.styles.filter((item) => item !== id) : [...prev.styles, id];
      return { ...prev, styles };
    });
    setErrors((prev) => ({ ...prev, styles: "" }));
    setRound1Images([]);
    setRound2Images([]);
  };

  const validateStep = (current: StepId) => {
    const next: Record<string, string> = {};
    if (current === "styles" && values.styles.length === 0) next.styles = "حداقل یک سبک را انتخاب کنید";
    if (current === "round1" && !values.moodboardRound1) next.moodboardRound1 = "یک تصویر را انتخاب کنید";
    if (current === "round2" && !values.moodboardRound2) next.moodboardRound2 = "یک تصویر را انتخاب کنید";
    if (current === "details") {
      if (!values.location.trim()) next.location = "این فیلد الزامی است";
      if (!values.area.trim()) next.area = "این فیلد الزامی است";
      if (!values.spaceType) next.spaceType = "نوع فضا را انتخاب کنید";
      if (!values.consultation) next.consultation = "نوع مشاوره را انتخاب کنید";
    }
    if (current === "contact") {
      if (!values.name.trim()) next.name = "این فیلد الزامی است";
      if (!values.phone.trim()) next.phone = "این فیلد الزامی است";
      else if (!/^[0-9\u06F0-\u06F9+\-\s]{7,}$/.test(values.phone.trim())) next.phone = "شماره تماس معتبر نیست";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (step === "success") return;
    if (!validateStep(step)) return;

    const order: StepId[] = ["styles", "round1", "round2", "details", "contact", "success"];
    const currentIndex = order.indexOf(step);
    setStep(order[currentIndex + 1]);
  };

  const goBack = () => {
    const order: StepId[] = ["styles", "round1", "round2", "details", "contact"];
    const currentIndex = order.indexOf(step);
    if (currentIndex <= 0) return;
    setStep(order[currentIndex - 1]);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateStep("contact")) return;

    const payload: InteriorBriefPayload = {
      styles: values.styles,
      moodboardRound1: values.moodboardRound1,
      moodboardRound2: values.moodboardRound2,
      location: values.location.trim(),
      area: values.area.trim(),
      spaceType: values.spaceType,
      roomCount: values.roomCount.trim(),
      budget: values.budget,
      timeline: values.timeline,
      consultation: values.consultation,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || undefined,
      notes: values.notes.trim() || undefined,
    };

    if (FORM_ENABLED) {
      // TODO(mongo): POST payload to /api/interior-brief when backend is ready.
      console.info("interior brief", payload);
    }

    setStep("success");
  };

  return (
    <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
      <Container>
        <nav className="mb-8 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <Link href="/interior-architecture-services" className="transition-colors hover:text-forest">
            خدمات معماری داخلی
          </Link>
          <span>/</span>
          <span className="text-forest">فرم سفارش</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-4">
            <p className="eyebrow text-brick">فرم هوشمند</p>
            <h1 className="mt-5 text-balance text-[clamp(1.875rem,3vw,2.75rem)] font-light leading-[1.12] tracking-tightest text-forest">
              سلیقه و نیازهای فضای خود را به ما بگویید
            </h1>
            <p className="mt-5 text-base leading-relaxed text-forest/68">
              ابتدا سبک‌های مورد علاقه‌تان را انتخاب کنید، سپس با انتخاب از میان تصاویر الهام‌بخش، جهت طراحی را
              مشخص کنید و در پایان جزئیات فنی و اطلاعات تماس را وارد نمایید.
            </p>

            {step !== "success" ? (
              <div className="mt-10 hidden lg:block">
                <div className="mb-3 flex items-center justify-between text-xs text-forest/55">
                  <span>پیشرفت</span>
                  <span>{toFa(progress)}٪</span>
                </div>
                <div className="h-px bg-forest/10">
                  <div className="h-full origin-right bg-peach transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
                <ol className="mt-6 space-y-3">
                  {steps.map((item, index) => (
                    <li
                      key={item.id}
                      className={cn(
                        "text-sm transition-colors",
                        index <= stepIndex ? "text-forest" : "text-forest/35"
                      )}
                    >
                      {toFa(index + 1)}. {item.label}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="border border-forest/10 bg-peach/30 p-6 md:p-10">
              {step === "success" ? (
                <SuccessState />
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-8">
                  {step === "styles" ? (
                    <StepBlock
                      title="کدام سبک‌ها به سلیقه‌ی شما نزدیک‌تر است؟"
                      description="می‌توانید چند گزینه را هم‌زمان انتخاب کنید."
                    >
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {interiorStyles.map((style) => {
                          const selected = values.styles.includes(style.id);
                          return (
                            <button
                              key={style.id}
                              type="button"
                              onClick={() => toggleStyle(style.id)}
                              className={cn(
                                "group overflow-hidden rounded-2xl border text-right transition-all duration-300",
                                selected
                                  ? "border-forest bg-paper shadow-[0_12px_40px_rgba(9,43,28,0.08)]"
                                  : "border-forest/10 bg-paper/70 hover:border-forest/25"
                              )}
                            >
                              <div className="relative aspect-[4/3] overflow-hidden">
                                <Image
                                  src={style.image}
                                  alt={style.label}
                                  fill
                                  sizes="(max-width: 640px) 100vw, 280px"
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="text-lg font-light text-forest">{style.label}</h3>
                                <p className="mt-1 text-sm leading-6 text-forest/60">{style.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {errors.styles ? <p className="text-sm text-brick">{errors.styles}</p> : null}
                    </StepBlock>
                  ) : null}

                  {step === "round1" || step === "round2" ? (
                    <MoodboardRound
                      title={step === "round1" ? "کدام فضا بیشتر به سلیقه‌ی شما نزدیک است؟" : "یک بار دیگر انتخاب کنید"}
                      description={
                        step === "round1"
                          ? "از میان این سه تصویر، گزینه‌ای که بیشتر دوست دارید را انتخاب کنید."
                          : "برای دقیق‌تر شدن درک سلیقه‌ی شما، یک تصویر دیگر انتخاب کنید."
                      }
                      images={step === "round1" ? round1Images : round2Images}
                      selectedId={step === "round1" ? values.moodboardRound1 : values.moodboardRound2}
                      error={step === "round1" ? errors.moodboardRound1 : errors.moodboardRound2}
                      onSelect={(id) => setField(step === "round1" ? "moodboardRound1" : "moodboardRound2", id)}
                    />
                  ) : null}

                  {step === "details" ? (
                    <StepBlock title="جزئیات فنی پروژه" description="اطلاعات فضا به ما کمک می‌کند پیشنهاد دقیق‌تری ارائه دهیم.">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field label="شهر / محله" required error={errors.location}>
                          <input
                            id="location"
                            value={values.location}
                            onChange={(e) => setField("location", e.target.value)}
                            className={fieldClass(Boolean(errors.location))}
                            placeholder="مثلاً تهران، زعفرانیه"
                          />
                        </Field>
                        <Field label="متراژ تقریبی" required error={errors.area}>
                          <input
                            id="area"
                            value={values.area}
                            onChange={(e) => setField("area", e.target.value)}
                            className={fieldClass(Boolean(errors.area))}
                            placeholder="مثلاً ۱۸۰ متر"
                          />
                        </Field>
                        <Field label="نوع فضا" required error={errors.spaceType}>
                          <select
                            id="spaceType"
                            value={values.spaceType}
                            onChange={(e) => setField("spaceType", e.target.value)}
                            className={fieldClass(Boolean(errors.spaceType))}
                          >
                            <option value="">انتخاب کنید</option>
                            {spaceTypeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="تعداد فضاهای اصلی" error={errors.roomCount}>
                          <input
                            id="roomCount"
                            value={values.roomCount}
                            onChange={(e) => setField("roomCount", e.target.value)}
                            className={fieldClass(Boolean(errors.roomCount))}
                            placeholder="مثلاً ۲ خواب، نشیمن، آشپزخانه"
                          />
                        </Field>
                        <Field label="بودجه تقریبی">
                          <select
                            id="budget"
                            value={values.budget}
                            onChange={(e) => setField("budget", e.target.value)}
                            className={fieldClass(false)}
                          >
                            <option value="">انتخاب کنید</option>
                            {budgetOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="بازه زمانی مدنظر">
                          <select
                            id="timeline"
                            value={values.timeline}
                            onChange={(e) => setField("timeline", e.target.value)}
                            className={fieldClass(false)}
                          >
                            <option value="">انتخاب کنید</option>
                            {timelineOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="نوع مشاوره ترجیحی" required error={errors.consultation} full>
                          <select
                            id="consultation"
                            value={values.consultation}
                            onChange={(e) => setField("consultation", e.target.value)}
                            className={fieldClass(Boolean(errors.consultation))}
                          >
                            <option value="">انتخاب کنید</option>
                            {consultationOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>
                    </StepBlock>
                  ) : null}

                  {step === "contact" ? (
                    <StepBlock title="اطلاعات تماس" description="کارشناسان ما پس از بررسی فرم با شما تماس می‌گیرند.">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Field label="نام و نام خانوادگی" required error={errors.name}>
                          <input
                            id="name"
                            value={values.name}
                            onChange={(e) => setField("name", e.target.value)}
                            className={fieldClass(Boolean(errors.name))}
                          />
                        </Field>
                        <Field label="شماره تماس" required error={errors.phone}>
                          <input
                            id="phone"
                            type="tel"
                            dir="ltr"
                            value={values.phone}
                            onChange={(e) => setField("phone", e.target.value)}
                            className={cn(fieldClass(Boolean(errors.phone)), "text-right")}
                          />
                        </Field>
                        <Field label="ایمیل" full>
                          <input
                            id="email"
                            type="email"
                            dir="ltr"
                            value={values.email}
                            onChange={(e) => setField("email", e.target.value)}
                            className={cn(fieldClass(false), "text-right")}
                          />
                        </Field>
                        <Field label="توضیحات تکمیلی" full>
                          <textarea
                            id="notes"
                            rows={5}
                            value={values.notes}
                            onChange={(e) => setField("notes", e.target.value)}
                            className={fieldClass(false)}
                          />
                        </Field>
                      </div>
                    </StepBlock>
                  ) : null}

                  <div className="flex flex-wrap items-center gap-4 border-t border-forest/10 pt-6">
                    {step !== "styles" ? (
                      <Button as="button" type="button" variant="secondary" onClick={goBack}>
                        مرحله قبل
                      </Button>
                    ) : null}

                    {step === "contact" ? (
                      FORM_ENABLED ? (
                        <Button as="button" type="submit" variant="primary" showArrow>
                          ثبت درخواست طراحی
                        </Button>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Button as="button" type="submit" variant="primary" showArrow>
                            ثبت درخواست طراحی
                          </Button>
                          <p className="text-sm text-forest/60">
                            ارسال فرم در نسخه‌ی نمایشی ذخیره می‌شود؛ اتصال بک‌اند به‌زودی فعال می‌شود.
                          </p>
                        </div>
                      )
                    ) : (
                      <Button as="button" type="button" variant="primary" showArrow onClick={goNext}>
                        مرحله بعد
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StepBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-light tracking-tightest text-forest md:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-forest/68 md:text-base">{description}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
  required,
  error,
  full,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  full?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", full && "md:col-span-2")}>
      <label className="mb-2 text-sm text-forest/70">
        {label}
        {required ? <span className="text-brick"> *</span> : null}
      </label>
      {children}
      {error ? <span className="mt-1.5 text-xs text-brick">{error}</span> : null}
    </div>
  );
}

function MoodboardRound({
  title,
  description,
  images,
  selectedId,
  error,
  onSelect,
}: {
  title: string;
  description: string;
  images: MoodboardImage[];
  selectedId: string;
  error?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <StepBlock title={title} description={description}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {images.map((image) => {
          const selected = selectedId === image.id;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => onSelect(image.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border text-right transition-all duration-300",
                selected ? "border-forest ring-2 ring-forest/20" : "border-forest/10 hover:border-forest/30"
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-colors duration-300",
                    selected ? "bg-forest/25" : "bg-forest/0 group-hover:bg-forest/10"
                  )}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm text-paper drop-shadow">{image.alt}</p>
              </div>
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-4 text-sm text-brick">{error}</p> : null}
    </StepBlock>
  );
}

function SuccessState() {
  return (
    <div className="flex min-h-[24rem] flex-col items-start justify-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-forest text-2xl text-peach">✓</div>
      <h2 className="text-3xl font-light tracking-tightest text-forest">درخواست شما ثبت شد</h2>
      <p className="mt-3 max-w-lg text-forest/70">
        سپاس از اعتماد شما. کارشناسان معماری داخلی خانه چوب و هنر پس از بررسی سلیقه و جزئیات فنی، برای هماهنگی
        مشاوره با شما تماس می‌گیرند.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/projects" variant="secondary">
          مشاهده پروژه‌ها
        </Button>
        <Button href="/interior-architecture-services" variant="primary">
          بازگشت به صفحه خدمات
        </Button>
      </div>
    </div>
  );
}
