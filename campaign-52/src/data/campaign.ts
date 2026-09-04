export const brand = {
  nameFa: "خانه چوب و هنر",
  nameEn: "ChooboHonar Home",
  sloganFa: "سبک دلخواه من",
  sloganSubFa: "همراه تو در خلق خانه‌ای که دوستش داری",
  taglineFa: "ساختن خانه‌هایی با روح",
  phone: "۵۴۱۶۹",
  phoneIntl: "54169",
  email: "info@choobohonar.com",
  instagram: "https://instagram.com/choobohonar",
  mainSite: "https://choobohonar.com",
  campaignHost: "https://52.choobohonar.com",
};

export function shopUrl(path: string) {
  return `${brand.mainSite}${path.startsWith("/") ? path : `/${path}`}`;
}

export const campaign = {
  yearFa: "۱۴۰۵",
  yearEn: "2026",
  anniversary: 52,
  companyYears: 20,
  startFa: "۱۷ شهریور",
  endFa: "۵ مهر",
  rangeFa: "۱۷ شهریور تا ۵ مهر ۱۴۰۵",
  slogan: "خانه چوب و هنر، ۵۲ساله شد",
  definition: "ساختن خانه‌هایی با روح",
  definitionLong:
    "پنجاه‌ودو سال خانه‌هایی را با چوب، نور و دست ساختیم. حالا در این بازه، سهمی از همان همراهی به اعتبار خرید برای شما برمی‌گردد؛ اعتباری که خانه را کامل می‌کند.",
  heritage:
    "خانه چوب و هنر امروز حاصل بیش از پنج دهه تجربه، یادگیری و تعهد است؛ برندی که ریشه در میراث گذشته دارد، نیازهای امروز را می‌شناسد و برای آینده طراحی می‌کند.",
  tributeTitle: "به پاس ۵۲ سال همراهی",
  tribute:
    "اگر این خانه‌ها با شما زندگی کرده‌اند، این کمپین قدردانی از همان همراهی است. از ۱۷ شهریور تا ۵ مهر، هر خرید قطعی‌تان واحدهای اعتبار می‌سازد؛ واحدهایی که فقط برای کامل‌کردن خانه خرج می‌شوند: اکسسوری، کالای خواب و تشک.",
  unitMillion: 200,
  unitNote: "تا وقتی خرید به ۲۰۰ میلیون نرسد، واحدی ساخته نمی‌شود. باقیمانده برای واحد بعد می‌ماند.",
  purchaseNote:
    "خریدتان می‌تواند از هر گروه کالایی خانه باشد. اعتبار را برای اکسسوری، کالای خواب و تشک خرج می‌کنید.",
  scope: "همین قاعده در تمام شعب و نمایندگی‌های خانه چوب و هنر برقرار است.",
  tiersLead:
    "سطح باشگاه شما، سهم اعتبار را مشخص می‌کند. هر ۲۰۰ میلیون خرید قطعی یک واحد است؛ و این اعتبار برای اکسسوری، کالای خواب و تشک استفاده می شود.",
  shareLead: "مبلغ خریدتان را مشخص کنید تا سطح اعتباریتان مشخص شود",
};

export const goals = [
  "قدردانی از مشتریان وفادار و عضو باشگاه مشتریان",
  "افزایش انگیزهٔ خرید در دورهٔ کمپین",
  "جذب مشتریان جدید و عضویت آن‌ها در باشگاه مشتریان",
  "افزایش فروش کالاهای خرد شامل اکسسوری، کالای خواب و تشک",
  "تقویت ارتباط بلندمدت مشتریان با برند خانه چوب و هنر",
];

export type TierId = "vip" | "gold" | "silver" | "guest";

export type ClubTier = {
  id: TierId;
  rank: number;
  club: boolean;
  labelFa: string;
  labelEn: string;
  groupFa: string;
  creditPerUnit: number;
  tone: "vip" | "gold" | "silver" | "guest";
  blurb: string;
};

export const clubTiers: ClubTier[] = [
  {
    id: "vip",
    rank: 1,
    club: true,
    labelFa: "ویژه",
    labelEn: "VIP",
    groupFa: "اعضای باشگاه مشتریان",
    creditPerUnit: 25,
    tone: "vip",
    blurb: "بیشترین سهم، برای وفادارترین همراهی.",
  },
  {
    id: "gold",
    rank: 2,
    club: true,
    labelFa: "طلایی",
    labelEn: "Gold",
    groupFa: "اعضای باشگاه مشتریان",
    creditPerUnit: 20,
    tone: "gold",
    blurb: "سهم طلایی برای تکمیل خانه.",
  },
  {
    id: "silver",
    rank: 3,
    club: true,
    labelFa: "نقره‌ای",
    labelEn: "Silver",
    groupFa: "اعضای باشگاه مشتریان",
    creditPerUnit: 15,
    tone: "silver",
    blurb: "قدردانی از تداوم خرید شما.",
  },
  {
    id: "guest",
    rank: 4,
    club: false,
    labelFa: "غیرعضو",
    labelEn: "Guest",
    groupFa: "مشتریان غیرعضو",
    creditPerUnit: 10,
    tone: "guest",
    blurb: "حتی بدون عضویت هم سهم دارید.",
  },
];

export const formulaExamples = [
  { tier: "vip" as const, purchase: 500, credit: 50 },
  { tier: "gold" as const, purchase: 770, credit: 60 },
  { tier: "silver" as const, purchase: 250, credit: 15 },
  { tier: "guest" as const, purchase: 960, credit: 40 },
];

export type CatalogCategory = {
  slug: string;
  label: string;
  body: string;
  image: string;
  href: string;
  eligible?: boolean;
};

