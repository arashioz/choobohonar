import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;
export type CustomerStatus = 'lead' | 'active' | 'vip' | 'inactive';

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true, index: true }) name: string;
  @Prop({ required: true, trim: true, index: true }) phone: string;
  @Prop({ trim: true, lowercase: true }) email?: string;
  @Prop({ default: '' }) city: string;
  @Prop({ enum: ['lead', 'active', 'vip', 'inactive'], default: 'lead', index: true }) status: CustomerStatus;
  @Prop({ type: [String], default: [] }) tags: string[];
  @Prop({ default: '' }) source: string;
  @Prop({ default: '' }) note: string;
  @Prop({ type: [{ at: Date, text: String }], default: [] }) notes: { at: Date; text: string }[];
}
export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ name: 'text', phone: 'text', email: 'text', city: 'text' });
