import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { OrderService } from './order.service';
import { ShopProduct, ShopProductSchema } from './schemas/shop-product.schema';
import { ShopOrder, ShopOrderSchema } from './schemas/shop-order.schema';
import { ShopInvoice, ShopInvoiceSchema } from './schemas/shop-invoice.schema';
import { CmsEntry, CmsEntrySchema } from '../cms/schemas/cms-entry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopProduct.name, schema: ShopProductSchema },
      { name: ShopOrder.name, schema: ShopOrderSchema },
      { name: ShopInvoice.name, schema: ShopInvoiceSchema },
      { name: CmsEntry.name, schema: CmsEntrySchema },
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService, OrderService],
  exports: [ShopService, OrderService],
})
export class ShopModule {}
