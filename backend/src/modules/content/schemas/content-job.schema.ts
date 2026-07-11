import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContentJobDocument = ContentJob & Document;

export type ContentType = 'blog' | 'product';
export type ContentLanguage = 'fa' | 'en';
export type ContentPriority = 'high' | 'normal' | 'low';
export type ContentStatus =
  | 'pending'
  | 'processing'
  | 'image_generation'
  | 'awaiting_review'
  | 'approved'
  | 'rejected'
  | 'published';

@Schema({ timestamps: true })
export class ContentJob {
  @Prop({ required: true, enum: ['blog', 'product'] })
  type: ContentType;

  @Prop({ required: true, enum: ['fa', 'en'] })
  language: ContentLanguage;

  @Prop({ enum: ['high', 'normal', 'low'], default: 'normal' })
  priority: ContentPriority;

  @Prop({ type: Object, required: true })
  input: {
    topic?: string;
    targetKeywords?: string[];
    productId?: Types.ObjectId;
    productName?: string;
    materials?: string[];
    features?: string[];
  };

  @Prop({
    enum: ['pending', 'processing', 'image_generation', 'awaiting_review', 'approved', 'rejected', 'published'],
    default: 'pending',
  })
  status: ContentStatus;

  @Prop({ default: '' })
  currentStep: string;

  @Prop({ default: 0 })
  progress: number;

  @Prop({ type: Object, default: {} })
  result: {
    title?: string;
    outline?: string[];
    body?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    imagePrompt?: string;
    imageUrl?: string;
    marketingCopy?: string;
  };

  @Prop({ type: [Types.ObjectId], default: [] })
  usedExamples: Types.ObjectId[];

  @Prop({ default: 'mock' })
  llmProvider: string;

  @Prop({ default: 'mock' })
  imageProvider: string;

  @Prop()
  adminNote?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  publishedAt?: Date;
}

export const ContentJobSchema = SchemaFactory.createForClass(ContentJob);
