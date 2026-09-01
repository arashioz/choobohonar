import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  ShopProduct,
  ShopProductDocument,
} from './schemas/shop-product.schema';
import { CmsEntry, CmsEntryDocument } from '../cms/schemas/cms-entry.schema';
import {
  CreateShopProductDto,
  UpdateShopProductDto,
} from './dto/shop-product.dto';

type CatalogSeedRow = {
  slug: string;
  name: string;
  category: string;
  room: string;
  shortDescription?: string;
  image?: string;
  gallery?: string[];
  categories?: { id: number; name: string; slug: string }[];
  attributes?: unknown[];
  prices?: { value?: string | null; regularValue?: string | null } | null;
  shopUrl?: string;
};

type CatalogCollectionTerm = { name: string; slug?: string };
type CatalogAttribute = { taxonomy?: string; name?: string; terms?: CatalogCollectionTerm[] };

const SERIES_ALIASES: Record<string, string> = {
  alder: 'آلدر',
};

function normalizeSeriesValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/[آأإ]/g, 'ا')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalSeriesName(value: string): string {
  return SERIES_ALIASES[normalizeSeriesValue(value)] || value.trim();
}

function getSeriesFromProduct(row: CatalogSeedRow): CatalogCollectionTerm | undefined {
  const attributes = (row.attributes || []) as CatalogAttribute[];
  const terms = attributes
    .filter((attribute) => attribute.taxonomy === 'pa_collection' || attribute.name === 'کالکشن')
    .flatMap((attribute) => attribute.terms || []);
  const normalizedName = normalizeSeriesValue(row.name);

  // Product titles are the authority here. Some legacy products carry extra
  // collection terms that do not appear in their names.
  return terms.find((term) => normalizedName.includes(normalizeSeriesValue(canonicalSeriesName(term.name))));
}

@Injectable()
export class ShopService implements OnModuleInit {
  constructor(
    @InjectModel(ShopProduct.name)
    private productModel: Model<ShopProductDocument>,
    @InjectModel(CmsEntry.name)
    private collectionModel: Model<CmsEntryDocument>,
  ) {}

  async onModuleInit() {
    // Bootstrap the catalog into MongoDB once. Admin-created products are
    // preserved on subsequent restarts and can then be managed normally.
    await this.seedFromCatalog(false);
    await this.seedCollectionsFromCatalog();
  }

