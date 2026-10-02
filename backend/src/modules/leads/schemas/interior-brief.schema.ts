import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  FOLLOW_UP_STATUSES,
  FollowUpHistoryEntry,
  FollowUpHistorySchema,
  type FollowUpStatus,
} from '../../../common/follow-up-status';

export type InteriorBriefDocument = InteriorBrief & Document;

export type InteriorBriefStatus = FollowUpStatus | 'read';

@Schema({ timestamps: true })
export class InteriorBrief {
  @Prop({ type: [String], required: true })
  styles: string[];

  @Prop()
  moodboardRound1?: string;

  @Prop()
  moodboardRound2?: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, trim: true })
  area: string;

  @Prop({ required: true })
  spaceType: string;

  @Prop({ default: '' })
  roomCount: string;

  @Prop({ default: '' })
  budget: string;

  @Prop({ default: '' })
  timeline: string;

  @Prop({ required: true })
  consultation: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  email?: string;

  @Prop()
  notes?: string;

  @Prop({
    enum: [...FOLLOW_UP_STATUSES, 'read'],
    default: 'new',
  })
  status: InteriorBriefStatus;

  @Prop({ type: [FollowUpHistorySchema], default: [] })
  followUpHistory: FollowUpHistoryEntry[];

  @Prop()
  adminNote?: string;
}

export const InteriorBriefSchema = SchemaFactory.createForClass(InteriorBrief);

InteriorBriefSchema.index({ status: 1, createdAt: -1 });
InteriorBriefSchema.index({ phone: 1 });
