"use client";

import Image from "next/image";
import { brand, homeSectionLinks, navItems, productMegaMenu } from "@/data/nav";
import { brandAssets } from "@/lib/brand-assets";

export default function Footer() {
  return (
    <footer className="flex min-h-screen flex-col bg-forest text-paper">
      <div className="mx-auto flex w-full max-w-container flex-1 flex-col justify-center px-6 py-16 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="relative h-10 w-[180px]">
              <Image src={brandAssets.wordmarkFa.white} alt={brand.nameFa} fill className="object-contain object-right" />
            </div>
            <p className="mt-5 max-w-sm text-lg font-light leading-relaxed text-paper/85 md:text-xl">
              {brand.sloganSubFa}
            </p>
            <div className="relative mt-5 h-7 w-[160px] opacity-90">
              <Image src={brandAssets.sloganFa} alt={brand.sloganFa} fill className="object-contain object-right" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="eyebrow text-peach">نقشه سایت خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="transition-colors hover:text-peach">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-peach">دسته بندی خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {productMegaMenu.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="transition-colors hover:text-peach">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-peach">بخش های خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {homeSectionLinks.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="transition-colors hover:text-peach">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
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
                <a href={brand.instagram} className="transition-colors hover:text-peach">
                  اینستاگرام
                </a>
              </li>
              <li>
                <a href="/contact" className="transition-colors hover:text-peach">
                  انتخاب نوع درخواست
                </a>
              </li>
              <li>
                <a href="/contact/cooperation" className="transition-colors hover:text-peach">
                  درخواست همکاری
                </a>
              </li>
              <li>
                <a href="/contact/representation" className="transition-colors hover:text-peach">
                  درخواست نمایندگی
                </a>
              </li>
              <li>
                <a href="/contact/consultation" className="transition-colors hover:text-peach">
                  درخواست مشاوره
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-container px-6 pb-8 md:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-paper/15 pt-5 text-sm text-paper/60 md:flex-row">
          <p>© ۱۴۰۳ {brand.nameFa}. تمامی حقوق محفوظ است.</p>
          <a href="/#top" className="group inline-flex items-center gap-2 transition-colors hover:text-peach">
            بازگشت به بالا
            <span className="transition-transform duration-300 group-hover:-translate-y-1">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
