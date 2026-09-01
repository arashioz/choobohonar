import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CustomersService } from './customers.service';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}
  @Get() list(@Query('q') q?: string, @Query('status') status?: string) { return this.customers.list(q, status); }
  @Get(':id') get(@Param('id') id: string) { return this.customers.get(id); }
  @Post() create(@Body() body: Record<string, unknown>) { return this.customers.create(body); }
  @Patch(':id') update(@Param('id') id: string, @Body() body: Record<string, unknown>) { return this.customers.update(id, body); }
  @Put(':id/tier') tier(@Param('id') id: string, @Body('tier') tier: string | null) { return this.customers.updateTier(id, tier === '' ? null : tier); }
  @Post(':id/referral') referral(@Param('id') id: string) { return this.customers.generateReferralLink(id); }
  @Post(':id/notes') note(@Param('id') id: string, @Body() body: { text?: string }) { return this.customers.addNote(id, body.text || ''); }
  @Delete(':id') remove(@Param('id') id: string) { return this.customers.remove(id); }
}

@Controller('public')
export class PublicCustomersController {
  constructor(private readonly customers: CustomersService) {}
  @Get('customers/referral/:slug') byReferral(@Param('slug') slug: string) { return this.customers.getCustomerByReferral(slug); }
}
