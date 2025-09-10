import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Order } from 'src/core';
import type {OrderRepository} from '../../core/'
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from 'src/infrastructure/lib/crypto/brypt';
import { TokenService } from 'src/infrastructure/lib/token/Token';

@Injectable()
export class OrderService extends BaseService<CreateOrderDto, UpdateOrderDto, Order> {
  constructor (
    @InjectRepository(Order) private readonly orderRepo: OrderRepository,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService
  ) {
    super(orderRepo)
  }

  // Post


  // Get ..
}
