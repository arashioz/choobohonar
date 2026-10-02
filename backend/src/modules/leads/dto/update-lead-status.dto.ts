import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  FOLLOW_UP_STATUSES,
  type FollowUpStatus,
} from '../../../common/follow-up-status';

export class UpdateLeadStatusDto {
  @IsIn([...FOLLOW_UP_STATUSES, 'read'])
  status: FollowUpStatus | 'read';

  @IsOptional()
  @IsString()
  adminNote?: string;
}
