import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CmsEntryDocument = HydratedDocument<CmsEntry>;
export type CmsEntryKind = 'product' | 'material' | 'project' | 'collection' | 'article' | 'page';
export type CmsEntryStatus = 'draft' | 'published' | 'archived';

@Schema({ timestamps: true, collection: 'cms_entries' })
export class CmsEntry {
  @Prop({ required: true, enum: ['product', 'material', 'project', 'collection', 'article', 'page'], index: true })
  kind: CmsEntryKind;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  slug: string;

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'draft', index: true })
  status: CmsEntryStatus;

  @Prop({ default: '' })
  excerpt: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object, default: {} })
  seo: Record<string, unknown>;

  @Prop({ type: Object, default: {} })
  data: Record<string, unknown>;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Date })
  publishedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const CmsEntrySchema = SchemaFactory.createForClass(CmsEntry);
CmsEntrySchema.index({ kind: 1, slug: 1 }, { unique: true });
CmsEntrySchema.index({ title: 'text', excerpt: 'text', description: 'text' });
