import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  CmsEntry,
  CmsEntryDocument,
  CmsEntryKind,
  CmsEntryStatus,
} from './schemas/cms-entry.schema';

type EntryInput = Partial<CmsEntry> & { title?: string; slug?: string };

const validKinds: CmsEntryKind[] = [
  'product',
  'material',
  'project',
  'collection',
  'story',
  'article',
  'page',
];

@Injectable()
export class CmsService implements OnModuleInit {
  constructor(
    @InjectModel(CmsEntry.name)
    private readonly entryModel: Model<CmsEntryDocument>,
  ) {}

  async onModuleInit() {
    if ((await this.entryModel.countDocuments()) === 0)
      await this.entryModel.insertMany([
        {
          kind: 'article',
          title: 'راهنمای انتخاب چوب برای فضای داخلی',
          slug: 'wood-selection-guide',
          status: 'published',
          excerpt:
            'چطور میان گونه‌های مختلف چوب، انتخابی متناسب با فضا و سبک زندگی داشته باشیم.',
          content:
            'هر گونه چوب، زبان و رفتار خاص خودش را دارد. در انتخاب چوب باید علاوه بر رنگ و رگه، به میزان استفاده، نور محیط و شیوه نگهداری توجه کرد.',
          tags: ['چوب', 'راهنمای خرید'],
          data: {
            author: 'تحریریه چوب و هنر',
            category: 'معرفی متریال',
            readingTime: '۶ دقیقه',
          },
          publishedAt: new Date('2026-07-21'),
        },
        {
          kind: 'article',
          title: 'مراقبت از مبلمان چوبی در تابستان',
          slug: 'summer-furniture-care',
          status: 'draft',
          excerpt: 'راهنمای ساده نگهداری از سطوح چوبی در برابر نور و خشکی هوا.',
          content: 'پیش‌نویس مقاله مراقبت فصلی از مبلمان چوبی.',
          tags: ['نگهداری'],
          data: {
            author: 'تحریریه چوب و هنر',
            category: 'نگهداری مبلمان',
            readingTime: '۴ دقیقه',
          },
        },
        {
          kind: 'product',
          title: 'میز ناهارخوری سرو',
          slug: 'sarv-dining-table',
          status: 'published',
          excerpt: 'میز ناهارخوری شش‌نفره با صفحه چوب طبیعی.',
          description: 'فرم آرام و ساختار مستحکم برای استفاده روزمره.',
          images: [],
          tags: ['میز', 'ناهارخوری'],
          data: {
            sku: 'CH-DT-101',
            category: 'میز و صندلی',
            price: 48500000,
            comparePrice: 0,
            currency: 'IRR',
            inventory: 4,
            manageStock: true,
            availability: 'in_stock',
            materials: ['چوب گردو'],
            dimensions: { width: 180, depth: 90, height: 76 },
            leadTime: '۳ تا ۵ هفته',
          },
          publishedAt: new Date('2026-07-18'),
        },
        {
          kind: 'material',
          title: 'چوب گردو آمریکایی',
          slug: 'american-walnut',
          status: 'published',
          excerpt: 'چوب طبیعی با رگه‌های عمیق و طیف رنگ گرم.',
          description: 'مناسب برای سطوح نمایان و قطعات شاخص مبلمان.',
          data: {
            code: 'MAT-WD-01',
            materialType: 'چوب طبیعی',
            color: 'گردویی',
            finish: 'روغن مات',
            supplier: '',
            unit: 'متر مکعب',
            inventory: 2,
          },
          publishedAt: new Date('2026-07-15'),
        },
        {
          kind: 'project',
          title: 'ویلای لواسان',
          slug: 'lavasan-villa',
          status: 'published',
          excerpt: 'طراحی و اجرای مبلمان سفارشی یک ویلای معاصر.',
          description: 'روایت هماهنگی چوب طبیعی با نور و معماری پروژه.',
          data: {
            client: 'خصوصی',
            location: 'لواسان',
            year: '۱۴۰۴',
            area: 480,
            services: ['طراحی داخلی', 'ساخت سفارشی'],
          },
          publishedAt: new Date('2026-07-10'),
        },
        {
          kind: 'collection',
          title: 'کالکشن زیست',
          slug: 'zist-collection',
          status: 'draft',
          excerpt: 'مجموعه‌ای با تمرکز بر فرم‌های طبیعی و متریال صادق.',
          description:
            'داستان کالکشن زیست از طبیعت و ریتم زندگی روزمره الهام می‌گیرد.',
          data: { season: 'پاییز ۱۴۰۵', productIds: [], featured: true },
        },
      ]);
    await this.seedEditorialArticles();
    await this.seedLegacyContent('project', 'legacy-projects.json');
    await this.seedLegacyContent('material', 'legacy-materials.json');
    await this.seedMaterialSamples();
    await this.seedLegacyContent('collection', 'legacy-collections.json');
    await this.seedPageData(
      'stores',
      'legacy-stores.json',
      'شعب و نمایندگی‌ها',
    );
    await this.seedPageData(
      'work-areas',
      'legacy-work-areas.json',
      'حوزه‌های کاری',
    );
    await this.seedPageData('gallery', 'legacy-gallery.json', 'گالری');
    await this.seedPageData('nav', 'legacy-nav.json', 'ناوبری و هویت برند');
    await this.seedPageData('interior', 'legacy-interior.json', 'معماری داخلی');
    await this.seedPageData(
      'contact-forms',
      'legacy-contact-forms.json',
      'فرم‌های تماس',
    );
    await this.migrateProjectContentModels();
  }

