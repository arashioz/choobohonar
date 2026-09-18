import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { OrderService } from './order.service';
import { ShopProduct, ShopProductSchema } from './schemas/shop-product.schema';
import { ShopOrder, ShopOrderSchema } from './schemas/shop-order.schema';
import { ShopInvoice, ShopInvoiceSchema } from './schemas/shop-invoice.schema';
import { ShopCategory, ShopCategorySchema } from './schemas/shop-category.schema';
import {
  ShopCampaignBanner,
  ShopCampaignBannerSchema,
} from './schemas/shop-campaign-banner.schema';
import { CmsEntry, CmsEntrySchema } from '../cms/schemas/cms-entry.schema';
import {
  Collection,
  CollectionSchema,
} from '../collections/schemas/collection.schema';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    forwardRef(() => CustomersModule),
    MongooseModule.forFeature([
      { name: ShopProduct.name, schema: ShopProductSchema },
      { name: ShopOrder.name, schema: ShopOrderSchema },
      { name: ShopInvoice.name, schema: ShopInvoiceSchema },
      { name: ShopCategory.name, schema: ShopCategorySchema },
      { name: ShopCampaignBanner.name, schema: ShopCampaignBannerSchema },
      { name: CmsEntry.name, schema: CmsEntrySchema },
      { name: Collection.name, schema: CollectionSchema },
    ]),
  ],
  controllers: [ShopController],
  providers: [ShopService, OrderService],
  exports: [ShopService, OrderService],
})
export class ShopModule {}
