export type Finish = { id: string; label: string; hex: string };
export type ProductRoom = "living" | "bedroom" | "bedding" | "dining" | "decor" | "carpet" | "lighting" | "dishes";

import shopCatalogRaw from "./shop-catalog.json";

export type ProductReview = {
  author: string;
  rating: number;
  date: string;
  body: string;
  location?: string;
};

export type ProductFaq = { q: string; a: string };

export type TechBlock = { title: string; body: string; image?: string };

export type Product = {
  slug: string;
  name: string;
  series: string;
  category: string;
  room: ProductRoom;
  shortDescription: string;
  longDescription: string;
  image: string;
  gallery: string[];
  finishes: string[];
  /** External shop URL on a separate subdomain; falls back to NEXT_PUBLIC_SHOP_URL. */
  shopUrl?: string;
  dimensions: { width: number; depth: number; height: number };
  specs: { label: string; value: string }[];
  highlights: { title: string; description: string }[];
  technical: TechBlock[];
  warranty: string;
  leadTime: string;
  reviews: ProductReview[];
  faq: ProductFaq[];
};

export const finishes: Finish[] = [
  { id: "walnut", label: "گردو", hex: "#5A3830" },
  { id: "mahogany", label: "ماهاگونی", hex: "#7B3A2A" },
  { id: "natural", label: "نچرال", hex: "#C9A37A" },
  { id: "hazelnut", label: "فندقی", hex: "#A9784E" },
  { id: "beige", label: "بژ روشن", hex: "#D8C4A8" },
];

export { roomLabels, getRoomLabel } from "@/data/product-categories";

