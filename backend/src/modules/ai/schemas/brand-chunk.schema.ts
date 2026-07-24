import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = BrandChunk & Document;

export enum BrandCategory {
  FOUNDATION = 'FOUNDATION',
  STRATEGY = 'STRATEGY',
  PRODUCT_DESIGN = 'PRODUCT_DESIGN',
  EXPERIENCE = 'EXPERIENCE',
  COMMUNICATION = 'COMMUNICATION',
  VISUAL_IDENTITY = 'VISUAL_IDENTITY',
  CULTURE_FUTURE = 'CULTURE_FUTURE',
}

@Schema({ timestamps: true, collection: 'brand_embeddings' })
export class BrandChunk {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, enum: BrandCategory })
  category: BrandCategory;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Number], required: true, index: '2dsphere' }) // Vector Index placeholder or raw array
  embedding: number[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const BrandChunkSchema = SchemaFactory.createForClass(BrandChunk);

// Index for MongoDB Vector Search (Atlas Vector Search or Mongoose plugin)
BrandChunkSchema.index({ embedding: 1 });
