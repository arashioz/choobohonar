import { toFa } from "@/lib/utils";
import { competitorAxes, competitorScores, gscBrandSplit, gscHalves, gscMonthly, gscPillars } from "@/data/seo-report";

const forest = "#092B1C";
const peach = "#FBBEA6";
const brick = "#9A3110";
const paper = "#F4EFE8";

export function MonthlyTrendChart() {
  const max = Math.max(...gscMonthly.map((item) => item.impressions));
  const w = 720;
  const h = 240;
  const pad = { t: 18, r: 16, b: 38, l: 10 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const points = gscMonthly.map((item, index) => {
    const x = pad.l + (index / (gscMonthly.length - 1)) * innerW;
    const y = pad.t + innerH - (item.impressions / max) * innerH;
    return { ...item, x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${points[points.length - 1].x.toFixed(1)},${pad.t + innerH} L${points[0].x.toFixed(1)},${pad.t + innerH} Z`;
  const clickMax = Math.max(...gscMonthly.map((item) => item.clicks));

  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.16em] text-forest/40">روند سالانه · خط ایمپرشن · ستون کلیک</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full" role="img" aria-label="روند ماهانه ایمپرشن و کلیک در دوازده ماه">
        <path d={area} fill={forest} opacity="0.06" />
        <path d={line} fill="none" stroke={forest} strokeWidth="2.2" />
        {points.map((p) => {
          const barH = Math.max((p.clicks / clickMax) * (innerH * 0.42), 2);
          const shock = p.clicks < 100;
          return (
            <g key={p.month}>
              <rect x={p.x - 8} y={pad.t + innerH - barH} width="16" height={barH} fill={shock ? brick : peach} opacity={shock ? 0.55 : 0.88} />
              <circle cx={p.x} cy={p.y} r={shock ? 5 : 3.2} fill={shock ? brick : forest} />
              <text x={p.x} y={h - 10} textAnchor="middle" fontSize="9" fill={forest} opacity="0.42">
                {p.month.replace("۱۴۰", "")}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 text-[11px] leading-6 text-forest/45">
        ستون آجری اسفند: ۴۸ کلیک و رتبهٔ ۲۲. جهش اردیبهشت حجم ناپایدار است، نه کیفیت اسنیپت.
      </p>
    </figure>
  );
}

export function BrandSplitChart() {
  const totalClicks = gscBrandSplit.brandedClicks + gscBrandSplit.genericClicks;
  const brandShare = (gscBrandSplit.brandedClicks / totalClicks) * 100;
  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.16em] text-forest/40">برند در برابر کوئری عمومی · هزار کوئری برتر</figcaption>
      <div className="mt-6 space-y-5">
        <div>
          <div className="mb-2 flex justify-between text-[12px]">
            <span>سهم کلیک برند</span>
            <span className="text-forest/45">{toFa(brandShare.toFixed(0))}٪ از کلیک‌های نقشه‌شده</span>
          </div>
          <div className="flex h-3 overflow-hidden bg-forest/10">
            <span className="bg-forest" style={{ width: `${brandShare}%` }} />
            <span className="bg-peach" style={{ width: `${100 - brandShare}%` }} />
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div className="border border-forest/10 p-4">
            <dt className="text-[11px] tracking-[0.14em] text-forest/40">برند</dt>
            <dd className="mt-2 font-display text-3xl font-extralight">{toFa(gscBrandSplit.brandedClicks)}</dd>
            <p className="mt-2 text-[12px] text-forest/50">
              {toFa(gscBrandSplit.brandedImpr)} ایمپرشن · CTR {toFa(gscBrandSplit.brandedCtr)}٪
            </p>
          </div>
          <div className="border border-forest/10 p-4">
            <dt className="text-[11px] tracking-[0.14em] text-forest/40">عمومی</dt>
            <dd className="mt-2 font-display text-3xl font-extralight text-brick">{toFa(gscBrandSplit.genericClicks)}</dd>
            <p className="mt-2 text-[12px] text-forest/50">
              {toFa(gscBrandSplit.genericImpr)} ایمپرشن · CTR {toFa(gscBrandSplit.genericCtr)}٪
            </p>
          </div>
        </dl>
      </div>
    </figure>
  );
}

export function HalfYearChart() {
  const max = Math.max(gscHalves.first.clicks, gscHalves.second.clicks);
  const rows = [
    { id: "H1", label: "نیمهٔ اول", data: gscHalves.first },
    { id: "H2", label: "نیمهٔ دوم", data: gscHalves.second },
  ];
  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.16em] text-forest/40">مقایسهٔ دو نیمه · کلیک و رتبه</figcaption>
      <ul className="mt-6 space-y-4">
        {rows.map((row) => (
          <li key={row.id}>
            <div className="mb-1 flex justify-between text-[12px]">
              <span>{row.label}</span>
              <span className="text-forest/45">
                {toFa(row.data.clicks)} کلیک · رتبه {toFa(row.data.position)}
              </span>
            </div>
            <div className="h-2.5 bg-forest/10">
              <span className="block h-full bg-forest" style={{ width: `${(row.data.clicks / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-forest/45">نیمهٔ دوم کلیک ۱۱٫۵٪ بیشتر و رتبه از ۷٫۷ به ۶٫۲ رسیده؛ رشد از برند آمده نه کالا.</p>
    </figure>
  );
}

export function PillarCaptureChart() {
  const max = Math.max(...gscPillars.map((item) => item.impressions));
  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.16em] text-forest/40">ایمپرشن در برابر CTR هر پیلار</figcaption>
      <ul className="mt-5 space-y-3">
        {gscPillars.map((item) => (
          <li key={item.id}>
            <div className="mb-1 flex justify-between text-[12px]">
              <span>{item.title}</span>
              <span className="text-forest/45">
                {toFa(item.impressions)} ایمپرشن · CTR {toFa(item.ctr)}٪
              </span>
            </div>
            <div className="relative h-2 bg-forest/10">
              <span className="absolute inset-y-0 right-0 bg-forest/20" style={{ width: `${(item.impressions / max) * 100}%` }} />
              <span className="absolute inset-y-0 right-0 bg-brick" style={{ width: `${Math.min(item.ctr, 50) * 2}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-forest/45">نوار خاکستری: حجم دیده شدن · نوار آجری: سهم کلیک</p>
    </figure>
  );
}

export function CompetitorCompareChart() {
  const max = 10;
  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.18em] text-peach/70">نقشهٔ رقابتی کیفی · امتیاز ۱ تا ۱۰ · نه ترافیک تخمینی</figcaption>
      <div className="mt-8 space-y-6">
        {competitorAxes.map((axis) => (
          <div key={axis.id}>
            <p className="mb-2 text-[12px] text-paper/70">{axis.label}</p>
            <div className="space-y-1.5">
              {competitorScores.map((brand) => {
                const value = brand.scores[axis.id as keyof typeof brand.scores];
                return (
                  <div key={brand.id} className="grid grid-cols-[7.5rem_1fr_2rem] items-center gap-3 text-[11px]">
                    <span className="text-paper/55">{brand.name}</span>
                    <div className="h-2 bg-paper/10">
                      <span className="block h-full" style={{ width: `${(value / max) * 100}%`, background: brand.color }} />
                    </div>
                    <span className="text-paper/40">{toFa(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function CompetitorRadarChart() {
  const brands = competitorScores.filter((item) => ["chh", "mobliran", "novin"].includes(item.id));
  const axes = competitorAxes;
  const size = 320;
  const cx = size / 2;
  const cy = size / 2 + 6;
  const radius = 112;
  const angle = (index: number) => ((Math.PI * 2) / axes.length) * index - Math.PI / 2;
  const point = (index: number, value: number) => {
    const a = angle(index);
    const r = (value / 10) * radius;
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  };
  const rings = [4, 7, 10];

  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.18em] text-peach/70">رادار سه‌جانبه · چوب و هنر / مبلیران / نوین چوب</figcaption>
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto mt-6 w-full max-w-md" role="img" aria-label="مقایسه راداری سه برند">
        {rings.map((ring) => {
          const d = axes
            .map((_, index) => {
              const [x, y] = point(index, ring);
              return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          return <path key={ring} d={`${d} Z`} fill="none" stroke={paper} opacity="0.12" />;
        })}
        {brands.map((brand) => {
          const d = axes
            .map((axis, index) => {
              const value = brand.scores[axis.id as keyof typeof brand.scores];
              const [x, y] = point(index, value);
              return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          return <path key={brand.id} d={`${d} Z`} fill={brand.color} fillOpacity={brand.id === "chh" ? 0.28 : 0.1} stroke={brand.color} strokeWidth={brand.id === "chh" ? 2 : 1.2} />;
        })}
        {axes.map((axis, index) => {
          const [x, y] = point(index, 10.8);
          return (
            <text key={axis.id} x={x} y={y} textAnchor="middle" fontSize="10" fill={paper} opacity="0.7">
              {axis.label}
            </text>
          );
        })}
      </svg>
      <ul className="mt-4 flex flex-wrap justify-center gap-4 text-[11px] text-paper/55">
        {brands.map((brand) => (
          <li key={brand.id} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: brand.color }} />
            {brand.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}

export function HeadToHeadChart() {
  const ours = competitorScores[0];
  const rivals = competitorScores.filter((item) => item.id !== "chh");
  return (
    <figure>
      <figcaption className="text-[11px] tracking-[0.16em] text-paper/45">اختلاف امتیاز · چوب و هنر منها رقیب</figcaption>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-right text-[12px]">
          <thead>
            <tr className="border-b border-paper/15 text-paper/40">
              <th className="py-2 font-normal">محور</th>
              {rivals.map((brand) => (
                <th key={brand.id} className="py-2 font-normal">
                  در برابر {brand.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {competitorAxes.map((axis) => (
              <tr key={axis.id} className="border-b border-paper/8">
                <td className="py-2.5 text-paper/70">{axis.label}</td>
                {rivals.map((brand) => {
                  const delta = ours.scores[axis.id as keyof typeof ours.scores] - brand.scores[axis.id as keyof typeof brand.scores];
                  return (
                    <td key={brand.id} className={delta >= 0 ? "py-2.5 text-peach" : "py-2.5 text-[#E8A598]"}>
                      {delta > 0 ? `+${toFa(delta)}` : toFa(delta)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] leading-6 text-paper/40">
        برتری قطعی فقط روی مالکیت برند است. ضعف ساختاری روی کوئری عمومی، محتوا و بازی قیمت است.
      </p>
    </figure>
  );
}
