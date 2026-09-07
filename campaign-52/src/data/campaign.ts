export const brand = {
  nameFa: "خانه چوب و هنر",
  nameEn: "ChooboHonar Home",
  sloganFa: "سبک دلخواه من",
  sloganSubFa: "همراه تو در خلق خانه‌ای که دوستش داری",
  taglineFa: "ساختن خانه‌هایی با روح",
  phone: "02154169",
  phoneIntl: "02154169",
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
  unitNote: "تا وقتی خرید به ۲۰۰ میلیون تومان نرسد، واحدی ساخته نمی‌شود. باقیمانده برای واحد بعد می‌ماند.",
  purchaseNote:
    "خریدتان می‌تواند از هر گروه کالایی خانه باشد. اعتبار را برای اکسسوری، کالای خواب و تشک خرج می‌کنید.",
  scope: "همین قاعده در تمام شعب و نمایندگی‌های خانه چوب و هنر برقرار است.",
  tiersLead:
    "سطح باشگاه شما، سهم اعتبار را مشخص می‌کند. هر ۲۰۰ میلیون تومان خرید قطعی یک واحد است؛ و این اعتبار برای اکسسوری، کالای خواب و تشک استفاده می شود.",
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

export const clubDisplayTiers = clubTiers.filter((tier) => tier.club);

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
    image: shopUrl("/images/category-accessories.jpg"),
    href: shopUrl("/products/category/decor"),
    eligible: true,
  },
];

