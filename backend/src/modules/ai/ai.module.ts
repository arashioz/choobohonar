import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LLM_PROVIDER } from './providers/llm/llm.interface';
import { IMAGE_PROVIDER } from './providers/image/image.interface';
import { MockLLMProvider } from './providers/llm/mock-llm.provider';
import { OpenRouterProvider } from './providers/llm/openrouter.provider';
import { MockImageProvider } from './providers/image/mock-image.provider';
import { OrchestratorAgent } from './agents/orchestrator.agent';
import { BlogPipelineAgent } from './agents/blog/blog-pipeline.agent';
import { ProductPipelineAgent } from './agents/product/product-pipeline.agent';
import { ImagePromptAgent } from './agents/shared/image-prompt.agent';
import { ImageGeneratorAgent } from './agents/shared/image-generator.agent';
import { ContentJob, ContentJobSchema } from '../content/schemas/content-job.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: ContentJob.name, schema: ContentJobSchema }]),
  ],
  providers: [
    {
      provide: LLM_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('LLM_PROVIDER', 'mock');
        if (provider === 'openrouter') return new OpenRouterProvider(config);
        return new MockLLMProvider();
      },
    },
    {
      provide: IMAGE_PROVIDER,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const provider = config.get<string>('IMAGE_PROVIDER', 'mock');
        if (provider === 'mock') return new MockImageProvider();
        return new MockImageProvider(); // placeholder until real providers added
      },
    },
    OrchestratorAgent,
    BlogPipelineAgent,
    ProductPipelineAgent,
    ImagePromptAgent,
    ImageGeneratorAgent,
  ],
  exports: [OrchestratorAgent],
})
export class AiModule {}
