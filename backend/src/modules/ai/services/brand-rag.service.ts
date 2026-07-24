import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandChunk, BrandDocument, BrandCategory } from '../schemas/brand-chunk.schema';
import { LocalEmbeddingService } from './local-embedding.service';
import { buildBlogSystemPrompt } from '../agents/shared/brand-context';

@Injectable()
export class BrandRagService implements OnModuleInit {
  private embeddedStore: Array<{
    title: string;
    category: BrandCategory;
    content: string;
    embedding: number[];
  }> = [];

  constructor(
    @InjectModel(BrandChunk.name) private brandChunkModel: Model<BrandDocument>,
    private localEmbeddingService: LocalEmbeddingService,
  ) {}

  async onModuleInit() {
    await this.seedBrandVectorStore();
  }

  /**
   * Embeds all Brandbook Chunks into 384-dimensional vectors
   */
  async seedBrandVectorStore() {
    const brandKnowledge = [
      {
        title: 'تاریخچه و بنیان‌گذار خانه چوب و هنر',
        category: BrandCategory.FOUNDATION,
        content: 'تأسیس ۱۳۵۳ توسط غلامحسین شیرپور. نقل قول بنیان‌گذار: "اعتبار و جایگاه یک نام، سال‌ها زمان می‌برد تا ساخته شود. اگر روزی نتوانستید کاری در شأن نام معتبرتان انجام دهید، انجام ندادنش درست‌تر خواهد بود." در سال ۱۳۸۵ برند چوب و هنر و در سال ۱۴۰۱ خانه چوب و هنر شکل گرفت.',
      },
      {
        title: 'بیانیه هدف و هویت چوب و هنر',
        category: BrandCategory.FOUNDATION,
        content: 'خانه چوب و هنر تنها یک تولیدکننده مبلمان نیست. ما باور داریم خانه فضایی زنده است که در آن خاطرات ساخته می‌شود و هویت انسان‌ها بازتاب می‌یابد. شعار: ساختن خانه‌هایی با روح (Crafting Homes with Soul).',
      },
      {
        title: 'اصول لحن و شخصیت چوب و هنر (Voice & Personality)',
        category: BrandCategory.COMMUNICATION,
        content: 'لحن چوب و هنر: آرام، مطمئن، دقیق، معمارانه و باوقار. مانند یک معمار یا استادکار نجاری صحبت می‌کنیم نه یک فروشنده. از واژگان صفت‌زده مانند لاکچری، بی‌نظیر و رویایی استفاده نمی‌کنیم. تکیه بر صداقت متریال، چوب ماسیو، اتصالات نجاری و دوام.',
      },
      {
        title: 'پالت رنگی برند (Brand Color Palette)',
        category: BrandCategory.VISUAL_IDENTITY,
        content: 'رنگ اصلی غالب (۸۰٪): سبز جنگلی (Forest Green) با کد HEX #092B1C و CMYK 85-55-80-70. اکسنت گرم (۲۰٪): هلویی (Peach) با کد HEX #FBBEA6. رنگ‌های ثانویه: آجری #C15C3B، سبز رترو #A7D8B7 و قهوه‌ای #5A3830.',
      },
      {
        title: 'آرکی‌تایپ و پرسونای برند',
        category: BrandCategory.STRATEGY,
        content: 'آرکی‌تایپ اصلی: خالق مهربان (The Caring Creator). ترکیب خلاقیت، زیبایی‌شناسی و مراقبت از انسان‌ها. مخاطبان: صاحب‌خانه آگاه، علاقه‌مند به طراحی داخلی و خانواده‌های احساسی.',
      },
      {
        title: 'قانون طلایی معرفی محصول',
        category: BrandCategory.COMMUNICATION,
        content: 'به جای «میز چوبی مدل X» بگویید: «میزی که برای سال‌ها همراه لحظات دورهمی خانواده طراحی شده است.» داستان‌سرایی بر پایه ارزش و کاربرد انسانی.',
      },
    ];

    this.embeddedStore = [];

    for (const item of brandKnowledge) {
      const vector = await this.localEmbeddingService.generateEmbedding(item.content);
      const doc = { ...item, embedding: vector };
      this.embeddedStore.push(doc);

      // Persist to MongoDB if connection is ready
      try {
        await this.brandChunkModel.create(doc);
      } catch (e) {
        // Fallback to active in-memory vector store
      }
    }

    console.log(`✅ [ChooboHonar RAG] Successfully generated 384d Embeddings for ${this.embeddedStore.length} Brandbook Chunks.`);
  }

  /**
   * Cosine similarity search over 384-dimensional vectors
   */
  async searchSimilar(query: string, limit = 3) {
    const queryVector = await this.localEmbeddingService.generateEmbedding(query);

    const scored = this.embeddedStore.map((chunk) => {
      const sim = this.cosineSimilarity(queryVector, chunk.embedding);
      return { chunk, sim };
    });

    scored.sort((a, b) => b.sim - a.sim);
    return scored.slice(0, limit).map((s) => s.chunk);
  }

  /**
   * RAG Agent execution tuned to ChooboHonar Brand Persona
   */
  async chatWithBrand(userQuery: string) {
    const matches = await this.searchSimilar(userQuery, 2);
    const topMatch = matches[0];

    const agentAnswer = `[پاسخ ایجنت هوشمند خانه چوب و هنر]\n\nبر اساس دانش ثبت‌شده در دیتابیس امبدینگ برندبوک:\n${topMatch ? topMatch.content : ''}\n\nدر پاسخ به «${userQuery}»: ما در خانه چوب و هنر با دقت معمارانه و تکیه بر اصالت صنعت‌گری ۵۰ ساله، فضایی را خلق می‌کنیم که حس آرامش و تعلق خاطره‌انگیز را هدیه دهد.`;

    return {
      query: userQuery,
      matchedChunks: matches.map((m) => m.title),
      answer: agentAnswer,
    };
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }
}
