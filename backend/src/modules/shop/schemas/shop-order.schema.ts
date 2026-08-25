import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShopOrderDocument = ShopOrder & Document;

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'paid'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'ShopProduct' })
  productId?: Types.ObjectId;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  image: string;

  @Prop({ required: true, min: 1 })
  qty: number;

  @Prop({ required: true, min: 0 })
  unitPrice: number;
}

@Schema({ _id: false })
export class OrderCustomer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;
}

@Schema({ _id: false })
export class OrderShipping {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop()
  postalCode?: string;

  @Prop()
  lat?: number;

  @Prop()
  lng?: number;

  @Prop()
  mapNote?: string;
}

@Schema({ _id: false })
export class OrderPayment {
  @Prop({ default: 'mock' })
  method: string;

  @Prop({ enum: ['pending', 'paid', 'failed'], default: 'pending' })
  status: PaymentStatus;

  @Prop()
  paidAt?: Date;

  @Prop()
  mockRef?: string;
}

@Schema({ _id: false })
export class StatusHistoryEntry {
  @Prop({ required: true })
  from: string;

  @Prop({ required: true })
  to: string;

  @Prop({ default: () => new Date() })
  at: Date;

  @Prop()
  note?: string;

  @Prop({ default: 'system' })
  by: string;
}

@Schema({ timestamps: true })
export class ShopOrder {
  @Prop({ required: true, unique: true, index: true })
  orderNumber: string;

  @Prop({
    enum: [
      'pending',
      'confirmed',
      'paid',
      'preparing',
      'shipping',
      'delivered',
      'cancelled',
    ],
    default: 'pending',
    index: true,
  })
  status: OrderStatus;

  @Prop({ type: [StatusHistoryEntry], default: [] })
  statusHistory: StatusHistoryEntry[];

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ type: OrderCustomer, required: true })
  customer: OrderCustomer;

  @Prop({ type: OrderShipping, required: true })
  shipping: OrderShipping;

  @Prop({ type: OrderPayment, default: () => ({ method: 'mock', status: 'pending' }) })
  payment: OrderPayment;

  @Prop({ type: Object, required: true })
  amounts: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };

  @Prop({ type: Types.ObjectId, ref: 'ShopInvoice' })
  invoiceId?: Types.ObjectId;

  @Prop()
  adminNote?: string;
}

export const ShopOrderSchema = SchemaFactory.createForClass(ShopOrder);
ShopOrderSchema.index({ 'customer.phone': 1, createdAt: -1 });
ShopOrderSchema.index({ status: 1, createdAt: -1 });
