export interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export interface LLMProvider {
  complete(request: CompletionRequest): Promise<string>;
}

export const LLM_PROVIDER = 'LLM_PROVIDER';
