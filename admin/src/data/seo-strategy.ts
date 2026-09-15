export type SeoIntent = "ناوبری" | "اطلاعاتی" | "تجاری" | "تراکنشی";
export type SeoPriority = "P1" | "P2" | "P3";
export type SeoKind = "صفحه" | "مقاله";

export type SeoPillar = {
  id: string;
  index: string;
  title: string;
  role: string;
  href: string;
  clusters: string[];
};

export type SeoKeyword = {
  q: string;
  pillar: string;
  intent: SeoIntent;
  priority: SeoPriority;
  href: string;
  kind: SeoKind;
  title: string;
};

export function suggestedTitle(item: SeoKeyword) {
  return item.title;
}

export function keywordGap(gsc?: { ctr: number; impressions: number; position: number }) {
  if (!gsc) return "هدف جدید";
  if (gsc.impressions >= 2000 && gsc.ctr < 6) return "شکاف CTR";
  if (gsc.position >= 8) return "شکاف رتبه";
  if (gsc.position <= 1.2 && gsc.ctr >= 40) return "مالک برند";
  if (gsc.position <= 3) return "حفظ و تقویت";
  return "قابل رشد";
}

export function keywordAction(item: SeoKeyword, gsc?: { ctr: number; impressions: number; position: number }) {
  if (item.kind === "مقاله") {
    if (gsc && gsc.impressions >= 2000 && gsc.ctr < 6) return "مقاله کلاستر + بازنویسی تایتل دسته";
    return "انتشار با همین تایتل SERP";
  }
  if (gsc && gsc.impressions >= 2000 && gsc.ctr < 6) return "بازنویسی تایتل و متا صفحه";
  if (gsc && gsc.position <= 1.2) return "حفظ رتبه؛ FAQ و اسنیپت";
  if (gsc && gsc.position >= 8) return "کلاستر مقاله برای بالا آمدن";
  if (item.priority === "P1") return "قفل تایتل پیلار + لینک داخلی";
  return "تقویت صفحه هدف با همین تایتل";
}

function normalizeQuery(value: string) {
  return value.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\s+/g, " ").trim();
}

export function matchGscQuery<T extends { q: string }>(keyword: string, pool: T[]) {
  const needle = normalizeQuery(keyword);
  return pool.find((item) => normalizeQuery(item.q) === needle);
}

export const seoNorthStar =
  "خانه چوب و هنر باید برای هر تصمیم جدی خانه — نشیمن، خواب، غذاخوری، متریال و معماری داخلی — اولین نامی باشد که گوگل و مخاطب ایرانی به آن می‌رسند.";

export const seoThesis = [
  {
    title: "پیلار، نه پراکندگی",
    body: "هر دستهٔ واقعی سایت یک ستون موضوعی است. مجله، پروژه و محصول زیر همان ستون به هم لینک می‌شوند تا اعتبار موضوعی جمع شود، نه اینکه صد صفحهٔ جدا رقابت کنند.",
  },
  {
    title: "برند قبل از کالا",
    body: "کوئری‌های ناوبری و برند («خانه چوب و هنر»، کالکشن‌ها، شوروم) باید rank ۱ قطعی باشند. بقیهٔ رشد از همین اعتماد ساخته می‌شود.",
  },
  {
    title: "تجربه = سئو",
    body: "صفحهٔ پیلار باید مشاوره، عکس واقعی پروژه، موجودی و مسیر خرید را یکجا بدهد. رتبه بدون تبدیل برای این برند بی‌معنی است.",
  },
];

