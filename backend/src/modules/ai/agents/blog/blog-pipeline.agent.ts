import { Injectable, Inject } from '@nestjs/common';
import { LLM_PROVIDER } from '../../providers/llm/llm.interface';
import type { ContentJobDocument } from '../../../content/schemas/content-job.schema';
import { buildBlogSystemPrompt } from '../shared/brand-context';

type ProgressCallback = (step: string, message: string, progress: number) => void;

@Injectable()
export class BlogPipelineAgent {
  constructor(@Inject(LLM_PROVIDER) private llm: any) {}

  async run(job: ContentJobDocument, onProgress: ProgressCallback): Promise<Record<string, unknown>> {
    const isFa = job.language === 'fa';

    onProgress('تحلیل موضوع', isFa ? 'در حال تحلیل موضوع و کلیدواژه‌ها...' : 'Analyzing topic and keywords...', 15);
    await this.sleep(600);

    onProgress('ساختار محتوا', isFa ? 'در حال تنظیم ساختار مقاله...' : 'Structuring article outline...', 30);
    await this.sleep(400);

    onProgress('نگارش محتوا', isFa ? 'در حال نوشتن متن مقاله...' : 'Writing article content...', 50);

    const userPrompt = isFa
      ? `موضوع: ${job.input.topic}\nکلیدواژه‌ها: ${(job.input.targetKeywords || []).join(', ')}\nزبان: fa`
      : `Topic: ${job.input.topic}\nKeywords: ${(job.input.targetKeywords || []).join(', ')}\nLanguage: en`;

    const raw = await this.llm.complete({
      systemPrompt: buildBlogSystemPrompt(isFa ? 'fa' : 'en'),
      userPrompt,
      maxTokens: 2500,
    });

    onProgress('بهینه‌سازی SEO', isFa ? 'در حال بهینه‌سازی برای موتورهای جستجو...' : 'Optimizing for search engines...', 65);
    await this.sleep(500);

    try {
      return JSON.parse(raw);
    } catch {
      return { title: job.input.topic, body: raw, keywords: job.input.targetKeywords || [] };
    }
  }

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }
}
