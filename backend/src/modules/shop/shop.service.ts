import {
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';
import * as XLSX from 'xlsx';
import {
  ShopProduct,
  ShopProductDocument,
  ProductRoom,
} from './schemas/shop-product.schema';
import { ShopCategory, ShopCategoryDocument } from './schemas/shop-category.schema';
import { CmsEntry, CmsEntryDocument } from '../cms/schemas/cms-entry.schema';
import {
  Collection,
  CollectionDocument,
} from '../collections/schemas/collection.schema';
import {
  CreateShopProductDto,
  UpdateShopProductDto,
} from './dto/shop-product.dto';

type CatalogSeedRow = {
  externalCode?: string;
  slug: string;
  name: string;
  category: string;
  room: string;
  status?: 'draft' | 'published' | 'archived';
  shortDescription?: string;
  image?: string;
  gallery?: string[];
  categories?: { id: number; name: string; slug: string }[];
  attributes?: unknown[];
  prices?: { value?: string | null; regularValue?: string | null } | null;
  variants?: {
    sku?: string;
    options?: { name: string; value: string }[];
    price?: number;
    compareAtPrice?: number;
    stockQty?: number;
    image?: string;
    enabled?: boolean;
  }[];
  longDescription?: string;
  specs?: { label: string; value: string }[];
  sortOrder?: number;
  shopUrl?: string;
  stockQty?: number;
  trackInventory?: boolean;
};

type CatalogCollectionTerm = { name: string; slug?: string };
type CatalogAttribute = {
  taxonomy?: string;
  name?: string;
  hasVariations?: boolean;
  terms?: CatalogCollectionTerm[];
};

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

function normalizeImportName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[آأإ]/g, 'ا')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalSeriesName(value: string): string {
  return SERIES_ALIASES[normalizeSeriesValue(value)] || value.trim();
}

function getSeriesFromProduct(
  row: CatalogSeedRow,
): CatalogCollectionTerm | undefined {
  const attributes = (row.attributes || []) as CatalogAttribute[];
  const terms = attributes
    .filter(
      (attribute) =>
        attribute.taxonomy === 'pa_collection' || attribute.name === 'کالکشن',
    )
    .flatMap((attribute) => attribute.terms || []);
  const normalizedName = normalizeSeriesValue(row.name);

  // Product titles are the authority here. Some legacy products carry extra
  // collection terms that do not appear in their names.
  return terms.find((term) =>
    normalizedName.includes(
      normalizeSeriesValue(canonicalSeriesName(term.name)),
    ),
  );
}

