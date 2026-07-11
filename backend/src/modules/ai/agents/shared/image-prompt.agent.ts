import { Injectable, Inject } from '@nestjs/common';
import { LLM_PROVIDER } from '../../providers/llm/llm.interface';
import { buildImagePrompt, Lang } from './brand-context';

@Injectable()
export class ImagePromptAgent {
  constructor(@Inject(LLM_PROVIDER) private llm: any) {}

  async run(content: Record<string, unknown>, language: string): Promise<string> {
    // Brand-aligned art direction (forest-green + peach, architectural minimalism,
    // material honesty). Built deterministically so it works in demo/mock mode too.
    return buildImagePrompt(content, (language as Lang) === 'en' ? 'en' : 'fa');
  }
}
