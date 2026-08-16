import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InteriorBriefDocument = InteriorBrief & Document;

export type InteriorBriefStatus = 'new' | 'read' | 'archived';

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
    enum: ['new', 'read', 'archived'],
    default: 'new',
  })
  status: InteriorBriefStatus;

  @Prop()
  adminNote?: string;
}

export const InteriorBriefSchema = SchemaFactory.createForClass(InteriorBrief);

InteriorBriefSchema.index({ status: 1, createdAt: -1 });
InteriorBriefSchema.index({ phone: 1 });
