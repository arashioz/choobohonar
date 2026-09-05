'use client';

import Image from 'next/image';
import { useState } from 'react';
import {
  brandIntro,
  heritage,
  philosophy,
  purpose,
  vision,
  mission,
  beliefs,
  values,
  essence,
} from '@/data/brandbook';
import { cn } from '@/lib/utils';
import FadeUp from '@/components/motion/FadeUp';
import Stagger from '@/components/motion/Stagger';
import Parallax from '@/components/motion/Parallax';
import ScrollTimeline from '@/components/motion/ScrollTimeline';
import BrandbookContainer from '@/components/brandbook/layout/BrandbookContainer';
import BrandbookSubsection from '@/components/brandbook/layout/BrandbookSubsection';
import BrandbookSectionHeader from '@/components/brandbook/layout/BrandbookSectionHeader';
import BrandbookProse from '@/components/brandbook/layout/BrandbookProse';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import BrandPatternField from '@/components/brandbook/layout/BrandPatternField';
import { useBrandbookPrint } from '@/components/brandbook/BrandbookPrintContext';
import {
  IconCheck,
  IconChevron,
  IconColumns,
  IconHome,
  IconPalette,
} from '@/components/brandbook/icons';

/* ═══════════════════════════════════════════════════════════════════════════
   Chapter 1 — Brand Foundation
   ═══════════════════════════════════════════════════════════════════════════ */

const conceptIcons = [IconColumns, IconPalette, IconHome] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 1. Brand Introduction
// ═══════════════════════════════════════════════════════════════════════════

