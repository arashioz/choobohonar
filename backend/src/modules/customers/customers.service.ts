import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes, randomInt, scryptSync, timingSafeEqual } from 'crypto';
import { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
  CustomerStatus,
  CustomerTier,
} from './schemas/customer.schema';
import {
  CustomerLoginCode,
  CustomerLoginCodeDocument,
} from './schemas/customer-login-code.schema';
import {
  ShopOrder,
  ShopOrderDocument,
} from '../shop/schemas/shop-order.schema';
import { ParsgreenSmsService } from './parsgreen-sms.service';

const statuses: CustomerStatus[] = ['lead', 'active', 'inactive'];
const tiers: CustomerTier[] = ['vip', 'silver', 'gold'];

export const LOCAL_TEST_ACCOUNT = {
  name: 'bezivafaei',
  phone: '09121111111',
  email: 'bezivafaei@local.test',
  city: 'تهران',
  password: 'bezivafaei',
  source: 'local-test',
};

@Injectable()
export class CustomersService implements OnModuleInit {
  constructor(
    @InjectModel(Customer.name) private readonly model: Model<CustomerDocument>,
    @InjectModel(CustomerLoginCode.name)
    private readonly loginCodeModel: Model<CustomerLoginCodeDocument>,
    @InjectModel(ShopOrder.name)
    private readonly orderModel: Model<ShopOrderDocument>,
    private readonly parsgreenSms: ParsgreenSmsService,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;
    await this.ensureLocalTestAccount();
  }

  isLocalRuntime() {
    return process.env.NODE_ENV !== 'production';
  }

  async ensureLocalTestAccount() {
    const phone = this.normalizePhone(LOCAL_TEST_ACCOUNT.phone);
    const existing = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .select('+passwordHash')
      .exec();
    const passwordHash = this.hashPassword(LOCAL_TEST_ACCOUNT.password);
    if (existing) {
      existing.name = LOCAL_TEST_ACCOUNT.name;
      existing.phone = phone;
      existing.email = LOCAL_TEST_ACCOUNT.email;
      existing.city = LOCAL_TEST_ACCOUNT.city;
      existing.passwordHash = passwordHash;
      existing.status = 'active';
      if (!existing.source) existing.source = LOCAL_TEST_ACCOUNT.source;
      await existing.save();
      return this.publicCustomer(existing);
    }
    const customer = await this.model.create({
      name: LOCAL_TEST_ACCOUNT.name,
      phone,
      email: LOCAL_TEST_ACCOUNT.email,
      city: LOCAL_TEST_ACCOUNT.city,
      passwordHash,
      status: 'active',
      source: LOCAL_TEST_ACCOUNT.source,
    });
    return this.publicCustomer(customer);
  }

  async registerAccount(input: Record<string, unknown>) {
    const name = String(input.name || '').trim();
    const phone = this.normalizePhone(String(input.phone || ''));
    const email = String(input.email || '')
      .trim()
      .toLowerCase();
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
      throw new BadRequestException(
        'برای این شماره حساب کاربری وجود دارد؛ وارد شوید',
      );

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
    if (
      !customer?.passwordHash ||
      !this.verifyPassword(password, customer.passwordHash)
    )
      throw new BadRequestException('شماره موبایل یا رمز عبور نادرست است');
    return this.publicCustomer(customer);
  }

