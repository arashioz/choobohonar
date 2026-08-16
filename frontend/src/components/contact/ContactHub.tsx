"use client";

import { Suspense } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import ContactLeadForm from "@/components/contact/ContactLeadForm";
import { contactForms } from "@/data/contact-forms";
import { brand } from "@/data/nav";
import { toFa } from "@/lib/utils";

export default function ContactHub() {
  return (
    <section className="bg-paper pt-28 pb-20 md:pt-36 md:pb-28">
      <Container>
        <nav className="mb-8 flex items-center gap-2 text-sm text-forest/50">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">تماس با ما</span>
        </nav>

        <div className="max-w-2xl">
          <FadeUp as="p" className="eyebrow text-brick">
            ارتباط با ما
          </FadeUp>
          <FadeUp
            as="h1"
            delay={0.04}
            className="mt-3 text-balance text-3xl font-light leading-tight tracking-tightest text-forest md:text-5xl"
          >
            تماس با ما
          </FadeUp>
          <FadeUp as="p" delay={0.08} className="mt-4 text-base leading-relaxed text-forest/60">
            فرم عمومی را پر کنید یا اگر مسیر مشخص‌تری دارید، از فرم‌های همکاری، نمایندگی و مشاوره استفاده کنید.
          </FadeUp>
        </div>

        <FadeUp delay={0.1} className="mt-10 md:mt-12">
          <Suspense fallback={<div className="h-80 animate-pulse border border-forest/10 bg-forest/[0.03]" />}>
            <ContactLeadForm />
          </Suspense>
        </FadeUp>

        <FadeUp delay={0.16} className="mt-16 md:mt-20">
          <p className="eyebrow text-brick">فرم‌های اختصاصی</p>
          <div className="mt-6 divide-y divide-forest/10 border-y border-forest/10">
            {contactForms.map((form, i) => (
              <Link
                key={form.id}
                href={form.href}
                className="group flex items-center gap-5 py-6 transition-colors hover:bg-forest/[0.02] md:gap-8 md:py-7"
              >
                <span className="w-6 shrink-0 text-sm tabular-nums text-brick/80">{toFa(i + 1)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-forest/45">{form.eyebrow}</p>
                  <h2 className="mt-1 text-lg font-light text-forest transition-colors group-hover:text-brick md:text-xl">
                    {form.title}
                  </h2>
                  <p className="mt-1.5 hidden text-sm leading-relaxed text-forest/55 sm:block">{form.description}</p>
                </div>
                <div className="hidden shrink-0 text-left text-xs text-forest/45 sm:block">
                  <p>{form.duration}</p>
                  {form.steps ? <p className="mt-0.5">{toFa(form.steps)} مرحله</p> : null}
                </div>
                <span className="shrink-0 text-forest/30 transition-all duration-300 group-hover:-translate-x-0.5 group-hover:text-brick">
                  ←
                </span>
              </Link>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.2} className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm text-forest/60">
          <span>{brand.phone}</span>
          <span dir="ltr">{brand.email}</span>
          <span>{brand.showroomHoursFa}</span>
        </FadeUp>
      </Container>
    </section>
  );
}
