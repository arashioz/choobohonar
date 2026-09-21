import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CustomersController,
  PublicCustomersController,
} from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import {
  CustomerLoginCode,
  CustomerLoginCodeSchema,
} from './schemas/customer-login-code.schema';
import { ShopOrder, ShopOrderSchema } from '../shop/schemas/shop-order.schema';
import { ParsgreenSmsService } from './parsgreen-sms.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerLoginCode.name, schema: CustomerLoginCodeSchema },
      { name: ShopOrder.name, schema: ShopOrderSchema },
    ]),
  ],
  controllers: [CustomersController, PublicCustomersController],
  providers: [CustomersService, ParsgreenSmsService],
  exports: [CustomersService],
})
export class CustomersModule {}
