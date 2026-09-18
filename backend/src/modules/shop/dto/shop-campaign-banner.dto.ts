import { IsOptional, IsString } from 'class-validator';

export class UpdateCampaignBannerDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
