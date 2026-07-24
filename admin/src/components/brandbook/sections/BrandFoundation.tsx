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
import {
  IconCheck,
  IconChevron,
  IconColumns,
  IconCompass,
  IconHeart,
  IconHome,
  IconPalette,
  IconShield,
  IconUsers,
} from '@/components/brandbook/icons';

/* ═══════════════════════════════════════════════════════════════════════════
   Chapter 1 — Brand Foundation
   ═══════════════════════════════════════════════════════════════════════════ */

const conceptIcons = [IconColumns, IconPalette, IconHome] as const;
const purposeIcons = [IconHeart, IconUsers, IconShield, IconCompass] as const;

// ═══════════════════════════════════════════════════════════════════════════
// 1. Brand Introduction
// ═══════════════════════════════════════════════════════════════════════════

function BrandIntroduction() {
  return (
    <BrandbookSubsection id="brand-intro">
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

        <FadeUp as="p" delay={0.1} className="text-lg leading-relaxed text-forest/80 max-w-3xl mb-6">
          {brandIntro.introText}
        </FadeUp>

        {brandIntro.introParagraphs.map((paragraph, idx) => (
          <FadeUp
            key={paragraph}
            as="p"
            delay={0.11 + idx * 0.02}
            className="text-lg leading-relaxed text-forest/80 max-w-3xl mb-4"
          >
            {paragraph}
          </FadeUp>
        ))}

        <FadeUp as="p" delay={0.14} className="text-base font-medium text-forest/70 max-w-3xl mb-6">
          {brandIntro.introBridge}
        </FadeUp>

        {/* Core concept cards */}
        <FadeUp delay={0.16}>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" amount={0.45} from="right">
            {brandIntro.coreConcepts.map((concept, i) => {
              const Icon = conceptIcons[i] ?? IconColumns;
              return (
                <BrandbookCard key={concept.title} className="p-8">
                  <Icon className="mb-5 h-8 w-8 text-forest" />
                  <h3 className="text-lg font-medium text-forest mb-1">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-forest/45 font-mono">{concept.titleEn}</p>
                </BrandbookCard>
              );
            })}
          </Stagger>
        </FadeUp>

        <FadeUp as="p" delay={0.2} className="mt-10 text-lg leading-relaxed text-forest/80 max-w-3xl">
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

        <FadeUp delay={0.08}>
          <div className="space-y-5 rounded-2xl border border-forest/10 bg-paper p-7 text-base leading-relaxed text-forest/75 sm:p-8">
            <h3 className="text-lg font-semibold text-forest">فرهنگ خانواده و آغاز مسیر</h3>
            <div className="space-y-4">
              {heritage.storyParagraphs.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <div className="border-t border-forest/10 pt-5">
              <p className="mb-3 text-xs font-semibold tracking-wide text-forest/50">
                ارزش‌های خانوادگی
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {heritage.familyValues.map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center rounded-full bg-forest/5 px-3 py-1.5 text-xs font-medium text-forest/80"
                  >
                    {val}
                  </span>
                ))}
              </div>
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
      />

      <BrandbookProse className="space-y-6">
        <FadeUp as="blockquote" delay={0.05} className="text-[clamp(1.375rem,3vw,2rem)] font-light leading-relaxed text-forest">
          «{philosophy.mainQuote}»
        </FadeUp>

        <FadeUp as="p" delay={0.08} className="text-base leading-relaxed text-forest/70">
          {philosophy.text}
        </FadeUp>

        <FadeUp
          as="p"
          delay={0.1}
          className="rounded-2xl border border-brick/15 bg-paper/70 px-6 py-5 text-lg leading-relaxed font-medium text-brick"
        >
          {philosophy.highlight}
        </FadeUp>
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
      <BrandbookSectionHeader title="هدف وجودی برند" />

      <BrandbookProse className="space-y-8 md:space-y-10">
        <FadeUp as="p" delay={0.05} className="text-xl font-medium leading-relaxed text-forest/90 max-w-2xl">
          {purpose.statement}
        </FadeUp>

        <FadeUp as="p" delay={0.07} className="text-base leading-relaxed text-forest/60 max-w-2xl">
          {purpose.subtitle}
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className="grid gap-5 sm:grid-cols-2 lg:max-w-3xl">
            {purpose.concepts.map((c, i) => {
              const Icon = purposeIcons[i] ?? IconHeart;
              return (
                <FadeUp key={c.title} delay={i * 0.07}>
                  <BrandbookCard lift="sm" className="rounded-xl p-7">
                    <Icon className="mb-4 h-6 w-6 text-forest" />
                    <p className="text-base font-medium text-forest">{c.title}</p>
                  </BrandbookCard>
                </FadeUp>
              );
            })}
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="max-w-3xl rounded-xl bg-forest/5 border border-forest/10 p-6">
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
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-forest-900/80 via-forest to-forest-700/90" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-peach/10 blur-[100px]" aria-hidden />
      <BrandbookContainer className="relative">
        <FadeUp as="span" className="eyebrow text-peach/70 mb-6 block">
          چشم‌انداز برند
        </FadeUp>

        <FadeUp as="h2" delay={0.05} className="font-light tracking-tightest text-balance text-white text-[clamp(1.75rem,4vw,3.25rem)] leading-[1.25] mb-10 max-w-4xl">
          {vision.statement}
        </FadeUp>

        <FadeUp as="p" delay={0.08} className="text-sm font-medium text-white/70 mb-6 block">
          {vision.attributesTitle}
        </FadeUp>

        {/* Attribute badges */}
        <FadeUp delay={0.1}>
          <div className="flex flex-wrap gap-3">
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
      <BrandbookSectionHeader title="مأموریت برند" />

      <BrandbookProse>
        <FadeUp as="p" delay={0.05} className="mb-8 text-lg leading-relaxed text-forest/80 md:mb-10">
          {mission.preamble}
        </FadeUp>

        <ul className="space-y-6 max-w-2xl">
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <BrandbookSubsection id="beliefs" className="bg-peach/5">
      <BrandbookSectionHeader title="باورهای بنیادین برند" />

      <BrandbookProse>
        <div className="divide-y divide-forest/10">
          {beliefs.map((belief, i) => {
            const isOpen = openIndex === i;
            return (
              <FadeUp key={belief.number} delay={i * 0.07} className="relative py-5 md:py-6">
                {/* Large ghost number */}
                <span
                  className="pointer-events-none absolute -right-2 top-3 select-none text-7xl font-extralight leading-none text-forest/[0.04] md:text-8xl"
                >
                  {belief.number}
                </span>

                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={cn(
                    'group flex w-full items-center justify-between gap-4 text-right',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper rounded-lg',
                  )}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-lg font-medium text-forest transition-colors duration-500 ease-out-expo group-hover:text-teal">
                    {belief.number}. {belief.title}
                  </h3>
                  <IconChevron
                    className={cn(
                      'h-5 w-5 shrink-0 text-forest transition-transform duration-500 ease-out-expo',
                      isOpen && 'rotate-180',
                    )}
                  />
                </button>

                {/* Expandable description */}
                <div
                  className={cn(
                    'grid transition-all duration-500 ease-out-expo',
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="pt-4 text-base leading-relaxed text-forest/70 pr-6">
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
      <BrandbookSectionHeader title="ارزش‌های برند" />

        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" amount={0.5}>
          {values.map((v) => (
            <BrandbookCard key={v.titleEn} lift="sm" className="p-8">
              <h3 className="text-xl font-medium text-forest mb-1">{v.titleFa}</h3>
              <p className="mb-4 text-xs font-mono text-teal">{v.titleEn}</p>
              <div className="mb-4 h-px w-10 bg-brick/40" />
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
  return (
    <section
      id="essence"
      className="flex min-h-[62vh] flex-col items-center justify-center bg-forest py-20 text-center md:py-28"
    >
      <BrandbookContainer className="flex flex-col items-center">
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
