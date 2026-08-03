import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CmsAdminController, CmsPublicController } from './cms.controller';
import { CmsService } from './cms.service';
import { CmsEntry, CmsEntrySchema } from './schemas/cms-entry.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CmsEntry.name, schema: CmsEntrySchema }])],
  controllers: [CmsAdminController, CmsPublicController],
  providers: [CmsService, JwtAuthGuard],
  exports: [CmsService],
})
export class CmsModule {}
