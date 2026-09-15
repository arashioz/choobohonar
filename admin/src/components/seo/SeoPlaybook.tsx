"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn, toFa } from "@/lib/utils";
import {
  keywordAction,
  keywordGap,
  matchGscQuery,
  seoKeywords,
  seoMotions,
  seoNorthStar,
  seoPillars,
  seoThesis,
  suggestedTitle,
  type SeoIntent,
  type SeoKind,
  type SeoPriority,
} from "@/data/seo-strategy";
import {
  seoArticleStats,
  seoArticles,
  seoTitleCraft,
  serpTitleFit,
  type SeoArticleStatus,
  type SeoArticleWindow,
} from "@/data/seo-articles";
import {
  competitorLandscape,
  competitors,
  coverageIssues,
  cutoverNow,
  deepFindings,
  gscBrandSplit,
  gscDevices,
  gscFamilies,
  gscHalves,
  gscKeywordMap,
  gscMeta,
  gscPages,
  gscPillars,
  gscTotals,
  reportSources,
} from "@/data/seo-report";
import {
  BrandSplitChart,
  CompetitorCompareChart,
  CompetitorRadarChart,
  HalfYearChart,
  HeadToHeadChart,
  MonthlyTrendChart,
  PillarCaptureChart,
} from "@/components/seo/SeoCharts";

const intents: Array<SeoIntent | "همه"> = ["همه", "ناوبری", "اطلاعاتی", "تجاری", "تراکنشی"];
const priorities: Array<SeoPriority | "همه"> = ["همه", "P1", "P2", "P3"];
const kinds: Array<SeoKind | "همه"> = ["همه", "مقاله", "صفحه"];
const articleWindows: Array<SeoArticleWindow | "همه"> = ["همه", "۳۰ روز", "۶۰ روز", "۹۰ روز"];
const articleStatuses: Array<SeoArticleStatus | "همه"> = ["همه", "جدید", "بازنویسی"];

