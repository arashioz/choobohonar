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
import FadeUp from '@/components/motion/FadeUp';
import BrandbookCard from '@/components/brandbook/layout/BrandbookCard';
import BrandbookChapterHeader from '@/components/brandbook/layout/BrandbookChapterHeader';
import BrandbookContainer from '@/components/brandbook/layout/BrandbookContainer';
import BrandbookSectionDivider from '@/components/brandbook/layout/BrandbookSectionDivider';
import BrandPatternField from '@/components/brandbook/layout/BrandPatternField';
import {
  DiamondIcon,
  StarIcon,
} from '@/components/brandbook/icons';

/* ─────────────────────────────────────────────────────────────
   3.1 Product Philosophy & View of Products
   ───────────────────────────────────────────────────────────── */

function ProductPhilosophySection() {
  return (
    <FadeUp>
      <div className="mx-auto mb-20 max-w-4xl space-y-12 text-center">
        <p className="mx-auto max-w-3xl text-base leading-relaxed text-forest/80 text-right sm:text-center">
          {productPhilosophy.intro}
        </p>

        {productPhilosophy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mx-auto max-w-3xl text-base leading-relaxed text-forest/80 text-right sm:text-center">
            {paragraph}
          </p>
        ))}

        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {productPhilosophy.questions.map((q, idx) => (
            <div key={q} className="flex items-center gap-3 rounded-lg bg-forest/5 p-4 text-sm text-forest/85">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-forest text-paper text-xs font-bold">{idx + 1}</span>
              <span>{q}</span>
            </div>
          ))}
        </div>

        <p className="mx-auto max-w-3xl text-sm font-medium leading-relaxed text-brick text-center bg-peach/10 p-4 rounded-xl">
          {productPhilosophy.closing}
        </p>

        {/* Our View of Products */}
        <div className="relative overflow-hidden rounded-2xl border border-forest/10 bg-white/60 p-8 text-right backdrop-blur-sm">
          <div className="relative">
          <h4 className="text-lg font-semibold text-forest mb-2">نگاه برند به محصول</h4>
          <p className="text-sm text-forest/75 mb-6">{ourViewOfProducts.intro}</p>

          <div className="space-y-4 mb-6">
            {ourViewOfProducts.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-forest/80">
                {paragraph}
              </p>
            ))}
          </div>

          <p className="text-xs font-medium text-forest/60 italic border-t border-forest/10 pt-4">
            {ourViewOfProducts.closing}
          </p>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

/* ─────────────────────────────────────────────────────────────
   3.2 Design Philosophy — Elements + Principles
   ───────────────────────────────────────────────────────────── */

