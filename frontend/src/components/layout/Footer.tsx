import Image from "next/image";
import Link from "next/link";
import { brand, homeSectionLinks, navItems, productMegaMenu } from "@/data/nav";
import { brandAssets } from "@/lib/brand-assets";
import Stagger from "@/components/motion/Stagger";
import BrandMark from "@/components/brand/BrandMark";

export default function Footer() {
  const currentYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());

  return (
    <footer className="relative flex min-h-screen flex-col overflow-hidden bg-forest text-paper">
      <div className="pointer-events-none absolute -bottom-[8vw] -left-[5vw] h-[clamp(16rem,34vw,38rem)] w-[clamp(14rem,30vw,34rem)] opacity-[0.035]" aria-hidden>
        <Image src={brandAssets.monogram.white} alt="" fill sizes="34vw" className="object-contain" />
      </div>

      <div className="relative mx-auto flex w-full max-w-container flex-1 flex-col justify-center px-6 py-20 md:px-10 md:py-24 lg:px-16">
        <Stagger className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8" selector="[data-footer-column]" amount={0.55} y={28}>
          <div data-footer-column className="lg:col-span-4">
            <BrandMark invert size="footer" />
            <p className="mt-11 max-w-sm text-lg font-light leading-relaxed text-paper/85 md:text-xl">
              {brand.sloganFa}
            </p>
          </div>

          <div data-footer-column className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="eyebrow text-peach">نقشه سایت خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-peach focus-visible:text-peach">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-peach">دسته بندی خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {productMegaMenu.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-peach focus-visible:text-peach">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-peach">بخش های خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {homeSectionLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-colors hover:text-peach focus-visible:text-peach">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div data-footer-column className="lg:col-span-3">
            <h3 className="eyebrow text-peach">ارتباط با ما</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li>{brand.addressFa}</li>
              <li>{brand.showroomHoursFa}</li>
              <li dir="ltr" className="text-right">
                {brand.phone}
              </li>
              <li dir="ltr" className="text-right">
                {brand.email}
              </li>
              <li>
                <a href={brand.instagram} target="_blank" rel="noreferrer" className="transition-colors hover:text-peach focus-visible:text-peach">
                  اینستاگرام
                </a>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-peach focus-visible:text-peach">
                  تماس با ما
                </Link>
              </li>
              <li>
                <Link href="/contact/cooperation" className="transition-colors hover:text-peach focus-visible:text-peach">
                  درخواست همکاری
                </Link>
              </li>
              <li>
                <Link href="/contact/representation" className="transition-colors hover:text-peach focus-visible:text-peach">
                  درخواست نمایندگی
                </Link>
              </li>
              <li>
                <Link href="/contact/consultation" className="transition-colors hover:text-peach focus-visible:text-peach">
                  درخواست مشاوره
                </Link>
              </li>
            </ul>
          </div>
        </Stagger>
      </div>

      <div className="mx-auto w-full max-w-container px-6 pb-8 md:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-paper/15 pt-5 text-sm text-paper/60 md:flex-row">
          <p>© {currentYear} {brand.nameFa}. تمامی حقوق محفوظ است.</p>
          <Link href="/#top" className="group inline-flex items-center gap-2 transition-colors hover:text-peach focus-visible:text-peach">
            بازگشت به بالا
            <span className="transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
