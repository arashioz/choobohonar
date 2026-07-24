'use client';

import {
  brandCulture,
  employeeRole,
  brandBehaviors,
  brandDosAndDonts,
  brandGrowthVision,
  manifesto,
} from '@/data/brandbook';
import FadeUp from '@/components/motion/FadeUp';
import StagedTextReveal from '@/components/motion/StagedTextReveal';
import RevealLine from '@/components/motion/RevealLine';
import BrandbookContainer from '@/components/brandbook/layout/BrandbookContainer';
import {
  CheckCircleIcon,
  CheckIcon,
  XCircleIcon,
  XIcon,
} from '@/components/brandbook/icons';

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
   7.1 Brand Culture & Behaviors
   ───────────────────────────────────────────────────────────── */

function CultureAndBehaviorsSection() {
  return (
    <div className="mb-14 space-y-8">
      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm">
          <h4 className="text-lg font-bold text-forest mb-2">فرهنگ سازمانی و نقش کارکنان</h4>
          <p className="text-sm text-forest/80 leading-relaxed mb-4">{brandCulture.intro}</p>
          <div className="rounded-xl bg-forest/5 p-4 border border-forest/10">
            <p className="text-xs font-semibold text-brick">{employeeRole.statement}</p>
          </div>
        </div>
      </FadeUp>

      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-paper p-8">
          <h4 className="text-lg font-bold text-forest mb-6">اصول رفتار برند</h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brandBehaviors.map((b) => (
              <div key={b.titleFa} className="rounded-xl bg-forest/[0.03] p-5 border border-forest/10">
                <h5 className="text-base font-bold text-forest mb-2">{b.titleFa}</h5>
                <p className="text-xs text-forest/70 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   7.2 Do's & Don'ts
   ───────────────────────────────────────────────────────────── */

function DosAndDontsSection() {
  return (
    <FadeUp>
      <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Do's column */}
        <div className="rounded-2xl bg-sage/10 p-6 sm:p-8 border border-sage/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/30">
              <CheckIcon size={24} className="text-forest" />
            </div>
            <h4 className="text-lg font-bold tracking-tightest text-forest">
              بایدها (Do&apos;s)
            </h4>
          </div>

          <ul className="flex flex-col gap-3">
            {brandDosAndDonts.dos.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 shrink-0 text-forest" />
                <span className="text-sm leading-relaxed text-forest/80">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts column */}
        <div className="rounded-2xl bg-brick/10 p-6 sm:p-8 border border-brick/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brick/20">
              <XIcon size={24} className="text-brick" />
            </div>
            <h4 className="text-lg font-bold tracking-tightest text-forest">
              نبایدها (Don&apos;ts)
            </h4>
          </div>

          <ul className="flex flex-col gap-3">
            {brandDosAndDonts.donts.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <XCircleIcon className="mt-0.5 shrink-0 text-brick" />
                <span className="text-sm leading-relaxed text-forest/80">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   7.3 Brand Growth Vision
   ───────────────────────────────────────────────────────────── */

function GrowthVisionSection() {
  return (
    <FadeUp>
      <div className="mb-20 rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm">
        <h4 className="text-lg font-bold text-forest mb-2">چشم‌انداز توسعه برند</h4>
        <p className="text-sm text-forest/80 leading-relaxed mb-6">{brandGrowthVision.intro}</p>

        <div className="mb-6">
          <span className="text-xs font-bold text-forest/50 block mb-3">مسیر توسعه آینده برند شامل:</span>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {brandGrowthVision.futurePath.map((path) => (
              <div key={path} className="rounded-xl bg-forest/5 p-4 text-xs font-medium text-forest/85">
                • {path}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-peach/20 p-4 rounded-xl text-center border border-peach/40">
          <p className="text-sm font-bold text-brick">
            هدف نهایی: {brandGrowthVision.ultimateGoal}
          </p>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   7.4 Brand Manifesto
   ───────────────────────────────────────────────────────────── */

function ManifestoSection() {
  return (
    <StagedTextReveal
      lines={manifesto.lines}
      signature={manifesto.signature}
      tagline={manifesto.tagline}
      taglineEn={manifesto.taglineEn}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

export default function CultureFuture() {
  return (
    <section
      id="culture-future"
      className="relative w-full bg-paper pt-20 text-forest md:pt-28"
    >
      <BrandbookContainer>
        {/* Chapter Title */}
        <FadeUp>
          <div className="mb-12 flex flex-col gap-3 sm:mb-14">
            <span className="eyebrow text-brick">فصل هفتم</span>
            <h2 className="text-4xl font-light tracking-tightest text-forest sm:text-5xl lg:text-6xl">
              فرهنگ و آینده برند
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-forest/60 sm:text-lg">
              فرهنگ سازمانی، نقش کارکنان، رفتار برند، بایدها و نبایدها، چشم‌انداز توسعه و مانیفست.
            </p>
            <RevealLine className="mt-2 w-12" origin="right" />
          </div>
        </FadeUp>

        {/* 7.1 Culture & Behaviors */}
        <SectionDivider
          number="۷.۱"
          title="فرهنگ سازمانی و رفتار برند"
          subtitle="نقش هر عضو سازمان و چهار اصل رفتار برند در تعاملات."
        />
        <CultureAndBehaviorsSection />

        {/* 7.2 Do's & Don'ts */}
        <SectionDivider
          number="۷.۲"
          title="بایدها و نبایدها"
          subtitle="اصول رفتاری برند در ارتباطات و محتوا."
        />
        <DosAndDontsSection />

        {/* 7.3 Growth Vision */}
        <SectionDivider
          number="۷.۳"
          title="چشم‌انداز توسعه برند"
          subtitle="مسیر توسعه آینده از یک برند محصول به مرجع سبک زندگی."
        />
        <GrowthVisionSection />

        {/* 7.4 Manifesto */}
        <SectionDivider
          number="۷.۴"
          title="مانیفست برند"
          subtitle="بیانیه‌ای برای تمام آنچه باور داریم."
        />
      </BrandbookContainer>

      <ManifestoSection />
    </section>
  );
}