function DesignPhilosophySection() {
  return (
    <div className="mb-20">
      <p className="mx-auto mb-8 max-w-3xl text-center text-sm leading-relaxed text-forest/75 text-right sm:text-center">
        {designPhilosophy.intro}
      </p>

      <div className="mx-auto mb-10 max-w-3xl space-y-4">
        {designPhilosophy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="max-w-3xl text-sm leading-relaxed text-forest/75">
            {paragraph}
          </p>
        ))}
      </div>

      {/* 4 Principles */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
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
          <h4 className="text-lg font-bold text-forest mb-4">نگاه برند به چوب و متریال</h4>
          <p className="text-base font-medium text-forest mb-6">{materialPhilosophy.intro}</p>
          <div className="space-y-4">
            {materialPhilosophy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed text-forest/80">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Craftsmanship Philosophy */}
      <FadeUp>
        <div className="rounded-2xl border border-forest/10 bg-paper p-8">
          <h4 className="text-lg font-bold text-forest mb-2">فلسفه صنعتگری</h4>
          <p className="text-sm text-forest/75 mb-4">{craftsmanshipPhilosophy.intro}</p>
          {craftsmanshipPhilosophy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm text-forest/75 mb-4">{paragraph}</p>
          ))}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
            {craftsmanshipPhilosophy.traits.map((trait) => (
              <div key={trait} className="rounded-xl bg-forest/5 p-4 text-xs font-medium text-forest/85">
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
          <p className="text-sm text-forest/75 mb-4">{qualityPhilosophy.intro}</p>
          {qualityPhilosophy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm text-forest/75 mb-6">{paragraph}</p>
          ))}

          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            {qualityPhilosophy.dimensions.map((dim) => (
              <div key={dim.titleFa} className="rounded-xl border border-forest/10 bg-paper p-5">
                <h5 className="text-base font-bold text-forest mb-1">{dim.titleFa}</h5>
                <p className="text-xs text-forest/70">{dim.description}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-medium text-forest/70 border-t border-forest/10 pt-4">
            {qualityPhilosophy.closing}
          </p>
        </div>
      </FadeUp>

      {/* Timeless vs Trend */}
      <FadeUp>
        <div className="rounded-2xl bg-sage/10 p-8 border border-sage/30">
          <h4 className="text-lg font-bold text-forest mb-2">ماندگاری در برابر مدگرایی</h4>
          <p className="text-sm text-forest/80 mb-6">{timelessVsTrend.belief}</p>
          <div className="grid gap-3 sm:grid-cols-2 mb-6">
            {timelessVsTrend.characteristics.map((char) => (
              <div key={char} className="flex items-center gap-3 text-xs font-medium text-forest/85">
                <span className="size-2 rounded-full bg-forest" />
                <span>{char}</span>
              </div>
            ))}
          </div>
          {'closing' in timelessVsTrend && timelessVsTrend.closing && (
            <p className="text-xs text-forest/70">{timelessVsTrend.closing}</p>
          )}
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
          <div className="relative flex flex-col gap-6 overflow-hidden rounded-2xl bg-forest p-8 text-paper sm:p-10">
            <BrandPatternField
              variant="forest"
              surface="dark"
              mask="right"
              strength="soft"
              motion="scroll"
              sheen
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-forest-900/55 via-forest/88 to-forest" />
            <div className="relative">
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
              <p className="text-base font-light leading-relaxed text-paper/75">
                {premiumConcept.premium.closing}
              </p>
            </div>
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
              <span className="text-xs font-medium text-forest/70 w-full mb-1">عناصر Curated Living:</span>
              <div className="flex flex-wrap gap-2">
                {premiumConcept.curatedLiving.elements.map((element) => (
                  <span key={element} className="rounded-full bg-paper border border-forest/10 px-3 py-1 text-xs text-forest">
                    {element}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-forest/70 w-full">{premiumConcept.curatedLiving.closing}</p>
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
              {homeAsUltimateProduct.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm text-forest/80 mb-6">{paragraph}</p>
              ))}
              <div className="space-y-3">
                <span className="text-xs font-bold text-forest/50 block">هدف ما خلق فضاهایی است که:</span>
                {homeAsUltimateProduct.qualities.map((q) => (
                  <div key={q} className="rounded-lg bg-paper p-3 text-xs text-forest font-medium border border-forest/10">
                    ✓ {q}
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-forest/70">{homeAsUltimateProduct.closing}</p>
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
    <section id="product-design" className="relative w-full bg-paper text-forest">
      <BrandbookChapterHeader
        chapter="فصل سوم"
        title="فلسفه محصول و طراحی"
        subtitle="رویکرد خانه چوب و هنر به محصول، متریال، صنعتگری و تجربیات ماندگار طراحی."
      />

      <BrandbookContainer className="pb-20 md:pb-28">
        <BrandbookSectionDivider
          number="۳.۱"
          title="فلسفه محصول و نگاه برند"
          subtitle="نگاه خانه چوب و هنر به چیستی و نقش محصول در زندگی انسان."
        />
        <ProductPhilosophySection />

        <BrandbookSectionDivider
          number="۳.۲"
          title="فلسفه طراحی"
          subtitle="چهار عنصر تعادل و چهار اصل راهنمای طراحی."
        />
        <DesignPhilosophySection />

        <BrandbookSectionDivider
          number="۳.۳"
          title="متریال، صنعتگری و کیفیت"
          subtitle="نگاه به چوب، ارزشمندی دست انسان و ۷ مرحله فرهنگ کیفیت."
        />
        <MaterialCraftsmanshipSection />

        <BrandbookSectionDivider
          number="۳.۴"
          title="پریمیوم و زندگی کیوریت‌شده"
          subtitle="تجربه خانه جامع، انتخاب محصولات مکمل و محصول نهایی."
        />
        <PremiumCuratedSection />
      </BrandbookContainer>
    </section>
  );
}