export const eligibleGoods = [
  {
    id: "accessories",
    title: "اکسسوری",
    body: "جزئیات کوچک خانه؛ همان چیزهایی که فضا را مال شما می‌کند.",
    image: "/brand/downloads/optimized/Frame-26.jpg",
    href: "https://choobohonar.com/product-category/accessory/",
  },
  {
    id: "sleep",
    title: "کالای خواب",
    body: "روتختی و لایه‌های نرم خواب — جایی که سهم این دوره به زندگی روزمره برمی‌گردد.",
    image: "/brand/downloads/optimized/Frame-25.jpg",
    href: "https://choobohonar.com/product-category/bedding/bedspreads/",
  },
  {
    id: "mattress",
    title: "تشک",
    body: "تشک هم در دامنهٔ اعتبار است؛ برای خانه‌ای که شب‌ها هم با شما همراه باشد.",
    image: "/brand/downloads/optimized/Frame-27.jpg",
    href: "https://choobohonar.com/product-category/bedding/?filter_model=%d8%aa%d8%b4%da%a9",
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
};

export const stores: CampaignStore[] = [
  {
    id: "tehran-bazaar-1",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۱",
    address: "یافت‌آباد شرقی، بازار مبل ایران شماره ۱، طبقه اول، شماره ۳۰۵",
    hours: "شنبه تا پنجشنبه ۱۰ تا ۲۰ · جمعه ۱۰ تا ۲۰",
    phone: "021-66312565",
  },
  {
    id: "tehran-bazaar-3",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۳",
    address: "یافت‌آباد شرقی، بازار مبل ایران شماره ۳، طبقه سوم، واحد ۳۰۱",
    hours: "شنبه تا پنجشنبه ۱۰ تا ۲۰ · جمعه ۱۰ تا ۲۰",
    phone: "021-66193084",
  },
  {
    id: "tehran-velenjak",
    kind: "branch",
    city: "تهران",
    name: "شعبه ولنجک",
    address: "خیابان مقدس اردبیلی، نبش شادآور، پلاک ۱۵، طبقه همکف",
    hours: "شنبه تا پنجشنبه ۱۰ تا ۲۲ · جمعه ۱۱ تا ۲۲",
    phone: "021-26373468",
  },
  {
    id: "ahvaz",
    kind: "agency",
    city: "اهواز",
    name: "نمایندگی اهواز",
    address: "کیانپارس، مجتمع تجاری پارک سنتر، طبقه سوم",
    hours: "شنبه تا پنجشنبه ۱۰ تا ۱۳ و ۱۷ تا ۲۲ · جمعه ۱۸ تا ۲۲",
    phone: "061-33916118",
  },
  {
    id: "bandar-abbas",
    kind: "agency",
    city: "بندرعباس",
    name: "نمایندگی بندرعباس",
    address: "بلوار چمران، روبروی ساختمان دادگستری، نبش چمران ۴۲",
    hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۷ تا ۲۲",
    phone: "076-33343880",
  },
  {
    id: "behshahr",
    kind: "agency",
    city: "بهشهر",
    name: "نمایندگی بهشهر — مبلمان ایده‌آل",
    address: "بعد از ایستگاه ساری، مبلمان ایده‌آل",
    hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۶:۳۰ تا ۲۱",
    phone: "011-34539000",
  },
  {
    id: "tabriz",
    kind: "agency",
    city: "تبریز",
    name: "نمایندگی تبریز — پرسان هوم",
    address: "میدان بسیج، به‌طرف سه‌راهی اهر، جنب آجیلی و خشکبار تواضع",
    hours: "شنبه تا پنجشنبه ۱۱ تا ۲۱ · جمعه ۱۱ تا ۲۱",
    phone: "09140700622",
  },
  {
    id: "rasht",
    kind: "agency",
    city: "رشت",
    name: "نمایندگی رشت — شهرک مبل",
    address: "ضلع شرقی میدان فرهنگ، شهرک مبل",
    hours: "شنبه تا پنجشنبه ۸:۳۰ تا ۱۳:۳۰ و ۱۶:۳۰ تا ۲۱:۳۰",
    phone: "013-33324916",
  },
  {
    id: "rafsanjan",
    kind: "agency",
    city: "رفسنجان",
    name: "نمایندگی رفسنجان — مبلمان خیام",
    address: "بلوار امام رضا، نبش خیابان نیایش، مبلمان خیام",
    hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۶:۳۰ تا ۲۱",
    phone: "034-34280840",
  },
  {
    id: "shiraz",
    kind: "agency",
    city: "شیراز",
    name: "نمایندگی شیراز",
    address: "بزرگراه دوکوهک گویم، بین زیتون ۴ و ۵",
    hours: "شنبه تا پنجشنبه ۹:۳۰ تا ۲۱ · جمعه ۱۰ تا ۱۴",
    phone: "09390602058",
  },
  {
    id: "qazvin",
    kind: "agency",
    city: "قزوین",
    name: "نمایندگی قزوین — بازار مبل رجبی",
    address: "شهرک ولایت، پردیس ۴، بازار مبل رجبی",
    hours: "شنبه تا پنجشنبه ۹ تا ۲۲",
    phone: "028-32249364",
  },
  {
    id: "qom",
    kind: "agency",
    city: "قم",
    name: "نمایندگی قم — مبلمان رضوی",
    address: "بلوار امین، جنب کوی ۲۱، پلاک ۵۴۹، مبلمان رضوی",
    hours: "شنبه تا پنجشنبه ۹:۳۰ تا ۱۴ و ۱۷ تا ۲۲:۳۰",
    phone: "025-32935500",
  },
  {
    id: "kashan",
    kind: "agency",
    city: "کاشان",
    name: "نمایندگی کاشان — گالری ویچیتار",
    address: "خیابان امیرکبیر، سیلک ۱۶، گالری ویچیتار",
    hours: "شنبه تا پنجشنبه ۱۰:۳۰ تا ۱۳:۳۰ و ۱۷ تا ۲۲",
    phone: "031-55341940",
  },
  {
    id: "hamedan",
    kind: "agency",
    city: "همدان",
    name: "نمایندگی همدان — فروشگاه ساهی",
    address: "خیابان میرزاده عشقی، بالاتر از تقاطع هنرستان، مبلمان ساهی",
    hours: "شنبه تا پنجشنبه ۹ تا ۱۳:۳۰ و ۱۶:۳۰ تا ۲۱:۳۰",
    phone: "081-38274050",
  },
  {
    id: "yazd",
    kind: "agency",
    city: "یزد",
    name: "نمایندگی یزد — مبلمان کسری",
    address: "خیابان سلمان فارسی، مبلمان کسری",
    hours: "شنبه تا پنجشنبه ۹ تا ۱۳:۳۰ و ۱۷ تا ۲۲",
    phone: "035-36237520",
  },
  {
    id: "tehran-kamard",
    kind: "agency",
    city: "تهران",
    name: "نمایندگی جاجرود",
    address: "جاده آبعلی تهران، منطقه صنعتی کمرد، بعد از کوچه چمستان، پلاک ۷۷۱ و ۷۷۳",
    hours: "- شنبه تا جمعه . ۱۰:۰۰ تا ۲۲:۰۰ ",
  },
];

export const nav = [
  { href: "#story", label: "کمپین" },
  { href: "#tiers", label: "سطوح باشگاه" },
  { href: "#scope", label: "شعب" },
];
