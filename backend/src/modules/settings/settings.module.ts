import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller';
import { SiteSettings, SiteSettingsSchema } from './schemas/site-settings.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: SiteSettings.name, schema: SiteSettingsSchema }])],
  controllers: [SettingsController],
})
export class SettingsModule {}
