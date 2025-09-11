import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePenaltyDto } from './dto/create-penalty.dto';
import { UpdatePenaltyDto } from './dto/update-penalty.dto';
import { BaseService } from 'src/infrastructure/base/base.servise';
import { Order, Penalty } from 'src/core';
import type { OrderRepository, PenaltyRepository } from 'src/core';

import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PenaltyService extends BaseService<
  CreatePenaltyDto,
  UpdatePenaltyDto,
  Penalty
> {
  constructor(
    @InjectRepository(Penalty) private readonly penaltyRepo: PenaltyRepository,
    @InjectRepository(Order) private readonly orderRepo: OrderRepository,
  ) {
    super(penaltyRepo);
  }

  // Jarimani Saqlash
  async createPenaltyForOrder(createPenaltyDto: CreatePenaltyDto) {
    // 1. Orderni topib olish
    const order = await this.orderRepo.findOne({
      where: { id: createPenaltyDto.order_id },
      relations: ['penalty'], // penalty bor-yo‘qligini ham olish
    });
    if (!order) {
      throw new NotFoundException(
        `Order ${createPenaltyDto.order_id} topilmadi`,
      );
    }
    if (order.penalty) {
      throw new BadRequestException(
        `Order ${createPenaltyDto.order_id} uchun penalty allaqachon mavjud`,
      );
    }

    // 2. Hozirgi vaqt va order.finish_time ni solishtirish
    const now = new Date();
    const finishTime = new Date(order.finish_time);
    if (now <= finishTime) {
      throw new BadRequestException(
        `Order ${createPenaltyDto.order_id} vaqtida qaytarilgan, penalty kerak emas`,
      );
    }

    // 4. Necha kun kechikkanini hisoblash
    const daysLate = Math.ceil(
      (now.getTime() - finishTime.getTime()) / (1000 * 60 * 60 * 24),
    );

    // 5. Penalty summasini hisoblash
    const penaltyAmount = daysLate * Number(createPenaltyDto.penalty_day_price);

    // 6. Yangi penalty obyektini yaratish
    const penalty = this.penaltyRepo.create({
      penalty_day_price: createPenaltyDto.penalty_day_price,
      penalty_amount: penaltyAmount,
      is_paid_penalty: false,
      order: order,
    });
    // 7. Saqlash
    return await this.penaltyRepo.save(penalty);
  }

  // Jarimani to‘langan deb qayd etish va DBda saqlash
  async markAsPaid(penaltyId: string): Promise<Penalty> {
    if (!penaltyId) {
      // 1. id nul yoki bosh kelmasligini taminlaymiz
      throw new BadRequestException('Penalty id is required');
    }

    const penalty = await this.penaltyRepo.findOne({
      where: { id: penaltyId },
      relations: ['order'], // ixtiyoriy — kerak bo'lsa olib kelamiz
    });
    if (!penalty) {
      throw new NotFoundException(`Penalty with id ${penaltyId} not found`);
    }

    // 4. Agar allaqachon to'langan bo'lsa — idempotent: shu obyektni qaytaramiz
    if (penalty.is_paid_penalty) {
      return penalty;
    }

    // 5. To'lanmagan bo'lsa flagni true qilib belgilaymiz
    penalty.is_paid_penalty = true;

    // 6. Saqlaymiz (update)
    const saved = await this.penaltyRepo.save(penalty);

    // 7. Yangilangan natijani qaytaramiz
    return saved;
  }

  // Yordamchi Method: yani Penalty sumasini xisoblab beradi Order Tablesida korsatib qoyishimiz mumkin
  async calculatePenalty(
    orderId: string,
    penaltyDayPrice: number,
  ): Promise<number> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} topilmadi`);
    }

    // 2. Hozirgi vaqt va finish_time ni solishtirish
    const now = new Date();
    const finishTime = new Date(order.finish_time);

    if (now <= finishTime) {
      return 0; // ✅ vaqtida qaytarilgan bo‘lsa penalty yo‘q
    }

    // 3. Necha kun kechikkanini hisoblash
    const daysLate = Math.ceil(
      (now.getTime() - finishTime.getTime()) / (1000 * 60 * 60 * 24),
    );

    // 4. Penalty summasini qaytarish
    return daysLate * penaltyDayPrice;
  }
}
