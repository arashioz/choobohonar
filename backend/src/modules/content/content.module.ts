import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { ContentJob, ContentJobSchema } from './schemas/content-job.schema';
import { ContentFeedback, ContentFeedbackSchema } from './schemas/content-feedback.schema';
import { ContentExample, ContentExampleSchema } from './schemas/content-example.schema';
import { CONTENT_QUEUE } from '../content-queue/content-generation.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContentJob.name, schema: ContentJobSchema },
      { name: ContentFeedback.name, schema: ContentFeedbackSchema },
      { name: ContentExample.name, schema: ContentExampleSchema },
    ]),
    BullModule.registerQueue({ name: CONTENT_QUEUE }),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}
