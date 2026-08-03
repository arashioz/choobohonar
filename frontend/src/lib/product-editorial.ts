import type { ProductRoom, ShopProduct } from "@/data/products";
import { getRoomLabel } from "@/data/product-categories";
import { getCollectionName } from "@/lib/commerce";

type RoomEditorial = {
  context: string;
  selection: string;
  care: string;
};

const roomEditorial: Record<ProductRoom, RoomEditorial> = {
  living: {
    context: "در چیدمان نشیمن، مقیاس قطعه باید با مسیر رفت‌وآمد، فاصله از میز و زاویه دید فضای اصلی هماهنگ باشد.",
    selection: "پیش از انتخاب، ابعاد دیوار، فاصله تا میز جلو مبلی و نحوه استفاده روزانه از فضا را اندازه‌گیری کنید.",
    care: "گردگیری منظم، دوری از نور مستقیم و رسیدگی سریع به لکه‌ها به حفظ رنگ و کیفیت سطح کمک می‌کند.",
  },
  bedroom: {
    context: "در اتاق خواب، آرامش بصری، دسترسی پیرامون تخت و تناسب قطعه با کمد و پنجره اهمیت ویژه دارد.",
    selection: "عرض مسیر حرکت، محل بازشدن درها و اندازه واقعی تشک یا فضای ذخیره‌سازی را پیش از سفارش ثبت کنید.",
    care: "تهویه مناسب اتاق و پرهیز از تماس طولانی رطوبت با چوب و پارچه، عمر محصول را افزایش می‌دهد.",
  },
  bedding: {
    context: "کالای خواب مستقیماً با کیفیت استراحت، تنظیم دما و حس تماس روزانه ارتباط دارد.",
    selection: "ابعاد تشک، فصل استفاده، حساسیت پوستی و شیوه شست‌وشوی مورد انتظار را در انتخاب خود در نظر بگیرید.",
    care: "دستور شست‌وشوی محصول را رعایت کنید و پیش از جمع‌کردن، از خشک‌شدن کامل الیاف مطمئن شوید.",
  },
  dining: {
    context: "در فضای غذاخوری، ابعاد قطعه باید هم‌زمان با تعداد نفرات و فضای لازم برای عقب‌کشیدن صندلی سنجیده شود.",
    selection: "برای هر ضلع میز، مسیر رفت‌وآمد و حداقل فضای آزاد پشت صندلی‌ها را پیش از سفارش بررسی کنید.",
    care: "استفاده از زیرلیوانی و پاک‌کردن سریع رطوبت، سطح میز و پرداخت متریال را در استفاده روزمره حفظ می‌کند.",
  },
  decor: {
    context: "اشیای دکوراتیو با مقیاس، بافت و بازتاب نور می‌توانند ریتم یک فضا را کامل کنند یا نقطه کانونی بسازند.",
    selection: "محل قرارگیری، نور محیط و نسبت محصول با اشیای اطراف را پیش از انتخاب نهایی بررسی کنید.",
    care: "برای تمیزکاری از دستمال نرم استفاده کنید و محصول را از ضربه، مواد ساینده و رطوبت مداوم دور نگه دارید.",
  },
  carpet: {
    context: "فرش مرز بصری چیدمان را مشخص می‌کند و بر گرما، آکوستیک و یکپارچگی رنگ‌های فضا اثر می‌گذارد.",
    selection: "ابعاد گروه مبلمان، میزان رفت‌وآمد و رنگ کف را برای انتخاب اندازه و بافت مناسب در نظر بگیرید.",
    care: "چرخاندن دوره‌ای فرش و جاروکشی با توان مناسب، سایش را یکنواخت و بافت را سالم نگه می‌دارد.",
  },
  lighting: {
    context: "روشنایی فقط یک شیء نیست؛ ارتفاع منبع نور و جهت تابش آن بر سایه، تمرکز و حال‌وهوای فضا اثر دارد.",
    selection: "ارتفاع نصب، نوع فعالیت، رنگ نور و فاصله محصول تا سطح کار یا نشیمن را پیش از خرید مشخص کنید.",
    care: "پیش از نظافت برق را قطع کنید و برای بدنه و شید از دستمال خشک یا اندکی مرطوب استفاده کنید.",
  },
  dishes: {
    context: "ظروف پذیرایی میان کاربرد روزانه و ترکیب بصری میز ارتباط برقرار می‌کنند.",
    selection: "تعداد نفرات، شیوه سرو و امکان شست‌وشو در ماشین ظرف‌شویی را متناسب با استفاده خود بررسی کنید.",
    care: "برای جلوگیری از خط‌وخش، ظروف را با فاصله مناسب نگهداری و مطابق دستور متریال شست‌وشو کنید.",
  },
};

