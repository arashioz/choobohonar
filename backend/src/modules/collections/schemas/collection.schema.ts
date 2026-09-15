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

  @Prop({
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  })
  status: CollectionStatus;

  @Prop({ default: '' })
  excerpt: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  image: string;

  // `product` keeps the cover tied to the first published product in the
  // series. An admin can explicitly switch to `custom` after selecting or
  // uploading an image in the collection editor.
  @Prop({ enum: ['product', 'custom'], default: 'product' })
  coverMode: 'product' | 'custom';

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop({ default: '' })
  series: string;

  // System-generated collection rows are reconciled by the catalog sync.
  // Admin-created rows remain untouched by that process.
  @Prop({ default: 'admin', index: true })
  source: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date })
  publishedAt?: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
CollectionSchema.index({ name: 'text', excerpt: 'text', description: 'text' });
