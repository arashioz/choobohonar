import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CmsEntry, CmsEntryDocument, CmsEntryKind, CmsEntryStatus } from './schemas/cms-entry.schema';

type EntryInput = Partial<CmsEntry> & { title?: string; slug?: string };

const validKinds: CmsEntryKind[] = ['product', 'material', 'project', 'collection', 'article'];

@Injectable()
export class CmsService implements OnModuleInit {
  constructor(@InjectModel(CmsEntry.name) private readonly entryModel: Model<CmsEntryDocument>) {}

  async onModuleInit() {
    if ((await this.entryModel.countDocuments()) > 0) return;
    await this.entryModel.insertMany([
      { kind: 'article', title: 'راهنمای انتخاب چوب برای فضای داخلی', slug: 'wood-selection-guide', status: 'published', excerpt: 'چطور میان گونه‌های مختلف چوب، انتخابی متناسب با فضا و سبک زندگی داشته باشیم.', content: 'هر گونه چوب، زبان و رفتار خاص خودش را دارد. در انتخاب چوب باید علاوه بر رنگ و رگه، به میزان استفاده، نور محیط و شیوه نگهداری توجه کرد.', tags: ['چوب', 'راهنمای خرید'], data: { author: 'تحریریه چوب و هنر', category: 'معرفی متریال', readingTime: '۶ دقیقه' }, publishedAt: new Date('2026-07-21') },
      { kind: 'article', title: 'مراقبت از مبلمان چوبی در تابستان', slug: 'summer-furniture-care', status: 'draft', excerpt: 'راهنمای ساده نگهداری از سطوح چوبی در برابر نور و خشکی هوا.', content: 'پیش‌نویس مقاله مراقبت فصلی از مبلمان چوبی.', tags: ['نگهداری'], data: { author: 'تحریریه چوب و هنر', category: 'نگهداری مبلمان', readingTime: '۴ دقیقه' } },
      { kind: 'product', title: 'میز ناهارخوری سرو', slug: 'sarv-dining-table', status: 'published', excerpt: 'میز ناهارخوری شش‌نفره با صفحه چوب طبیعی.', description: 'فرم آرام و ساختار مستحکم برای استفاده روزمره.', images: [], tags: ['میز', 'ناهارخوری'], data: { sku: 'CH-DT-101', category: 'میز و صندلی', price: 48500000, comparePrice: 0, currency: 'IRR', inventory: 4, manageStock: true, availability: 'in_stock', materials: ['چوب گردو'], dimensions: { width: 180, depth: 90, height: 76 }, leadTime: '۳ تا ۵ هفته' }, publishedAt: new Date('2026-07-18') },
      { kind: 'material', title: 'چوب گردو آمریکایی', slug: 'american-walnut', status: 'published', excerpt: 'چوب طبیعی با رگه‌های عمیق و طیف رنگ گرم.', description: 'مناسب برای سطوح نمایان و قطعات شاخص مبلمان.', data: { code: 'MAT-WD-01', materialType: 'چوب طبیعی', color: 'گردویی', finish: 'روغن مات', supplier: '', unit: 'متر مکعب', inventory: 2 }, publishedAt: new Date('2026-07-15') },
      { kind: 'project', title: 'ویلای لواسان', slug: 'lavasan-villa', status: 'published', excerpt: 'طراحی و اجرای مبلمان سفارشی یک ویلای معاصر.', description: 'روایت هماهنگی چوب طبیعی با نور و معماری پروژه.', data: { client: 'خصوصی', location: 'لواسان', year: '۱۴۰۴', area: 480, services: ['طراحی داخلی', 'ساخت سفارشی'] }, publishedAt: new Date('2026-07-10') },
      { kind: 'collection', title: 'کالکشن زیست', slug: 'zist-collection', status: 'draft', excerpt: 'مجموعه‌ای با تمرکز بر فرم‌های طبیعی و متریال صادق.', description: 'داستان کالکشن زیست از طبیعت و ریتم زندگی روزمره الهام می‌گیرد.', data: { season: 'پاییز ۱۴۰۵', productIds: [], featured: true } },
    ]);
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
