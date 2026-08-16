import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

function emptyToUndefined(value: unknown) {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

export class CreateInteriorBriefDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  styles: string[];

  @IsOptional()
  @IsString()
  moodboardRound1?: string;

  @IsOptional()
  @IsString()
  moodboardRound2?: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsString()
  @MinLength(1)
  area: string;

  @IsString()
  @MinLength(1)
  spaceType: string;

  @IsOptional()
  @IsString()
  roomCount?: string;

  @IsOptional()
  @IsString()
  budget?: string;

  @IsOptional()
  @IsString()
  timeline?: string;

  @IsString()
  @MinLength(1)
  consultation: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(7)
  phone: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
