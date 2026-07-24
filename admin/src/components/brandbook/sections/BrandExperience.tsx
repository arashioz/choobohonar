'use client';

import { useState } from 'react';
import {
  customerExperiencePhilosophy,
  customerJourney,
  showroomExperience,
  serviceExperience,
} from '@/data/brandbook';
import { cn } from '@/lib/utils';
import FadeUp from '@/components/motion/FadeUp';
import RevealLine from '@/components/motion/RevealLine';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import {
  CompassIcon,
  DiamondIcon,
  HeartHandIcon,
  LeafIcon,
} from '@/components/brandbook/icons';

const showroomIcons = [LeafIcon, DiamondIcon, CompassIcon, HeartHandIcon];

/* ─────────────────────────────────────────────────────────────
   Section Divider
   ───────────────────────────────────────────────────────────── */

function SectionDivider({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <FadeUp>
      <div className="mb-10 flex flex-col gap-2">
        <span className="eyebrow text-brick">{number}</span>
        <h3 className="text-2xl font-light tracking-tightest text-forest sm:text-3xl">
          {title}
        </h3>
        {subtitle && (
          <p className="max-w-2xl text-sm leading-relaxed text-forest/60">
            {subtitle}
          </p>
        )}
        <div className="mt-3 h-px w-16 bg-forest/20" />
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   4.1 Customer Experience Philosophy
   ───────────────────────────────────────────────────────────── */

function CustomerExperiencePhilosophySection() {
  return (
    <FadeUp>
      <div className="mb-20 space-y-8">
        <p className="max-w-3xl text-base leading-relaxed text-forest/80">
          {customerExperiencePhilosophy.intro}
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {customerExperiencePhilosophy.principles.map((p, idx) => (
            <div key={p.titleFa} className="rounded-2xl border border-forest/10 bg-white/60 p-6 backdrop-blur-sm">
              <span className="text-xs font-bold text-brick block mb-2">اصل ۰{idx + 1}</span>
              <h4 className="text-lg font-semibold text-forest mb-2">{p.titleFa}</h4>
              <p className="text-xs text-forest/70 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   4.2 Customer Journey — 5-Step Flow
   ───────────────────────────────────────────────────────────── */

function CustomerJourneySection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <FadeUp>
      <div className="mb-20">
        {/* Desktop: horizontal flow */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute top-6 right-6 left-6 h-px bg-forest/15" />

            <div className="relative flex justify-between">
              {customerJourney.map((step, i) => {
                const isActive = activeStep === i;
                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => setActiveStep(i)}
                    className="group flex flex-col items-center gap-3"
                  >
                    <div
                      className={cn(
                        'relative z-10 flex h-12 w-12 items-center justify-center rounded-full',
                        'border-2 transition-all duration-300',
                        isActive
                          ? 'border-peach bg-forest text-paper scale-110 shadow-lg shadow-forest/20'
                          : 'border-forest/20 bg-paper text-forest hover:border-peach/50 hover:shadow-md',
                      )}
                    >
                      <span className={cn(
                        'text-sm font-bold',
                        isActive ? 'text-peach' : 'text-forest/60',
                      )}>
                        {step.step}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <span className={cn(
                        'text-sm font-medium transition-colors duration-200',
                        isActive ? 'text-forest' : 'text-forest/60',
                      )}>
                        {step.titleFa}
                      </span>
                      <span className="text-[10px] font-medium text-forest/30">
                        {step.titleEn}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <div
              className={cn(
                'max-w-lg rounded-2xl border border-forest/10 bg-white/60 p-6 text-center',
                'backdrop-blur-sm shadow-sm transition-all duration-300',
              )}
            >
              <p className="text-sm font-medium text-forest/50">هدف این مرحله</p>
              <p className="mt-2 text-base leading-relaxed text-forest">
                {customerJourney[activeStep].goal}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile: vertical flow */}
        <div className="flex flex-col gap-0 md:hidden">
          {customerJourney.map((step, i) => {
            const isActive = activeStep === i;
            const isLast = i === customerJourney.length - 1;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(i)}
                className="flex items-start gap-4 text-right"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full',
                      'border-2 transition-all duration-300',
                      isActive
                        ? 'border-peach bg-forest text-paper shadow-md'
                        : 'border-forest/20 bg-paper text-forest',
                    )}
                  >
                    <span className={cn(
                      'text-xs font-bold',
                      isActive ? 'text-peach' : 'text-forest/60',
                    )}>
                      {step.step}
                    </span>
                  </div>
                  {!isLast && (
                    <div className="h-12 w-px bg-forest/15" />
                  )}
                </div>

                <div className={cn(
                  'pb-6 pt-1.5',
                  isActive ? 'opacity-100' : 'opacity-60',
                )}>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-forest">
                      {step.titleFa}
                    </span>
                    <span className="text-[10px] font-medium text-forest/30">
                      {step.titleEn}
                    </span>
                  </div>
                  {isActive && (
                    <p className="mt-2 text-sm leading-relaxed text-forest/70">
                      {step.goal}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   4.3 Showroom & Service Experience
   ───────────────────────────────────────────────────────────── */

function ShowroomSection() {
  return (
    <div className="space-y-12">
      <FadeUp>
        <div className="rounded-2xl bg-forest/5 p-6 border border-forest/10 mb-6">
          <p className="text-sm text-forest/80 leading-relaxed">{showroomExperience.intro}</p>
        </div>
      </FadeUp>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {showroomExperience.principles.map((principle, i) => {
          const Icon = showroomIcons[i];
          return (
            <FadeUp key={principle.titleFa} delay={i * 0.1}>
              <BrandbookCard
                lift="md"
                surface="glass"
                className="flex h-full flex-col items-center justify-between gap-4 p-8 text-center hover:shadow-lg hover:border-peach/30"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/[0.06] transition-colors duration-300 group-hover:bg-forest group-hover:text-paper">
                  <Icon size={28} className="text-forest transition-colors duration-300 group-hover:text-peach" />
                </div>

                <div>
                  <h4 className="text-lg font-bold text-forest mb-2">
                    {principle.titleFa}
                  </h4>
                  <p className="text-xs text-forest/70 leading-relaxed">
                    {principle.description}
                  </p>
                </div>

                <div className="h-px w-10 bg-forest/10 transition-all duration-300 group-hover:w-16 group-hover:bg-peach" />
              </BrandbookCard>
            </FadeUp>
          );
        })}
      </div>

      {/* Service Experience */}
      <FadeUp>
        <div className="mt-12 rounded-2xl border border-forest/10 bg-paper p-8">
          <h4 className="text-lg font-bold text-forest mb-2">تجربه خدمات و پشتیبانی</h4>
          <p className="text-xs text-forest/70 mb-6">{serviceExperience.intro}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceExperience.attributes.map((attr) => (
              <div key={attr.titleFa} className="rounded-xl bg-forest/5 p-4 border border-forest/10">
                <h5 className="text-sm font-bold text-forest mb-1">{attr.titleFa}</h5>
                <p className="text-xs text-forest/65">{attr.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

export default function BrandExperience() {
  return (
    <section
      id="brand-experience"
      className="relative w-full bg-paper py-20 text-forest md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        {/* Chapter Title */}
        <FadeUp>
          <div className="mb-16 flex flex-col gap-3 sm:mb-20">
            <span className="eyebrow text-brick">فصل چهارم</span>
            <h2 className="text-4xl font-light tracking-tightest text-forest sm:text-5xl lg:text-6xl">
              تجربه برند
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-forest/60 sm:text-lg">
              فلسفه تجربه مشتری، مراحل سفر مشتری، اصول حضور در شوروم و تجربه خدمات.
            </p>
            <RevealLine className="mt-2 w-12" origin="right" />
          </div>
        </FadeUp>

        {/* 4.1 Customer Experience Philosophy */}
        <SectionDivider
          number="۴.۱"
          title="فلسفه تجربه مشتری"
          subtitle="اصول سه گانه تعامل با مشتری پیش از فروش، در حین مشاوره و احترام به انتخاب."
        />
        <CustomerExperiencePhilosophySection />

        {/* 4.2 Customer Journey */}
        <SectionDivider
          number="۴.۲"
          title="سفر مشتری"
          subtitle="پنج مرحله کلیدی در مسیر تعامل مشتری با برند."
        />
        <CustomerJourneySection />

        {/* 4.3 Showroom & Service Experience */}
        <SectionDivider
          number="۴.۳"
          title="تجربه شوروم و خدمات"
          subtitle="اصول حاکم بر فضای نمایشگاهی و خدمات پس از فروش خانه چوب و هنر."
        />
        <ShowroomSection />
      </div>
    </section>
  );
}
