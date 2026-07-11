# خانه چوب و هنر — لندینگ (نسخه behzad-02)

لندینگ ادیتوریال و RTL-first برای خانه چوب و هنر، با الهام از Studio Dado.
ساخته‌شده با Next.js 14 (App Router) + TypeScript + Tailwind CSS + GSAP/ScrollTrigger + Lenis.

## اجرا

```bash
# توسعه (به‌خاطر تعداد فایل‌های زیاد در پوشه والد، سقف فایل باز را بالا ببرید)
ulimit -n 10240 && npm run dev

# بیلد و اجرای پروداکشن
npm run build && npm start
```

سپس مرورگر را روی http://localhost:3000 باز کنید.

## ساختار

- `src/app/` — layout (RTL، فونت‌ها، متادیتا) و page (چینش بخش‌ها)
- `src/components/layout/` — Header (نav اورلی)، Footer، Container
- `src/components/motion/` — SmoothScroll (Lenis)، FadeUp، Stagger، Parallax
- `src/components/sections/` — Hero، Diversity، Approach (pinned)، FeaturedProjects، WorkAreas، Products، Consultation
- `src/data/` — nav، projects، workAreas، products
- `src/lib/` — utils، fonts، gsap
- `public/` — fonts/peyda، brand (SVG لوگوها)، images (۴۰ عکس بهینه‌شده‌ی آکنون)

## بخش‌ها (ترتیب اسکرول)

1. Hero — مدیا تمام‌صفحه + لودر اینترو + ریویل هدلاین (آماده‌ی جایگزینی با ویدئو)
2. Diversity — بیانیه‌ی بزرگ + سه عکس پراکنده با پارالاکس
3. Approach — pin شده با scrub، سه مرحله روی‌هم
4. Featured Projects — عنوان درشت + کارهای بزرگ
5. Work Areas — شش دسته، تعویض پس‌زمینه با هاور
6. Products — کارت‌های سبک Lusano + پنل جزئیات و انتخاب پرداخت
7. Consultation — فرم مشاوره با اعتبارسنجی و حالت موفقیت

تمام انیمیشن‌ها به `prefers-reduced-motion` احترام می‌گذارند.

## نکات مهم

- **فونت لاتین:** فعلاً Cormorant Garamond (گوگل‌فونت) به‌عنوان جایگزین Michty استفاده شده؛
  هنگام تهیه‌ی فایل Michty در `src/lib/fonts.ts` سواپ کنید.
- **ویدئوی هیرو:** نقطه‌ی سواپ `<video>` در `HeroSection.tsx` آماده است؛ فعلاً عکس placeholder.
- **محصولات:** دیتای نمونه‌ی استاتیک در `src/data/products.ts` (فیلترها طبق برنامه به v1 اضافه نشده).
- **انکودینگ:** فایل‌های دارای متن فارسی باید UTF-8 باشند. برخی ابزارهای ویرایش در این محیط
  متن غیر-ASCII را خراب می‌کنند؛ در صورت دیدن کاراکتر «?» به‌جای فارسی، فایل را دوباره با UTF-8 بنویسید.

## خارج از محدوده‌ی v1

بک‌اند/CMS/پایپ‌لاین AI، فیلتر محصولات، روت‌های چندصفحه‌ای، متن نهایی EN، عکاسی واقعی محصولات.
