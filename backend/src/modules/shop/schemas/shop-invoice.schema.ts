import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShopInvoiceDocument = ShopInvoice & Document;

@Schema({ timestamps: true })
export class ShopInvoice {
  @Prop({ required: true, unique: true, index: true })
  invoiceNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'ShopOrder', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ default: () => new Date() })
  issuedAt: Date;

  @Prop({ enum: ['issued', 'void'], default: 'issued', index: true })
  status: 'issued' | 'void';

  @Prop({ type: Object, required: true })
  customer: {
    name: string;
    phone: string;
    email?: string;
  };

  @Prop({ type: Object, required: true })
  shipping: {
    address: string;
    city: string;
    province: string;
    postalCode?: string;
  };

  @Prop({ type: [Object], required: true })
  items: {
    slug: string;
    name: string;
    qty: number;
    unitPrice: number;
    lineTotal: number;
  }[];

  @Prop({ type: Object, required: true })
  amounts: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };

  @Prop()
  notes?: string;
}

export const ShopInvoiceSchema = SchemaFactory.createForClass(ShopInvoice);
