import { Module } from '@nestjs/common';
import { AdopdetCarService } from './adopdet-car.service';
import { AdopdetCarController } from './adopdet-car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptedCar, Car, Customer, Order } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([AdoptedCar, Car, Customer, Order])],
  controllers: [AdopdetCarController],
  providers: [AdopdetCarService],
})
export class AdopdetCarModule {}
