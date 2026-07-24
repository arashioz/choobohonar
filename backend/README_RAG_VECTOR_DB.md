# 🌲 ChooboHonar Vector Embedding & AI RAG Handover Specification

راهنمای کامل معماری دیتابیس امبدینگ، ساختار هوش مصنوعی و انتقال دیتابیس بردارها به تیم بک‌اند (Backend Handover Document).

---

## 📐 ۱. ساختار دیتابیس و Schema (MongoDB & Mongoose)

محتوای برندبوک و دانش خانه چوب و هنر در کالکشن `brand_embeddings` ذخیره می‌شود.

### Schema Definition (`brand_chunk.schema.ts`):
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum BrandCategory {
  FOUNDATION = 'FOUNDATION',
  STRATEGY = 'STRATEGY',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  EXPERIENCE = 'EXPERIENCE',
  COMMUNICATION = 'COMMUNICATION',
  VISUAL_IDENTITY = 'VISUAL_IDENTITY',
  CULTURE_FUTURE = 'CULTURE_FUTURE',
}

@Schema({ timestamps: true, collection: 'brand_embeddings' })
export class BrandChunk extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: BrandCategory })
  category: BrandCategory;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Number], required: true })
  embedding: number[]; // 384-dimensional vector (or 768 / 1536 depending on model)

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const BrandChunkSchema = SchemaFactory.createForClass(BrandChunk);
```

---

## ⚡ ۲. مدل لوکال امبدینگ (Local Embedding Model)

برای صفر کردن هزینه و اجرای لوکال در محیط توسعه، از مدل **`Xenova/all-MiniLM-L6-v2`** (مدل 384 بعدی سبُک و دقیق) یا سرویس لوکال درون کانتینری استفاده شده است.

### پیاده‌سازی سرویس امبدینگ لوکال (`LocalEmbeddingService`):
```typescript
import { pipeline } from '@xenova/transformers';

export class LocalEmbeddingService {
  async generateEmbedding(text: string): Promise<number[]> {
    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }
}
```

---

## 🔍 ۳. جستجوی برداری روی مونگو (MongoDB Vector Search Options)

تیم بک‌اند می‌تواند به دو روش جستجوی برداری روی MongoDB را به محیط تولید منتقل کند:

### روش اول: MongoDB Atlas Vector Search (پیشنهادی برای پروداکشن)
در پنل داکر یا کلود Atlas، یک Vector Index روی کالکشن ایجاد کنید:
```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```
کوئری نمونه در NestJS:
```typescript
await this.brandChunkModel.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "embedding",
      queryVector: queryVector,
      numCandidates: 50,
      limit: 5
    }
  }
]);
```

### روش دوم: In-Memory Cosine Similarity (محیط توسعه/لوکال)
در محیط توسعه بدون Atlas، از محاسبه تشابه کسینوسی (Cosine Similarity) روی تمام چانک‌ها استفاده می‌شود (`BrandRagService`).

---

## 🎭 ۴. پرومپت سیستم و شخصی‌سازی لحن (Brand Persona Training)

مدل AI از دستورالعمل‌های یکپارچه **«خانه چوب و هنر»** پیروی می‌کند:

```markdown
- لحن: آرام، مطمئن، دقیق، معمارانه و باوقار (مانند یک معمار یا استادکار نجاری).
- صداقت متریال: تکیه بر چوب ماسیو، اتصالات نجاری، دوام و کاربرد واقعی.
- کلمات ممنوعه: «لاکچری»، «بی‌نظیر»، «فوق‌العاده»، «رویایی».
- قانون طلایی معرفی محصول: به‌جای نام خشک محصول، داستان کاربرد انسانی آن را روایت کنید.
```

---

## 🛠️ ۵. اندپوینت‌های آماده API جهت تست تیم بک‌اند

* **`POST /api/brand-chat/query`**: ارسال پیام و دریافت پاسخ RAG با لحن چوب و هنر.
* **`GET /api/brand-chat/search?q=...`**: جستجوی مستقیم برداری روی دیتابیس امبدینگ.
* **`POST /api/brand-chat/seed`**: بارگذاری و امبد کردن مجدد اطلاعات برندبوک.

---

## 🔄 ۶. انتقال به سایر مدل‌ها (Migration to OpenAI / Ollama / Qdrant)

اگر تیم بک‌اند قصد سوئیچ از مدل لوکال به مدل‌های دیگر را داشت:
1. **تغییر ابعاد در اسکیما:** در صورت استفاده از OpenAI `text-embedding-3-small` (ابعاد ۱۵۳۶) تنها مقدار ابعاد Vector Index در Atlas آپدیت شود.
2. **پلاگ‌این سرویس:** کلاس `LocalEmbeddingService` به خروجی API مورد نظر تیم بک‌اند متصل می‌گردد بدون آنکه منطق اصلی RAG تغییر کند.
