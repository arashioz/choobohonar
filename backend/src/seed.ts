import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';

const ContentJobSchema = new mongoose.Schema(
  {
    type: String,
    language: String,
    priority: String,
    input: Object,
    status: String,
    currentStep: String,
    progress: Number,
    result: Object,
    usedExamples: [mongoose.Schema.Types.ObjectId],
    llmProvider: String,
    imageProvider: String,
    adminNote: String,
    reviewedAt: Date,
    publishedAt: Date,
  },
  { timestamps: true },
);

const ContentJobModel = mongoose.model('ContentJob', ContentJobSchema);

const SEED_JOBS = [
  {
    type: 'blog',
    language: 'fa',
    priority: 'normal',
    input: { topic: 'انواع چوب برای دکوراسیون داخلی', targetKeywords: ['چوب دکوراسیون', 'طراحی داخلی چوبی'] },
    status: 'pending',
    currentStep: 'در صف انتظار...',
    progress: 0,
    result: {},
    llmProvider: 'mock',
    imageProvider: 'mock',
  },
  {
    type: 'product',
    language: 'en',
    priority: 'high',
    input: { productName: 'Oak Dining Table', materials: ['solid oak', 'steel legs'], features: ['seats 8', 'natural finish'] },
    status: 'processing',
    currentStep: 'در حال نوشتن توضیحات محصول...',
    progress: 50,
    result: {},
    llmProvider: 'mock',
    imageProvider: 'mock',
  },
  {
    type: 'blog',
    language: 'fa',
    priority: 'normal',
    input: { topic: 'سبک روستیک در طراحی داخلی', targetKeywords: ['سبک روستیک', 'دکوراسیون روستیک', 'چوب طبیعی'] },
    status: 'awaiting_review',
    currentStep: 'آماده بررسی',
    progress: 100,
    result: {
      title: 'سبک روستیک در طراحی داخلی: راهنمای کاربردی',
      outline: ['مقدمه', 'ویژگی‌های سبک روستیک', 'مواد و متریال', 'ترکیب رنگ‌ها', 'جمع‌بندی'],
      body: `سبک روستیک بر پایهٔ مواد طبیعی بنا شده است: چوب، سنگ و فلز با پرداخت کم. هدف، نمایان نگه‌داشتن بافت واقعی متریال است، نه پنهان‌کردن آن.

این سبک ریشه در معماری روستایی دارد و امروز در خانه‌های مدرن هم به کار می‌رود؛ معمولاً در ترکیب با خطوط ساده و فضای منفی.

**ویژگی‌های اصلی**
چوب با رگهٔ آشکار و پرداخت مات، بافت‌های طبیعی، و پالت رنگ‌های خاکی. در این سبک، نشانهٔ کار دست و سن متریال عیب نیست، بخشی از زبان طراحی است.`,
      metaTitle: 'سبک روستیک در طراحی داخلی | خانه چوب و هنر',
      metaDescription: 'راهنمای کاربردی سبک روستیک در طراحی داخلی: مواد طبیعی، بافت چوب، و ترکیب رنگ‌های خاکی.',
      keywords: ['سبک روستیک', 'طراحی داخلی روستیک', 'دکوراسیون چوبی', 'بافت طبیعی', 'چوب ماسیو'],
      imagePrompt:
        'Architectural product photography of handcrafted Iranian wood furniture, honest natural wood grain, visible joinery, matte natural-oil finish, deep forest-green (#092B1C) and soft peach (#FBBEA6) palette, calm warm soft daylight, generous negative space, minimal architectural composition, photorealistic',
      imageUrl: 'https://picsum.photos/seed/rustic1/1200/630',
      marketingCopy: 'در سبک روستیک، بافتِ واقعی چوب پنهان نمی‌شود.',
    },
    llmProvider: 'mock',
    imageProvider: 'mock',
  },
  {
    type: 'product',
    language: 'en',
    priority: 'normal',
    input: { productName: 'Walnut Floating Shelf', materials: ['solid walnut'], features: ['hidden brackets', '80cm length', 'natural oil finish'] },
    status: 'approved',
    currentStep: 'تایید شده',
    progress: 100,
    result: {
      title: 'Solid Walnut Floating Shelf | ChooboHonar Home',
      body: `Made from solid walnut, this floating shelf carries the wood's natural grain across its face. The bracket system mounts out of sight, so the shelf reads as a single clean line on the wall.

**Specifications**
- Material: Solid walnut
- Length: 80 cm
- Finish: Natural oil
- Mounting: Hidden bracket system included`,
      metaTitle: 'Solid Walnut Floating Shelf | ChooboHonar Home',
      metaDescription: 'Handcrafted solid walnut floating shelf, 80 cm, with hidden brackets and a natural-oil finish.',
      keywords: ['solid walnut shelf', 'floating shelf', 'wooden wall shelf', 'handcrafted shelf', 'hidden bracket shelf'],
      imagePrompt:
        'Architectural product photography of a solid walnut floating shelf, honest natural wood grain, hidden brackets, matte natural-oil finish, deep forest-green (#092B1C) and soft peach (#FBBEA6) palette, calm warm soft daylight, generous negative space, minimal architectural composition, photorealistic',
      imageUrl: 'https://picsum.photos/seed/walnut2/1200/630',
      marketingCopy: 'Solid walnut, reading as a single clean line on the wall.',
    },
    llmProvider: 'mock',
    imageProvider: 'mock',
    reviewedAt: new Date(Date.now() - 86400000),
  },
  {
    type: 'blog',
    language: 'fa',
    priority: 'low',
    input: { topic: 'هنر چوب‌تراشی مدرن', targetKeywords: ['چوب‌تراشی مدرن', 'هنر چوب', 'صنایع دستی'] },
    status: 'published',
    currentStep: 'منتشر شده',
    progress: 100,
    result: {
      title: 'چوب‌تراشی مدرن: از کار دست تا دقت ماشین',
      body: `چوب‌تراشی در ایران ریشه‌ای کهن دارد. امروز این کار با ابزار و طراحی دیجیتال ترکیب شده است؛ دقتِ ماشین در کنار قضاوتِ دست.

این ترکیب، فرم‌های ساده‌تر و اتصالات دقیق‌تری ممکن می‌کند، بی‌آنکه بافت و رگهٔ چوب از دست برود.`,
      metaTitle: 'چوب‌تراشی مدرن | خانه چوب و هنر',
      metaDescription: 'چوب‌تراشی مدرن، ترکیب کار دست و دقت ماشین: فرم ساده، اتصال دقیق، و حفظ بافت طبیعی چوب.',
      keywords: ['چوب‌تراشی مدرن', 'نجاری دقیق', 'اتصالات چوب', 'صنایع دستی چوبی'],
      imagePrompt:
        'Architectural product photography of handcrafted Iranian wood carving, honest natural wood grain, precise joinery, matte natural-oil finish, deep forest-green (#092B1C) and soft peach (#FBBEA6) palette, calm warm soft daylight, generous negative space, minimal architectural composition, photorealistic',
      imageUrl: 'https://picsum.photos/seed/craft1/1200/630',
      marketingCopy: 'کار دست، با دقتِ ماشین.',
    },
    llmProvider: 'mock',
    imageProvider: 'mock',
    reviewedAt: new Date(Date.now() - 172800000),
    publishedAt: new Date(Date.now() - 86400000),
  },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected.');

  await ContentJobModel.deleteMany({});
  console.log('Cleared existing content jobs.');

  const inserted = await ContentJobModel.insertMany(SEED_JOBS);
  console.log(`Seeded ${inserted.length} content jobs:`);
  inserted.forEach((job: any) => {
    console.log(`  [${job.status}] ${job.type}: ${job.input?.topic || job.input?.productName}`);
  });

  await mongoose.disconnect();
  console.log('\nDone! Start the server and visit http://localhost:3001/api/content/jobs');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
