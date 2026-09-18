import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CustomersService } from './customers.service';
import { CustomerTier } from './schemas/customer.schema';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customers: CustomersService) {}
  @Get() list(@Query('q') q?: string, @Query('status') status?: string) {
    return this.customers.list(q, status);
  }
  @Get(':id/commerce') commerce(@Param('id') id: string) {
    return this.customers.commerce(id);
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.customers.get(id);
  }
  @Post() create(@Body() body: Record<string, unknown>) {
    return this.customers.create(body);
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.customers.update(id, body);
  }
  @Put(':id/tier') tier(
    @Param('id') id: string,
    @Body('tier') tier: string | null,
  ) {
    const tierVal = tier === '' || !tier ? null : (tier as CustomerTier);
    return this.customers.updateTier(id, tierVal);
  }
  @Post(':id/referral') referral(@Param('id') id: string) {
    return this.customers.generateReferralLink(id);
  }
  @Post(':id/notes') note(
    @Param('id') id: string,
    @Body() body: { text?: string },
  ) {
    return this.customers.addNote(id, body.text || '');
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.customers.remove(id);
  }
}

@Controller('public')
export class PublicCustomersController {
  constructor(private readonly customers: CustomersService) {}

  @Post('account/register')
  async register(
    @Body() body: Record<string, unknown>,
    @Res() response: Response,
  ) {
    const customer = await this.customers.registerAccount(body);
    return this.setSession(response, customer.id).status(201).json({ customer });
  }

  @Post('account/login')
  async login(
    @Body() body: { phone?: string; password?: string },
    @Res() response: Response,
  ) {
    const customer = await this.customers.authenticateAccount(
      body.phone || '',
      body.password || '',
    );
    return this.setSession(response, customer.id).json({ customer });
  }

  @Post('account/logout')
  logout(@Res() response: Response) {
    return response
      .clearCookie('customer_session', { path: '/' })
      .status(200)
      .json({ ok: true });
  }

  @Post('account/dev-login')
  async devLogin(@Res() response: Response) {
    if (!this.customers.isLocalRuntime()) {
      throw new UnauthorizedException('ورود آزمایشی فقط در محیط محلی فعال است');
    }
    const customer = await this.customers.ensureLocalTestAccount();
    return this.setSession(response, customer.id).json({ customer });
  }

  @Post('account/gallery-taste')
  upsertGalleryTaste(@Body() body: Record<string, unknown>) {
    return this.customers.upsertGalleryTaste(body);
  }

  @Get('account/me')
  me(@Req() request: Request) {
    return this.customers.accountProfile(this.sessionCustomerId(request));
  }

  @Patch('account/me')
  updateMe(@Req() request: Request, @Body() body: Record<string, unknown>) {
    return this.customers.updateAccount(this.sessionCustomerId(request), body);
  }

  @Get('customers/referral/:slug') byReferral(@Param('slug') slug: string) {
    return this.customers.getCustomerByReferral(slug);
  }

  private setSession(response: Response, customerId: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret)
      throw new InternalServerErrorException('تنظیمات ورود کاربر کامل نیست');
    const token = jwt.sign({ sub: customerId, role: 'customer' }, secret, {
      expiresIn: '30d',
    });
    return response.cookie('customer_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.FORCE_HTTPS === 'true',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  private sessionCustomerId(request: Request) {
    const rawCookie = request.headers.cookie || '';
    const token = rawCookie
      .split(';')
      .map((item) => item.trim().split('='))
      .find(([name]) => name === 'customer_session')?.[1];
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) throw new UnauthorizedException('ابتدا وارد حساب کاربری شوید');
    try {
      const payload = jwt.verify(token, secret);
      if (
        typeof payload !== 'object' ||
        !payload ||
        payload.role !== 'customer' ||
        !payload.sub
      )
        throw new Error('invalid customer session');
      return String(payload.sub);
    } catch {
      throw new UnauthorizedException('نشست حساب کاربری منقضی شده است');
    }
  }
}
