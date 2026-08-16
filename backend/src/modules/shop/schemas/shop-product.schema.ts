import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopProductDocument = ShopProduct & Document;

export type ProductRoom =
  | 'living'
  | 'bedroom'
  | 'bedding'
  | 'dining'
  | 'decor'
  | 'carpet'
  | 'lighting'
  | 'dishes';

export type ProductStatus = 'draft' | 'published' | 'archived';

@Schema({ timestamps: true })
export class ShopProduct {
  @Prop({ required: true, unique: true, trim: true, index: true })
  slug: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({
    required: true,
    enum: ['living', 'bedroom', 'bedding', 'dining', 'decor', 'carpet', 'lighting', 'dishes'],
    index: true,
  })
  room: ProductRoom;

  @Prop({ default: '' })
  shortDescription: string;

  @Prop({ default: '' })
  longDescription: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  gallery: string[];

  @Prop()
  shopUrl?: string;

  @Prop({ type: [String], default: [] })
  finishes: string[];

  @Prop({ enum: ['draft', 'published', 'archived'], default: 'published', index: true })
  status: ProductStatus;

  /** محصولات منتخب / ویترینی */
  @Prop({ default: false, index: true })
  featured: boolean;

  /** پیشنهاد فروشگاهی برای برجسته‌کردن در پنل */
  @Prop({ default: false, index: true })
  suggested: boolean;

  @Prop()
  suggestionNote?: string;

  @Prop()
  series?: string;

  @Prop({ type: Number })
  price?: number;

  @Prop({ type: Number })
  compareAtPrice?: number;

  @Prop({ type: Number, default: 0 })
  stockQty: number;

  @Prop({ default: false })
  trackInventory: boolean;

  @Prop({ type: Object })
  dimensions?: { width?: number; depth?: number; height?: number };

  @Prop({ type: [{ label: String, value: String }], default: [] })
  specs: { label: string; value: string }[];

  @Prop({ type: [{ title: String, description: String }], default: [] })
  highlights: { title: string; description: string }[];

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: 'catalog' })
  source: string;
}

export const ShopProductSchema = SchemaFactory.createForClass(ShopProduct);

ShopProductSchema.index({ name: 'text', category: 'text', shortDescription: 'text' });
