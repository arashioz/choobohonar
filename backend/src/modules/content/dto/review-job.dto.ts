import { IsEnum, IsOptional, IsString, IsObject } from 'class-validator';

export class ReviewJobDto {
  @IsEnum(['approved', 'rejected', 'edited'])
  action: 'approved' | 'rejected' | 'edited';

  @IsOptional()
  @IsString()
  reason?: string;

  /** Nested ContentJobResult fields from the admin editor */
  @IsOptional()
  @IsObject()
  changes?: Record<string, unknown>;
}
