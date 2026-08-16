import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsEnum(['new', 'read', 'archived'])
  status: 'new' | 'read' | 'archived';

  @IsOptional()
  @IsString()
  adminNote?: string;
}
