import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MagazineSource = 'static' | 'cms' | 'both';
export type SmsPanelProvider = 'kavenegar' | 'twilio' | 'smsir' | 'daaghoadaman' | 'mobilepayment' | 'none';

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

  @Prop({ default: '' })
  siteDomain: string;

  @Prop({ enum: ['kavenegar', 'twilio', 'smsir', 'daaghoadaman', 'mobilepayment', 'none'], default: 'none' })
  smsProvider: SmsPanelProvider;

  @Prop({ default: '' })
  smsApiKey: string;

  @Prop({ default: '' })
  smsApiSecret: string;

  @Prop({ default: '' })
  smsFromNumber: string;

  @Prop({ default: false })
  smsEnabled: boolean;

  @Prop({ default: false })
  landingEnabled: boolean;

  @Prop({ default: '/landing' })
  landingPath: string;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
