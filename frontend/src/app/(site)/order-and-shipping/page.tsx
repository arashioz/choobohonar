import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { orderAndShipping } from "@/data/order-and-shipping";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "سفارش، ارسال و گارانتی | خانه چوب و هنر",
  description:
    "شرایط ثبت سفارش، حمل و ارسال، دریافت، نصب، گارانتی مبلمان و خدمات پس از فروش خانه چوب و هنر.",
};

export default function OrderAndShippingPage() {
  const content = orderAndShipping;

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-paper">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(232,184,138,0.16),transparent_42%)]" aria-hidden />
        <Container className="relative z-10 flex min-h-[58svh] flex-col justify-end pb-16 pt-32 md:pb-24 md:pt-40">
          <nav className="mb-10 flex items-center gap-2 text-sm text-paper/55">
            <Link href="/" className="transition-colors hover:text-paper">
              خانه
            </Link>
            <span>/</span>
            <span className="text-paper/85">پشتیبانی</span>
          </nav>
          <FadeUp>
            <p className="eyebrow text-peach">{content.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest">
              {content.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-paper/78 md:text-lg">
              {content.intro}
            </p>
          </FadeUp>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <ol className="divide-y divide-forest/10 border-y border-forest/10">
            {content.sections.map((section, index) => (
              <li key={section.id} id={section.id} className="grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <span className="font-sans text-sm text-brick md:col-span-1">{toFa(index + 1).padStart(2, "۰")}</span>
                <div className="md:col-span-11">
                  <h2 className="text-2xl font-light tracking-tight text-forest md:text-3xl">{section.title}</h2>
                  {"items" in section && section.items ? (
                    <ol className="mt-5 max-w-3xl space-y-2 text-base leading-8 text-forest/70">
                      {section.items.map((item, itemIndex) => (
                        <li key={item} className="flex gap-3">
                          <span className="text-brick">{toFa(itemIndex + 1)}.</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {"paragraphs" in section && section.paragraphs
                    ? section.paragraphs.map((paragraph) => (
                        <p key={paragraph} className="mt-4 max-w-3xl text-base leading-8 text-forest/70">
                          {paragraph}
                        </p>
                      ))
                    : null}
                  {"notes" in section && section.notes
                    ? section.notes.map((note) => (
                        <p key={note} className="mt-4 max-w-3xl border-r-2 border-brick/40 pr-4 text-sm leading-7 text-forest/60">
                          {note}
                        </p>
                      ))
                    : null}
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-20 text-forest md:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <FadeUp className="lg:col-span-7">
              <p className="eyebrow text-brick">تماس پشتیبانی</p>
              <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest">
                خدمات پس از فروش همراه شماست
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-forest/70">
                برای پیگیری سفارش، ارسال یا گارانتی با واحد پشتیبانی خانه چوب و هنر تماس بگیرید.
              </p>
            </FadeUp>
            <FadeUp delay={0.08} className="lg:col-span-4 lg:col-start-9">
              <p dir="ltr" className="text-right text-2xl font-light tracking-tight text-forest">
                {content.contact.phoneDisplay}
              </p>
              <p dir="ltr" className="mt-2 text-right text-sm text-forest/60">
                {content.contact.email}
              </p>
              <Button href="/contact" variant="primary" showArrow className="mt-8">
                تماس با ما
              </Button>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}
