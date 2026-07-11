import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';

export class ReviewJobDto {
  @IsEnum(['approved', 'rejected', 'edited'])
  action: 'approved' | 'rejected' | 'edited';

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsObject()
  changes?: Record<string, string>;
}
