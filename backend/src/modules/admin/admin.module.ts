import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Module({
  controllers: [AdminController],
  providers: [JwtAuthGuard],
})
export class AdminModule {}
