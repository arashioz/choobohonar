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

  async getBySlug(slug: string): Promise<any> {
    const item = await this.model.findOne({ slug, status: 'published' }).lean().exec();
    if (!item) throw new NotFoundException('کالکشن منتشر‌شده پیدا نشد');
    const products = await this.getProductsForCollection(item as unknown as Record<string, unknown>);
    return { ...item, products };
  }

  async getProductsForCollection(collection: Record<string, unknown>): Promise<Record<string, unknown>[]> {
    // A collection owns every published product whose title contains its
    // name. This stays current automatically as products are created or
    // renamed; no manual product-to-collection assignment is required.
    const collectionName = this.collectionName(collection);
    if (!collectionName) return [];

    const normalizedCollectionName = this.normalizeForMatch(collectionName);
    const products = await this.products
      .find({ status: 'published' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();

    const normalizedSeries = this.normalizeForMatch(String(collection.series || collectionName));
    return products.filter((product) => {
      const titleMatches = this.normalizeForMatch(product.name || '').includes(normalizedCollectionName);
      const seriesMatches = Boolean(normalizedSeries) && this.normalizeForMatch(product.series || '') === normalizedSeries;
      return titleMatches || seriesMatches;
    }) as unknown as Record<string, unknown>[];
  }

  async create(input: Record<string, unknown>): Promise<any> {
    const data = this.clean(input, true);
    if (!data['name']) throw new BadRequestException('نام کالکشن الزامی است');
    if (!data['slug']) data['slug'] = this.normalizeSlug(String(data['name']));
    try {
      const doc = await this.model.create(data);
      return doc.toObject();
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

  async publicList(): Promise<Record<string, unknown>[]> {
    // The storefront should mirror the collection manager: return every
    // active collection that actually owns products, including collections
    // whose membership is inferred from their series or product names.
    const collections = (await this.model
      .find({ status: { $ne: 'archived' } })
      .sort({ updatedAt: -1 })
      .lean()
      .exec()) as unknown as Record<string, unknown>[];

    const withProducts: Array<Record<string, unknown> & { products: Record<string, unknown>[] }> = await Promise.all(
      collections.map(async (collection) => ({
        ...collection,
        products: await this.getProductsForCollection(collection as unknown as Record<string, unknown>),
      })),
    );
    return withProducts.filter((collection) => collection.products.length > 0);
  }

  async seedFromProducts(): Promise<{ created: number; series: string[] }> {
    const results = await this.products.aggregate<{ _id: string }>([
      { $match: { series: { $type: 'string', $ne: '' } } },
      { $group: { _id: '$series' } },
      { $sort: { _id: 1 } },
    ]).exec();

    const seriesList = results.map((r) => r._id).filter(Boolean);
    let created = 0;

    for (const series of seriesList) {
      const existing = await this.model.findOne({ series }).lean().exec();
      if (existing) continue;

      const name = series.charAt(0).toUpperCase() + series.slice(1);
      const slug = this.normalizeSlug(series);
      const productCount = await this.products.countDocuments({ series, status: 'published' }).exec();

      await this.model.create({
        name: `کالکشن ${name}`,
        slug,
        series,
        status: 'published',
        excerpt: `مجموعه محصولات سری ${name} — ${productCount} محصول`,
        description: `کالکشن ${name} شامل تمام محصولات این سری است.`,
        publishedAt: new Date(),
      });
      created++;
    }

    return { created, series: seriesList };
  }

  async updateProductSeries(productId: string, series: string): Promise<Record<string, unknown>> {
    const product = await this.products.findByIdAndUpdate(
      productId,
      { $set: { series: series.trim() } },
      { new: true, runValidators: true },
    ).lean().exec();
    if (!product) throw new NotFoundException('محصول پیدا نشد');
    return product as Record<string, unknown>;
  }

  async getProductsBySeries(series: string): Promise<Record<string, unknown>[]> {
    return this.products.find({ series: series.trim(), status: 'published' }).sort({ sortOrder: 1, createdAt: -1 }).lean().exec();
  }

  async getAllProducts(): Promise<Record<string, unknown>[]> {
    return this.products.find({ status: 'published' }).sort({ series: 1, sortOrder: 1 }).lean().exec();
  }

  /** Assign products by matching a collection name in the product title. */
  async syncProductSeriesFromNames(): Promise<{
    matched: number;
    updated: number;
    alreadyCorrect: number;
    ambiguous: string[];
    unmatched: number;
  }> {
    const [collections, products] = await Promise.all([
      this.model.find({ status: { $ne: 'archived' } }).select('name series').lean().exec(),
      this.products.find({}).select('name series').lean().exec(),
    ]);
    const rules = collections
      .map((collection) => ({ name: this.collectionName(collection as unknown as Record<string, unknown>), series: String(collection.series || '').trim() }))
      .filter((rule) => rule.name)
      .sort((a, b) => this.normalizeForMatch(b.name).length - this.normalizeForMatch(a.name).length);

    const operations: any[] = [];
    const ambiguous: string[] = [];
    let matched = 0;
    let alreadyCorrect = 0;
    for (const product of products) {
      const title = this.normalizeForMatch(product.name || '');
      const matches = rules.filter((rule) => title.includes(this.normalizeForMatch(rule.name)));
      if (!matches.length) continue;
      const best = matches[0];
      if (matches.length > 1 && this.normalizeForMatch(matches[1].name).length === this.normalizeForMatch(best.name).length) {
        ambiguous.push(product.name);
        continue;
      }
      matched++;
      const series = best.series || best.name;
      if (this.normalizeForMatch(product.series || '') === this.normalizeForMatch(series)) {
        alreadyCorrect++;
        continue;
      }
      operations.push({ updateOne: { filter: { _id: product._id }, update: { $set: { series } } } });
    }
    if (operations.length) await this.products.bulkWrite(operations);
    return { matched, updated: operations.length, alreadyCorrect, ambiguous, unmatched: products.length - matched - ambiguous.length };
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

  private collectionName(collection: Record<string, unknown>): string {
    const name = String(collection.name || collection.series || '').trim();
    return name.replace(/^کالکشن\s+/u, '').trim();
  }

  private normalizeForMatch(value: string): string {
    return value
      .toLowerCase()
      .replace(/[آأإ]/g, 'ا')
      .replace(/[يى]/g, 'ی')
      .replace(/ك/g, 'ک')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