function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export default function SeoPlaybook() {
  const [pillar, setPillar] = useState("all");
  const [intent, setIntent] = useState<(typeof intents)[number]>("همه");
  const [priority, setPriority] = useState<(typeof priorities)[number]>("همه");
  const [kind, setKind] = useState<(typeof kinds)[number]>("همه");
  const [query, setQuery] = useState("");
  const [articlePillar, setArticlePillar] = useState("all");
  const [articleWindow, setArticleWindow] = useState<(typeof articleWindows)[number]>("همه");
  const [articleStatus, setArticleStatus] = useState<(typeof articleStatuses)[number]>("همه");
  const [articlePriority, setArticlePriority] = useState<(typeof priorities)[number]>("همه");

  const rows = useMemo(() => {
    const needle = query.trim();
    return seoKeywords.filter((item) => {
      if (pillar !== "all" && item.pillar !== pillar) return false;
      if (intent !== "همه" && item.intent !== intent) return false;
      if (priority !== "همه" && item.priority !== priority) return false;
      if (kind !== "همه" && item.kind !== kind) return false;
      if (needle && !item.q.includes(needle) && !item.title.includes(needle)) return false;
      return true;
    });
  }, [intent, kind, pillar, priority, query]);

  const briefs = useMemo(() => {
    return seoArticles.filter((item) => {
      if (articlePillar !== "all" && item.pillar !== articlePillar) return false;
      if (articleWindow !== "همه" && item.window !== articleWindow) return false;
      if (articleStatus !== "همه" && item.status !== articleStatus) return false;
      if (articlePriority !== "همه" && item.priority !== articlePriority) return false;
      return true;
    });
  }, [articlePillar, articlePriority, articleStatus, articleWindow]);

  return (
    <div className="bg-paper text-forest">
      <section className="bg-forest text-paper">
        <Container className="flex flex-col justify-end py-10 md:py-14">
          <p className="text-[11px] tracking-[0.28em] text-peach">SEO PLAYBOOK / ۱۴۰۵</p>
          <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.6rem,8vw,7.2rem)] font-extralight leading-[0.92] tracking-tightest">
            استراتژی سئو
            <span className="block text-peach">خانه چوب و هنر</span>
          </h1>
          <p className="mt-10 max-w-2xl text-lg leading-relaxed text-paper/75 md:text-xl">{seoNorthStar}</p>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-paper/50">
            مبنای اعداد: صادرات سالانهٔ سرچ‌کنسول — {gscMeta.range}. تایتل‌ها دیگر قالب «کیورد | برند» نیستند؛ هر کدام برای نیت جستجو نوشته شده و آمادهٔ کپی در CMS است.
          </p>
          <dl className="mt-16 grid grid-cols-2 gap-px bg-paper/10 md:grid-cols-4">
            {[
              ["کلیک ۱۲ ماه", toFa(gscTotals.clicks)],
              ["ایمپرشن سال", toFa(gscTotals.impressions)],
              ["ایندکس / خارج", `${toFa(gscTotals.indexed)} / ${toFa(gscTotals.notIndexed)}`],
              ["CTR غیربرند", `${toFa(gscBrandSplit.genericCtr)}٪`],
            ].map(([label, value]) => (
              <div key={label} className="bg-forest px-5 py-6">
                <dt className="text-[11px] tracking-[0.18em] text-paper/45">{label}</dt>
                <dd className="mt-3 font-display text-4xl font-extralight text-peach">{value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-b border-forest/10 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">ANNUAL SEARCH CONSOLE</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            وضعیت فعلی سایت زنده
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-forest/65">
            {gscMeta.note} خروجی {gscMeta.exported} · {toFa(gscTotals.clicks)} کلیک و {toFa(gscTotals.impressions)} ایمپرشن در {toFa(gscMeta.days)} روز، میانگین رتبه {toFa(gscTotals.position)}.
          </p>

          <div className="mt-12 grid gap-px bg-forest/10 md:grid-cols-4">
            {[
              ["کلیک", toFa(gscTotals.clicks)],
              ["ایمپرشن", toFa(gscTotals.impressions)],
              ["CTR کل", `${toFa(gscTotals.ctr)}٪`],
              ["رتبه میانگین", toFa(gscTotals.position)],
            ].map(([label, value]) => (
              <div key={label} className="bg-paper px-5 py-6">
                <p className="text-[11px] tracking-[0.16em] text-forest/40">{label}</p>
                <p className="mt-3 font-display text-3xl font-extralight">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.35fr_1fr]">
            <MonthlyTrendChart />
            <div className="space-y-10">
              <BrandSplitChart />
              <HalfYearChart />
            </div>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <article>
              <h3 className="text-xl font-light">برند تقریباً تمام کلیک را می‌سازد</h3>
              <p className="mt-4 text-sm leading-8 text-forest/70">
                در هزار کوئری برتر سال، برند {toFa(gscBrandSplit.brandedClicks)} کلیک با CTR {toFa(gscBrandSplit.brandedCtr)}٪ دارد. عمومی {toFa(gscBrandSplit.genericImpr)} ایمپرشن می‌گیرد و فقط {toFa(gscBrandSplit.genericClicks)} کلیک؛ CTR {toFa(gscBrandSplit.genericCtr)}٪. بازار ما را می‌بیند، انتخاب نمی‌کند.
              </p>
              <p className="mt-4 text-sm leading-8 text-forest/70">
                نیمهٔ دوم {toFa(gscHalves.second.clicks)} کلیک با رتبهٔ {toFa(gscHalves.second.position)} در برابر {toFa(gscHalves.first.clicks)} کلیک و رتبهٔ {toFa(gscHalves.first.position)} نیمهٔ اول. ترمیم بعد از شوک اسفند هست، اما از کالا نیست.
              </p>
            </article>
            <article>
              <h3 className="text-xl font-light">موبایل ۸۶٪ کلیک است؛ دسکتاپ رتبه بدتر</h3>
              <ul className="mt-4 space-y-2 text-sm text-forest/70">
                {gscDevices.map((item) => (
                  <li key={item.id} className="flex justify-between border-b border-forest/8 py-2">
                    <span>{item.id}</span>
                    <span>
                      {toFa(item.clicks)} کلیک · CTR {toFa(item.ctr)}٪ · رتبه {toFa(item.position)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-14 overflow-x-auto">
            <p className="text-[11px] tracking-[0.16em] text-forest/40">کلیک سالانه بر اساس نوع صفحهٔ وردپرس</p>
            <table className="mt-4 w-full min-w-[640px] text-right text-sm">
              <thead>
                <tr className="border-b border-forest/15 text-[11px] text-forest/40">
                  <th className="py-3 font-normal">خانواده</th>
                  <th className="py-3 font-normal">صفحه</th>
                  <th className="py-3 font-normal">کلیک</th>
                  <th className="py-3 font-normal">ایمپرشن</th>
                  <th className="py-3 font-normal">CTR</th>
                </tr>
              </thead>
              <tbody>
                {gscFamilies.map((item) => (
                  <tr key={item.id} className="border-b border-forest/8">
                    <td className="py-3">{item.id}</td>
                    <td className="py-3">{toFa(item.pages)}</td>
                    <td className="py-3">{toFa(item.clicks)}</td>
                    <td className="py-3">{toFa(item.impressions)}</td>
                    <td className="py-3">{toFa(item.ctr)}٪</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="border-b border-forest/10 bg-[#E8DED2]/30 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">DEEP READ</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            خوانش عمیق سال
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-forest/65">
            این‌ها خلاصهٔ KPI نیستند. هر بند یک تصمیم اجرایی قبل یا بعد از سوییچ استک است.
          </p>
          <div className="mt-14 space-y-8">
            {deepFindings.map((item, index) => (
              <article key={item.title} className="grid gap-4 border-b border-forest/10 pb-8 md:grid-cols-[4rem_1fr]">
                <p className="text-[11px] tracking-[0.16em] text-brick">{toFa(String(index + 1).padStart(2, "0"))}</p>
                <div>
                  <h3 className="text-xl font-light">{item.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-forest/70">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-forest/10 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">BUGS & FIXES</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            باگ‌های ایندکس و راه حل
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-forest/65">
            گوگل حدود {toFa(gscTotals.indexed)} صفحه را ایندکس کرده و {toFa(gscTotals.notIndexed)} را کنار گذاشته. این نسبت برای فروشگاه سالم نیست.
          </p>
          <div className="mt-14 space-y-8">
            {coverageIssues.map((item) => (
              <article key={item.title} className="grid gap-4 border-b border-forest/10 pb-8 md:grid-cols-[140px_1fr]">
                <p className={cn("text-[11px] tracking-[0.16em]", item.severity === "بحرانی" ? "text-brick" : "text-forest/45")}>
                  {item.severity}
                </p>
                <div>
                  <h3 className="text-xl font-light">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-forest/65">{item.why}</p>
                  <p className="mt-2 text-sm leading-7 text-forest">{item.fix}</p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-forest/10 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">KEYWORD MAP</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            نقشهٔ کیورد واقعی کنسول
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-forest/65">
            هزار کوئری برتر سالانه به پیلارها وصل شده. خواب و نشیمن ایمپرشن دارند و کلیک ندارند؛ معماری داخلی عملاً غایب است.
          </p>
          <div className="mt-12">
            <PillarCaptureChart />
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[760px] text-right text-sm">
              <thead>
                <tr className="border-b border-forest/15 text-[11px] text-forest/40">
                  <th className="py-3 font-normal">کیورد</th>
                  <th className="py-3 font-normal">پیلار</th>
                  <th className="py-3 font-normal">کلیک</th>
                  <th className="py-3 font-normal">ایمپرشن</th>
                  <th className="py-3 font-normal">CTR</th>
                  <th className="py-3 font-normal">رتبه</th>
                </tr>
              </thead>
              <tbody>
                {gscKeywordMap.map((item) => {
                  const host = seoPillars.find((entry) => entry.id === item.pillar);
                  return (
                    <tr key={item.q} className="border-b border-forest/8">
                      <td className="py-3 font-medium">{item.q}</td>
                      <td className="py-3 text-forest/60">{host?.title ?? item.pillar}</td>
                      <td className="py-3">{toFa(item.clicks)}</td>
                      <td className="py-3">{toFa(item.impressions)}</td>
                      <td className={cn("py-3", item.ctr < 5 ? "text-brick" : "text-forest/70")}>{toFa(item.ctr)}٪</td>
                      <td className="py-3">{toFa(item.position)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-16">
            <h3 className="text-2xl font-light">صفحات پرکلیک و مقصد بعدی</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[720px] text-right text-sm">
                <thead>
                  <tr className="border-b border-forest/15 text-[11px] text-forest/40">
                    <th className="py-3 font-normal">URL فعلی</th>
                    <th className="py-3 font-normal">کلیک</th>
                    <th className="py-3 font-normal">CTR</th>
                    <th className="py-3 font-normal">مسیر استک جدید</th>
                  </tr>
                </thead>
                <tbody>
                  {gscPages.map((item) => (
                    <tr key={item.url} className="border-b border-forest/8">
                      <td className="py-3" dir="ltr">
                        {item.url}
                      </td>
                      <td className="py-3">{toFa(item.clicks)}</td>
                      <td className="py-3">{toFa(item.ctr)}٪</td>
                      <td className="py-3" dir="ltr">
                        {item.next}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-forest/10 bg-forest text-paper py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-peach">COMPETITORS</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            بازار و رقبا
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-paper/65">{competitorLandscape}</p>

          <div className="mt-16 grid gap-12 lg:grid-cols-2">
            <CompetitorCompareChart />
            <div className="space-y-10">
              <CompetitorRadarChart />
              <HeadToHeadChart />
            </div>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {competitors.map((item) => (
              <article key={item.name} className="border border-paper/15 p-6">
                <p className="text-[11px] tracking-[0.16em] text-peach/70">{item.field}</p>
                <h3 className="mt-3 text-2xl font-light">{item.name}</h3>
                <p className="mt-3 text-sm leading-7 text-paper/70">{item.angle}</p>
                <p className="mt-3 text-sm leading-7 text-paper/55">هم‌پوشانی: {item.overlap}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.keywords.map((keyword) => (
                    <li key={keyword} className="border border-paper/15 px-2 py-1 text-[11px] text-paper/60">
                      {keyword}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 grid gap-4 text-[12px] leading-6 md:grid-cols-2">
                  <div>
                    <p className="text-paper/40">قوت</p>
                    <ul className="mt-2 space-y-1 text-paper/65">
                      {item.strengths.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-paper/40">ضعف</p>
                    <ul className="mt-2 space-y-1 text-paper/65">
                      {item.weaknesses.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-peach">{item.threat}</p>
                <p className="mt-3 text-sm leading-7 text-paper/80">{item.move}</p>
                <p className="mt-4 text-[11px] text-paper/35" dir="ltr">
                  {item.url}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-forest/10 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">GSC CUTOVER</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            از همین حالا برای کنسول جدید
          </h2>
          <ol className="mt-10 max-w-3xl space-y-5 text-sm leading-8 text-forest/75">
            {cutoverNow.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] gap-4">
                <span className="text-brick">{toFa(String(index + 1).padStart(2, "0"))}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-forest/10 py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">HOW WE WIN</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            سه اصل، قبل از لیست کیورد
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {seoThesis.map((item, index) => (
              <article key={item.title}>
                <p className="text-[11px] tracking-[0.2em] text-brick">{toFa(String(index + 1).padStart(2, "0"))}</p>
                <h3 className="mt-3 text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-forest/70">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">PILLARS & CLUSTERS</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            ده ستون موضوعی سایت
          </h2>
          <p className="mt-6 max-w-2xl text-forest/65">
            هر پیلار یک صفحهٔ مادر است. کلاسترها مقاله‌ها، کالکشن‌ها و صفحات محصولی‌اند که باید به همان مادر برگردند.
          </p>
          <div className="mt-14 grid gap-4 md:grid-cols-2">
            {seoPillars.map((item) => (
              <article key={item.id} className="border border-forest/10 bg-[#E8DED2]/40 p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="text-[11px] tracking-[0.22em] text-brick">{item.index}</p>
                  <p className="text-[11px] text-forest/40" dir="ltr">
                    {item.href}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-3xl font-extralight">{item.title}</h3>
                <p className="mt-2 text-sm text-forest/60">{item.role}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {item.clusters.map((cluster) => (
                    <li key={cluster} className="border border-forest/15 px-3 py-1 text-[12px] tracking-wide text-forest/80">
                      {cluster}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-forest/10 bg-forest text-paper py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-peach">TITLE CRAFT</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
            تایتل باید جستجو شود، نه ساخته شود
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-paper/65">
            قالب قبلی «کیورد | نشیمن چوبی خانه چوب و هنر» در گوگل برش می‌خورد، برند را هدر می‌دهد و نیت را جواب نمی‌دهد. قاعده‌های زیر همان چیزی است که تایتل‌های این صفحه با آن نوشته شده‌اند.
          </p>
          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {seoTitleCraft.map((item, index) => (
              <article key={item.title}>
                <p className="text-[11px] tracking-[0.2em] text-peach">{toFa(String(index + 1).padStart(2, "0"))}</p>
                <h3 className="mt-3 text-2xl font-light">{item.title}</h3>
                <p className="mt-4 text-sm leading-8 text-paper/70">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-forest/40">EDITORIAL CALENDAR</p>
              <h2 className="mt-4 max-w-3xl font-display text-4xl font-extralight leading-tight md:text-6xl">
                {toFa(seoArticleStats.total)} مقاله با تایتل قابل رتبه‌گیری
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-forest/65">
                {toFa(seoArticleStats.fresh)} عنوان جدید و {toFa(seoArticleStats.rewrite)} بازنویسی تایتل روی مجلهٔ موجود. هر کارت تایتل SERP، پیش‌نمایش گوگل، H2 و دلیل رتبه را می‌دهد — همان را کپی کنید و بنویسید.
              </p>
            </div>
            <p className="text-sm text-forest/50">
              {toFa(seoArticleStats.p1)} اولویت P1 · {toFa(briefs.length)} کارت فیلترشده
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              <Chip active={articlePillar === "all"} onClick={() => setArticlePillar("all")}>
                همه پیلارها
              </Chip>
              {seoPillars.map((item) => (
                <Chip key={item.id} active={articlePillar === item.id} onClick={() => setArticlePillar(item.id)}>
                  {item.title}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {articleWindows.map((item) => (
                <Chip key={`window-${item}`} active={articleWindow === item} onClick={() => setArticleWindow(item)}>
                  {item === "همه" ? "همه بازه‌ها" : item}
                </Chip>
              ))}
              {articleStatuses.map((item) => (
                <Chip key={`status-${item}`} active={articleStatus === item} onClick={() => setArticleStatus(item)}>
                  {item === "همه" ? "همه وضعیت‌ها" : item}
                </Chip>
              ))}
              {priorities.map((item) => (
                <Chip key={`article-${item}`} active={articlePriority === item} onClick={() => setArticlePriority(item)}>
                  {item === "همه" ? "همه اولویت‌ها" : item}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-12 space-y-8">
            {briefs.map((item, index) => {
              const host = seoPillars.find((entry) => entry.id === item.pillar);
              const fit = serpTitleFit(item.title);
              return (
                <article key={item.id} className="border border-forest/10 bg-[#E8DED2]/25 p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="text-[11px] tracking-[0.16em] text-brick">
                      {toFa(String(index + 1).padStart(2, "0"))} · {item.window} · {item.priority} · {item.status}
                    </p>
                    <p className="text-[11px] text-forest/40">
                      {host?.title} · کیورد: {item.keyword}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <h3 className="max-w-3xl font-display text-2xl font-extralight leading-snug md:text-3xl">{item.title}</h3>
                    <CopyButton value={item.title} label="کپی تایتل" />
                  </div>

                  <p
                    className={cn(
                      "mt-2 text-[12px]",
                      fit.tone === "ok" ? "text-forest/50" : fit.tone === "warn" ? "text-brick/80" : "text-brick",
                    )}
                  >
                    {toFa(fit.n)} نویسه · {fit.label}
                  </p>

                  <SerpPreview title={item.title} path={item.href} description={item.meta} />

                  <p className="mt-5 text-sm leading-8 text-forest/70">{item.why}</p>
                  {item.h1 !== item.title ? (
                    <p className="mt-3 text-sm leading-7 text-forest/80">
                      <span className="text-forest/40">H1 کامل: </span>
                      {item.h1}
                    </p>
                  ) : null}

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {[item.keyword, ...item.secondary].map((keyword) => (
                      <li key={keyword} className="border border-forest/15 px-2 py-1 text-[11px] text-forest/65">
                        {keyword}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-forest/40">H2هایی که باید نوشته شود</p>
                      <ol className="mt-3 space-y-2 text-sm leading-7 text-forest/75">
                        {item.outline.map((heading, headingIndex) => (
                          <li key={heading} className="grid grid-cols-[1.5rem_1fr] gap-2">
                            <span className="text-brick">{toFa(headingIndex + 1)}</span>
                            <span>{heading}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.16em] text-forest/40">لینک داخلی و مسیر</p>
                      <ul className="mt-3 space-y-2 text-sm text-forest/70">
                        {item.links.map((link) => (
                          <li key={link.href} className="flex justify-between gap-4 border-b border-forest/8 py-1.5">
                            <span>{link.label}</span>
                            <span className="text-forest/40" dir="ltr">
                              {link.href}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-[12px] leading-6 text-forest/55">CTA: {item.cta}</p>
                      <p className="mt-2 text-[12px] text-forest/40" dir="ltr">
                        {item.href}
                        {item.existingSlug ? ` · exists: /magazine/${item.existingSlug}` : " · new slug"}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-forest/10 bg-[#E8DED2]/30 py-20 md:py-28">
        <Container>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] tracking-[0.22em] text-forest/40">KEYWORD SET</p>
              <h2 className="mt-4 font-display text-4xl font-extralight md:text-5xl">{toFa(seoKeywords.length)} کیورد پیشنهادی</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-forest/65">
                هر ردیف یک تایتل نوشته‌شده دارد، نه قالب خودکار. مقاله را از صفحه جدا کنید؛ تایتل دسته باید نیت خرید بدهد، تایتل مقاله باید سوال جستجو را جواب بدهد.
              </p>
            </div>
            <p className="text-sm text-forest/50">{toFa(rows.length)} ردیفِ فیلترشده</p>
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی کیورد یا تایتل"
              className="w-full border-b border-forest/25 bg-transparent py-3 text-forest placeholder:text-forest/40 focus:border-forest focus:outline-none"
            />
            <div className="flex flex-wrap gap-2">
              <Chip active={pillar === "all"} onClick={() => setPillar("all")}>
                همه پیلارها
              </Chip>
              {seoPillars.map((item) => (
                <Chip key={item.id} active={pillar === item.id} onClick={() => setPillar(item.id)}>
                  {item.title}
                </Chip>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {intents.map((item) => (
                <Chip key={`intent-${item}`} active={intent === item} onClick={() => setIntent(item)}>
                  {item === "همه" ? "همه نیت‌ها" : item}
                </Chip>
              ))}
              {priorities.map((item) => (
                <Chip key={`priority-${item}`} active={priority === item} onClick={() => setPriority(item)}>
                  {item === "همه" ? "همه اولویت‌ها" : item}
                </Chip>
              ))}
              {kinds.map((item) => (
                <Chip key={`kind-${item}`} active={kind === item} onClick={() => setKind(item)}>
                  {item === "همه" ? "صفحه و مقاله" : item}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[1360px] text-right text-sm">
              <thead>
                <tr className="border-b border-forest/15 text-[11px] tracking-[0.16em] text-forest/45">
                  <th className="py-3 font-normal">#</th>
                  <th className="py-3 font-normal">کیورد</th>
                  <th className="py-3 font-normal">تایتل SERP</th>
                  <th className="py-3 font-normal">طول</th>
                  <th className="py-3 font-normal">نوع</th>
                  <th className="py-3 font-normal">پیلار</th>
                  <th className="py-3 font-normal">نیت</th>
                  <th className="py-3 font-normal">اولویت</th>
                  <th className="py-3 font-normal">کلیک</th>
                  <th className="py-3 font-normal">ایمپرشن</th>
                  <th className="py-3 font-normal">CTR</th>
                  <th className="py-3 font-normal">رتبه</th>
                  <th className="py-3 font-normal">شکاف</th>
                  <th className="py-3 font-normal">اقدام</th>
                  <th className="py-3 font-normal">صفحهٔ هدف</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => {
                  const host = seoPillars.find((entry) => entry.id === item.pillar);
                  const gsc = matchGscQuery(item.q, gscKeywordMap);
                  const title = suggestedTitle(item);
                  const fit = serpTitleFit(title);
                  return (
                    <tr key={`${item.q}-${item.href}`} className="border-b border-forest/8 align-top">
                      <td className="py-3.5 text-forest/35">{toFa(index + 1)}</td>
                      <td className="py-3.5 font-medium">{item.q}</td>
                      <td className="max-w-[20rem] py-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[12px] leading-6 text-forest/80">{title}</span>
                          <CopyButton value={title} compact />
                        </div>
                      </td>
                      <td className={cn("py-3.5 text-[12px]", fit.tone === "bad" ? "text-brick" : "text-forest/45")}>
                        {toFa(fit.n)}
                      </td>
                      <td className="py-3.5 text-forest/60">{item.kind}</td>
                      <td className="py-3.5 text-forest/60">{host?.title}</td>
                      <td className="py-3.5 text-forest/60">{item.intent}</td>
                      <td className={cn("py-3.5", item.priority === "P1" ? "text-brick" : "text-forest/60")}>{item.priority}</td>
                      <td className="py-3.5">{gsc ? toFa(gsc.clicks) : "—"}</td>
                      <td className="py-3.5">{gsc ? toFa(gsc.impressions) : "—"}</td>
                      <td className={cn("py-3.5", gsc && gsc.ctr < 5 ? "text-brick" : "text-forest/60")}>
                        {gsc ? `${toFa(gsc.ctr)}٪` : "—"}
                      </td>
                      <td className="py-3.5">{gsc ? toFa(gsc.position) : "—"}</td>
                      <td className="py-3.5 text-[12px] text-forest/55">{keywordGap(gsc)}</td>
                      <td className="max-w-[12rem] py-3.5 text-[12px] leading-6 text-forest/70">{keywordAction(item, gsc)}</td>
                      <td className="py-3.5 text-forest/45" dir="ltr">
                        {item.href}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <section className="py-20 md:py-28">
        <Container>
          <p className="text-[11px] tracking-[0.22em] text-forest/40">90-DAY MOTION</p>
          <h2 className="mt-4 font-display text-4xl font-extralight md:text-6xl">اگر بخواهیم اجرا کنیم</h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {seoMotions.map((motion) => (
              <article key={motion.phase}>
                <p className="text-[11px] tracking-[0.2em] text-peach bg-forest inline-block px-3 py-1">{motion.phase}</p>
                <h3 className="mt-5 text-2xl font-light">{motion.title}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-forest/70">
                  {motion.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-16 text-[11px] leading-6 text-forest/40">
            منابع: صادرات سالانهٔ Search Console ۱۳ سپتامبر ۲۰۲۶
            {reportSources
              .filter((item) => item.url.startsWith("http") && !item.url.endsWith("choobohonar.com/"))
              .map((item) => ` · ${item.title}`)
              .join("")}
            . این صفحه بعداً ورک‌اسپیس مستقل ادمین می‌شود.
          </p>
        </Container>
      </section>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-[12px] tracking-wide transition-colors duration-200 ease-out-expo",
        active ? "bg-forest text-paper" : "border border-forest/15 text-forest/70 hover:border-forest/40",
      )}
    >
      {children}
    </button>
  );
}

function CopyButton({ value, label = "کپی", compact = false }: { value: string; label?: string; compact?: boolean }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          setCopied(false);
        }
      }}
      className={cn(
        "shrink-0 text-[11px] tracking-wide transition-colors duration-200 ease-out-expo",
        compact
          ? "border border-forest/15 px-2 py-1 text-forest/50 hover:border-forest/40 hover:text-forest"
          : "border border-forest/20 px-3 py-1.5 text-forest/70 hover:border-forest hover:text-forest",
      )}
    >
      {copied ? "کپی شد" : label}
    </button>
  );
}

function SerpPreview({ title, path, description }: { title: string; path: string; description: string }) {
  const fit = serpTitleFit(title);
  const visibleTitle = fit.n > 52 ? `${[...title].slice(0, 50).join("")}…` : title;
  const crumb = path.replace(/^\//, "").split("/").join(" › ");

  return (
    <div className="mt-5 max-w-xl bg-white px-4 py-3 text-left shadow-[0_1px_3px_rgba(9,43,28,0.08)]" dir="rtl">
      <p className="truncate text-[12px] text-[#202124]">choobohonar.com › {crumb}</p>
      <p className="mt-1 text-[18px] leading-7 text-[#1a0dab]">{visibleTitle}</p>
      <p className="mt-1 line-clamp-2 text-[13px] leading-6 text-[#4d5156]">{description}</p>
    </div>
  );
}