  assertKind(kind: string): CmsEntryKind {
    if (!validKinds.includes(kind as CmsEntryKind))
      throw new BadRequestException('Unsupported CMS entry kind');
    return kind as CmsEntryKind;
  }

  async list(
    kindValue: string,
    query?: string,
    status?: string,
    limitValue?: string,
  ) {
    const kind = this.assertKind(kindValue);
    const filter: Record<string, unknown> = { kind };
    if (status && ['draft', 'published', 'archived'].includes(status))
      filter.status = status;
    if (query?.trim())
      filter.$or = [
        { title: { $regex: query.trim(), $options: 'i' } },
        { slug: { $regex: query.trim(), $options: 'i' } },
        { tags: { $in: [new RegExp(query.trim(), 'i')] } },
      ];
    const limit = Math.min(Math.max(Number(limitValue) || 100, 1), 250);
    const [items, total] = await Promise.all([
      this.entryModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .lean()
        .exec(),
      this.entryModel.countDocuments(filter),
    ]);
    return { items, total };
  }

  async get(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const lookup = Types.ObjectId.isValid(id)
      ? { _id: id, kind }
      : { slug: id, kind };
    const entry = await this.entryModel.findOne(lookup).lean().exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async create(kindValue: string, input: EntryInput) {
    const kind = this.assertKind(kindValue);
    if (!input.title?.trim())
      throw new BadRequestException('Title is required');
    const slug = this.normalizeSlug(input.slug || input.title);
    try {
      const created = await this.entryModel.create(
        this.normalizeKindData(kind, this.sanitizeInput({ ...input, kind, slug })),
      );
      if (kind === 'project') await this.capFeaturedProjects(String(created._id));
      return created;
    } catch (error: any) {
      if (error?.code === 11000)
        throw new BadRequestException('Slug already exists');
      throw error;
    }
  }

  async update(kindValue: string, id: string, input: EntryInput) {
    const kind = this.assertKind(kindValue);
    const update = this.normalizeKindData(kind, this.sanitizeInput(input));
    if (input.slug) {
      const nextSlug = this.normalizeSlug(input.slug);
      const current = await this.entryModel
        .findOne({ _id: id, kind })
        .select({ slug: 1, data: 1 })
        .lean()
        .exec();
      if (!current) throw new NotFoundException('CMS entry not found');
      update.slug = nextSlug;
      if (kind === 'project' && current.slug !== nextSlug) {
        const currentData = (
          current.data && typeof current.data === 'object' ? current.data : {}
        ) as Record<string, unknown>;
        const aliases = Array.isArray(currentData.previousSlugs)
          ? currentData.previousSlugs.filter(
              (value): value is string => typeof value === 'string',
            )
          : [];
        update.data = {
          ...currentData,
          ...(input.data || {}),
          previousSlugs: [...new Set([...aliases, current.slug])].slice(-10),
        };
      }
    }
    this.normalizeKindData(kind, update);
    const entry = await this.entryModel
      .findOneAndUpdate({ _id: id, kind }, update, {
        new: true,
        runValidators: true,
      })
      .lean()
      .exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    if (kind === 'project') {
      await this.capFeaturedProjects(id);
      const refreshed = await this.entryModel.findOne({ _id: id, kind }).lean().exec();
      return refreshed || entry;
    }
    return entry;
  }

  async publish(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel
      .findOneAndUpdate(
        { _id: id, kind },
        { status: 'published', publishedAt: new Date() },
        { new: true },
      )
      .lean()
      .exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async archive(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel
      .findOneAndUpdate(
        { _id: id, kind },
        { status: 'archived' },
        { new: true },
      )
      .lean()
      .exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return entry;
  }

  async remove(kindValue: string, id: string) {
    const kind = this.assertKind(kindValue);
    const entry = await this.entryModel
      .findOneAndDelete({ _id: id, kind })
      .lean()
      .exec();
    if (!entry) throw new NotFoundException('CMS entry not found');
    return { ok: true };
  }

  async publicList(kindValue: string, slug?: string) {
    const kind = this.assertKind(kindValue);
    if (slug) return this.getPublished(kind, slug);
    return this.entryModel
      .find({ kind, status: 'published' })
      .sort({ publishedAt: -1 })
      .lean()
      .exec();
  }

  async taxonomy(kindValue: string) {
    const kind = this.assertKind(kindValue);
    const [categories, tags] = await Promise.all([
      this.entryModel.aggregate([
        { $match: { kind } },
        { $project: { value: '$data.category' } },
        { $match: { value: { $type: 'string', $ne: '' } } },
        { $group: { _id: '$value' } },
        { $sort: { _id: 1 } },
      ]),
      this.entryModel.aggregate([
        { $match: { kind } },
        { $unwind: '$tags' },
        { $match: { tags: { $type: 'string', $ne: '' } } },
        { $group: { _id: '$tags' } },
        { $sort: { _id: 1 } },
      ]),
    ]);
    return {
      categories: categories.map((item) => item._id),
      tags: tags.map((item) => item._id),
    };
  }

  async seedEditorialArticles() {
    const filePath = join(
      process.cwd(),
      'src/modules/cms/data/editorial-posts.json',
    );
    try {
      const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<
        Record<string, any>
      >;
      const operations = rows
        .filter((row) => row.slug && row.title)
        .map((row) => ({
          updateOne: {
            filter: { kind: 'article', slug: row.slug },
            update: {
              $setOnInsert: {
                kind: 'article',
                title: row.title,
                slug: row.slug,
                status: 'published',
                excerpt: row.excerpt || '',
                content: Array.isArray(row.content)
                  ? row.content
                      .map((block: { text?: string }) => block.text || '')
                      .filter(Boolean)
                      .join('\n\n')
                  : String(row.content || ''),
                images: row.coverImage ? [row.coverImage] : [],
                seo: {
                  title: row.title,
                  description: row.metaDescription || '',
                },
                data: {
                  author: row.author || 'تحریریه خانه چوب و هنر',
                  category: row.category || 'مقالات آموزشی',
                  readingTime: row.readingTime || '',
                },
                tags: row.tags || [],
                publishedAt: new Date(),
              },
            },
            upsert: true,
          },
        }));
      if (operations.length)
        await this.entryModel.bulkWrite(operations as never);
    } catch (error) {
      console.warn(
        '[cms] editorial seed skipped:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async seedLegacyContent(kind: CmsEntryKind, filename: string) {
    const filePath = join(process.cwd(), `src/modules/cms/data/${filename}`);
    try {
      const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<
        Record<string, any>
      >;
      const operations = rows
        .filter((row) => row.slug && (row.title || row.name || row.label))
        .map((row) => {
          const title = String(row.title || row.name || row.label);
          const images = [
            row.image,
            ...(Array.isArray(row.featuredImages) ? row.featuredImages : []),
            ...(Array.isArray(row.gallery)
              ? row.gallery.map((item: any) =>
                  typeof item === 'string' ? item : item?.src,
                )
              : []),
            ...(Array.isArray(row.sections)
              ? row.sections.map((item: any) => item?.image)
              : []),
          ]
            .filter(
              (image): image is string =>
                typeof image === 'string' && image.length > 0,
            )
            .filter((image, index, all) => all.indexOf(image) === index);
          return {
            updateOne: {
              filter: { kind, slug: row.slug },
              update: {
                $setOnInsert: {
                  kind,
                  title,
                  slug: row.slug,
                  status: 'published',
                  excerpt:
                    row.excerpt || row.summary || row.shortDescription || '',
                  description: row.description || row.longDescription || '',
                  content: row.description || row.longDescription || '',
                  images,
                  data: row,
                  tags: Array.isArray(row.tags)
                    ? row.tags
                    : Array.isArray(row.scope)
                      ? row.scope
                      : [],
                  publishedAt: new Date(),
                },
              },
              upsert: true,
            },
          };
        });
      if (operations.length)
        await this.entryModel.bulkWrite(operations as never);
    } catch (error) {
      console.warn(
        `[cms] ${kind} seed skipped:`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async seedMaterialSamples() {
    const filePath = join(
      process.cwd(),
      'src/modules/cms/data/material-samples.json',
    );
    try {
      const rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<{
        slug: string;
        title: string;
        family?: string;
        color?: string;
        hex?: string;
        image?: string;
        excerpt?: string;
      }>;
      const operations = rows
        .filter((row) => row.slug && row.title)
        .map((row) => ({
          updateOne: {
            filter: { kind: 'material', slug: row.slug },
            update: {
              $setOnInsert: {
                kind: 'material',
                title: row.title,
                slug: row.slug,
                status: 'published',
                excerpt: row.excerpt || '',
                description: row.excerpt || '',
                images: row.image ? [row.image] : [],
                data: {
                  family: row.family || '',
                  color: row.color || '',
                  hex: row.hex || '',
                  image: row.image || '',
                  sample: true,
                },
                tags: row.family ? [row.family] : [],
                publishedAt: new Date(),
              },
            },
            upsert: true,
          },
        }));
      if (operations.length)
        await this.entryModel.bulkWrite(operations as never);
    } catch (error) {
      console.warn(
        '[cms] material samples seed skipped:',
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async seedPageData(slug: string, filename: string, title: string) {
    const filePath = join(process.cwd(), `src/modules/cms/data/${filename}`);
    try {
      const data = JSON.parse(readFileSync(filePath, 'utf8'));
      await this.entryModel
        .updateOne(
          { kind: 'page', slug },
          {
            $setOnInsert: {
              kind: 'page',
              slug,
              title,
              status: 'published',
              content: '',
              data: { items: data },
              tags: [],
              publishedAt: new Date(),
            },
          },
          { upsert: true },
        )
        .exec();
    } catch (error) {
      console.warn(
        `[cms] page seed skipped (${slug}):`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  private async getPublished(kind: CmsEntryKind, slug: string) {
    const entry = await this.entryModel
      .findOne({
        kind,
        status: 'published',
        $or: [{ slug }, { 'data.previousSlugs': slug }],
      })
      .lean()
      .exec();
    if (!entry) throw new NotFoundException('Published entry not found');
    return entry;
  }

  private normalizeSlug(value: string) {
    return (
      value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `entry-${Date.now()}`
    );
  }

  private extractProductSlugs(data: Record<string, unknown>): string[] {
    const collected: string[] = [];
    const take = (value: unknown) => {
      if (!value) return;
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim())
            collected.push(item.trim());
          else if (item && typeof item === 'object') {
            const record = item as Record<string, unknown>;
            const slug = record.productSlug || record.slug;
            if (typeof slug === 'string' && slug.trim())
              collected.push(slug.trim());
          }
        }
        return;
      }
      if (typeof value === 'string' && value.trim()) {
        collected.push(
          ...value
            .split(/[,،]/)
            .map((item) => item.trim())
            .filter(Boolean),
        );
      }
    };
    take(data.productSlugs);
    take(data.productIds);
    take(data.products);
    take(data.heroMarkers);
    return [...new Set(collected)];
  }

  private async migrateProjectContentModels() {
    const filePath = join(
      process.cwd(),
      'src/modules/cms/data/legacy-projects.json',
    );
    let rows: Array<Record<string, unknown>> = [];
    try {
      rows = JSON.parse(readFileSync(filePath, 'utf8')) as Array<
        Record<string, unknown>
      >;
    } catch {
      return;
    }
    const bySlug = new Map(
      rows
        .filter((row) => typeof row.slug === 'string' && row.slug)
        .map((row) => [String(row.slug), row]),
    );
    const projects = await this.entryModel.find({ kind: 'project' }).exec();
    for (const project of projects) {
      const data =
        project.data && typeof project.data === 'object' && !Array.isArray(project.data)
          ? { ...(project.data as Record<string, unknown>) }
          : {};
      const legacy = bySlug.get(project.slug) || {};
      const slugs = this.extractProductSlugs({ ...legacy, ...data });
      if (slugs.length && (!Array.isArray(data.productSlugs) || !data.productSlugs.length)) {
        data.productSlugs = slugs;
        data.productIds = slugs;
      }
      if (data.featured === undefined && typeof legacy.featured === 'boolean') {
        data.featured = legacy.featured;
      }
      const existingImages = Array.isArray(data.featuredImages)
        ? data.featuredImages.filter(
            (image): image is string => typeof image === 'string' && image.length > 0,
          )
        : [];
      if (!existingImages.length && Array.isArray(legacy.featuredImages)) {
        data.featuredImages = legacy.featuredImages
          .filter((image): image is string => typeof image === 'string' && image.length > 0)
          .slice(0, 2);
      }
      project.set('data', data);
      await project.save();
    }
    const featured = await this.entryModel
      .find({ kind: 'project', 'data.featured': true })
      .sort({ updatedAt: -1 })
      .select({ _id: 1 })
      .lean()
      .exec();
    if (featured.length > 2) {
      await this.entryModel.updateMany(
        { _id: { $in: featured.slice(2).map((entry) => entry._id) } },
        { $set: { 'data.featured': false } },
      );
    }
  }

  private async capFeaturedProjects(keepId: string) {
    const keep = await this.entryModel.findById(keepId).lean().exec();
    const data =
      keep?.data && typeof keep.data === 'object' && !Array.isArray(keep.data)
        ? (keep.data as Record<string, unknown>)
        : {};
    if (!data.featured) return;
    const others = await this.entryModel
      .find({
        kind: 'project',
        _id: { $ne: keepId },
        'data.featured': true,
      })
      .sort({ updatedAt: -1 })
      .select({ _id: 1 })
      .lean()
      .exec();
    const extras = others.slice(1);
    if (!extras.length) return;
    await this.entryModel.updateMany(
      { _id: { $in: extras.map((entry) => entry._id) } },
      { $set: { 'data.featured': false } },
    );
  }

  private normalizeKindData(
    kind: CmsEntryKind,
    allowed: Record<string, unknown>,
  ) {
    if (kind !== 'project') return allowed;
    if (
      !allowed.data ||
      typeof allowed.data !== 'object' ||
      Array.isArray(allowed.data)
    )
      return allowed;
    const data = allowed.data as Record<string, unknown>;
    const next = { ...data, productSlugs: this.extractProductSlugs(data) };
    if (data.featured !== undefined) next.featured = Boolean(data.featured);
    if (Array.isArray(data.featuredImages)) {
      next.featuredImages = data.featuredImages
        .filter((image): image is string => typeof image === 'string' && image.length > 0)
        .slice(0, 2);
    }
    allowed.data = next;
    return allowed;
  }

  private sanitizeInput(input: EntryInput & { kind?: CmsEntryKind }) {
    const allowed: Record<string, unknown> = {};
    const keys = [
      'kind',
      'title',
      'slug',
      'status',
      'excerpt',
      'description',
      'content',
      'images',
      'seo',
      'data',
      'tags',
      'publishedAt',
    ];
    for (const key of keys)
      if ((input as Record<string, unknown>)[key] !== undefined)
        allowed[key] = (input as Record<string, unknown>)[key];
    if (
      allowed.status &&
      !['draft', 'published', 'archived'].includes(
        allowed.status as CmsEntryStatus,
      )
    )
      allowed.status = 'draft';
    return allowed;
  }
}
