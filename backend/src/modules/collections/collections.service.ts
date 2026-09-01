import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Collection, CollectionDocument, CollectionStatus } from './schemas/collection.schema';
import { ShopProduct, ShopProductDocument } from '../shop/schemas/shop-product.schema';

const statuses: CollectionStatus[] = ['draft', 'published', 'archived'];

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name) private readonly model: Model<CollectionDocument>,
    @InjectModel(ShopProduct.name) private readonly products: Model<ShopProductDocument>,
  ) {}

  async list(q?: string, status?: string): Promise<{ items: Record<string, unknown>[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (status && statuses.includes(status as CollectionStatus)) filter.status = status;
    if (q?.trim()) filter.$or = ['name', 'slug', 'series'].map((field) => ({ [field]: { $regex: q.trim(), $options: 'i' } }));
    const [items, total] = await Promise.all([
      this.model.find(filter).sort({ updatedAt: -1 }).limit(100).lean().exec(),
      this.model.countDocuments(filter),
    ]);
    return { items, total };
  }

  async get(id: string) {
    const item = await this.model.findById(id).lean().exec();
    if (!item) throw new NotFoundException('کالکشن پیدا نشد');
    return item;
  }

  async getBySlug(slug: string) {
    const item = await this.model.findOne({ slug, status: 'published' }).lean().exec();
    if (!item) throw new NotFoundException('کالکشن منتشر‌شده پیدا نشد');
    const products = await this.getProductsForCollection(item as unknown as Record<string, unknown>);
    return { ...item, products };
  }

  async getProductsForCollection(collection: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    const series = String(collection.series || '').trim();
    if (!series) return [];
    return this.products.find({ series, status: 'published' }).sort({ sortOrder: 1, createdAt: -1 }).lean().exec();
  }

  async create(input: Record<string, unknown>): Promise<Record<string, unknown>> {
    const data = this.clean(input, true);
    if (!data['name']) throw new BadRequestException('نام کالکشن الزامی است');
    if (!data['slug']) data['slug'] = this.normalizeSlug(String(data['name']));
    try {
      return (await this.model.create(data)).toObject();
    } catch (error: any) {
      if (error?.code === 11000) throw new BadRequestException('نام یا اسلاگ تکراری است');
      throw error;
    }
  }

  async update(id: string, input: Record<string, unknown>) {
    const item = await this.model.findByIdAndUpdate(id, { $set: this.clean(input, false) }, { new: true, runValidators: true }).lean().exec();
    if (!item) throw new NotFoundException('کالکشن پیدا نشد');
    return item;
  }

  async remove(id: string) {
    const item = await this.model.findByIdAndDelete(id).lean().exec();
    if (!item) throw new NotFoundException('کالکشن پیدا نشد');
    return { ok: true };
  }

  async publicList() {
    return this.model.find({ status: 'published' }).sort({ updatedAt: -1 }).lean().exec();
  }

  private clean(input: Record<string, unknown>, required: boolean) {
    const data: Record<string, unknown> = {};
    for (const key of ['name', 'slug', 'excerpt', 'description', 'image', 'series']) {
      if (input[key] !== undefined) data[key] = String(input[key] || '').trim();
    }
    if (input.status !== undefined) data.status = statuses.includes(input.status as CollectionStatus) ? input.status : 'draft';
    if (input.tags !== undefined) data.tags = Array.isArray(input.tags) ? input.tags.map(String).map((v) => v.trim()).filter(Boolean) : [];
    if (input.gallery !== undefined) data.gallery = Array.isArray(input.gallery) ? input.gallery.map(String).map((v) => v.trim()).filter(Boolean) : [];
    if (input.publishedAt !== undefined) data.publishedAt = input.publishedAt;
    return data;
  }

  private normalizeSlug(value: string): string {
    return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || `collection-${Date.now()}`;
  }
}
