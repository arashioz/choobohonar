import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerLoginCodeDocument = CustomerLoginCode & Document;

/**
 * A short-lived, hashed customer login code. The TTL index removes it after
 * expiry, so neither a usable code nor an unbounded login history is kept.
 */
@Schema({ timestamps: true })
export class CustomerLoginCode {
  @Prop({ required: true, index: true }) phone: string;
  @Prop({ required: true, select: false }) codeHash: string;
  @Prop({ required: true, index: true, expires: 0 }) expiresAt: Date;
  @Prop({ default: 0 }) attempts: number;
  @Prop({ default: 1 }) sendCount: number;
  @Prop({ required: true }) windowStartedAt: Date;
  @Prop({ required: true }) lastSentAt: Date;
}

export const CustomerLoginCodeSchema =
  SchemaFactory.createForClass(CustomerLoginCode);
CustomerLoginCodeSchema.index({ phone: 1 }, { unique: true });
