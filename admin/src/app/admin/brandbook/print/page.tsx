import Image from "next/image";
import BrandbookSections from "@/components/brandbook/BrandbookSections";
import BrandbookPrintPrep from "@/components/brandbook/layout/BrandbookPrintPrep";
import { BrandbookPrintProvider } from "@/components/brandbook/BrandbookPrintContext";
import { brandbookNavItems } from "@/data/brandbook-nav";

export const metadata = {
  title: "CHHome Brandbook — Print",
};

type PrintMode = "unified" | "sections" | "continuous";

function resolveMode(raw?: string): PrintMode {
  if (raw === "sections") return "sections";
  if (raw === "continuous") return "continuous";
  return "unified";
}

export default async function BrandbookPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const params = await searchParams;
  const mode = resolveMode(params.mode);
  const chapters = brandbookNavItems.slice(1);

  const pageRule =
    mode === "continuous"
      ? `@page { margin: 0; }`
      : `@page { size: A4 portrait; margin: 10mm 8mm; }`;

  return (
    <BrandbookPrintProvider>
    <div
      className="brandbook-print-document relative bg-paper text-forest"
      data-print-mode={mode}
    >
      <BrandbookPrintPrep />
      <style>{`
        @media print {
          ${pageRule}
        }
      `}</style>

      <header className="brandbook-print-cover relative overflow-hidden bg-forest px-8 py-16 text-paper sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-30" aria-hidden />

        <div className="relative z-10 mx-auto max-w-[1600px]">
          <div className="mb-10 flex items-center gap-4">
            <span className="relative block h-12 w-28 sm:h-14 sm:w-36">
              <Image
                src="/brand/downloads/choobohonar-lockup-persian-white.svg"
                alt="خانه چوب و هنر"
                width={144}
                height={56}
                priority
                unoptimized
                className="h-full w-auto object-contain object-right"
              />
            </span>
            <span className="h-8 w-px bg-peach/25" />
            <span className="text-[9px] uppercase leading-5 tracking-[0.18em] text-paper/35" dir="ltr">
              Brand System
              <br />
              Edition 01
            </span>
          </div>

          <p className="eyebrow text-peach/70">Digital Brandbook — 2026</p>
          <h1 className="mt-5 max-w-5xl text-balance text-[clamp(2.75rem,6vw,5.5rem)] font-extralight leading-[0.92] tracking-[-0.06em] text-paper">
            ساختن خانه‌هایی
            <br />
            <span className="text-peach">با روح.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-pretty text-sm font-light leading-8 text-paper/55 sm:text-base">
            سند یکپارچه هویت برند خانه چوب و هنر — شامل بنیان، استراتژی، تجربه، ارتباطات،
            هویت بصری، تصویرسازی و فرهنگ برند.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-paper/10 bg-paper/[0.05] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-[10px] text-peach/70" dir="ltr">
                    {item.number}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.12em] text-paper/30" dir="ltr">
                    {item.titleEn}
                  </span>
                </div>
                <p className="mt-2 text-sm text-paper/80">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <BrandbookSections showDividers={false} />

      <footer className="brandbook-print-footer border-t border-forest/10 px-8 py-10 text-center text-xs text-forest/45">
        <p>خانه چوب و هنر — CHHome Brandbook v1.0.0</p>
        <p className="mt-2" dir="ltr">
          choobohonar.com
        </p>
      </footer>
    </div>
    </BrandbookPrintProvider>
  );
}
