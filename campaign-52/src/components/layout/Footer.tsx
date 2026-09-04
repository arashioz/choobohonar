import Image from "next/image";
import { brand, campaign } from "@/data/campaign";
import { brandAssets } from "@/lib/brand-assets";
import BrandMark from "@/components/brand/BrandMark";
import Container from "@/components/layout/Container";
import { toFa } from "@/lib/utils";

export default function Footer() {
  const year = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());

  return (
    <footer className="relative overflow-hidden bg-forest text-paper">
      <div className="pointer-events-none absolute -bottom-[8vw] -left-[5vw] h-[clamp(16rem,34vw,38rem)] w-[clamp(14rem,30vw,34rem)] opacity-[0.035]" aria-hidden>
        <Image src={brandAssets.monogram.white} alt="" fill sizes="34vw" className="object-contain" />
      </div>
      <Container className="relative py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href={brand.mainSite} target="_blank" rel="noreferrer" aria-label={brand.nameFa} className="inline-flex">
              <BrandMark invert size="footer" />
            </a>
            <p className="mt-10 max-w-sm text-lg font-light leading-relaxed text-paper/85">{campaign.definition}</p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-paper/50">{brand.sloganFa}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-4">
            <div>
              <h3 className="eyebrow text-peach">کمپین</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                <li>{campaign.rangeFa}</li>
                <li>
                  <a href="#share" className="hover:text-peach">
                    سهم ۵۲
                  </a>
                </li>
                <li>
                  <a href="#scope" className="hover:text-peach">
                    شعب و نمایندگی‌ها
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="eyebrow text-peach">ارتباط</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                <li>
                  <a href={`tel:${brand.phoneIntl}`} className="hover:text-peach" dir="ltr">
                    {brand.phone}
                  </a>
                </li>
                <li>
                  <a href={brand.instagram} className="hover:text-peach">
                    اینستاگرام
                  </a>
                </li>
                <li>
                  <a href={brand.mainSite} className="hover:text-peach">
                    choobohonar.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-3">
            <p className="text-sm leading-relaxed text-paper/60">
              اعتبار خرید ویژهٔ اکسسوری، کالای خواب و تشک. مبنای محاسبه هر {toFa(200)} میلیون تومان خرید قطعی است.
            </p>
          </div>
        </div>
        <div className="mt-16 border-t border-paper/10 pt-6 text-xs text-paper/45">
          <span>
            {brand.nameFa} · {year}
          </span>
        </div>
      </Container>
    </footer>
  );
}
