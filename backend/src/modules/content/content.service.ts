import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Model } from 'mongoose';
import { ContentJob, ContentJobDocument } from './schemas/content-job.schema';
import { ContentFeedback, ContentFeedbackDocument } from './schemas/content-feedback.schema';
import { ContentExample, ContentExampleDocument } from './schemas/content-example.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { ReviewJobDto } from './dto/review-job.dto';
import { CONTENT_QUEUE } from '../content-queue/content-generation.processor';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(ContentJob.name) private jobModel: Model<ContentJobDocument>,
    @InjectModel(ContentFeedback.name) private feedbackModel: Model<ContentFeedbackDocument>,
    @InjectModel(ContentExample.name) private exampleModel: Model<ContentExampleDocument>,
    @InjectQueue(CONTENT_QUEUE) private contentQueue: Queue,
  ) {}

  async createJob(dto: CreateJobDto): Promise<ContentJobDocument> {
    const input: Record<string, unknown> = {};
    if (dto.type === 'blog') {
      input.topic = dto.topic;
      input.targetKeywords = dto.targetKeywords || [];
    } else {
      input.productName = dto.productName;
      input.materials = dto.materials || [];
      input.features = dto.features || [];
    }

    const job = await this.jobModel.create({
      type: dto.type,
      language: dto.language,
      priority: dto.priority || 'normal',
      input,
      status: 'pending',
      progress: 0,
      currentStep: 'در صف انتظار...',
    });

    await this.contentQueue.add(
      'generate',
      { jobId: job._id.toString() },
      { priority: dto.priority === 'high' ? 1 : dto.priority === 'low' ? 10 : 5 },
    );

    return job;
  }

  async listJobs(status?: string): Promise<ContentJobDocument[]> {
    const filter = status ? { status } : {};
    return this.jobModel.find(filter).sort({ createdAt: -1 }).limit(50).exec();
  }

  async getJob(id: string): Promise<ContentJobDocument> {
    const job = await this.jobModel.findById(id).exec();
    if (!job) throw new NotFoundException(`Job ${id} not found`);
    return job;
  }

  async reviewJob(id: string, dto: ReviewJobDto): Promise<ContentJobDocument> {
    const job = await this.getJob(id);

    const qualityScore = dto.action === 'approved' ? 1.0 : dto.action === 'edited' ? 0.7 : 0.0;

    const editDiff: { field: string; before: string; after: string }[] = [];
    let finalResult = { ...job.result };

    if (dto.action === 'edited' && dto.changes) {
      for (const [field, newValue] of Object.entries(dto.changes)) {
        editDiff.push({
          field,
          before: String((job.result as Record<string, unknown>)[field] || ''),
          after: newValue,
        });
        (finalResult as Record<string, unknown>)[field] = newValue;
      }
    }

    await this.feedbackModel.create({
      jobId: job._id,
      action: dto.action,
      editDiff,
      rejectReason: dto.reason,
      qualityScore,
    });

    const newStatus = dto.action === 'rejected' ? 'rejected' : 'approved';

    if (qualityScore > 0) {
      await this.exampleModel.create({
        type: job.type,
        language: job.language,
        input: job.input,
        output: finalResult,
        embedding: [],
        qualityScore,
        useCount: 0,
      });
    }

    return this.jobModel.findByIdAndUpdate(
      id,
      {
        status: newStatus,
        result: finalResult,
        adminNote: dto.reason,
        reviewedAt: new Date(),
      },
      { new: true },
    ) as Promise<ContentJobDocument>;
  }

  async publishJob(id: string): Promise<ContentJobDocument> {
    const job = await this.getJob(id);
    if (job.status !== 'approved') {
      throw new Error('Job must be approved before publishing');
    }
    return this.jobModel.findByIdAndUpdate(
      id,
      { status: 'published', publishedAt: new Date() },
      { new: true },
    ) as Promise<ContentJobDocument>;
  }

  async getQueueStats() {
    const [pending, processing, awaitingReview, completedToday] = await Promise.all([
      this.jobModel.countDocuments({ status: 'pending' }),
      this.jobModel.countDocuments({ status: 'processing' }),
      this.jobModel.countDocuments({ status: 'awaiting_review' }),
      this.jobModel.countDocuments({
        status: 'published',
        publishedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);
    return { pending, processing, awaitingReview, completedToday };
  }
}
