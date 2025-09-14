import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Order, Payment } from 'src/core';
import type { orderRepository, PaymentRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  UpdatePaymentDto,
  Payment
> {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: PaymentRepository,
    @InjectRepository(Order) private readonly orderRepo: orderRepository,
  ) {
    super(paymentRepo);
  }

  // Payment ozini  Create qilish Tranzaksiya mavjud emas
  async createPayment(createPaymentDto: CreatePaymentDto) {
    // 1. Order mavjudligini tekshirish
    const order = await this.orderRepo.findOne({
      where: { id: createPaymentDto.order_id },
    });
    if (!order) {
      throw new HttpException('Order not found', 404);
    }

    // 2. Allaqachon to‘langanmi tekshirish
    const existingPayment = await this.getRepository.findOne({
      where: { order: { id: createPaymentDto.order_id }, payment_status: true },
    });
    if (existingPayment) {
      throw new HttpException('This order is already paid', 400);
    }

    const payment = this.getRepository.create({
      ...createPaymentDto,
      payment_date: new Date(),
      payment_status: false,
    });

    const data = await this.getRepository.save(payment);
    return { message: 'Payment created successfully', data };
  }

  // find all
  async findAllPayments() {
    return this.findAll({ relations: ['order'] });
  }
  // find by id
  async findPaymentById(id: string) {
    // return this.findOneBy({ where: { id }, relations: ['order'] });
    return this.findOneById(id, { relations: ['order'] });
  }

  // confirm   Paymentni tolanmagan bo'lganida uni To'langanga o'zgartirish
  async confirmPayment(id: string) {
    const payment = await this.findOneById(id);
    if (!payment) throw new NotFoundException('Payment not found');

    await this.getRepository.update(id, { payment_status: true });
    const updated = await this.findOneById(id);

    return {
      message: 'Payment confirmed successfully',
      data: updated,
    };
  }
}
