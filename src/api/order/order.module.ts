import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car, Customer, Order } from 'src/core';

@Module({
  imports : [TypeOrmModule.forFeature([Order, Customer, Car])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
