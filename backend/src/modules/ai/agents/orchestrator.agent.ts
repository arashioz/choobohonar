import { Injectable, Inject, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentJob, ContentJobDocument } from '../../content/schemas/content-job.schema';
import { BlogPipelineAgent } from './blog/blog-pipeline.agent';
import { ProductPipelineAgent } from './product/product-pipeline.agent';
import { ImagePromptAgent } from './shared/image-prompt.agent';
import { ImageGeneratorAgent } from './shared/image-generator.agent';

export interface ProgressEvent {
  jobId: string;
  step: string;
  message: string;
  progress: number;
}

@Injectable()
export class OrchestratorAgent {
  private readonly logger = new Logger(OrchestratorAgent.name);

  constructor(
    @InjectModel(ContentJob.name) private jobModel: Model<ContentJobDocument>,
    private eventEmitter: EventEmitter2,
    private blogPipeline: BlogPipelineAgent,
    private productPipeline: ProductPipelineAgent,
    private imagePromptAgent: ImagePromptAgent,
    private imageGeneratorAgent: ImageGeneratorAgent,
  ) {}

  async run(jobId: string): Promise<void> {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new Error(`Job ${jobId} not found`);

    try {
      await this.updateJob(job, { status: 'processing', progress: 5, currentStep: 'شروع پردازش...' });
      this.emit(jobId, 'شروع', 'آغاز پایپلاین تولید محتوا', 5);

      let result: Record<string, unknown> = {};

      if (job.type === 'blog') {
        result = await this.blogPipeline.run(job, (step, msg, progress) => {
          this.updateJob(job, { currentStep: msg, progress });
          this.emit(jobId, step, msg, progress);
        });
      } else {
        result = await this.productPipeline.run(job, (step, msg, progress) => {
          this.updateJob(job, { currentStep: msg, progress });
          this.emit(jobId, step, msg, progress);
        });
      }

      await this.updateJob(job, { status: 'image_generation', progress: 75, currentStep: 'تولید تصویر...' });
      this.emit(jobId, 'تصویر', 'در حال ساخت تصویر با هوش مصنوعی...', 75);

      const imagePrompt = await this.imagePromptAgent.run(result, job.language);
      const imageUrl = await this.imageGeneratorAgent.run(imagePrompt);

      result.imagePrompt = imagePrompt;
      result.imageUrl = imageUrl;

      await this.jobModel.findByIdAndUpdate(jobId, {
        status: 'awaiting_review',
        progress: 100,
        currentStep: 'آماده بررسی',
        result,
        llmProvider: process.env.LLM_PROVIDER || 'mock',
        imageProvider: process.env.IMAGE_PROVIDER || 'mock',
      });

      this.emit(jobId, 'آماده', 'محتوا آماده بررسی است', 100);
      this.eventEmitter.emit('content.ready', { jobId });
    } catch (err) {
      this.logger.error(`Job ${jobId} failed: ${err.message}`);
      await this.jobModel.findByIdAndUpdate(jobId, {
        status: 'pending',
        currentStep: 'خطا در پردازش',
        progress: 0,
      });
      this.eventEmitter.emit('content.error', { jobId, error: err.message });
    }
  }

  private emit(jobId: string, step: string, message: string, progress: number) {
    this.eventEmitter.emit('content.progress', { jobId, step, message, progress } as ProgressEvent);
  }

  private updateJob(job: ContentJobDocument, update: Partial<ContentJobDocument>) {
    return this.jobModel.findByIdAndUpdate(job._id, update);
  }
}
