import { IsObject } from 'class-validator';

export class UpdateJobDto {
  @IsObject()
  result: Record<string, unknown>;
}
