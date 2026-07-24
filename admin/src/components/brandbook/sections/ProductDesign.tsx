'use client';

import {
  productPhilosophy,
  ourViewOfProducts,
  designPhilosophy,
  materialPhilosophy,
  craftsmanshipPhilosophy,
  qualityPhilosophy,
  timelessVsTrend,
  premiumConcept,
  productCurationPhilosophy,
  homeAsUltimateProduct,
} from '@/data/brandbook';
import { cn } from '@/lib/utils';
import FadeUp from '@/components/motion/FadeUp';
import RevealLine from '@/components/motion/RevealLine';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import {
  DiamondIcon,
  EyeIcon,
  HeartIcon,
  InfinityIcon,
  SettingsIcon,
  SquareIcon,
  StarIcon,
  TreeIcon,
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
   3.1 Product Philosophy & View of Products
   ───────────────────────────────────────────────────────────── */

const pillarIcons = [EyeIcon, HeartIcon, InfinityIcon];

function ProductPhilosophySection() {
  return (
    <FadeUp>
      <div className="mb-20 space-y-12">
        <p className="max-w-3xl text-base leading-relaxed text-forest/80">
          {productPhilosophy.intro}
        </p>

        {/* 3 Pillars Circles */}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-4 md:flex-row md:gap-0">
          {productPhilosophy.pillars.map((pillar, i) => {
            const Icon = pillarIcons[i];
            return (
              <div
                key={pillar}
                className={cn(
                  'relative flex h-48 w-48 flex-col items-center justify-center rounded-full',
                  'border-2 border-forest/10 text-center p-4',
                  'transition-all duration-300 hover:border-peach/40 hover:shadow-lg',
                  i === 1 && 'z-10 md:-mx-6 bg-forest/[0.04]',
                  i === 0 && 'bg-sage/10',
                  i === 2 && 'bg-peach/10',
                  'md:h-56 md:w-56',
                )}
              >
                <Icon className="mb-3 text-brick" />
                <p className="text-sm font-medium leading-snug text-forest">
                  {pillar}
                </p>
              </div>
            );
          })}
        </div>

        <p className="max-w-3xl text-sm font-medium leading-relaxed text-brick text-center bg-peach/10 p-4 rounded-xl mx-auto">
          {productPhilosophy.closing}
        </p>

        {/* Our View of Products */}
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm">
          <h4 className="text-lg font-semibold text-forest mb-2">نگاه برند به محصول</h4>
          <p className="text-sm text-forest/75 mb-6">{ourViewOfProducts.intro}</p>
          
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {ourViewOfProducts.questions.map((q, idx) => (
              <div key={idx} className="flex items-center gap-3 rounded-lg bg-forest/5 p-4 text-sm text-forest/85">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-forest text-paper text-xs font-bold">{idx + 1}</span>
                <span>{q}</span>
              </div>
            ))}
          </div>

          <p className="text-xs font-medium text-forest/60 italic border-t border-forest/10 pt-4">
            {ourViewOfProducts.closing}
          </p>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   3.2 Design Philosophy — Elements + Principles
   ───────────────────────────────────────────────────────────── */

const elementIcons = [SquareIcon, SettingsIcon, HeartIcon, InfinityIcon];

function DesignPhilosophySection() {
  return (
    <div className="mb-20">
      <p className="max-w-3xl text-sm leading-relaxed text-forest/75 mb-8">
        {designPhilosophy.intro}
      </p>

      {/* 4 Elements */}
      <FadeUp>
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {designPhilosophy.elements.map((el, i) => {
            const Icon = elementIcons[i];
            return (
              <BrandbookCard
                key={el.titleEn}
                surface="glass"
                lift="sm"
                className="flex flex-col items-center gap-3 p-6 text-center"
              >
                <Icon size={20} className="text-forest" />
                <div>
                  <p className="text-base font-bold text-forest">{el.titleFa}</p>
                  <p className="text-xs font-mono text-forest/40">{el.titleEn}</p>
                  <p className="mt-2 text-xs text-forest/65">{el.description}</p>
                </div>
              </BrandbookCard>
            );
          })}
        </div>
      </FadeUp>

      {/* 4 Principles */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {designPhilosophy.principles.map((p, i) => (
          <FadeUp key={p.number} delay={i * 0.1}>
            <BrandbookCard
              surface="glass"
              lift="sm"
              className="group flex gap-5 p-6 hover:shadow-md hover:border-peach/30"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-forest/[0.06] transition-colors duration-300 group-hover:bg-forest group-hover:text-paper">
                <span className="text-xl font-light text-forest group-hover:text-paper">
                  {p.number}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h4 className="text-base font-semibold text-forest">{p.titleFa}</h4>
                <p className="text-xs font-mono text-forest/40">{p.titleEn}</p>
                <p className="mt-1 text-sm leading-relaxed text-forest/70">
                  {p.description}
                </p>
              </div>
            </BrandbookCard>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3.3 Material, Craftsmanship & Quality
   ───────────────────────────────────────────────────────────── */

function MaterialCraftsmanshipSection() {
  return (
    <div className="mb-20 space-y-10">
      {/* Material Quote */}
      <FadeUp>
        <div className="relative rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm sm:p-12">
          <div className="absolute right-8 top-6 text-7xl font-light leading-none text-forest/[0.06] sm:text-8xl">
            &ldquo;
          </div>
          <div className="absolute right-0 top-8 bottom-8 w-1 rounded-full bg-peach" />

          <blockquote className="relative pr-8">
            <p className="text-xl font-light leading-relaxed text-forest sm:text-2xl lg:text-3xl">
              {materialPhilosophy.quote}
            </p>
          </blockquote>

          <div className="mt-8 flex flex-wrap gap-3">
            {materialPhilosophy.features.map((f) => (
              <span
                key={f}
                className={cn(
                  'flex items-center gap-2 rounded-full bg-forest/[0.06] px-4 py-2',
                  'text-xs font-medium text-forest/80',
                )}
              >
                <TreeIcon className="h-3.5 w-3.5" />
                {f}
              </span>
            ))}
          </div>

          <p className="mt-6 text-xs text-forest/60 italic border-t border-forest/10 pt-4">
            {materialPhilosophy.closing}
          </p>
        </div>
      </FadeUp>

      {/* Craftsmanship Philosophy */}
      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-paper p-8">
          <h4 className="text-lg font-bold text-forest mb-2">فلسفه صنعتگری</h4>
          <p className="text-sm text-forest/75 mb-4">{craftsmanshipPhilosophy.intro}</p>
          <div className="grid gap-3 sm:grid-cols-3 mb-4">
            {craftsmanshipPhilosophy.traits.map((trait, idx) => (
              <div key={idx} className="rounded-xl bg-forest/5 p-4 text-xs font-medium text-forest/85">
                • {trait}
              </div>
            ))}
          </div>
          <p className="text-xs text-brick font-medium">{craftsmanshipPhilosophy.closing}</p>
        </div>
      </FadeUp>

      {/* Quality Culture */}
      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-white/60 p-8 backdrop-blur-sm">
          <h4 className="text-lg font-bold text-forest mb-2">مفهوم کیفیت در برند</h4>
          <p className="text-sm text-forest/75 mb-6">{qualityPhilosophy.intro}</p>

          <div className="mb-8 flex flex-wrap items-center gap-2 rounded-xl bg-forest/[0.04] p-4">
            <span className="text-xs font-bold text-forest/50">مسیر ۷ مرحله‌ای کیفیت:</span>
            {qualityPhilosophy.lifecycle.map((step, idx) => (
              <span key={step} className="flex items-center gap-1.5 text-xs text-forest/80">
                <span className="rounded bg-forest/10 px-2.5 py-1 font-medium">{step}</span>
                {idx < qualityPhilosophy.lifecycle.length - 1 && <span className="text-forest/30">←</span>}
              </span>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {qualityPhilosophy.dimensions.map((dim) => (
              <div key={dim.titleFa} className="rounded-xl border border-forest/10 bg-paper p-5">
                <h5 className="text-base font-bold text-forest mb-1">{dim.titleFa}</h5>
                <p className="text-xs text-forest/70">{dim.description}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Timeless vs Trend */}
      <FadeUp>
        <div className="rounded-2xl bg-sage/10 p-8 border border-sage/30">
          <h4 className="text-lg font-bold text-forest mb-2">ماندگاری در برابر مدگرایی</h4>
          <p className="text-sm text-forest/80 mb-6">{timelessVsTrend.belief}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {timelessVsTrend.characteristics.map((char, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs font-medium text-forest/85">
                <span className="size-2 rounded-full bg-forest" />
                <span>{char}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   3.4 Premium, Curated Living & Curation
   ───────────────────────────────────────────────────────────── */

function PremiumCuratedSection() {
  return (
    <div className="space-y-10">
      <FadeUp>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Premium panel */}
          <div className="flex flex-col gap-6 rounded-2xl bg-forest p-8 text-paper sm:p-10">
            <div className="flex items-center gap-3">
              <DiamondIcon size={20} className="text-peach" />
              <h4 className="text-2xl font-light tracking-tightest">
                {premiumConcept.premium.titleFa}
              </h4>
            </div>

            <p className="text-sm text-paper/80 leading-relaxed">{premiumConcept.premium.intro}</p>

            <ul className="flex flex-col gap-3">
              {premiumConcept.premium.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-paper/90">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-peach" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-paper/10 pt-6">
              <p className="text-base font-light italic leading-relaxed text-paper/75">
                &ldquo;{premiumConcept.premium.quote}&rdquo;
              </p>
            </div>
          </div>

          {/* Curated Living panel */}
          <div className="flex flex-col gap-6 rounded-2xl border-2 border-forest/10 bg-white/60 p-8 backdrop-blur-sm sm:p-10">
            <div className="flex items-center gap-3">
              <StarIcon size={20} className="text-forest" />
              <div>
                <h4 className="text-2xl font-light tracking-tightest text-forest">
                  {premiumConcept.curatedLiving.titleFa}
                </h4>
                <p className="text-xs text-forest/50 font-medium">{premiumConcept.curatedLiving.subtitle}</p>
              </div>
            </div>

            <p className="text-base leading-relaxed text-forest/80">
              {premiumConcept.curatedLiving.description}
            </p>

            {/* Visual formula breakdown */}
            <div className="mt-auto flex flex-wrap items-center gap-2 rounded-xl bg-forest/[0.04] p-5">
              <span className="text-xs font-medium text-forest/70 w-full mb-1">فرمول خانه هماهنگ:</span>
              <p className="text-xs font-mono font-bold text-forest">{premiumConcept.curatedLiving.elementsFormula}</p>
            </div>
          </div>
        </div>
      </FadeUp>

      {/* Product Curation & Home as Ultimate Product */}
      <FadeUp>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Curation */}
          <div className="rounded-2xl border border-forest/10 bg-paper p-8">
            <h4 className="text-lg font-bold text-forest mb-2">فلسفه انتخاب محصولات مکمل</h4>
            <p className="text-xs text-forest/70 mb-4">{productCurationPhilosophy.intro}</p>
            <ul className="space-y-2 mb-6">
              {productCurationPhilosophy.criteria.map((c) => (
                <li key={c} className="text-xs text-forest/80 flex items-center gap-2">
                  <span className="size-1.5 bg-brick rounded-full" />
                  {c}
                </li>
              ))}
            </ul>
            <p className="mb-2 text-xs text-forest/70">{productCurationPhilosophy.coreQuestionLeadIn}</p>
            <p className="text-xs font-semibold text-brick bg-peach/20 p-3 rounded-lg text-center">
              {productCurationPhilosophy.coreQuestion}
            </p>
          </div>

          {/* Ultimate Product */}
          <div className="rounded-2xl border border-forest/10 bg-forest/5 p-8 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-forest mb-2">تجربه خانه به عنوان محصول نهایی</h4>
              <p className="text-sm text-forest/80 mb-6">{homeAsUltimateProduct.intro}</p>
              <div className="space-y-3">
                <span className="text-xs font-bold text-forest/50 block">خانه باید:</span>
                {homeAsUltimateProduct.qualities.map((q) => (
                  <div key={q} className="rounded-lg bg-paper p-3 text-xs text-forest font-medium border border-forest/10">
                    ✓ {q}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────────────────────── */

export default function ProductDesign() {
  return (
    <section
      id="product-design"
      className="relative w-full bg-paper py-20 text-forest md:py-28"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28">
        {/* Chapter Title */}
        <FadeUp>
          <div className="mb-16 flex flex-col gap-3 sm:mb-20">
            <span className="eyebrow text-brick">فصل سوم</span>
            <h2 className="text-4xl font-light tracking-tightest text-forest sm:text-5xl lg:text-6xl">
              فلسفه محصول و طراحی
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-forest/60 sm:text-lg">
              رویکرد خانه چوب و هنر به محصول، متریال، صنعتگری و تجربیات ماندگار طراحی.
            </p>
            <RevealLine className="mt-2 w-12" origin="right" />
          </div>
        </FadeUp>

        {/* 3.1 Product Philosophy */}
        <SectionDivider
          number="۳.۱"
          title="فلسفه محصول و نگاه برند"
          subtitle="نگاه خانه چوب و هنر به چیستی و نقش محصول در زندگی انسان."
        />
        <ProductPhilosophySection />

        {/* 3.2 Design Philosophy */}
        <SectionDivider
          number="۳.۲"
          title="فلسفه طراحی"
          subtitle="چهار عنصر تعادل و چهار اصل راهنمای طراحی."
        />
        <DesignPhilosophySection />

        {/* 3.3 Material, Craftsmanship & Quality */}
        <SectionDivider
          number="۳.۳"
          title="متریال، صنعتگری و کیفیت"
          subtitle="نگاه به چوب، ارزشمندی دست انسان و ۷ مرحله فرهنگ کیفیت."
        />
        <MaterialCraftsmanshipSection />

        {/* 3.4 Premium & Curated Living */}
        <SectionDivider
          number="۳.۴"
          title="پریمیوم و زندگی کیوریت‌شده"
          subtitle="تجربه خانه جامع، انتخاب محصولات مکمل و محصول نهایی."
        />
        <PremiumCuratedSection />
      </div>
    </section>
  );
}
