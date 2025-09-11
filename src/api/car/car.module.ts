import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, Car, District } from 'src/core';
@Module({
  imports: [TypeOrmModule.forFeature([Car,Brand, District])],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService]
})
export class CarModule {}

