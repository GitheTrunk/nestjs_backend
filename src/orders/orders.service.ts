import { Inject, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { NotificationsService } from '../notifications/notifications.service';

type OrdersClient = {
  emit: (pattern: string, payload: unknown) => unknown;
};

@Injectable()
export class OrdersService {
  constructor(
    @Optional()
    @Inject('ORDERS_SERVICE')
    private readonly client: OrdersClient | null,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateOrderDto) {
    const order = this.orderRepository.create({
      orderedAt: new Date(dto.orderedAt),
      customerName: dto.customerName,
      quantity: dto.quantity,
      totalAmount: dto.totalAmount,
      status: dto.status,
    });

    const savedOrder = await this.orderRepository.save(order);
    this.createOrder(savedOrder);
    return savedOrder;
  }

  createOrder(orderDto: any) {
    this.client?.emit('order_created', {
      order: orderDto,
      createdAt: new Date().toISOString(),
    });

    this.notifications.notify('order_created', {
      order: orderDto,
    });

    return { status: 'Order accepted', order: orderDto };
  }

  async findAll() {
    return this.orderRepository.find({ order: { orderedAt: 'DESC' } });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (dto.orderedAt !== undefined) {
      order.orderedAt = new Date(dto.orderedAt);
    }
    if (dto.customerName !== undefined) {
      order.customerName = dto.customerName;
    }
    if (dto.quantity !== undefined) {
      order.quantity = dto.quantity;
    }
    if (dto.totalAmount !== undefined) {
      order.totalAmount = dto.totalAmount;
    }
    if (dto.status !== undefined) {
      order.status = dto.status;
    }

    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.orderRepository.delete(id);
    return { deleted: true, orderId: id };
  }
}
