# نقشه‌ی داده و مهاجرت به CMS

## منابع محلی فعلی

| منبع | مصرف فعلی | مقصد دیتابیس | وضعیت |
| --- | --- | --- | --- |
| `frontend/src/data/shop-catalog.json` | کاتالوگ محصولات و تصاویر | `shop_products` | seed خودکار + دکمه «سینک کاتالوگ» |
| `frontend/src/data/posts/articles/editorial-series.ts` | ۲۰ مقاله‌ی مجله و تصاویر جلد | `cms_entries` با `kind=article` | seed خودکار و idempotent |
| `frontend/src/data/content-seed.json` | نمونه jobهای هوش مصنوعی | `content_jobs` | داده‌ی آزمایشی؛ برای تولید واقعی باید با provider جایگزین شود |
| `frontend/src/data/projects.ts` | پروژه‌ها و روایت تصویری | `cms_entries` با `kind=project` | seed شده؛ صفحه فهرست از CMS می‌خواند |
| `frontend/src/data/materials.ts` و `material-products.ts` | متریال و اطلاعات فروش | `cms_entries` با `kind=material` | seed شده؛ صفحه فهرست از CMS می‌خواند |
| `frontend/src/data/collections.ts` | کالکشن‌ها | `cms_entries` با `kind=collection` | seed شده؛ صفحه فهرست از CMS می‌خواند |
| `frontend/src/data/stores.ts` | شعب و آدرس‌ها | `cms_entries` با `kind=page`, slug=`stores` | seed شده؛ صفحه فروشگاه‌ها از CMS می‌خواند |
| `frontend/src/data/gallery.ts` | آرشیو تصاویر گالری | `cms_entries` با `kind=page`, slug=`gallery` | seed شده؛ صفحه گالری از CMS می‌خواند |
| `frontend/src/data/workAreas.ts` | حوزه‌های کاری صفحه اصلی | `cms_entries` با `kind=page`, slug=`work-areas` | seed شده؛ بخش صفحه اصلی از CMS می‌خواند |
| `frontend/src/data/nav.ts`, `interior-architecture.ts`, `contact-forms.ts` | ناوبری و محتوای فرم‌ها/خدمات | تنظیمات/صفحات CMS | مرحله‌ی بعدی |

## اجرای مهاجرت روی سرور

بعد از دریافت این نسخه، backend را rebuild/restart کنید:

```bash
docker compose up -d --build backend frontend admin nginx
```

در startup، اگر محصولی وجود نداشته باشد کاتالوگ کامل seed می‌شود و ۲۰ مقاله‌ی استاتیک نیز فقط در صورت نبودن همان slug به CMS اضافه می‌شوند. برای همگام‌سازی دوباره‌ی کاتالوگ از پنل ادمین، در «فروشگاه / مدیریت آثار» روی «سینک کاتالوگ» بزنید؛ محصولات ساخته‌شده در ادمین با `source=admin` بازنویسی نمی‌شوند.

فرانت اصلی برای فروشگاه و مجله، داده‌ی منتشرشده‌ی backend را منبع اصلی می‌گیرد. داده‌های ثابت باقی‌مانده در جدول بالا هنوز برای صفحات برند/پروژه/متریال استفاده می‌شوند و در مرحله‌ی بعد باید به schemaهای CMS متناظر منتقل شوند.
