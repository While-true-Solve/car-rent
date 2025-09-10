import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Payment } from 'src/core';
import type { PaymentRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentService extends BaseService<CreatePaymentDto, UpdatePaymentDto, Payment> {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepo: PaymentRepository,
  ) {
    super(paymentRepo)
  }

  // Post


  // Get ..
}

