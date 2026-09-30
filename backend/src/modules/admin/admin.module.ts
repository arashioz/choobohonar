import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [AdminController, FilesController],
  providers: [JwtAuthGuard, FilesService],
  exports: [FilesService],
})
export class AdminModule {}
