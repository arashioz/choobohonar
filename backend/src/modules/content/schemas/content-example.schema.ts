import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContentExampleDocument = ContentExample & Document;

@Schema({ timestamps: true })
export class ContentExample {
  @Prop({ required: true, enum: ['blog', 'product'] })
  type: string;

  @Prop({ required: true, enum: ['fa', 'en'] })
  language: string;

  @Prop({ type: Object, required: true })
  input: object;

  @Prop({ type: Object, required: true })
  output: object;

  @Prop({ type: [Number], default: [] })
  embedding: number[];

  @Prop({ required: true, min: 0, max: 1 })
  qualityScore: number;

  @Prop({ default: 0 })
  useCount: number;
}

export const ContentExampleSchema = SchemaFactory.createForClass(ContentExample);
