import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CollectionDocument = Collection & Document;
export type CollectionStatus = 'draft' | 'published' | 'archived';

@Schema({ timestamps: true })
export class Collection {
  @Prop({ required: true, trim: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, trim: true, unique: true, index: true })
  slug: string;

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft', index: true })
  status: CollectionStatus;

  @Prop({ default: '' })
  excerpt: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ default: '' })
  series: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date })
  publishedAt?: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
CollectionSchema.index({ name: 'text', excerpt: 'text', description: 'text' });