  async requestLoginCode(phoneValue: string) {
    const phone = this.normalizePhone(phoneValue);
    if (!/^09\d{9}$/.test(phone))
      throw new BadRequestException('شماره موبایل معتبر وارد کنید');

    const now = new Date();
    const existing = await this.loginCodeModel.findOne({ phone }).exec();
    if (existing && now.getTime() - existing.lastSentAt.getTime() < 60_000) {
      throw new BadRequestException(
        'لطفاً یک دقیقه دیگر برای دریافت کد تلاش کنید',
      );
    }
    const windowStartedAt =
      existing?.windowStartedAt?.getTime() || now.getTime();
    if (
      existing &&
      now.getTime() - windowStartedAt < 60 * 60 * 1000 &&
      existing.sendCount >= 5
    ) {
      throw new BadRequestException(
        'تعداد درخواست کد بیش از حد مجاز است؛ یک ساعت دیگر تلاش کنید',
      );
    }

    const code = String(randomInt(100_000, 1_000_000));
    await this.parsgreenSms.sendLoginCode(phone, code);

    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);
    if (existing) {
      const isNewWindow = now.getTime() - windowStartedAt >= 60 * 60 * 1000;
      existing.codeHash = this.hashLoginCode(code);
      existing.expiresAt = expiresAt;
      existing.attempts = 0;
      existing.lastSentAt = now;
      existing.sendCount = isNewWindow ? 1 : existing.sendCount + 1;
      if (isNewWindow) existing.windowStartedAt = now;
      await existing.save();
    } else {
      await this.loginCodeModel.create({
        phone,
        codeHash: this.hashLoginCode(code),
        expiresAt,
        attempts: 0,
        sendCount: 1,
        windowStartedAt: now,
        lastSentAt: now,
      });
    }
    return { ok: true, expiresIn: 300 };
  }

  async verifyLoginCode(phoneValue: string, code: string) {
    const phone = this.normalizePhone(phoneValue);
    if (!/^09\d{9}$/.test(phone) || !/^\d{6}$/.test(code))
      throw new BadRequestException('شماره موبایل یا کد ورود معتبر نیست');
    const request = await this.loginCodeModel
      .findOne({ phone })
      .select('+codeHash')
      .exec();
    if (!request || request.expiresAt.getTime() < Date.now())
      throw new BadRequestException(
        'کد ورود منقضی شده است؛ دوباره درخواست کنید',
      );
    if (request.attempts >= 5)
      throw new BadRequestException(
        'تعداد تلاش بیش از حد مجاز است؛ دوباره کد بگیرید',
      );
    if (!this.matchesLoginCode(code, request.codeHash)) {
      request.attempts += 1;
      await request.save();
      throw new BadRequestException('کد ورود نادرست است');
    }
    await this.loginCodeModel.deleteOne({ _id: request._id }).exec();

    let customer = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .exec();
    if (customer) {
      if (customer.status !== 'active') {
        customer.status = 'active';
        await customer.save();
      }
    } else {
      customer = await this.model.create({
        name: 'کاربر چوب و هنر',
        phone,
        status: 'active',
        source: 'website-otp',
      });
    }
    return this.publicCustomer(customer);
  }

  async accountProfile(id: string) {
    const customer = await this.model.findById(id).lean().exec();
    if (!customer) throw new NotFoundException('حساب کاربری پیدا نشد');
    const phonePattern = this.phonePattern(customer.phone);
    const orders = await this.orderModel
      .find({ 'customer.phone': { $regex: phonePattern } })
      .sort({ createdAt: -1 })
      .select(
        'orderNumber status kind items amounts payment createdAt proformaId invoiceId',
      )
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
    if (input.email !== undefined)
      patch.email = String(input.email || '')
        .trim()
        .toLowerCase();
    if (input.city !== undefined) patch.city = String(input.city || '').trim();
    if (input.deliveryAddress === null) patch.deliveryAddress = null;
    else if (input.deliveryAddress !== undefined)
      patch.deliveryAddress = this.normalizeDeliveryAddress(
        input.deliveryAddress,
      );
    if (input.galleryTaste === null) patch.galleryTaste = null;
    else if (input.galleryTaste !== undefined)
      patch.galleryTaste = this.normalizeTaste(input.galleryTaste);
    const customer = await this.model
      .findByIdAndUpdate(id, { $set: patch }, { new: true })
      .lean()
      .exec();
    if (!customer) throw new NotFoundException('حساب کاربری پیدا نشد');
    return this.publicCustomer(customer);
  }

  async upsertGalleryTaste(input: Record<string, unknown>) {
    const name = String(input.name || '').trim();
    const phone = this.normalizePhone(String(input.phone || ''));
    const galleryTaste = this.normalizeTaste(input.taste || input.galleryTaste);
    if (name.length < 2 || phone.length < 10)
      throw new BadRequestException('نام و شماره موبایل معتبر الزامی است');

    const existing = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .select('+passwordHash')
      .exec();

    if (existing) {
      existing.galleryTaste = galleryTaste;
      if (!existing.passwordHash) existing.name = name;
      if (!existing.source) existing.source = 'gallery-taste';
      await existing.save();
      return this.publicCustomer(existing);
    }

    const customer = await this.model.create({
      name,
      phone,
      galleryTaste,
      status: 'lead',
      source: 'gallery-taste',
    });
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

  async commerce(id: string) {
    const customer = await this.get(id);
    const phonePattern = this.phonePattern(customer.phone);
    const orders = await this.orderModel
      .find({ 'customer.phone': { $regex: phonePattern } })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
    const onlineOrders = orders.filter((order) => order.kind === 'online');
    const proformas = orders.filter((order) => order.kind !== 'online');
    return { customer, onlineOrders, proformas };
  }

  async ensureLeadFromOrder(input: {
    name: string;
    phone: string;
    email?: string;
    city?: string;
    source?: string;
  }) {
    const name = String(input.name || '').trim();
    const phone = this.normalizePhone(String(input.phone || ''));
    if (name.length < 2 || phone.length < 10) return null;
    const existing = await this.model
      .findOne({ phone: { $regex: this.phonePattern(phone) } })
      .exec();
    if (existing) {
      const patch: Record<string, unknown> = {};
      if (!existing.city && input.city) patch.city = input.city;
      if (!existing.email && input.email)
        patch.email = String(input.email).trim().toLowerCase();
      if (Object.keys(patch).length) {
        await this.model.updateOne({ _id: existing._id }, { $set: patch });
      }
      return existing;
    }
    return this.model.create({
      name,
      phone,
      ...(input.email
        ? { email: String(input.email).trim().toLowerCase() }
        : {}),
      ...(input.city ? { city: input.city } : {}),
      status: 'lead',
      source: input.source || 'checkout',
    });
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

  private hashLoginCode(code: string) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new BadRequestException('تنظیمات ورود کاربر کامل نیست');
    return scryptSync(code, `customer-login:${secret}`, 64).toString('hex');
  }

  private matchesLoginCode(code: string, stored: string) {
    const candidate = Buffer.from(this.hashLoginCode(code), 'hex');
    const storedBuffer = Buffer.from(stored, 'hex');
    return (
      candidate.length === storedBuffer.length &&
      timingSafeEqual(candidate, storedBuffer)
    );
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

  private normalizeTaste(value: unknown) {
    if (value === null) return null;
    const record =
      value && typeof value === 'object'
        ? (value as Record<string, unknown>)
        : {};
    const allowed = {
      space: ['home', 'villa', 'hospitality', 'detail'],
      material: ['dark-wood', 'light-wood', 'fabric', 'metal'],
      atmosphere: ['calm', 'layered', 'formal', 'nature'],
      object: ['decor', 'lighting', 'carpet', 'furniture'],
    } as const;
    const space = String(record.space || '');
    const material = String(record.material || '');
    const atmosphere = String(record.atmosphere || '');
    const object = String(record.object || '');
    if (
      !allowed.space.includes(space as (typeof allowed.space)[number]) ||
      !allowed.material.includes(
        material as (typeof allowed.material)[number],
      ) ||
      !allowed.atmosphere.includes(
        atmosphere as (typeof allowed.atmosphere)[number],
      ) ||
      !allowed.object.includes(object as (typeof allowed.object)[number])
    ) {
      throw new BadRequestException(
        'پاسخ سلیقه باید برای فضا، متریال، حس فضا و شیء از گزینه‌های گالری باشد',
      );
    }
    return {
      space,
      material,
      atmosphere,
      object,
      answeredAt: new Date().toISOString(),
    };
  }

  private normalizeDeliveryAddress(value: unknown) {
    const record =
      value && typeof value === 'object'
        ? (value as Record<string, unknown>)
        : null;
    if (!record) throw new BadRequestException('نشانی تحویل معتبر نیست');
    const province = String(record.province || '').trim();
    const city = String(record.city || '').trim();
    const address = String(record.address || '').trim();
    const postalCode = String(record.postalCode || '').trim();
    const deliveryNote = String(record.deliveryNote || '').trim();
    if (!province || !city || address.length < 10)
      throw new BadRequestException('نشانی تحویل کامل نیست');
    if (postalCode && !/^[0-9۰-۹]{10}$/.test(postalCode.replace(/\s/g, '')))
      throw new BadRequestException('کد پستی باید ۱۰ رقم باشد');
    return {
      province,
      city,
      address,
      ...(postalCode ? { postalCode } : {}),
      ...(deliveryNote ? { deliveryNote } : {}),
    };
  }

  private publicCustomer(customer: {
    _id?: unknown;
    name?: unknown;
    phone?: unknown;
    email?: unknown;
    city?: unknown;
    deliveryAddress?: unknown;
    createdAt?: unknown;
    galleryTaste?: unknown;
  }) {
    return {
      id: String(customer._id || ''),
      name: String(customer.name || ''),
      phone: String(customer.phone || ''),
      email: String(customer.email || ''),
      city: String(customer.city || ''),
      deliveryAddress: customer.deliveryAddress || null,
      createdAt: customer.createdAt,
      galleryTaste: customer.galleryTaste || null,
    };
  }
}
