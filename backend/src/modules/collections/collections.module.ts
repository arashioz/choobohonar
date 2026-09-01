import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CollectionsAdminController, CollectionsPublicController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Collection, CollectionSchema } from './schemas/collection.schema';
import { ShopProduct, ShopProductSchema } from '../shop/schemas/shop-product.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Collection.name, schema: CollectionSchema }, { name: ShopProduct.name, schema: ShopProductSchema }])],
  controllers: [CollectionsAdminController, CollectionsPublicController],
  providers: [CollectionsService, JwtAuthGuard],
  exports: [CollectionsService],
})
export class CollectionsModule {}
