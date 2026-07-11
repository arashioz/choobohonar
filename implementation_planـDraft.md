# سند جامع معماری و مشخصات فنی (System Architecture & PRD)
**نام پروژه:** پلتفرم فروشگاهی و هوشمند «چوب و هنر»
**نسخه سند:** 1.0.0 (جزئیات کامل فنی)
**نوع معماری:** Headless E-commerce + AI Agentic Workflow

---

## ۱. معماری کلان سیستم (High-Level Architecture)
سیستم از سه لایه اصلی تشکیل شده است که کاملاً از هم جدا (Decoupled) هستند:
1. **لایه ارائه (Presentation Layer):** اپلیکیشن Next.js که وظیفه رندرینگ سمت سرور (SSR)، انیمیشن‌های کلاینت‌ساید و ارتباط با کاربر را دارد.
2. **لایه هوشمند (Logic & AI Layer):** سرور NestJS که درخواست‌ها را دریافت کرده، پردازش‌های سنگین هوش مصنوعی را با LangChain انجام می‌دهد و نتایج را از طریق REST API و WebSockets به لایه ارائه می‌فرستد.
3. **لایه داده (Data Layer):** کلاستر MongoDB Atlas که هم دیتای ساختاریافته (محصولات) و هم دیتای برداری (Vector Embeddings) را ذخیره می‌کند.

---

## ۲. جزئیات لایه فرانت‌اند (Next.js & Motion)

### ۲.۱. استک دقیق:
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS + `clsx` + `tailwind-merge` (برای کامپوننت‌های پویا)
*   **Animation Engine:** GSAP (ScrollTrigger, Flip, TextPlugin)
*   **Smooth Scroll:** `@studio-freight/lenis`
*   **State Management:** `zustand` (جهت مدیریت اتصال Socket.io و لاگ‌های AI)

### ۲.۲. ساختار پوشه‌ها (Directory Structure):
```text
src/
├── app/                  # روت‌های اصلی (/, /products, /admin)
├── components/
│   ├── ui/               # کامپوننت‌های پایه (دکمه‌ها، فرم‌ها برگرفته از 21st.dev)
│   ├── motion/           # Wrapperهای انیمیشنی (مثل FadeIn, ParallaxScroll)
│   └── layout/           # هدر، فوتر، کانتینرهای اصلی
├── lib/                  # توابع کمکی (utils.ts)
├── store/                # استورهای Zustand (useAiStore.ts)
└── types/                # تایپ‌های عمومی TypeScript
```

### ۲.۳. استراتژی انیمیشن (Luxury Vibe):
*   ترکیب `Lenis` با `GSAP ScrollTrigger` با تنظیم `lerp: 0.1` برای ایجاد اسکرولِ سنگین و باوقار (مشابه Studio Dado).
*   استفاده از `clip-path` و ترانزیشن‌های `Cubic-Bezier` برای ظاهر شدن تصاویر محصولات.

---

## ۳. جزئیات لایه بک‌اند (NestJS & AI Pipeline)

### ۳.۱. استک دقیق:
*   **Framework:** NestJS 10+
*   **Language:** TypeScript
*   **AI SDK:** `@langchain/core` و `@langchain/openai`
*   **Real-time:** `@nestjs/websockets` و `socket.io`
*   **DB ORM:** `Mongoose`

### ۳.۲. ساختار پوشه‌ها (Directory Structure):
```text
src/
├── modules/
│   ├── ai/               # سرویس‌ها و کنترلرهای مربوط به LangChain و LLM
│   ├── products/         # مدیریت دیتای محصولات
│   └── websockets/       # Gateway های Socket.io
├── common/               # اینترسپتورها، گاردها و فیلترهای استثنا
├── schemas/              # مدل‌های دیتابیس (Mongoose)
└── main.ts               # نقطه ورود سرور
```

### ۳.۳. معماری Pipeline هوش مصنوعی (Single-Flow Agent):
به جای استفاده از Multi-Agent های کند، از یک زنجیره ساختاریافته (Structured Output Chain) استفاده می‌کنیم:
1. **Input:** ویژگی‌های خام محصول (مثال: چوب گردو، رنگ تیره، ابعاد 2x1).
2. **System Prompt:** "شما یک کپی‌رایتر برندهای لوکس ایتالیایی هستید..."
3. **Structured Output (JSON):** LLM موظف است خروجی را دقیقاً با این فرمت برگرداند:
   ```json
   {
     "title": "...",
     "seo_description": "...",
     "marketing_copy": "...",
     "image_generation_prompt": "Photorealistic cinematic lighting..."
   }
   ```

---

## ۴. طراحی دیتابیس (MongoDB Atlas & Vector Search)

### ۴.۱. مدل دیتای محصول (Product Schema):
```typescript
{
  _id: ObjectId,
  name: String,
  material: String,
  price: Number,
  ai_generated_content: {
      copy: String,
      seoTags: [String],
      midjourney_prompt: String
  },
  content_embedding: [Number], // آرایه 1536 بُعدی برای وکتور سرچ
  status: Enum("DRAFT", "PUBLISHED")
}
```

### ۴.۲. تنظیمات Vector Search:
*   الگوریتم: `cosine similarity` (برای تطابق معنایی بالا در חיפوش محصولات).
*   مدل Embedding: `text-embedding-3-small` (از OpenAI).

---

## ۵. رویدادهای وب‌سوکت (Socket.io Events Interface)
برای اینکه پنل مدیریت زنده بماند، این ایونت‌ها طراحی شده‌اند:
*   **`Client -> Server:`**
    *   `start_generation`: ارسال آیدی محصول برای شروع تولید محتوا.
*   **`Server -> Client:`**
    *   `agent_log`: ارسال متن زنده (Streaming) مثال: `{ step: 'writing', message: 'در حال نگارش متن سئو...' }`
    *   `agent_success`: پایان کار و ارسال دیتای نهایی.
    *   `agent_error`: مدیریت خطای LLM.

---

## ۶. نیازمندی‌های استقرار و زیرساخت (DevOps)
*   **Frontend Hosting:** سرویس Vercel (به دلیل پشتیبانی عالی از Next.js Image Optimization و Edge Functions).
*   **Backend Hosting:** پلتفرم‌های مبتنی بر Docker مثل سرویس‌های ابری Liara یا Railway.
*   **Database:** دیتابیس MongoDB Atlas (حداقل Tier M10 به بالا جهت پشتیبانی پایدار از پردازش‌های سنگین Vector Search).
*   **AI APIs:** نیازمند کلیدهای API برای `OpenAI` (جهت تولید متن) و سرویسی مثل `Midjourney API` یا `Replicate` (جهت تولید تصویر).
