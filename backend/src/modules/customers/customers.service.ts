import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
  CustomerStatus,
  CustomerTier,
} from './schemas/customer.schema';
import { ShopOrder, ShopOrderDocument } from '../shop/schemas/shop-order.schema';

const statuses: CustomerStatus[] = ['lead', 'active', 'inactive'];
const tiers: CustomerTier[] = ['vip', 'silver', 'gold'];

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly model: Model<CustomerDocument>,
    @InjectModel(ShopOrder.name)
    private readonly orderModel: Model<ShopOrderDocument>,
  ) {}

  async registerAccount(input: Record<string, unknown>) {
    const name = String(input.name || '').trim();
    const phone = this.normalizePhone(String(input.phone || ''));
    const email = String(input.email || '').trim().toLowerCase();
    const city = String(input.city || '').trim();
    const password = String(input.password || '');
    if (name.length < 2 || phone.length < 10)
      throw new BadRequestException('نام و شماره موبایل معتبر الزامی است');
    if (password.length < 8)
      throw new BadRequestException('رمز عبور باید حداقل ۸ کاراکتر باشد');

    const existing = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .select('+passwordHash')
      .exec();
    if (existing?.passwordHash)
      throw new BadRequestException('برای این شماره حساب کاربری وجود دارد؛ وارد شوید');

    const passwordHash = this.hashPassword(password);
    const customer = existing
      ? await this.model.findByIdAndUpdate(
          existing._id,
          {
            $set: {
              name,
              phone,
              ...(email ? { email } : {}),
              ...(city ? { city } : {}),
              passwordHash,
              status: 'active',
            },
          },
          { new: true },
        )
      : await this.model.create({
          name,
          phone,
          ...(email ? { email } : {}),
          ...(city ? { city } : {}),
          passwordHash,
          status: 'active',
          source: 'website-account',
        });
    if (!customer) throw new NotFoundException('ساخت حساب کاربری انجام نشد');
    return this.publicCustomer(customer);
  }

  async authenticateAccount(phoneValue: string, password: string) {
    const phone = this.normalizePhone(phoneValue);
    const customer = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .select('+passwordHash')
      .exec();
    if (!customer?.passwordHash || !this.verifyPassword(password, customer.passwordHash))
      throw new BadRequestException('شماره موبایل یا رمز عبور نادرست است');
    return this.publicCustomer(customer);
  }

  async accountProfile(id: string) {
    const customer = await this.model.findById(id).lean().exec();
    if (!customer) throw new NotFoundException('حساب کاربری پیدا نشد');
    const phonePattern = this.phonePattern(customer.phone);
    const orders = await this.orderModel
      .find({ 'customer.phone': { $regex: phonePattern } })
      .sort({ createdAt: -1 })
      .select('orderNumber status items amounts payment createdAt')
      .lean()
      .exec();
    return { customer: this.publicCustomer(customer), orders };
  }

  async updateAccount(id: string, input: Record<string, unknown>) {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) {
      const name = String(input.name || '').trim();
      if (name.length < 2) throw new BadRequestException('نام معتبر وارد کنید');
      patch.name = name;
    }
    if (input.email !== undefined) patch.email = String(input.email || '').trim().toLowerCase();
    if (input.city !== undefined) patch.city = String(input.city || '').trim();
    const customer = await this.model
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!customer) throw new NotFoundException('حساب کاربری پیدا نشد');
    return this.publicCustomer(customer);
  }

  async list(q?: string, status?: string) {
    const filter: Record<string, unknown> = {};
    if (status && statuses.includes(status as CustomerStatus))
      filter.status = status;
    if (q?.trim())
      filter.$or = ['name', 'phone', 'email', 'city'].map((field) => ({
        [field]: { $regex: q.trim(), $options: 'i' },
      }));
    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ updatedAt: -1 }).limit(250).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async get(id: string) {
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async create(input: Record<string, unknown>) {
    const data = this.clean(input, true);
    if (!data['referralSlug']) {
      data['referralSlug'] = this.generateReferralSlug(String(data['name']));
    }
    return this.model.create(data);
  }

  async update(id: string, input: Record<string, unknown>) {
    const item = await this.model
      .findByIdAndUpdate(
        id,
        { $set: this.clean(input, false) },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async updateTier(id: string, tier: CustomerTier | null) {
    if (tier !== null && !tiers.includes(tier)) {
      throw new BadRequestException(
        'تعیین دسته‌بندی معتبر نیست. مقادیر مجاز: vip, silver, gold',
      );
    }
    const item = await this.model
      .findByIdAndUpdate(
        id,
        { $set: { tier } },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async generateReferralLink(id: string) {
    const customer = await this.model.findById(id).lean().exec();
    if (!customer) throw new NotFoundException('مشتری پیدا نشد');
    const slug = this.generateReferralSlug(customer.name);
    const existing = await this.model
      .findOne({ referralSlug: slug })
      .lean()
      .exec();
    if (existing) throw new BadRequestException('این کد قبلاً استفاده شده است');
    const updated = await this.model
      .findByIdAndUpdate(id, { $set: { referralSlug: slug } }, { new: true })
      .lean()
      .exec();
    return updated;
  }

  async getCustomerByReferral(slug: string) {
    return this.model.findOne({ referralSlug: slug }).lean().exec();
  }

  async addNote(id: string, text: string) {
    if (!text.trim()) throw new BadRequestException('متن یادداشت الزامی است');
    const item = await this.model
      .findByIdAndUpdate(
        id,
        { $push: { notes: { at: new Date(), text: text.trim() } } },
        { new: true },
      )
      .lean()
      .exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).lean().exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return { ok: true };
  }

  private clean(input: Record<string, unknown>, required: boolean) {
    const name = String(input.name || '').trim();
    const phone = String(input.phone || '').trim();
    if (required && (!name || !phone))
      throw new BadRequestException('نام و شماره تماس الزامی است');
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    for (const key of ['email', 'city', 'source', 'note']) {
      if (input[key] !== undefined) data[key] = String(input[key] || '').trim();
    }
    if (input.status !== undefined)
      data.status = statuses.includes(input.status as CustomerStatus)
        ? input.status
        : 'lead';
    if (input.tier !== undefined) {
      if (input.tier === null || input.tier === '') {
        data.tier = null;
      } else if (tiers.includes(input.tier as CustomerTier)) {
        data.tier = input.tier;
      }
    }
    if (input.referralSlug !== undefined && input.referralSlug) {
      data.referralSlug = String(input.referralSlug).trim().toLowerCase();
    }
    if (input.smsOptions !== undefined) {
      data.smsOptions =
        typeof input.smsOptions === 'object'
          ? input.smsOptions
          : { enabled: false };
    }
    if (input.tags !== undefined) {
      data.tags = Array.isArray(input.tags)
        ? input.tags
            .map(String)
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
    }
    return data;
  }

  private generateReferralSlug(name: string): string {
    const cleanName = name
      .replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '')
      .toLowerCase();
    const hash = randomBytes(4).toString('hex');
    return cleanName ? `${cleanName}-${hash}` : `c-${hash}`;
  }

  private normalizePhone(value: string) {
    const digits = value
      .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
      .replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('98')) {
      return `0${digits.slice(2)}`;
    }
    if (digits.length === 10 && digits.startsWith('9')) return `0${digits}`;
    return digits;
  }

  private phonePattern(phone: string) {
    return new RegExp(
      `^${phone
        .split('')
        .map((digit) => {
          const persianDigit = '۰۱۲۳۴۵۶۷۸۹'[Number(digit)] || digit;
          return `[${digit}${persianDigit}][\\s-]*`;
        })
        .join('')}$`,
    );
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `scrypt:${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string) {
    const [scheme, salt, hash] = stored.split(':');
    if (scheme !== 'scrypt' || !salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64).toString('hex');
    const candidateBuffer = Buffer.from(candidate, 'hex');
    const storedBuffer = Buffer.from(hash, 'hex');
    return (
      candidateBuffer.length === storedBuffer.length &&
      timingSafeEqual(candidateBuffer, storedBuffer)
    );
  }

  private publicCustomer(customer: {
    _id?: unknown;
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    city?: unknown;
    createdAt?: unknown;
  }) {
    return {
      id: String(customer._id || ''),
      name: String(customer.name || ''),
      phone: String(customer.phone || ''),
      email: String(customer.email || ''),
      city: String(customer.city || ''),
      createdAt: customer.createdAt,
    };
  }
}