/** Live storefront taxonomy — same eight groups as choobohonar.com. */
export const catalogCategories: CatalogCategory[] = [
  {
    slug: "livingroom",
    label: "نشیمن",
    body: "مبلمان و میزهایی برای مکث، گفتگو و زندگی روزمره.",
    image: "/images/living.jpg",
    href: shopUrl("/products/category/livingroom"),
  },
  {
    slug: "bedroom",
    label: "اتاق خواب",
    body: "فضایی شخصی برای آرامش، نظم و شروع دوباره.",
    image: "/images/bedroom.jpg",
    href: shopUrl("/products/category/bedroom"),
  },
  {
    slug: "bedding",
    label: "کالای خواب",
    body: "لایه‌های نرم، تنفس‌پذیر و هماهنگ برای خواب بهتر.",
    image: "/images/category-bedding.jpg",
    href: shopUrl("/products/category/bedding"),
    eligible: true,
  },
  {
    slug: "diningroom",
    label: "غذاخوری",
    body: "میزبان لحظه‌هایی که دور یک میز شکل می‌گیرند.",
    image: "/images/dining.jpg",
    href: shopUrl("/products/category/diningroom"),
  },
  {
    slug: "carpet",
    label: "فرش و قالی",
    body: "بافت‌هایی که فضا را یکپارچه و گرم می‌کنند.",
    image: "/images/category-carpet.jpg",
    href: shopUrl("/products/category/carpet"),
  },
  {
    slug: "lighting",
    label: "روشنایی",
    body: "نورهایی برای تعریف حال‌وهوای هر گوشه از خانه.",
    image: "/images/category-lighting.jpg",
    href: shopUrl("/products/category/lighting"),
  },
  {
    slug: "decor",
    label: "دکور",
    body: "اشیایی کوچک با تأثیری ماندگار بر شخصیت فضا.",
    image: "/images/decor.jpg",
    href: shopUrl("/products/category/decor"),
  },
  {
    slug: "accessory",
    label: "اکسسوری",
    body: "آخرین لایه برای کامل‌کردن ترکیب خانه.",
    image: "/images/category-accessories.jpg",
    href: shopUrl("/products/category/decor"),
    eligible: true,
  },
];

export const eligibleGoods = [
  {
    id: "accessories",
    title: "اکسسوری",
    body: "جزئیات کوچک خانه؛ همان چیزهایی که فضا را مال شما می‌کند.",
    image: "/images/category-accessories.jpg",
    href: shopUrl("/products/category/decor"),
  },
  {
    id: "sleep",
    title: "کالای خواب",
    body: "روتختی و لایه‌های نرم خواب — جایی که سهم این دوره به زندگی روزمره برمی‌گردد.",
    image: "/images/category-bedding.jpg",
    href: shopUrl("/products/category/bedding"),
  },
  {
    id: "mattress",
    title: "تشک",
    body: "تشک هم در دامنهٔ اعتبار است؛ برای خانه‌ای که شب‌ها هم با شما همراه باشد.",
    image: "/images/category-mattress.jpg",
    href: shopUrl("/products/category/bedding/mattress"),
  },
];

export type CampaignStore = {
  id: string;
  kind: "branch" | "agency";
  city: string;
  name: string;
  address: string;
  hours?: string;
  phone?: string;
  mapsQuery: string;
};

export const stores: CampaignStore[] = [
  {
    id: "tehran-velenjak",
    kind: "branch",
    city: "تهران",
    name: "شعبه ولنجک",
    address: "مقدس اردبیلی، نبش شادآور، پلاک ۱۵",
    hours: "شنبه تا پنج‌شنبه، ۱۰ تا ۲۰",
    mapsQuery: "خانه چوب و هنر ولنجک مقدس اردبیلی نبش شادآور پلاک ۱۵",
  },
  {
    id: "tehran-bazaar-1",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۱",
    address: "یافت‌آباد شرقی، بازار مبل ایران ۱، طبقه اول، ۳۰۵",
    mapsQuery: "خانه چوب و هنر بازار مبل ایران ۱ یافت‌آباد طبقه اول پلاک ۳۰۵",
  },
  {
    id: "tehran-bazaar-3",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۳",
    address: "یافت‌آباد شرقی، بازار مبل ایران ۳، طبقه سوم، ۳۰۱",
    mapsQuery: "خانه چوب و هنر بازار مبل ایران ۳ یافت‌آباد طبقه سوم پلاک ۳۰۱",
  },
  {
    id: "shiraz",
    kind: "agency",
    city: "شیراز",
    name: "نمایندگی شیراز",
    address: "بزرگراه دوکوهک گویم، بین زیتون ۴ و ۵",
    phone: "09390602058",
    mapsQuery: "خانه چوب و هنر شیراز بزرگراه دوکوهک گویم بین زیتون ۴ و ۵",
  },
  {
    id: "bandar-abbas",
    kind: "agency",
    city: "بندرعباس",
    name: "نمایندگی بندرعباس",
    address: "بلوار چمران، نبش چمران ۴۲",
    mapsQuery: "خانه چوب و هنر بندرعباس بلوار چمران نبش چمران ۴۲",
  },
  {
    id: "tabriz",
    kind: "agency",
    city: "تبریز",
    name: "نمایندگی تبریز — پرسان هوم",
    address: "پرسان هوم، تبریز",
    mapsQuery: "نمایندگی خانه چوب و هنر تبریز پرسان هوم",
  },
];

export function googleMapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const nav = [
  { href: "#story", label: "کمپین" },
  { href: "#tiers", label: "سطوح باشگاه" },
  { href: "#share", label: "سهم ۵۲" },
  { href: "#join", label: "عضویت" },
];
