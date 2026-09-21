import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { aboutPage } from "@/data/about";
import { toFa } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره ما | خانه چوب و هنر",
  description:
    "خانه چوب و هنر؛ تولید مبلمان، کالای خواب، فرش و روشنایی با تیم معماری داخلی برای ساخت خانه‌ای دوست‌داشتنی.",
};

export default function AboutPage() {
  const content = aboutPage;

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
            <span className="text-paper/85">درباره ما</span>
          </nav>
          <FadeUp>
            <p className="eyebrow text-peach">{content.eyebrow}</p>
            <h1 className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest">
              {content.title}
            </h1>
            {content.intro.map((paragraph) => (
              <p key={paragraph} className="mt-6 max-w-2xl text-pretty text-base leading-8 text-paper/78 md:text-lg">
                {paragraph}
              </p>
            ))}
          </FadeUp>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">تمایز</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {content.distinction.title}
            </h2>
          </FadeUp>
          <ol className="mt-12 divide-y divide-forest/10 border-y border-forest/10">
            {content.distinction.items.map((item, index) => (
              <li key={item} className="grid grid-cols-1 gap-4 py-8 md:grid-cols-12 md:items-start md:py-10">
                <span className="font-sans text-sm text-brick md:col-span-1">{toFa(index + 1).padStart(2, "۰")}</span>
                <p className="text-lg leading-8 text-forest/75 md:col-span-11">{item}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 max-w-3xl text-base leading-8 text-forest/65">{content.distinction.body}</p>
        </Container>
      </section>

      <section className="bg-[#e8ded2] py-20 md:py-28">
        <Container>
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">{content.processTitle}</p>
            <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {content.processSubtitle}
            </h2>
          </FadeUp>
          <ol className="mt-12 grid gap-8 md:grid-cols-2">
            {content.process.map((step, index) => (
              <li key={step.title} className="border-t border-forest/15 pt-6">
                <p className="text-sm text-brick">{toFa(index + 1).padStart(2, "۰")}</p>
                <h3 className="mt-3 text-2xl font-light tracking-tight text-forest">{step.title}</h3>
                <p className="mt-4 text-base leading-8 text-forest/65">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <FadeUp className="lg:col-span-7">
              <p className="eyebrow text-brick">کارخانه</p>
              <h2 className="mt-5 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
                {content.factory.title}
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-forest/70">{content.factory.body}</p>
            </FadeUp>
            <ul className="grid gap-4 self-end lg:col-span-4 lg:col-start-9">
              {content.factory.facts.map((fact) => (
                <li key={fact} className="border-r-2 border-brick/40 pr-4 text-sm leading-7 text-forest/70">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-peach py-20 text-forest md:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <FadeUp className="lg:col-span-7">
              <p className="eyebrow text-brick">{content.extra.title}</p>
              <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest">
                {content.extra.itemTitle}
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-forest/70">{content.extra.itemBody}</p>
            </FadeUp>
            <FadeUp delay={0.08} className="lg:col-span-4 lg:col-start-9">
              <p dir="ltr" className="text-right text-2xl font-light tracking-tight">
                {content.contact.phoneDisplay}
              </p>
              <p dir="ltr" className="mt-2 text-right text-sm text-forest/60">
                {content.contact.email}
              </p>
              <Button href="/contact/consultation" variant="primary" showArrow className="mt-8">
                مشاوره رایگان چیدمان
              </Button>
            </FadeUp>
          </div>
        </Container>
      </section>
    </>
  );
}
