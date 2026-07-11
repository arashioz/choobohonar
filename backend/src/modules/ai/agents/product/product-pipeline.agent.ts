import { Injectable, Inject } from '@nestjs/common';
import { LLM_PROVIDER } from '../../providers/llm/llm.interface';
import type { ContentJobDocument } from '../../../content/schemas/content-job.schema';
import { buildProductSystemPrompt } from '../shared/brand-context';

type ProgressCallback = (step: string, message: string, progress: number) => void;

@Injectable()
export class ProductPipelineAgent {
  constructor(@Inject(LLM_PROVIDER) private llm: any) {}

  async run(job: ContentJobDocument, onProgress: ProgressCallback): Promise<Record<string, unknown>> {
    const isFa = job.language === 'fa';

    onProgress('تحلیل محصول', isFa ? 'در حال تحلیل ویژگی‌های محصول...' : 'Analyzing product features...', 15);
    await this.sleep(500);

    onProgress('نگارش عنوان', isFa ? 'در حال نوشتن عنوان محصول...' : 'Crafting product title...', 30);
    await this.sleep(400);

    onProgress('نگارش توضیحات', isFa ? 'در حال نوشتن توضیحات محصول...' : 'Writing product description...', 50);

    const userPrompt = isFa
      ? `نام محصول: ${job.input.productName}\nمواد: ${(job.input.materials || []).join(', ')}\nویژگی‌ها: ${(job.input.features || []).join(', ')}\nزبان: fa`
      : `Product: ${job.input.productName}\nMaterials: ${(job.input.materials || []).join(', ')}\nFeatures: ${(job.input.features || []).join(', ')}\nLanguage: en`;

    const raw = await this.llm.complete({
      systemPrompt: buildProductSystemPrompt(isFa ? 'fa' : 'en'),
      userPrompt,
      maxTokens: 1500,
    });

    onProgress('متن بازاریابی', isFa ? 'در حال نوشتن متن تبلیغاتی...' : 'Crafting marketing copy...', 65);
    await this.sleep(400);

    try {
      return JSON.parse(raw);
    } catch {
      return { title: job.input.productName, body: raw, keywords: [] };
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