@Injectable()
export class ShopService implements OnModuleInit {
  constructor(
    @InjectModel(ShopProduct.name)
    private productModel: Model<ShopProductDocument>,
    @InjectModel(CmsEntry.name)
    private collectionModel: Model<CmsEntryDocument>,
    @InjectModel(Collection.name)
    private readonly namedCollectionModel: Model<CollectionDocument>,
    @InjectModel(ShopCategory.name)
    private readonly categoryModel: Model<ShopCategoryDocument>,
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
    // "unpublished" is an admin-facing aggregate: both drafts and archived
    // products are intentionally absent from the public catalog.
    if (query.status === 'unpublished') {
      filter.status = { $in: ['draft', 'archived'] };
    } else if (query.status) {
      filter.status = query.status;
    }
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

  async importPriceFile(file?: { buffer: Buffer; originalname: string }) {
    if (!file?.buffer?.length || !/\.xlsx$/i.test(file.originalname))
      throw new ConflictException('فایل اکسل معتبر نیست');
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const hasCatalogColumns = workbook.SheetNames.some((sheetName) => {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: null, range: 0 },
      );
      return rows.some(
        (row) => 'شناسه محصول' in row && 'قیمت جدید (تومان)' in row,
      );
    });
    if (hasCatalogColumns) return this.importCatalogPriceFile(workbook);
    return this.importLegacyPriceFile(workbook, file.originalname);
  }

  async exportPriceFile() {
    const products = await this.productModel
      .find({})
      .sort({ name: 1 })
      .lean()
      .exec();
    const rows = products.flatMap((product) => {
      const base = {
        'شناسه محصول': String(product._id),
        'نام محصول': product.name,
        دسته‌بندی: product.category,
      };
      if (!product.variants?.length)
        return [
          {
            ...base,
            'نوع ردیف': 'محصول',
            'شناسه واریانت': '',
            'کد کالا': product.externalCode || '',
            واریانت: '',
            'قیمت فعلی (تومان)': product.price ?? '',
            'قیمت جدید (تومان)': product.price ?? '',
          },
        ];
      return product.variants.map((variant: any) => ({
        ...base,
        'نوع ردیف': 'واریانت',
        'شناسه واریانت': String(variant._id || ''),
        'کد کالا': variant.sku || '',
        واریانت: (variant.options || [])
          .map((option) => `${option.name}: ${option.value}`)
          .join('، '),
        'قیمت فعلی (تومان)': variant.price ?? product.price ?? '',
        'قیمت جدید (تومان)': variant.price ?? product.price ?? '',
      }));
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [18, 18, 15, 28, 24, 18, 32, 20, 20].map((wch) => ({
      wch,
    }));
    XLSX.utils.book_append_sheet(workbook, worksheet, 'قیمت محصولات');
    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  private priceFromCell(value: unknown): number | undefined {
    const normalized = String(value ?? '')
      .replace(/[۰-۹]/g, (char) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char)))
      .replace(/[٬,\s]/g, '');
    const price = Number(normalized);
    return Number.isFinite(price) && price >= 0 ? Math.round(price) : undefined;
  }

  private async importCatalogPriceFile(workbook: XLSX.WorkBook) {
    const catalog = await this.productModel
      .find({})
      .select('_id name price variants')
      .lean()
      .exec();
    const byId = new Map(
      catalog.map((product) => [String(product._id), product]),
    );
    let updated = 0,
      unchanged = 0,
      skipped = 0;
    for (const sheetName of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: null },
      );
      for (const row of rows) {
        const product = byId.get(String(row['شناسه محصول'] ?? '').trim());
        const price = this.priceFromCell(row['قیمت جدید (تومان)']);
        if (!product || price === undefined) {
          skipped++;
          continue;
        }
        const variantId = String(row['شناسه واریانت'] ?? '').trim();
        const sku = String(row['کد کالا'] ?? '').trim();
        if (variantId || sku) {
          const variantIndex = product.variants?.findIndex(
            (item: any) =>
              String(item._id) === variantId ||
              (!variantId && sku && item.sku === sku),
          );
          if (variantIndex === undefined || variantIndex === -1) {
            skipped++;
            continue;
          }
          const variant = product.variants[variantIndex];
          if (variant.price === price) {
            unchanged++;
            continue;
          }
          await this.productModel.updateOne(
            { _id: product._id },
            { $set: { [`variants.${variantIndex}.price`]: price } },
          );
          variant.price = price;
          updated++;
        } else {
          if (product.price === price) {
            unchanged++;
            continue;
          }
          await this.productModel.updateOne(
            { _id: product._id },
            { $set: { price } },
          );
          product.price = price;
          updated++;
        }
      }
    }
    return {
      updated,
      unchanged,
      skipped,
      created: 0,
      archived: 0,
      format: 'catalog',
    };
  }

  private async importLegacyPriceFile(
    workbook: XLSX.WorkBook,
    originalname: string,
  ) {
    const archive = /حذف\s*از\s*تولید/i.test(originalname);
    const catalog = await this.productModel
      .find({})
      .select('name externalCode variants')
      .lean()
      .exec();
    let updated = 0,
      created = 0,
      archived = 0,
      skipped = 0;
    for (const sheetName of workbook.SheetNames) {
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: null },
      );
      for (const row of rows) {
        const code = String(row['کد کالا'] ?? '').trim();
        const name = String(row['شرح کالا'] ?? '').trim();
        const priceRial = Number(row['قیمت جدید'] ?? row['قیمت جدید '] ?? 0);
        if (!code || !name) {
          skipped++;
          continue;
        }
        const nameMatches = catalog.filter(
          (product) =>
            normalizeImportName(product.name) === normalizeImportName(name),
        );
        const existing =
          catalog.find(
            (product) =>
              product.externalCode === code ||
              product.variants?.some((variant) => variant.sku === code),
          ) || (nameMatches.length === 1 ? nameMatches[0] : null);
        if (existing) {
          if (archive) {
            await this.productModel.updateOne(
              { _id: existing._id },
              { $set: { status: 'archived' } },
            );
            archived++;
          } else if (Number.isFinite(priceRial) && priceRial > 0) {
            await this.productModel.updateOne(
              { _id: existing._id },
              {
                $set: { price: Math.round(priceRial / 10), externalCode: code },
              },
            );
            updated++;
          } else skipped++;
          continue;
        }
        if (archive || !Number.isFinite(priceRial) || priceRial <= 0) {
          skipped++;
          continue;
        }
        const category = String(row['دسته بندی'] ?? 'محصول جدید').trim();
        await this.productModel.create({
          externalCode: code,
          slug: `import-${code}`,
          name,
          category,
          room: this.roomFromCategory(category),
          price: Math.round(priceRial / 10),
          status: 'draft',
          source: 'price-import',
        });
        created++;
      }
    }
    return { updated, created, archived, skipped, archive };
  }

  private roomFromCategory(category: string): ProductRoom {
    if (
      /تشک|بالش|روتختی|ملحفه|پتو|لحاف|کاور|روبالشی|سرویس\s*خواب|محافظ\s*تشک/.test(
        category,
      )
    )
      return 'bedding';
    if (/آباژور|لوستر|چراغ|روشن/.test(category)) return 'lighting';
    if (/فرش|گلیم/.test(category)) return 'carpet';
    return 'decor';
  }

  async create(dto: CreateShopProductDto) {
    const exists = await this.productModel.exists({ slug: dto.slug });
    if (exists) throw new ConflictException('این اسلاگ قبلاً استفاده شده');

    const autoSeries =
      dto.series === undefined
        ? await this.seriesFromProductName(dto.name)
        : undefined;
    return this.productModel.create({
      ...dto,
      ...(autoSeries ? { series: autoSeries } : {}),
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

    const autoSeries =
      dto.name !== undefined && dto.series === undefined
        ? await this.seriesFromProductName(dto.name)
        : undefined;
    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        { $set: { ...dto, ...(autoSeries ? { series: autoSeries } : {}) } },
        { new: true },
      )
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
      unpublished: draft + archived,
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
        description:
          'محصولاتی که در پنل به‌عنوان پیشنهاد فروشگاهی علامت خورده‌اند.',
        severity: 'medium',
        actionHref: '/admin/shop?suggested=true',
        products: marked,
      });
    }

    return { items, count: items.length };
  }

  async seedFromCatalog(force = false, replaceAll = false) {
    if (replaceAll) {
      // This operation is available only through the JWT-protected seed API.
      // It intentionally removes manually created records too, for a clean
      // replacement migration from the WooCommerce export.
      await this.productModel.deleteMany({});
    } else if (force) {
      await this.productModel.deleteMany({
        source: { $in: ['catalog', 'wordpress-csv-2026-09-15'] },
      });
    }

    const rows = this.readWordPressCatalog();

    const protectedProducts = await this.productModel
      .find({ source: { $nin: ['catalog', 'wordpress-csv-2026-09-15'] } })
      .select('slug')
      .lean()
      .exec();
    const protectedSlugs = new Set(
      protectedProducts.map((product) => product.slug),
    );
    const docs = rows
      .filter((row) => !protectedSlugs.has(row.slug))
      .map((row, index) => ({
        externalCode: row.externalCode,
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
        longDescription: row.longDescription || '',
        image: row.image || '',
        gallery: row.gallery || (row.image ? [row.image] : []),
        shopUrl: row.shopUrl,
        series: getSeriesFromProduct(row)?.name
          ? canonicalSeriesName(getSeriesFromProduct(row)!.name)
          : undefined,
        price: row.prices?.value ? Number(row.prices.value) : undefined,
        compareAtPrice: row.prices?.regularValue
          ? Number(row.prices.regularValue)
          : undefined,
        finishes: [] as string[],
        status: row.status || 'published',
        featured: false,
        suggested: false,
        stockQty:
          row.stockQty ??
          (row.variants?.length
            ? row.variants.reduce(
                (total, variant) => total + (variant.stockQty || 0),
                0,
              )
            : 0),
        trackInventory: Boolean(row.trackInventory),
        specs: row.specs || [],
        highlights: [] as { title: string; description: string }[],
        attributes: ((row.attributes || []) as CatalogAttribute[])
          .map((attribute) => ({
            name: attribute.name || '',
            values: (attribute.terms || [])
              .map((term) => term.name)
              .filter(Boolean),
            required: Boolean(attribute.hasVariations),
          }))
          .filter((attribute) => attribute.name && attribute.values.length),
        variants: (row.variants || []).map((variant) => ({
          sku: variant.sku,
          options: variant.options || [],
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          stockQty: variant.stockQty || 0,
          image: variant.image,
          enabled: variant.enabled !== false,
        })),
        sortOrder: row.sortOrder ?? index,
        source: 'catalog',
      }));

    // bulkWrite upsert by slug
    const ops = docs.map((doc) => {
      // `slug` is the upsert key and must only be present in $setOnInsert;
      // MongoDB rejects updating the same path in both operators.
      const {
        slug: _slug,
        image: seedImage,
        gallery: seedGallery,
        ...catalogFields
      } = doc;
      return {
        updateOne: {
          filter: { slug: doc.slug },
          // Keep image URLs edited by admin or localized by the media migration.
          // New catalog rows still receive the complete seed document.
          // Every other field is already present in `$set`; repeating it in
          // `$setOnInsert` makes MongoDB reject the operation as a path conflict.
          update: {
            $set: catalogFields,
            $setOnInsert: {
              slug: doc.slug,
              image: seedImage,
              gallery: seedGallery,
            },
          },
          upsert: true,
        },
      };
    });

    const result = ops.length
      ? await this.productModel.bulkWrite(ops as never)
      : { upsertedCount: 0, modifiedCount: 0 };
    const total = await this.productModel.countDocuments();
    const categoryResult = await this.seedCategoriesFromCatalog(replaceAll);

    return {
      ok: true,
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total,
      categories: categoryResult.categories,
      replaced: replaceAll,
    };
  }

  /**
   * Imports a portable catalog JSON uploaded through the admin API. Image
   * references may be full `/uploads/...` URLs or just filenames placed in
   * `uploads/products`; bare filenames are made public automatically.
   */
  async importCatalogFile(
    file: { buffer: Buffer; originalname: string },
    replaceAll = false,
  ) {
    if (!file?.buffer?.length || !/\.json$/i.test(file.originalname)) {
      throw new ConflictException('فایل JSON کاتالوگ معتبر نیست');
    }
    let rows: unknown;
    try {
      rows = JSON.parse(file.buffer.toString('utf8'));
    } catch {
      throw new ConflictException('محتوای JSON کاتالوگ معتبر نیست');
    }
    if (
      !Array.isArray(rows) ||
      !rows.length ||
      !rows.every(
        (row) =>
          row &&
          typeof row === 'object' &&
          typeof (row as CatalogSeedRow).slug === 'string' &&
          typeof (row as CatalogSeedRow).name === 'string' &&
          typeof (row as CatalogSeedRow).category === 'string' &&
          typeof (row as CatalogSeedRow).room === 'string',
      )
    ) {
      throw new ConflictException('هر محصول باید slug، نام، دسته و فضا داشته باشد');
    }

    const normalizedRows = (rows as CatalogSeedRow[]).map((row) => ({
      ...row,
      image: this.localMediaUrl(row.image),
      gallery: (row.gallery || []).map((image) => this.localMediaUrl(image)),
    }));
    const importDir = join(process.cwd(), 'uploads', 'imports');
    mkdirSync(importDir, { recursive: true });
    writeFileSync(
      join(importDir, 'wordpress-csv-catalog.local.json'),
      `${JSON.stringify(normalizedRows, null, 2)}\n`,
    );
    return this.seedFromCatalog(false, replaceAll);
  }

  async seedCollectionsFromCatalog() {
    const rows = this.readWordPressCatalog();
    const groups = new Map<
      string,
      { name: string; slug: string; products: CatalogSeedRow[] }
    >();

    for (const row of rows) {
      const term = getSeriesFromProduct(row);
      if (!term?.name) continue;
      const name = canonicalSeriesName(term.name);
      const key = normalizeSeriesValue(name);
      const group = groups.get(key) || {
        name,
        slug: term.slug || key,
        products: [],
      };
      group.products.push(row);
      groups.set(key, group);
    }

    // A collection represents a shared series. Single-product series remain
    // regular products and must not create a redundant collection page.
    const sharedGroups = [...groups.values()].filter(
      (group) => group.products.length >= 2,
    );
    const singleProductSlugs = [...groups.values()]
      .filter((group) => group.products.length < 2)
      .map((group) => group.slug);
    // Hide only automatically generated single-product collections. Manually
    // managed collections retain their own source and are never touched here.
    if (singleProductSlugs.length)
      await this.collectionModel
        .updateMany(
          {
            kind: 'collection',
            slug: { $in: singleProductSlugs },
            'data.source': 'catalog-series',
          },
          { $set: { status: 'archived' } },
        )
        .exec();
    // Older releases named generated records `series-*`. Archive those
    // generated duplicates and keep the original WordPress collection slug as
    // the single canonical public/admin record (e.g. `/collection/solo`).
    const legacyGeneratedSlugs = sharedGroups.map(
      (group) => `series-${group.slug}`,
    );
    if (legacyGeneratedSlugs.length)
      await this.collectionModel
        .updateMany(
          {
            kind: 'collection',
            slug: { $in: legacyGeneratedSlugs },
            'data.source': 'catalog-series',
          },
          { $set: { status: 'archived' } },
        )
        .exec();
    const operations = sharedGroups.map((group) => {
      const productSlugs = group.products.map((product) => product.slug);
      const slug = group.slug;

      // Keep the actual catalog URL. A WordPress filename cannot be used to
      // reconstruct a local upload path because downloaded assets are hashed.
      const firstImage = group.products[0]?.image || '';

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
              images: firstImage ? [firstImage] : [],
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
    const seededCategories = await this.categoryModel
      .find({ source: 'wordpress-csv-2026-09-15' })
      .sort({ sortOrder: 1 })
      .lean()
      .exec();
    if (seededCategories.length) {
      return seededCategories.map((category) => ({
        slug: category.slug,
        parentSlug: category.parentSlug,
        category: category.name,
        room: category.room,
        count: category.productCount,
        depth: category.depth,
      }));
    }
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

  async seedCategoriesFromCatalog(replaceAll = false) {
    const treePath = join(
      process.cwd(),
      'src/modules/shop/data/wordpress-category-tree.json',
    );
    const tree = JSON.parse(readFileSync(treePath, 'utf8')) as {
      categories?: Array<{
        name: string;
        slug: string;
        productCount: number;
        children?: unknown[];
      }>;
    };
    const roomByRoot: Record<string, ProductRoom> = {
      نشیمن: 'living',
      'اتاق خواب': 'bedroom',
      'کالای خواب': 'bedding',
      غذاخوری: 'dining',
      روشنایی: 'lighting',
      دکور: 'decor',
      اکسسوری: 'decor',
      ظروف: 'dishes',
      'فرش و گلیم': 'carpet',
    };
    const rows: Array<{
      slug: string;
      name: string;
      parentSlug: string;
      room: ProductRoom;
      productCount: number;
      depth: number;
      sortOrder: number;
      source: string;
    }> = [];
    const visit = (
      nodes: Array<{ name: string; slug: string; productCount: number; children?: unknown[] }>,
      parentSlug: string,
      inheritedRoom: ProductRoom | undefined,
      depth: number,
    ) => {
      nodes.forEach((node, index) => {
        const room = inheritedRoom || roomByRoot[node.name] || 'decor';
        const slug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
        rows.push({
          slug,
          name: node.name,
          parentSlug,
          room,
          productCount: node.productCount,
          depth,
          sortOrder: rows.length + index,
          source: 'wordpress-csv-2026-09-15',
        });
        visit((node.children || []) as Array<{ name: string; slug: string; productCount: number; children?: unknown[] }>, slug, room, depth + 1);
      });
    };
    visit(tree.categories || [], '', undefined, 0);

    if (replaceAll) await this.categoryModel.deleteMany({}).exec();
    const ops = rows.map((row) => ({
      updateOne: {
        filter: { slug: row.slug },
        update: { $set: row },
        upsert: true,
      },
    }));
    if (ops.length) await this.categoryModel.bulkWrite(ops as never);
    return { ok: true, categories: rows.length };
  }

  /** Prefer the portable catalog with local `/uploads/products` media when
   * it has been generated and deployed alongside the downloaded images. */
  private readWordPressCatalog(): CatalogSeedRow[] {
    const dataDir = join(process.cwd(), 'src/modules/shop/data');
    const importedPath = join(
      process.cwd(),
      'uploads',
      'imports',
      'wordpress-csv-catalog.local.json',
    );
    const localPath = join(dataDir, 'wordpress-csv-catalog.local.json');
    const sourcePath = existsSync(importedPath)
      ? importedPath
      : existsSync(localPath)
        ? localPath
        : join(dataDir, 'wordpress-csv-catalog.json');
    return JSON.parse(readFileSync(sourcePath, 'utf8')) as CatalogSeedRow[];
  }

  private localMediaUrl(value?: string): string {
    if (!value) return '';
    if (/^(?:https?:)?\/\//i.test(value) || value.startsWith('/uploads/'))
      return value;
    return `/uploads/products/${basename(value)}`;
  }

  private async seriesFromProductName(
    name: string,
  ): Promise<string | undefined> {
    const normalizedName = normalizeSeriesValue(name);
    const collections = await this.namedCollectionModel
      .find({ status: { $ne: 'archived' } })
      .select('name series')
      .lean()
      .exec();
    const matches = collections
      .map((collection) => ({
        name: String(collection.name || '')
          .replace(/^کالکشن\s+/u, '')
          .trim(),
        series: String(collection.series || '').trim(),
      }))
      .filter(
        (collection) =>
          collection.name &&
          normalizedName.includes(normalizeSeriesValue(collection.name)),
      )
      .sort(
        (a, b) =>
          normalizeSeriesValue(b.name).length -
          normalizeSeriesValue(a.name).length,
      );
    if (!matches.length) return undefined;
    if (
      matches.length > 1 &&
      normalizeSeriesValue(matches[0].name).length ===
        normalizeSeriesValue(matches[1].name).length
    )
      return undefined;
    return matches[0].series || matches[0].name;
  }
}
