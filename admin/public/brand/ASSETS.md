# Brandbook static assets

این پوشه در **git** فقط شامل فایل‌های متنی (SVG) و این راهنما است.  
تصاویر raster، فایل‌های Illustrator و اسکن‌های guideline از طریق zip جداگانه تحویل می‌شوند.

## Backend / DevOps

1. فایل `brandbook-assets-v1.0.0.zip` را از تیم فرانت دریافت کنید (در git commit نمی‌شود).
2. محتوا را در `admin/public/` استخراج کنید:

   ```bash
   unzip brandbook-assets-v1.0.0.zip -d admin/public/
   ```

3. ساختار نهایی: `admin/public/brand/...` — همان مسیرهای `publicUrl` در `brandbook-assets-manifest.json`.
4. در production، Next.js این فایل‌ها را از `/brand/...` سرو می‌کند.

## Regenerate package (frontend)

```bash
node scripts/package-brand-assets.mjs
```

خروجی در root پروژه:

- `brandbook-assets-v1.0.0.zip` — تحویل به backend
- `brandbook-assets-manifest.json` — لیست آدرس‌ها + checksum

## Git policy

| نوع | در git |
|-----|--------|
| SVG (لوگو، monogram) | ✅ |
| PNG / WebP / JPG / AI | ❌ — فقط zip |
| BrandGuideline/ (PDF, DOCX, AI منبع) | ❌ — آرشیو جدا |
