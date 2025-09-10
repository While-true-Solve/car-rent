import { Module } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { PenaltyController } from './penalty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Penalty } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([Penalty])],
  controllers: [PenaltyController],
  providers: [PenaltyService ],
})
export class PenaltyModule {}
