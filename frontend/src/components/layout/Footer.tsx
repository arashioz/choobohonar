import Image from "next/image";
import Link from "next/link";
import { brand as fallbackBrand, homeSectionLinks as fallbackHomeSectionLinks, navItems as fallbackNavItems, productMegaMenu as fallbackProductMegaMenu } from "@/data/nav";
import { brandAssets } from "@/lib/brand-assets";
import Stagger from "@/components/motion/Stagger";
import BrandMark from "@/components/brand/BrandMark";
import { fetchPublicCmsPage } from "@/lib/public-cms";
import type { NavItem } from "@/data/nav-types";
import { DEFAULT_MATERIALS_HREF } from "@/data/materials";

export default async function Footer() {
  const navPage = await fetchPublicCmsPage<{
    navItems?: NavItem[];
    homeSectionLinks?: typeof fallbackHomeSectionLinks;
    brand?: typeof fallbackBrand;
    productMegaMenu?: typeof fallbackProductMegaMenu;
  }>("nav");
  const navData = navPage?.items;
  const sitemapHrefs = new Set(["/magazine", "/gallery", "/contact", "/materials"]);
  const navItems = (navData?.navItems?.length ? navData.navItems : fallbackNavItems).filter((item) => !sitemapHrefs.has(item.href));
  const homeSectionLinks = [
    ...(navData?.homeSectionLinks?.length ? navData.homeSectionLinks : fallbackHomeSectionLinks).filter(
      (item) =>
        item.href !== "/#work-areas" &&
        item.href !== "/#consultation" &&
        item.href !== "/#approach" &&
        item.href !== "/magazine" &&
        item.href !== "/gallery" &&
        item.href !== "/order-and-shipping" &&
        item.href !== "/magazine/rug-buying-guide" &&
        item.href !== "/magazine/rug-care-guide",
    ),
    { label: "مجله", href: "/magazine" },
    { label: "گالری", href: "/gallery" },
    { label: "پشتیبانی", href: "/order-and-shipping" },
    { label: "راهنمای خرید فرش", href: "/magazine/rug-buying-guide" },
    { label: "راهنمای نگهداری فرش", href: "/magazine/rug-care-guide" },
  ];
  // Product groups have one canonical order shared with the primary menu.
  // Keep this list local rather than letting an older CMS navigation record
  // reintroduce retired or out-of-order categories in the footer.
  const productMegaMenu = fallbackProductMegaMenu;
  const brand = navData?.brand ? { ...fallbackBrand, ...navData.brand } : fallbackBrand;
  const currentYear = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { year: "numeric" }).format(new Date());

  return (
    <footer className="relative flex min-h-0 flex-col overflow-hidden bg-forest text-paper">
      <div className="pointer-events-none absolute -bottom-[8vw] -left-[5vw] h-[clamp(16rem,34vw,38rem)] w-[clamp(14rem,30vw,34rem)] opacity-[0.035]" aria-hidden>
        <Image src={brandAssets.logo.white} alt="" fill sizes="34vw" className="object-contain" />
      </div>

      <div className="relative mx-auto w-full max-w-container px-6 py-16 md:px-10 md:py-20 lg:px-16">
        <Stagger className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8" selector="[data-footer-column]" amount={0.55} y={28}>
          <div data-footer-column className="lg:col-span-4">
            <BrandMark invert size="footer" className="translate-x-6 md:translate-x-10" />
            <p className="mt-8 max-w-sm text-lg font-light leading-relaxed text-paper/85 md:text-xl">
              {brand.sloganFa}
            </p>
          </div>

          <div data-footer-column className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            <div>
              <h3 className="eyebrow text-peach">خانه</h3>
              <ul className="mt-4 space-y-2 text-sm text-paper/80">
                {navItems.flatMap((item) => {
                  const link = (
                    <li key={item.href}>
                      <Link href={item.href} className="transition-colors hover:text-peach focus-visible:text-peach">
                        {item.label}
                      </Link>
                    </li>
                  );
                  if (item.href !== "/projects") return [link];
                  return [
                    link,
                    <li key={DEFAULT_MATERIALS_HREF}>
                      <Link href={DEFAULT_MATERIALS_HREF} className="transition-colors hover:text-peach focus-visible:text-peach">
                        متریال‌ها
                      </Link>
                    </li>,
                  ];
                })}
                <li>
                  <Link href="/about" className="transition-colors hover:text-peach focus-visible:text-peach">
                    درباره ما
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="eyebrow text-peach">محصولات خانه</h3>
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
              {/* <li>{brand.}</li> */}
              {/* <li>{brand.showroomHoursFa}</li> */}
              <li dir="ltr" className="text-right">
                {/۰۲۱|021/.test(brand.phone) ? brand.phone : `۰۲۱ ${brand.phone}`}
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
