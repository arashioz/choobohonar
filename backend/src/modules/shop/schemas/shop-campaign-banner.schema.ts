import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopCampaignBannerDocument = ShopCampaignBanner & Document;

export const STOREFRONT_CAMPAIGN_SLOTS = [
  {
    slug: 'livingroom',
    label: 'نشیمن',
    title: 'نشیمن',
    subtitle: 'کاناپه، مبل تک‌نفره و میزهایی برای مکث و گفتگو در مرکز خانه.',
    image:
      'https://choobohonar.com/wp-content/uploads/2026/01/مبل-چدار-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'bedroom',
    label: 'اتاق خواب',
    title: 'اتاق خواب',
    subtitle: 'تخت، پاتختی و دراور با بافت چوب؛ فضا برای استراحت و خلوت.',
    image:
      'https://choobohonar.com/wp-content/uploads/2023/07/تخت-خواب-آکومه-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'diningroom',
    label: 'غذاخوری',
    title: 'غذاخوری',
    subtitle: 'میز و صندلی برای دورهمی؛ تناسب مقیاس با فضا و نور.',
    image:
      'https://choobohonar.com/wp-content/uploads/2025/11/میز-غذاخوی-سولو-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'bedding',
    label: 'کالای خواب',
    title: 'کالای خواب',
    subtitle: 'روتختی، ملحفه و لایه‌های نرم برای پایان روز.',
    image:
      'https://choobohonar.com/wp-content/uploads/2026/02/سرویس-روتختی-گلدن-رودز-53-خانه-چوب-و-هنر-1.jpg',
  },
  {
    slug: 'carpet',
    label: 'فرش و گلیم',
    title: 'فرش و گلیم',
    subtitle: 'سطح فضا را کامل می‌کند؛ رنگ و بافت زیر پای نشیمن و غذاخوری.',
    image: 'https://choobohonar.com/wp-content/uploads/2025/07/فرش-زاب-کرم-1.jpg',
  },
  {
    slug: 'lighting',
    label: 'روشنایی',
    title: 'روشنایی',
    subtitle: 'آباژور، آویز و لوستر؛ نور، بافت چوب و پارچه را زنده می‌کند.',
    image: 'https://choobohonar.com/wp-content/uploads/2026/07/آباژور-گالن-1.jpg',
  },
  {
    slug: 'decor',
    label: 'دکور',
    title: 'دکور',
    subtitle: 'آینه، گلدان و جزئیاتی که فضا را شخصی می‌کند.',
    image:
      'https://choobohonar.com/wp-content/uploads/2023/05/دراور-آلدر-خانه-چوب-و-هنر-2.jpg',
  },
] as const;

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
}

export const ShopCampaignBannerSchema =
  SchemaFactory.createForClass(ShopCampaignBanner);