export type ProductEditorialContent = {
  seoDescription: string;
  intro: string;
  sections: { title: string; body: string }[];
  facts: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
};

export function getProductEditorialContent(product: ShopProduct): ProductEditorialContent {
  const room = getRoomLabel(product.room);
  const copy = roomEditorial[product.room];
  const collection = getCollectionName(product);
  const visibleAttributes = product.attributes
    .filter((attribute) => attribute.terms.length)
    .slice(0, 4);
  const optionNames = visibleAttributes.map((attribute) => attribute.name).join("، ");
  const optionValues = visibleAttributes
    .flatMap((attribute) => attribute.terms.slice(0, 3).map((term) => term.name))
    .join("، ");
  const availability = product.isInStock ? "آماده سفارش" : "قابل سفارش برای تولید";
  const customization = optionNames
    ? `گزینه‌های ثبت‌شده برای این محصول شامل ${optionNames} است. انتخاب نهایی هر گزینه باید با کاربرد، نور و پالت متریال فضای شما هماهنگ شود.`
    : "جزئیات نهایی رنگ، متریال و شیوه تولید در زمان ثبت سفارش با کارشناس محصول بررسی می‌شود.";

  return {
    seoDescription: `${product.name} در دسته ${product.category} از خانه چوب و هنر؛ مشاهده قیمت، تصاویر، ویژگی‌ها، گزینه‌های سفارش و راهنمای انتخاب برای فضای ${room}.`,
    intro: `${product.name} یکی از انتخاب‌های مجموعه ${product.category} خانه چوب و هنر برای فضای ${room} است. در این صفحه می‌توانید تصاویر، قیمت، وضعیت موجودی و گزینه‌های قابل سفارش را کنار راهنمای انتخاب و نگهداری بررسی کنید.`,
    sections: [
      {
        title: `${product.name} در فضای واقعی`,
        body: `${copy.context} ${product.name} را با توجه به ابعاد واقعی فضا، محصولات مجاور و الگوی استفاده روزانه ارزیابی کنید؛ این بررسی پیش از سفارش، انتخابی دقیق‌تر و ماندگارتر می‌سازد.`,
      },
      {
        title: "انتخاب متریال و جزئیات سفارش",
        body: `${customization}${optionValues ? ` نمونه گزینه‌های فعلی: ${optionValues}.` : ""}`,
      },
      {
        title: "پیش از خرید و نگهداری",
        body: `${copy.selection} ${copy.care} برای محصولات سفارشی، زمان ساخت و شرایط ارسال پس از تأیید انتخاب‌ها و نشانی تحویل نهایی می‌شود.`,
      },
    ],
    facts: [
      { label: "نام محصول", value: product.name },
      { label: "دسته‌بندی", value: product.category },
      { label: "فضای پیشنهادی", value: room },
      ...(collection ? [{ label: "کالکشن", value: collection }] : []),
      { label: "وضعیت سفارش", value: availability },
      { label: "شناسه محصول", value: String(product.id) },
    ],
    faqs: [
      {
        question: `پیش از سفارش ${product.name} چه مواردی را بررسی کنیم؟`,
        answer: `${copy.selection} سپس گزینه‌های محصول، مسیر حمل و نشانی تحویل را در مرحله تکمیل خرید کنترل کنید.`,
      },
      {
        question: `آیا ${product.name} امکان انتخاب ویژگی یا متریال دارد؟`,
        answer: product.hasOptions || visibleAttributes.length
          ? `بله. گزینه‌های موجود در همین صفحه نمایش داده می‌شوند${optionNames ? ` و می‌توانند شامل ${optionNames} باشند` : ""}. انتخاب ثبت‌شده داخل سبد خرید حفظ می‌شود.`
          : "این محصول با مشخصات فعلی ارائه شده است؛ برای سفارشی‌سازی احتمالی می‌توانید پیش از ثبت سفارش با کارشناس فروش گفتگو کنید.",
      },
      {
        question: "زمان و هزینه ارسال چگونه مشخص می‌شود؟",
        answer: "پس از ثبت نشانی، نوع محصول و شرایط دسترسی محل بررسی می‌شود. هزینه ارسال تخصصی و بازه تحویل پیش از پرداخت نهایی به شما اعلام خواهد شد.",
      },
      {
        question: `روش نگهداری ${product.name} چیست؟`,
        answer: copy.care,
      },
    ],
  };
}
