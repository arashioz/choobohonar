import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  FOLLOW_UP_STATUSES,
  FollowUpHistoryEntry,
  FollowUpHistorySchema,
  type FollowUpStatus,
} from '../../../common/follow-up-status';

export type LeadDocument = Lead & Document;

export type LeadType =
  | 'contact'
  | 'consultation'
  | 'cooperation'
  | 'representation';

export type LeadStatus = FollowUpStatus | 'read';

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
    enum: [...FOLLOW_UP_STATUSES, 'read'],
    default: 'new',
  })
  status: LeadStatus;

  @Prop({ type: [FollowUpHistorySchema], default: [] })
  followUpHistory: FollowUpHistoryEntry[];

  @Prop()
  adminNote?: string;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);

LeadSchema.index({ type: 1, status: 1, createdAt: -1 });
LeadSchema.index({ phone: 1 });
