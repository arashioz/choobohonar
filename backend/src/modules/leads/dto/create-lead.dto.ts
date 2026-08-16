import {
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

function emptyToUndefined(value: unknown) {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

export class CreateLeadDto {
  @IsEnum(['contact', 'consultation', 'cooperation', 'representation'])
  type: 'contact' | 'consultation' | 'cooperation' | 'representation';

  @IsOptional()
  @IsString()
  source?: string;

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

  @IsObject()
  data: Record<string, unknown>;
}