export const seoPillars: SeoPillar[] = [
  {
    id: "brand",
    index: "۰۰",
    title: "برند و خانه",
    role: "پیلار مرکزی اعتماد و ناوبری",
    href: "/",
    clusters: ["هویت برند", "شوروم و بازدید", "باشگاه و اعتبار", "کمپین ۵۲"],
  },
  {
    id: "living",
    index: "۰۱",
    title: "نشیمن",
    role: "پیلار کالای اصلی با بیشترین حجم جستجو",
    href: "/products/category/livingroom",
    clusters: ["کاناپه", "مبل تک و ال", "جلو و کنار مبلی", "میز تلویزیون", "کنسول و بوفه"],
  },
  {
    id: "bedroom",
    index: "۰۲",
    title: "اتاق خواب",
    role: "پیلار سرویس و ست کامل",
    href: "/products/category/bedroom",
    clusters: ["تخت", "پاتختی و دراور", "میز آرایش", "آینه و لاوست"],
  },
  {
    id: "dining",
    index: "۰۳",
    title: "غذاخوری",
    role: "پیلار میزبانی و ست میز",
    href: "/products/category/diningroom",
    clusters: ["میز ناهارخوری", "صندلی", "ست کامل", "ترولی"],
  },
  {
    id: "bedding",
    index: "۰۴",
    title: "کالای خواب",
    role: "پیلار تکرار خرید و اعتبار باشگاه",
    href: "/products/category/bedding",
    clusters: ["تشک", "روتختی", "ملحفه", "بالش و پتو"],
  },
  {
    id: "decor",
    index: "۰۵",
    title: "دکور و روشنایی",
    role: "پیلار تکمیل فضا و سبد متوسط",
    href: "/products/category/decor",
    clusters: ["اکسسوری", "آباژور و آویز", "فرش و گلیم", "ظروف سرو"],
  },
  {
    id: "interior",
    index: "۰۶",
    title: "معماری داخلی",
    role: "پیلار خدمات با ارزش قرارداد بالا",
    href: "/interior-architecture-services",
    clusters: ["طراحی منزل", "ویلا", "چیدمان", "مشاوره حضوری"],
  },
  {
    id: "projects",
    index: "۰۷",
    title: "پروژه‌ها و گالری",
    role: "پیلار اثبات کیفیت و لینک داخلی",
    href: "/projects",
    clusters: ["اکنون", "ویلا و سوئیت", "گالری فضا", "قبل و بعد"],
  },
  {
    id: "materials",
    index: "۰۸",
    title: "متریال و چوب",
    role: "پیلار تخصص که رقبا خالی گذاشته‌اند",
    href: "/materials",
    clusters: ["گردو و راش", "بلوط و توسکا", "نگهداری", "رنگ و روکش"],
  },
  {
    id: "collection",
    index: "۰۹",
    title: "کالکشن",
    role: "پیلار برنده‌سازی سری‌های اختصاصی",
    href: "/collection",
    clusters: ["سولو", "آلدر", "میپل", "آکومه", "چدار"],
  },
];

