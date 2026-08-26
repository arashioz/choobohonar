import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MagazineSource = 'static' | 'cms' | 'both';

export type SiteSettingsDocument = SiteSettings & Document;

@Schema({ timestamps: true })
export class SiteSettings {
  @Prop({ required: true, unique: true, default: 'main' })
  key: string;

  @Prop({ default: '' })
  googleSearchConsoleVerification: string;

  @Prop({ default: '' })
  googleAnalyticsMeasurementId: string;

  @Prop({ enum: ['static', 'cms', 'both'], default: 'both' })
  magazineSource: MagazineSource;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
