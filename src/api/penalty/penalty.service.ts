import { Injectable } from '@nestjs/common';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Order, Penalty } from 'src/core';
import type { OrderRepository, PenaltyRepository } from 'src/core';

import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class PenaltyService extends BaseService<CreatePenaltyDto, UpdatePenaltyDto, Penalty> {
  constructor(
    @InjectRepository(Penalty) private readonly penaltyRepo: PenaltyRepository,
    @InjectRepository(Order) private readonly orderRepo: OrderRepository, 
  ) {
    super(penaltyRepo)
  }

//   ///////////////////////
//   async calculateDelayedDays(orderId: number): Promise<number> {
//     // TODO: bu yerda OrderRepository orqali orderni olib kelasan
//     const order = await this.orderRepo.findOneBy({ id: String(orderId) });
//     const now = new Date();
//     const finishTime = new Date(order.finish_time);

//     if (now <= finishTime) return 0;

//     const diffMs = now.getTime() - finishTime.getTime();
//     return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
//   }

//   // Penalty yaratish
//   async createPenalty(dto: CreatePenaltyDto) {
//     const order = await this.orderRepo.findOneBy({ id: CreatePenaltyDto.order_id });
  
//     if (!order) throw new Error('Order not found');
  
//     const delayedDays = await this.calculateDelayedDays(order.id);
  
//     return this.penaltyRepo.save({
//       order, // ✅ bu joyda to‘g‘ridan-to‘g‘ri order obyektini berasan
//       penalty_day_price: dto.penalty_day_price,
//       penalty_amount: dto.penalty_day_price * delayedDays,
//       is_paid_penalty: false,
//     });
//   }
  
//   // Jarimani to‘langan deb belgilash
//   async markAsPaid(id: number) {
//     const penalty = await this.penaltyRepo.findOneBy({ id });
//     penalty.is_paid_penalty = true;
//     return this.penaltyRepo.save(penalty);
//   }


}