export const seoKeywords: SeoKeyword[] = [
  { q: "خانه چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/", kind: "صفحه", title: "خانه چوب و هنر | مبلمان چوبی و معماری داخلی" },
  { q: "چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/", kind: "صفحه", title: "چوب و هنر | سایت رسمی خانه چوب و هنر" },
  { q: "سایت خانه چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/", kind: "صفحه", title: "سایت خانه چوب و هنر | خرید و شوروم" },
  { q: "فروشگاه خانه چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/stores", kind: "صفحه", title: "فروشگاه خانه چوب و هنر | شعب تهران و کرج" },
  { q: "خانه چوب و هنر تهران", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/stores", kind: "صفحه", title: "خانه چوب و هنر تهران | شوروم ولنجک و یافت‌آباد" },
  { q: "برند چوب و هنر", pillar: "brand", intent: "اطلاعاتی", priority: "P1", href: "/", kind: "صفحه", title: "برند خانه چوب و هنر؛ ۵۲ سال مبلمان چوبی" },
  { q: "مبلمان چوب و هنر", pillar: "brand", intent: "تجاری", priority: "P1", href: "/products", kind: "صفحه", title: "مبلمان خانه چوب و هنر | کاناپه، خواب، غذاخوری" },
  { q: "آدرس خانه چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/stores", kind: "صفحه", title: "آدرس خانه چوب و هنر | ولنجک، یافت‌آباد، کرج" },
  { q: "شوروم خانه چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/stores", kind: "صفحه", title: "شوروم خانه چوب و هنر | بازدید و مشاوره چیدمان" },
  { q: "باشگاه مشتریان چوب و هنر", pillar: "brand", intent: "اطلاعاتی", priority: "P2", href: "/", kind: "صفحه", title: "باشگاه مشتریان خانه چوب و هنر | اعتبار خرید" },
  { q: "خانه چوب و هنر ۵۲ ساله", pillar: "brand", intent: "ناوبری", priority: "P2", href: "/landing", kind: "صفحه", title: "خانه چوب و هنر ۵۲ ساله | کالکشن سالگرد" },
  { q: "سبک دلخواه من", pillar: "brand", intent: "ناوبری", priority: "P2", href: "/", kind: "صفحه", title: "سبک دلخواه من | پیدا کردن کالکشن مبلمان" },
  { q: "مبلمان لوکس ایرانی", pillar: "brand", intent: "تجاری", priority: "P2", href: "/products", kind: "صفحه", title: "مبلمان لوکس ایرانی با چوب طبیعی | خرید و طراحی" },
  { q: "مبلمان چوبی دست‌ساز ایرانی", pillar: "brand", intent: "تجاری", priority: "P2", href: "/products", kind: "صفحه", title: "مبلمان چوبی دست‌ساز ایرانی | ساخت سفارشی" },
  { q: "خانه چوب", pillar: "brand", intent: "ناوبری", priority: "P1", href: "/magazine/choobohonar-vs-khaneh-choob", kind: "مقاله", title: "خانه چوب و هنر یا خانه چوب؟ تفاوت برند و دامنه" },

  { q: "مبلمان نشیمن", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید مبلمان نشیمن چوبی | کاناپه، ال و جلو مبلی" },
  { q: "کاناپه", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید کاناپه چوبی | سه نفره، راحتی و ال" },
  { q: "کاناپه چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید کاناپه چوبی | مدل، ابعاد و موجودی" },
  { q: "انواع کاناپه", pillar: "living", intent: "اطلاعاتی", priority: "P1", href: "/magazine/types-of-sofas-wood-l-shape-and-seater", kind: "مقاله", title: "انواع کاناپه؛ راحتی، ال، سه نفره و چوبی" },
  { q: "کاناپه سه نفره چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "کاناپه سه نفره چوبی | ابعاد، راحتی و قیمت" },
  { q: "مبل راحتی چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید مبل راحتی چوبی | مدل، نشیمن و قیمت" },
  { q: "مبل ال", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید مبل ال چوبی | مدل، ابعاد و چیدمان" },
  { q: "مبل ال چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/magazine/l-shaped-wooden-sofa-when-to-buy", kind: "مقاله", title: "مبل ال چوبی؛ کی برای نشیمن مناسب است" },
  { q: "مبل تک نفره چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید مبل تک نفره چوبی | راحتی و مدل مکمل" },
  { q: "جلو مبلی چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/magazine/coffee-table-and-side-table-guide", kind: "مقاله", title: "میز جلو مبلی چوبی؛ ابعاد استاندارد و مدل" },
  { q: "کنار مبلی چوبی", pillar: "living", intent: "تجاری", priority: "P2", href: "/products/category/livingroom", kind: "صفحه", title: "خرید میز کنار مبلی چوبی | ارتفاع و ست مبل" },
  { q: "میز تلویزیون چوبی", pillar: "living", intent: "تجاری", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید میز تلویزیون چوبی | کنسول و ذخیره‌سازی" },
  { q: "کنسول چوبی مدرن", pillar: "living", intent: "تجاری", priority: "P1", href: "/magazine/entryway-console-and-storage-guide", kind: "مقاله", title: "کنسول ورودی خانه؛ سایز، آینه و ذخیره‌سازی" },
  { q: "بوفه چوبی", pillar: "living", intent: "تجاری", priority: "P2", href: "/products/category/livingroom", kind: "صفحه", title: "خرید بوفه چوبی | ویترین پذیرایی و ذخیره" },
  { q: "ویترین چوبی", pillar: "living", intent: "تجاری", priority: "P2", href: "/products/category/livingroom", kind: "صفحه", title: "خرید ویترین چوبی | نمایش ظروف و دکوراسیون" },
  { q: "مبلمان فضای باز چوبی", pillar: "living", intent: "تجاری", priority: "P2", href: "/products/category/livingroom", kind: "صفحه", title: "مبلمان فضای باز چوبی | تراس و مقاومت رطوبت" },
  { q: "خرید کاناپه چوبی", pillar: "living", intent: "تراکنشی", priority: "P1", href: "/products/category/livingroom", kind: "صفحه", title: "خرید کاناپه چوبی | موجودی، ابعاد و قیمت" },
  { q: "قیمت مبل چوبی", pillar: "living", intent: "تجاری", priority: "P2", href: "/magazine/wooden-sofa-price-factors", kind: "مقاله", title: "قیمت مبل چوبی به چه عواملی بستگی دارد؟" },
  { q: "مبل چدار", pillar: "living", intent: "ناوبری", priority: "P1", href: "/products", kind: "صفحه", title: "مبل چدار خانه چوب و هنر | مشخصات و ست" },
  { q: "دکوراسیون اتاق نشیمن", pillar: "living", intent: "اطلاعاتی", priority: "P2", href: "/magazine/small-living-room-sofa-layout", kind: "مقاله", title: "دکوراسیون اتاق نشیمن ایرانی | مبل، فرش و نور" },
  { q: "ایده چیدمان نشیمن", pillar: "living", intent: "اطلاعاتی", priority: "P2", href: "/magazine/small-living-room-sofa-layout", kind: "مقاله", title: "چیدمان نشیمن کوچک؛ مبل کامل بدون شلوغی" },
  { q: "ست مبلمان کامل منزل", pillar: "living", intent: "تجاری", priority: "P2", href: "/products", kind: "صفحه", title: "ست مبلمان کامل منزل | نشیمن، خواب، غذاخوری" },

  { q: "سرویس خواب چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید سرویس خواب چوبی | تخت، دراور و پاتختی" },
  { q: "تخت", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید تخت خواب چوبی دو نفره | ابعاد و مدل" },
  { q: "تخت خواب", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/magazine/wooden-double-bed-size-and-buying-guide", kind: "مقاله", title: "خرید تخت خواب چوبی دو نفره؛ ابعاد و مدل" },
  { q: "تخت خواب چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید تخت خواب چوبی | دو نفره، تاج و کشو" },
  { q: "تخت دو نفره چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "تخت دو نفره چوبی | سایز ۱۶۰ و ۱۸۰" },
  { q: "پاتختی چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید پاتختی چوبی | ارتفاع استاندارد و ست خواب" },
  { q: "دراور چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید دراور چوبی | کشو، سایز و اتاق خواب" },
  { q: "میز آرایش چوبی", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید میز آرایش چوبی | آینه، دراور و صندلی" },
  { q: "سرویس خواب مدرن", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید سرویس خواب مدرن چوبی | ساده و کم‌جا" },
  { q: "سرویس خواب لوکس", pillar: "bedroom", intent: "تجاری", priority: "P2", href: "/products/category/bedroom", kind: "صفحه", title: "سرویس خواب لوکس چوبی | چوب طبیعی و سفارشی" },
  { q: "تخت خواب میپل", pillar: "bedroom", intent: "ناوبری", priority: "P1", href: "/collection", kind: "صفحه", title: "تخت خواب میپل | کالکشن خانه چوب و هنر" },
  { q: "خرید سرویس خواب چوبی", pillar: "bedroom", intent: "تراکنشی", priority: "P1", href: "/products/category/bedroom", kind: "صفحه", title: "خرید سرویس خواب چوبی | قیمت، ابعاد، موجودی" },
  { q: "راهنمای خرید سرویس خواب", pillar: "bedroom", intent: "اطلاعاتی", priority: "P1", href: "/magazine/bedroom-set-selection-guide", kind: "مقاله", title: "راهنمای خرید سرویس خواب چوبی؛ تخت تا دراور" },
  { q: "دکوراسیون اتاق خواب", pillar: "bedroom", intent: "اطلاعاتی", priority: "P2", href: "/magazine/bedroom-set-selection-guide", kind: "مقاله", title: "دکوراسیون اتاق خواب چوبی | چیدمان و نور" },
  { q: "آینه کنسول اتاق خواب", pillar: "bedroom", intent: "تجاری", priority: "P2", href: "/products/category/bedroom", kind: "صفحه", title: "آینه و کنسول اتاق خواب | ست میز آرایش" },
  { q: "صندلی میز آرایش", pillar: "bedroom", intent: "تجاری", priority: "P1", href: "/magazine/vanity-chair-height-and-wood-guide", kind: "مقاله", title: "صندلی میز آرایش؛ ارتفاع، راحتی و مدل چوبی" },

  { q: "میز غذاخوری چوبی", pillar: "dining", intent: "تجاری", priority: "P1", href: "/products/category/diningroom", kind: "صفحه", title: "خرید میز غذاخوری چوبی | ۴، ۶ و ۸ نفره" },
  { q: "میز ناهارخوری چوبی", pillar: "dining", intent: "تجاری", priority: "P1", href: "/products/category/diningroom", kind: "صفحه", title: "خرید میز ناهارخوری چوبی | ابعاد، چوب و مدل" },
  { q: "صندلی غذاخوری چوبی", pillar: "dining", intent: "تجاری", priority: "P1", href: "/products/category/diningroom", kind: "صفحه", title: "خرید صندلی غذاخوری چوبی | راحتی و ست میز" },
  { q: "میز ناهارخوری ۶ نفره", pillar: "dining", intent: "تجاری", priority: "P1", href: "/magazine/dining-table-size-and-layout-guide", kind: "مقاله", title: "ابعاد میز ناهارخوری ۴، ۶ و ۸ نفره" },
  { q: "میز ناهارخوری ۸ نفره", pillar: "dining", intent: "تجاری", priority: "P2", href: "/products/category/diningroom", kind: "صفحه", title: "میز ناهارخوری ۸ نفره چوبی | سایز و صندلی" },
  { q: "ست غذاخوری چوبی", pillar: "dining", intent: "تجاری", priority: "P1", href: "/products/category/diningroom", kind: "صفحه", title: "ست غذاخوری چوبی | میز و صندلی هماهنگ" },
  { q: "میز غذاخوری مدرن", pillar: "dining", intent: "تجاری", priority: "P2", href: "/products/category/diningroom", kind: "صفحه", title: "میز غذاخوری مدرن چوبی | گرد و مستطیل" },
  { q: "میز ناهارخوری گرد چوبی", pillar: "dining", intent: "تجاری", priority: "P2", href: "/products/category/diningroom", kind: "صفحه", title: "میز ناهارخوری گرد چوبی | فضاهای کوچک و باز" },
  { q: "خرید میز ناهارخوری", pillar: "dining", intent: "تراکنشی", priority: "P1", href: "/products/category/diningroom", kind: "صفحه", title: "خرید میز ناهارخوری چوبی | قیمت و موجودی" },
  { q: "میز غذاخوری سولو", pillar: "dining", intent: "ناوبری", priority: "P1", href: "/collection/solo", kind: "صفحه", title: "میز غذاخوری سولو | کالکشن مدرن چوب و هنر" },
  { q: "ایده چیدمان غذاخوری", pillar: "dining", intent: "اطلاعاتی", priority: "P2", href: "/magazine/dining-table-size-and-layout-guide", kind: "مقاله", title: "چیدمان غذاخوری خانه ایرانی | میز، صندلی، نور" },

  { q: "تشک طبی", pillar: "bedding", intent: "تجاری", priority: "P1", href: "/products/category/bedding", kind: "صفحه", title: "خرید تشک طبی | سفتی، ابعاد و انتخاب خواب" },
  { q: "بهترین تشک", pillar: "bedding", intent: "اطلاعاتی", priority: "P1", href: "/magazine/best-orthopedic-mattress-buying-guide", kind: "مقاله", title: "بهترین تشک طبی را چطور انتخاب کنیم؟" },
  { q: "خرید تشک", pillar: "bedding", intent: "تراکنشی", priority: "P1", href: "/products/category/bedding", kind: "صفحه", title: "خرید تشک دونفره و یک‌نفره | طبی و فوم" },
  { q: "تشک مموری فوم", pillar: "bedding", intent: "تجاری", priority: "P2", href: "/products/category/bedding", kind: "صفحه", title: "تشک مموری فوم | مزایا، معایب و خرید" },
  { q: "تشک دونفره", pillar: "bedding", intent: "تجاری", priority: "P1", href: "/products/category/bedding", kind: "صفحه", title: "خرید تشک دونفره | سایز استاندارد و ارتفاع" },
  { q: "روتختی لوکس", pillar: "bedding", intent: "تجاری", priority: "P2", href: "/products/category/bedding", kind: "صفحه", title: "خرید روتختی لوکس | جنس، سایز و ست خواب" },
  { q: "سرویس روتختی", pillar: "bedding", intent: "تجاری", priority: "P2", href: "/products/category/bedding", kind: "صفحه", title: "سرویس روتختی کامل | روبالشی، کاور، ملحفه" },
  { q: "ملحفه کتان", pillar: "bedding", intent: "تجاری", priority: "P2", href: "/products/category/bedding", kind: "صفحه", title: "خرید ملحفه کتان | خنک، بادوام، تابستان" },
  { q: "بالش طبی", pillar: "bedding", intent: "تجاری", priority: "P2", href: "/products/category/bedding", kind: "صفحه", title: "خرید بالش طبی | ارتفاع، فوم و درد گردن" },
  { q: "کالای خواب لوکس", pillar: "bedding", intent: "تجاری", priority: "P1", href: "/products/category/bedding", kind: "صفحه", title: "کالای خواب لوکس | تشک، روتختی و ملحفه" },
  { q: "پتو لوکس", pillar: "bedding", intent: "تجاری", priority: "P3", href: "/products/category/bedding", kind: "صفحه", title: "خرید پتو لوکس | وزن، جنس و فصل" },

  { q: "آباژور ایستاده", pillar: "decor", intent: "تجاری", priority: "P2", href: "/magazine/living-room-lighting-and-furniture-guide", kind: "مقاله", title: "نورپردازی نشیمن؛ آباژور، آویز و چیدمان مبل" },
  { q: "آباژور رومیزی", pillar: "decor", intent: "تجاری", priority: "P2", href: "/products/category/lighting", kind: "صفحه", title: "خرید آباژور رومیزی | پاتختی، کنسول، مطالعه" },
  { q: "آویز روشنایی چوبی", pillar: "decor", intent: "تجاری", priority: "P2", href: "/products/category/lighting", kind: "صفحه", title: "آویز روشنایی چوبی | میز ناهارخوری و نشیمن" },
  { q: "فرش مدرن ایرانی", pillar: "decor", intent: "تجاری", priority: "P2", href: "/magazine/rug-selection-for-living-room-guide", kind: "مقاله", title: "فرش نشیمن؛ سایز، رنگ و هماهنگی با مبل" },
  { q: "گلیم مدرن", pillar: "decor", intent: "تجاری", priority: "P3", href: "/products/category/carpet", kind: "صفحه", title: "خرید گلیم مدرن | نشیمن، غذاخوری و راهرو" },
  { q: "اکسسوری دکوراسیون", pillar: "decor", intent: "تجاری", priority: "P2", href: "/products/category/decor", kind: "صفحه", title: "اکسسوری دکوراسیون منزل | دکور چوبی" },
  { q: "دکوراتیو چوبی", pillar: "decor", intent: "تجاری", priority: "P1", href: "/products/category/decor", kind: "صفحه", title: "خرید دکوراتیو چوبی | ظروف، دیوارکوب، مجسمه" },
  { q: "رانر میز ناهارخوری", pillar: "decor", intent: "تجاری", priority: "P3", href: "/products/category/decor", kind: "صفحه", title: "رانر میز ناهارخوری | عرض، جنس و ست رومیزی" },
  { q: "ظروف سرو چوبی", pillar: "decor", intent: "تجاری", priority: "P3", href: "/products/category/decor", kind: "صفحه", title: "ظروف سرو چوبی | سینی، کاسه و میز مهمانی" },
  { q: "خرید اکسسوری منزل", pillar: "decor", intent: "تراکنشی", priority: "P2", href: "/products/category/decor", kind: "صفحه", title: "خرید اکسسوری منزل | دکور، نور و بافت" },

  { q: "معماری داخلی تهران", pillar: "interior", intent: "تجاری", priority: "P1", href: "/magazine/tehran-interior-design-wooden-furniture", kind: "مقاله", title: "طراحی داخلی منزل در تهران با مبلمان چوبی" },
  { q: "طراحی داخلی منزل", pillar: "interior", intent: "تجاری", priority: "P1", href: "/interior-architecture-services", kind: "صفحه", title: "طراحی داخلی منزل | از پلان تا چیدمان و مبلمان" },
  { q: "دکوراسیون داخلی لوکس", pillar: "interior", intent: "تجاری", priority: "P1", href: "/interior-architecture-services", kind: "صفحه", title: "دکوراسیون داخلی با چوب طبیعی | پروژه و نور" },
  { q: "طراحی داخلی ویلا", pillar: "interior", intent: "تجاری", priority: "P1", href: "/magazine/north-villa-interior-wood-and-layout", kind: "مقاله", title: "طراحی داخلی ویلا شمال؛ چوب، رطوبت و چیدمان" },
  { q: "بازسازی منزل تهران", pillar: "interior", intent: "تجاری", priority: "P2", href: "/magazine/interior-renovation-planning-guide", kind: "مقاله", title: "بازسازی منزل تهران؛ بریف، بودجه و چیدمان" },
  { q: "چیدمان منزل", pillar: "interior", intent: "اطلاعاتی", priority: "P2", href: "/interior-architecture-services", kind: "صفحه", title: "چیدمان منزل | نشیمن، خواب و غذاخوری هماهنگ" },
  { q: "مشاوره دکوراسیون", pillar: "interior", intent: "تراکنشی", priority: "P1", href: "/contact", kind: "صفحه", title: "مشاوره دکوراسیون حضوری | شوروم و بازدید خانه" },
  { q: "طراحی داخلی با مبلمان چوبی", pillar: "interior", intent: "تجاری", priority: "P2", href: "/interior-architecture-services", kind: "صفحه", title: "طراحی داخلی با مبلمان چوبی | پروژه و کالکشن" },
  { q: "شرکت معماری داخلی", pillar: "interior", intent: "تجاری", priority: "P2", href: "/interior-architecture-services", kind: "صفحه", title: "شرکت معماری داخلی تهران | طراحی و اجرا" },

  { q: "پروژه معماری داخلی", pillar: "projects", intent: "اطلاعاتی", priority: "P2", href: "/projects", kind: "صفحه", title: "پروژه‌های معماری داخلی | نمونه کار چوب و هنر" },
  { q: "نمونه کار دکوراسیون داخلی", pillar: "projects", intent: "اطلاعاتی", priority: "P1", href: "/magazine/residential-interior-project-from-plan-to-detail", kind: "مقاله", title: "نمونه کار طراحی داخلی منزل؛ از پلان تا چیدمان" },
  { q: "گالری خانه چوب و هنر", pillar: "projects", intent: "ناوبری", priority: "P1", href: "/gallery", kind: "صفحه", title: "گالری خانه چوب و هنر | فضا، محصول و پروژه" },
  { q: "پروژه اکنون چوب و هنر", pillar: "projects", intent: "ناوبری", priority: "P1", href: "/projects", kind: "صفحه", title: "پروژه اکنون | طراحی داخلی و مبلمان سفارشی" },
  { q: "طراحی ویلا شمال", pillar: "projects", intent: "تجاری", priority: "P2", href: "/projects", kind: "صفحه", title: "طراحی داخلی ویلا شمال | نمونه کار و چوب" },
  { q: "دکوراسیون پنت‌هاوس", pillar: "projects", intent: "اطلاعاتی", priority: "P3", href: "/projects", kind: "صفحه", title: "دکوراسیون پنت‌هاوس | نشیمن باز، مبلمان و نور" },

  { q: "مبلمان چوب گردو", pillar: "materials", intent: "تجاری", priority: "P1", href: "/materials/wood/walnut", kind: "صفحه", title: "مبلمان چوب گردو | رنگ، دوام و کالکشن‌ها" },
  { q: "مبلمان چوب راش", pillar: "materials", intent: "تجاری", priority: "P1", href: "/materials", kind: "صفحه", title: "مبلمان چوب راش | اسکلت، سرویس خواب و دوام" },
  { q: "مبلمان چوب بلوط", pillar: "materials", intent: "تجاری", priority: "P2", href: "/materials", kind: "صفحه", title: "مبلمان چوب بلوط | بافت، مقاومت و کاربرد" },
  { q: "مبلمان چوب توسکا", pillar: "materials", intent: "تجاری", priority: "P2", href: "/materials", kind: "صفحه", title: "مبلمان چوب توسکا | وزن، رنگ و نگهداری" },
  { q: "روکش چوب طبیعی", pillar: "materials", intent: "اطلاعاتی", priority: "P2", href: "/magazine/wood-and-veneer-furniture-material-guide", kind: "مقاله", title: "روکش چوب طبیعی در مبلمان | تفاوت با ماسیو" },
  { q: "رنگ چوب مبلمان", pillar: "materials", intent: "اطلاعاتی", priority: "P2", href: "/magazine/wood-finishes-for-interior-guide", kind: "مقاله", title: "رنگ چوب مبلمان | نچرال، گردو و پالت خانه" },
  { q: "نگهداری مبلمان چوبی", pillar: "materials", intent: "اطلاعاتی", priority: "P1", href: "/magazine/furniture-care-by-material-guide", kind: "مقاله", title: "نگهداری مبلمان چوبی؛ رطوبت، لک و ترک" },
  { q: "تفاوت چوب راش و گردو", pillar: "materials", intent: "اطلاعاتی", priority: "P1", href: "/magazine/beech-vs-walnut-furniture-wood", kind: "مقاله", title: "تفاوت چوب راش و گردو در مبلمان؛ دوام و رنگ" },
  { q: "چوب مناسب سرویس خواب", pillar: "materials", intent: "اطلاعاتی", priority: "P2", href: "/magazine/wood-and-veneer-furniture-material-guide", kind: "مقاله", title: "چوب مناسب مبلمان؛ راش، گردو، بلوط یا روکش؟" },

  { q: "کالکشن سولو", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection/solo", kind: "صفحه", title: "کالکشن سولو | مبلمان مدرن خانه چوب و هنر" },
  { q: "کالکشن آلدر", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection", kind: "صفحه", title: "کالکشن آلدر | نشیمن چوبی خانه چوب و هنر" },
  { q: "کالکشن میپل", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection", kind: "صفحه", title: "کالکشن میپل | سرویس خواب خانه چوب و هنر" },
  { q: "کالکشن آکومه", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection", kind: "صفحه", title: "کالکشن آکومه | مبلمان خانه چوب و هنر" },
  { q: "مبل سولو", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection/solo", kind: "صفحه", title: "مبل سولو | کاناپه و ست کالکشن مدرن" },
  { q: "کاناپه سولو", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection/solo", kind: "صفحه", title: "کاناپه سولو خانه چوب و هنر | مشخصات و ست" },
  { q: "مبلمان مدرن ایرانی", pillar: "collection", intent: "تجاری", priority: "P2", href: "/collection", kind: "صفحه", title: "مبلمان مدرن ایرانی | سولو و چوب طبیعی" },
  { q: "کالکشن خانه چوب و هنر", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/collection", kind: "صفحه", title: "کالکشن‌های خانه چوب و هنر | سولو، آلدر، میپل" },
  { q: "مبل کارلو", pillar: "collection", intent: "ناوبری", priority: "P1", href: "/magazine/carlo-sofa-original-choobohonar", kind: "مقاله", title: "مبل کارلو اصل خانه چوب و هنر | مشخصات ست" },

  { q: "شوروم مبلمان تهران", pillar: "brand", intent: "تجاری", priority: "P1", href: "/magazine/tehran-furniture-showroom-velenjak-yaftabad", kind: "مقاله", title: "شوروم مبلمان تهران؛ ولنجک و یافت‌آباد" },
  { q: "فروشگاه مبلمان الهیه", pillar: "brand", intent: "ناوبری", priority: "P2", href: "/stores", kind: "صفحه", title: "فروشگاه مبلمان الهیه و ولنجک | چوب و هنر" },
  { q: "بازدید شوروم مبلمان", pillar: "brand", intent: "تراکنشی", priority: "P1", href: "/stores", kind: "صفحه", title: "بازدید شوروم مبلمان | نوبت مشاوره و چیدمان" },
  { q: "نمایندگی چوب و هنر", pillar: "brand", intent: "ناوبری", priority: "P2", href: "/stores", kind: "صفحه", title: "نمایندگی خانه چوب و هنر | شعب تهران و شهرستان" },

  { q: "خرید مبلمان چوبی", pillar: "living", intent: "تراکنشی", priority: "P1", href: "/products", kind: "صفحه", title: "خرید مبلمان چوبی | کاناپه، خواب و غذاخوری" },
  { q: "مبلمان سفارشی", pillar: "interior", intent: "تجاری", priority: "P1", href: "/contact", kind: "صفحه", title: "ساخت مبلمان سفارشی | از بریف تا نصب در خانه" },
  { q: "ساخت مبلمان سفارشی", pillar: "interior", intent: "تجاری", priority: "P2", href: "/magazine/custom-furniture-order-process", kind: "مقاله", title: "ساخت مبلمان سفارشی؛ از بریف تا نصب" },
  { q: "راهنمای خرید مبل", pillar: "living", intent: "اطلاعاتی", priority: "P1", href: "/magazine/sofa-selection-living-room-guide", kind: "مقاله", title: "راهنمای خرید مبل ۱۴۰۵؛ ابعاد، راحتی و چوب" },
  { q: "مبلمان جهیزیه لوکس", pillar: "living", intent: "تجاری", priority: "P2", href: "/products", kind: "صفحه", title: "مبلمان جهیزیه | ست خواب، نشیمن و غذاخوری" },
  { q: "میز تحریر چوبی", pillar: "living", intent: "تجاری", priority: "P3", href: "/products", kind: "صفحه", title: "خرید میز تحریر چوبی | کار در خانه و ابعاد" },
  { q: "کمد کنسول مدرن", pillar: "living", intent: "تجاری", priority: "P2", href: "/products/category/livingroom", kind: "صفحه", title: "کمد و کنسول مدرن چوبی | ورودی و پذیرایی" },
  { q: "اعتبار خرید مبلمان", pillar: "brand", intent: "اطلاعاتی", priority: "P3", href: "/landing", kind: "صفحه", title: "اعتبار خرید مبلمان | باشگاه خانه چوب و هنر" },
];

export const seoMotions = [
  {
    phase: "قبل از سوییچ",
    title: "حفظ ارزش سایت فعلی",
    items: [
      "نقشهٔ ۳۰۱ برای /shop /product /product-category /contact-us /collection/carlow /branches.",
      "robots فقط ادمین، API و سبد را ببندد.",
      "پراپرتی فعلی Search Console را حذف نکن؛ sitemap جدید را همان‌جا submit کن.",
    ],
  },
  {
    phase: "۳۰ روز",
    title: "تایتل‌هایی که همین حالا ایمپرشن دارند",
    items: [
      "دستهٔ نشیمن: «خرید کاناپه چوبی | سه نفره، راحتی و ال» — ۱۶ هزار ایمپرشن با CTR ۱٪.",
      "دستهٔ خواب: «خرید تخت خواب چوبی دو نفره | ابعاد و مدل» — رتبهٔ ۹٫۶ را با تایتل نیت‌دار بالا بکش.",
      "شش مقالهٔ اول تقویم: انواع کاناپه، راهنمای خرید مبل، تخت دو نفره، صندلی میز آرایش، کارلو اصل، رفع ابهام خانه چوب.",
    ],
  },
  {
    phase: "۶۰–۹۰ روز",
    title: "کلاسترهایی که رقبا نوشته‌اند و ما نه",
    items: [
      "راش در برابر گردو، سرویس خواب، ابعاد میز ۶ نفره، مبل ال، طراحی داخلی تهران.",
      "اسنیپت محصول: قیمت و موجودی در title؛ CTR ۵٪ باید دو برابر شود.",
      "تایتل را از این صفحه کپی کن، در CMS همان را <title> و H1 بگذار، بعد به پیلار لینک بده.",
    ],
  },
];
