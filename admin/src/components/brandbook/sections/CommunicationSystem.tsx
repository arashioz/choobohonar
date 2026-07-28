'use client';

import { useState } from 'react';
import {
  brandCommunicationPhilosophy,
  brandStorytelling,
  brandVoice,
  toneOfVoice,
  contentPhilosophy,
  digitalCommunication,
  digitalIdentity,
  visualStorytelling,
} from '@/data/brandbook';
import Stagger from '@/components/motion/Stagger';
import { cn } from '@/lib/utils';
import FadeUp from '@/components/motion/FadeUp';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import BrandbookChapterHeader from '@/components/brandbook/layout/BrandbookChapterHeader';
import BrandbookContainer from '@/components/brandbook/layout/BrandbookContainer';
import BrandbookSectionDivider from '@/components/brandbook/layout/BrandbookSectionDivider';
import BrandPatternField from '@/components/brandbook/layout/BrandPatternField';
import { MessageIcon } from '@/components/brandbook/icons';

/* ─────────────────────────────────────────────────────────────
   5.1 Communication Philosophy & Storytelling
   ───────────────────────────────────────────────────────────── */

function CommunicationPhilosophySection() {
  return (
    <div className="mx-auto mb-20 max-w-5xl space-y-10">
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm">
          <div className="relative text-right">
            <p className="text-base text-forest/80 leading-relaxed mb-6">
            {brandCommunicationPhilosophy.intro}
          </p>
          {'closing' in brandCommunicationPhilosophy && brandCommunicationPhilosophy.closing && (
            <p className="text-sm text-forest/70 leading-relaxed mb-6">
              {brandCommunicationPhilosophy.closing}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {brandCommunicationPhilosophy.coreConcepts.map((c) => (
              <div key={c.titleFa} className="rounded-xl bg-forest/5 p-4 border border-forest/10">
                <h4 className="text-base font-bold text-forest mb-1">{c.titleFa}</h4>
                <p className="text-xs text-forest/70">{c.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </FadeUp>

      {/* Brand Storytelling */}
      <FadeUp>
        <div className="relative overflow-hidden rounded-2xl border border-forest/10 bg-paper p-8">
          <div className="relative text-right">
          <h4 className="text-lg font-bold text-forest mb-2">داستان‌گویی برند</h4>
          <p className="text-sm text-forest/75 mb-6">{brandStorytelling.intro}</p>

          <div className="grid gap-4 sm:grid-cols-3">
            {brandStorytelling.pillars.map((pillar) => (
              <div key={pillar.titleFa} className="rounded-xl border border-forest/10 bg-forest/[0.03] p-5">
                <span className="text-xs font-bold text-brick block mb-1">{pillar.titleFa}</span>
                <p className="text-xs text-forest/80 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
          {'closing' in brandStorytelling && brandStorytelling.closing && (
            <p className="mt-6 text-xs text-forest/70 leading-relaxed">{brandStorytelling.closing}</p>
          )}
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5.2 Brand Voice — Attributes + Spectrum Sliders
   ───────────────────────────────────────────────────────────── */

function BrandVoiceSection() {
  return (
    <div id="brand-voice" className="relative mb-20 scroll-mt-28 overflow-hidden rounded-3xl border border-forest/[0.06] bg-forest/[0.02] px-5 py-10 sm:px-8 sm:py-12">
      <BrandPatternField
        variant="mono"
        surface="light"
        mask="soft"
        strength="soft"
        motion="scroll"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/75 to-paper/90"
      />

      <div className="relative">
      <FadeUp>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-forest/70 text-right sm:text-center">
          {brandVoice.intro}
        </p>
      </FadeUp>

      <FadeUp>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {brandVoice.attributes.map((attr) => (
            <BrandbookCard
              key={attr.titleFa}
              surface="glass"
              lift="none"
              className="flex flex-col gap-2 p-5 hover:shadow-md hover:border-peach/30"
            >
              <div className="flex items-center gap-2">
                <MessageIcon size={20} className="shrink-0 text-forest" />
                <h4 className="text-sm font-bold text-forest">{attr.titleFa}</h4>
              </div>
              <p className="text-xs leading-relaxed text-forest/60">
                {attr.description}
              </p>
            </BrandbookCard>
          ))}
        </div>
      </FadeUp>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5.3 Tone of Voice — Tab Switcher
   ───────────────────────────────────────────────────────────── */

function ToneOfVoiceSection() {
  const [activeTone, setActiveTone] = useState(0);
  const contexts = toneOfVoice.contexts;

  return (
    <div id="tone-of-voice" className="mb-20 scroll-mt-28">
      <FadeUp>
        <p className="mb-8 max-w-3xl text-base leading-relaxed text-forest/70">
          {toneOfVoice.intro}
        </p>
      </FadeUp>

      <div className="mb-8 hidden gap-4 lg:grid lg:grid-cols-2">
        {contexts.map((item, i) => (
          <FadeUp key={item.context} delay={i * 0.06}>
            <BrandbookCard
              surface="glass"
              lift="sm"
              className="flex h-full flex-col p-6 hover:shadow-md hover:shadow-forest/[0.04]"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-base font-medium text-forest">{item.context}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {item.tone.split("،").map((tag) => (
                    <span
                      key={tag.trim()}
                      className="rounded-full bg-forest/[0.05] px-2.5 py-1 text-[11px] font-medium text-forest/65"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <blockquote className="mt-auto border-t border-forest/[0.06] pt-4">
                <p className="text-sm font-light leading-relaxed text-forest/85 sm:text-base">
                  {item.example}
                </p>
              </blockquote>
            </BrandbookCard>
          </FadeUp>
        ))}
      </div>

      <FadeUp className="lg:hidden">
        <div className="mb-6 flex flex-wrap gap-2">
          {contexts.map((t, i) => (
            <button
              key={t.context}
              type="button"
              onClick={() => setActiveTone(i)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300",
                activeTone === i
                  ? "bg-forest text-paper shadow-md"
                  : "bg-forest/[0.06] text-forest/70 hover:bg-forest/10",
              )}
            >
              {t.context}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-forest/10 bg-paper/70 p-6 backdrop-blur-sm">
          <div className="mb-5 flex flex-wrap gap-2">
            {contexts[activeTone].tone.split("،").map((tag) => (
              <span
                key={tag.trim()}
                className="rounded-full bg-forest/[0.05] px-2.5 py-1 text-[11px] font-medium text-forest/65"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
          <blockquote>
            <p className="text-base font-light leading-relaxed text-forest/85">
              {contexts[activeTone].example}
            </p>
            <footer className="mt-3 text-xs text-forest/45">
              {contexts[activeTone].context}
            </footer>
          </blockquote>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5.4 Content Philosophy & Digital Principles
   ───────────────────────────────────────────────────────────── */

function ContentRolesSection() {
  return (
    <div className="space-y-12">
      <FadeUp>
        <p className="text-sm text-forest/75 mb-6">{contentPhilosophy.intro}</p>
      </FadeUp>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {contentPhilosophy.principles.map((principle, i) => (
          <FadeUp key={principle.titleFa} delay={i * 0.1}>
            <div className="flex flex-col gap-4 rounded-2xl border border-forest/10 bg-white/60 p-6 sm:p-8 h-full">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-forest">{principle.titleFa}</h4>
                  <span className="text-xs font-mono text-forest/40">{principle.titleEn}</span>
                </div>
                <p className="text-xs text-forest/70">{principle.description}</p>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      {/* Visual Storytelling */}
      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-forest/5 p-8">
          <h4 className="text-lg font-bold text-forest mb-2">اصول عکاسی و تصویر برند</h4>
          <p className="text-xs text-forest/70 mb-6">{visualStorytelling.intro}</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {visualStorytelling.principles.map((principle) => (
              <div key={principle.titleFa} className="rounded-xl bg-paper border border-forest/10 p-4">
                <h5 className="text-sm font-bold text-forest mb-1">{principle.titleFa}</h5>
                <p className="text-xs text-forest/70 leading-relaxed">{principle.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-peach/20 p-4 rounded-xl text-center border border-peach/40">
            <p className="text-xs font-bold text-brick">{visualStorytelling.closing}</p>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5.5 Digital Identity — Websites & Social Channels
   ───────────────────────────────────────────────────────────── */

function DigitalIdentitySection() {
  const [activeChannel, setActiveChannel] = useState(0);
  const channel = digitalIdentity.channels[activeChannel];

  return (
    <div id="digital-identity" className="scroll-mt-28 space-y-12">
      <FadeUp>
        <p className="max-w-3xl text-sm leading-7 text-forest/70">{digitalIdentity.intro}</p>
      </FadeUp>

      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h4 className="text-lg font-medium text-forest">کانال‌های رسمی دیجیتال</h4>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/35" dir="ltr">
                Digital Touchpoints
              </p>
            </div>
            <div className="text-left text-xs text-forest/50" dir="ltr">
              {digitalIdentity.contact.email}
              <span className="mx-2 text-forest/20">·</span>
              {digitalIdentity.contact.phoneIntl}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {digitalIdentity.channels.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl border border-forest/10 bg-paper px-4 py-4 transition-all duration-300 hover:border-forest/20 hover:shadow-sm"
              >
                <p className="text-sm font-medium text-forest">{item.platformFa}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-forest/35" dir="ltr">
                  {item.platformEn}
                </p>
                <p className="mt-3 text-xs text-teal" dir="ltr">{item.handle}</p>
                <p className="mt-2 text-[11px] leading-5 text-forest/55">{item.role}</p>
              </a>
            ))}
          </div>
        </div>
      </FadeUp>

      <div>
        <FadeUp>
          <h4 className="mb-2 text-lg font-medium text-forest">وب‌سایت‌ها</h4>
          <p className="mb-6 text-sm text-forest/55">مسیرهای اصلی وب‌سایت و نقش هر بخش در تجربه دیجیتال برند.</p>
        </FadeUp>

        <Stagger className="grid gap-4" amount={0.35}>
          {digitalIdentity.websites.map((site) => (
            <BrandbookCard key={site.id} lift="sm" className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h5 className="text-base font-semibold text-forest">{site.titleFa}</h5>
                    <span className="text-[10px] uppercase tracking-[0.12em] text-forest/35" dir="ltr">
                      {site.titleEn}
                    </span>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-teal transition-colors hover:text-forest"
                    dir="ltr"
                  >
                    {site.url.replace(/^https?:\/\//, "")}
                  </a>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-forest/65">{site.role}</p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:w-[22rem]">
                  {site.sections.map((section) => (
                    <a
                      key={section.path}
                      href={`${site.url.replace(/\/$/, "")}${section.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-forest/10 bg-forest/[0.03] px-3 py-2 text-xs text-forest/75 transition-colors hover:border-forest/20 hover:bg-forest/[0.06]"
                    >
                      {section.label}
                    </a>
                  ))}
                </div>
              </div>
            </BrandbookCard>
          ))}
        </Stagger>
      </div>

      <div>
        <FadeUp>
          <h4 className="mb-2 text-lg font-medium text-forest">نحوه تعامل در شبکه‌های اجتماعی</h4>
          <p className="mb-6 text-sm text-forest/55">
            لحن و قواعد پاسخ‌گویی در هر کانال — مطابق شخصیت و لحن برند.
          </p>
        </FadeUp>

        <FadeUp>
          <div className="mb-5 flex flex-wrap gap-2">
            {digitalIdentity.channels.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveChannel(i)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition-all duration-300",
                  activeChannel === i
                    ? "bg-forest text-paper shadow-md"
                    : "border border-forest/10 bg-paper text-forest/70 hover:border-forest/20",
                )}
              >
                {item.platformFa}
              </button>
            ))}
          </div>
        </FadeUp>

        <FadeUp key={channel.id}>
          <BrandbookCard lift="none" className="overflow-hidden">
            <div className="border-b border-forest/[0.07] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h5 className="text-xl font-medium text-forest">{channel.platformFa}</h5>
                  <p className="mt-1 text-xs text-forest/45" dir="ltr">{channel.handle}</p>
                </div>
                <span className="rounded-full bg-peach/20 px-3 py-1 text-xs font-medium text-brick">
                  لحن: {channel.tone}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-forest/65">{channel.interaction.replyStyle}</p>
            </div>

            <div className="grid gap-0 lg:grid-cols-3">
              <div className="border-b border-forest/[0.07] p-6 lg:border-b-0 lg:border-l">
                <p className="eyebrow mb-3 text-forest/45">نوع محتوا</p>
                <ul className="space-y-2">
                  {channel.contentTypes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs leading-6 text-forest/70">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-teal/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-b border-forest/[0.07] p-6 lg:border-b-0 lg:border-l">
                <p className="eyebrow mb-3 text-sage">انجام دهید</p>
                <ul className="space-y-2">
                  {channel.interaction.do.map((item) => (
                    <li key={item} className="text-xs leading-6 text-forest/70">{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-6">
                <p className="eyebrow mb-3 text-brick">اجتناب کنید</p>
                <ul className="space-y-2">
                  {channel.interaction.dont.map((item) => (
                    <li key={item} className="text-xs leading-6 text-forest/70">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </BrandbookCard>
        </FadeUp>
      </div>

      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-forest/[0.03] p-6 sm:p-8">
          <h4 className="mb-4 text-base font-medium text-forest">اصول ارتباطات دیجیتال</h4>
          <p className="text-sm text-forest/70 mb-4">{digitalCommunication.intro}</p>
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            {digitalCommunication.principles.map((principle) => (
              <div key={principle} className="flex items-center gap-2 text-sm text-forest/75">
                <span className="size-1.5 shrink-0 rounded-full bg-peach" />
                {principle}
              </div>
            ))}
          </div>
          {'closing' in digitalCommunication && digitalCommunication.closing && (
            <p className="mb-6 text-xs leading-relaxed text-forest/65 border-t border-forest/10 pt-5">
              {digitalCommunication.closing}
            </p>
          )}
          <ul className="space-y-2 border-t border-forest/10 pt-5">
            {digitalIdentity.globalRules.map((rule) => (
              <li key={rule} className="text-xs leading-6 text-forest/65">{rule}</li>
            ))}
          </ul>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

export default function CommunicationSystem() {
  return (
    <section id="communication-system" className="relative w-full bg-paper text-forest">
      <BrandbookChapterHeader
        chapter="فصل پنجم"
        title="سیستم ارتباطات برند"
        subtitle="فلسفه ارتباطات، داستان‌گویی، صدا و لحن، اصول محتوا، هویت دیجیتال و عکاسی برند."
      />

      <BrandbookContainer className="pb-20 md:pb-28">
        <BrandbookSectionDivider
          number="۵.۱"
          title="فلسفه ارتباطات و داستان‌گویی"
          subtitle="انتقال نگاه به زندگی و روایت سه گانه گذشته، حال و آینده."
        />
        <CommunicationPhilosophySection />

        <BrandbookSectionDivider
          number="۵.۲"
          title="شخصیت کلامی برند"
          subtitle="پنج ویژگی اصلی صدای برند — آرام، اصیل و متخصص."
        />
        <BrandVoiceSection />

        <BrandbookSectionDivider
          number="۵.۳"
          title="لحن برند"
          subtitle="لحن در هر موقعیت متفاوت است، اما شخصیت برند ثابت می‌ماند."
        />
        <ToneOfVoiceSection />

        <BrandbookSectionDivider
          number="۵.۴"
          title="اصول محتوا و تصویر برند"
          subtitle="نقش‌های چهارگانه محتوا، قانون طلایی و اصول عکاسی."
        />
        <ContentRolesSection />

        <BrandbookSectionDivider
          number="۵.۵"
          title="هویت دیجیتال"
          subtitle="وب‌سایت‌ها، شبکه‌های اجتماعی رسمی و قواعد تعامل در هر کانال."
        />
        <DigitalIdentitySection />
      </BrandbookContainer>
    </section>
  );
}
