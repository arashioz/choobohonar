import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { OrderService } from './order.service';
import {
  CreateShopProductDto,
  UpdateShopProductDto,
} from './dto/shop-product.dto';
import {
  CreateOrderDto,
  MockPayDto,
  UpdateOrderStatusDto,
} from './dto/shop-order.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly orderService: OrderService,
  ) {}

  @Get('products')
  list(
    @Query('q') q?: string,
    @Query('room') room?: string,
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('featured') featured?: string,
    @Query('suggested') suggested?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.shopService.list({
      q,
      room,
      category,
      status,
      featured,
      suggested,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('products/slug/:slug')
  getBySlug(@Param('slug') slug: string) {
    return this.shopService.getBySlug(decodeURIComponent(slug));
  }

  @Get('categories')
  categories() {
    return this.shopService.categories();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  stats() {
    return this.shopService.stats();
  }

  @Get('suggestions')
  @UseGuards(JwtAuthGuard)
  suggestions() {
    return this.shopService.suggestions();
  }

  @Post('products/seed')
  @UseGuards(JwtAuthGuard)
  seed(@Body() body: { force?: boolean }) {
    return this.shopService.seedFromCatalog(Boolean(body?.force));
  }

  @Get('products/:id')
  get(@Param('id') id: string) {
    return this.shopService.get(id);
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateShopProductDto) {
    return this.shopService.create(dto);
  }

  @Patch('products/:id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdateShopProductDto) {
    return this.shopService.update(id, dto);
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.shopService.remove(id);
  }

  /* ── Orders ─────────────────────────────────────────────── */

  @Post('orders')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  listOrders(
    @Query('status') status?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.list({
      status,
      q,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('orders/stats')
  @UseGuards(JwtAuthGuard)
  orderStats() {
    return this.orderService.stats();
  }

  @Get('orders/by-number/:orderNumber')
  getOrderByNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.getByNumber(decodeURIComponent(orderNumber));
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.orderService.get(id);
  }

  @Post('orders/:id/pay')
  mockPay(@Param('id') id: string, @Body() dto: MockPayDto) {
    return this.orderService.mockPay(id, dto || {});
  }

  @Patch('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto);
  }

  @Post('orders/:id/invoice')
  @UseGuards(JwtAuthGuard)
  issueInvoice(@Param('id') id: string) {
    return this.orderService.issueInvoice(id);
  }

  /* ── Invoices ───────────────────────────────────────────── */

  @Get('invoices')
  @UseGuards(JwtAuthGuard)
  listInvoices(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.listInvoices({
      q,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('invoices/:id')
  @UseGuards(JwtAuthGuard)
  getInvoice(@Param('id') id: string) {
    return this.orderService.getInvoice(id);
  }
}
