export type BrandbookNavItem = {
  id: string;
  number: string;
  label: string;
  titleEn: string;
};

export const brandbookNavItems: BrandbookNavItem[] = [
  { id: "hero", number: "00", label: "خانه چوب و هنر", titleEn: "Introduction" },
  { id: "foundation", number: "01", label: "بنیادهای برند", titleEn: "Foundation" },
  { id: "strategy", number: "02", label: "هویت استراتژیک", titleEn: "Strategy" },
  { id: "product", number: "03", label: "فلسفه محصول", titleEn: "Product & Design" },
  { id: "experience", number: "04", label: "تجربه برند", titleEn: "Experience" },
  { id: "communication", number: "05", label: "سیستم ارتباطات", titleEn: "Communication" },
  { id: "visual", number: "06", label: "هویت بصری", titleEn: "Visual Identity" },
  { id: "imagery", number: "06.5", label: "تصویر برند", titleEn: "Imagery" },
  { id: "culture", number: "07", label: "فرهنگ و آینده", titleEn: "Culture & Future" },
];

export const brandbookChapterItems = brandbookNavItems.slice(1);
