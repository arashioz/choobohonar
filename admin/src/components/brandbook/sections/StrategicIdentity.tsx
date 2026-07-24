'use client';

import { useState } from 'react';
import {
  brandDna,
  pillars,
  positioning,
  brandDifferentiators,
  brandPromise,
  personality,
  archetype,
  targetAudience,
  personas,
} from '@/data/brandbook';
import { cn } from '@/lib/utils';
import FadeUp from '@/components/motion/FadeUp';
import Stagger from '@/components/motion/Stagger';
import RevealLine from '@/components/motion/RevealLine';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import {
  IconAlertCircle,
  IconArt,
  IconBrush,
  IconCheck,
  IconCog,
  IconDiamond,
  IconHeart,
  IconHeritage,
  IconLiving,
  IconPillar,
  IconQuality,
  IconQuote,
  IconShield,
  IconSparkle,
  IconTarget,
  IconUser,
  IconUsers,
} from '@/components/brandbook/icons';

/* ------------------------------------------------------------------ */
/*  Section helpers                                                    */
/* ------------------------------------------------------------------ */

const traitIconComponents = [
  IconPillar,
  IconBrush,
  IconShield,
  IconLiving,
  IconSparkle,
  IconQuote,
  IconHeart,
] as const;

const dnaIcons = [IconHeritage, IconArt, IconQuality, IconLiving] as const;

function Divider() {
  return (
    <div className="mx-auto flex items-center justify-center gap-3 py-10">
      <span className="h-px w-12 bg-forest/10" />
      <span className="size-1.5 rotate-45 bg-peach" />
      <span className="h-px w-12 bg-forest/10" />
    </div>
  );
}

/* ================================================================== */
/*  1. Brand DNA                                                      */
/* ================================================================== */

