import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import { CmsEntry, CmsEntryDocument, CmsEntryKind, CmsEntryStatus } from './schemas/cms-entry.schema';

type EntryInput = Partial<CmsEntry> & { title?: string; slug?: string };

const validKinds: CmsEntryKind[] = ['product', 'material', 'project', 'collection', 'article', 'page'];

@Injectable()
export class CmsService implements OnModuleInit {
  constructor(@InjectModel(CmsEntry.name) private readonly entryModel: Model<CmsEntryDocument>) {}

  async onModuleInit() {
    if ((await this.entryModel.countDocuments()) === 0) await this.entryModel.insertMany([
      { kind: 'article', title: 'راهنمای انتخاب چوب برای فضای داخلی', slug: 'wood-selection-guide', status: 'published', excerpt: 'چطور میان گونه‌های مختلف چوب، انتخابی متناسب با فضا و سبک زندگی داشته باشیم.', content: 'هر گونه چوب، زبان و رفتار خاص خودش را دارد. در انتخاب چوب باید علاوه بر رنگ و رگه، به میزان استفاده، نور محیط و شیوه نگهداری توجه کرد.', tags: ['چوب', 'راهنمای خرید'], data: { author: 'تحریریه چوب و هنر', category: 'معرفی متریال', readingTime: '۶ دقیقه' }, publishedAt: new Date('2026-07-21') },
      { kind: 'article', title: 'مراقبت از مبلمان چوبی در تابستان', slug: 'summer-furniture-care', status: 'draft', excerpt: 'راهنمای ساده نگهداری از سطوح چوبی در برابر نور و خشکی هوا.', content: 'پیش‌نویس مقاله مراقبت فصلی از مبلمان چوبی.', tags: ['نگهداری'], data: { author: 'تحریریه چوب و هنر', category: 'نگهداری مبلمان', readingTime: '۴ دقیقه' } },
      { kind: 'product', title: 'میز ناهارخوری سرو', slug: 'sarv-dining-table', status: 'published', excerpt: 'میز ناهارخوری شش‌نفره با صفحه چوب طبیعی.', description: 'فرم آرام و ساختار مستحکم برای استفاده روزمره.', images: [], tags: ['میز', 'ناهارخوری'], data: { sku: 'CH-DT-101', category: 'میز و صندلی', price: 48500000, comparePrice: 0, currency: 'IRR', inventory: 4, manageStock: true, availability: 'in_stock', materials: ['چوب گردو'], dimensions: { width: 180, depth: 90, height: 76 }, leadTime: '۳ تا ۵ هفته' }, publishedAt: new Date('2026-07-18') },
      { kind: 'material', title: 'چوب گردو آمریکایی', slug: 'american-walnut', status: 'published', excerpt: 'چوب طبیعی با رگه‌های عمیق و طیف رنگ گرم.', description: 'مناسب برای سطوح نمایان و قطعات شاخص مبلمان.', data: { code: 'MAT-WD-01', materialType: 'چوب طبیعی', color: 'گردویی', finish: 'روغن مات', supplier: '', unit: 'متر مکعب', inventory: 2 }, publishedAt: new Date('2026-07-15') },
      { kind: 'project', title: 'ویلای لواسان', slug: 'lavasan-villa', status: 'published', excerpt: 'طراحی و اجرای مبلمان سفارشی یک ویلای معاصر.', description: 'روایت هماهنگی چوب طبیعی با نور و معماری پروژه.', data: { client: 'خصوصی', location: 'لواسان', year: '۱۴۰۴', area: 480, services: ['طراحی داخلی', 'ساخت سفارشی'] }, publishedAt: new Date('2026-07-10') },
      { kind: 'collection', title: 'کالکشن زیست', slug: 'zist-collection', status: 'draft', excerpt: 'مجموعه‌ای با تمرکز بر فرم‌های طبیعی و متریال صادق.', description: 'داستان کالکشن زیست از طبیعت و ریتم زندگی روزمره الهام می‌گیرد.', data: { season: 'پاییز ۱۴۰۵', productIds: [], featured: true } },
    ]);
    await this.seedEditorialArticles();
    await this.seedLegacyContent('project', 'legacy-projects.json');
    await this.seedLegacyContent('material', 'legacy-materials.json');
    await this.seedLegacyContent('collection', 'legacy-collections.json');
    await this.seedPageData('stores', 'legacy-stores.json', 'شعب و نمایندگی‌ها');
    await this.seedPageData('work-areas', 'legacy-work-areas.json', 'حوزه‌های کاری');
    await this.seedPageData('gallery', 'legacy-gallery.json', 'گالری');
  }

