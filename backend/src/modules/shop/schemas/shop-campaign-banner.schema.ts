import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopCampaignBannerDocument = ShopCampaignBanner & Document;

export { STOREFRONT_CAMPAIGN_SLOTS } from '../campaign-banner';

@Schema({ timestamps: true })
export class ShopCampaignBanner {
  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ required: true })
  label: string;

  @Prop({ default: '' })
  title: string;

  @Prop({ default: '' })
  subtitle: string;

  @Prop({ default: '' })
  image: string;

  /** Photo on the products-page category card. Independent of the page hero and the in-grid banner. */
  @Prop({ default: '' })
  cardImage: string;

  /** Full-bleed photo at the top of the category page. */
  @Prop({ default: '' })
  heroImage: string;

  @Prop({ default: '' })
  heroEyebrow: string;

  @Prop({ default: '' })
  heroTitle: string;

  @Prop({ default: '' })
  heroText: string;
}

export const ShopCampaignBannerSchema =
  SchemaFactory.createForClass(ShopCampaignBanner);
