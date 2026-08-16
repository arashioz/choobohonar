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
    address: "مقدس اردبیلی، نبش شادآور، پلاک ۱۵",
    hours: "شنبه تا پنج‌شنبه، ۱۰ تا ۲۰",
  },
  {
    id: "tehran-bazaar-1",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۱",
    address: "یافت‌آباد شرقی، بازار مبل ایران ۱، طبقه اول، ۳۰۵",
  },
  {
    id: "tehran-bazaar-3",
    kind: "branch",
    city: "تهران",
    name: "شعبه بازار مبل ۳",
    address: "یافت‌آباد شرقی، بازار مبل ایران ۳، طبقه سوم، ۳۰۱",
  },
  {
    id: "shiraz",
    kind: "agency",
    city: "شیراز",
    name: "نمایندگی شیراز",
    address: "بزرگراه دوکوهک گویم، بین زیتون ۴ و ۵",
    phone: "09390602058",
  },
  {
    id: "bandar-abbas",
    kind: "agency",
    city: "بندرعباس",
    name: "نمایندگی بندرعباس",
    address: "بلوار چمران، نبش چمران ۴۲",
  },
  {
    id: "tabriz",
    kind: "agency",
    city: "تبریز",
    name: "نمایندگی تبریز — پرسان هوم",
  },
];

export const storesHero = {
  eyebrow: "شعب و نمایندگی‌ها",
  title: "فروشگاه‌ها",
  body: "شوروم‌های تهران و نمایندگی‌های شهرهای دیگر؛ برای دیدن محصول از نزدیک یا گفت‌وگو با تیم فروش.",
  image: "/images/projects/aknoon-residence/11.jpg",
};
