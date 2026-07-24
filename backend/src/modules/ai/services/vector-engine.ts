import { LocalEmbeddingService } from './local-embedding.service';
import { BRAND, buildBlogSystemPrompt } from '../agents/shared/brand-context';

export interface EmbeddedChunk {
  id: string;
  title: string;
  category: string;
  content: string;
  embedding: number[];
  metadata: Record<string, any>;
}

export class StandaloneBrandVectorEngine {
  private static store: EmbeddedChunk[] = [];
  private static embeddingService = new LocalEmbeddingService();
  private static isInitialized = false;

  /**
   * Initializes and seeds 384-dimensional vectors in memory
   */
  public static async initialize() {
    if (this.isInitialized) return;

    const brandKnowledge = [
      {
        id: 'chunk-1',
        title: 'تاریخچه و بنیان‌گذار خانه چوب و هنر',
        category: 'FOUNDATION',
        content: 'تأسیس ۱۳۵۳ توسط غلامحسین شیرپور. نقل قول بنیان‌گذار: "اعتبار و جایگاه یک نام، سال‌ها زمان می‌برد تا ساخته شود. اگر روزی نتوانستید کاری در شأن نام معتبرتان انجام دهید، انجام ندادنش درست‌تر خواهد بود." در سال ۱۳۸۵ برند چوب و هنر و در سال ۱۴۰۱ خانه چوب و هنر شکل گرفت.',
        metadata: { chapter: 1, topic: 'heritage' },
      },
      {
        id: 'chunk-2',
        title: 'بیانیه هدف و هویت خانه چوب و هنر',
        category: 'FOUNDATION',
        content: 'خانه چوب و هنر تنها یک تولیدکننده مبلمان نیست. ما باور داریم خانه فضایی زنده است که در آن خاطرات ساخته می‌شود و هویت انسان‌ها بازتاب می‌یابد. شعار: ساختن خانه‌هایی با روح (Crafting Homes with Soul).',
        metadata: { chapter: 1, topic: 'purpose' },
      },
      {
        id: 'chunk-3',
        title: 'اصول لحن و شخصیت چوب و هنر (Voice & Personality)',
        category: 'COMMUNICATION',
        content: 'لحن چوب و هنر: آرام، مطمئن، دقیق، معمارانه و باوقار. مانند یک معمار یا استادکار نجاری صحبت می‌کنیم نه یک فروشنده. از واژگان صفت‌زده مانند لاکچری، بی‌نظیر و رویایی استفاده نمی‌کنیم. تکیه بر صداقت متریال، چوب ماسیو، اتصالات نجاری و دوام.',
        metadata: { chapter: 5, topic: 'voice' },
      },
      {
        id: 'chunk-4',
        title: 'پالت رنگی برند (Brand Color Palette)',
        category: 'VISUAL_IDENTITY',
        content: 'رنگ اصلی غالب (۸۰٪): سبز جنگلی (Forest Green) با کد HEX #092B1C و CMYK 85-55-80-70. اکسنت گرم (۲۰٪): هلویی (Peach) با کد HEX #FBBEA6. رنگ‌های ثانویه: آجری #C15C3B، سبز رترو #A7D8B7 و قهوه‌ای #5A3830.',
        metadata: { chapter: 6, topic: 'colors' },
      },
      {
        id: 'chunk-5',
        title: 'آرکی‌تایپ و پرسونای برند',
        category: 'STRATEGY',
        content: 'آرکی‌تایپ اصلی: خالق مهربان (The Caring Creator). ترکیب خلاقیت، زیبایی‌شناسی و مراقبت از انسان‌ها. مخاطبان: صاحب‌خانه آگاه، علاقه‌مند به طراحی داخلی و خانواده‌های احساسی.',
        metadata: { chapter: 2, topic: 'archetype' },
      },
      {
        id: 'chunk-6',
        title: 'قانون طلایی معرفی محصول',
        category: 'COMMUNICATION',
        content: 'به جای «میز چوبی مدل X» بگویید: «میزی که برای سال‌ها همراه لحظات دورهمی خانواده طراحی شده است.» داستان‌سرایی بر پایه ارزش و کاربرد انسانی.',
        metadata: { chapter: 5, topic: 'product-presentation' },
      },
      {
        id: 'chunk-7',
        title: 'فلسفه متریال و چوب ماسیو',
        category: 'PRODUCT_DESIGN',
        content: 'چوب فقط یک ماده اولیه نیست؛ یک عنصر زنده است دارای شخصیت، بافت، گرما و داستان. در ساخت محصولات از چوب‌های اصیل گردو، بلوط و راش با پرداخت روغن طبیعی استفاده می‌شود.',
        metadata: { chapter: 3, topic: 'materials' },
      },
    ];

    console.log('⚡ [384d Vector Engine] Starting embedding generation for ChooboHonar Brandbook...');

    for (const item of brandKnowledge) {
      const vector = await this.embeddingService.generateEmbedding(item.content);
      this.store.push({
        ...item,
        embedding: vector,
      });
    }

    this.isInitialized = true;
    console.log(`✅ [384d Vector Engine] Successfully embedded ${this.store.length} brand chunks (384 Dimensions).`);
  }

  /**
   * Search top-K similar chunks using 384-dimensional cosine similarity
   */
  public static async search(query: string, limit = 3): Promise<{ chunk: EmbeddedChunk; score: number }[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const queryVector = await this.embeddingService.generateEmbedding(query);

    const scored = this.store.map((chunk) => {
      const score = this.cosineSimilarity(queryVector, chunk.embedding);
      return { chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  /**
   * RAG Query Execution Engine
   */
  public static async queryAgent(userMessage: string): Promise<{
    query: string;
    matchedChunks: { title: string; score: string; content: string }[];
    agentResponse: string;
  }> {
    const results = await this.search(userMessage, 2);

    const matchedSummary = results.map((r) => ({
      title: r.chunk.title,
      score: (r.score * 100).toFixed(1) + '%',
      content: r.chunk.content,
    }));

    const topChunk = results[0]?.chunk;

    const agentResponse = `[پاسخ هوشمند ایجنت خانه چوب و هنر]\n\nدر پاسخ به «${userMessage}»:\nبر اساس هویت ثبت‌شده در برندبوک دیجیتال، ${topChunk ? topChunk.content : ''}\n\nما در خانه چوب و هنر با دقت معمارانه و تکیه بر اصالت صنعت‌گری ۵۰ ساله، فضایی را خلق می‌کنیم که حسی از گرما و ماندگاری را منتقل کند.`;

    return {
      query: userMessage,
      matchedChunks: matchedSummary,
      agentResponse,
    };
  }

  private static cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
  }
}
