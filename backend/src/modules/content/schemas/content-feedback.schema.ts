import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContentFeedbackDocument = ContentFeedback & Document;

@Schema({ timestamps: true })
export class ContentFeedback {
  @Prop({ type: Types.ObjectId, ref: 'ContentJob', required: true })
  jobId: Types.ObjectId;

  @Prop({ required: true, enum: ['approved', 'edited', 'rejected'] })
  action: 'approved' | 'edited' | 'rejected';

  @Prop({ type: [Object], default: [] })
  editDiff: { field: string; before: string; after: string }[];

  @Prop()
  rejectReason?: string;

  @Prop({ required: true, min: 0, max: 1 })
  qualityScore: number;
}

export const ContentFeedbackSchema = SchemaFactory.createForClass(ContentFeedback);
