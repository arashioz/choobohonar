import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LeadDocument = Lead & Document;

export type LeadType =
  | 'contact'
  | 'consultation'
  | 'cooperation'
  | 'representation';

export type LeadStatus = 'new' | 'read' | 'archived';

@Schema({ timestamps: true })
export class Lead {
  @Prop({
    required: true,
    enum: ['contact', 'consultation', 'cooperation', 'representation'],
  })
  type: LeadType;

  /** صفحه یا بخش مبدأ — مثلاً homepage، contact، consultation */
  @Prop()
  source?: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  email?: string;

  /** همه فیلدهای فرم به‌صورت خام برای نمایش در پنل */
  @Prop({ type: Object, required: true, default: {} })
  data: Record<string, unknown>;

  @Prop({
    enum: ['new', 'read', 'archived'],
    default: 'new',
  })
  status: LeadStatus;

  @Prop()
  adminNote?: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.index({ type: 1, status: 1, createdAt: -1 });
LeadSchema.index({ phone: 1 });
