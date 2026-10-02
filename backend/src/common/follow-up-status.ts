import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/** Stable keys for a later SMS automation. Labels live with the admin UI. */
export const FOLLOW_UP_STATUSES = [
  'new',
  'reviewed',
  'contacted',
  'follow_up',
  'quoted',
  'final_payment',
  'settled',
  'lost',
  'archived',
] as const;

export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export function isFollowUpStatus(value: string): value is FollowUpStatus {
  return (FOLLOW_UP_STATUSES as readonly string[]).includes(value);
}

/** Older leads stored "read" for the reviewed stage. */
export function normalizeFollowUpStatus(value?: string | null): FollowUpStatus {
  if (value === 'read' || value === 'reviewed') return 'reviewed';
  if (value && isFollowUpStatus(value)) return value;
  return 'new';
}

@Schema({ _id: false })
export class FollowUpHistoryEntry {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ required: true })
  at: Date;

  @Prop({ default: 'admin' })
  by: string;
}

export const FollowUpHistorySchema =
  SchemaFactory.createForClass(FollowUpHistoryEntry);
