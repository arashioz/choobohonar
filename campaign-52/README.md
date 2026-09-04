# لندینگ کمپین ۵۲ — خانه چوب و هنر

اپ مستقل برای کمپین «خانه چوب و هنر، ۵۲ساله شد». به مونوریپوی اصلی وابسته نیست و می‌تواند جداگانه ارسال و دپلوی شود.

- شعار: خانه چوب و هنر، ۵۲ساله شد
- تعریف: ساختن خانه‌هایی با روح
- بازه: ۱۷ شهریور تا ۵ مهر ۱۴۰۵
- دامنه: `https://52.choobohonar.com`

## اجرای محلی

Node.js 20+

```bash
cd campaign-52
cp .env.example .env
npm install
npm run dev
```

لندینگ: [http://localhost:3004](http://localhost:3004)

## است‌های رسانه

عکس، ویدیو و فونت Peyda داخل گیت نیستند. فایل `campaign-52-assets.zip` را کنار پوشهٔ پروژه بگذارید و قبل از `npm run dev` یا Docker باز کنید:

```bash
cd campaign-52
unzip -o ../campaign-52-assets.zip -d public
```

داخل زیپ سه پوشه است: `images/`، `videos/`، `fonts/`.

## دپلوی با Docker

DNS ساب‌دامین `52` را به IP سرور بدهید. فقط پورت ۸۰ (و در صورت HTTPS، ۴۴۳) را باز کنید.

```bash
cd campaign-52
cp .env.example .env
unzip -o ../campaign-52-assets.zip -d public
# در صورت اتصال به API اصلی چوب و هنر:
# LEADS_API_URL=https://choobohonar.com/api/lead
docker compose up -d --build
```

سایت: `http://SERVER_IP/` یا پس از DNS: `https://52.choobohonar.com`

لیدها در `data/leads.jsonl` ذخیره می‌شوند. این پوشه با volume ماندگار است.

به‌روزرسانی بعدی:

```bash
git pull --ff-only
docker compose up -d --build --force-recreate
```

برای HTTPS، گواهی را جلوی Nginx بگذارید یا از Cloudflare / Caddy به‌عنوان reverse proxy استفاده کنید.

## لینک‌های کانال (UTM)

همه روی ساب‌دامین کمپین هستند. فرم عضویت `utm_source` / `utm_medium` / `utm_campaign` / کانال را نگه می‌دارد.

| کانال | لینک کوتاه (برای انتشار) |
| --- | --- |
| پیامک | https://52.choobohonar.com/ |
| تلگرام | https://52.choobohonar.com/telegram |
| اینستاگرام | https://52.choobohonar.com/instagram |
| لینکدین | https://52.choobohonar.com/linkedin |
| یکتانت | https://52.choobohonar.com/yektanet |
| آپارات | https://52.choobohonar.com/aparat |

پیامک همان ریشهٔ ساب‌دامین است و بدون پارامتر در لید با کانال `sms` ثبت می‌شود. مسیرهای کوتاه بقیهٔ کانال‌ها به همان صفحه با UTM ریدایرکت می‌شوند.

## فرمول اعتبار

`واحد = floor(مبلغ خرید میلیون تومان / ۲۰۰)`  
`اعتبار = واحد × نرخ سطح`

| سطح | نرخ هر واحد ۲۰۰ میلیونی |
| --- | ---: |
| VIP | ۲۵ میلیون |
| Gold | ۲۰ میلیون |
| Silver | ۱۵ میلیون |
| غیرعضو | ۱۰ میلیون |

باقیماندهٔ کمتر از ۲۰۰ میلیون صفر است. اعتبار فقط برای اکسسوری، کالای خواب و تشک قابل استفاده است.

## ساختار

همان الگوی استورفرانت چوب و هنر: Next.js App Router، Peyda، توکن‌های `forest / paper / peach / brick`، GSAP + Lenis، RTL.

```
src/app            روت‌ها، middleware کانال، API لید
src/components     layout / motion / campaign
src/data           کمپین، کانال‌ها، سطوح باشگاه
src/lib            اعتبار، UTM، فونت، GSAP
public/brand       SVGهای رسمی برند
public/fonts       Peyda
public/images      تصاویر واقعی فروشگاه و پروژه‌ها
public/videos      ویدیوی برند
deploy/nginx       پروکسی ساب‌دامین
```