export const products: Product[] = [
  {
    slug: "maple-bed-set",
    name: "سرویس خواب میپل",
    series: "Maple",
    category: "اتاق خواب",
    room: "bedroom",
    shortDescription: "سرویس خواب کامل با قاب چوب جنگلی خشک‌شده در کوره.",
    longDescription:
      "سرویس خواب میپل با خطوط آرام و نسبت‌های متوازن طراحی شده؛ قاب از چوب سخت خشک‌شده در کوره و روکش‌های اصیل چوب، با اتصالاتی که برای دوام چند نسل ساخته شده‌اند.",
    image: "/images/aknoon-15.jpg",
    gallery: ["/images/aknoon-15.jpg", "/images/aknoon-16.jpg", "/images/aknoon-18.jpg", "/images/aknoon-09.jpg"],
    shopUrl: "https://choobohonar.com/shop/",
    finishes: ["walnut", "mahogany", "natural"],
    dimensions: { width: 210, depth: 180, height: 120 },
    specs: [
      { label: "جنس قاب", value: "چوب سخت خشک‌شده در کوره" },
      { label: "روکش", value: "روکش اصیل چوب طبیعی" },
      { label: "هسته", value: "ام‌دی‌اف استاندارد" },
    ],
    highlights: [
      { title: "چوب خشک‌شده در کوره", description: "رطوبت چوب تا محدوده‌ی استاندارد کنترل می‌شود تا از تابیدگی و ترک در طول زمان جلوگیری شود." },
      { title: "اتصالات مهندسی‌شده", description: "اتصالات فاق‌وزبانه و تقویت‌های گوشه‌ای، استحکام تاج تخت را برای سال‌ها تضمین می‌کنند." },
      { title: "پرداخت سازگار با محیط", description: "پوشش‌های پایه‌آب کم‌بو و مقاوم در برابر سایش روزمره." },
    ],
    technical: [
      {
        title: "متریال و ساختار بدنه",
        body: "قاب اصلی از چوب سخت راش و روکش طبیعی گردو ساخته می‌شود. هسته‌ی پنل‌ها ام‌دی‌اف ضدرطوبت با تراکم بالاست تا سطحی صاف و پایدار برای روکش‌گیری فراهم شود. تمام لبه‌ها نوارکاری و سپس دستی پرداخت می‌شوند.",
        image: "/images/aknoon-16.jpg",
      },
      {
        title: "فرایند پرداخت و رنگ",
        body: "سطوح در چند مرحله سنباده، بتونه و پوشش پلی‌اورتان مات اجرا می‌شوند. این لایه‌بندی هم رگه‌ی طبیعی چوب را حفظ می‌کند و هم مقاومت در برابر لک و رطوبت را بالا می‌برد.",
        image: "/images/aknoon-18.jpg",
      },
      {
        title: "نگهداری و مراقبت",
        body: "برای تمیزکاری از دستمال نرم و کمی مرطوب استفاده کنید و از مواد شوینده‌ی ساینده بپرهیزید. دوری از تابش مستقیم و طولانی آفتاب، یکنواختی رنگ روکش را در طول زمان حفظ می‌کند.",
      },
    ],
    warranty: "۵ سال گارانتی سازه و اتصالات",
    leadTime: "۳ تا ۵ هفته‌ی کاری",
    reviews: [
      { author: "نگار محمدی", rating: 5, date: "۱۴۰۳/۱۰/۰۲", location: "تهران", body: "کیفیت چوب و رنگ دقیقاً مطابق چیزی بود که در شوروم دیدیم. نصب تمیز و بدون خش انجام شد." },
      { author: "امیر رضایی", rating: 4, date: "۱۴۰۳/۰۸/۱۹", location: "کرج", body: "ساخت بسیار محکمی دارد. فقط تحویل کمی بیشتر از زمان اعلامی طول کشید اما ارزشش را داشت." },
      { author: "سحر کاظمی", rating: 5, date: "۱۴۰۳/۰۶/۱۱", location: "اصفهان", body: "جزئیات اتصالات و پرداخت لبه‌ها واقعاً حرفه‌ای است. بعد از یک سال هیچ تابیدگی ندیدیم." },
    ],
    faq: [
      { q: "آیا امکان سفارش در ابعاد دلخواه وجود دارد؟", a: "بله، ابعاد تاج تخت و پاتختی‌ها قابل سفارشی‌سازی است. کارشناسان ما در جلسه‌ی مشاوره گزینه‌ها را بررسی می‌کنند." },
      { q: "تشک همراه سرویس ارائه می‌شود؟", a: "سرویس شامل قاب، تاج و پاتختی است. تشک به‌صورت جداگانه و بر اساس انتخاب شما پیشنهاد می‌شود." },
      { q: "نصب در محل انجام می‌شود؟", a: "بله، ارسال و نصب تخصصی در محل توسط تیم خانه چوب و هنر در تهران و حومه انجام می‌گیرد." },
    ],
  },
  {
    slug: "alder-sofa",
    name: "مبل اِلدِر",
    series: "Alder",
    category: "نشیمن",
    room: "living",
    shortDescription: "مبل راحتی با اسکلت چوبی و رویه پارچه‌ای ممتاز.",
    longDescription:
      "مبل الدر تعادل میان راحتی و خطوط معماری را به نمایش می‌گذارد؛ اسکلت چوبی مستحکم، فوم چندلایه و رویه‌ای که در طیف وسیعی از پارچه و چرم قابل سفارش است.",
    image: "/images/aknoon-02.jpg",
    gallery: ["/images/aknoon-02.jpg", "/images/aknoon-07.jpg", "/images/aknoon-05.jpg", "/images/aknoon-11.jpg"],
    shopUrl: "https://choobohonar.com/product/%da%a9%d8%a7%d9%86%d8%a7%d9%be%d9%87-%d8%a2%d9%84%d8%af%d8%b1/",
    finishes: ["natural", "hazelnut", "beige"],
    dimensions: { width: 240, depth: 95, height: 85 },
    specs: [
      { label: "اسکلت", value: "چوب سخت + بلوک گوشه" },
      { label: "رویه", value: "پارچه یا چرم به انتخاب" },
      { label: "نشیمن", value: "فوم چندلایه دانسیته بالا" },
    ],
    highlights: [
      { title: "نشیمن دانسیته بالا", description: "ترکیب فوم سرد و الیاف سیلیکونی، فرم نشیمن را پس از سال‌ها استفاده حفظ می‌کند." },
      { title: "رویه‌ی قابل تعویض", description: "امکان انتخاب از میان ده‌ها طرح پارچه‌ی ضدلک و چرم طبیعی." },
      { title: "اسکلت قاب‌بندی‌شده", description: "اسکلت چوب سخت با بلوک‌های گوشه و چسب صنعتی، لقی و صدا را حذف می‌کند." },
    ],
    technical: [
      {
        title: "ساختار اسکلت و فنربندی",
        body: "اسکلت از چوب سخت خشک‌شده ساخته می‌شود و در نقاط بحرانی با بلوک گوشه و پیچ تقویت می‌گردد. سیستم فنربندی از کش‌های الاستیک پهن استفاده می‌کند که توزیع وزن یکنواخت و دوام بالا را تضمین می‌کند.",
        image: "/images/aknoon-07.jpg",
      },
      {
        title: "لایه‌بندی نشیمن و پشتی",
        body: "نشیمن از فوم سرد دانسیته بالا با روکش الیاف، و پشتی از ترکیب فوم نرم و پر سیلیکونی ساخته شده تا هم نشستی محکم و هم تکیه‌گاهی نرم فراهم شود.",
        image: "/images/aknoon-05.jpg",
      },
      {
        title: "انتخاب و نگهداری رویه",
        body: "پارچه‌های ضدلک با تست سایش بالا و چرم طبیعی درجه‌یک ارائه می‌شوند. تمیزکاری منظم با جاروبرقی و دستمال خشک، عمر رویه را به‌طور چشمگیری افزایش می‌دهد.",
      },
    ],
    warranty: "۳ سال گارانتی اسکلت و فنربندی",
    leadTime: "۴ تا ۶ هفته‌ی کاری",
    reviews: [
      { author: "مهدی توکلی", rating: 5, date: "۱۴۰۳/۰۹/۲۸", location: "تهران", body: "راحتی نشیمن فوق‌العاده است و پارچه‌ی ضدلک واقعاً کار می‌کند. بهترین خریدمان برای پذیرایی." },
      { author: "لیلا اسدی", rating: 4, date: "۱۴۰۳/۰۷/۰۵", location: "شیراز", body: "طراحی شیک و ساخت تمیزی دارد. پیشنهاد می‌کنم رنگ رویه را حتماً حضوری انتخاب کنید." },
      { author: "بابک نوری", rating: 5, date: "۱۴۰۳/۰۵/۲۲", location: "مشهد", body: "اسکلت کاملاً بی‌صدا و محکم است. بعد از چند ماه استفاده روزانه هیچ افتادگی در فوم نداشتیم." },
    ],
    faq: [
      { q: "امکان انتخاب پارچه‌ی دلخواه هست؟", a: "بله، می‌توانید از میان مجموعه‌ی پارچه‌ها و چرم‌های موجود، یا با ارائه‌ی نمونه‌ی مورد نظر خود سفارش دهید." },
      { q: "مبل به‌صورت ال یا تعداد نفرات مختلف هم ساخته می‌شود؟", a: "بله، الدر در پیکربندی دونفره، سه‌نفره و ال‌شکل قابل سفارش است." },
      { q: "آیا رویه قابل شست‌وشو است؟", a: "روکش‌های ضدلک با دستمال مرطوب و شوینده‌ی ملایم تمیز می‌شوند؛ برای لک‌های عمیق خشک‌شویی توصیه می‌شود." },
    ],
  },
  {
    slug: "celtis-buffet",
    name: "بوفه سِلتیس",
    series: "Celtis",
    category: "دکوراتیو",
    room: "decor",
    shortDescription: "بوفه و ویترین با جزئیات فلزی و شیشه‌ی شفاف.",
    longDescription:
      "بوفه سلتیس فضای ذخیره‌سازی را با نمایش ترکیب می‌کند؛ بدنه‌ی چوبی با درب‌های شیشه‌ای، قفسه‌بندی منعطف و یراق‌آلات ظریف برای فضای پذیرایی.",
    image: "/images/aknoon-23.jpg",
    gallery: ["/images/aknoon-23.jpg", "/images/aknoon-24.jpg", "/images/aknoon-27.jpg", "/images/aknoon-33.jpg"],
    shopUrl: "https://choobohonar.com/shop/",
    finishes: ["walnut", "mahogany", "hazelnut"],
    dimensions: { width: 160, depth: 45, height: 190 },
    specs: [
      { label: "بدنه", value: "ام‌دی‌اف با روکش چوب" },
      { label: "درب", value: "شیشه سکوریت + قاب چوبی" },
      { label: "یراق", value: "آبکاری ضدخش" },
    ],
    highlights: [
      { title: "شیشه‌ی سکوریت ایمن", description: "درب‌ها از شیشه‌ی سکوریت شفاف ساخته شده‌اند که در برابر ضربه مقاوم و ایمن است." },
      { title: "قفسه‌بندی منعطف", description: "ارتفاع طبقات قابل تنظیم است تا فضای نمایش با سلیقه‌ی شما هماهنگ شود." },
      { title: "یراق‌آلات بی‌صدا", description: "لولاهای آرام‌بند و ریل‌های مرغوب، باز و بسته شدن نرم درب‌ها را تضمین می‌کنند." },
    ],
    technical: [
      {
        title: "بدنه و روکش‌گیری",
        body: "بدنه از ام‌دی‌اف ضدرطوبت با روکش طبیعی گردو ساخته می‌شود. درزها به‌صورت نامرئی پرداخت شده و کف داخلی با لایه‌ی مقاوم در برابر خش پوشانده می‌شود.",
        image: "/images/aknoon-24.jpg",
      },
      {
        title: "نورپردازی و نمایش",
        body: "امکان نصب نوار ال‌ای‌دی گرم داخل ویترین وجود دارد تا اشیای دکوراتیو با نوری ملایم برجسته شوند. کلید لمسی روی بدنه تعبیه می‌شود.",
        image: "/images/aknoon-27.jpg",
      },
      {
        title: "یراق‌آلات و نگهداری",
        body: "لولاها و ریل‌ها از برندهای معتبر با آبکاری ضدخش انتخاب می‌شوند. شیشه‌ها را با دستمال نرم و تمیزکننده‌ی بدون آمونیاک پاک کنید.",
      },
    ],
    warranty: "۵ سال گارانتی بدنه و یراق‌آلات",
    leadTime: "۳ تا ۴ هفته‌ی کاری",
    reviews: [
      { author: "رؤیا شریفی", rating: 5, date: "۱۴۰۳/۱۱/۱۰", location: "تهران", body: "نورپردازی داخل ویترین فضای پذیرایی را کاملاً عوض کرد. ساخت بسیار تمیز و باکیفیتی دارد." },
      { author: "کامران احمدی", rating: 4, date: "۱۴۰۳/۰۸/۰۳", location: "تبریز", body: "درب‌های شیشه‌ای آرام‌بند عالی هستند. کاش گزینه‌های رنگی بیشتری برای بدنه وجود داشت." },
      { author: "مینا فلاح", rating: 5, date: "۱۴۰۳/۰۶/۲۵", location: "رشت", body: "قفسه‌های قابل تنظیم خیلی کاربردی‌اند و یراق‌آلات کاملاً بی‌صدا کار می‌کنند." },
    ],
    faq: [
      { q: "نورپردازی داخلی جزو محصول است؟", a: "نورپردازی ال‌ای‌دی به‌صورت آپشن قابل افزودن است و در زمان سفارش انتخاب می‌شود." },
      { q: "آیا تعداد و ارتفاع طبقات قابل تغییر است؟", a: "بله، طبقات روی ریل قابل جابه‌جایی هستند و در زمان ساخت نیز می‌توان چیدمان دلخواه را اعمال کرد." },
      { q: "شیشه‌ها در برابر شکستن ایمن هستند؟", a: "بله، از شیشه‌ی سکوریت استفاده می‌شود که مقاومت بالایی دارد و در صورت شکست به قطعات بی‌خطر تبدیل می‌شود." },
    ],
  },
  {
    slug: "meranti-table",
    name: "میز ناهارخوری مِرانتی",
    series: "Meranti",
    category: "میز غذاخوری",
    room: "dining",
    shortDescription: "میز ناهارخوری شش‌نفره با صفحه‌ی یکپارچه‌ی چوبی.",
    longDescription:
      "میز مرانتی با صفحه‌ی پهن و پایه‌های تراش‌خورده، نقطه‌ی کانونی فضای غذاخوری است؛ سطحی مقاوم با پرداخت مات که گرمای چوب را حفظ می‌کند.",
    image: "/images/aknoon-31.jpg",
    gallery: ["/images/aknoon-31.jpg", "/images/aknoon-32.jpg", "/images/aknoon-29.jpg", "/images/aknoon-36.jpg"],
    shopUrl: "https://choobohonar.com/shop/",
    finishes: ["natural", "walnut", "beige"],
    dimensions: { width: 180, depth: 90, height: 75 },
    specs: [
      { label: "صفحه", value: "روکش چوب روی هسته‌ی مهندسی‌شده" },
      { label: "پایه", value: "چوب ماسیو تراش‌خورده" },
      { label: "پرداخت", value: "پلی‌اورتان مات مقاوم" },
    ],
    highlights: [
      { title: "صفحه‌ی مقاوم به حرارت", description: "پرداخت پلی‌اورتان مات در برابر گرما، رطوبت و لک روزمره‌ی میز غذا مقاوم است." },
      { title: "پایه‌های ماسیو", description: "پایه‌ها از چوب ماسیو تراش‌خورده ساخته شده‌اند و تعادل میز را روی هر کف تضمین می‌کنند." },
      { title: "قابلیت توسعه", description: "امکان افزودن قطعه‌ی میانی برای میزبانی از تعداد بیشتر مهمان." },
    ],
    technical: [
      {
        title: "صفحه و لبه‌کاری",
        body: "صفحه از هسته‌ی مهندسی‌شده با روکش طبیعی ساخته می‌شود تا از تابیدگی در عرض‌های زیاد جلوگیری شود. لبه‌ها با شعاع ملایم پرداخت می‌شوند تا لمس و تمیزکاری راحت‌تر باشد.",
        image: "/images/aknoon-32.jpg",
      },
      {
        title: "سازه‌ی پایه و اتصال",
        body: "پایه‌ها با اتصالات فلزی پنهان و چوب ماسیو به کلاف زیرین متصل می‌شوند؛ این روش هم استحکام را بالا می‌برد و هم امکان جمع‌کردن میز برای جابه‌جایی را فراهم می‌کند.",
        image: "/images/aknoon-29.jpg",
      },
      {
        title: "پرداخت و نگهداری روزانه",
        body: "سطح با پوشش مات مقاوم اجرا می‌شود. برای نگهداری، از زیرلیوانی استفاده کنید و سطح را با دستمال نرم مرطوب تمیز کنید؛ از قراردادن مستقیم ظروف داغ روی صفحه بپرهیزید.",
      },
    ],
    warranty: "۵ سال گارانتی صفحه و سازه",
    leadTime: "۴ تا ۵ هفته‌ی کاری",
    reviews: [
      { author: "آرش مرادی", rating: 5, date: "۱۴۰۳/۱۰/۱۸", location: "تهران", body: "صفحه‌ی میز واقعاً مقاوم است و رگه‌ی چوب فوق‌العاده زیباست. برای جمع‌های خانوادگی عالی است." },
      { author: "پریسا یوسفی", rating: 4, date: "۱۴۰۳/۰۹/۰۹", location: "قم", body: "کیفیت ساخت بالاست. قطعه‌ی توسعه را هم سفارش دادیم که خیلی کاربردی است." },
      { author: "حسین داوری", rating: 5, date: "۱۴۰۳/۰۷/۱۴", location: "اهواز", body: "پایه‌ها کاملاً محکم‌اند و میز هیچ لرزشی ندارد. پرداخت مات هم اثر انگشت نمی‌گیرد." },
    ],
    faq: [
      { q: "میز برای چند نفر مناسب است؟", a: "مدل استاندارد برای شش نفر طراحی شده و با قطعه‌ی توسعه تا هشت نفر قابل افزایش است." },
      { q: "صندلی همراه میز ارائه می‌شود؟", a: "میز و صندلی به‌صورت جداگانه عرضه می‌شوند؛ کارشناسان ما ست هماهنگ پیشنهاد می‌دهند." },
      { q: "آیا صفحه در برابر حرارت ظروف مقاوم است؟", a: "پرداخت در برابر گرمای معمول مقاوم است، اما برای ظروف بسیار داغ استفاده از زیرلیوانی توصیه می‌شود." },
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFinish(id: string): Finish | undefined {
  return finishes.find((finish) => finish.id === id);
}

export function getProductsByFinish(id: string): Product[] {
  return products.filter((product) => product.finishes.includes(id));
}

export function getRelatedProducts(slug: string, count = 3): Product[] {
  const current = products.find((p) => p.slug === slug);
  if (!current) return products.slice(0, count);
  const sameCategory = products.filter((p) => p.slug !== slug && p.category === current.category);
  const others = products.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}

// ─── Shop catalog (synced from choobohonar.com) ─────────────────────────────

export type ShopProduct = {
  kind: "catalog";
  slug: string;
  name: string;
  category: string;
  room: ProductRoom;
  shortDescription: string;
  image: string;
  shopUrl: string;
};

export type AnyProduct = Product | ShopProduct;

export const shopProducts: ShopProduct[] = shopCatalogRaw.map((entry) => ({
  ...entry,
  room: entry.room as ProductRoom,
  kind: "catalog" as const,
}));

/** Featured showcase products with rich editorial content. */
export const featuredProducts = products;

export function isShopProduct(product: AnyProduct): product is ShopProduct {
  return "kind" in product && product.kind === "catalog";
}

export function isFeaturedProduct(product: AnyProduct): product is Product {
  return !isShopProduct(product);
}

export function getAllCatalogProducts(): AnyProduct[] {
  return [...products, ...shopProducts];
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function getCatalogProduct(slug: string): AnyProduct | undefined {
  const normalized = normalizeSlug(slug);
  return getProduct(normalized) ?? shopProducts.find((p) => p.slug === normalized);
}

export function getRelatedCatalogProducts(slug: string, count = 3): AnyProduct[] {
  const current = getCatalogProduct(slug);
  if (!current) return getAllCatalogProducts().slice(0, count);
  const sameRoom = getAllCatalogProducts().filter((p) => p.slug !== slug && p.room === current.room);
  return sameRoom.slice(0, count);
}
