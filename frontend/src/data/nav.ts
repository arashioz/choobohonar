import type { NavChildItem, NavItem } from "@/data/nav-types";
import { commerceCategories } from "@/data/commerce";

export type { NavChildItem, NavItem };

/** Mega-menu: internal storefront routes aligned with the live catalog taxonomy. */
export const productMegaMenu: NavChildItem[] = commerceCategories.map((category) => ({
  label: category.label,
  href: `/products/category/${category.slug}`,
  description: category.description,
}));

/** The gallery is under construction; the nav marks it and the page shows a placeholder. */
export const GALLERY_HREF = "/gallery";

function isAccessoryNavEntry(label?: string, href?: string) {
  return /accessory|accessories|اکسسوری/i.test(`${label || ""} ${href || ""}`);
}

/** Drop retired accessory links and keep the products mega-menu aligned with decor. */
export function sanitizeStorefrontNav(items: NavItem[]): NavItem[] {
  return items
    .filter((item) => !isAccessoryNavEntry(item.label, item.href))
    .map((item) => {
      if (item.href === "/products") {
        return { ...item, children: productMegaMenu };
      }
      if (item.href === GALLERY_HREF) return { ...item, badge: "بزودی" };
      const children = item.children?.filter((child) => !isAccessoryNavEntry(child.label, child.href));
      return children ? { ...item, children } : item;
    });
}

export const navItems: NavItem[] = sanitizeStorefrontNav([
  { label: "محصولات", href: "/products", children: productMegaMenu },
  { label: "کالکشن", href: "/collection" },
  { label: "پروژه‌ها", href: "/projects" },
  { label: "معماری داخلی", href: "/interior-architecture-services" },
  { label: "گالری", href: "/gallery" },
  { label: "مجله", href: "/magazine" },
  { label: "فروشگاه‌ها", href: "/stores" },
  { label: "ارتباط با ما", href: "/contact" },
]);

export const homeSectionLinks: NavChildItem[] = [
  { label: "پروژه‌های منتخب", href: "/#projects" },
  { label: "مجله", href: "/magazine" },
  { label: "گالری", href: "/gallery" },
  { label: "پشتیبانی", href: "/order-and-shipping" },
  { label: "راهنمای خرید فرش", href: "/magazine/rug-buying-guide" },
  { label: "راهنمای نگهداری فرش", href: "/magazine/rug-care-guide" },
];

export const brand = {
  nameFa: "خانه چوب و هنر",
  nameEn: "ChooboHonar Home",
  sloganFa: "سبک دلخواه من",
  sloganSubFa: "همراه تو در خلق خانه‌ای که دوستش داری",
  phone: "۰۲۱ ۵۴۱۶۹",
  phoneIntl: "02154169",
  email: "info@choobohonar.com",
  instagram: "https://instagram.com/choobohonar",
  addressFa: "تهران، شوروم خانه چوب و هنر",
  showroomHoursFa: "شنبه تا پنج‌شنبه، ۱۰ تا ۲۰",
};
