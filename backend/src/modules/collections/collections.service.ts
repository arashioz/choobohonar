import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Collection,
  CollectionDocument,
  CollectionStatus,
} from './schemas/collection.schema';
import {
  ShopProduct,
  ShopProductDocument,
} from '../shop/schemas/shop-product.schema';
import { CmsEntry, CmsEntryDocument } from '../cms/schemas/cms-entry.schema';

const statuses: CollectionStatus[] = ['draft', 'published', 'archived'];

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private readonly model: Model<CollectionDocument>,
    @InjectModel(ShopProduct.name)
    private readonly products: Model<ShopProductDocument>,
    @InjectModel(CmsEntry.name)
    private readonly cmsEntries: Model<CmsEntryDocument>,
  ) {}

  async list(
    q?: string,
    status?: string,
  ): Promise<{ items: Record<string, unknown>[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (status && statuses.includes(status as CollectionStatus))
      filter.status = status;
    if (q?.trim())
      filter.$or = ['name', 'slug', 'series'].map((field) => ({
        [field]: { $regex: q.trim(), $options: 'i' },
      }));
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
    const item = await this.model
      .findOne({ slug, status: { $ne: 'archived' } })
      .lean()
      .exec();
    if (item) {
      const products = await this.getProductsForCollection(item);
      const image = this.resolveCover(
        item as unknown as Record<string, unknown>,
        products,
      );
      return { ...item, image, products };
    }

    // Collections created from «مدیریت آثار» live in cms_entries, not in the
    // standalone collections table. Expose them through the same storefront
    // API so the admin and frontend never diverge.
    const cmsItem = await this.cmsEntries
      .findOne({ kind: 'collection', slug, status: { $ne: 'archived' } })
      .lean()
      .exec();
    if (!cmsItem) throw new NotFoundException('کالکشن پیدا نشد');
    return this.toPublicCmsCollection(cmsItem);
  }

  async getProductsForCollection(
    collection: Record<string, unknown>,
    availableProducts?: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    // A collection owns every published product whose title contains its
    // name. This stays current automatically as products are created or
    // renamed; no manual product-to-collection assignment is required.
    const collectionName = this.collectionName(collection);
    if (!collectionName) return [];

    const normalizedCollectionName = this.normalizeForMatch(collectionName);
    const products =
      availableProducts ||
      (await this.products
        .find({ status: 'published' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean()
        .exec());

    const normalizedSeries = this.normalizeForMatch(
      String(collection.series || collectionName),
    );
    return products.filter((product) => {
      const titleMatches = this.normalizeForMatch(
        String(product.name || ''),
      ).includes(normalizedCollectionName);
      const seriesMatches =
        Boolean(normalizedSeries) &&
        this.normalizeForMatch(String(product.series || '')) ===
          normalizedSeries;
      return titleMatches || seriesMatches;
    });
  }

  async create(input: Record<string, unknown>): Promise<any> {
    const data = this.clean(input, true);
    if (!data['name']) throw new BadRequestException('نام کالکشن الزامی است');
    if (!data['slug']) data['slug'] = this.normalizeSlug(String(data['name']));

    try {
      const doc = await this.model.create(data);
      return doc.toObject();
    } catch (error: any) {
      if (error?.code === 11000)
        throw new BadRequestException('نام یا اسلاگ تکراری است');
      throw error;
    }
  }

  async update(id: string, input: Record<string, unknown>) {
    const data = this.clean(input, false);

    const item = await this.model
      .findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
      .lean()
      .exec();
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
    const [collections, allProducts, cmsCollections] = await Promise.all([
      this.model
        .find({ status: { $ne: 'archived' } })
        .sort({ updatedAt: -1 })
        .lean()
        .exec(),
      this.products
        .find({ status: 'published' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean()
        .exec(),
      this.cmsEntries
        .find({ kind: 'collection', status: { $ne: 'archived' } })
        .sort({ updatedAt: -1 })
        .lean()
        .exec(),
    ]);
    const publishedProducts = allProducts as unknown as Record<
      string,
      unknown
    >[];

    const withProducts: Array<
      Record<string, unknown> & { products: Record<string, unknown>[] }
    > = await Promise.all(
      collections.map(async (collection) => {
        const products = await this.getProductsForCollection(
          collection,
          publishedProducts,
        );
        const image = this.resolveCover(collection, products);
        return {
          ...collection,
          image,
          productCount: products.length,
          products: [],
        };
      }),
    );
    const cmsWithProducts = await Promise.all(
      cmsCollections.map((collection) =>
        this.toPublicCmsCollection(
          collection as unknown as Record<string, unknown>,
          publishedProducts,
          false,
        ),
      ),
    );

    // CMS is normally the source used by «مدیریت آثار». A deliberately chosen
    // standalone custom cover is the one exception: it must win so the image
    // selected in the Collections admin is visible on the storefront too.
    const result = new Map<string, Record<string, unknown>>();
    for (const collection of withProducts) {
      if (
        Number(collection.productCount || 0) >= 2 &&
        collection.coverMode === 'custom' &&
        collection.image
      )
        result.set(String(collection.slug), collection);
    }
    for (const collection of cmsWithProducts) {
      if (Number(collection.productCount || 0) >= 2)
        if (!result.has(String(collection.slug)))
          result.set(String(collection.slug), collection);
    }
    for (const collection of withProducts) {
      if (
        Number(collection.productCount || 0) >= 2 &&
        !result.has(String(collection.slug))
      )
        result.set(String(collection.slug), collection);
    }
    return [...result.values()];
  }

  private async toPublicCmsCollection(
    collection: Record<string, unknown>,
    availableProducts?: Record<string, unknown>[],
    includeProducts = true,
  ): Promise<
    Record<string, unknown> & { products: Record<string, unknown>[] }
  > {
    const data = (
      collection.data && typeof collection.data === 'object'
        ? collection.data
        : {}
    ) as Record<string, unknown>;
    const title = String(collection.title || '').trim();
    const series = String(
      data.seriesName || data.series || title.replace(/^کالکشن\s+/u, ''),
    ).trim();
    const products = await this.getProductsForCmsCollection(
      collection,
      series,
      availableProducts,
    );
    // The first actual product is the collection cover everywhere. This keeps
    // the listing and detail header in sync and bypasses stale legacy covers.
    const savedImages = Array.isArray(collection.images)
      ? collection.images.map(String).filter(Boolean)
      : [];
    const productCover = String(products[0]?.image || '');
    const processedImages = productCover
      ? [productCover, ...savedImages.filter((image) => image !== productCover)]
      : savedImages;

    return {
      _id: String(collection._id || ''),
      name: title,
      slug: String(collection.slug || ''),
      status: String(collection.status || 'draft'),
      excerpt: String(collection.excerpt || ''),
      description: String(collection.description || collection.content || ''),
      image: processedImages[0] || '',
      gallery: processedImages,
      series,
      tags: Array.isArray(collection.tags) ? collection.tags.map(String) : [],
      productCount: products.length,
      products: includeProducts ? products : [],
    };
  }

  private async getProductsForCmsCollection(
    collection: Record<string, unknown>,
    series: string,
    availableProducts?: Record<string, unknown>[],
  ): Promise<Record<string, unknown>[]> {
    const data = (
      collection.data && typeof collection.data === 'object'
        ? collection.data
        : {}
    ) as Record<string, unknown>;
    const references = new Set(
      [data.productSlugs, data.productIds]
        .flatMap((value) => (Array.isArray(value) ? value : []))
        .map((value) => String(value).trim())
        .filter(Boolean),
    );
    const normalizedSeries = this.normalizeForMatch(series);
    const products =
      availableProducts ||
      (await this.products
        .find({ status: 'published' })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean()
        .exec());
    return products.filter((product) => {
      const explicitlyAssigned =
        references.has(String(product.slug)) ||
        references.has(String(product._id));
      const seriesMatches =
        Boolean(normalizedSeries) &&
        this.normalizeForMatch(String(product.series || '')) ===
          normalizedSeries;
      return explicitlyAssigned || seriesMatches;
    });
  }

  async seedFromProducts(): Promise<{
    created: number;
    updated: number;
    archived: number;
    protected: number;
    series: string[];
  }> {
    const results = await this.products
      .aggregate<{
        _id: string;
        productCount: number;
      }>([
        {
          $match: {
            status: 'published',
            series: { $type: 'string', $ne: '' },
          },
        },
        { $group: { _id: '$series', productCount: { $sum: 1 } } },
        { $match: { productCount: { $gte: 2 } } },
        { $sort: { _id: 1 } },
      ])
      .exec();

    const sharedSeries = results.filter((result) => result._id.trim());
    const seriesList = sharedSeries.map((result) => result._id);
    const existingCollections = await this.model.find({}).lean().exec();
    const automatic = existingCollections.filter((collection) =>
      this.isAutomaticCollection(collection as unknown as Record<string, unknown>),
    );

    // This is a true sync: generated collections which no longer have two
    // published products disappear from the public site. Manually curated
    // collections are deliberately not included here.
    const automaticIds = automatic.map((collection) => collection._id);
    const archived = automaticIds.length
      ? await this.model.updateMany(
          { _id: { $in: automaticIds }, status: { $ne: 'archived' } },
          { $set: { status: 'archived' } },
        )
      : { modifiedCount: 0 };

    const automaticBySeries = new Map(
      automatic
        .filter((collection) => collection.series)
        .map((collection) => [collection.series, collection]),
    );
    const automaticBySlug = new Map(
      automatic.map((collection) => [collection.slug, collection]),
    );
    const manualCollections = existingCollections.filter(
      (collection) =>
        !this.isAutomaticCollection(
          collection as unknown as Record<string, unknown>,
        ),
    );
    let created = 0;
    let updated = 0;
    let protectedCount = 0;

    for (const { _id: series, productCount } of sharedSeries) {
      const name = series.charAt(0).toUpperCase() + series.slice(1);
      const slug = this.normalizeSlug(series);
      const data = {
        name: `کالکشن ${name}`,
        slug,
        series,
        status: 'published',
        source: 'catalog-series',
        excerpt: `مجموعه محصولات سری ${name} — ${productCount} محصول`,
        description: `کالکشن ${name} شامل تمام محصولات این سری است.`,
        publishedAt: new Date(),
      };
      const automaticExisting =
        automaticBySeries.get(series) || automaticBySlug.get(slug);
      const manualConflict = manualCollections.some(
        (collection) => collection.series === series || collection.slug === slug,
      );
      if (manualConflict && !automaticExisting) {
        protectedCount++;
        continue;
      }
      if (automaticExisting) {
        await this.model
          .findByIdAndUpdate(automaticExisting._id, { $set: data })
          .exec();
        updated++;
      } else {
        await this.model.create(data);
        created++;
      }
    }

    return {
      created,
      updated,
      archived: Number(archived.modifiedCount || 0),
      protected: protectedCount,
      series: seriesList,
    };
  }

  async updateProductSeries(
    productId: string,
    series: string,
  ): Promise<Record<string, unknown>> {
    const product = await this.products
      .findByIdAndUpdate(
        productId,
        { $set: { series: series.trim() } },
        { new: true, runValidators: true },
      )
      .lean()
      .exec();
    if (!product) throw new NotFoundException('محصول پیدا نشد');
    return product as Record<string, unknown>;
  }

  async getProductsBySeries(
    series: string,
  ): Promise<Record<string, unknown>[]> {
    return this.products
      .find({ series: series.trim(), status: 'published' })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean()
      .exec();
  }

  async getAllProducts(): Promise<Record<string, unknown>[]> {
    return this.products
      .find({ status: 'published' })
      .sort({ series: 1, sortOrder: 1 })
      .lean()
      .exec();
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
      this.model
        .find({ status: { $ne: 'archived' } })
        .select('name series')
        .lean()
        .exec(),
      this.products.find({}).select('name series').lean().exec(),
    ]);
    const rules = collections
      .map((collection) => ({
        name: this.collectionName(
          collection as unknown as Record<string, unknown>,
        ),
        series: String(collection.series || '').trim(),
      }))
      .filter((rule) => rule.name)
      .sort(
        (a, b) =>
          this.normalizeForMatch(b.name).length -
          this.normalizeForMatch(a.name).length,
      );

    const operations: any[] = [];
    const ambiguous: string[] = [];
    let matched = 0;
    let alreadyCorrect = 0;
    for (const product of products) {
      const title = this.normalizeForMatch(product.name || '');
      const matches = rules.filter((rule) =>
        title.includes(this.normalizeForMatch(rule.name)),
      );
      if (!matches.length) continue;
      const best = matches[0];
      if (
        matches.length > 1 &&
        this.normalizeForMatch(matches[1].name).length ===
          this.normalizeForMatch(best.name).length
      ) {
        ambiguous.push(product.name);
        continue;
      }
      matched++;
      const series = best.series || best.name;
      if (
        this.normalizeForMatch(product.series || '') ===
        this.normalizeForMatch(series)
      ) {
        alreadyCorrect++;
        continue;
      }
      operations.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { series } },
        },
      });
    }
    if (operations.length) await this.products.bulkWrite(operations);
    return {
      matched,
      updated: operations.length,
      alreadyCorrect,
      ambiguous,
      unmatched: products.length - matched - ambiguous.length,
    };
  }

  private clean(input: Record<string, unknown>, required: boolean) {
    const data: Record<string, unknown> = {};
    for (const key of [
      'name',
      'slug',
      'excerpt',
      'description',
      'image',
      'series',
    ]) {
      if (input[key] !== undefined) data[key] = String(input[key] || '').trim();
    }
    if (input.status !== undefined)
      data.status = statuses.includes(input.status as CollectionStatus)
        ? input.status
        : 'draft';
    if (input.coverMode !== undefined)
      data.coverMode = input.coverMode === 'custom' ? 'custom' : 'product';
    if (input.tags !== undefined)
      data.tags = Array.isArray(input.tags)
        ? input.tags
            .map(String)
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
    if (input.gallery !== undefined)
      data.gallery = Array.isArray(input.gallery)
        ? input.gallery
            .map(String)
            .map((v) => v.trim())
            .filter(Boolean)
        : [];
    if (input.publishedAt !== undefined) data.publishedAt = input.publishedAt;
    return data;
  }

  private normalizeSlug(value: string): string {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `collection-${Date.now()}`
    );
  }

  private collectionName(collection: Record<string, unknown>): string {
    const name = String(collection.name || collection.series || '').trim();
    return name.replace(/^کالکشن\s+/u, '').trim();
  }

  private resolveCover(
    collection: Record<string, unknown>,
    products: Record<string, unknown>[],
  ): string {
    if (collection.coverMode === 'custom' && collection.image)
      return String(collection.image);
    return String(products[0]?.image || collection.image || '');
  }

  private isAutomaticCollection(collection: Record<string, unknown>): boolean {
    if (collection.source === 'catalog-series') return true;
    // Rows created by the old "ساخت خودکار" button had no source marker.
    // Their stock description/excerpt lets us safely reconcile just those
    // legacy rows without touching a collection written by an admin.
    return (
      /^مجموعه محصولات سری .+ — \d+ محصول$/u.test(
        String(collection.excerpt || ''),
      ) &&
      /^کالکشن .+ شامل تمام محصولات این سری است\.$/u.test(
        String(collection.description || ''),
      )
    );
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
