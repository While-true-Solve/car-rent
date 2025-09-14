import { Module } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { PenaltyController } from './penalty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Penalty } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([Penalty, Order])],
  controllers: [PenaltyController],
  providers: [PenaltyService],
  exports: [PenaltyService],
})
export class PenaltyModule {}
