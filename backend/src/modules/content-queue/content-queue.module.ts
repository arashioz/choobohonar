import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AiModule } from '../ai/ai.module';
import { ContentGenerationProcessor, CONTENT_QUEUE } from './content-generation.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: CONTENT_QUEUE }),
    AiModule,
  ],
  providers: [ContentGenerationProcessor],
  exports: [BullModule],
})
export class ContentQueueModule {}
