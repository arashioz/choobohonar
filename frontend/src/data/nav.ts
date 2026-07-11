import type { NavChildItem, NavItem } from "@/data/nav-types";
import { buildProductsFilterHref, productRooms } from "@/data/product-categories";

export type { NavChildItem, NavItem };

/** Mega-menu: top-level rooms from choobohonar.com */
export const productMegaMenu: NavChildItem[] = productRooms.map((room) => ({
  label: room.label,
  href: buildProductsFilterHref(room.id),
  description: room.description,
}));

export const navItems: NavItem[] = [
  { label: "محصولات", href: "/products", children: productMegaMenu },
  { label: "کالکشن", href: "/collection" },
  { label: "پروژه‌ها", href: "/projects" },
  { label: "معماری داخلی", href: "/interior-architecture-services" },
  { label: "گالری", href: "/gallery" },
  { label: "مجله", href: "/magazine" },
  { label: "تماس", href: "/contact" },
];

export const homeSectionLinks: NavChildItem[] = [
  { label: "محصولات منتخب", href: "/#products" },
  { label: "پروژه‌های منتخب", href: "/#projects" },
  { label: "حوزه‌های کاری", href: "/#work-areas" },
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
