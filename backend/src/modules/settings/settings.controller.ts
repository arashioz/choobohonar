import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MagazineSource, SiteSettings, SiteSettingsDocument } from './schemas/site-settings.schema';

type SettingsInput = { googleSearchConsoleVerification?: string; googleAnalyticsMeasurementId?: string; magazineSource?: MagazineSource };

@Controller('settings')
export class SettingsController {
  constructor(@InjectModel(SiteSettings.name) private readonly settings: Model<SiteSettingsDocument>) {}

  @Get('public')
  async publicSettings() {
    const item = await this.getOrCreate();
    return { googleSearchConsoleVerification: item.googleSearchConsoleVerification, magazineSource: item.magazineSource || 'both' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get() {
    return this.getOrCreate();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async update(@Body() input: SettingsInput) {
    const update: SettingsInput = {};
    if (input.googleSearchConsoleVerification !== undefined) update.googleSearchConsoleVerification = cleanVerification(input.googleSearchConsoleVerification);
    if (input.googleAnalyticsMeasurementId !== undefined) update.googleAnalyticsMeasurementId = String(input.googleAnalyticsMeasurementId).trim();
    if (input.magazineSource !== undefined && isMagazineSource(input.magazineSource)) update.magazineSource = input.magazineSource;
    return this.settings.findOneAndUpdate({ key: 'main' }, { $set: update, $setOnInsert: { key: 'main' } }, { new: true, upsert: true }).lean().exec();
  }

  private async getOrCreate() {
    return this.settings.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { new: true, upsert: true }).lean().exec();
  }
}

function cleanVerification(value: unknown) {
  const raw = String(value || '').trim();
  const match = raw.match(/content=["']([^"']+)["']/i);
  return (match?.[1] || raw).replace(/^google-site-verification=/i, '').trim();
}

function isMagazineSource(value: unknown): value is MagazineSource {
  return value === 'static' || value === 'cms' || value === 'both';
}
