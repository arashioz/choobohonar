import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateJobDto {
  @IsEnum(['blog', 'product'])
  type: 'blog' | 'product';

  @IsEnum(['fa', 'en'])
  language: 'fa' | 'en';

  @IsOptional()
  @IsEnum(['high', 'normal', 'low'])
  priority?: 'high' | 'normal' | 'low';

  // Blog fields
  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsArray()
  targetKeywords?: string[];

  // Product fields
  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsArray()
  materials?: string[];

  @IsOptional()
  @IsArray()
  features?: string[];
}
