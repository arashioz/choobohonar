import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CompletionRequest, LLMProvider } from './llm.interface';

@Injectable()
export class OpenRouterProvider implements LLMProvider {
  private readonly logger = new Logger(OpenRouterProvider.name);
  private readonly apiKey: string;
  private readonly model: string;

  constructor(private config: ConfigService) {
    this.apiKey = config.get<string>('OPENROUTER_API_KEY', '');
    this.model = config.get<string>('OPENROUTER_MODEL', 'anthropic/claude-sonnet-4-6');
  }

  async complete(request: CompletionRequest): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://choobvahonar.com',
        'X-Title': 'Choob va Honar Content AI',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userPrompt },
        ],
        max_tokens: request.maxTokens || 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      this.logger.error(`OpenRouter error: ${error}`);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}