  async list(query: {
    q?: string;
    room?: string;
    category?: string;
    status?: string;
    featured?: string;
    suggested?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(1000, Math.max(1, Number(query.limit) || 24));
    const filter: Record<string, unknown> = {};

    if (query.room) filter.room = query.room;
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.featured === 'true') filter.featured = true;
    if (query.featured === 'false') filter.featured = false;
    if (query.suggested === 'true') filter.suggested = true;
    if (query.suggested === 'false') filter.suggested = false;

    if (query.q?.trim()) {
      filter.$or = [
        { name: { $regex: query.q.trim(), $options: 'i' } },
        { slug: { $regex: query.q.trim(), $options: 'i' } },
        { category: { $regex: query.q.trim(), $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ featured: -1, suggested: -1, sortOrder: 1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    };
  }

  async get(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException('محصول پیدا نشد');
    return product;
  }

  async getBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).exec();
    if (!product) throw new NotFoundException('محصول پیدا نشد');
    return product;
  }

  async create(dto: CreateShopProductDto) {
    const exists = await this.productModel.exists({ slug: dto.slug });
    if (exists) throw new ConflictException('این اسلاگ قبلاً استفاده شده');

    return this.productModel.create({
      ...dto,
      shortDescription: dto.shortDescription ?? '',
      longDescription: dto.longDescription ?? '',
      image: dto.image ?? '',
      gallery: dto.gallery ?? [],
      finishes: dto.finishes ?? [],
      status: dto.status ?? 'published',
      featured: dto.featured ?? false,
      suggested: dto.suggested ?? false,
      stockQty: dto.stockQty ?? 0,
      trackInventory: dto.trackInventory ?? false,
      specs: dto.specs ?? [],
      highlights: dto.highlights ?? [],
      sortOrder: dto.sortOrder ?? 0,
      source: 'admin',
    });
  }

  async update(id: string, dto: UpdateShopProductDto) {
    if (dto.slug) {
      const clash = await this.productModel.exists({
        slug: dto.slug,
        _id: { $ne: id },
      });
      if (clash) throw new ConflictException('این اسلاگ قبلاً استفاده شده');
    }

    const updated = await this.productModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('محصول پیدا نشد');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.productModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('محصول پیدا نشد');
    return { ok: true };
  }

  async stats() {
    const [
      total,
      published,
      draft,
      archived,
      featured,
      suggested,
      missingImage,
      missingShopUrl,
      byRoom,
    ] = await Promise.all([
      this.productModel.countDocuments(),
      this.productModel.countDocuments({ status: 'published' }),
      this.productModel.countDocuments({ status: 'draft' }),
      this.productModel.countDocuments({ status: 'archived' }),
      this.productModel.countDocuments({ featured: true }),
      this.productModel.countDocuments({ suggested: true }),
      this.productModel.countDocuments({
        $or: [{ image: '' }, { image: { $exists: false } }],
      }),
      this.productModel.countDocuments({
        $or: [{ shopUrl: '' }, { shopUrl: { $exists: false } }],
      }),
      this.productModel.aggregate([
        { $group: { _id: '$room', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    return {
      total,
      published,
      draft,
      archived,
      featured,
      suggested,
      missingImage,
      missingShopUrl,
      byRoom: byRoom.map((r) => ({ room: r._id, count: r.count })),
    };
  }

  async suggestions() {
    const [noImage, noUrl, drafts, lowStock, unfeaturedLiving] =
      await Promise.all([
        this.productModel
          .find({ $or: [{ image: '' }, { image: { $exists: false } }] })
          .select('name slug room category image')
          .limit(12)
          .lean(),
        this.productModel
          .find({ $or: [{ shopUrl: '' }, { shopUrl: { $exists: false } }] })
          .select('name slug room category shopUrl')
          .limit(12)
          .lean(),
        this.productModel
          .find({ status: 'draft' })
          .select('name slug room category status updatedAt')
          .sort({ updatedAt: -1 })
          .limit(12)
          .lean(),
        this.productModel
          .find({ trackInventory: true, stockQty: { $lte: 3 } })
          .select('name slug stockQty trackInventory')
          .limit(12)
          .lean(),
        this.productModel
          .find({ room: 'living', featured: false, status: 'published' })
          .select('name slug room category image')
          .limit(8)
          .lean(),
      ]);

    const items: {
      id: string;
      title: string;
      description: string;
      severity: 'high' | 'medium' | 'low';
      actionHref?: string;
      products: unknown[];
    }[] = [];

    if (noImage.length) {
      items.push({
        id: 'missing-image',
        title: 'محصولات بدون تصویر',
        description: 'برای نمایش بهتر در فروشگاه، تصویر اصلی را اضافه کنید.',
        severity: 'high',
        actionHref: '/admin/shop?filter=missingImage',
        products: noImage,
      });
    }

    if (noUrl.length) {
      items.push({
        id: 'missing-shop-url',
        title: 'فاقد لینک فروشگاه',
        description: 'لینک خرید یا صفحه محصول خارجی ثبت نشده است.',
        severity: 'medium',
        actionHref: '/admin/shop?filter=missingShopUrl',
        products: noUrl,
      });
    }

    if (drafts.length) {
      items.push({
        id: 'drafts',
        title: 'پیش‌نویس‌های منتظر انتشار',
        description: 'این محصولات هنوز منتشر نشده‌اند.',
        severity: 'medium',
        actionHref: '/admin/shop?status=draft',
        products: drafts,
      });
    }

    if (lowStock.length) {
      items.push({
        id: 'low-stock',
        title: 'موجودی کم',
        description: 'موجودی ۳ عدد یا کمتر — موجودی را بررسی کنید.',
        severity: 'high',
        actionHref: '/admin/shop?filter=lowStock',
        products: lowStock,
      });
    }

    if (unfeaturedLiving.length) {
      items.push({
        id: 'feature-living',
        title: 'پیشنهاد ویترین نشیمن',
        description:
          'چند محصول نشیمن منتشرشده هنوز در ویترین منتخب نیستند؛ می‌توانید Featured کنید.',
        severity: 'low',
        actionHref: '/admin/shop?room=living',
        products: unfeaturedLiving,
      });
    }

    const marked = await this.productModel
      .find({ suggested: true })
      .select('name slug room category suggestionNote image')
      .limit(16)
      .lean();

    if (marked.length) {
      items.unshift({
        id: 'manual-suggestions',
        title: 'پیشنهادات علامت‌گذاری‌شده',
        description: 'محصولاتی که در پنل به‌عنوان پیشنهاد فروشگاهی علامت خورده‌اند.',
        severity: 'medium',
        actionHref: '/admin/shop?suggested=true',
        products: marked,
      });
    }

    return { items, count: items.length };
  }

  async seedFromCatalog(force = false) {
    if (force) {
      await this.productModel.deleteMany({ source: 'catalog' });
    }

    const filePath = join(
      process.cwd(),
      'src/modules/shop/data/shop-catalog.json',
    );
    const rows = JSON.parse(readFileSync(filePath, 'utf8')) as CatalogSeedRow[];

    const protectedProducts = await this.productModel.find({ source: { $ne: 'catalog' } }).select('slug').lean().exec();
    const protectedSlugs = new Set(protectedProducts.map((product) => product.slug));
    const docs = rows.filter((row) => !protectedSlugs.has(row.slug)).map((row, index) => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      room: row.room as
        | 'living'
        | 'bedroom'
        | 'bedding'
        | 'dining'
        | 'decor'
        | 'carpet'
        | 'lighting'
        | 'dishes',
      shortDescription: row.shortDescription || '',
      longDescription: '',
      image: row.image || '',
      gallery: row.gallery || (row.image ? [row.image] : []),
      shopUrl: row.shopUrl,
      series: getSeriesFromProduct(row)?.name ? canonicalSeriesName(getSeriesFromProduct(row)!.name) : undefined,
      price: row.prices?.value ? Number(row.prices.value) : undefined,
      compareAtPrice: row.prices?.regularValue ? Number(row.prices.regularValue) : undefined,
      finishes: [] as string[],
      status: 'published' as const,
      featured: false,
      suggested: false,
      stockQty: 0,
      trackInventory: false,
      specs: [] as { label: string; value: string }[],
      highlights: [] as { title: string; description: string }[],
      sortOrder: index,
      source: 'catalog',
    }));

    // bulkWrite upsert by slug
    const ops = docs.map((doc) => {
      // `slug` is the upsert key and must only be present in $setOnInsert;
      // MongoDB rejects updating the same path in both operators.
      const { slug: _slug, image: seedImage, gallery: seedGallery, ...catalogFields } = doc;
      return {
      updateOne: {
        filter: { slug: doc.slug },
        // Keep image URLs edited by admin or localized by the media migration.
        // New catalog rows still receive the complete seed document.
        // Every other field is already present in `$set`; repeating it in
        // `$setOnInsert` makes MongoDB reject the operation as a path conflict.
        update: { $set: catalogFields, $setOnInsert: { slug: doc.slug, image: seedImage, gallery: seedGallery } },
        upsert: true,
      },
      };
    });

    const result = ops.length ? await this.productModel.bulkWrite(ops as never) : { upsertedCount: 0, modifiedCount: 0 };
    const total = await this.productModel.countDocuments();

    return {
      ok: true,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total,
    };
  }

  async seedCollectionsFromCatalog() {
    const filePath = join(process.cwd(), 'src/modules/shop/data/shop-catalog.json');
    const rows = JSON.parse(readFileSync(filePath, 'utf8')) as CatalogSeedRow[];
    const groups = new Map<string, { name: string; slug: string; products: CatalogSeedRow[] }>();

    for (const row of rows) {
      const term = getSeriesFromProduct(row);
      if (!term?.name) continue;
      const name = canonicalSeriesName(term.name);
      const key = normalizeSeriesValue(name);
      const group = groups.get(key) || { name, slug: term.slug || key, products: [] };
      group.products.push(row);
      groups.set(key, group);
    }

    // A collection is a shared product series. Single-product names remain
    // product attributes but do not create an empty-looking collection page.
    const sharedGroups = [...groups.values()].filter((group) => group.products.length >= 2);
    const operations = sharedGroups.map((group) => {
      const productSlugs = group.products.map((product) => product.slug);
      const slug = `series-${group.slug}`;
      return {
        updateOne: {
          filter: { kind: 'collection', slug },
          update: {
            $setOnInsert: {
              kind: 'collection',
              slug,
              title: `کالکشن ${group.name}`,
              status: 'published',
              excerpt: `${productSlugs.length} محصول از سری ${group.name}`,
              description: '',
              images: group.products[0]?.image ? [group.products[0].image] : [],
              tags: [group.name],
              publishedAt: new Date(),
            },
            $set: {
              'data.productSlugs': productSlugs,
              'data.productIds': productSlugs,
              'data.productCount': productSlugs.length,
              'data.seriesName': group.name,
              'data.source': 'catalog-series',
            },
          },
          upsert: true,
        },
      };
    });

    const result = operations.length
      ? await this.collectionModel.bulkWrite(operations as never)
      : { upsertedCount: 0, modifiedCount: 0 };

    return {
      ok: true,
      collections: sharedGroups.length,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
    };
  }

  async categories() {
    const rows = await this.productModel.aggregate([
      {
        $group: {
          _id: { category: '$category', room: '$room' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    return rows.map((r) => ({
      category: r._id.category as string,
      room: r._id.room as string,
      count: r.count as number,
    }));
  }
}
