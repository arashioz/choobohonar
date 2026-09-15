import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { ProductRoom } from './shop-product.schema';

export type ShopCategoryDocument = ShopCategory & Document;

/** WordPress category tree, kept separately from the product documents. */
@Schema({ timestamps: true })
export class ShopCategory {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ default: '' })
  parentSlug: string;

  @Prop({ required: true, enum: ['living', 'bedroom', 'bedding', 'dining', 'decor', 'carpet', 'lighting', 'dishes'] })
  room: ProductRoom;

  @Prop({ default: 0 })
  productCount: number;

  @Prop({ default: 0 })
  depth: number;

  @Prop({ default: 0 })
  sortOrder: number;

  @Prop({ default: 'wordpress-csv-2026-09-15', index: true })
  source: string;
}

export const ShopCategorySchema = SchemaFactory.createForClass(ShopCategory);