function BrandDnaSection() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);

  const orbitPositions = [
    'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
    'right-0 top-1/2 translate-x-0 -translate-y-1/2 sm:translate-x-1/2',
    'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
    'left-0 top-1/2 -translate-x-0 -translate-y-1/2 sm:-translate-x-1/2',
  ];

  return (
    <section className="py-20 md:py-28" id="brand-dna">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۱</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          DNA برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-2xl text-base leading-relaxed text-forest/75">
          {brandDna.preamble}
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="relative mx-auto mt-20 max-w-3xl">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-[12%] rounded-full border border-dashed border-forest/15" aria-hidden />
              <div className="absolute inset-[22%] rounded-full bg-gradient-to-br from-forest/[0.03] to-peach/[0.06]" aria-hidden />

              <svg className="absolute inset-0 size-full text-forest/10" viewBox="0 0 100 100" aria-hidden>
                <line x1="50" y1="50" x2="50" y2="12" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="88" stroke="currentColor" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="0.5" />
              </svg>

              <div className="absolute left-1/2 top-1/2 flex size-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-forest text-center shadow-xl shadow-forest/20 md:size-28">
                <span className="text-[10px] font-bold tracking-[0.25em] text-peach/70">BRAND</span>
                <span className="mt-0.5 text-lg font-light tracking-widest text-paper">DNA</span>
              </div>

              {brandDna.elements.map((el, i) => {
                const isActive = activeIdx === i;
                const DnaIcon = dnaIcons[i];
                return (
                  <button
                    key={el.titleEn}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={cn(
                      orbitPositions[i],
                      'absolute z-10 flex w-[7.5rem] flex-col items-center gap-2 rounded-2xl border px-3 py-4 text-center',
                      'transition-all duration-500 ease-out-expo',
                      isActive
                        ? 'scale-105 border-forest bg-paper shadow-lg shadow-forest/10'
                        : 'border-forest/10 bg-paper/90 hover:border-forest/25 hover:shadow-md',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-10 items-center justify-center rounded-xl transition-colors duration-500',
                        isActive ? 'bg-forest text-peach' : 'bg-forest/5 text-forest',
                      )}
                    >
                      <DnaIcon className="size-[18px] shrink-0" />
                    </span>
                    <span className="text-sm font-semibold text-forest">{el.titleFa}</span>
                    <span className="text-[10px] font-medium tracking-wide text-forest/45">
                      {el.titleEn}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active description panel */}
            <div className="mt-10 rounded-2xl border border-forest/10 bg-paper px-6 py-6 md:px-8 md:py-6 shadow-sm">
              {activeIdx !== null && (
                <>
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-forest text-peach">
                      {(() => {
                        const ActiveIcon = dnaIcons[activeIdx];
                        return <ActiveIcon className="size-4 shrink-0" />;
                      })()}
                    </span>
                    <div className="text-right">
                      <p className="text-base font-semibold text-forest">
                        {brandDna.elements[activeIdx].titleFa}
                      </p>
                      <p className="text-xs text-forest/45">
                        {brandDna.elements[activeIdx].titleEn}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm leading-8 text-forest/80" dir="rtl">
                    {brandDna.elements[activeIdx].description}
                  </p>
                </>
              )}
            </div>
          </div>
        </FadeUp>

        {/* Formula & Summary */}
        <FadeUp delay={0.25}>
          <div className="mt-10 flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-paper px-6 py-3">
              <span className="text-[11px] font-bold tracking-widest text-forest/45 uppercase">
                فرمول DNA
              </span>
              <span className="h-4 w-px bg-forest/10" />
              <span className="font-mono text-sm font-semibold text-forest">
                {brandDna.formula}
              </span>
            </div>
            <p className="text-sm font-medium text-brick max-w-xl">
              {brandDna.summarySentence}
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  2. Brand Pillars                                                  */
/* ================================================================== */

function BrandPillarsSection() {
  return (
    <section className="py-20 md:py-28" id="brand-pillars">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۲</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          ستون‌های اصلی برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
          چهار ستون اصلی که تمام تصمیمات استراتژیک خانه چوب و هنر بر اساس آن‌ها شکل می‌گیرد.
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar, i) => (
            <FadeUp key={pillar.titleFa} delay={i * 0.07} variant="scale" y={28}>
              <BrandbookCard
                lift="sm"
                className="flex h-full flex-col hover:shadow-lg hover:shadow-forest/[0.04]"
              >
                <div className="absolute left-4 top-4">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg bg-forest/[0.04] text-xs font-medium text-forest/55',
                      'transition-all duration-500 ease-out-expo group-hover:bg-forest/[0.06] group-hover:text-forest/80',
                    )}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-5 pb-6 pt-14" dir="rtl">
                  <h4 className="mb-1 text-base font-bold text-forest transition-colors duration-500 group-hover:text-forest">
                    {pillar.titleFa}
                  </h4>
                  <p className="mb-3 text-xs font-mono text-forest/45">{pillar.titleEn}</p>

                  <p className="mb-4 text-xs leading-relaxed text-forest/70">
                    {pillar.description}
                  </p>

                  <div className="mt-auto border-t border-forest/[0.06] pt-4">
                    <span className="mb-2 block text-[10px] font-medium tracking-wide text-forest/45">
                      اقدامات عملی
                    </span>
                    <ul className="space-y-2">
                      {pillar.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs leading-relaxed text-forest/75 transition-colors duration-300 group-hover:text-forest/85"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-forest/20 transition-colors duration-500 group-hover:bg-forest/35" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </BrandbookCard>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  3. Positioning & Differentiators                                  */
/* ================================================================== */

function PositioningSection() {
  return (
    <section className="py-20 md:py-28" id="positioning">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۳</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          جایگاه‌یابی و تمایزهای برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
          موضع‌گیری برند در صنعت و دلایل تمایز آن در نظر مشتریان.
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        <FadeUp delay={0.18}>
          <div className="mt-8 rounded-2xl border border-forest/10 bg-forest/5 p-6 max-w-3xl">
            <p className="text-base leading-relaxed text-forest/80">{positioning.overview}</p>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-forest/10 bg-gradient-to-br from-forest via-forest-700 to-forest-900 p-8 shadow-2xl shadow-forest/20 lg:p-12">
            <IconQuote className="mb-4 size-12 text-peach/30" />

            <blockquote
              dir="rtl"
              className="relative z-10 text-lg font-light leading-10 text-paper/95 lg:text-xl lg:leading-[3rem]"
            >
              {positioning.statement}
            </blockquote>

            <p className="mt-4 text-base font-medium text-peach" dir="rtl">
              {positioning.closing}
            </p>

            <div className="mt-8 border-t border-paper/10 pt-6" dir="rtl">
              <span className="eyebrow text-peach/70">
                تمایز بنیادین
              </span>
              <p className="mt-2 text-sm leading-7 text-paper/80">
                {positioning.differentiator}
              </p>
            </div>
          </div>
        </FadeUp>

        {/* 5 Differentiators Cards */}
        <div className="mt-14">
          <h3 className="text-xl font-light text-forest mb-6">پنج تمایز اصلی برند</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {brandDifferentiators.map((diff, idx) => (
              <FadeUp key={diff.titleFa} delay={idx * 0.05}>
                <div className="rounded-xl border border-forest/10 bg-paper p-5 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-brick block mb-2">۰{idx + 1}</span>
                    <h4 className="text-base font-semibold text-forest mb-2">{diff.titleFa}</h4>
                  </div>
                  <p className="text-xs text-forest/70 leading-relaxed">{diff.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  4. Brand Promise                                                  */
/* ================================================================== */

function BrandPromiseSection() {
  return (
    <section className="py-20 md:py-28" id="brand-promise">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۴</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          وعده برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
          تعهد ما به مخاطب — هم در بعد احساسی و هم عملکردی.
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        {/* Overall promise quote */}
        <FadeUp delay={0.18}>
          <div className="mt-14 rounded-2xl border border-brick/20 bg-peach/10 px-8 py-6" dir="rtl">
            <p className="text-lg font-medium leading-relaxed text-forest">
              {brandPromise.overall}
            </p>
          </div>
        </FadeUp>

        {/* Specific commitments */}
        <FadeUp delay={0.2}>
          <div className="mt-6 rounded-2xl border border-forest/10 bg-paper p-6" dir="rtl">
            <h4 className="text-sm font-bold text-forest mb-4">خانه چوب و هنر متعهد است که:</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {brandPromise.commitments.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-forest/80">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brick text-paper text-xs">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Emotional */}
          <FadeUp delay={0.22}>
            <div className="relative overflow-hidden rounded-2xl bg-peach/10 p-6 lg:p-8 border border-peach/30">
              <div dir="rtl" className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-peach-deep/20">
                    <IconHeart className="size-5 text-brick" />
                  </span>
                  <div>
                    <span className="eyebrow text-brick">
                      وعده احساسی برند
                    </span>
                    <span className="block text-xs text-forest/50 font-mono">Emotional Promise</span>
                  </div>
                </div>
                <p className="text-base font-medium leading-8 text-forest/90">
                  {brandPromise.emotional}
                </p>
              </div>
            </div>
          </FadeUp>

          {/* Functional */}
          <FadeUp delay={0.26}>
            <div className="relative overflow-hidden rounded-2xl bg-sage/10 p-6 lg:p-8 border border-sage/30">
              <div dir="rtl" className="relative z-10">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-sage/30">
                    <IconCog className="size-5 text-forest" />
                  </span>
                  <div>
                    <span className="eyebrow text-forest">
                      وعده عملکردی برند
                    </span>
                    <span className="block text-xs text-forest/50 font-mono">Functional Promise</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {brandPromise.functional.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm font-medium text-forest/85"
                    >
                      <span className="flex size-5 items-center justify-center rounded-md bg-forest/10">
                        <IconCheck className="size-3.5 text-forest" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  5. Personality                                                    */
/* ================================================================== */

function PersonalitySection() {
  const [hoveredTrait, setHoveredTrait] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-28" id="personality">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۵</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          شخصیت برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
          {personality.intro}
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        {/* Trait cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {personality.traits.map((trait, i) => {
            const isHovered = hoveredTrait === i;
            const TraitIcon = traitIconComponents[i] ?? IconPillar;
            return (
              <FadeUp key={trait.titleFa} delay={i * 0.07}>
                <div
                  onMouseEnter={() => setHoveredTrait(i)}
                  onMouseLeave={() => setHoveredTrait(null)}
                  className={cn(
                    'relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 ease-out-expo h-full flex flex-col justify-between',
                    isHovered
                      ? 'border-peach/60 bg-forest text-paper shadow-lg shadow-forest/15 -translate-y-1'
                      : 'border-forest/10 bg-paper text-forest',
                  )}
                >
                  <div>
                    <TraitIcon
                      className={cn(
                        'mb-3 size-6 transition-transform duration-500 ease-out-expo',
                        isHovered ? 'scale-110 text-peach' : 'text-forest',
                      )}
                    />
                    <h4 className="text-base font-bold" dir="rtl">
                      {trait.titleFa}
                    </h4>
                    <p
                      className={cn(
                        'mt-2 text-xs leading-relaxed',
                        isHovered ? 'text-paper/80' : 'text-forest/70',
                      )}
                      dir="rtl"
                    >
                      {trait.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>

        {/* Keyword tag cloud */}
        <FadeUp delay={0.3}>
          <div className="mt-16">
            <h4 className="mb-5 text-center text-xs font-bold tracking-widest text-forest/50 uppercase">
              کلمات کلیدی شخصیت برند
            </h4>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {personality.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className={cn(
                    'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium',
                    'bg-forest/5 text-forest border-forest/10 hover:bg-forest hover:text-paper transition-colors duration-300',
                  )}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  6. Archetype                                                      */
/* ================================================================== */

function ArchetypeSection() {
  return (
    <section className="py-20 md:py-28" id="archetype">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۶</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          آرکتایپ برند
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-xl text-lg leading-relaxed text-forest/70">
          ترکیبی از دو آرکتایپ اصلی: خالق (The Creator) و مراقبت‌کننده (The Caregiver).
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        <Stagger className="mt-14 grid gap-6 md:grid-cols-2" amount={0.35}>
          {/* Creator */}
          <div className="rounded-2xl border border-forest/10 bg-paper p-8 flex flex-col justify-between">
            <div>
              <span className="eyebrow text-forest/40">آرکتایپ اول</span>
              <h3 className="text-2xl font-light text-forest mt-1">{archetype.primary.titleFa}</h3>
              <p className="text-xs font-mono text-forest/45 mb-4">{archetype.primary.titleEn}</p>
              
              <div className="bg-forest/[0.03] p-4 rounded-xl mb-4">
                <span className="text-xs font-bold text-brick block mb-1">هدف:</span>
                <p className="text-sm text-forest/80">{archetype.primary.goal}</p>
              </div>

              <p className="text-sm text-forest/70 leading-relaxed mb-6">
                {archetype.primary.description}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-forest/50 block mb-2">ویژگی‌ها:</span>
              <div className="flex flex-wrap gap-1.5">
                {archetype.primary.traits.map((t) => (
                  <span key={t} className="rounded-full bg-forest/5 px-3 py-1 text-xs text-forest/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Caregiver */}
          <div className="rounded-2xl border border-forest/10 bg-paper p-8 flex flex-col justify-between">
            <div>
              <span className="eyebrow text-forest/40">آرکتایپ دوم</span>
              <h3 className="text-2xl font-light text-forest mt-1">{archetype.secondary.titleFa}</h3>
              <p className="text-xs font-mono text-forest/45 mb-4">{archetype.secondary.titleEn}</p>

              <div className="bg-forest/[0.03] p-4 rounded-xl mb-4">
                <span className="text-xs font-bold text-brick block mb-1">هدف:</span>
                <p className="text-sm text-forest/80">{archetype.secondary.goal}</p>
              </div>

              <p className="text-sm text-forest/70 leading-relaxed mb-6">
                {archetype.secondary.description}
              </p>
            </div>

            <div>
              <span className="text-xs font-bold text-forest/50 block mb-2">ویژگی‌ها:</span>
              <div className="flex flex-wrap gap-1.5">
                {archetype.secondary.traits.map((t) => (
                  <span key={t} className="rounded-full bg-forest/5 px-3 py-1 text-xs text-forest/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Stagger>

        {/* Combined archetype */}
        <FadeUp delay={0.18}>
          <div className="mt-8 rounded-2xl border border-peach/40 bg-peach/10 p-8 text-right">
            <div className="flex items-center gap-3 mb-2">
              <IconDiamond className="size-5 text-brick" />
              <h4 className="text-xl font-bold text-forest">{archetype.combined.titleFa} ({archetype.combined.titleEn})</h4>
            </div>
            <p className="text-base text-forest/80 leading-relaxed">{archetype.combined.description}</p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  7. Customer Personas & Target Audience                             */
/* ================================================================== */

function PersonasSection() {
  const personaIcons = [IconUser, IconSparkle, IconUsers];

  return (
    <section className="py-20 md:py-28" id="personas">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        <FadeUp>
          <span className="eyebrow text-brick">۲.۷</span>
        </FadeUp>
        <FadeUp as="h2" delay={0.05} className="mt-3 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
          مخاطب هدف و پرسونای مشتری
        </FadeUp>
        <FadeUp as="p" delay={0.1} className="mt-4 max-w-2xl text-lg leading-relaxed text-forest/70">
          {targetAudience.description}
        </FadeUp>
        <FadeUp delay={0.14}>
          <RevealLine className="mt-2 w-12" origin="right" />
        </FadeUp>

        {/* Target Audience Traits */}
        <FadeUp delay={0.16}>
          <div className="mt-8 rounded-2xl border border-forest/10 bg-paper p-6">
            <h4 className="text-sm font-bold text-forest mb-3">مخاطبان برند چه کسانی هستند؟</h4>
            <div className="flex flex-wrap gap-2">
              {targetAudience.traits.map((trait, idx) => (
                <span key={idx} className="rounded-lg bg-forest/5 px-4 py-2 text-xs font-medium text-forest/80">
                  • {trait}
                </span>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Persona Cards */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" amount={0.4}>
          {personas.map((persona, i) => {
            const PersonaIcon = personaIcons[i] ?? IconUser;
            return (
              <BrandbookCard
                key={persona.titleFa}
                lift="sm"
                className="flex h-full flex-col p-6 lg:p-7 hover:shadow-lg hover:shadow-forest/5"
              >
                <div className="mb-6 flex items-start gap-3" dir="rtl">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-forest/5">
                    <PersonaIcon className="size-[18px] shrink-0 text-forest" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono text-forest/40 block">{persona.titleEn}</span>
                    <h4 className="text-base font-semibold leading-snug text-forest">
                      {persona.titleFa}
                    </h4>
                    {persona.ageRange && (
                      <span className="text-xs text-brick block mt-0.5">{persona.ageRange}</span>
                    )}
                  </div>
                </div>

                <div className="mb-6 flex-1" dir="rtl">
                  <span className="eyebrow mb-3 block text-forest/45">ویژگی‌ها</span>
                  <div className="flex flex-wrap gap-1.5">
                    {persona.traits.map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full border border-forest/10 bg-forest/[0.03] px-3 py-1 text-xs font-medium text-forest/80"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-5 rounded-xl bg-forest/[0.03] p-4" dir="rtl">
                  <div className="mb-2 flex items-center gap-2">
                    <IconTarget className="size-4 shrink-0 text-brick" />
                    <span className="eyebrow text-brick">نیاز اصلی</span>
                  </div>
                  <p className="text-xs leading-6 text-forest/80">{persona.need}</p>
                </div>

                {persona.concerns && persona.concerns.length > 0 && (
                  <div dir="rtl">
                    <div className="mb-2 flex items-center gap-2">
                      <IconAlertCircle className="size-4 shrink-0 text-forest/35" />
                      <span className="eyebrow text-forest/45">دغدغه‌ها</span>
                    </div>
                    <ul className="space-y-2">
                      {persona.concerns.map((concern) => (
                        <li
                          key={concern}
                          className="flex items-start gap-2 text-xs leading-relaxed text-forest/70"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-forest/25" />
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </BrandbookCard>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  Main Export                                                       */
/* ================================================================== */

export default function StrategicIdentity() {
  return (
    <article className="bg-paper text-forest" dir="rtl">
      <div className="py-20 md:py-28">
        <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28 text-center">
          <FadeUp>
            <span className="eyebrow text-brick">
              فصل دوم
            </span>
          </FadeUp>
          <FadeUp as="h2" delay={0.05} className="mt-4 font-light tracking-tightest text-balance text-forest" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>
            هویت استراتژیک برند
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-forest/70">
            ساختار بنیادین برند — از DNA و ارکان تا شخصیت و کهن‌الگو
          </FadeUp>
          <FadeUp delay={0.14}>
            <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-peach to-peach-deep" />
          </FadeUp>
        </div>
      </div>

      <BrandDnaSection />
      <Divider />
      <BrandPillarsSection />
      <Divider />
      <PositioningSection />
      <Divider />
      <BrandPromiseSection />
      <Divider />
      <PersonalitySection />
      <Divider />
      <ArchetypeSection />
      <Divider />
      <PersonasSection />
    </article>
  );
}
