import type { NavChildItem, NavItem } from "@/data/nav-types";
import { commerceCategories } from "@/data/commerce";

export type { NavChildItem, NavItem };

/** Mega-menu: internal storefront routes aligned with the live catalog taxonomy. */
export const productMegaMenu: NavChildItem[] = commerceCategories.map((category) => ({
  label: category.label,
  href: `/products/category/${category.slug}`,
  description: category.description,
}));

export const navItems: NavItem[] = [
  { label: "محصولات", href: "/products", children: productMegaMenu },
  { label: "کالکشن", href: "/collection" },
  { label: "پروژه‌ها", href: "/projects" },
  { label: "معماری داخلی", href: "/interior-architecture-services" },
  { label: "گالری", href: "/gallery" },
  { label: "مجله", href: "/magazine" },
  { label: "فروشگاه‌ها", href: "/stores" },
  { label: "ارتباط با ما", href: "/contact" },
];

export const homeSectionLinks: NavChildItem[] = [
  { label: "پروژه‌های منتخب", href: "/#projects" },
  { label: "گروه‌های کالایی", href: "/#work-areas" },
  { label: "رویکرد ما", href: "/#approach" },
  { label: "فرم مشاوره", href: "/#consultation" },
];

export const brand = {
  nameFa: "خانه چوب و هنر",
  nameEn: "ChooboHonar Home",
  sloganFa: "سبک دلخواه من",
  sloganSubFa: "همراه تو در خلق خانه‌ای که دوستش داری",
  phone: "۵۴۱۶۹",
  phoneIntl: "54169",
  email: "info@choobohonar.com",
  instagram: "https://instagram.com/choobohonar",
  addressFa: "تهران، شوروم خانه چوب و هنر",
  showroomHoursFa: "شنبه تا پنج‌شنبه، ۱۰ تا ۲۰",
};
