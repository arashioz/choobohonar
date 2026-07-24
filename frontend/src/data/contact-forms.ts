export type ContactFormId = "cooperation" | "representation" | "consultation";

export type ContactFormMeta = {
  id: ContactFormId;
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  steps?: number;
  duration: string;
  audience: string;
};

export const contactForms: ContactFormMeta[] = [
  {
    id: "cooperation",
    title: "درخواست همکاری",
    eyebrow: "فرصت شغلی",
    description:
      "اگر مایل به پیوستن به تیم خانه چوب و هنر هستید، رزومه و اطلاعات خود را در فرم چندمرحله‌ای ثبت کنید.",
    href: "/contact/cooperation",
    steps: 5,
    duration: "۱۰–۱۵ دقیقه",
    audience: "متقاضیان استخدام و همکاری",
  },
  {
    id: "representation",
    title: "درخواست نمایندگی",
    eyebrow: "فروش و توزیع",
    description:
      "برای اخذ نمایندگی فروش محصولات خانه چوب و هنر، مشخصات فضا و اطلاعات تماس خود را ارسال کنید.",
    href: "/contact/representation",
    duration: "۵ دقیقه",
    audience: "فروشگاه‌ها و نمایندگان فروش",
  },
  {
    id: "consultation",
    title: "درخواست مشاوره",
    eyebrow: "راهنمایی تخصصی",
    description:
      "برای مشاوره چیدمان، انتخاب محصول، بازدید شوروم یا معماری داخلی، درخواست خود را ثبت کنید.",
    href: "/contact/consultation",
    duration: "۳ دقیقه",
    audience: "مشتریان و علاقه‌مندان به طراحی",
  },
];

export const iranProvinces = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "چهارمحال و بختیاری",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "یزد",
];

export const cooperationSteps = [
  { id: "personal", label: "اطلاعات فردی" },
  { id: "education", label: "تحصیلات" },
  { id: "training", label: "دوره‌های آموزشی" },
  { id: "skills", label: "مهارت‌ها" },
  { id: "terms", label: "شرایط همکاری" },
] as const;

export type CooperationStepId = (typeof cooperationSteps)[number]["id"];

export const skillLevels = ["خیلی ضعیف", "ضعیف", "متوسط", "خوب", "عالی"] as const;

export const cooperationTypes = ["تمام وقت", "پاره وقت", "ساعتی", "شیفتی"] as const;

export const consultationTypes = [
  "مشاوره چیدمان",
  "معماری داخلی",
  "انتخاب و خرید محصول",
  "بازدید شوروم",
  "استعلام قیمت",
] as const;

export const ownershipTypes = ["مالک", "استیجاری"] as const;

export const persianMonths = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

export const birthYears = Array.from({ length: 80 }, (_, i) => String(1404 - i));
