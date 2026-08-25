import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

function emptyToUndefined(value: unknown) {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

class CreateOrderItemDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsString()
  @MinLength(1)
  slug: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNumber()
  @Min(1)
  qty: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;
}

class CreateOrderCustomerDto {
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
}

class CreateOrderShippingDto {
  @IsString()
  @MinLength(5)
  address: string;

  @IsString()
  @MinLength(2)
  city: string;

  @IsString()
  @MinLength(2)
  province: string;

  @IsOptional()
  @IsString()
  postalCode?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;

  @IsOptional()
  @IsString()
  mapNote?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ValidateNested()
  @Type(() => CreateOrderCustomerDto)
  customer: CreateOrderCustomerDto;

  @ValidateNested()
  @Type(() => CreateOrderShippingDto)
  shipping: CreateOrderShippingDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingFee?: number;
}

export class UpdateOrderStatusDto {
  @IsEnum([
    'pending',
    'confirmed',
    'paid',
    'preparing',
    'shipping',
    'delivered',
    'cancelled',
  ])
  status:
    | 'pending'
    | 'confirmed'
    | 'paid'
    | 'preparing'
    | 'shipping'
    | 'delivered'
    | 'cancelled';

  @IsOptional()
  @IsString()
  note?: string;
}

export class MockPayDto {
  @IsOptional()
  @IsEnum(['success', 'fail'])
  simulate?: 'success' | 'fail';
}
