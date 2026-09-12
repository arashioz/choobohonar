export type StoreKind = "branch" | "agency";

export type Store = {
  id: string;
  kind: StoreKind;
  city: string;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
};

export const storeKindLabel: Record<StoreKind, string> = {
  branch: "شعبه",
  agency: "نمایندگی",
};

/** Live showroom and agency list from choobohonar.com/location/ */
export const stores: Store[] = [
  {
    id: "tehran-velenjak",
    kind: "branch",
    city: "تهران",
    name: "شعبه ولنجک",
    address: "خیابان مقدس اردبیلی، نبش شادآور، پلاک ۱۵، طبقه همکف",
    hours: "شنبه تا پنجشنبه ۱۰ تا ۲۲ · جمعه ۱۱ تا ۲۲", phone: "021-26373468",
  },
  {
    id: "tehran-bazaar-1",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۱",
    address: "یافت‌آباد شرقی، بازار مبل ایران شماره ۱، طبقه اول، شماره ۳۰۵", hours: "شنبه تا پنجشنبه ۱۰ تا ۲۰ · جمعه ۱۰ تا ۲۰", phone: "021-66312565",
  },
  {
    id: "tehran-bazaar-3",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۳",
    address: "یافت‌آباد شرقی، بازار مبل ایران شماره ۳، طبقه سوم، واحد ۳۰۱", hours: "شنبه تا پنجشنبه ۱۰ تا ۲۰ · جمعه ۱۰ تا ۲۰", phone: "021-66193084",
  },
  {
    id: "shiraz",
    kind: "agency",
    city: "شیراز",
    name: "نمایندگی شیراز",
    address: "بزرگراه دوکوهک گویم، بین زیتون ۴ و ۵", hours: "شنبه تا پنجشنبه ۹:۳۰ تا ۲۱ · جمعه ۱۰ تا ۱۴", phone: "09390602058",
  },
  {
    id: "bandar-abbas",
    kind: "agency",
    city: "بندرعباس",
    name: "نمایندگی بندرعباس",
    address: "بلوار چمران، روبروی ساختمان دادگستری، نبش چمران ۴۲", hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۷ تا ۲۲", phone: "076-33343880",
  },
  {
    id: "tabriz",
    kind: "agency",
    city: "تبریز",
    name: "نمایندگی تبریز — پرسان هوم", address: "میدان بسیج، به‌طرف سه‌راهی اهر، جنب آجیلی و خشکبار تواضع", hours: "شنبه تا پنجشنبه ۱۱ تا ۲۱ · جمعه ۱۱ تا ۲۱", phone: "09140700622",
  },
  { id: "ahvaz", kind: "agency", city: "اهواز", name: "نمایندگی اهواز", address: "کیانپارس، مجتمع تجاری پارک سنتر، طبقه سوم", hours: "شنبه تا پنجشنبه ۱۰ تا ۱۳ و ۱۷ تا ۲۲ · جمعه ۱۸ تا ۲۲", phone: "061-33916118" },
  { id: "behshahr", kind: "agency", city: "بهشهر", name: "نمایندگی بهشهر — مبلمان ایده‌آل", address: "بعد از ایستگاه ساری، مبلمان ایده‌آل", hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۶:۳۰ تا ۲۱", phone: "011-34539000" },
  { id: "rasht", kind: "agency", city: "رشت", name: "نمایندگی رشت — شهرک مبل", address: "ضلع شرقی میدان فرهنگ، شهرک مبل", hours: "شنبه تا پنجشنبه ۸:۳۰ تا ۱۳:۳۰ و ۱۶:۳۰ تا ۲۱:۳۰", phone: "013-33324916" },
  { id: "rafsanjan", kind: "agency", city: "رفسنجان", name: "نمایندگی رفسنجان — مبلمان خیام", address: "بلوار امام رضا، نبش خیابان نیایش، مبلمان خیام", hours: "شنبه تا پنجشنبه ۹ تا ۱۳ و ۱۶:۳۰ تا ۲۱", phone: "034-34280840" },
  { id: "qazvin", kind: "agency", city: "قزوین", name: "نمایندگی قزوین — بازار مبل رجبی", address: "شهرک ولایت، پردیس ۴، بازار مبل رجبی", hours: "شنبه تا پنجشنبه ۹ تا ۲۲", phone: "028-32249364" },
  { id: "qom", kind: "agency", city: "قم", name: "نمایندگی قم — مبلمان رضوی", address: "بلوار امین، جنب کوی ۲۱، پلاک ۵۴۹، مبلمان رضوی", hours: "شنبه تا پنجشنبه ۹:۳۰ تا ۱۴ و ۱۷ تا ۲۲:۳۰", phone: "025-32935500" },
  { id: "kashan", kind: "agency", city: "کاشان", name: "نمایندگی کاشان — گالری ویچیتار", address: "خیابان امیرکبیر، سیلک ۱۶، گالری ویچیتار", hours: "شنبه تا پنجشنبه ۱۰:۳۰ تا ۱۳:۳۰ و ۱۷ تا ۲۲", phone: "031-55341940" },
  { id: "hamedan", kind: "agency", city: "همدان", name: "نمایندگی همدان — فروشگاه ساهی", address: "خیابان میرزاده عشقی، بالاتر از تقاطع هنرستان، مبلمان ساهی", hours: "شنبه تا پنجشنبه ۹ تا ۱۳:۳۰ و ۱۶:۳۰ تا ۲۱:۳۰", phone: "081-38274050" },
  { id: "yazd", kind: "agency", city: "یزد", name: "نمایندگی یزد — مبلمان کسری", address: "خیابان سلمان فارسی، مبلمان کسری", hours: "شنبه تا پنجشنبه ۹ تا ۱۳:۳۰ و ۱۷ تا ۲۲", phone: "035-36237520" },
  { id: "tehran-kamard", kind: "agency", city: "تهران", name: "نمایندگی جاجرود", address: "جاده آبعلی تهران، منطقه صنعتی کمرد، بعد از کوچه چمستان، پلاک ۷۷۱ و ۷۷۳", hours: "شنبه تا جمعه ۱۰ تا ۲۲" },
];

export const storesHero = {
  eyebrow: "شعب و نمایندگی‌ها",
  title: "فروشگاه‌ها",
  body: "شوروم‌های تهران و نمایندگی‌های شهرهای دیگر؛ برای دیدن محصول از نزدیک یا گفت‌وگو با تیم فروش.",
  image: "/images/projects/aknoon-residence/11.jpg",
};
