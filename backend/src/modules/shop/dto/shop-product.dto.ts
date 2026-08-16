import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class SpecDto {
  @IsString()
  label: string;

  @IsString()
  value: string;
}

class HighlightDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

class DimensionsDto {
  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  depth?: number;

  @IsOptional()
  @IsNumber()
  height?: number;
}

const ROOMS = [
  'living',
  'bedroom',
  'bedding',
  'dining',
  'decor',
  'carpet',
  'lighting',
  'dishes',
] as const;

export class CreateShopProductDto {
  @IsString()
  @MinLength(1)
  slug: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  category: string;

  @IsEnum(ROOMS)
  room: (typeof ROOMS)[number];

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsString()
  shopUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  finishes?: string[];

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  suggested?: boolean;

  @IsOptional()
  @IsString()
  suggestionNote?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  stockQty?: number;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecDto)
  specs?: SpecDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighlightDto)
  highlights?: HighlightDto[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateShopProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  slug?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(ROOMS)
  room?: (typeof ROOMS)[number];

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  longDescription?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @IsString()
  shopUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  finishes?: string[];

  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  suggested?: boolean;

  @IsOptional()
  @IsString()
  suggestionNote?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  compareAtPrice?: number;

  @IsOptional()
  @IsNumber()
  stockQty?: number;

  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions?: DimensionsDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpecDto)
  specs?: SpecDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighlightDto)
  highlights?: HighlightDto[];

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}
