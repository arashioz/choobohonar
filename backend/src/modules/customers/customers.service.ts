import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { Customer, CustomerDocument, CustomerStatus, CustomerTier } from './schemas/customer.schema';

const statuses: CustomerStatus[] = ['lead', 'active', 'inactive'];
const tiers: CustomerTier[] = ['vip', 'silver', 'gold'];

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private readonly model: Model<CustomerDocument>) {}

  async list(q?: string, status?: string) {
    const filter: Record<string, unknown> = {};
    if (status && statuses.includes(status as CustomerStatus)) filter.status = status;
    if (q?.trim()) filter.$or = ['name', 'phone', 'email', 'city'].map((field) => ({ [field]: { $regex: q.trim(), $options: 'i' } }));
    const [items, total] = await Promise.all([this.model.find(filter).sort({ updatedAt: -1 }).limit(250).lean().exec(), this.model.countDocuments(filter)]);
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
    const item = await this.model.findByIdAndUpdate(
      id,
      { $set: this.clean(input, false) },
      { new: true, runValidators: true }
    ).lean().exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async updateTier(id: string, tier: CustomerTier | null) {
    if (tier !== null && !tiers.includes(tier)) {
      throw new BadRequestException('تعیین دسته‌بندی معتبر نیست. مقادیر مجاز: vip, silver, gold');
    }
    const item = await this.model.findByIdAndUpdate(
      id,
      { $set: { tier } },
      { new: true, runValidators: true }
    ).lean().exec();
    if (!item) throw new NotFoundException('مشتری پیدا نشد');
    return item;
  }

  async generateReferralLink(id: string) {
    const customer = await this.model.findById(id).lean().exec();
    if (!customer) throw new NotFoundException('مشتری پیدا نشد');
    const slug = this.generateReferralSlug(customer.name);
    const existing = await this.model.findOne({ referralSlug: slug }).lean().exec();
    if (existing) throw new BadRequestException('این کد قبلاً استفاده شده است');
    const updated = await this.model.findByIdAndUpdate(
      id,
      { $set: { referralSlug: slug } },
      { new: true }
    ).lean().exec();
    return updated;
  }

  async getCustomerByReferral(slug: string) {
    return this.model.findOne({ referralSlug: slug }).lean().exec();
  }

  async addNote(id: string, text: string) {
    if (!text.trim()) throw new BadRequestException('متن یادداشت الزامی است');
    const item = await this.model.findByIdAndUpdate(
      id,
      { $push: { notes: { at: new Date(), text: text.trim() } } },
      { new: true }
    ).lean().exec();
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
    if (required && (!name || !phone)) throw new BadRequestException('نام و شماره تماس الزامی است');
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (phone) data.phone = phone;
    for (const key of ['email', 'city', 'source', 'note']) {
      if (input[key] !== undefined) data[key] = String(input[key] || '').trim();
    }
    if (input.status !== undefined) data.status = statuses.includes(input.status as CustomerStatus) ? input.status : 'lead';
    if (input.tier !== undefined) {
      if (input.tier === null || input.tier === '') {
        data.tier = null;
      } else if (tiers.includes(input.tier as CustomerTier)) {
        data.tier = input.tier as CustomerTier;
      }
    }
    if (input.referralSlug !== undefined && input.referralSlug) {
      data.referralSlug = String(input.referralSlug).trim().toLowerCase();
    }
    if (input.smsOptions !== undefined) {
      data.smsOptions = typeof input.smsOptions === 'object' ? input.smsOptions : { enabled: false };
    }
    if (input.tags !== undefined) {
      data.tags = Array.isArray(input.tags)
        ? input.tags.map(String).map(v => v.trim()).filter(Boolean)
        : [];
    }
    return data;
  }

  private generateReferralSlug(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '').toLowerCase();
    const hash = randomBytes(4).toString('hex');
    return cleanName ? `${cleanName}-${hash}` : `c-${hash}`;
  }
}
