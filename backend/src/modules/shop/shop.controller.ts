import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
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
    @Query('slugs') slugs?: string,
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
      slugs,
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

  @Get('campaign-banners')
  campaignBanners() {
    return this.shopService.listCampaignBanners();
  }

  @Get('campaign-banners/:slug')
  campaignBanner(@Param('slug') slug: string) {
    return this.shopService.getCampaignBanner(decodeURIComponent(slug));
  }

  @Patch('campaign-banners/:slug')
  @UseGuards(JwtAuthGuard)
  updateCampaignBanner(
    @Param('slug') slug: string,
    @Body() body: { title?: string; subtitle?: string; image?: string },
  ) {
    return this.shopService.upsertCampaignBanner(decodeURIComponent(slug), body);
  }

  @Get('series')
  series() {
    return this.shopService.series();
  }

  @Get('materials')
  materials() {
    return this.shopService.listMaterialSwatches();
  }

  @Get('product-options')
  productOptions() {
    return this.shopService.productOptions();
  }

  @Post('categories/seed')
  @UseGuards(JwtAuthGuard)
  seedCategories(@Body() body: { replaceAll?: boolean }) {
    return this.shopService.seedCategoriesFromCatalog(Boolean(body?.replaceAll));
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
  seed(@Body() body: { force?: boolean; replaceAll?: boolean }) {
    return this.shopService.seedFromCatalog(
      Boolean(body?.force),
      Boolean(body?.replaceAll),
    );
  }

  @Post('products/import-price')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  importPrice(@UploadedFile() file: { buffer: Buffer; originalname: string }) {
    return this.shopService.importPriceFile(file);
  }

  @Post('products/import-catalog')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 100 * 1024 * 1024 } }))
  importCatalog(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
    @Body('replaceAll') replaceAll?: string | boolean,
  ) {
    return this.shopService.importCatalogFile(
      file,
      replaceAll === true || replaceAll === 'true',
    );
  }

  @Get('products/export-price')
  @UseGuards(JwtAuthGuard)
  async exportPrice(@Res() response: Response) {
    const file = await this.shopService.exportPriceFile();
    response
      .status(200)
      .set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="choobohonar-product-prices.xlsx"',
        'Cache-Control': 'no-store',
      })
      .send(file);
  }

  @Post('collections/seed')
  @UseGuards(JwtAuthGuard)
  seedCollections() {
    return this.shopService.seedCollectionsFromCatalog();
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

  @Patch('products/bulk-stock')
  @UseGuards(JwtAuthGuard)
  updateBulkStock(@Body() body: { ids?: string[]; inStock?: boolean }) {
    return this.shopService.updateBulkStock(
      Array.isArray(body?.ids) ? body.ids.map(String) : [],
      body?.inStock === true,
    );
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
    @Query('kind') kind?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.list({
      status,
      q,
      kind,
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
  async getOrderByNumber(@Param('orderNumber') orderNumber: string) {
    return this.orderService.presentOrder(
      await this.orderService.getByNumber(decodeURIComponent(orderNumber)),
    );
  }

  @Get('orders/:id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getPresented(id);
  }

  @Post('orders/:id/pay')
  mockPay(@Param('id') id: string, @Body() dto: MockPayDto) {
    return this.orderService.mockPay(id, dto || {});
  }

  @Patch('orders/:id/status')
  @UseGuards(JwtAuthGuard)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
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
    @Query('kind') kind?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orderService.listInvoices({
      q,
      kind,
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