  assertKind(kind: string): CmsEntryKind {
    if (!validKinds.includes(kind as CmsEntryKind)) throw new BadRequestException('Unsupported CMS entry kind');
    return kind as CmsEntryKind;
  }

  async list(kindValue: string, query?: string, status?: string, limitValue?: string) {
    const kind = this.assertKind(kindValue);
    const filter: Record<string, unknown> = { kind };
    if (status && ['draft', 'published', 'archived'].includes(status)) filter.status = status;
    if (query?.trim()) filter.$or = [
      { title: { $regex: query.trim(), $options: 'i' } },
      { slug: { $regex: query.trim(), $options: 'i' } },
      { tags: { $in: [new RegExp(query.trim(), 'i')] } },
    ];
    const limit = Math.min(Math.max(Number(limitValue) || 100, 1), 250);
    const [items, total] = await Promise.all([
      this.entryModel.find(filter).sort({ updatedAt: -1 }).limit(limit).lean().exec(),
      this.entryModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async get(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const lookup = Types.ObjectId.isValid(id) ? { _id: id, kind } : { slug: id, kind };
    const entry = await this.entryModel.findOne(lookup).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async create(kindValue: string, input: EntryInput) {
    const kind = this.assertKind(kindValue);
    if (!input.title?.trim()) throw new BadRequestException('Title is required');
    const slug = this.normalizeSlug(input.slug || input.title);
    try {
      return await this.entryModel.create(this.sanitizeInput({ ...input, kind, slug }));
    } catch (error: any) {
      if (error?.code === 11000) throw new BadRequestException('Slug already exists');
      throw error;
    }
  }

  async update(kindValue: string, id: string, input: EntryInput) {
    const kind = this.assertKind(kindValue);
    const update = this.sanitizeInput(input);
    if (input.slug) update.slug = this.normalizeSlug(input.slug);
    const entry = await this.entryModel.findOneAndUpdate({ _id: id, kind }, update, { new: true, runValidators: true }).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async publish(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel.findOneAndUpdate({ _id: id, kind }, { status: 'published', publishedAt: new Date() }, { new: true }).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async archive(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel.findOneAndUpdate({ _id: id, kind }, { status: 'archived' }, { new: true }).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async remove(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel.findOneAndDelete({ _id: id, kind }).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return { ok: true };
  }

  async publicList(kindValue: string, slug?: string) {
    const kind = this.assertKind(kindValue);
    if (slug) return this.getPublished(kind, slug);
    return this.entryModel.find({ kind, status: 'published' }).sort({ publishedAt: -1 }).lean().exec();
  }

  async taxonomy(kindValue: string) {
    const kind = this.assertKind(kindValue);
    const [categories, tags] = await Promise.all([
      this.entryModel.aggregate([{ $match: { kind } }, { $project: { value: '$data.category' } }, { $match: { value: { $type: 'string', $ne: '' } } }, { $group: { _id: '$value' } }, { $sort: { _id: 1 } }]),
      this.entryModel.aggregate([{ $match: { kind } }, { $unwind: '$tags' }, { $match: { tags: { $type: 'string', $ne: '' } } }, { $group: { _id: '$tags' } }, { $sort: { _id: 1 } }]),
    ]);
    return { categories: categories.map((item) => item._id), tags: tags.map((item) => item._id) };
  }

  private async seedEditorialArticles() {
    const filePath = join(process.cwd(), 'src/modules/cms/data/editorial-posts.json');
    try {
      const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<Record<string, any>>;
      const operations = rows.filter((row) => row.slug && row.title).map((row) => ({
        updateOne: {
          filter: { kind: 'article', slug: row.slug },
          update: { $setOnInsert: { kind: 'article', title: row.title, slug: row.slug, status: 'published', excerpt: row.excerpt || '', content: Array.isArray(row.content) ? row.content.map((block: { text?: string }) => block.text || '').filter(Boolean).join('\n\n') : String(row.content || ''), images: row.coverImage ? [row.coverImage] : [], seo: { title: row.title, description: row.metaDescription || '' }, data: { author: row.author || 'تحریریه خانه چوب و هنر', category: row.category || 'مقالات آموزشی', readingTime: row.readingTime || '' }, tags: row.tags || [], publishedAt: new Date() } },
          upsert: true,
        },
      }));
      if (operations.length) await this.entryModel.bulkWrite(operations as never);
    } catch (error) {
      console.warn('[cms] editorial seed skipped:', error instanceof Error ? error.message : error);
    }
  }

  private async seedLegacyContent(kind: CmsEntryKind, filename: string) {
    const filePath = join(process.cwd(), `src/modules/cms/data/${filename}`);
    try {
      const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<Record<string, any>>;
      const operations = rows.filter((row) => row.slug && (row.title || row.name || row.label)).map((row) => {
        const title = String(row.title || row.name || row.label);
        const images = [row.image, ...(Array.isArray(row.featuredImages) ? row.featuredImages : []), ...(Array.isArray(row.gallery) ? row.gallery.map((item: any) => typeof item === 'string' ? item : item?.src) : []), ...(Array.isArray(row.sections) ? row.sections.map((item: any) => item?.image) : [])].filter((image): image is string => typeof image === 'string' && image.length > 0).filter((image, index, all) => all.indexOf(image) === index);
        return { updateOne: { filter: { kind, slug: row.slug }, update: { $setOnInsert: { kind, title, slug: row.slug, status: 'published', excerpt: row.excerpt || row.summary || row.shortDescription || '', description: row.description || row.longDescription || '', content: row.description || row.longDescription || '', images, data: row, tags: Array.isArray(row.tags) ? row.tags : Array.isArray(row.scope) ? row.scope : [], publishedAt: new Date() } }, upsert: true } };
      });
      if (operations.length) await this.entryModel.bulkWrite(operations as never);
    } catch (error) {
      console.warn(`[cms] ${kind} seed skipped:`, error instanceof Error ? error.message : error);
    }
  }

  private async seedPageData(slug: string, filename: string, title: string) {
    const filePath = join(process.cwd(), `src/modules/cms/data/${filename}`);
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      await this.entryModel.updateOne(
        { kind: 'page', slug },
        { $setOnInsert: { kind: 'page', slug, title, status: 'published', content: '', data: { items: data }, tags: [], publishedAt: new Date() } },
        { upsert: true },
      ).exec();
    } catch (error) {
      console.warn(`[cms] page seed skipped (${slug}):`, error instanceof Error ? error.message : error);
    }
  }

  private async getPublished(kind: CmsEntryKind, slug: string) {
    const entry = await this.entryModel.findOne({ kind, slug, status: 'published' }).lean().exec();
    if (!entry) throw new NotFoundException('Published entry not found');
    return entry;
  }

  private normalizeSlug(value: string) {
    return value.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}-]+/gu, '').replace(/-+/g, '-').replace(/^-|-$/g, '') || `entry-${Date.now()}`;
  }

  private sanitizeInput(input: EntryInput & { kind?: CmsEntryKind }) {
    const allowed: Record<string, unknown> = {};
    const keys = ['kind', 'title', 'slug', 'status', 'excerpt', 'description', 'content', 'images', 'seo', 'data', 'tags', 'publishedAt'];
    for (const key of keys) if ((input as Record<string, unknown>)[key] !== undefined) allowed[key] = (input as Record<string, unknown>)[key];
    if (allowed.status && !['draft', 'published', 'archived'].includes(allowed.status as CmsEntryStatus)) allowed.status = 'draft';
    return allowed;
  }
}
