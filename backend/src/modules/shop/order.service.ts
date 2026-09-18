import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ShopOrder,
  ShopOrderDocument,
  OrderStatus,
} from './schemas/shop-order.schema';
import {
  ShopInvoice,
  ShopInvoiceDocument,
} from './schemas/shop-invoice.schema';
import {
  ShopProduct,
  ShopProductDocument,
} from './schemas/shop-product.schema';
import {
  CreateOrderDto,
  MockPayDto,
  UpdateOrderStatusDto,
} from './dto/shop-order.dto';
import { CustomersService } from '../customers/customers.service';

const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'paid',
  'preparing',
  'shipping',
  'delivered',
];

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    @InjectModel(ShopOrder.name) private orderModel: Model<ShopOrderDocument>,
    @InjectModel(ShopInvoice.name)
    private invoiceModel: Model<ShopInvoiceDocument>,
    @InjectModel(ShopProduct.name)
    private productModel: Model<ShopProductDocument>,
    @Inject(forwardRef(() => CustomersService))
    private readonly customers: CustomersService,
  ) {}

  async onModuleInit() {
    await this.migrateDocumentKinds();
  }

  private async migrateDocumentKinds() {
    await this.orderModel.updateMany(
      { kind: { $exists: false }, proformaId: { $exists: true } },
      { $set: { kind: 'proforma' } },
    );
    await this.orderModel.updateMany(
      { kind: { $exists: false } },
      { $set: { kind: 'online' } },
    );
    await this.invoiceModel.updateMany(
      { kind: { $exists: false } },
      { $set: { kind: 'invoice' } },
    );
  }

  private async nextOrderNumber() {
    const count = await this.orderModel.countDocuments();
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `CH-${stamp}-${String(count + 1).padStart(4, '0')}`;
  }

  private async nextInvoiceNumber() {
    const count = await this.invoiceModel.countDocuments();
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `INV-${stamp}-${String(count + 1).padStart(4, '0')}`;
  }

  private async nextProformaNumber() {
    const count = await this.invoiceModel.countDocuments({ kind: 'proforma' });
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return `PF-${stamp}-${String(count + 1).padStart(4, '0')}`;
  }

  private storefrontHref(slug: string) {
    return `/products/${encodeURIComponent(slug)}`;
  }

  private catalogDisplayName(product: {
    name?: string;
    series?: string;
  }) {
    const name = String(product.name || '').trim();
    const series = String(product.series || '').trim();
    if (series && name && !name.includes(series)) return `${name} — کالکشن ${series}`;
    return name;
  }

  private async lookupCatalog(
    items: { productId?: string; slug?: string }[],
  ) {
    const ids = items
      .map((item) => item.productId)
      .filter((id): id is string => typeof id === "string" && Types.ObjectId.isValid(id));
    const slugs = items
      .map((item) => String(item.slug || '').trim())
      .filter(Boolean);
    const clauses = [
      ...(ids.length
        ? [{ _id: { $in: ids.map((id) => new Types.ObjectId(id)) } }]
        : []),
      ...(slugs.length ? [{ slug: { $in: slugs } }] : []),
    ];
    const products = clauses.length
      ? await this.productModel
          .find({ $or: clauses })
          .lean()
          .exec()
      : [];
    const byId = new Map(products.map((product) => [String(product._id), product]));
    const bySlug = new Map(products.map((product) => [product.slug, product]));
    return { byId, bySlug };
  }

  private mapCatalogItem<
    T extends {
      productId?: unknown;
      slug: string;
      name: string;
      image?: string;
    },
  >(
    item: T,
    catalog: {
      byId: Map<string, { slug: string; name: string; series?: string; category?: string; image?: string }>;
      bySlug: Map<string, { slug: string; name: string; series?: string; category?: string; image?: string }>;
    },
  ) {
    const product =
      (item.productId ? catalog.byId.get(String(item.productId)) : undefined) ||
      catalog.bySlug.get(item.slug);
    const slug = product?.slug || item.slug;
    return {
      ...item,
      slug,
      name: product ? this.catalogDisplayName(product) : item.name,
      image: item.image || product?.image || '',
      series: product?.series || '',
      category: product?.category || '',
      href: this.storefrontHref(slug),
      catalogMatched: Boolean(product),
    };
  }

  private async enrichItems<
    T extends { productId?: unknown; slug: string; name: string; image?: string },
  >(items: T[]) {
    if (!items.length) return items;
    const catalog = await this.lookupCatalog(
      items.map((item) => ({
        productId: item.productId ? String(item.productId) : undefined,
        slug: item.slug,
      })),
    );
    return items.map((item) => this.mapCatalogItem(item, catalog));
  }

  async presentOrder(order: ShopOrderDocument | Record<string, unknown>) {
    const plain =
      typeof (order as ShopOrderDocument).toObject === 'function'
        ? (order as ShopOrderDocument).toObject()
        : order;
    const items = Array.isArray(plain.items) ? plain.items : [];
    return { ...plain, items: await this.enrichItems(items) };
  }

  async presentInvoice(invoice: ShopInvoiceDocument | Record<string, unknown>) {
    const plain =
      typeof (invoice as ShopInvoiceDocument).toObject === 'function'
        ? (invoice as ShopInvoiceDocument).toObject()
        : invoice;
    const items = Array.isArray(plain.items) ? plain.items : [];
    return { ...plain, items: await this.enrichItems(items) };
  }

  async getPresented(id: string) {
    return this.presentOrder(await this.get(id));
  }

  async create(dto: CreateOrderDto) {
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0,
    );
    const shippingFee = dto.shippingFee ?? 0;
    const total = subtotal + shippingFee;
    const orderNumber = await this.nextOrderNumber();
    const kind =
      dto.kind || (dto.paymentMethod === 'online' ? 'online' : 'proforma');
    const paymentMethod = dto.paymentMethod || 'coordination';
    const catalog = await this.lookupCatalog(dto.items);

    const order = await this.orderModel.create({
      orderNumber,
      kind,
      status: 'pending',
      statusHistory: [
        {
          from: 'none',
          to: 'pending',
          at: new Date(),
          by: 'customer',
          note: kind === 'proforma' ? 'ثبت پیش‌فاکتور' : 'ثبت سفارش',
        },
      ],
      items: dto.items.map((item) => {
        const mapped = this.mapCatalogItem(
          {
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            image: item.image || '',
          },
          catalog,
        );
        return {
          productId:
            item.productId && Types.ObjectId.isValid(item.productId)
              ? new Types.ObjectId(item.productId)
              : undefined,
          slug: mapped.slug,
          name: mapped.name,
          image: mapped.image,
          series: mapped.series,
          category: mapped.category,
          href: mapped.href,
          qty: item.qty,
          unitPrice: item.unitPrice,
        };
      }),
      customer: dto.customer,
      shipping: dto.shipping,
      payment: { method: paymentMethod, status: 'pending' },
      amounts: { subtotal, shippingFee, total },
    });

    await this.customers.ensureLeadFromOrder({
      name: dto.customer.name,
      phone: dto.customer.phone,
      email: dto.customer.email,
      city: dto.shipping.city,
      source: kind === 'proforma' ? 'checkout-proforma' : 'checkout-online',
    });

    if (kind === 'proforma') {
      await this.issueDocument(String(order._id), 'proforma');
    }

    return this.presentOrder(await this.get(String(order._id)));
  }

  async list(query: {
    status?: string;
    q?: string;
    kind?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const clauses: Record<string, unknown>[] = [];
    if (query.status) clauses.push({ status: query.status });
    if (query.kind === 'online' || query.kind === 'proforma') {
      clauses.push({ kind: query.kind });
    }
    if (query.q?.trim()) {
      clauses.push({
        $or: [
          { orderNumber: { $regex: query.q.trim(), $options: 'i' } },
          { 'customer.phone': { $regex: query.q.trim(), $options: 'i' } },
          { 'customer.name': { $regex: query.q.trim(), $options: 'i' } },
        ],
      });
    }
    const filter = clauses.length ? { $and: clauses } : {};

    const [items, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.orderModel.countDocuments(filter),
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
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException('سفارش پیدا نشد');
    return order;
  }

  async getByNumber(orderNumber: string) {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) throw new NotFoundException('سفارش پیدا نشد');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.get(id);
    if (order.status === dto.status) return order;

    order.statusHistory.push({
      from: order.status,
      to: dto.status,
      at: new Date(),
      by: 'admin',
      note: dto.note,
    });
    order.status = dto.status;

    if (dto.status === 'paid' && order.payment.status !== 'paid') {
      order.payment.status = 'paid';
      order.payment.paidAt = new Date();
      order.payment.mockRef =
        order.payment.mockRef || `MOCK-ADMIN-${Date.now()}`;
    }

    if (dto.status === 'cancelled' && order.payment.status === 'pending') {
      order.payment.status = 'failed';
    }

    await order.save();

    return this.presentOrder(order);
  }

  async mockPay(id: string, dto: MockPayDto) {
    const order = await this.get(id);
    if (order.payment.status === 'paid') {
      return order;
    }
    if (order.status === 'cancelled') {
      throw new BadRequestException('سفارش لغو شده است');
    }

    const fail = dto.simulate === 'fail';
    if (fail) {
      order.payment.status = 'failed';
      order.statusHistory.push({
        from: order.status,
        to: order.status,
        at: new Date(),
        by: 'customer',
        note: 'پرداخت آزمایشی ناموفق',
      });
      await order.save();
      throw new BadRequestException('پرداخت آزمایشی ناموفق بود');
    }

    order.payment.status = 'paid';
    order.payment.paidAt = new Date();
    order.payment.mockRef = `MOCK-${Date.now()}`;
    order.statusHistory.push({
      from: order.status,
      to: 'paid',
      at: new Date(),
      by: 'customer',
      note: 'پرداخت آزمایشی موفق',
    });
    order.status = 'paid';
    await order.save();

    return this.get(id);
  }

  async issueInvoice(orderId: string) {
    return this.issueDocument(orderId, 'invoice');
  }

  async issueDocument(orderId: string, kind: 'invoice' | 'proforma') {
    const order = await this.get(orderId);
    const existingId = kind === 'proforma' ? order.proformaId : order.invoiceId;
    if (existingId) {
      return this.invoiceModel.findById(existingId).exec();
    }

    const invoice = await this.invoiceModel.create({
      invoiceNumber:
        kind === 'proforma'
          ? await this.nextProformaNumber()
          : await this.nextInvoiceNumber(),
      kind,
      orderId: order._id,
      orderNumber: order.orderNumber,
      issuedAt: new Date(),
      status: 'issued',
      customer: order.customer,
      shipping: {
        address: order.shipping.address,
        city: order.shipping.city,
        province: order.shipping.province,
        postalCode: order.shipping.postalCode,
      },
      items: order.items.map((item) => ({
        slug: item.slug,
        name: item.name,
        image: item.image,
        series: item.series,
        category: item.category,
        href: item.href,
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal: item.qty * item.unitPrice,
      })),
      amounts: order.amounts,
    });

    if (kind === 'proforma') {
      order.proformaId = invoice._id;
    } else {
      order.invoiceId = invoice._id;
      if (order.status === 'pending') {
        order.statusHistory.push({
          from: 'pending',
          to: 'confirmed',
          at: new Date(),
          by: 'admin',
          note: 'تبدیل سفارش به فاکتور',
        });
        order.status = 'confirmed';
      }
    }
    await order.save();
    return invoice;
  }

  async listInvoices(query: {
    page?: number;
    limit?: number;
    q?: string;
    kind?: string;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const clauses: Record<string, unknown>[] = [];
    if (query.kind === 'proforma' || query.kind === 'invoice') {
      clauses.push({ kind: query.kind });
    }
    if (query.q?.trim()) {
      clauses.push({
        $or: [
          { invoiceNumber: { $regex: query.q.trim(), $options: 'i' } },
          { orderNumber: { $regex: query.q.trim(), $options: 'i' } },
          { 'customer.phone': { $regex: query.q.trim(), $options: 'i' } },
          { 'customer.name': { $regex: query.q.trim(), $options: 'i' } },
        ],
      });
    }
    const filter = clauses.length ? { $and: clauses } : {};

    const [items, total] = await Promise.all([
      this.invoiceModel
        .find(filter)
        .sort({ issuedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec(),
      this.invoiceModel.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    };
  }

  async getInvoice(id: string) {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) throw new NotFoundException('فاکتور پیدا نشد');
    return this.presentInvoice(invoice);
  }

  async stats() {
    const [total, paid, preparing, shipping, delivered, pendingPay] =
      await Promise.all([
        this.orderModel.countDocuments(),
        this.orderModel.countDocuments({ status: 'paid' }),
        this.orderModel.countDocuments({ status: 'preparing' }),
        this.orderModel.countDocuments({ status: 'shipping' }),
        this.orderModel.countDocuments({ status: 'delivered' }),
        this.orderModel.countDocuments({ 'payment.status': 'pending' }),
      ]);

    const revenue = await this.orderModel.aggregate([
      { $match: { 'payment.status': 'paid' } },
      { $group: { _id: null, sum: { $sum: '$amounts.total' } } },
    ]);

    return {
      total,
      paid,
      preparing,
      shipping,
      delivered,
      pendingPay,
      revenue: revenue[0]?.sum || 0,
      flow: STATUS_FLOW,
    };
  }
}