function BrandIntroduction() {
  return (
    <BrandbookSubsection id="brand-intro">
        <div className="mx-auto max-w-4xl text-center">
        <FadeUp as="span" className="eyebrow text-brick mb-6 block">
          فصل اول — بنیان برند
        </FadeUp>

        <FadeUp as="h2" className="font-light tracking-tightest text-balance text-forest text-[clamp(2rem,5vw,4.25rem)] leading-[1.1] mb-3">
          {brandIntro.title}
        </FadeUp>

        <FadeUp as="p" delay={0.05} className="text-lg font-light text-teal mb-2">
          {brandIntro.titleEn}
        </FadeUp>

        <FadeUp as="p" delay={0.05} className="text-xl font-medium text-brick mb-10">
          {brandIntro.tagline} — <span className="text-forest/60 font-normal">{brandIntro.taglineEn}</span>
        </FadeUp>

        <FadeUp as="p" delay={0.1} className="mx-auto text-lg leading-relaxed text-forest/80 max-w-3xl mb-6 text-right sm:text-center">
          {brandIntro.introText}
        </FadeUp>

        {brandIntro.introParagraphs.map((paragraph, idx) => (
          <FadeUp
            key={paragraph}
            as="p"
            delay={0.11 + idx * 0.02}
            className="mx-auto text-lg leading-relaxed text-forest/80 max-w-3xl mb-4 text-right sm:text-center"
          >
            {paragraph}
          </FadeUp>
        ))}

        <FadeUp as="p" delay={0.14} className="mx-auto text-base font-medium text-forest/70 max-w-3xl mb-10 text-right sm:text-center">
          {brandIntro.introBridge}
        </FadeUp>
        </div>

        {/* Core concept cards */}
        <FadeUp delay={0.16}>
          <Stagger className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3" amount={0.45} from="right">
            {brandIntro.coreConcepts.map((concept, i) => {
              const Icon = conceptIcons[i] ?? IconColumns;
              return (
                <BrandbookCard key={concept.title} className="p-8 text-center">
                  <Icon className="mx-auto mb-5 h-8 w-8 text-forest" />
                  <h3 className="text-lg font-medium text-forest mb-1">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-forest/45 font-mono">{concept.titleEn}</p>
                </BrandbookCard>
              );
            })}
          </Stagger>
        </FadeUp>

        <FadeUp as="p" delay={0.2} className="mx-auto mt-10 max-w-3xl text-lg leading-relaxed text-forest/80 text-right sm:text-center">
          {brandIntro.introClosing}
        </FadeUp>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. Heritage Timeline & Narrative
// ═══════════════════════════════════════════════════════════════════════════

function HeritageTimeline() {
  return (
    <BrandbookSubsection id="heritage" tone="tinted">
      <BrandbookSectionHeader title="تاریخچه و میراث برند" />

      <BrandbookProse className="space-y-10 md:space-y-12">
        <FadeUp delay={0.05} variant="scale">
          <blockquote
            className={cn(
              'group rounded-2xl border border-forest/10 bg-paper/70 px-7 py-7 backdrop-blur-sm',
              'transition-all duration-500 ease-out-expo',
              'hover:border-forest/15 hover:shadow-md hover:shadow-forest/[0.04]',
              'sm:px-8 sm:py-8',
            )}
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              <div className="relative mx-auto shrink-0 sm:mx-0">
                <div className="relative size-24 overflow-hidden rounded-2xl border border-forest/10 bg-forest/[0.03] sm:size-28">
                  <Image
                    src={heritage.founderQuote.portrait}
                    alt={`تصویر ${heritage.founderQuote.author}`}
                    fill
                    sizes="112px"
                    unoptimized
                    className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    priority
                  />
                </div>
              </div>

              <div className="min-w-0 flex-1 text-center sm:text-right">
                <p className="mb-4 text-xl font-light leading-relaxed text-forest transition-colors duration-500 group-hover:text-forest">
                  «{heritage.founderQuote.text}»
                </p>
                <footer className="text-sm font-medium text-forest/60 transition-colors duration-500 group-hover:text-forest/75">
                  — {heritage.founderQuote.author}
                  <span className="mx-1.5 text-forest/25">·</span>
                  <span className="text-forest/50">{heritage.founderQuote.role}</span>
                </footer>
              </div>
            </div>
          </blockquote>
        </FadeUp>

        <FadeUp delay={0.08} variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] border border-paper/10 bg-forest shadow-2xl shadow-forest/15">
            <BrandPatternField
              variant="forest"
              surface="dark"
              mask="right"
              strength="soft"
              motion="scroll"
              sheen
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-l from-forest/60 via-forest/88 to-forest-900/95"
            />

            <div className="relative grid gap-10 px-6 py-9 sm:px-9 sm:py-11 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:py-14">
              <div className="flex flex-col justify-between lg:col-span-4">
                <div>
                  <span className="eyebrow text-peach/65">میراث زنده</span>
                  <h3 className="mt-4 max-w-sm text-[clamp(1.75rem,3vw,2.75rem)] font-light leading-[1.25] tracking-tightest text-paper">
                    فرهنگ خانواده
                    <br />
                    و آغاز مسیر
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-paper/55">
                    روایتی از پیوند اخلاق، صنعتگری و کیفیت؛ ارزش‌هایی که پیش از
                    هر محصول، در شیوه‌ی زندگی این خانواده شکل گرفتند.
                  </p>
                </div>

                <div className="mt-9 border-t border-paper/[0.12] pt-6">
                  <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-paper/40">
                    ارزش‌های خانوادگی
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {heritage.familyValues.map((val) => (
                      <span
                        key={val}
                        className="inline-flex items-center rounded-full border border-paper/10 bg-paper/[0.06] px-3 py-1.5 text-xs font-medium text-paper/75 backdrop-blur-sm"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <Stagger
                className="grid gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 sm:grid-cols-2 lg:col-span-8"
                selector=":scope > article"
                amount={0.7}
                y={20}
              >
                {heritage.storyParagraphs.map((paragraph, idx) => (
                  <article
                    key={paragraph}
                    className="group min-h-44 bg-forest/80 p-5 backdrop-blur-sm transition-colors duration-500 ease-out-expo hover:bg-forest/[0.65] sm:p-6"
                  >
                    <span
                      className="mb-5 block font-mono text-[10px] tracking-[0.18em] text-peach/55"
                      dir="ltr"
                    >
                      STORY / {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm leading-8 text-paper/[0.72] transition-colors duration-500 group-hover:text-paper/90">
                      {paragraph}
                    </p>
                  </article>
                ))}
              </Stagger>
            </div>
          </div>
        </FadeUp>

        <ScrollTimeline className="flex flex-col gap-10">
            {heritage.timeline.map((milestone, i) => (
              <FadeUp
                key={milestone.yearEn}
                delay={i * 0.05}
                variant="right"
                y={32}
                data-timeline-item
                className="relative pr-10 md:pr-14"
              >
                <span
                  data-timeline-dot
                  className="absolute right-0 top-[0.4rem] size-3.5 translate-x-1/2 rounded-full border-2 border-forest/20 bg-paper transition-colors duration-500 ease-out-expo [.is-active]:border-forest [.is-active]:bg-forest/[0.08]"
                  aria-hidden
                />

                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-forest">
                  <span className="text-brick font-bold text-base">{milestone.year}</span>
                  <span className="text-forest/25">|</span>
                  <span className="font-mono text-xs tracking-wide text-forest/50">
                    {milestone.yearEn}
                  </span>
                </span>

                <h3 className="mb-2 text-xl font-medium text-forest">
                  {milestone.title}
                </h3>
                <p className="max-w-2xl text-base leading-relaxed text-forest/70">
                  {milestone.description}
                </p>
              </FadeUp>
            ))}
        </ScrollTimeline>

        <FadeUp delay={0.12}>
          <p className="max-w-2xl text-base leading-relaxed text-forest/75">
            {heritage.closingStatement}
          </p>
        </FadeUp>
      </BrandbookProse>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. Philosophy
// ═══════════════════════════════════════════════════════════════════════════

function Philosophy() {
  return (
    <BrandbookSubsection id="philosophy" tone="accent">
      <BrandbookSectionHeader
        eyebrow="فلسفه شکل‌گیری برند"
        title="خانه، بیش از یک فضا"
        align="center"
      />

      <BrandbookProse align="center" className="space-y-6">
        {philosophy.paragraphs.map((paragraph, idx) => (
          <FadeUp
            key={paragraph}
            as="p"
            delay={0.05 + idx * 0.03}
            className={cn(
              idx === 0 && 'text-[clamp(1.375rem,3vw,2rem)] font-light leading-relaxed text-forest text-balance',
              idx > 0 && 'text-base leading-relaxed text-forest/70',
            )}
          >
            {idx === 0 ? `«${paragraph}»` : paragraph}
          </FadeUp>
        ))}
      </BrandbookProse>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. Purpose
// ═══════════════════════════════════════════════════════════════════════════

function Purpose() {
  return (
    <BrandbookSubsection id="purpose">
      <BrandbookSectionHeader title="هدف وجودی برند" align="center" />

      <BrandbookProse align="center" className="space-y-8 md:space-y-10">
        <FadeUp as="p" delay={0.05} className="text-xl font-medium leading-relaxed text-forest/90">
          {purpose.statement}
        </FadeUp>

        {purpose.paragraphs.map((paragraph, idx) => (
          <FadeUp key={paragraph} as="p" delay={0.07 + idx * 0.02} className="text-base leading-relaxed text-forest/60">
            {paragraph}
          </FadeUp>
        ))}

        <FadeUp delay={0.15}>
          <div className="rounded-xl border border-forest/10 bg-forest/5 p-6 text-right sm:text-center">
            <p className="text-sm font-medium text-forest/80 leading-relaxed">
              {purpose.closingStatement}
            </p>
          </div>
        </FadeUp>
      </BrandbookProse>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. Vision
// ═══════════════════════════════════════════════════════════════════════════

function Vision() {
  return (
    <section
      id="vision"
      className="relative w-full overflow-hidden bg-forest py-20 md:py-28"
    >
      <BrandPatternField
        variant="forest"
        surface="dark"
        mask="soft"
        strength="quiet"
        motion="scroll"
        sheen
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-forest-900/80 via-forest/92 to-forest-700/90" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-peach/10 blur-[100px]" aria-hidden />
      <BrandbookContainer className="relative text-center">
        <FadeUp as="span" className="eyebrow text-peach/70 mb-6 block">
          چشم‌انداز برند
        </FadeUp>

        <FadeUp as="h2" delay={0.05} className="mx-auto font-light tracking-tightest text-balance text-white text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.25] mb-10 max-w-4xl">
          {vision.statement}
        </FadeUp>

        <FadeUp as="p" delay={0.08} className="text-sm font-medium text-white/70 mb-6 block">
          {vision.attributesTitle}
        </FadeUp>

        {/* Attribute badges */}
        <FadeUp delay={0.1}>
          <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
            {vision.attributes.map((attr, i) => (
              <FadeUp
                key={attr}
                as="span"
                delay={i * 0.07}
                className={cn(
                  'rounded-full border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-light text-white',
                  'transition-colors duration-500 ease-out-expo hover:bg-white/20',
                )}
              >
                {attr}
              </FadeUp>
            ))}
          </div>
        </FadeUp>
      </BrandbookContainer>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. Mission
// ═══════════════════════════════════════════════════════════════════════════

function Mission() {
  return (
    <BrandbookSubsection id="mission">
      <BrandbookSectionHeader title="مأموریت برند" align="center" />

      <BrandbookProse align="center">
        <FadeUp as="p" delay={0.05} className="mb-8 text-lg leading-relaxed text-forest/80 md:mb-10">
          {mission.preamble}
        </FadeUp>

        <ul className="mx-auto w-full max-w-2xl space-y-6 text-right">
          {mission.items.map((item, i) => (
            <FadeUp key={item} as="li" delay={i * 0.07} className="flex items-start gap-4">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-forest/30 bg-forest/5">
                <IconCheck className="h-3.5 w-3.5 text-forest" />
              </span>
              <span className="text-lg leading-relaxed text-forest/80">
                {item}
              </span>
            </FadeUp>
          ))}
        </ul>
      </BrandbookProse>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. Beliefs — accordion
// ═══════════════════════════════════════════════════════════════════════════

function Beliefs() {
  const isPrint = useBrandbookPrint();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <BrandbookSubsection id="beliefs" className="bg-peach/5">
      <BrandbookSectionHeader title="باورهای بنیادین برند" align="center" />

      <BrandbookProse align="center">
        <div className="divide-y divide-forest/10 text-right">
          {beliefs.map((belief, i) => {
            const isOpen = isPrint || openIndex === i;
            return (
              <FadeUp key={belief.number} delay={i * 0.07} className="relative py-6 md:py-7">
                <span
                  className="pointer-events-none absolute -right-1 top-4 select-none text-6xl font-extralight leading-none text-forest/[0.035] md:text-7xl"
                  aria-hidden
                >
                  {belief.number}
                </span>

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    'group relative flex w-full items-center justify-between gap-4 text-right',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-sm',
                    isPrint && 'pointer-events-none',
                  )}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg font-medium text-forest transition-colors duration-300 group-hover:text-teal">
                    {belief.title}
                  </h3>
                  <IconChevron
                    className={cn(
                      'h-4 w-4 shrink-0 text-forest/50 transition-transform duration-300',
                      isOpen && 'rotate-180 text-forest',
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'grid transition-all duration-300 ease-out-expo',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pt-3 max-w-2xl text-base leading-relaxed text-forest/65">
                      {belief.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </BrandbookProse>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. Values — 3×2 grid
// ═══════════════════════════════════════════════════════════════════════════

function Values() {
  return (
    <BrandbookSubsection id="values">
      <BrandbookSectionHeader title="ارزش‌های برند" align="center" />

        <Stagger className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.5}>
          {values.map((v) => (
            <BrandbookCard key={v.titleEn} lift="sm" className="p-8 text-center">
              <h3 className="text-xl font-medium text-forest mb-1">{v.titleFa}</h3>
              <p className="mb-4 text-xs font-mono text-teal">{v.titleEn}</p>
              <div className="mx-auto mb-4 h-px w-10 bg-brick/40" />
              <p className="text-base leading-relaxed text-forest/70">
                {v.description}
              </p>
            </BrandbookCard>
          ))}
        </Stagger>
    </BrandbookSubsection>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. Brand Essence
// ═══════════════════════════════════════════════════════════════════════════

function BrandEssence() {
  const isPrint = useBrandbookPrint();

  return (
    <section
      id="essence"
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden bg-forest py-20 text-center md:py-28",
        !isPrint && "min-h-[62vh]",
      )}
    >
      <BrandPatternField
        variant="forest"
        surface="dark"
        mask="soft"
        strength="present"
        motion="scroll"
        sheen
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-forest-900/40 via-forest/68 to-forest/88" />
      <BrandbookContainer className="relative flex flex-col items-center">
        <Parallax speed={20} className="flex w-full flex-col items-center">
          <FadeUp as="span" className="eyebrow text-peach/60 mb-8 block">
            جوهره برند
          </FadeUp>

          <FadeUp as="h2" delay={0.05} className="font-light tracking-tightest text-balance text-peach text-[clamp(3rem,8vw,6.5rem)] leading-[1.05] mb-10">
            {essence.statement}
          </FadeUp>

          <FadeUp as="p" delay={0.1} className="max-w-2xl text-lg leading-relaxed text-white/75 font-light">
            {essence.description}
          </FadeUp>
        </Parallax>
      </BrandbookContainer>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Composed Export
// ═══════════════════════════════════════════════════════════════════════════

export default function BrandFoundation() {
  return (
    <div className="bg-paper text-forest">
      <BrandIntroduction />
      <HeritageTimeline />
      <Philosophy />
      <Purpose />
      <Vision />
      <Mission />
      <Beliefs />
      <Values />
      <BrandEssence />
    </div>
  );
}
