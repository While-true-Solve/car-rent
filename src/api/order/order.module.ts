import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Customer, Order } from 'src/core';
import { PenaltyModule } from '../penalty/penalty.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer, Car]), PenaltyModule],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
