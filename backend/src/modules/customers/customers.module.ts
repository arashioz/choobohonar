import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomersController,
  PublicCustomersController,
} from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { ShopOrder, ShopOrderSchema } from '../shop/schemas/shop-order.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: ShopOrder.name, schema: ShopOrderSchema },
    ]),
  ],
  controllers: [CustomersController, PublicCustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
