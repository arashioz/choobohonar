import type { NavChildItem, NavItem } from "@/data/nav-types";
import { productRooms } from "@/data/product-categories";
import { getShopCategoryUrl, getShopUrl } from "@/lib/shop";

export type { NavChildItem, NavItem };

/** Mega-menu: top-level rooms on choobohonar.com */
export const productMegaMenu: NavChildItem[] = productRooms.map((room) => ({
  label: room.label,
  href: getShopCategoryUrl(room.id),
  description: room.description,
}));

export const navItems: NavItem[] = [
  { label: "محصولات", href: getShopUrl(), children: productMegaMenu },
  { label: "کالکشن", href: "/collection" },
  { label: "متریال", href: "/materials" },
  { label: "پروژه‌ها", href: "/projects" },
  { label: "معماری داخلی", href: "/interior-architecture-services" },
  { label: "گالری", href: "/gallery" },
  { label: "مجله", href: "/magazine" },
  { label: "ارتباط با ما", href: "/contact" },
];

export const homeSectionLinks: NavChildItem[] = [
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
