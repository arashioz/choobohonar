import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ShopOrder, ShopOrderDocument, OrderStatus } from './schemas/shop-order.schema';
import { ShopInvoice, ShopInvoiceDocument } from './schemas/shop-invoice.schema';
import {
  CreateOrderDto,
  MockPayDto,
  UpdateOrderStatusDto,
} from './dto/shop-order.dto';

const STATUS_FLOW: OrderStatus[] = [
  'pending',
  'confirmed',
  'paid',
  'preparing',
  'shipping',
  'delivered',
];

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(ShopOrder.name) private orderModel: Model<ShopOrderDocument>,
    @InjectModel(ShopInvoice.name)
    private invoiceModel: Model<ShopInvoiceDocument>,
  ) {}

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

  async create(dto: CreateOrderDto) {
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0,
    );
    const shippingFee = dto.shippingFee ?? 0;
    const total = subtotal + shippingFee;
    const orderNumber = await this.nextOrderNumber();

    return this.orderModel.create({
      orderNumber,
      status: 'pending',
      statusHistory: [
        {
          from: 'none',
          to: 'pending',
          at: new Date(),
          by: 'customer',
          note: 'ثبت سفارش',
        },
      ],
      items: dto.items.map((item) => ({
        productId:
          item.productId && Types.ObjectId.isValid(item.productId)
            ? new Types.ObjectId(item.productId)
            : undefined,
        slug: item.slug,
        name: item.name,
        image: item.image || '',
        qty: item.qty,
        unitPrice: item.unitPrice,
      })),
      customer: dto.customer,
      shipping: dto.shipping,
      payment: { method: 'mock', status: 'pending' },
      amounts: { subtotal, shippingFee, total },
    });
  }

  async list(query: {
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.q?.trim()) {
      filter.$or = [
        { orderNumber: { $regex: query.q.trim(), $options: 'i' } },
        { 'customer.phone': { $regex: query.q.trim(), $options: 'i' } },
        { 'customer.name': { $regex: query.q.trim(), $options: 'i' } },
      ];
    }

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
      order.payment.mockRef = order.payment.mockRef || `MOCK-ADMIN-${Date.now()}`;
    }

    if (dto.status === 'cancelled' && order.payment.status === 'pending') {
      order.payment.status = 'failed';
    }

    await order.save();

    return order;
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
    const order = await this.get(orderId);
    if (order.invoiceId) {
      return this.invoiceModel.findById(order.invoiceId).exec();
    }

    const invoice = await this.invoiceModel.create({
      invoiceNumber: await this.nextInvoiceNumber(),
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
        qty: item.qty,
        unitPrice: item.unitPrice,
        lineTotal: item.qty * item.unitPrice,
      })),
      amounts: order.amounts,
    });

    order.invoiceId = invoice._id as Types.ObjectId;
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
    await order.save();
    return invoice;
  }

  async listInvoices(query: { page?: number; limit?: number; q?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const filter: Record<string, unknown> = {};
    if (query.q?.trim()) {
      filter.$or = [
        { invoiceNumber: { $regex: query.q.trim(), $options: 'i' } },
        { orderNumber: { $regex: query.q.trim(), $options: 'i' } },
        { 'customer.phone': { $regex: query.q.trim(), $options: 'i' } },
        { 'customer.name': { $regex: query.q.trim(), $options: 'i' } },
      ];
    }

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
    return invoice;
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
